<script setup>
import about from "../assets/perso_data/about.json";
import cv from "../assets/Tibo_cv.pdf";
</script>
<template>
  <div class="section-heading">
    <p class="eyebrow pink">01 / ABOUT</p>
    <h2>Geography is about people, too.</h2>
  </div>
  <div class="about-layout">
    <p class="large-copy">
      I work at the intersection of
      <span class="cyan">geospatial technology</span> and
      <span class="pink">public participation</span> — making complex places
      easier to understand, discuss and shape together.
    </p>
    <div>
      <p class="muted">{{ about.workingGroup }}<br />{{ about.institute }}</p>
      <a
        :href="about.universityUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
        >{{ about.university }} ↗</a
      >
      <div class="about-actions">
        <a class="button" :href="cv" target="_blank" rel="noopener noreferrer"
          >Download CV ↗</a
        ><a class="text-link" :href="`mailto:${about.email}`"
          >Get in touch ↗</a
        >
      </div>
    </div>
  </div>
  <div class="about-details">
    <details v-for="item in about['question&answer']" :key="item.question">
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </div>
</template>
