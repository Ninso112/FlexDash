import React, { memo } from 'react'
import './PersonalMessage.css'

function PersonalMessage({ message }) {
  return (
    <div className="personal-message">
      <h1>{message}</h1>
    </div>
  )
}

export default memo(PersonalMessage)

