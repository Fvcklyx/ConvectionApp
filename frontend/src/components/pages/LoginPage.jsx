import { useEffect, useState } from 'react'
import { ArrowLeft, Lock, Mail, Phone, User, Shirt, Scissors, Package } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import AppLoading from '../AppLoading'
import { cachedBusinessName, rememberBusinessName } from '../../lib/branding'
import { api, TOKEN_KEY } from '../../api'
import { errorMessage } from '../../lib/format'
import { setStorageItem } from '../../lib/storage'
import { Button, ErrorBanner, Field, Input } from '../ui'

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [brandLoading, setBrandLoading] = useState(true)
  const [brand, setBrand] = useState(() => ({ name: cachedBusinessName(), logoUrl: null }))

  useEffect(() => {
    const controller = new AbortController()
    api
      .get('/company/profile', { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return
        const data = res.data?.data
        rememberBusinessName(data?.name)
        setBrand({
          name: data?.name?.trim() || 'FRNDLY',
          logoUrl: data?.logo_url || null,
        })
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setBrandLoading(false) })
    return () => controller.abort()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        })
        const { token, user } = res.data.data
        setStorageItem(TOKEN_KEY, token)
        onLogin(token, user)
      } else {
        // Register new customer account
        const res = await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        })
        const { token, user } = res.data.data
        setStorageItem(TOKEN_KEY, token)
        onLogin(token, user)
      }
    } catch (err) {
      setError(errorMessage(err, mode === 'login' ? 'Login gagal. Periksa kembali email dan password Anda.' : 'Pendaftaran akun gagal. Silakan coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') {
      setMode('login')
      setForm((prev) => ({ ...prev, email: 'admin@frndly.test', password: 'password123' }))
    } else {
      setMode('login')
      setForm((prev) => ({ ...prev, email: 'customer@frndly.test', password: 'password123' }))
    }
  }

  if (brandLoading) return <AppLoading message="Menyiapkan halaman masuk" />

  return (
    <div className="auth-screen market-auth">
      <div className="auth-topline"><a href="/"><ArrowLeft size={17} /> Kembali ke beranda</a><ThemeToggle /></div>
      <div className="auth-layout">
      <aside className="auth-story"><span className="auth-story-brand">{brand.name} / CUSTOM APPAREL</span><div className="auth-story-art" aria-hidden="true"><Shirt size={140} strokeWidth={1} /><span><Scissors size={28} /></span><span><Package size={28} /></span></div><h2>{mode === 'login' ? 'Cerita hebat dimulai dari sini.' : 'Buat ruang untuk ide barumu.'}</h2><p>Satu tempat untuk kebutuhan apparel custom dan pengelolaan bisnis konveksi.</p><button type="button" className="store-button" disabled={loading} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</button></aside>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Beranda
          </a>
          <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>
            {mode === 'login' ? 'PORTAL MASUK' : 'REGISTRASI KLIEN'}
          </span>
        </div>

        <div className="auth-brand">
          {brand.logoUrl ? (
            <div className="brand-logo brand-logo-lg brand-logo-img">
              <img src={brand.logoUrl} alt="Logo bisnis" />
            </div>
          ) : (
            <div className="brand-logo brand-logo-lg">F</div>
          )}
          <p className="eyebrow">{brand.name}</p>
          <h1>{mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Akses pengelolaan bisnis atau jelajahi katalog customer.'
              : 'Daftar untuk menjelajahi katalog dan menyiapkan draft kebutuhan custom.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--surface-muted)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            gap: 4,
            marginBottom: 6,
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setError('') }}
            style={{
              padding: '8px 12px',
              border: 0,
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === 'login' ? 'var(--surface)' : 'transparent',
              color: mode === 'login' ? 'var(--color-primary)' : 'var(--text-muted)',
              boxShadow: mode === 'login' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError('') }}
            style={{
              padding: '8px 12px',
              border: 0,
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === 'register' ? 'var(--surface)' : 'transparent',
              color: mode === 'register' ? 'var(--color-primary)' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Daftar Akun
          </button>
        </div>

        {mode === 'register' && (
          <>
            <Field label="Nama Lengkap" required>
              <div className="input-affix">
                <User size={15} />
                <Input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </Field>
            <Field label="No. WhatsApp / Telepon">
              <div className="input-affix">
                <Phone size={15} />
                <Input
                  type="tel"
                  placeholder="081234567890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </Field>
          </>
        )}

        <Field label="Email" required>
          <div className="input-affix">
            <Mail size={15} />
            <Input
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              autoComplete="email"
            />
          </div>
        </Field>

        <Field label="Password" required hint={mode === 'register' ? 'Minimal 12 karakter' : undefined}>
          <div className="input-affix">
            <Lock size={15} />
            <Input
              type="password"
              minLength={mode === 'register' ? 12 : undefined}
              maxLength={255}
              placeholder="••••••••"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
        </Field>

        <ErrorBanner message={error} />

        <Button className="auth-submit" type="submit" loading={loading}>
          {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
        </Button>

        {/* Demo credentials must not be advertised in production builds. */}
        {import.meta.env.DEV && <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 12,
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Akses Cepat Demo:</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              style={{
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              style={{
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Demo Customer
            </button>
          </div>
        </div>}
      </form>
      </div>
    </div>
  )
}
