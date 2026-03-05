import React, { useState, useEffect } from 'react'
import { guideAPI } from '../services/api'
import { Star, Globe, Clock, UserCheck } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const GuidesPage = () => {
  const [guides, setGuides]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    guideAPI.getAll()
      .then(res => setGuides(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Expert Guides</h1>
          <p style={{ color: '#475569' }}>Connect with certified local guides who know every hidden gem</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {guides.map((guide, i) => (
            <div key={guide.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px', textAlign: 'center', transition: 'all 0.3s',
              animation: `fadeIn 0.35s ease ${i * 0.07}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Avatar */}
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '1.8rem', fontWeight: '900', color: 'white',
                boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
              }}>{guide.name?.[0]?.toUpperCase()}</div>

              <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '6px', fontSize: '1.05rem' }}>{guide.name}</h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '14px' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.88rem' }}>
                  {guide.averageRating?.toFixed(1) || 'New'}
                </span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: '18px', minHeight: '50px' }}>
                {guide.bio || 'Passionate about sharing local culture and hidden gems with travelers.'}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
                {guide.languages && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>
                    <Globe size={11} /> {guide.languages}
                  </span>
                )}
                {guide.experienceYears && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>
                    <Clock size={11} /> {guide.experienceYears} yrs
                  </span>
                )}
              </div>

              {/* Availability badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                background: guide.available ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: guide.available ? '#4ade80' : '#f87171',
                border: `1px solid ${guide.available ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                <UserCheck size={13} />
                {guide.available ? 'Available for Booking' : 'Currently Unavailable'}
              </div>
            </div>
          ))}

          {guides.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: '#334155', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
              No guides available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuidesPage
