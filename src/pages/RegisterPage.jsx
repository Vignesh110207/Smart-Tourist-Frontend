import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone, Compass, Eye, EyeOff } from 'lucide-react'

const RegisterPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const { register } = useAuth()
  const navigate     = useNavigate()

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Welcome aboard 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '14px 16px 14px 46px', color: 'white', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const labelStyle = { color: 'rgba(255,255,255,0.65)', fontSize: '0.83rem', fontWeight: '600', display: 'block', marginBottom: '8px' }

  const fields = [
    { key: 'name',     label: 'Full Name',        type: 'text',     icon: <User size={16} color="#475569" />,  placeholder: 'John Doe',       required: true },
    { key: 'email',    label: 'Email Address',     type: 'email',    icon: <Mail size={16} color="#475569" />,  placeholder: 'you@example.com', required: true },
    { key: 'phone',    label: 'Phone (optional)',  type: 'tel',      icon: <Phone size={16} color="#475569" />, placeholder: '+91 9876543210',  required: false },
  ]

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
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            borderRadius: '16px', padding: '14px', marginBottom: '20px',
          }}>
            <Compass size={28} color="white" />
          </div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Create Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join thousands of happy travelers</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.key} style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>{field.label}</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  {field.icon}
                </div>
                <input
                  type={field.type} placeholder={field.placeholder}
                  required={field.required} value={form[field.key]}
                  onChange={set(field.key)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#06b6d4'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          ))}

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Lock size={16} color="#475569" />
              </div>
              <input
                type={showPw ? 'text' : 'password'} required
                placeholder="Min. 6 characters" value={form.password}
                onChange={set('password')}
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
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#475569', marginTop: '24px', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#06b6d4', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
