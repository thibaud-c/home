<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const open = ref(false);
const active = ref("home");
const items = [
  "about",
  "research",
  "publications",
  "supervision",
  "teaching",
  "talks",
];
let observer;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) active.value = entry.target.id;
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  document
    .querySelectorAll("main > section")
    .forEach((section) => observer.observe(section));
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
  <header class="site-header" @keydown.esc="open = false">
    <nav class="page-shell nav-inner" aria-label="Main navigation">
      <a
        href="#home"
        class="wordmark"
        aria-label="Thibaud Chassin — home"
        @click="open = false"
        ><span class="brand-icon" aria-hidden="true">✳</span> thibaud
        chassin<span class="cyan">.</span></a
      >
      <button
        class="menu-toggle"
        :aria-expanded="open"
        aria-controls="nav-links"
        @click="open = !open"
      >
        {{ open ? "Close −" : "Menu +" }}
      </button>
      <div id="nav-links" class="nav-links" :class="{ open }">
        <a
          v-for="item in items"
          :key="item"
          :href="`#${item}`"
          :aria-current="active === item ? 'location' : undefined"
          @click="open = false"
          >{{ item }}</a
        >
        <a href="#contact" class="nav-contact" @click="open = false"
          >Let’s talk <span aria-hidden="true">↗</span></a
        >
      </div>
    </nav>
  </header>
</template>
