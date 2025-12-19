/**
 * Layout management utilities to prevent widget overlap
 */

/**
 * Check if two widgets overlap
 */
function widgetsOverlap(w1, w2) {
  return !(
    w1.x + w1.width < w2.x ||
    w2.x + w2.width < w1.x ||
    w1.y + w1.height < w2.y ||
    w2.y + w2.height < w1.y
  )
}

/**
 * Check if widget overlaps with any other widget
 */
function hasOverlap(widget, allWidgets, excludeId = null) {
  return allWidgets.some(other => {
    if (excludeId && other.id === excludeId) return false
    return widgetsOverlap(widget, other)
  })
}

/**
 * Find next available position for a widget to avoid overlap
 */
function findNextPosition(widget, allWidgets, screenWidth, screenHeight, gridSize) {
  const startY = widget.y
  let currentY = startY
  
  // Try to place widget below existing widgets
  while (currentY + widget.height < screenHeight) {
    // Try different x positions
    for (let x = 0; x <= screenWidth - widget.width; x += gridSize) {
      const testWidget = {
        ...widget,
        x: x,
        y: currentY
      }
      
      if (!hasOverlap(testWidget, allWidgets, widget.id)) {
        return { x, y: currentY }
      }
    }
    
    // Move to next row
    currentY += gridSize
  }
  
  // If no position found, return original
  return { x: widget.x, y: widget.y }
}

/**
 * Auto-layout widgets to prevent overlap
 * @param {Object} positions - Object with component positions
 * @param {Object} sizes - Object with component sizes
 * @param {number} screenWidth - Screen width
 * @param {number} screenHeight - Screen height
 * @param {number} gridSize - Grid size in pixels
 * @returns {Object} Updated positions object
 */
export function autoLayoutWidgets(positions, sizes, screenWidth, screenHeight = window.innerHeight, gridSize = 32) {
  if (!positions || Object.keys(positions).length === 0) {
    return positions
  }
  
  const widgets = Object.keys(positions).map(key => {
    const size = sizes[key]
    const width = size?.width || 300
    const height = size?.height || 100
    
    return {
      id: key,
      x: positions[key]?.x || 0,
      y: positions[key]?.y || 0,
      width: typeof width === 'number' ? width : 300,
      height: typeof height === 'number' ? height : 100
    }
  })
  
  const newPositions = { ...positions }
  const placedWidgets = []
  
  // Sort widgets by y position, then by x position
  widgets.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y
    return a.x - b.x
  })
  
  widgets.forEach(widget => {
    // Check if widget overlaps with already placed widgets
    if (hasOverlap(widget, placedWidgets)) {
      // Find next available position
      const newPos = findNextPosition(widget, placedWidgets, screenWidth, screenHeight, gridSize)
      newPositions[widget.id] = {
        x: Math.round(newPos.x / gridSize) * gridSize,
        y: Math.round(newPos.y / gridSize) * gridSize
      }
      
      // Update widget position for next checks
      widget.x = newPositions[widget.id].x
      widget.y = newPositions[widget.id].y
    } else {
      // Snap to grid
      newPositions[widget.id] = {
        x: Math.round(widget.x / gridSize) * gridSize,
        y: Math.round(widget.y / gridSize) * gridSize
      }
      widget.x = newPositions[widget.id].x
      widget.y = newPositions[widget.id].y
    }
    
    placedWidgets.push(widget)
  })
  
  return newPositions
}

