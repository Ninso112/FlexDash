import React from 'react'
import Draggable from 'react-draggable'
import Resizable from './Resizable'
import Shortcut from './Shortcut'
import './ShortcutManager.css'

function ShortcutManager({ shortcuts, onUpdateShortcuts, gridMode, positions, onPositionUpdate, sizes, onSizeUpdate }) {
  const handleDragStop = (id, data) => {
    const newPositions = {
      ...positions,
      [id]: { x: data.x, y: data.y }
    }
    onPositionUpdate(newPositions)
  }

  const handleResize = (id, size) => {
    const newSizes = {
      ...sizes,
      [id]: size
    }
    onSizeUpdate(newSizes)
  }

  const getPosition = (id) => {
    return positions[id] || { x: 0, y: 0 }
  }

  const getSize = (id) => {
    return sizes?.[id] || null
  }

  return (
    <div className="shortcut-manager">
      {shortcuts.map((shortcut) => (
        <Draggable
          key={shortcut.id}
          position={getPosition(shortcut.id)}
          onStop={(e, data) => handleDragStop(shortcut.id, data)}
          grid={gridMode ? [32, 32] : null}
          bounds="parent"
        >
          <div className="draggable-shortcut">
            <Resizable
              onResize={(size) => handleResize(shortcut.id, size)}
              gridSize={gridMode ? 32 : null}
              minWidth={50}
              minHeight={50}
              initialSize={getSize(shortcut.id)}
            >
              <Shortcut shortcut={shortcut} />
            </Resizable>
          </div>
        </Draggable>
      ))}
    </div>
  )
}

export default ShortcutManager

