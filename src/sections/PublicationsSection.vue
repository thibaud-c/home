<script setup>
import { ref } from 'vue';
import { useSectionData } from '../composables/useSectionData';
import FadeIn from '../components/FadeIn.vue';

// Import all illustration images dynamically
const illustrationImages = import.meta.glob('../assets/illustrations/*.png', { eager: true, import: 'default' });

// Function to resolve image path
const getImageUrl = (imgPath) => {
  if (!imgPath) return null;
  
  // Extract just the filename from the path
  const filename = imgPath.split('/').pop();
  const key = `../assets/illustrations/${filename}`;
  
  return illustrationImages[key] || imgPath;
};

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

// Group publications by year and create ordered year list
const defaultData = {
  title: "Publications",
  colorAccent: "#2980b9",
  items: []
};
const orderedYears = ref([]);
const publicationsByYear = ref({});

// Process publications data
const processPublications = (fetchedData) => {
  if (!fetchedData.items) return;
  
  const grouped = {};
  
  // Group publications by year
  fetchedData.items.forEach((pub, index) => {
    const year = pub.year || 'Unknown';
    if (!grouped[year]) {
      grouped[year] = [];
    }
    // Add the index as a temporary id for the key in the template
    grouped[year].push({...pub, tempId: index});
  });
  
  // Create an ordered array of years (newest first)
  const years = Object.keys(grouped).sort((a, b) => b - a);
  
  // Update the refs
  orderedYears.value = years;
  publicationsByYear.value = grouped;
};

const { data: publicationsData, loading, error } = useSectionData('publications', defaultData, processPublications);

// Modal state for image preview
const selectedImage = ref(null);

const openImageModal = (imagePath) => {
  selectedImage.value = imagePath;
  document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
  selectedImage.value = null;
  document.body.style.overflow = '';
};

</script>

<template>
  <div class="publications-section py-12 px-4">
    <h2 class="text-2xl font-light mb-8 tracking-wide" :style="{ color: publicationsData.colorAccent }">
      {{ publicationsData.title }}
    </h2>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!publicationsData.items || publicationsData.items.length === 0" class="empty-state">
      No publications available.
    </div>
    <div v-else class="publications-by-year">
      <!-- Loop through each year using the ordered array -->
      <div v-for="year in orderedYears" :key="year" class="year-section mb-10">
        <h3 class="text-base font-light mb-4 year-heading" :style="{ borderColor: publicationsData.colorAccent }">
          {{ year }}
        </h3>
        
        <!-- List layout for publications -->
        <div class="publications-list">
          <div v-for="(pub, index) in publicationsByYear[year]" :key="pub.tempId" class="publication-item mb-6 p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-border/30 hover:bg-card/50 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-lg">
            <FadeIn :delay="index * 50">
              <div class="publication-content" :class="{ 'has-image': pub.img }">
                <!-- Publication thumbnail -->
                <div v-if="pub.img" class="publication-thumbnail" @click="openImageModal(getImageUrl(pub.img))">
                  <img :src="getImageUrl(pub.img)" :alt="pub.title" class="thumbnail-img" />
                  <div class="thumbnail-overlay">
                    <span class="zoom-icon">🔍</span>
                  </div>
                </div>
                
                <!-- Publication text content -->
                <div class="publication-text">
                  <span v-if="pub.type" class="publication-type text-xs font-light mb-1" :style="{ color: publicationsData.colorAccent }">
                    {{ pub.type }}
                  </span>
                  <h4 class="text-base font-normal mb-1">{{ pub.title }}</h4>
                  
                  <p class="text-sm font-light opacity-70 mb-1">{{ pub.authors }}</p>
                  
                  <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs font-light opacity-60 mb-2">
                    <span v-if="pub.journal" class="italic">{{ pub.journal }}</span>
                    <span v-if="pub.event">{{ pub.event }}</span>
                    <span v-if="pub.venue">{{ pub.venue }}</span>
                    <span v-if="pub.volume">Vol. {{ pub.volume }}</span>
                    <span v-if="pub.issue">Issue {{ pub.issue }}</span>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-2 mt-2">
                    <span v-for="tag in pub.tags" :key="tag.name" 
                          class="tag-item text-xs"
                          :style="{ color: tag.color || publicationsData.colorAccent }">
                      {{ tag.name }}
                    </span>
                    
                    <a v-if="pub.doi" :href="'https://doi.org/' + pub.doi" target="_blank" class="text-xs border border-current px-2 py-0.5 rounded opacity-50 hover:opacity-100 transition-opacity" :style="{ color: publicationsData.colorAccent }">
                      DOI
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedImage" class="image-modal-overlay" @click="closeImageModal">
          <div class="image-modal-content" @click.stop>
            <button class="modal-close-btn" @click="closeImageModal">×</button>
            <img :src="selectedImage" alt="Publication illustration" class="modal-image" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.loading, .error, .empty-state {
  padding: 0.75rem;
  font-weight: 300;
  opacity: 0.7;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.year-heading {
  display: inline-block;
  border-bottom: 1px solid;
  padding-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.publication-item {
  position: relative;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.publication-item::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0.5rem;
  width: 2px;
  height: 1rem;
  background-color: v-bind('publicationsData.colorAccent');
}

.publication-journal {
  font-style: italic;
}

.publication-link {
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  border-bottom: 1px solid;
  padding-bottom: 1px;
  display: inline-flex;
  align-items: center;
}

.publication-link:hover {
  opacity: 1;
}

.tag-item {
  opacity: 0.7;
}

.publication-type {
  display: block;
  opacity: 0.8;
  letter-spacing: 0.02em;
}

/* Publication content layout with image */
.publication-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.publication-content.has-image {
  flex-direction: row;
  align-items: flex-start;
}

/* Thumbnail styles */
.publication-thumbnail {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 75px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.publication-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.publication-thumbnail:hover .thumbnail-img {
  transform: scale(1.1);
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.publication-thumbnail:hover .thumbnail-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 1.5rem;
  filter: grayscale(1) brightness(2);
}

.publication-text {
  flex: 1;
  min-width: 0;
}

/* Modal styles */
.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-close-btn {
  position: absolute;
  top: -1rem;
  right: -1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #333;
}

.modal-close-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .image-modal-content,
.modal-leave-active .image-modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .image-modal-content,
.modal-leave-to .image-modal-content {
  transform: scale(0.9);
}

@media (min-width: 768px) {
  .publications-list {
    padding-left: 1rem;
  }
  
  .publication-thumbnail {
    width: 120px;
    height: 90px;
  }
}
</style>