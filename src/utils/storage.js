// Default settings
const getDefaultPositions = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  return {
    personalMessage: { x: 50, y: 50 },
    searchBar: { x: width > 768 ? (width / 2) - 150 : 50, y: 200 },
    weather: { x: 50, y: 300 }
  }
}

export const defaultSettings = {
  shortcuts: [],
  backgroundType: 'color', // 'color' or 'image'
  backgroundColor: '#1a1a2e',
  backgroundImage: '',
  weatherEnabled: false,
  weatherLocation: '',
  personalMessage: '',
  searchEngine: 'google',
  gridMode: false,
  positions: getDefaultPositions(),
  shortcutPositions: {}
}

// Load settings from localStorage
export const loadSettings = () => {
  try {
    const saved = localStorage.getItem('flexdash-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge with defaults to support new fields
      return { ...defaultSettings, ...parsed }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
  return null
}

// Save settings to localStorage
export const saveSettings = (settings) => {
  try {
    localStorage.setItem('flexdash-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

