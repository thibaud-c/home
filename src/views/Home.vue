<script setup>
import HomeSection from "../sections/HomeSection.vue";
import AboutSection from "../sections/AboutSection.vue";
import ResearchSection from "../sections/ResearchSection.vue";
import PublicationsSection from "../sections/PublicationsSection.vue";
import TalksSection from "../sections/TalksSection.vue";
import TeachingSection from "../sections/TeachingSection.vue";
import SupervisionSection from "../sections/SupervisionSection.vue";
import Navigation from "../components/Navigation.vue";
import FooterSection from "../components/Footer.vue";
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <Navigation />
  <main id="main" class="page-shell">
    <section id="home"><HomeSection /></section>
    <section id="about" class="content-section"><AboutSection /></section>
    <section id="research" class="content-section"><ResearchSection /></section>
    <section id="publications" class="content-section">
      <PublicationsSection />
    </section>
    <section id="supervision" class="content-section">
      <SupervisionSection />
    </section>
    <section id="teaching" class="content-section"><TeachingSection /></section>
    <section id="talks" class="content-section"><TalksSection /></section>
  </main>
  <FooterSection />
</template>
