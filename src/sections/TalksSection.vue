<script setup>
import { ref } from 'vue';
import { useSectionData } from '../composables/useSectionData';
import FadeIn from '../components/FadeIn.vue';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

// Group talks by year and create ordered year list
const defaultData = {
  title: "Talks & Presentations",
  colorAccent: "#e74c3c",
  items: []
};
const orderedYears = ref([]);
const talksByYear = ref({});

// Process talks data
const processTalks = (fetchedData) => {
  if (!fetchedData.items) return;
  
  const grouped = {};
  
  // Group talks by year
  fetchedData.items.forEach((talk, index) => {
    // Extract year from date string
    const year = talk.date ? talk.date.toString().match(/\d{4}/)[0] : 'Unknown';
    
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push({...talk, tempId: index});
  });
  
  // Create an ordered array of years (newest first)
  const years = Object.keys(grouped).sort((a, b) => b - a);
  
  // Update the refs
  orderedYears.value = years;
  talksByYear.value = grouped;
};

const { data: talksData, loading, error } = useSectionData('talks', defaultData, processTalks);

</script>

<template>
  <div class="talks-section py-12 px-4">
    <h2 class="text-2xl font-light mb-2 tracking-wide" :style="{ color: talksData.colorAccent }">
      {{ talksData.title }}
    </h2>
    <p class="text-xs font-light opacity-60 mb-8">★ indicates invited talk/presentation</p>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!talksData.items || talksData.items.length === 0" class="empty-state">
      No talks available.
    </div>
    <div v-else class="talks-by-year">
      <!-- Loop through each year using the ordered array -->
      <div v-for="year in orderedYears" :key="year" class="year-section mb-10">
        <h3 class="text-base font-light mb-4 year-heading" :style="{ borderColor: talksData.colorAccent }">
          {{ year }}
        </h3>
        
        <!-- List layout for talks -->
        <div class="talks-list">
          <div v-for="(talk, index) in talksByYear[year]" :key="talk.tempId" class="talk-item mb-6 p-4 -ml-4 rounded-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-border/30 hover:bg-card/50 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-md">
            <FadeIn :delay="index * 50">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="talk-type text-xs font-light" 
                        :class="{'invited': talk.invited}"
                        :style="talk.invited ? { color: talksData.colorAccent } : {}">
                    {{ talk.type }}
                    <span v-if="talk.invited" class="invited-badge ml-1">★</span>
                  </span>
                </div>
                
                <h4 class="text-base font-normal mb-1">{{ talk.title }}</h4>
                
                <div class="flex items-center gap-3 text-xs font-light opacity-60 mb-1">
                  <span>{{ talk.event }}</span>
                </div>
                
                <p class="text-xs font-light opacity-50">{{ talk.location }}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
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

.talk-item {
  position: relative;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.talk-item::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0.5rem;
  width: 2px;
  height: 1rem;
  background-color: v-bind('talksData.colorAccent');
}

.talk-type {
  opacity: 0.7;
  letter-spacing: 0.02em;
}

.talk-type.invited {
  font-weight: 400;
  opacity: 0.9;
}

.invited-badge {
  font-size: 0.75rem;
}

@media (min-width: 768px) {
  .talks-list {
    padding-left: 1rem;
  }
}
</style>