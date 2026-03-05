import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinationAPI } from '../services/api'
import { MapPin, Search, ArrowRight, Compass, Shield, Clock, Users, Star } from 'lucide-react'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'

const FALLBACK = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400'

const HomePage = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    destinationAPI.getFeatured()
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/destinations?search=${encodeURIComponent(search.trim())}`)
  }

  const features = [
    { icon: <Compass size={26} color="#06b6d4" />, title: 'Curated Experiences', desc: 'Handpicked destinations and packages for unforgettable journeys.', color: '#06b6d4' },
    { icon: <Shield size={26} color="#3b82f6" />,  title: 'Safe & Secure',       desc: 'Your bookings and payments are fully protected.', color: '#3b82f6' },
    { icon: <Clock size={26} color="#8b5cf6" />,   title: '24/7 Support',        desc: 'Our team is always available throughout your trip.', color: '#8b5cf6' },
    { icon: <Users size={26} color="#f59e0b" />,   title: 'Expert Guides',       desc: 'Certified, experienced local guides at every destination.', color: '#f59e0b' },
  ]

  return (
    <div style={{ background: '#070d1a', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #070d1a 0%, #0f172a 50%, #0a1f35 100%)',
        padding: '80px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        {[
          { w: 600, h: 600, top: '-150px', right: '-150px', color: 'rgba(6,182,212,0.06)' },
          { w: 500, h: 500, bottom: '-100px', left: '-100px', color: 'rgba(59,130,246,0.05)' },
          { w: 300, h: 300, top: '30%', left: '40%', color: 'rgba(139,92,246,0.04)' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', width: orb.w, height: orb.h, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right, pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: '820px', textAlign: 'center', position: 'relative', zIndex: 1, animation: 'fadeIn 0.6s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
            color: '#06b6d4', fontSize: '0.82rem', fontWeight: '600', letterSpacing: '0.5px',
          }}>
            <Compass size={14} /> Smart Tourist Management System
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: '900', color: 'white',
            lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px',
          }}>
            Discover the World's<br />
            <span style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Most Beautiful</span> Places
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '48px', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto 48px' }}>
            Book curated tour packages, connect with expert guides, and explore breathtaking destinations worldwide.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '8px', maxWidth: '560px', margin: '0 auto 56px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '16px', padding: '8px',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px' }}>
              <Search size={18} color="#475569" />
              <input
                type="text" placeholder="Search destinations, countries, cities..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'white', fontSize: '0.95rem', padding: '8px 0',
                }}
              />
            </div>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white',
              border: 'none', borderRadius: '12px', padding: '12px 24px', cursor: 'pointer',
              fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px',
              whiteSpace: 'nowrap',
            }}>
              Search <ArrowRight size={16} />
            </button>
          </form>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { value: '500+', label: 'Destinations' },
              { value: '1,200+', label: 'Happy Tourists' },
              { value: '150+', label: 'Expert Guides' },
              { value: '98%', label: 'Satisfaction' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#06b6d4', letterSpacing: '-1px' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Featured Destinations
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>Top-rated spots picked by our travel experts</p>
        </div>

        {loading ? <LoadingSpinner fullPage /> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {featured.map((dest, i) => (
                <Link key={dest.id} to={`/destinations/${dest.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s',
                    animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                  >
                    <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                      <img src={dest.imageUrl || FALLBACK} alt={dest.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onError={e => { e.target.src = FALLBACK }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(6,182,212,0.9)', color: 'white',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
                      }}>{dest.category}</div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px' }}>{dest.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                        <MapPin size={13} color="#475569" />
                        <span style={{ color: '#475569', fontSize: '0.82rem' }}>{dest.location}, {dest.country}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <StarRating rating={Math.round(dest.averageRating || 0)} size={14} />
                        <span style={{ color: '#334155', fontSize: '0.78rem' }}>{dest.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link to="/destinations" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: 'white', padding: '14px 36px', borderRadius: '14px', fontWeight: '700', fontSize: '0.95rem',
              }}>
                Explore All Destinations <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Why Choose SmartTour?
          </h2>
          <p style={{ textAlign: 'center', color: '#475569', marginBottom: '48px' }}>Everything you need for a perfect trip</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '32px 28px', textAlign: 'center',
                transition: 'all 0.3s', animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'inline-flex', background: f.color + '15', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                  {f.icon}
                </div>
                <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '600px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.08))',
          border: '1px solid rgba(6,182,212,0.15)', borderRadius: '28px', padding: '60px 40px',
        }}>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Ready to Explore?
          </h2>
          <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.7 }}>
            Join thousands of travelers who have discovered amazing destinations with SmartTour.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: '700',
            }}>Get Started Free</Link>
            <Link to="/destinations" style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: '600',
            }}>Browse Destinations</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
