import React, { useCallback, useMemo } from 'react'
import Draggable from 'react-draggable'
import Resizable from './Resizable'
import Shortcut from './Shortcut'
import './ShortcutManager.css'

function ShortcutManager({ shortcuts, onUpdateShortcuts, gridMode, positions, onPositionUpdate, sizes, onSizeUpdate }) {
  const handleDragStop = useCallback((id, data) => {
    onPositionUpdate({
      ...positions,
      [id]: { x: data.x, y: data.y }
    })
  }, [positions, onPositionUpdate])

  const handleResize = useCallback((id, size) => {
    onSizeUpdate({
      ...sizes,
      [id]: size
    })
  }, [sizes, onSizeUpdate])

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

