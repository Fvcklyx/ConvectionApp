import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { api, TOKEN_KEY } from '../../api'
import { errorMessage } from '../../lib/format'
import { Button, ErrorBanner, Field, Input } from '../ui'

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@frndly.test', password: 'password123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data.data
      localStorage.setItem(TOKEN_KEY, token)
      onLogin(token, user)
    } catch (err) {
      setError(errorMessage(err, 'Login gagal. Coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <div className="brand-logo brand-logo-lg">F</div>
          <p className="eyebrow">FRNDLY</p>
          <h1>Masuk ke panel</h1>
          <p className="auth-subtitle">Kelola bisnis konveksi Anda dalam satu tempat.</p>
        </div>

        <Field label="Email" required>
          <div className="input-affix">
            <Mail size={15} />
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              autoComplete="email"
            />
          </div>
        </Field>

        <Field label="Password" required>
          <div className="input-affix">
            <Lock size={15} />
            <Input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
        </Field>

        <ErrorBanner message={error} />

        <Button className="auth-submit" type="submit" loading={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </Button>

        <p className="hint">Akun demo: admin@frndly.test / password123</p>
      </form>
    </div>
  )
}
