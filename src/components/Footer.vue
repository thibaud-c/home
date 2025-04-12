<script setup>
import { ref, onMounted } from 'vue';

const currentYear = new Date().getFullYear();
const socialLinks = ref([
  { name: 'GitHub', url: 'https://github.com/thibaud-c', icon: 'i-mdi-github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/thibaud-chassin', icon: 'i-mdi-linkedin' },
]);
</script>

<template>
  <footer class="footer-section py-8 px-4 mt-12 border-t border-gray-100">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-xs font-light opacity-60 mb-4 md:mb-0">
          © {{ currentYear }} - Made with ❤️ by Thibaud Chassin
        </div>
        
        <div class="social-links flex gap-4">
          <a v-for="link in socialLinks" 
             :key="link.name" 
             :href="link.url" 
             target="_blank" 
             rel="noopener noreferrer"
             class="social-link text-xs font-light opacity-60 hover:opacity-100 transition-opacity">
            {{ link.name }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-section {
  background-color: transparent;
}

.social-link {
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  .footer-section {
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>