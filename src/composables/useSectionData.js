import { ref, onMounted } from 'vue';

/**
 * Composable for fetching section data from JSON files
 * @param {string} sectionName - The name of the section to fetch data for
 * @param {Object} defaultData - Default data structure to use before loading
 * @param {Function} [processData] - Optional function to process the data after fetching
 * @returns {Object} - Data, loading state, and error state
 */
export function useSectionData(sectionName, defaultData, processData) {
  const data = ref(defaultData);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await fetch(`/perso_data/${sectionName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sectionName} data: ${response.statusText}`);
      }
      
      const fetchedData = await response.json();
      data.value = fetchedData;
      
      // If a process function is provided, run it on the data
      if (processData && typeof processData === 'function') {
        processData(fetchedData);
      }
    } catch (err) {
      console.error(`Error loading ${sectionName} information:`, err);
      error.value = `Error loading ${sectionName} information: ${err.message}`;
    } finally {
      loading.value = false;
    }
  });

  return {
    data,
    loading,
    error
  };
}