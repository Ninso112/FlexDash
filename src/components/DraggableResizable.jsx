import React from 'react'
import Draggable from 'react-draggable'
import Resizable from './Resizable'

/**
 * Wrapper component that combines Draggable and Resizable functionality
 * Reduces code duplication across the app
 */
function DraggableResizable({
  children,
  position,
  onDragStop,
  onResize,
  gridMode,
  gridSize = 32,
  minWidth = 50,
  minHeight = 50,
  initialSize = null,
  bounds = 'parent'
}) {
  return (
    <Draggable
      position={position}
      onStop={onDragStop}
      grid={gridMode ? [gridSize, gridSize] : null}
      bounds={bounds}
    >
      <div className="draggable-container">
        <Resizable
          onResize={onResize}
          gridSize={gridMode ? gridSize : null}
          minWidth={minWidth}
          minHeight={minHeight}
          initialSize={initialSize}
        >
          {children}
        </Resizable>
      </div>
    </Draggable>
  )
}

export default DraggableResizable

