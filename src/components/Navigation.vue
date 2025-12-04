<template>
    <nav class="fixed top-0 left-0 right-0 z-40 py-4 transition-all duration-300 bg-navbg/80 backdrop-blur-md border-b border-border/10">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <!-- Desktop Navigation -->
        <ul class="hidden md:flex space-x-6 justify-start">
          <li><a href="#home" @click.prevent="scrollToSection('home')" class="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
          <li><a href="#about" @click.prevent="scrollToSection('about')" class="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
          <li><a href="#research" @click.prevent="scrollToSection('research')" class="hover:text-blue-600 dark:hover:text-blue-400">Research</a></li>
          <li><a href="#publications" @click.prevent="scrollToSection('publications')" class="hover:text-blue-600 dark:hover:text-blue-400">Publications</a></li>
          <li><a href="#talks" @click.prevent="scrollToSection('talks')" class="hover:text-blue-600 dark:hover:text-blue-400">Talks</a></li>
          <li><a href="#teaching" @click.prevent="scrollToSection('teaching')" class="hover:text-blue-600 dark:hover:text-blue-400">Teaching</a></li>
          <li><a href="#supervision" @click.prevent="scrollToSection('supervision')" class="hover:text-blue-600 dark:hover:text-blue-400">Supervision</a></li>
        </ul>
        
        <!-- Mobile Hamburger Button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden flex items-center"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Empty div for spacing on mobile -->
        <div class="md:hidden"></div>
        
        <!-- Dark Mode Toggle Button -->
        <button 
          @click="toggleDarkMode" 
          class="p-2 bg-transparent"
          :class="isDark ? 'text-yellow-300' : 'text-gray-800'"
          style="transition: none !important; animation: none !important;"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu (Slide Down) -->
      <div 
        v-if="isMenuOpen" 
        class="md:hidden absolute top-full left-0 right-0 shadow-md transition-all duration-300 ease-in-out bg-navbg/95 backdrop-blur-md border-b border-border/10"
      >
        <ul class="py-2 px-4 space-y-3">
          <li v-for="item in menuItems" :key="item.id">
            <a 
              :href="`#${item.id}`" 
              @click.prevent="navigateAndCloseMenu(item.id)" 
              class="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isMenuOpen = ref(false);
const accentColor = ref('#3498db');
const isDark = ref(false);

// Menu items for both desktop and mobile
const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'publications', label: 'Publications' },
  { id: 'talks', label: 'Talks' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'supervision', label: 'Supervision' }
];

// Get accent color from profile data if available
onMounted(async () => {
  try {
    const response = await fetch('/perso_data/personalInfo.json');
    if (response.ok) {
      const data = await response.json();
      if (data.colorAccent) {
        accentColor.value = data.colorAccent;
      }
    }
  } catch (err) {
    console.warn('Could not load accent color');
  }
});

// Function to toggle mobile menu
const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Function to navigate and close menu
const navigateAndCloseMenu = (sectionId) => {
  scrollToSection(sectionId);
  isMenuOpen.value = false;
};

// Function to scroll to section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  } else {
    // Retry once after a short delay in case of rendering
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 300);
  }
};

// Dark mode toggle function
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  
  localStorage.setItem('darkMode', isDark.value ? 'true' : 'false');
};

// Close mobile menu when clicking outside
const closeMenuOnClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest('nav')) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside);
  
  // Check for saved preference or system preference for dark mode
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial mode based on saved preference or system preference
  isDark.value = savedMode === 'true' || (savedMode === null && prefersDark);
  document.documentElement.classList.toggle('dark', isDark.value);
  
  // Close menu when window is resized to desktop size
  window.addEventListener('resize', handleResize);
});

// Handle resize event
const handleResize = () => {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.navigation-container {
  background-color: hsl(var(--nav-bg)) !important;
  color: hsl(var(--foreground)) !important;
  border: 0 !important;
}

.nav-link {
  color: hsl(var(--foreground)) !important;
}

.mobile-menu {
  background-color: hsl(var(--nav-bg)) !important;
  border: 0 !important;
}

.nav-link:hover {
  color: var(--accent-color, #3498db) !important;
}
</style>
