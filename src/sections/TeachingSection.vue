<script setup>
import teaching from "../assets/perso_data/teaching.json";
</script>
<template>
  <div class="section-heading">
    <p class="eyebrow pink">05 / TEACHING</p>
    <h2>Learn by mapping.</h2>
    <p class="section-intro">{{ teaching.philosophy }}</p>
  </div>
  <div class="course-list">
    <article
      v-for="course in teaching.courses"
      :key="course.code"
      class="course-row"
    >
      <span class="row-year">{{ course.code }}</span>
      <div>
        <p class="eyebrow cyan">
          {{ course.level }} · {{ course.institution }}
        </p>
        <h3>{{ course.title }}</h3>
        <p class="muted">{{ course.description }}</p>
        <p class="course-years">{{ course.semestersTaught.join(" / ") }}</p>
      </div>
      <a
        v-if="course.syllabusUrl"
        :href="course.syllabusUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
        >Course material ↗</a
      >
    </article>
  </div>
</template>
