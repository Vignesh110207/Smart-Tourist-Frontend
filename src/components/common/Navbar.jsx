import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Compass, User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [dropdown, setDropdown] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    setDropdown(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/destinations', label: 'Destinations' },
    { to: '/packages',     label: 'Packages' },
    { to: '/guides',       label: 'Guides' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              borderRadius: '10px', padding: '8px', display: 'flex',
            }}>
              <Compass size={22} color="white" />
            </div>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
              Smart<span style={{ color: '#06b6d4' }}>Tour</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                color: isActive(link.to) ? '#06b6d4' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', padding: '8px 16px', borderRadius: '8px',
                fontSize: '0.9rem', fontWeight: isActive(link.to) ? '700' : '500',
                background: isActive(link.to) ? 'rgba(6,182,212,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'white' } }}
              onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.7)' } }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Section */}
            {user ? (
              <div ref={dropRef} style={{ position: 'relative', marginLeft: '8px' }}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
                    color: 'white', padding: '8px 14px', borderRadius: '10px',
                    cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '800', color: 'white', flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {user.name}
                  <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {dropdown && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px', padding: '8px', minWidth: '200px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>{user.email}</div>
                      <div style={{
                        display: 'inline-block', marginTop: '6px',
                        background: user.role === 'ADMIN' ? 'rgba(239,68,68,0.15)' : 'rgba(6,182,212,0.15)',
                        color: user.role === 'ADMIN' ? '#f87171' : '#22d3ee',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
                      }}>{user.role}</div>
                    </div>

                    <Link to="/my-bookings" onClick={() => setDropdown(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
                      padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} /> My Bookings
                    </Link>

                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setDropdown(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        color: '#06b6d4', textDecoration: 'none',
                        padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '6px', paddingTop: '6px' }} />
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
                  padding: '8px 18px', borderRadius: '10px', fontSize: '0.88rem',
                  border: '1px solid rgba(255,255,255,0.15)', fontWeight: '500',
                  transition: 'all 0.2s',
                }}>Login</Link>
                <Link to="/register" style={{
                  color: 'white', textDecoration: 'none',
                  padding: '8px 18px', borderRadius: '10px', fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', fontWeight: '700',
                }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
