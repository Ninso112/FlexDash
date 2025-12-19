import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Draggable from 'react-draggable'
import Resizable from './components/Resizable'
import GridOverlay from './components/GridOverlay'
import ShortcutManager from './components/ShortcutManager'
import WeatherWidget from './components/WeatherWidget'
import SearchBar from './components/SearchBar'
import PersonalMessage from './components/PersonalMessage'
import SettingsPanel from './components/SettingsPanel'
import { loadSettings, saveSettingsDebounced, defaultSettings } from './utils/storage'
import { autoCenterWidgets } from './utils/centering'
import './styles/App.css'

function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [gridMode, setGridMode] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const appRef = useRef(null)

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load settings on startup and auto-center
  useEffect(() => {
    const savedSettings = loadSettings()
    if (savedSettings) {
      // Auto-center widgets on initial load
      const centeredPositions = autoCenterWidgets(
        savedSettings.positions || {},
        savedSettings.sizes || {},
        windowWidth
      )
      
      setSettings({
        ...savedSettings,
        positions: centeredPositions
      })
      setGridMode(savedSettings.gridMode || false)
    }
  }, []) // Only run once on mount

  // Save settings on changes (debounced)
  useEffect(() => {
    saveSettingsDebounced(settings, 300)
  }, [settings])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const handleDragStop = useCallback((component, data) => {
    // Snap to grid if grid mode is enabled
    let x = data.x
    let y = data.y
    
    if (gridMode) {
      const gridSize = 32
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }
    
    setSettings(prev => {
      const newPositions = {
        ...prev.positions,
        [component]: { x, y }
      }
      
      // Auto-center widgets after drag
      const centeredPositions = autoCenterWidgets(
        newPositions,
        prev.sizes || {},
        windowWidth
      )
      
      return {
        ...prev,
        positions: centeredPositions
      }
    })
  }, [gridMode, windowWidth])

  const handleResize = useCallback((component, size) => {
    setSettings(prev => {
      const newSizes = {
        ...prev.sizes,
        [component]: size
      }
      
      // Auto-center widgets after resize
      const centeredPositions = autoCenterWidgets(
        prev.positions,
        newSizes,
        windowWidth
      )
      
      return {
        ...prev,
        sizes: newSizes,
        positions: centeredPositions
      }
    })
  }, [windowWidth])

  const getPosition = useCallback((component) => {
    return settings.positions[component] || { x: 0, y: 0 }
  }, [settings.positions])

  const getSize = useCallback((component) => {
    return settings.sizes?.[component] || null
  }, [settings.sizes])

  // Background styling (memoized)
  const backgroundStyle = useMemo(() => {
    return settings.backgroundType === 'image' && settings.backgroundImage
      ? {
          backgroundImage: `url(${settings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      : {
          backgroundColor: settings.backgroundColor || '#1a1a2e'
        }
  }, [settings.backgroundType, settings.backgroundImage, settings.backgroundColor])

  const toggleGridMode = useCallback(() => {
    const newGridMode = !gridMode
    setGridMode(newGridMode)
    updateSettings({ gridMode: newGridMode })
  }, [gridMode, updateSettings])

  const openSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  // Auto-center widgets when window resizes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (settings.positions && Object.keys(settings.positions).length > 0) {
        const centeredPositions = autoCenterWidgets(
          settings.positions,
          settings.sizes || {},
          windowWidth
        )
        
        // Only update if positions actually changed
        const positionsChanged = Object.keys(centeredPositions).some(
          key => {
            const oldPos = settings.positions[key]
            const newPos = centeredPositions[key]
            return oldPos && (newPos.x !== oldPos.x || newPos.y !== oldPos.y)
          }
        )
        
        if (positionsChanged) {
          setSettings(prev => ({
            ...prev,
            positions: centeredPositions
          }))
        }
      }
    }, 150) // Debounce resize
    
    return () => clearTimeout(timeoutId)
  }, [windowWidth]) // Only run on window resize

  return (
    <div className="app" ref={appRef} style={backgroundStyle}>
      {/* Grid Overlay */}
      <GridOverlay enabled={gridMode} gridSize={32} />

      {/* Settings Button */}
      <button 
        className="settings-button"
        onClick={openSettings}
        aria-label="Open settings"
      >
        ⚙️
      </button>

      {/* Grid-Mode Toggle */}
      <button 
        className="grid-toggle-button"
        onClick={toggleGridMode}
        aria-label="Toggle grid mode"
        title={gridMode ? "Grid Mode: ON" : "Grid Mode: OFF"}
      >
        {gridMode ? '⊞' : '⊞'}
      </button>

      {/* Personal Message */}
      {settings.personalMessage && (
        <Draggable
          position={getPosition('personalMessage')}
          onStop={(e, data) => handleDragStop('personalMessage', data)}
          grid={gridMode ? [32, 32] : null}
          bounds="parent"
        >
          <div className="draggable-container">
            <Resizable
              onResize={(size) => handleResize('personalMessage', size)}
              gridSize={gridMode ? 32 : null}
              minWidth={100}
              minHeight={50}
              initialSize={getSize('personalMessage')}
              gridMode={gridMode}
            >
              <PersonalMessage message={settings.personalMessage} />
            </Resizable>
          </div>
        </Draggable>
      )}

      {/* Search Bar */}
      <Draggable
        position={getPosition('searchBar')}
        onStop={(e, data) => handleDragStop('searchBar', data)}
        grid={gridMode ? [32, 32] : null}
        bounds="parent"
        handle=".search-drag-handle"
      >
        <div className="draggable-container">
          <Resizable
            onResize={(size) => handleResize('searchBar', size)}
            gridSize={gridMode ? 32 : null}
            minWidth={200}
            minHeight={40}
            initialSize={getSize('searchBar')}
            gridMode={gridMode}
          >
            <SearchBar searchEngine={settings.searchEngine} />
          </Resizable>
        </div>
      </Draggable>

      {/* Weather Widget */}
      {settings.weatherEnabled && (
        <Draggable
          position={getPosition('weather')}
          onStop={(e, data) => handleDragStop('weather', data)}
          grid={gridMode ? [32, 32] : null}
          bounds="parent"
        >
          <div className="draggable-container">
            <Resizable
              onResize={(size) => handleResize('weather', size)}
              gridSize={gridMode ? 32 : null}
              minWidth={150}
              minHeight={100}
              initialSize={getSize('weather')}
              gridMode={gridMode}
            >
              <WeatherWidget location={settings.weatherLocation} />
            </Resizable>
          </div>
        </Draggable>
      )}

      {/* Shortcuts */}
      <ShortcutManager
        shortcuts={settings.shortcuts}
        onUpdateShortcuts={(shortcuts) => updateSettings({ shortcuts })}
        gridMode={gridMode}
        positions={settings.shortcutPositions || {}}
        onPositionUpdate={(positions) => updateSettings({ shortcutPositions: positions })}
        sizes={settings.shortcutSizes || {}}
        onSizeUpdate={(sizes) => updateSettings({ shortcutSizes: sizes })}
      />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={closeSettings}
        />
      )}
    </div>
  )
}

export default App

