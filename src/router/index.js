import { createRouter } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: false,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // Catch-all route to redirect back to home with hash
    {
      path: '/:pathMatch(.*)*',
      redirect: to => {
        // Extract the path without leading slash
        const path = to.path.substring(1);
        // Redirect to home with hash
        return { path: '/', hash: `#${path}` };
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // Offset for fixed header
      }
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }
    }
  }
})

// Handle navigation to hash sections
router.afterEach((to) => {
  if (to.hash) {
    setTimeout(() => {
      const element = document.querySelector(to.hash);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    }, 100);
  }
});

export default router