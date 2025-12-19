import React, { useCallback, useMemo } from 'react'
import Draggable from 'react-draggable'
import Resizable from './Resizable'
import Shortcut from './Shortcut'
import WidgetColorPicker from './WidgetColorPicker'
import { autoCenterWidgets } from '../utils/centering'
import { autoLayoutWidgets } from '../utils/layout'
import './ShortcutManager.css'

function ShortcutManager({ shortcuts, onUpdateShortcuts, gridMode, positions, onPositionUpdate, sizes, onSizeUpdate, widgetColors, onColorChange, gridSize = 32 }) {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
  const handleDragStop = useCallback((id, data) => {
    // Snap to grid if grid mode is enabled
    let x = data.x
    let y = data.y
    
    if (gridMode) {
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }
    
    const newPositions = {
      ...positions,
      [id]: { x, y }
    }
    
    // Auto-layout to prevent overlap (only in grid mode)
    let finalPositions = newPositions
    if (gridMode) {
      finalPositions = autoLayoutWidgets(
        newPositions,
        sizes || {},
        windowWidth,
        windowHeight,
        gridSize
      )
    } else {
      // Auto-center shortcuts (when not in grid mode)
      finalPositions = autoCenterWidgets(
        newPositions,
        sizes || {},
        windowWidth,
        gridSize
      )
    }
    
    onPositionUpdate(finalPositions)
  }, [positions, onPositionUpdate, gridMode, sizes, windowWidth, windowHeight, gridSize])

  const handleResize = useCallback((id, size) => {
    const newSizes = {
      ...sizes,
      [id]: size
    }
    
    // Auto-layout to prevent overlap (only in grid mode)
    let finalPositions = positions
    if (gridMode) {
      finalPositions = autoLayoutWidgets(
        positions,
        newSizes,
        windowWidth,
        windowHeight,
        gridSize
      )
    } else {
      // Auto-center after resize (when not in grid mode)
      finalPositions = autoCenterWidgets(
        positions,
        newSizes,
        windowWidth,
        gridSize
      )
    }
    
    onSizeUpdate(newSizes)
    onPositionUpdate(finalPositions)
  }, [sizes, onSizeUpdate, positions, onPositionUpdate, windowWidth, windowHeight, gridMode, gridSize])

  const getPosition = useCallback((id) => {
    return positions[id] || { x: 0, y: 0 }
  }, [positions])

  const getSize = useCallback((id) => {
    return sizes?.[id] || null
  }, [sizes])

  const getColor = useCallback((id) => {
    return widgetColors?.[id] || null
  }, [widgetColors])

  const gridValue = useMemo(() => gridMode ? [gridSize, gridSize] : null, [gridMode, gridSize])

  return (
    <div className="shortcut-manager">
      {shortcuts.map((shortcut) => {
        const position = getPosition(shortcut.id)
        const size = getSize(shortcut.id)
        return (
          <Draggable
            key={shortcut.id}
            position={position}
            onStop={(e, data) => handleDragStop(shortcut.id, data)}
            grid={gridValue}
            bounds="parent"
            disabled={!gridMode}
          >
            <div className="draggable-shortcut">
              <Resizable
                onResize={(newSize) => handleResize(shortcut.id, newSize)}
                gridSize={gridMode ? gridSize : null}
                minWidth={50}
                minHeight={50}
                initialSize={size}
                gridMode={gridMode}
              >
                <Shortcut 
                  shortcut={shortcut} 
                  gridMode={gridMode}
                  backgroundColor={getColor(shortcut.id)}
                />
                <WidgetColorPicker
                  widgetId={shortcut.id}
                  currentColor={getColor(shortcut.id)}
                  onColorChange={onColorChange}
                  gridMode={gridMode}
                />
              </Resizable>
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}

export default ShortcutManager

