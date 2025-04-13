import { ref, onMounted } from 'vue';

/**
 * Composable for fetching section data from JSON files
 * @param {string} sectionName - The name of the section to fetch data for
 * @param {Object} defaultData - Default data structure to use before loading
 * @param {Function} [processData] - Optional function to process the data after fetching
 */
export function useSectionData(sectionName, defaultData = {}, processData = null) {
  const data = ref(defaultData);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      // Try multiple path patterns to find the JSON file
      const paths = [
        `./assets/perso_data/${sectionName}.json`,  // Production build path
        `./src/assets/perso_data/${sectionName}.json`  // Development path
      ];
      
      let jsonData = null;
      let loaded = false;
      
      // Try each path until one works
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            jsonData = await response.json();
            console.log(`Successfully loaded ${sectionName} data from ${path}:`, jsonData);
            loaded = true;
            break;
          }
        } catch (pathErr) {
          console.warn(`Failed to load from ${path}:`, pathErr.message);
          // Continue to next path
        }
      }
      
      if (!loaded) {
        throw new Error(`Could not load ${sectionName} data from any path`);
      }
      
      // Process the data if needed and ensure we have the required properties
      if (processData) {
        processData(jsonData);
      }
      
      // Merge with default data to ensure required properties exist
      data.value = { ...defaultData, ...jsonData };
    } catch (err) {
      console.error(`Error loading ${sectionName} data:`, err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  return { data, loading, error };
}