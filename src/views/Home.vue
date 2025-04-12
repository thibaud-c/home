<script setup>
import { ref } from 'vue'
import HomeSection from '../sections/HomeSection.vue'
import AboutSection from '../sections/AboutSection.vue'

import ResearchSection from '../sections/ResearchSection.vue'
import PublicationsSection from '../sections/PublicationsSection.vue'
import TalksSection from '../sections/TalksSection.vue'
import TeachingSection from '../sections/TeachingSection.vue'
import Navigation from '../components/Navigation.vue'
import FooterSection from '../components/Footer.vue'

// Navigation function to scroll to sections
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div>
    <!-- Navigation Menu with custom dark mode background -->
    <Navigation :scrollToSection="scrollToSection" />
    
    <!-- Main Content with Sections -->
    <div class="container mx-auto px-4 pt-24">
      <section id="home" class="min-h-screen py-16">
        <HomeSection />
      </section>
      
      <section id="about" class="min-h-screen py-16">
        <AboutSection />
      </section>
      
      <section id="research" class="min-h-screen py-16">
        <ResearchSection />
      </section>
      
      <section id="publications" class="min-h-screen py-16">
        <PublicationsSection />
      </section>
      
      <section id="talks" class="min-h-screen py-16">
        <TalksSection />
      </section>
      
      <section id="teaching" class="min-h-screen py-16">
        <TeachingSection />
      </section>
    </div>
    
    <!-- Footer -->
    <FooterSection />
  </div>
</template>