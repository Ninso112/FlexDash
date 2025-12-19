import React, { useMemo, useState, useEffect } from 'react'
import './GridOverlay.css'

function GridOverlay({ enabled, gridSize = 32 }) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  })

  useEffect(() => {
    if (!enabled) return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [enabled])

  const gridLines = useMemo(() => {
    if (!enabled) return []
    
    const lines = []
    const viewportWidth = dimensions.width
    const viewportHeight = dimensions.height

    // Vertical lines
    for (let x = 0; x < viewportWidth; x += gridSize) {
      lines.push(
        <div
          key={`v-${x}`}
          className="grid-line grid-line-vertical"
          style={{ left: `${x}px` }}
        />
      )
    }

    // Horizontal lines
    for (let y = 0; y < viewportHeight; y += gridSize) {
      lines.push(
        <div
          key={`h-${y}`}
          className="grid-line grid-line-horizontal"
          style={{ top: `${y}px` }}
        />
      )
    }

    return lines
  }, [enabled, gridSize, dimensions])

  if (!enabled) return null

  return <div className="grid-overlay">{gridLines}</div>
}

export default GridOverlay

