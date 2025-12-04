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
  title: "Supervision",
  colorAccent: "#9b59b6",
  "PhD Theses": [],
  "Master Theses": [],
  "Bachelor Theses": []
};

const { data: supervisionData, loading, error } = useSectionData('supervision', defaultData);
</script>

<template>
  <div class="supervision-section py-12 px-4">
    <h2 class="text-2xl font-light mb-8 tracking-wide" :style="{ color: supervisionData.colorAccent }">
      {{ supervisionData.title }}
    </h2>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="supervision-content">
      
      <div v-for="(theses, category) in supervisionData" :key="category" class="mb-10">
        <div v-if="Array.isArray(theses) && theses.length > 0">
          <FadeIn>
            <h3 class="text-lg font-light mb-4 opacity-80 border-b border-gray-200 dark:border-gray-700 pb-2">
              {{ category }}
            </h3>
          </FadeIn>
          
          <div class="theses-list">
            <div v-for="(thesis, index) in theses" :key="index" class="thesis-item mb-6 p-4 -ml-4 rounded-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-border/30 hover:bg-card/50 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-md">
              <FadeIn :delay="index * 100">
                <div>
                  <h4 class="text-base font-normal mb-1">{{ thesis.title }}</h4>
                  
                  <div class="flex items-center gap-3 text-xs font-light opacity-60 mb-1">
                    <span class="font-medium" :style="{ color: supervisionData.colorAccent }">
                      {{ thesis.student || thesis.Student }}
                    </span>
                    <span v-if="thesis.defense">{{ thesis.defense }}</span>
                  </div>
                  
                  <div v-if="thesis.ongoing" class="mt-2">
                    <span class="text-xs px-2 py-0.5 rounded border border-opacity-30"
                          :style="{ borderColor: supervisionData.colorAccent, color: supervisionData.colorAccent }">
                      Ongoing
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
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

.supervision-content {
  line-height: 1.6;
}

.thesis-item {
  position: relative;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.thesis-item::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0.5rem;
  width: 2px;
  height: 1rem;
  background-color: v-bind('supervisionData.colorAccent');
}

.student-name {
  font-style: italic;
}
</style>
