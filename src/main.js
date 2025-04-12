import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Import IBM Plex Mono font
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/700.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
