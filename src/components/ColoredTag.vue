<script setup>
defineProps({
  tag: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <span 
    class="inline-block px-2 py-1 text-xs font-medium mr-2 mb-2 border rounded"
    :style="{
      color: tag.color,
      borderColor: tag.color,
      backgroundColor: 'transparent'
    }"
  >
    {{ tag.name }}
  </span>
</template>