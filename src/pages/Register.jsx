import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', setupKey: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (token) return <Navigate to="/" replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (form.password.length < 6) return setErr('Password must be at least 6 characters.')
    setBusy(true)
    try {
      await register({ ...form, email: form.email.trim() })
      navigate('/')
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand">
          <div className="brand-name">Sales CRM</div>
          <div className="brand-sub">Lead Management</div>
        </div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-sub">A valid setup key is required to register.</p>

        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={set('name')} placeholder="Your name" autoFocus />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" />
        </div>
        <div className="field">
          <label>Setup key</label>
          <input type="password" value={form.setupKey} onChange={set('setupKey')} placeholder="Provided by your administrator" />
        </div>

        {err && <div className="auth-error">{err}</div>}

        <button className="btn btn-primary auth-submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>

        <div className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  )
}
