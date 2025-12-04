<script setup>
import { useSectionData } from '../composables/useSectionData';
import FadeIn from '../components/FadeIn.vue';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

const defaultData = {
  title: "Research Projects",
  colorAccent: "#E7A454",
  projects: [],
  interests: []
};

const { data: researchData, loading, error } = useSectionData('research', defaultData);
</script>

<template>
  <div class="research-section py-12 px-4">
    <h2 class="text-2xl font-light mb-8 tracking-wide" :style="{ color: researchData.colorAccent }">
      {{ researchData.title }}
    </h2>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="research-content">
      <!-- Research Projects -->
      <div v-if="researchData.projects && researchData.projects.length > 0" class="projects-list">
        <div v-for="(project, index) in researchData.projects" :key="index" class="project-item mb-12 p-4 -ml-4 rounded-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-border/30 hover:bg-card/50 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-md">
          <FadeIn :delay="index * 100">
            <div>
              <div class="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                <h3 class="text-xl font-normal">{{ project.name }}</h3>
                <span class="text-sm font-light opacity-60">
                  {{ project.dateStart }} - {{ project.dateEnd || 'Present' }}
                </span>
              </div>
              
              <p v-if="project.funding" class="text-sm font-light opacity-70 mb-3 italic">
                {{ project.funding }}
              </p>
              
              <p class="text-base font-light leading-relaxed opacity-90 mb-4">
                {{ project.goal }}
              </p>
              
              <div v-if="project.tags && project.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span v-for="(tag, tIndex) in project.tags" :key="tIndex" 
                      class="text-xs px-2 py-1 rounded border border-opacity-20"
                      :style="{ borderColor: researchData.colorAccent, color: researchData.colorAccent }">
                  {{ tag }}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      
      <!-- Research Interests (if still needed) -->
      <div v-if="researchData.interests && researchData.interests.length > 0" class="research-interests">
        <h3 class="text-lg font-normal mb-4">Research Interests</h3>
        <ul class="interests-list">
          <li v-for="(interest, index) in researchData.interests" :key="index" 
              class="interest-item text-base font-light opacity-80 mb-3">
            {{ interest }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading, .error {
  padding: 0.75rem;
  font-weight: 300;
  opacity: 0.7;
}

.error {
  color: #721c24;
}

.research-content {
  line-height: 1.8;
  letter-spacing: 0.01em;
}

/* Project styles */
.project-item {
  position: relative;
  padding-left: 1.5rem;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.project-item::before {
  content: "";
  position: absolute;
  left: -5px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: v-bind('researchData.colorAccent');
}

.funding-label {
  font-weight: 500;
  opacity: 0.9;
}

/* Interest styles (if still needed) */
.interests-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.interest-item {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
  flex: 0 0 calc(50% - 1rem);
}

.interest-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: v-bind('researchData.colorAccent');
  opacity: 0.7;
}

@media (max-width: 768px) {
  .interest-item {
    flex: 0 0 100%;
  }
}
</style>