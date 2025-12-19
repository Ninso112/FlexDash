import React, { useState } from 'react'
import './SettingsPanel.css'

const BACKGROUND_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483', '#6a2c70',
  '#b83b5e', '#f08a5d', '#f9ed69', '#c06c84', '#6c5ce7',
  '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#a29bfe',
  '#fd79a8'
]

const SEARCH_ENGINES = [
  { value: 'google', label: 'Google' },
  { value: 'duckduckgo', label: 'DuckDuckGo' },
  { value: 'startpage', label: 'Startpage' },
  { value: 'ecosia', label: 'Ecosia' },
  { value: 'bing', label: 'Bing' }
]

function SettingsPanel({ settings, onUpdate, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [newShortcut, setNewShortcut] = useState({
    name: '',
    url: '',
    icon: '🔗',
    iconUrl: '',
    size: 'medium'
  })

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onUpdate(localSettings)
    onClose()
  }

  const handleAddShortcut = () => {
    if (newShortcut.url.trim()) {
      const shortcut = {
        id: Date.now().toString(),
        name: newShortcut.name || 'Shortcut',
        url: newShortcut.url,
        icon: newShortcut.icon,
        iconUrl: newShortcut.iconUrl || '',
        size: newShortcut.size
      }
      handleChange('shortcuts', [...localSettings.shortcuts, shortcut])
      setNewShortcut({
        name: '',
        url: '',
        icon: '🔗',
        iconUrl: '',
        size: 'medium'
      })
    }
  }

  const handleDeleteShortcut = (id) => {
    handleChange('shortcuts', localSettings.shortcuts.filter(s => s.id !== id))
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          {/* Personal Message */}
          <section className="settings-section">
            <h3>Personal Message</h3>
            <input
              type="text"
              value={localSettings.personalMessage}
              onChange={(e) => handleChange('personalMessage', e.target.value)}
              placeholder="e.g. Good morning, Alex!"
              className="settings-input"
            />
          </section>

          {/* Background */}
          <section className="settings-section">
            <h3>Background</h3>
            <div className="settings-radio-group">
              <label>
                <input
                  type="radio"
                  value="color"
                  checked={localSettings.backgroundType === 'color'}
                  onChange={(e) => handleChange('backgroundType', e.target.value)}
                />
                Color
              </label>
              <label>
                <input
                  type="radio"
                  value="image"
                  checked={localSettings.backgroundType === 'image'}
                  onChange={(e) => handleChange('backgroundType', e.target.value)}
                />
                Image
              </label>
            </div>

            {localSettings.backgroundType === 'color' ? (
              <div className="color-picker">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${localSettings.backgroundColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange('backgroundColor', color)}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={localSettings.backgroundImage}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="Enter image URL"
                className="settings-input"
              />
            )}
          </section>

          {/* Search Engine */}
          <section className="settings-section">
            <h3>Search Engine</h3>
            <select
              value={localSettings.searchEngine}
              onChange={(e) => handleChange('searchEngine', e.target.value)}
              className="settings-select"
            >
              {SEARCH_ENGINES.map((engine) => (
                <option key={engine.value} value={engine.value}>
                  {engine.label}
                </option>
              ))}
            </select>
          </section>

          {/* Weather */}
          <section className="settings-section">
            <h3>Weather</h3>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={localSettings.weatherEnabled}
                onChange={(e) => handleChange('weatherEnabled', e.target.checked)}
              />
              Enable Weather Widget
            </label>
            {localSettings.weatherEnabled && (
              <input
                type="text"
                value={localSettings.weatherLocation}
                onChange={(e) => handleChange('weatherLocation', e.target.value)}
                placeholder="City name (e.g. Berlin)"
                className="settings-input"
                style={{ marginTop: '10px' }}
              />
            )}
          </section>

          {/* Shortcuts */}
          <section className="settings-section">
            <h3>Shortcuts</h3>
            <div className="shortcut-form">
              <input
                type="text"
                value={newShortcut.name}
                onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                placeholder="Name (optional)"
                className="settings-input-small"
              />
              <input
                type="text"
                value={newShortcut.url}
                onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                placeholder="URL *"
                className="settings-input-small"
                required
              />
              <input
                type="text"
                value={newShortcut.icon}
                onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                placeholder="Emoji Icon"
                className="settings-input-small"
              />
              <input
                type="text"
                value={newShortcut.iconUrl}
                onChange={(e) => setNewShortcut({ ...newShortcut, iconUrl: e.target.value })}
                placeholder="Icon URL (optional)"
                className="settings-input-small"
              />
              <select
                value={newShortcut.size}
                onChange={(e) => setNewShortcut({ ...newShortcut, size: e.target.value })}
                className="settings-select-small"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <button onClick={handleAddShortcut} className="settings-button-add">
                Add
              </button>
            </div>

            <div className="shortcuts-list">
              {localSettings.shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="shortcut-item">
                  <span>{shortcut.icon || '🔗'}</span>
                  <span>{shortcut.name || 'Shortcut'}</span>
                  <span className="shortcut-url">{shortcut.url}</span>
                  <button
                    onClick={() => handleDeleteShortcut(shortcut.id)}
                    className="shortcut-delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="settings-footer">
          <button onClick={handleSave} className="settings-save">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel

