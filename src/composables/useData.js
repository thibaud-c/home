import { ref, onMounted } from 'vue'

export function useData() {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }
      data.value = await response.json()
    } catch (err) {
      console.error('Error fetching data:', err)
      error.value = err.message || 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  return {
    data,
    loading,
    error,
    fetchData
  }
}