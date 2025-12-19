import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import Resizable from './components/Resizable'
import ShortcutManager from './components/ShortcutManager'
import WeatherWidget from './components/WeatherWidget'
import SearchBar from './components/SearchBar'
import PersonalMessage from './components/PersonalMessage'
import SettingsPanel from './components/SettingsPanel'
import { loadSettings, saveSettings, defaultSettings } from './utils/storage'
import './styles/App.css'

function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [gridMode, setGridMode] = useState(false)

  // Load settings on startup
  useEffect(() => {
    const savedSettings = loadSettings()
    if (savedSettings) {
      setSettings(savedSettings)
      setGridMode(savedSettings.gridMode || false)
    }
  }, [])

  // Save settings on changes
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const handleDragStop = (component, data) => {
    const newPositions = {
      ...settings.positions,
      [component]: { x: data.x, y: data.y }
    }
    updateSettings({ positions: newPositions })
  }

  const handleResize = (component, size) => {
    const newSizes = {
      ...settings.sizes,
      [component]: size
    }
    updateSettings({ sizes: newSizes })
  }

  const getPosition = (component) => {
    return settings.positions[component] || { x: 0, y: 0 }
  }

  const getSize = (component) => {
    return settings.sizes?.[component] || null
  }

  // Background styling
  const backgroundStyle = settings.backgroundType === 'image' && settings.backgroundImage
    ? {
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        backgroundColor: settings.backgroundColor || '#1a1a2e'
      }

  return (
    <div className="app" style={backgroundStyle}>
      {/* Settings Button */}
      <button 
        className="settings-button"
        onClick={() => setShowSettings(true)}
        aria-label="Open settings"
      >
        ⚙️
      </button>

      {/* Grid-Mode Toggle */}
      <button 
        className="grid-toggle-button"
        onClick={() => {
          const newGridMode = !gridMode
          setGridMode(newGridMode)
          updateSettings({ gridMode: newGridMode })
        }}
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
      >
        <div className="draggable-container">
          <Resizable
            onResize={(size) => handleResize('searchBar', size)}
            gridSize={gridMode ? 32 : null}
            minWidth={200}
            minHeight={40}
            initialSize={getSize('searchBar')}
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
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App

