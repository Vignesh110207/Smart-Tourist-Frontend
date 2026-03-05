import React from 'react'

const LoadingSpinner = ({ size = 40, fullPage = false }) => {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(6,182,212,0.15)`,
      borderTop: `3px solid #06b6d4`,
      borderRadius: '50%',
      animation: 'spin 0.75s linear infinite',
    }} />
  )

  if (fullPage) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        minHeight: '60vh', gap: '16px',
      }}>
        {spinner}
        <span style={{ color: '#475569', fontSize: '0.85rem' }}>Loading...</span>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
