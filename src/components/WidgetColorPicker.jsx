import React, { useState, useRef, useEffect } from 'react'
import './WidgetColorPicker.css'

const COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483', '#6a2c70',
  '#b83b5e', '#f08a5d', '#f9ed69', '#c06c84', '#6c5ce7',
  '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#a29bfe',
  '#fd79a8', '#ffffff', '#000000'
]

function WidgetColorPicker({ widgetId, currentColor, onColorChange, gridMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!gridMode) return null

  const handleColorSelect = (color) => {
    onColorChange(widgetId, color)
    setIsOpen(false)
  }

  return (
    <div className="widget-color-picker" ref={pickerRef}>
      <button
        className="color-picker-button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        style={{ backgroundColor: currentColor || 'rgba(0, 0, 0, 0.6)' }}
        aria-label="Change widget color"
      >
        🎨
      </button>
      {isOpen && (
        <div className="color-picker-panel">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`color-option ${currentColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation()
                handleColorSelect(color)
              }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WidgetColorPicker

