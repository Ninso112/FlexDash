import React, { useCallback, useMemo, memo } from 'react'
import './Shortcut.css'

function Shortcut({ shortcut }) {
  const handleClick = useCallback(() => {
    if (shortcut.url) {
      window.open(shortcut.url, '_blank')
    }
  }, [shortcut.url])

  const sizeClass = useMemo(() => {
    const size = shortcut.size || 'medium'
    return `shortcut-${size}`
  }, [shortcut.size])

  return (
    <div className={`shortcut ${sizeClass}`} onClick={handleClick}>
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

