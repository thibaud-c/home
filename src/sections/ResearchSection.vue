<script setup>
import { useSectionData } from '../composables/useSectionData';

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
      <div v-if="researchData.projects && researchData.projects.length > 0" class="research-projects mb-10">
        <div v-for="(project, index) in researchData.projects" :key="index" class="project-item mb-8">
          <div class="project-header flex flex-wrap items-baseline justify-between mb-2">
            <h3 class="text-lg font-normal">{{ project.name }}</h3>
            <span class="project-dates text-sm font-light opacity-70">
              {{ project.dateStart }} – {{ project.dateEnd || 'Present' }}
            </span>
          </div>
          
          <div class="project-funding text-sm font-light opacity-80 mb-2">
            <span class="funding-label">Funding:</span> {{ project.funding }}
          </div>
          
          <p class="project-goal text-base font-light opacity-80 leading-relaxed">
            {{ project.goal }}
          </p>
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