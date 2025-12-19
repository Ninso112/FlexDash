import React, { useState, useRef, useEffect } from 'react'
import './Resizable.css'

function Resizable({ children, onResize, minWidth = 50, minHeight = 50, gridSize = null, initialSize = null }) {
  const [size, setSize] = useState(initialSize || { width: 'auto', height: 'auto' })
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (initialSize) {
      setSize(initialSize)
    }
  }, [initialSize])

  const handleMouseDown = (e, direction) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(direction)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = containerRef.current.offsetWidth
    const startHeight = containerRef.current.offsetHeight

    const handleMouseMove = (e) => {
      let newWidth = startWidth
      let newHeight = startHeight

      if (direction.includes('e')) {
        newWidth = startWidth + (e.clientX - startX)
      }
      if (direction.includes('w')) {
        newWidth = startWidth - (e.clientX - startX)
      }
      if (direction.includes('s')) {
        newHeight = startHeight + (e.clientY - startY)
      }
      if (direction.includes('n')) {
        newHeight = startHeight - (e.clientY - startY)
      }

      // Apply grid snapping
      if (gridSize) {
        newWidth = Math.round(newWidth / gridSize) * gridSize
        newHeight = Math.round(newHeight / gridSize) * gridSize
      }

      // Enforce minimum size
      newWidth = Math.max(minWidth, newWidth)
      newHeight = Math.max(minHeight, newHeight)

      setSize({ width: newWidth, height: newHeight })
      if (onResize) {
        onResize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={containerRef}
      className="resizable-container"
      style={{ width: size.width, height: size.height }}
    >
      {children}
      <div className="resize-handle resize-handle-n" onMouseDown={(e) => handleMouseDown(e, 'n')} />
      <div className="resize-handle resize-handle-s" onMouseDown={(e) => handleMouseDown(e, 's')} />
      <div className="resize-handle resize-handle-e" onMouseDown={(e) => handleMouseDown(e, 'e')} />
      <div className="resize-handle resize-handle-w" onMouseDown={(e) => handleMouseDown(e, 'w')} />
      <div className="resize-handle resize-handle-ne" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
      <div className="resize-handle resize-handle-nw" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
      <div className="resize-handle resize-handle-se" onMouseDown={(e) => handleMouseDown(e, 'se')} />
      <div className="resize-handle resize-handle-sw" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
    </div>
  )
}

export default Resizable

