<script setup>
import { useSectionData } from '../composables/useSectionData';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

const defaultData = {
  title: "About Me",
  colorAccent: "#16a085",
  workingGroup: "",
  institute: "",
  university: "",
  universityUrl: "",
  "question&answer": []
};

const { data: personalInfo, loading, error } = useSectionData('about', defaultData);

</script>

<template>
  <div class="about-section py-12 px-4">
    <h2 class="text-2xl font-light mb-8 tracking-wide" :style="{ color: personalInfo.colorAccent }">
      {{ personalInfo.title }}
    </h2>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="about-content">
      <!-- Affiliation - simplified with link -->
      <div class="mb-8">
        <p class="text-base font-light mb-2 question-style">
          My Current Affiliation?
        </p>
        <p class="text-base font-light opacity-80">
          {{ personalInfo.workingGroup }}, 
          {{ personalInfo.institute }}, 
          <a v-if="personalInfo.universityUrl" 
             :href="personalInfo.universityUrl" 
             target="_blank" 
             class="transition-all hover:opacity-100"
             :style="{ 
               color: personalInfo.colorAccent,
               opacity: '0.9',
               borderBottom: '1px solid ' + personalInfo.colorAccent + '30'
             }">
            {{ personalInfo.university }}
          </a>
          <span v-else>{{ personalInfo.university }}</span>
        </p>
      </div>
      
      <!-- Q&A Section -->
      <div v-if="personalInfo['question&answer'] && personalInfo['question&answer'].length > 0" class="mb-8">
        <div v-for="(qa, index) in personalInfo['question&answer']" :key="index" class="mb-6">
          <p class="text-base font-light mb-1 question-style">
            {{ qa.question }}
          </p>
          <p class="text-base font-light opacity-80 ml-0">
            {{ qa.answer }}
          </p>
        </div>
      </div>
      
      <!-- Contact & CV -->
      <div class="mt-10 flex flex-wrap gap-6">
        <a v-if="personalInfo.email" 
           :href="'mailto:' + personalInfo.email" 
           class="inline-block py-2 transition-all hover:opacity-100"
           :style="{ 
             color: personalInfo.colorAccent,
             opacity: '0.8',
             borderBottom: '1px solid ' + personalInfo.colorAccent + '50'
           }">
          Contact
        </a>
        
        <a v-if="personalInfo.cvUrl" 
           :href="personalInfo.cvUrl" 
           target="_blank"
           class="inline-block py-2 transition-all hover:opacity-100"
           :style="{ 
             color: personalInfo.colorAccent,
             opacity: '0.8',
             borderBottom: '1px solid ' + personalInfo.colorAccent + '50'
           }">
          Download CV
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading, .error {
  padding: 0.75rem;
  font-weight: 300;
}

.loading {
  opacity: 0.6;
}

.error {
  color: #721c24;
  opacity: 0.8;
}

.about-content {
  line-height: 1.8;
  letter-spacing: 0.01em;
}

.question-style {
  color: rgba(163, 163, 163, 0.8);
  border-left: 2px solid;
  padding-left: 8px;
  border-left-color: v-bind('personalInfo.colorAccent');
}
</style>