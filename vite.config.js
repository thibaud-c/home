import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Changed from '/' to './' for relative paths
  json: {
    stringify: false // This ensures JSON is imported as an object, not stringified
  },
  build: {
    assetsDir: 'assets',
    // Increase the warning limit to 600kB
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Ensure assets are placed in the correct directory
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/json/i.test(ext)) {
            return `assets/perso_data/[name][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Copy assets directory to dist
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'assets': resolve(__dirname, 'src/assets')
    }
  },
  // Configure asset handling
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.json']
})
