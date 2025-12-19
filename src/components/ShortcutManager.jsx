import React, { useCallback, useMemo } from 'react'
import Draggable from 'react-draggable'
import Resizable from './Resizable'
import Shortcut from './Shortcut'
import { autoCenterWidgets } from '../utils/centering'
import './ShortcutManager.css'

function ShortcutManager({ shortcuts, onUpdateShortcuts, gridMode, positions, onPositionUpdate, sizes, onSizeUpdate }) {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  const handleDragStop = useCallback((id, data) => {
    // Snap to grid if grid mode is enabled
    let x = data.x
    let y = data.y
    
    if (gridMode) {
      const gridSize = 32
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }
    
    const newPositions = {
      ...positions,
      [id]: { x, y }
    }
    
    // Auto-center shortcuts
    const centeredPositions = autoCenterWidgets(
      newPositions,
      sizes || {},
      windowWidth
    )
    
    onPositionUpdate(centeredPositions)
  }, [positions, onPositionUpdate, gridMode, sizes, windowWidth])

  const handleResize = useCallback((id, size) => {
    const newSizes = {
      ...sizes,
      [id]: size
    }
    
    // Auto-center after resize
    const centeredPositions = autoCenterWidgets(
      positions,
      newSizes,
      windowWidth
    )
    
    onSizeUpdate(newSizes)
    onPositionUpdate(centeredPositions)
  }, [sizes, onSizeUpdate, positions, onPositionUpdate, windowWidth])

  const getPosition = useCallback((id) => {
    return positions[id] || { x: 0, y: 0 }
  }, [positions])

  const getSize = useCallback((id) => {
    return sizes?.[id] || null
  }, [sizes])

  const gridValue = useMemo(() => gridMode ? [32, 32] : null, [gridMode])

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
          >
            <div className="draggable-shortcut">
              <Resizable
                onResize={(newSize) => handleResize(shortcut.id, newSize)}
                gridSize={gridMode ? 32 : null}
                minWidth={50}
                minHeight={50}
                initialSize={size}
              >
                <Shortcut shortcut={shortcut} />
              </Resizable>
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}

export default ShortcutManager

