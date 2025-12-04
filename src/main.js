import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Import IBM Plex Mono font
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/700.css'

// Import Inter font
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
