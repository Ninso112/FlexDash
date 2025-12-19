// Default settings
const getDefaultPositions = (gridSize = 32) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  
  // Center widgets horizontally
  const centerX = (widgetWidth) => {
    const x = (width - widgetWidth) / 2
    return Math.round(x / gridSize) * gridSize
  }
  
  return {
    personalMessage: { x: centerX(400), y: 50 },
    searchBar: { x: centerX(400), y: 150 },
    weather: { x: centerX(250), y: 250 }
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
  searchEngine: 'duckduckgo',
  gridMode: false,
  gridSize: 32, // Grid size in pixels
  positions: getDefaultPositions(32),
  shortcutPositions: {},
  sizes: {},
  shortcutSizes: {},
  widgetColors: {}
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
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Some settings may not be saved.')
    }
  }
}

// Debounced save function (will be used in App.jsx)
let saveTimeout = null
export const saveSettingsDebounced = (settings, delay = 300) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(() => {
    saveSettings(settings)
  }, delay)
}

