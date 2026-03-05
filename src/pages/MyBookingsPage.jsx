import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingAPI } from '../services/api'
import { Calendar, Users, Tag, X, Package } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUS  = { PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' }, CONFIRMED: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' }, CANCELLED: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }, COMPLETED: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' } }
const PAYMENT = { PENDING: { color: '#fbbf24' }, PAID: { color: '#4ade80' }, REFUNDED: { color: '#c084fc' }, FAILED: { color: '#f87171' } }

const MyBookingsPage = () => {
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => { fetchBookings() }, [page])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingAPI.getMyBookings({ page, size: 8 })
      setBookings(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {}
    finally { setLoading(false) }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(id)
    try {
      await bookingAPI.cancelBooking(id)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally { setCancelling(null) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>My Bookings</h1>
          <p style={{ color: '#475569' }}>Track and manage your tour bookings</p>
        </div>

        {loading ? <LoadingSpinner fullPage /> : (
          <>
            {bookings.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px', color: '#334155',
                background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Package size={56} style={{ opacity: 0.15, marginBottom: '16px' }} />
                <h3 style={{ color: '#475569', fontWeight: '600', marginBottom: '8px' }}>No bookings yet</h3>
                <p style={{ marginBottom: '24px', fontSize: '0.9rem' }}>Explore our packages and book your first adventure!</p>
                <Link to="/packages" style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: '700',
                }}>Browse Packages</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((b, i) => {
                  const s = STATUS[b.status]  || STATUS.PENDING
                  const p = PAYMENT[b.paymentStatus] || PAYMENT.PENDING
                  return (
                    <div key={b.id} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '20px', padding: '24px', transition: 'border-color 0.2s',
                      animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          {/* Ref + Status badges */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#06b6d4', fontWeight: '800', fontSize: '0.95rem' }}>#{b.bookingReference}</span>
                            <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800' }}>{b.status}</span>
                            <span style={{ color: p.color, fontSize: '0.72rem', fontWeight: '700' }}>{b.paymentStatus}</span>
                          </div>

                          <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '14px', fontSize: '1rem' }}>{b.packageTitle}</h3>

                          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} /> {b.tourDate}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Users size={13} /> {b.numberOfPersons} person(s)
                            </span>
                            {b.guideName && (
                              <span style={{ color: '#64748b', fontSize: '0.82rem' }}>🧭 {b.guideName}</span>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: '#06b6d4', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '10px' }}>
                            ₹{b.totalAmount?.toLocaleString()}
                          </div>
                          {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                            <button
                              onClick={() => handleCancel(b.id)}
                              disabled={cancelling === b.id}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#f87171', borderRadius: '10px', padding: '8px 16px',
                                cursor: cancelling === b.id ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: '700',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                            >
                              <X size={13} /> {cancelling === b.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>

                      {b.specialRequests && (
                        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: '#334155', fontSize: '0.78rem', fontWeight: '600' }}>Special requests: </span>
                          <span style={{ color: '#475569', fontSize: '0.8rem' }}>{b.specialRequests}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
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

export default MyBookingsPage
