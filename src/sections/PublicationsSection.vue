<script setup>
import { ref, computed } from "vue";
import publications from "../assets/perso_data/publications.json";
const filter = ref("All");
const expanded = ref(false);
const filters = [
  "All",
  "Journal Article",
  "Conference",
  "Book Chapter",
  "Thesis",
  "Preprint",
];
const filtered = computed(() =>
  publications.items
    .filter((pub) => filter.value === "All" || pub.type.includes(filter.value))
    .sort((a, b) => b.year - a.year),
);
const visible = computed(() =>
  expanded.value ? filtered.value : filtered.value.slice(0, 5),
);
const illustrations = import.meta.glob("../assets/illustrations/*.png", {
  eager: true,
  import: "default",
});
</script>
<template>
  <div class="section-heading heading-with-link">
    <div>
      <p class="eyebrow pink">03 / PUBLICATIONS</p>
      <h2>Ideas, in the open.</h2>
    </div>
    <a
      href="https://scholar.google.com/citations?user=rf3WWQgAAAAJ&hl=en"
      class="text-link"
      target="_blank"
      rel="noopener noreferrer"
      >Google Scholar ↗</a
    >
  </div>
  <div class="filters" aria-label="Filter publications">
    <button
      v-for="type in filters"
      :key="type"
      :aria-pressed="filter === type"
      @click="
        filter = type;
        expanded = false;
      "
    >
      {{ type === "All" ? "All publications" : type }}
    </button>
  </div>
  <p class="result-count" aria-live="polite">
    {{ filtered.length }} publications · newest first
  </p>
  <div class="publication-list">
    <article v-for="pub in visible" :key="pub.title" class="publication-row">
      <span class="row-year">{{ pub.year }}</span>
      <div class="publication-body">
        <p class="eyebrow" :class="pub.year === 2026 ? 'cyan' : 'muted'">
          {{ pub.type
          }}<span v-if="pub === publications.items[0]" class="new-label"
            >LATEST</span
          >
        </p>
        <h3>
          <a
            v-if="pub.doi"
            :href="`https://doi.org/${pub.doi}`"
            target="_blank"
            rel="noopener noreferrer"
            >{{ pub.title }} <span class="cyan" aria-hidden="true">↗</span></a
          ><template v-else>{{ pub.title }}</template>
        </h3>
        <p class="authors">{{ pub.authors }}</p>
        <p class="publication-venue">
          {{ pub.journal || pub.venue || pub.event || pub.institution
          }}<template v-if="pub.volume"> · {{ pub.volume }}</template
          ><template v-if="pub.issue"> ({{ pub.issue }})</template
          ><template v-if="pub.pages"> · {{ pub.pages }}</template
          ><template v-if="pub.location"> · {{ pub.location }}</template
          ><template v-if="pub.isbn"> · ISBN {{ pub.isbn }}</template>
        </p>
        <div class="publication-tags">
          <span v-for="tag in pub.tags" :key="tag.name">{{ tag.name }}</span>
        </div>
      </div>
      <a
        v-if="pub.img"
        :href="
          illustrations[`../assets/illustrations/${pub.img.split('/').pop()}`]
        "
        target="_blank"
        rel="noopener noreferrer"
        class="publication-image"
        :aria-label="`View figure: ${pub.title}`"
        ><img
          :src="
            illustrations[`../assets/illustrations/${pub.img.split('/').pop()}`]
          "
          :alt="`Figure from ${pub.title}`"
          loading="lazy"
      /></a>
    </article>
  </div>
  <p v-if="!filtered.length" class="muted">No publications in this category.</p>
  <button
    v-if="filtered.length > 5"
    class="button show-more"
    :aria-expanded="expanded"
    @click="expanded = !expanded"
  >
    {{
      expanded
        ? "Show fewer publications −"
        : `View all ${filtered.length} publications +`
    }}
  </button>
</template>
