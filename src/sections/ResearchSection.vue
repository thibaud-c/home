<script setup>
import research from "../assets/perso_data/research.json";
</script>
<template>
  <div class="section-heading">
    <p class="eyebrow cyan">02 / RESEARCH</p>
  </div>
  <div class="project-grid">
    <article
      v-for="(project, index) in research.projects"
      :key="project.name"
      class="project-card"
    >
      <div class="project-top">
        <span class="project-symbol" aria-hidden="true">{{
          ["⊕", "⌘", "◈", "⌗"][index]
        }}</span
        ><span class="eyebrow"
          >{{ project.dateStart }} — {{ project.dateEnd || "Present" }}</span
        >
      </div>
      <h3>{{ project.name }}</h3>
      <p>{{ project.goal }}</p>
      <p class="project-funding">{{ project.funding }}</p>
    </article>
  </div>
  <div class="research-tags">
    <span v-for="interest in research.interests" :key="interest">{{
      interest
    }}</span>
  </div>
</template>
