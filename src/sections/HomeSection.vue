<script setup>
import profile from "../assets/perso_data/home.json";
import AsciiGlobe from "../components/AsciiGlobe.vue";
</script>

<template>
  <div class="hero">
    <div class="hero-copy">
      <p class="eyebrow">
        <span class="status-dot"></span> GIS · DIGITAL GEOGRAPHIES ·
        PARTICIPATION
      </p>
      <h1>
        Mapping places.<br />Connecting<br /><span class="cyan"
          >perspectives</span
        ><span class="pink">.</span>
      </h1>
      <p class="hero-intro">
        I’m <strong>Thibaud Chassin</strong>, an assistant professor exploring
        how digital maps can bring people into the conversation about the places
        we share.
      </p>
      <div class="hero-actions">
        <a class="button button-primary" href="#research"
          >Explore my research <span aria-hidden="true">↗</span></a
        ><a class="text-link" href="#about"
          >A little about me <span aria-hidden="true">↓</span></a
        >
      </div>
      <p class="hero-affiliation">
        <span aria-hidden="true">⊕</span> University of Graz
        <span class="muted">/ {{ profile.location }}</span>
      </p>
    </div>
    <AsciiGlobe />
  </div>
  <div class="hero-strip">
    <span><span class="pink">01 /</span> PEOPLE + PLACES + TECHNOLOGY</span
    ><span>EXPLORING THE HUMAN SIDE OF SPATIAL DATA</span
    ><a href="#about" aria-label="Scroll to about">SCROLL TO EXPLORE ↓</a>
  </div>
</template>
