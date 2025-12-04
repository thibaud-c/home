import { ref, onMounted } from 'vue';

// Load all JSON files from the data directory using Vite's glob import
const dataFiles = import.meta.glob('../assets/perso_data/*.json');

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
      const path = `../assets/perso_data/${sectionName}.json`;
      const loader = dataFiles[path];

      if (!loader) {
        throw new Error(`Data file for section "${sectionName}" not found.`);
      }

      const module = await loader();
      const jsonData = module.default;

      if (processData) {
        processData(jsonData);
      }

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