<script setup>
import { ref, computed } from "vue";
import supervision from "../assets/perso_data/supervision.json";
const filter = ref("All");
const groups = computed(() =>
  Object.entries(supervision)
    .filter(([, value]) => Array.isArray(value))
    .map(([category, theses]) => ({
      category,
      theses: theses.filter(
        (thesis) =>
          filter.value === "All" ||
          thesis.ongoing === (filter.value === "Ongoing"),
      ),
    }))
    .filter((group) => group.theses.length),
);
const allTheses = Object.values(supervision).filter(Array.isArray).flat();
const ongoing = allTheses.filter((thesis) => thesis.ongoing).length;
</script>
<template>
  <div class="section-heading heading-with-link">
    <div>
      <p class="eyebrow cyan">04 / SUPERVISION</p>
      <p class="section-intro">
        Supporting students as they find new ways to see, analyse and shape our
        world.
      </p>
    </div>
    <p class="supervision-count">
      <strong>{{ String(ongoing).padStart(2, "0") }}</strong> ongoing
      <span>/</span>
      <strong>{{ String(allTheses.length - ongoing).padStart(2, "0") }}</strong>
      completed
    </p>
  </div>
  <div class="filters" aria-label="Filter theses">
    <button
      v-for="status in ['All', 'Ongoing', 'Completed']"
      :key="status"
      :aria-pressed="filter === status"
      @click="filter = status"
    >
      {{ status === "All" ? "All theses" : status }}
    </button>
  </div>
  <div aria-live="polite">
    <div v-for="group in groups" :key="group.category" class="thesis-group">
      <h3 class="eyebrow">{{ group.category }}</h3>
      <article
        v-for="thesis in group.theses"
        :key="thesis.student"
        class="thesis-row"
      >
        <div>
          <p class="student-name">{{ thesis.student }}</p>
          <h4>{{ thesis.title }}</h4>
        </div>
        <span
          class="status-badge"
          :class="thesis.ongoing ? 'ongoing' : 'completed'"
          >{{ thesis.ongoing ? "↗ Ongoing" : "✓ Completed" }}</span
        >
      </article>
    </div>
  </div>
</template>
