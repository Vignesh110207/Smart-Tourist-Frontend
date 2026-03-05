import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { destinationAPI } from '../services/api'
import { MapPin, Search } from 'lucide-react'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'

const CATEGORIES = ['ALL','NATURE','HERITAGE','BEACH','MOUNTAIN','ADVENTURE','CULTURAL','RELIGIOUS','WILDLIFE','URBAN']
const FALLBACK   = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400'

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(0)
  const [totalPages, setTotalPages]     = useState(0)
  const [category, setCategory]         = useState('ALL')
  const [search, setSearch]             = useState('')
  const [searchParams]                  = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearch(q)
  }, [searchParams])

  useEffect(() => { fetchData() }, [page, category, search])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page, size: 9 }
      if (search)             params.search   = search
      else if (category !== 'ALL') params.category = category
      const res = await destinationAPI.getAll(params)
      setDestinations(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {}
    finally { setLoading(false) }
  }

  const handleSearch = (e) => { e.preventDefault(); setPage(0) }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', animation: 'fadeIn 0.4s ease' }}>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Explore Destinations
          </h1>
          <p style={{ color: '#475569' }}>Discover amazing places around the world</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px', maxWidth: '560px' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '12px', padding: '0 16px',
          }}>
            <Search size={16} color="#475569" />
            <input
              type="text" placeholder="Search destinations, countries..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', padding: '13px 0', fontSize: '0.9rem' }}
            />
          </div>
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white',
            border: 'none', borderRadius: '12px', padding: '0 22px', cursor: 'pointer', fontWeight: '700',
          }}>Search</button>
        </form>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setSearch(''); setPage(0) }} style={{
              padding: '8px 18px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700',
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: category === cat ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.06)',
              color: category === cat ? 'white' : '#64748b',
              boxShadow: category === cat ? '0 4px 12px rgba(6,182,212,0.3)' : 'none',
            }}>{cat}</button>
          ))}
        </div>

        {loading ? <LoadingSpinner fullPage /> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {destinations.map((dest, i) => (
                <Link key={dest.id} to={`/destinations/${dest.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s',
                    animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ height: '195px', overflow: 'hidden', position: 'relative' }}>
                      <img src={dest.imageUrl || FALLBACK} alt={dest.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onError={e => { e.target.src = FALLBACK }}
                      />
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(6,182,212,0.88)', backdropFilter: 'blur(6px)',
                        color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
                      }}>{dest.category}</div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px' }}>{dest.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                        <MapPin size={13} color="#475569" />
                        <span style={{ color: '#475569', fontSize: '0.82rem' }}>{dest.location}, {dest.country}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <StarRating rating={Math.round(dest.averageRating || 0)} size={13} />
                        <span style={{ color: '#334155', fontSize: '0.78rem' }}>{dest.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {destinations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px', color: '#334155', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                <MapPin size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>No destinations found. Try a different search.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: page === 0 ? 'not-allowed' : 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: page === 0 ? '#334155' : 'white', fontWeight: '600',
                }}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)} style={{
                    width: '42px', height: '42px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: page === i ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.06)',
                    color: 'white', fontWeight: '700', fontSize: '0.9rem',
                    boxShadow: page === i ? '0 4px 12px rgba(6,182,212,0.3)' : 'none',
                  }}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: page === totalPages - 1 ? '#334155' : 'white', fontWeight: '600',
                }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DestinationsPage
