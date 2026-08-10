import { useEffect, useState } from 'react'
import { Building2, FileText, Moon, RefreshCw, ShoppingCart, Save } from 'lucide-react'
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

export default function SettingsPage({ onNotify, onAppearanceSaved, title, description }) {
  const [settings, setSettings] = useState(EMPTY_SETTINGS)
  const [savedAt, setSavedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

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

  useEffect(() => {
    load()
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
