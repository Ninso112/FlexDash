/**
 * Utility functions for automatic centering of widgets
 */

const GRID_SIZE = 32

/**
 * Calculate centered position for a widget based on its size and row
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @param {number} screenWidth - Screen width
 * @param {Array} widgetsInRow - Array of widgets in the same row
 * @returns {Object} Centered position {x, y}
 */
export function calculateCenteredPosition(width, height, screenWidth, widgetsInRow = []) {
  // If only one widget in row, center it
  if (widgetsInRow.length === 1) {
    const x = Math.max(0, (screenWidth - width) / 2)
    // Snap to grid
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: widgetsInRow[0].y || 0
    }
  }
  
  // If multiple widgets, distribute them
  if (widgetsInRow.length > 1) {
    const totalWidth = widgetsInRow.reduce((sum, w) => sum + (w.width || 0), 0)
    const spacing = (screenWidth - totalWidth) / (widgetsInRow.length + 1)
    // This would need more complex logic for distribution
    // For now, return original position
    return null
  }
  
  return null
}

/**
 * Group widgets by their row (y position with tolerance)
 * @param {Array} widgets - Array of widget objects with x, y, width, height
 * @param {number} tolerance - Y position tolerance in pixels (default: grid size)
 * @returns {Object} Object with row keys and widget arrays
 */
export function groupWidgetsByRow(widgets, tolerance = GRID_SIZE) {
  const rows = {}
  
  widgets.forEach(widget => {
    const rowY = Math.round(widget.y / tolerance) * tolerance
    if (!rows[rowY]) {
      rows[rowY] = []
    }
    rows[rowY].push(widget)
  })
  
  return rows
}

/**
 * Get default width for a widget type
 */
function getDefaultWidth(widgetId) {
  const defaults = {
    personalMessage: 400,
    searchBar: 400,
    weather: 250,
    shortcut: 120
  }
  
  // Check if it's a shortcut
  if (widgetId.startsWith('shortcut-') || !defaults[widgetId]) {
    return defaults.shortcut
  }
  
  return defaults[widgetId] || 300
}

/**
 * Auto-center all widgets based on their rows
 * @param {Object} positions - Object with component positions
 * @param {Object} sizes - Object with component sizes
 * @param {number} screenWidth - Screen width
 * @returns {Object} Updated positions object
 */
export function autoCenterWidgets(positions, sizes, screenWidth) {
  if (!positions || Object.keys(positions).length === 0) {
    return positions
  }
  
  const widgets = Object.keys(positions).map(key => {
    const size = sizes[key]
    const width = size?.width || getDefaultWidth(key)
    const height = size?.height || 100
    
    return {
      id: key,
      x: positions[key]?.x || 0,
      y: positions[key]?.y || 0,
      width: typeof width === 'number' ? width : getDefaultWidth(key),
      height: typeof height === 'number' ? height : 100
    }
  })
  
  const rows = groupWidgetsByRow(widgets)
  const newPositions = { ...positions }
  
  Object.keys(rows).forEach(rowY => {
    const widgetsInRow = rows[rowY]
    
    // If only one widget in row, center it
    if (widgetsInRow.length === 1) {
      const widget = widgetsInRow[0]
      const width = widget.width
      const x = Math.max(0, (screenWidth - width) / 2)
      newPositions[widget.id] = {
        x: Math.round(x / GRID_SIZE) * GRID_SIZE,
        y: parseInt(rowY)
      }
    }
  })
  
  return newPositions
}

