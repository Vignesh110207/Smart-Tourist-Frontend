import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { packageAPI, guideAPI, bookingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Clock, Users, MapPin, Check, X } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const FALLBACK = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
const DIFF_COLOR = { EASY: '#22c55e', MODERATE: '#f59e0b', CHALLENGING: '#ef4444', EXTREME: '#8b5cf6' }

const PackageDetailPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg]         = useState(null)
  const [guides, setGuides]   = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState({ tourDate: '', numberOfPersons: 1, guideId: '', specialRequests: '' })

  useEffect(() => {
    Promise.all([packageAPI.getById(id), guideAPI.getAvailable()])
      .then(([p, g]) => { setPkg(p.data); setGuides(g.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key) => (e) => setBooking(prev => ({ ...prev, [key]: e.target.value }))

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to book a tour'); navigate('/login'); return }
    setSubmitting(true)
    try {
      const payload = {
        packageId: parseInt(id),
        tourDate: booking.tourDate,
        numberOfPersons: parseInt(booking.numberOfPersons),
        specialRequests: booking.specialRequests,
      }
      if (booking.guideId) payload.guideId = parseInt(booking.guideId)
      await bookingAPI.create(payload)
      toast.success('Booking created successfully! 🎉')
      navigate('/my-bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!pkg)    return <div style={{ color: 'white', textAlign: 'center', padding: '80px' }}>Package not found</div>

  const total     = pkg.price * (booking.numberOfPersons || 1)
  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    padding: '12px 14px', color: 'white', outline: 'none',
    boxSizing: 'border-box', fontSize: '0.88rem',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

          {/* Left */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '28px' }}>
              <img src={pkg.imageUrl || FALLBACK} alt={pkg.title}
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                onError={e => { e.target.src = FALLBACK }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <h1 style={{ color: 'white', fontSize: '1.7rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{pkg.title}</h1>
                {pkg.difficultyLevel && (
                  <span style={{ background: DIFF_COLOR[pkg.difficultyLevel] + '22', color: DIFF_COLOR[pkg.difficultyLevel], padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {pkg.difficultyLevel}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}><MapPin size={14} /> {pkg.destinationName}</span>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}><Clock size={14} /> {pkg.durationDays} Days</span>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}><Users size={14} /> Max {pkg.maxCapacity} people</span>
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '0.92rem' }}>{pkg.description}</p>
            </div>

            {(pkg.includes || pkg.excludes) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {pkg.includes && (
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ color: '#4ade80', marginBottom: '14px', fontWeight: '700', fontSize: '0.9rem' }}>✓ Included</h4>
                    {pkg.includes.split(',').map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                        <Check size={13} color="#4ade80" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span style={{ color: '#64748b', fontSize: '0.83rem' }}>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
                {pkg.excludes && (
                  <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ color: '#f87171', marginBottom: '14px', fontWeight: '700', fontSize: '0.9rem' }}>✗ Not Included</h4>
                    {pkg.excludes.split(',').map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                        <X size={13} color="#f87171" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span style={{ color: '#64748b', fontSize: '0.83rem' }}>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px', position: 'sticky', top: '90px',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ color: '#06b6d4', fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>₹{pkg.price?.toLocaleString()}</span>
                <span style={{ color: '#334155', fontSize: '0.82rem' }}> / person</span>
                <div style={{ marginTop: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                  {pkg.availableSlots} slots remaining
                </div>
              </div>

              <form onSubmit={handleBook}>
                {[
                  { label: 'Tour Date', key: 'tourDate', type: 'date', required: true },
                  { label: 'Number of Persons', key: 'numberOfPersons', type: 'number', required: true, min: 1, max: pkg.availableSlots },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '16px' }}>
                    <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input
                      type={f.type} required={f.required} min={f.min} max={f.max}
                      value={booking[f.key]} onChange={set(f.key)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#06b6d4'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                ))}

                {guides.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                      Select Guide (optional)
                    </label>
                    <select value={booking.guideId} onChange={set('guideId')} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">No Guide</option>
                      {guides.map(g => <option key={g.id} value={g.id}>{g.name} — {g.languages}</option>)}
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                    Special Requests
                  </label>
                  <textarea
                    rows={3} placeholder="Dietary needs, accessibility, etc."
                    value={booking.specialRequests} onChange={set('specialRequests')}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Price breakdown */}
                <div style={{
                  background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)',
                  borderRadius: '12px', padding: '16px', marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.82rem', marginBottom: '8px' }}>
                    <span>₹{pkg.price?.toLocaleString()} × {booking.numberOfPersons || 1} person(s)</span>
                    <span>₹{total?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: '800', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                    <span>Total</span>
                    <span style={{ color: '#06b6d4', fontSize: '1.1rem' }}>₹{total?.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" disabled={submitting} style={{
                  width: '100%', background: submitting ? '#334155' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: 'white', border: 'none', borderRadius: '12px', padding: '15px',
                  fontWeight: '800', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer',
                }}>
                  {submitting ? 'Booking...' : '🚀 Book Now'}
                </button>

                {!user && (
                  <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', marginTop: '12px' }}>
                    <Link to="/login" style={{ color: '#06b6d4', fontWeight: '600' }}>Login</Link> to complete booking
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetailPage
