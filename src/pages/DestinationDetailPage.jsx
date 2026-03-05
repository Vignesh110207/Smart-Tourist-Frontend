import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { destinationAPI, packageAPI, reviewAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { MapPin, Clock, DollarSign, Package, ChevronRight } from 'lucide-react'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const FALLBACK = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'

const DestinationDetailPage = () => {
  const { id }  = useParams()
  const { user } = useAuth()
  const [dest, setDest]         = useState(null)
  const [packages, setPackages] = useState([])
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      destinationAPI.getById(id),
      packageAPI.getByDestination(id),
      reviewAPI.getByDestination(id),
    ]).then(([d, p, r]) => {
      setDest(d.data)
      setPackages(p.data)
      setReviews(r.data.content || [])
    }).catch(() => toast.error('Failed to load destination'))
    .finally(() => setLoading(false))
  }, [id])

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to post a review'); return }
    setSubmitting(true)
    try {
      const res = await reviewAPI.create({ ...reviewForm, destinationId: parseInt(id) })
      setReviews(prev => [res.data, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      toast.success('Review posted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!dest)   return <div style={{ color: 'white', textAlign: 'center', padding: '80px' }}>Destination not found</div>

  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a' }}>
      {/* Hero image */}
      <div style={{ height: '440px', position: 'relative', overflow: 'hidden' }}>
        <img src={dest.imageUrl || FALLBACK} alt={dest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = FALLBACK }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #070d1a 0%, rgba(7,13,26,0.5) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
          <span style={{ background: 'rgba(6,182,212,0.9)', color: 'white', padding: '5px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '14px', display: 'inline-block' }}>
            {dest.category}
          </span>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1px' }}>
            {dest.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <MapPin size={15} /> {dest.location}, {dest.country}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StarRating rating={Math.round(dest.averageRating || 0)} size={16} />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                {dest.averageRating?.toFixed(1)} ({dest.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>

          {/* Left column */}
          <div>
            {/* About */}
            <div style={card}>
              <h2 style={{ color: 'white', fontWeight: '700', marginBottom: '16px', fontSize: '1.15rem' }}>About this Destination</h2>
              <p style={{ color: '#64748b', lineHeight: 1.9 }}>
                {dest.description || 'A beautiful destination waiting to be explored. Visit and create unforgettable memories.'}
              </p>
            </div>

            {/* Packages */}
            {packages.length > 0 && (
              <div style={card}>
                <h2 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={18} color="#06b6d4" /> Available Tour Packages
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {packages.map(pkg => (
                    <div key={pkg.id} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '16px', padding: '20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                    >
                      <div>
                        <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px' }}>{pkg.title}</h3>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>⏱ {pkg.durationDays} days</span>
                          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>👥 {pkg.availableSlots} slots left</span>
                          {pkg.difficultyLevel && <span style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: '600' }}>{pkg.difficultyLevel}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: '900' }}>₹{pkg.price?.toLocaleString()}</div>
                        <div style={{ color: '#334155', fontSize: '0.75rem', marginBottom: '10px' }}>per person</div>
                        <Link to={`/packages/${pkg.id}`} style={{
                          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                          color: 'white', padding: '8px 20px', borderRadius: '10px',
                          fontSize: '0.83rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}>
                          Book Now <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={card}>
              <h2 style={{ color: 'white', fontWeight: '700', marginBottom: '24px', fontSize: '1.15rem' }}>
                Reviews ({reviews.length})
              </h2>

              {user && (
                <form onSubmit={submitReview} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px', padding: '20px', marginBottom: '28px',
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: '14px' }}>Write a Review</p>
                  <div style={{ marginBottom: '14px' }}>
                    <StarRating rating={reviewForm.rating} onRate={r => setReviewForm(p => ({ ...p, rating: r }))} size={26} interactive />
                  </div>
                  <textarea
                    rows={3} placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                      padding: '12px', color: 'white', outline: 'none', resize: 'vertical',
                      marginBottom: '14px', boxSizing: 'border-box', fontSize: '0.9rem',
                    }}
                  />
                  <button type="submit" disabled={submitting} style={{
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    padding: '10px 24px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700',
                  }}>
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {reviews.map(rv => (
                <div key={rv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '800', fontSize: '0.85rem',
                      }}>{rv.userName?.[0]?.toUpperCase()}</div>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{rv.userName}</span>
                    </div>
                    <span style={{ color: '#334155', fontSize: '0.78rem' }}>
                      {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <StarRating rating={rv.rating} size={13} />
                  {rv.comment && <p style={{ color: '#64748b', marginTop: '10px', fontSize: '0.88rem', lineHeight: 1.7 }}>{rv.comment}</p>}
                </div>
              ))}

              {reviews.length === 0 && (
                <p style={{ color: '#334155', textAlign: 'center', padding: '20px 0' }}>No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ ...card, position: 'sticky', top: '90px' }}>
              <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '20px' }}>Quick Info</h3>
              {[
                { label: 'Best Time to Visit', value: dest.bestTimeToVisit, icon: <Clock size={15} color="#06b6d4" /> },
                { label: 'Entry Fee',           value: dest.entryFee,       icon: <DollarSign size={15} color="#06b6d4" /> },
                { label: 'Location',            value: dest.state,          icon: <MapPin size={15} color="#06b6d4" /> },
              ].filter(i => i.value).map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ color: '#334155', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>{item.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <StarRating rating={Math.round(dest.averageRating || 0)} size={15} />
                  <span style={{ color: '#f59e0b', fontWeight: '700' }}>{dest.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Based on {dest.totalReviews} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetailPage
