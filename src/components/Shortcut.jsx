import React from 'react'
import './Shortcut.css'

function Shortcut({ shortcut }) {
  const handleClick = () => {
    if (shortcut.url) {
      window.open(shortcut.url, '_blank')
    }
  }

  const getSizeClass = () => {
    const size = shortcut.size || 'medium'
    return `shortcut-${size}`
  }

  return (
    <div className={`shortcut ${getSizeClass()}`} onClick={handleClick}>
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

export default Shortcut

