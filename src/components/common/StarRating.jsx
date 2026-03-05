import React from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ rating = 0, onRate, size = 16, interactive = false }) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? '#f59e0b' : 'none'}
          color={star <= rating ? '#f59e0b' : '#334155'}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.1s',
          }}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={e => { if (interactive) e.currentTarget.style.transform = 'scale(1.2)' }}
          onMouseLeave={e => { if (interactive) e.currentTarget.style.transform = 'scale(1)' }}
        />
      ))}
    </div>
  )
}

export default StarRating
