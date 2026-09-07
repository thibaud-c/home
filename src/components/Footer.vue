<script setup>
import profile from "../assets/perso_data/home.json";
import about from "../assets/perso_data/about.json";
</script>
<template>
  <footer id="contact" class="page-shell">
    <div class="contact-block">
      <p class="eyebrow pink">LET’S CONNECT</p>
      <h2>
        Good maps start with<br />a <span class="cyan">conversation</span
        ><span class="pink">.</span>
      </h2>
      <a :href="`mailto:${about.email}`" class="contact-email"
        >{{ about.email }} ↗</a
      >
      <div class="social-links">
        <a
          v-for="link in profile.socialLinks"
          :key="link.platform"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ link.platform }} ↗</a
        >
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} Thibaud Chassin</span
      ><span>GRAZ, AUSTRIA <span class="cyan">⊕</span></span
      ><a href="#home">BACK TO TOP ↑</a>
    </div>
  </footer>
</template>
