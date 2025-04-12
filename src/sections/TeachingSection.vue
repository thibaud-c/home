<script setup>
import { useSectionData } from '../composables/useSectionData';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

const defaultData = {
  title: "Teaching",
  colorAccent: "#27ae60",
  philosophy: "",
  courses: []
};

const { data: teachingData, loading, error } = useSectionData('teaching', defaultData);

</script>

<template>
  <div class="teaching-section py-12 px-4">
    <h2 class="text-2xl font-light mb-8 tracking-wide" :style="{ color: teachingData.colorAccent }">
      {{ teachingData.title }}
    </h2>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="teaching-content">
      <div v-if="teachingData.philosophy" class="philosophy mb-8">
        <p class="text-sm font-light leading-relaxed opacity-80">{{ teachingData.philosophy }}</p>
      </div>
      
      <div v-if="!teachingData.courses || teachingData.courses.length === 0" class="empty-state">
        No courses available.
      </div>
      <div v-else class="courses-list">
        <div v-for="course in teachingData.courses" :key="course.code" class="course-item mb-6">
          <h4 class="text-base font-normal mb-1">{{ course.title }}</h4>
          
          <div class="flex items-center gap-3 text-xs font-light opacity-60 mb-1">
            <span>{{ course.code }}</span>
            <span class="course-level">{{ course.level }}</span>
            <span>{{ course.institution }}</span>
          </div>
          
          <p v-if="course.description" class="text-sm font-light opacity-70 mb-2">
            {{ course.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <div class="semesters text-xs opacity-50 font-light">
              <span v-for="(semester, idx) in course.semestersTaught" :key="idx" class="mr-2">
                {{ semester }}
              </span>
            </div>
            
            <a v-if="course.syllabusUrl" 
               :href="course.syllabusUrl" 
               target="_blank" 
               class="course-material-link text-xs flex items-center gap-1"
               :style="{ color: teachingData.colorAccent }">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Course Material</span>
            </a>
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

.teaching-content {
  line-height: 1.6;
}

.course-item {
  position: relative;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.course-level {
  font-style: italic;
}

.course-material-link {
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  border-bottom: 1px solid;
  padding-bottom: 1px;
  display: inline-flex;
  align-items: center;
}

.course-material-link:hover {
  opacity: 1;
}

@media (min-width: 768px) {
  .courses-list {
    padding-left: 1rem;
  }
}
</style>