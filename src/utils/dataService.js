/**
 * Data service for fetching profile data from separate JSON files
 * with fallback to the original data.json structure
 */
export const fetchData = async (section) => {
  console.log(`Attempting to fetch data for section: ${section}`);
  
  try {
    // First try to fetch from the modular structure
    console.log(`Trying modular path: ./perso_data/${section}.json`);
    let response = await fetch(`./perso_data/${section}.json`);
    
    if (response.ok) {
      console.log(`Successfully loaded from modular structure: ${section}`);
      return await response.json();
    }
    
    // If that fails, try the src/perso_data path
    console.log(`Trying src path: ./src/perso_data/${section}.json`);
    response = await fetch(`./src/perso_data/${section}.json`);
    
    if (response.ok) {
      console.log(`Successfully loaded from src path: ${section}`);
      return await response.json();
    }
    
    // If that fails, fall back to the original data.json
    console.log(`Section ${section} not found in modular structure, falling back to data.json`);
    const fullDataResponse = await fetch('./data.json');
    
    if (!fullDataResponse.ok) {
      console.error('Failed to fetch data.json, status:', fullDataResponse.status);
      throw new Error(`Failed to fetch data.json: ${fullDataResponse.statusText}`);
    }
    
    const fullData = await fullDataResponse.json();
    console.log(`data.json loaded, checking for section: ${section}`);
    
    // Return the specific section from the full data
    if (fullData && fullData[section]) {
      console.log(`Section ${section} found in data.json`);
      return fullData[section];
    }
    
    console.error(`Section ${section} not found in data.json`);
    throw new Error(`Section ${section} not found in data.json`);
  } catch (error) {
    console.error(`Error fetching ${section} data:`, error);
    // Return an empty object or array depending on what's expected
    return section === 'personalInfo' || section === 'about' ? {} : [];
  }
};

/**
 * Utility to check if a file exists
 */
export const fileExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};