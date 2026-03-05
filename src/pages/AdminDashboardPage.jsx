import React, { useState, useEffect } from 'react'
import { adminAPI, bookingAPI, destinationAPI } from '../services/api'
import { Users, MapPin, Package, Calendar, DollarSign, CheckCircle, Plus, RefreshCw } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminDashboardPage = () => {
  const [stats, setStats]         = useState(null)
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('bookings')
  const [destForm, setDestForm]   = useState({ name: '', description: '', location: '', country: '', state: '', category: 'NATURE', imageUrl: '', entryFee: '', bestTimeToVisit: '' })
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s, b] = await Promise.all([adminAPI.getDashboard(), bookingAPI.getAllBookings({ page: 0, size: 20 })])
      setStats(s.data)
      setBookings(b.data.content)
    } catch {}
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status)
      toast.success(`Booking ${status.toLowerCase()}`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch { toast.error('Failed to update status') }
  }

  const handleDestSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await destinationAPI.create(destForm)
      toast.success('Destination created!')
      setDestForm({ name: '', description: '', location: '', country: '', state: '', category: 'NATURE', imageUrl: '', entryFee: '', bestTimeToVisit: '' })
      setTab('bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create destination')
    } finally { setSaving(false) }
  }

  const set = (key) => (e) => setDestForm(prev => ({ ...prev, [key]: e.target.value }))

  if (loading) return <LoadingSpinner fullPage />

  const statCards = [
    { label: 'Total Users',        value: stats?.totalUsers || 0,     icon: <Users size={22} />,        color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Destinations',       value: stats?.totalDestinations || 0, icon: <MapPin size={22} />,  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Total Packages',     value: stats?.totalPackages || 0,  icon: <Package size={22} />,      color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Total Bookings',     value: stats?.totalBookings || 0,  icon: <Calendar size={22} />,     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Confirmed Bookings', value: stats?.confirmedBookings || 0, icon: <CheckCircle size={22} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Total Revenue',      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={22} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ]

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    padding: '12px 14px', color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '0.88rem',
    transition: 'border-color 0.2s',
  }
  const labelStyle = { color: '#64748b', fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '6px' }

  const STATUS_COLOR = { PENDING: '#fbbf24', CONFIRMED: '#4ade80', CANCELLED: '#f87171', COMPLETED: '#60a5fa' }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
            <p style={{ color: '#475569', fontSize: '0.88rem' }}>Manage the entire platform from here</p>
          </div>
          <button onClick={fetchAll} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
          }}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {statCards.map((s, i) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px', padding: '22px', transition: 'all 0.25s',
              animation: `fadeIn 0.3s ease ${i * 0.07}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '33'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ background: s.bg, borderRadius: '12px', padding: '10px', display: 'inline-flex', marginBottom: '16px', color: s.color }}>
                {s.icon}
              </div>
              <div style={{ color: 'white', fontSize: '1.7rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[
            { key: 'bookings', label: '📋 Manage Bookings' },
            { key: 'destination', label: '➕ Add Destination' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.06)',
              color: 'white', fontWeight: '700', fontSize: '0.88rem',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ color: 'white', fontWeight: '700' }}>All Bookings</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Reference', 'Tourist', 'Package', 'Date', 'Persons', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.04)', color: '#475569', fontSize: '0.72rem', fontWeight: '700', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', color: '#06b6d4', fontWeight: '700', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>#{b.bookingReference}</td>
                      <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.userName}</td>
                      <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.7)', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: '200px' }}>{b.packageTitle}</td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{b.tourDate}</td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>{b.numberOfPersons}</td>
                      <td style={{ padding: '14px 20px', color: '#06b6d4', fontSize: '0.83rem', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{
                          color: STATUS_COLOR[b.status], fontSize: '0.72rem', fontWeight: '800',
                          background: STATUS_COLOR[b.status] + '18', padding: '3px 10px', borderRadius: '20px',
                          border: `1px solid ${STATUS_COLOR[b.status]}33`,
                        }}>{b.status}</span>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {b.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateStatus(b.id, 'CONFIRMED')} style={{
                              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                              color: '#4ade80', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700',
                            }}>✓ Confirm</button>
                            <button onClick={() => updateStatus(b.id, 'CANCELLED')} style={{
                              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                              color: '#f87171', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700',
                            }}>✗ Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#334155' }}>No bookings found.</div>
              )}
            </div>
          </div>
        )}

        {/* Add Destination tab */}
        {tab === 'destination' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px', maxWidth: '720px' }}>
            <h2 style={{ color: 'white', fontWeight: '700', marginBottom: '28px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} color="#06b6d4" /> Add New Destination
            </h2>
            <form onSubmit={handleDestSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                {[
                  { key: 'name',             label: 'Destination Name', placeholder: 'Taj Mahal', required: true },
                  { key: 'location',         label: 'City / Area',      placeholder: 'Agra',       required: true },
                  { key: 'country',          label: 'Country',          placeholder: 'India',      required: true },
                  { key: 'state',            label: 'State / Province', placeholder: 'Uttar Pradesh' },
                  { key: 'entryFee',         label: 'Entry Fee',        placeholder: 'INR 50 / Free' },
                  { key: 'bestTimeToVisit',  label: 'Best Time to Visit', placeholder: 'Oct to Mar' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type="text" placeholder={f.placeholder} required={f.required}
                      value={destForm[f.key]} onChange={set(f.key)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#06b6d4'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '18px' }}>
                <label style={labelStyle}>Category</label>
                <select value={destForm.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['NATURE','HERITAGE','BEACH','MOUNTAIN','ADVENTURE','CULTURAL','RELIGIOUS','WILDLIFE','URBAN'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '18px' }}>
                <label style={labelStyle}>Image URL</label>
                <input type="url" placeholder="https://images.unsplash.com/..."
                  value={destForm.imageUrl} onChange={set('imageUrl')} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#06b6d4'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginTop: '18px' }}>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} placeholder="Describe this amazing destination..."
                  value={destForm.description} onChange={set('description')}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button type="submit" disabled={saving} style={{
                marginTop: '24px', background: saving ? '#334155' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: 'white', border: 'none', borderRadius: '12px', padding: '14px 32px',
                cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Plus size={18} /> {saving ? 'Creating...' : 'Create Destination'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
