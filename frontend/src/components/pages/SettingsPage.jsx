import { useEffect, useRef, useState } from 'react'
import { Building2, FileText, ImagePlus, Moon, RefreshCw, Save, ShoppingCart, Trash2, Upload, User } from 'lucide-react'
import { api } from '../../api'
import { errorMessage } from '../../lib/format'
import { ORDER_STATUS_LABELS, ORDER_STATUSES, PERIOD_OPTIONS } from '../../lib/constants'
import { Button, Card, CardHeader, Field, FormGrid, Input, Select, Textarea } from '../ui'

const THEME_OPTIONS = [
  { value: 'system', label: 'Ikuti Sistem' },
  { value: 'light', label: 'Terang' },
  { value: 'dark', label: 'Gelap' },
]

const EMPTY_SETTINGS = {
  appearance: {
    default_theme: 'system',
    default_period: 'this_month',
  },
  business: {
    company_name: '',
    company_phone: '',
    company_email: '',
    company_address: '',
  },
  order: {
    default_status: 'draft',
    require_dp: true,
    dp_percent: 50,
  },
  invoice: {
    prefix: 'INV',
  },
}

export default function SettingsPage({ onNotify, onAppearanceSaved, onUserUpdated, onCompanyUpdated, title, description }) {
  const [settings, setSettings] = useState(EMPTY_SETTINGS)
  const [savedAt, setSavedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

  const [company, setCompany] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [deletingLogo, setDeletingLogo] = useState(false)

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const logoInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/settings')
      setSettings({
        appearance: { ...EMPTY_SETTINGS.appearance, ...(res.data.data.appearance || {}) },
        business: { ...EMPTY_SETTINGS.business, ...(res.data.data.business || {}) },
        order: { ...EMPTY_SETTINGS.order, ...(res.data.data.order || {}) },
        invoice: { ...EMPTY_SETTINGS.invoice, ...(res.data.data.invoice || {}) },
      })
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat pengaturan.'))
    } finally {
      setLoading(false)
    }
  }

  const loadCompany = async () => {
    try {
      const res = await api.get('/settings/company')
      setCompany(res.data.data)
    } catch {
      // Logo tidak wajib dimuat; biarkan placeholder default.
    }
  }

  const loadProfile = async () => {
    try {
      const res = await api.get('/auth/me')
      const user = res.data.data.user
      setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
      setProfilePhotoUrl(user.avatar_url || null)
    } catch {
      // Profil admin tidak wajib dimuat.
    }
  }

  useEffect(() => {
    load()
    loadCompany()
    loadProfile()
  }, [])

  const setGroup = (group, key, value) => {
    setSettings((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }))
    setDirty(true)
  }

  const handleReset = () => {
    setSettings(EMPTY_SETTINGS)
    setDirty(true)
    setError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.put('/settings', {
        settings: {
          appearance: settings.appearance,
          business: settings.business,
          order: {
            ...settings.order,
            require_dp: Boolean(settings.order.require_dp),
            dp_percent: Number(settings.order.dp_percent || 0),
          },
          invoice: settings.invoice,
        },
      })
      setSettings({
        appearance: { ...EMPTY_SETTINGS.appearance, ...(res.data.data.appearance || {}) },
        business: { ...EMPTY_SETTINGS.business, ...(res.data.data.business || {}) },
        order: { ...EMPTY_SETTINGS.order, ...(res.data.data.order || {}) },
        invoice: { ...EMPTY_SETTINGS.invoice, ...(res.data.data.invoice || {}) },
      })
      setDirty(false)
      setSavedAt(new Date().toLocaleTimeString('id-ID'))
      onNotify('Pengaturan berhasil disimpan.')
      onAppearanceSaved?.(res.data.data)
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan pengaturan.'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogoFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const formData = new FormData()
    formData.append('logo', file)

    setUploadingLogo(true)
    setError('')
    try {
      const res = await api.post('/settings/company/logo', formData)
      setCompany(res.data.data)
      onCompanyUpdated?.(res.data.data)
      onNotify('Logo bisnis berhasil diunggah.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengunggah logo.'), 'error')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleDeleteLogo = async () => {
    setDeletingLogo(true)
    setError('')
    try {
      const res = await api.delete('/settings/company/logo')
      setCompany(res.data.data)
      onCompanyUpdated?.(res.data.data)
      onNotify('Logo bisnis dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus logo.'), 'error')
    } finally {
      setDeletingLogo(false)
    }
  }

  const handleAvatarFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setUploadingAvatar(true)
    setError('')
    try {
      const res = await api.post('/auth/profile/avatar', formData)
      const user = res.data.data.user
      setProfilePhotoUrl(user.avatar_url || null)
      onUserUpdated?.(user)
      onNotify('Foto profil berhasil diunggah.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengunggah foto profil.'), 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleDeleteAvatar = async () => {
    setDeletingAvatar(true)
    setError('')
    try {
      const res = await api.delete('/auth/profile/avatar')
      const user = res.data.data.user
      setProfilePhotoUrl(null)
      onUserUpdated?.(user)
      onNotify('Foto profil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus foto profil.'), 'error')
    } finally {
      setDeletingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setError('')
    try {
      const res = await api.put('/auth/profile', {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      })
      const user = res.data.data.user
      setProfile({ name: user.name, email: user.email, phone: user.phone || '' })
      setProfilePhotoUrl(user.avatar_url || null)
      onUserUpdated?.(user)
      onNotify('Profil admin berhasil disimpan.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menyimpan profil admin.'), 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  if (loading) {
    return <div className="page">Memuat pengaturan...</div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="page-header-actions">
          <Button variant="outline" icon={RefreshCw} onClick={handleReset}>
            Reset
          </Button>
          <Button icon={Save} onClick={handleSave} loading={saving}>
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      {error && <p className="form-error settings-error">{error}</p>}

      {dirty && <p className="settings-dirty">Ada perubahan yang belum disimpan.</p>}
      {!dirty && savedAt && <p className="settings-saved">Terakhir disimpan pukul {savedAt}.</p>}

      <div className="settings-grid">
        <Card>
          <CardHeader title="Tampilan" subtitle="Preferensi tampilan aplikasi" actions={<Moon size={16} />} />
          <div className="settings-body">
            <FormGrid>
              <Field label="Tema Default">
                <Select value={settings.appearance.default_theme} onChange={(event) => setGroup('appearance', 'default_theme', event.target.value)}>
                  {THEME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Periode Default Dashboard">
                <Select value={settings.appearance.default_period} onChange={(event) => setGroup('appearance', 'default_period', event.target.value)}>
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </FormGrid>
          </div>
        </Card>

        <Card>
          <CardHeader title="Profil Bisnis" subtitle="Identitas perusahaan di invoice" actions={<Building2 size={16} />} />
          <div className="settings-body">
            <FormGrid>
              <Field label="Nama Perusahaan">
                <Input value={settings.business.company_name || ''} onChange={(event) => setGroup('business', 'company_name', event.target.value)} />
              </Field>
              <Field label="Telepon">
                <Input value={settings.business.company_phone || ''} onChange={(event) => setGroup('business', 'company_phone', event.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={settings.business.company_email || ''} onChange={(event) => setGroup('business', 'company_email', event.target.value)} />
              </Field>
              <Field label="Alamat" className="field-span">
                <Textarea rows={2} value={settings.business.company_address || ''} onChange={(event) => setGroup('business', 'company_address', event.target.value)} />
              </Field>
            </FormGrid>
          </div>
        </Card>

        <Card>
          <CardHeader title="Logo Bisnis" subtitle="Identitas visual perusahaan di aplikasi & invoice" actions={<ImagePlus size={16} />} />
          <div className="settings-body">
            <div className="logo-manage">
              <div className="logo-preview">
                {company?.logo_url ? <img src={company.logo_url} alt="Logo bisnis" /> : <span>F</span>}
              </div>
              <div className="logo-actions">
                <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleLogoFile} />
                <Button variant="outline" icon={Upload} onClick={() => logoInputRef.current?.click()} loading={uploadingLogo}>
                  Upload Logo
                </Button>
                {company?.logo_url && (
                  <>
                    <Button variant="outline" icon={ImagePlus} onClick={() => logoInputRef.current?.click()} loading={uploadingLogo}>
                      Ganti Logo
                    </Button>
                    <Button variant="danger" icon={Trash2} onClick={handleDeleteLogo} loading={deletingLogo}>
                      Hapus Logo
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Profil Admin" subtitle="Identitas akun administrator" actions={<User size={16} />} />
          <div className="settings-body">
            <div className="profile-photo-row">
              <div className="profile-photo">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Foto profil" />
                ) : (
                  <span>{(profile.name || 'A').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="profile-photo-actions">
                <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleAvatarFile} />
                <Button variant="outline" size="sm" icon={Upload} onClick={() => avatarInputRef.current?.click()} loading={uploadingAvatar}>
                  {profilePhotoUrl ? 'Ganti Foto' : 'Upload Foto'}
                </Button>
                {profilePhotoUrl && (
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={handleDeleteAvatar} loading={deletingAvatar}>
                    Hapus Foto
                  </Button>
                )}
              </div>
            </div>
            <FormGrid>
              <Field label="Nama" required>
                <Input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
              </Field>
              <Field label="Email" required hint="Email ini dipakai untuk login.">
                <Input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
              </Field>
              <Field label="No. Telepon" className="field-span">
                <Input value={profile.phone || ''} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
              </Field>
            </FormGrid>
            <div className="settings-actions">
              <Button icon={Save} onClick={handleSaveProfile} loading={savingProfile}>
                Simpan Profil
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Order" subtitle="Pengaturan default pembuatan pesanan" actions={<ShoppingCart size={16} />} />
          <div className="settings-body">
            <FormGrid>
              <Field label="Status Default Order">
                <Select value={settings.order.default_status} onChange={(event) => setGroup('order', 'default_status', event.target.value)}>
                  {ORDER_STATUSES.map((key) => (
                    <option key={key} value={key}>
                      {ORDER_STATUS_LABELS[key]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Persentase DP (%)">
                <Input type="number" min="0" max="100" value={settings.order.dp_percent} onChange={(event) => setGroup('order', 'dp_percent', event.target.value)} />
              </Field>
              <Field label="Wajib DP" className="field-span">
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.order.require_dp)}
                    onChange={(event) => setGroup('order', 'require_dp', event.target.checked)}
                  />
                  <span className="switch" aria-hidden="true" />
                  <span className="switch-label">{settings.order.require_dp ? 'Pesanan wajib DP sebelum diproses' : 'Pesanan tidak wajib DP'}</span>
                </label>
              </Field>
            </FormGrid>
          </div>
        </Card>

        <Card>
          <CardHeader title="Invoice" subtitle="Format penomoran invoice" actions={<FileText size={16} />} />
          <div className="settings-body">
            <FormGrid>
              <Field label="Prefix Nomor Invoice" hint="Format: {prefix}-YYYYMMDD-000">
                <Input value={settings.invoice.prefix || ''} onChange={(event) => setGroup('invoice', 'prefix', event.target.value)} />
              </Field>
            </FormGrid>
          </div>
        </Card>
      </div>
    </div>
  )
}
