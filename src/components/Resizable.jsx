import React, { useState, useRef, useEffect, useCallback } from 'react'
import './Resizable.css'

function Resizable({ children, onResize, minWidth = 50, minHeight = 50, gridSize = null, initialSize = null }) {
  const [size, setSize] = useState(initialSize || { width: 'auto', height: 'auto' })
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef(null)
  const startPosRef = useRef(null)
  const startSizeRef = useRef(null)

  useEffect(() => {
    if (initialSize) {
      setSize(initialSize)
    }
  }, [initialSize])

  const calculateNewSize = useCallback((clientX, clientY, direction, startX, startY, startWidth, startHeight) => {
    let newWidth = startWidth
    let newHeight = startHeight

    if (direction.includes('e')) {
      newWidth = startWidth + (clientX - startX)
    }
    if (direction.includes('w')) {
      newWidth = startWidth - (clientX - startX)
    }
    if (direction.includes('s')) {
      newHeight = startHeight + (clientY - startY)
    }
    if (direction.includes('n')) {
      newHeight = startHeight - (clientY - startY)
    }

    // Apply grid snapping
    if (gridSize) {
      newWidth = Math.round(newWidth / gridSize) * gridSize
      newHeight = Math.round(newHeight / gridSize) * gridSize
    }

    // Enforce minimum size
    newWidth = Math.max(minWidth, newWidth)
    newHeight = Math.max(minHeight, newHeight)

    return { width: newWidth, height: newHeight }
  }, [gridSize, minWidth, minHeight])

  const handleMove = useCallback((e) => {
    if (!startPosRef.current || !startSizeRef.current) return

    const { direction, startX, startY } = startPosRef.current
    const { startWidth, startHeight } = startSizeRef.current
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const newSize = calculateNewSize(clientX, clientY, direction, startX, startY, startWidth, startHeight)
    setSize(newSize)
    if (onResize) {
      onResize(newSize)
    }
  }, [calculateNewSize, onResize])

  const handleEnd = useCallback(() => {
    setIsResizing(false)
    startPosRef.current = null
    startSizeRef.current = null
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }, [handleMove])

  const handleStart = useCallback((e, direction) => {
    e.preventDefault()
    e.stopPropagation()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    setIsResizing(direction)
    startPosRef.current = { direction, startX: clientX, startY: clientY }
    startSizeRef.current = {
      startWidth: containerRef.current.offsetWidth,
      startHeight: containerRef.current.offsetHeight
    }

    if (e.touches) {
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    } else {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
    }
  }, [handleMove, handleEnd])

  return (
    <div
      ref={containerRef}
      className="resizable-container"
      style={{ width: size.width, height: size.height }}
    >
      {children}
      <div className="resize-handle resize-handle-n" onMouseDown={(e) => handleStart(e, 'n')} onTouchStart={(e) => handleStart(e, 'n')} />
      <div className="resize-handle resize-handle-s" onMouseDown={(e) => handleStart(e, 's')} onTouchStart={(e) => handleStart(e, 's')} />
      <div className="resize-handle resize-handle-e" onMouseDown={(e) => handleStart(e, 'e')} onTouchStart={(e) => handleStart(e, 'e')} />
      <div className="resize-handle resize-handle-w" onMouseDown={(e) => handleStart(e, 'w')} onTouchStart={(e) => handleStart(e, 'w')} />
      <div className="resize-handle resize-handle-ne" onMouseDown={(e) => handleStart(e, 'ne')} onTouchStart={(e) => handleStart(e, 'ne')} />
      <div className="resize-handle resize-handle-nw" onMouseDown={(e) => handleStart(e, 'nw')} onTouchStart={(e) => handleStart(e, 'nw')} />
      <div className="resize-handle resize-handle-se" onMouseDown={(e) => handleStart(e, 'se')} onTouchStart={(e) => handleStart(e, 'se')} />
      <div className="resize-handle resize-handle-sw" onMouseDown={(e) => handleStart(e, 'sw')} onTouchStart={(e) => handleStart(e, 'sw')} />
    </div>
  )
}

export default Resizable

