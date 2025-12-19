import React, { useCallback, useMemo, memo } from 'react'
import './Shortcut.css'

function Shortcut({ shortcut, gridMode = false, backgroundColor }) {
  const handleClick = useCallback((e) => {
    // Disable click functionality in grid mode
    if (gridMode) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    
    if (shortcut.url) {
      window.open(shortcut.url, '_blank')
    }
  }, [shortcut.url, gridMode])

  const sizeClass = useMemo(() => {
    const size = shortcut.size || 'medium'
    return `shortcut-${size}`
  }, [shortcut.size])

  const style = backgroundColor ? { backgroundColor } : {}

  return (
    <div 
      className={`shortcut ${sizeClass} ${gridMode ? 'grid-mode-disabled' : ''}`} 
      onClick={handleClick}
      style={style}
    >
      <div className="shortcut-icon">
        {shortcut.iconUrl ? (
          <img src={shortcut.iconUrl} alt={shortcut.name} />
        ) : (
          <span className="shortcut-icon-emoji">{shortcut.icon || '🔗'}</span>
        )}
      </div>
      {shortcut.name && (
        <div className="shortcut-name">{shortcut.name}</div>
      )}
    </div>
  )
}

export default memo(Shortcut)

