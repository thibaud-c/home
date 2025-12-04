<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 600
  },
  direction: {
    type: String,
    default: 'up', // 'up', 'down', 'left', 'right', 'none'
    validator: (value) => ['up', 'down', 'left', 'right', 'none'].includes(value)
  },
  distance: {
    type: Number,
    default: 20
  },
  threshold: {
    type: Number,
    default: 0.1
  }
});

const target = ref(null);
const isVisible = ref(false);

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true;
    }
  },
  {
    threshold: props.threshold,
    triggerOnce: true
  }
);

const getInitialTransform = () => {
  if (!props.direction || props.direction === 'none') return 'none';
  
  switch (props.direction) {
    case 'up': return `translateY(${props.distance}px)`;
    case 'down': return `translateY(-${props.distance}px)`;
    case 'left': return `translateX(${props.distance}px)`;
    case 'right': return `translateX(-${props.distance}px)`;
    default: return 'none';
  }
};
</script>

<template>
  <div 
    ref="target"
    class="fade-in-element"
    :style="{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : getInitialTransform(),
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.fade-in-element {
  will-change: opacity, transform;
}
</style>
