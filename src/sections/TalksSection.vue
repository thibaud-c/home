<script setup>
import { ref, computed } from "vue";
import talks from "../assets/perso_data/talks.json";
const expanded = ref(false);
const sorted = [...talks.items].sort(
  (a, b) => Number(b.date.slice(0, 4)) - Number(a.date.slice(0, 4)),
);
const visible = computed(() => (expanded.value ? sorted : sorted.slice(0, 3)));
</script>
<template>
  <div class="section-heading">
    <p class="eyebrow cyan">06 / TALKS</p>
    <h2>Part of the conversation.</h2>
  </div>
  <article v-for="talk in visible" :key="talk.title" class="talk-row">
    <span class="row-year">{{ talk.date }}</span>
    <div>
      <p class="eyebrow" :class="talk.invited ? 'pink' : 'muted'">
        {{ talk.type }}{{ talk.invited ? " · Invited" : "" }}
      </p>
      <h3>{{ talk.title }}</h3>
      <p class="muted">{{ talk.event }} · {{ talk.location }}</p>
    </div>
  </article>
  <button
    v-if="sorted.length > 3"
    class="button show-more"
    :aria-expanded="expanded"
    @click="expanded = !expanded"
  >
    {{ expanded ? "Show fewer talks −" : `View all ${sorted.length} talks +` }}
  </button>
</template>
