import React from 'react'
import Draggable from 'react-draggable'
import Shortcut from './Shortcut'
import './ShortcutManager.css'

function ShortcutManager({ shortcuts, onUpdateShortcuts, gridMode, positions, onPositionUpdate }) {
  const handleDragStop = (id, data) => {
    const newPositions = {
      ...positions,
      [id]: { x: data.x, y: data.y }
    }
    onPositionUpdate(newPositions)
  }

  const getPosition = (id) => {
    return positions[id] || { x: 0, y: 0 }
  }

  return (
    <div className="shortcut-manager">
      {shortcuts.map((shortcut) => (
        <Draggable
          key={shortcut.id}
          position={getPosition(shortcut.id)}
          onStop={(e, data) => handleDragStop(shortcut.id, data)}
          grid={gridMode ? [20, 20] : null}
          bounds="parent"
        >
          <div className="draggable-shortcut">
            <Shortcut shortcut={shortcut} />
          </div>
        </Draggable>
      ))}
    </div>
  )
}

export default ShortcutManager

