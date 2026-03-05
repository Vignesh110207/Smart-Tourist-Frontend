import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { packageAPI } from '../services/api'
import { Clock, Users, ChevronRight, Package } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const FALLBACK = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400'
const DIFF_COLOR = { EASY: '#22c55e', MODERATE: '#f59e0b', CHALLENGING: '#ef4444', EXTREME: '#8b5cf6' }

const PackagesPage = () => {
  const [packages, setPackages]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    packageAPI.getAll({ page, size: 9 })
      .then(res => { setPackages(res.data.content); setTotalPages(res.data.totalPages) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Tour Packages</h1>
          <p style={{ color: '#475569' }}>Find the perfect package for your next adventure</p>
        </div>

        {loading ? <LoadingSpinner fullPage /> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {packages.map((pkg, i) => (
                <div key={pkg.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s',
                  animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={pkg.imageUrl || FALLBACK} alt={pkg.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onError={e => { e.target.src = FALLBACK }}
                    />
                    {pkg.difficultyLevel && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: DIFF_COLOR[pkg.difficultyLevel] || '#64748b',
                        color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800',
                      }}>{pkg.difficultyLevel}</div>
                    )}
                  </div>
                  <div style={{ padding: '22px' }}>
                    <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px' }}>{pkg.title}</h3>
                    <p style={{ color: '#475569', fontSize: '0.83rem', marginBottom: '16px' }}>
                      📍 {pkg.destinationName} · {pkg.destinationLocation}
                    </p>
                    <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
                      <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} /> {pkg.durationDays} Days
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={13} /> {pkg.availableSlots} slots
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: '900' }}>₹{pkg.price?.toLocaleString()}</span>
                        <span style={{ color: '#334155', fontSize: '0.75rem' }}>/person</span>
                      </div>
                      <Link to={`/packages/${pkg.id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        color: 'white', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem',
                      }}>
                        View <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {packages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px', color: '#334155', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>No packages available yet.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)} style={{
                    width: '42px', height: '42px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: page === i ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.06)',
                    color: 'white', fontWeight: '700',
                  }}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PackagesPage
