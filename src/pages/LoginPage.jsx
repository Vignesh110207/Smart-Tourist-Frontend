import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, Lock, Compass, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inputWrap = { position: 'relative', marginBottom: '20px' }
  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '14px 16px 14px 46px', color: 'white', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const iconStyle = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }
  const labelStyle = { color: 'rgba(255,255,255,0.65)', fontSize: '0.83rem', fontWeight: '600', display: 'block', marginBottom: '8px' }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg, #070d1a 0%, #0f172a 60%, #0a2240 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px', padding: '48px 40px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            borderRadius: '16px', padding: '14px', marginBottom: '20px',
          }}>
            <Compass size={28} color="white" />
          </div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrap}>
              <div style={iconStyle}><Mail size={16} color="#475569" /></div>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email} onChange={set('email')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#06b6d4'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputWrap}>
              <div style={iconStyle}><Lock size={16} color="#475569" /></div>
              <input
                type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                value={form.password} onChange={set('password')}
                style={{ ...inputStyle, paddingRight: '46px' }}
                onFocus={e => e.target.style.borderColor = '#06b6d4'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#334155' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white', border: 'none', borderRadius: '12px', padding: '15px',
            fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '8px', transition: 'opacity 0.2s',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#475569', marginTop: '24px', fontSize: '0.9rem' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#06b6d4', fontWeight: '600' }}>Create one free</Link>
        </p>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '24px', padding: '14px 16px',
          background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: '12px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center',
        }}>
          Admin demo: <span style={{ color: '#06b6d4', fontWeight: '600' }}>admin@smarttour.com</span>
          {' / '}<span style={{ color: '#06b6d4', fontWeight: '600' }}>admin123</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
