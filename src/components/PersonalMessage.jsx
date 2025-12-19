import React, { memo } from 'react'
import './PersonalMessage.css'

function PersonalMessage({ message, backgroundColor }) {
  const style = backgroundColor ? { backgroundColor } : {}
  
  return (
    <div className="personal-message" style={style}>
      <h1>{message}</h1>
    </div>
  )
}

export default memo(PersonalMessage)

