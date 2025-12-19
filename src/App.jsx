import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Draggable from 'react-draggable'
import Resizable from './components/Resizable'
import GridOverlay from './components/GridOverlay'
import WidgetColorPicker from './components/WidgetColorPicker'
import ShortcutManager from './components/ShortcutManager'
import WeatherWidget from './components/WeatherWidget'
import SearchBar from './components/SearchBar'
import PersonalMessage from './components/PersonalMessage'
import SettingsPanel from './components/SettingsPanel'
import { loadSettings, saveSettingsDebounced, defaultSettings } from './utils/storage'
import { autoCenterWidgets } from './utils/centering'
import { autoLayoutWidgets } from './utils/layout'
import './styles/App.css'

function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [gridMode, setGridMode] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const [buttonsVisible, setButtonsVisible] = useState(false)
  const appRef = useRef(null)
  const buttonTimeoutRef = useRef(null)

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load settings on startup and auto-layout/center
  useEffect(() => {
    const savedSettings = loadSettings()
    if (savedSettings) {
      const initialGridMode = savedSettings.gridMode || false
      
      // Auto-layout or center widgets on initial load
      let finalPositions
      if (initialGridMode) {
        // Auto-layout to prevent overlap in grid mode
        finalPositions = autoLayoutWidgets(
          savedSettings.positions || {},
          savedSettings.sizes || {},
          windowWidth,
          window.innerHeight,
          savedSettings.gridSize || 32
        )
      } else {
        // Auto-center when not in grid mode
        finalPositions = autoCenterWidgets(
          savedSettings.positions || {},
          savedSettings.sizes || {},
          windowWidth,
          savedSettings.gridSize || 32
        )
      }
      
      setSettings({
        ...savedSettings,
        positions: finalPositions
      })
      setGridMode(initialGridMode)
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
      const gridSize = settings.gridSize || 32
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }
    
    setSettings(prev => {
      const newPositions = {
        ...prev.positions,
        [component]: { x, y }
      }
      
      // Auto-layout to prevent overlap (only in grid mode)
      let finalPositions = newPositions
      if (gridMode) {
        finalPositions = autoLayoutWidgets(
          newPositions,
          prev.sizes || {},
          windowWidth,
          window.innerHeight,
          prev.gridSize || 32
        )
      } else {
        // Auto-center widgets after drag (when not in grid mode)
        finalPositions = autoCenterWidgets(
          newPositions,
          prev.sizes || {},
          windowWidth,
          prev.gridSize || 32
        )
      }
      
      return {
        ...prev,
        positions: finalPositions
      }
    })
  }, [gridMode, windowWidth])

  const handleResize = useCallback((component, size) => {
    setSettings(prev => {
      const newSizes = {
        ...prev.sizes,
        [component]: size
      }
      
      // Auto-layout to prevent overlap (only in grid mode)
      let finalPositions = prev.positions
      if (gridMode) {
        finalPositions = autoLayoutWidgets(
          prev.positions,
          newSizes,
          windowWidth,
          window.innerHeight,
          prev.gridSize || 32
        )
      } else {
        // Auto-center widgets after resize (when not in grid mode)
        finalPositions = autoCenterWidgets(
          prev.positions,
          newSizes,
          windowWidth,
          prev.gridSize || 32
        )
      }
      
      return {
        ...prev,
        sizes: newSizes,
        positions: finalPositions
      }
    })
  }, [windowWidth, gridMode])

  const getPosition = useCallback((component) => {
    return settings.positions[component] || { x: 0, y: 0 }
  }, [settings.positions])

  const getSize = useCallback((component) => {
    return settings.sizes?.[component] || null
  }, [settings.sizes])

  // Background styling (memoized)
  const backgroundStyle = useMemo(() => {
    if (settings.backgroundType === 'image' && settings.backgroundImage) {
      return {
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    return {
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

  // Handle button visibility on hover
  const handleMouseEnter = useCallback(() => {
    setButtonsVisible(true)
    // Clear existing timeout
    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current)
    }
    // Hide buttons after 15 seconds
    buttonTimeoutRef.current = setTimeout(() => {
      setButtonsVisible(false)
    }, 15000)
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Clear timeout when mouse leaves
    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current)
    }
    // Hide buttons immediately when mouse leaves
    setButtonsVisible(false)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current)
      }
    }
  }, [])

  const handleColorChange = useCallback((widgetId, color) => {
    setSettings(prev => ({
      ...prev,
      widgetColors: {
        ...prev.widgetColors,
        [widgetId]: color
      }
    }))
  }, [])

  const getWidgetColor = useCallback((widgetId) => {
    return settings.widgetColors?.[widgetId] || null
  }, [settings.widgetColors])

  // Auto-layout/center widgets when window resizes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSettings(prev => {
        if (prev.positions && Object.keys(prev.positions).length > 0) {
          let finalPositions
        if (gridMode) {
          // Auto-layout to prevent overlap in grid mode
          finalPositions = autoLayoutWidgets(
            prev.positions,
            prev.sizes || {},
            windowWidth,
            window.innerHeight,
            prev.gridSize || 32
          )
        } else {
          // Auto-center when not in grid mode
          finalPositions = autoCenterWidgets(
            prev.positions,
            prev.sizes || {},
            windowWidth,
            prev.gridSize || 32
          )
        }
          
          // Only update if positions actually changed
          const positionsChanged = Object.keys(finalPositions).some(
            key => {
              const oldPos = prev.positions[key]
              const newPos = finalPositions[key]
              return oldPos && (newPos.x !== oldPos.x || newPos.y !== oldPos.y)
            }
          )
          
          if (positionsChanged) {
            return {
              ...prev,
              positions: finalPositions
            }
          }
        }
        return prev
      })
    }, 150) // Debounce resize
    
    return () => clearTimeout(timeoutId)
  }, [windowWidth, gridMode]) // Run on window resize or grid mode change

  return (
    <div 
      className={`app ${gridMode ? 'grid-mode-active' : ''}`}
      ref={appRef} 
      style={backgroundStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid Overlay */}
      <GridOverlay enabled={gridMode} gridSize={settings.gridSize || 32} />

      {/* Settings Button */}
      <button 
        className={`settings-button ${buttonsVisible ? 'visible' : ''}`}
        onClick={openSettings}
        aria-label="Open settings"
      >
        ⚙️
      </button>

      {/* Grid-Mode Toggle */}
      <button 
        className={`grid-toggle-button ${buttonsVisible ? 'visible' : ''}`}
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
          grid={gridMode ? [settings.gridSize || 32, settings.gridSize || 32] : null}
          bounds="parent"
          disabled={!gridMode}
        >
          <div className="draggable-container">
            <Resizable
              onResize={(size) => handleResize('personalMessage', size)}
              gridSize={gridMode ? (settings.gridSize || 32) : null}
              minWidth={100}
              minHeight={50}
              initialSize={getSize('personalMessage')}
              gridMode={gridMode}
            >
              <PersonalMessage 
                message={settings.personalMessage} 
                backgroundColor={getWidgetColor('personalMessage')}
              />
              <WidgetColorPicker
                widgetId="personalMessage"
                currentColor={getWidgetColor('personalMessage')}
                onColorChange={handleColorChange}
                gridMode={gridMode}
              />
            </Resizable>
          </div>
        </Draggable>
      )}

      {/* Search Bar */}
      <Draggable
        position={getPosition('searchBar')}
        onStop={(e, data) => handleDragStop('searchBar', data)}
        grid={gridMode ? [settings.gridSize || 32, settings.gridSize || 32] : null}
        bounds="parent"
        handle=".search-drag-handle"
        disabled={!gridMode}
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
            <SearchBar 
              searchEngine={settings.searchEngine} 
              gridMode={gridMode}
              backgroundColor={getWidgetColor('searchBar')}
            />
            <WidgetColorPicker
              widgetId="searchBar"
              currentColor={getWidgetColor('searchBar')}
              onColorChange={handleColorChange}
              gridMode={gridMode}
            />
          </Resizable>
        </div>
      </Draggable>

      {/* Weather Widget */}
      {settings.weatherEnabled && (
        <Draggable
          position={getPosition('weather')}
          onStop={(e, data) => handleDragStop('weather', data)}
          grid={gridMode ? [settings.gridSize || 32, settings.gridSize || 32] : null}
          bounds="parent"
          disabled={!gridMode}
        >
          <div className="draggable-container">
            <Resizable
              onResize={(size) => handleResize('weather', size)}
              gridSize={gridMode ? (settings.gridSize || 32) : null}
              minWidth={150}
              minHeight={100}
              initialSize={getSize('weather')}
              gridMode={gridMode}
            >
              <WeatherWidget 
                location={settings.weatherLocation}
                backgroundColor={getWidgetColor('weather')}
              />
              <WidgetColorPicker
                widgetId="weather"
                currentColor={getWidgetColor('weather')}
                onColorChange={handleColorChange}
                gridMode={gridMode}
              />
            </Resizable>
          </div>
        </Draggable>
      )}

      {/* Shortcuts */}
      <ShortcutManager
        shortcuts={settings.shortcuts}
        onUpdateShortcuts={(shortcuts) => updateSettings({ shortcuts })}
        gridMode={gridMode}
        gridSize={settings.gridSize || 32}
        positions={settings.shortcutPositions || {}}
        onPositionUpdate={(positions) => updateSettings({ shortcutPositions: positions })}
        sizes={settings.shortcutSizes || {}}
        onSizeUpdate={(sizes) => updateSettings({ shortcutSizes: sizes })}
        widgetColors={settings.widgetColors || {}}
        onColorChange={handleColorChange}
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

