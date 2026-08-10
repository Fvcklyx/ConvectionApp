import { useState } from 'react'
import { Eye, MapPin, Pencil, Phone, Plus, Trash2, Users } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatRp, pad } from '../../lib/format'
import { ACTIVE_LABELS, ACTIVE_VARIANTS } from '../../lib/constants'
import {
  Button,
  Card,
  ConfirmDialog,
  Dropdown,
  EmptyState,
  Field,
  FormGrid,
  FormSection,
  MenuItem,
  Modal,
  PageHeader,
  Pagination,
  Select,
  StatusBadge,
  TableWrap,
  Textarea,
  Toolbar,
} from '../ui'

const DEFAULT_PER_PAGE = 10

export default function CustomersPage({ rows, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)
  const [viewing, setViewing] = useState(null)

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post('/customers', {
        company_id: 1,
        customer_code: form.get('customer_code'),
        name: form.get('name'),
        phone: form.get('phone') || null,
        email: form.get('email') || null,
        address: form.get('address') || null,
        city: form.get('city') || null,
        province: form.get('province') || null,
        notes: form.get('notes') || null,
        status: form.get('status') || 'active',
      })
      await refresh()
      setModal(null)
      onNotify('Customer berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat customer.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, customer) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/customers/${customer.id}`, {
        name: form.get('name'),
        phone: form.get('phone') || null,
        email: form.get('email') || null,
        address: form.get('address') || null,
        city: form.get('city') || null,
        province: form.get('province') || null,
        notes: form.get('notes') || null,
        status: form.get('status') || 'active',
      })
      await refresh()
      setModal(null)
      onNotify('Customer berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate customer.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/customers/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Customer berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus customer.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const matchesQuery = !query || JSON.stringify(row).toLowerCase().includes(query.trim().toLowerCase())
    const matchesStatus = status === 'all' || row.status === status
    return matchesQuery && matchesStatus
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
    setPage(1)
  }

  const closeModal = () => {
    setModal(null)
    setFormError('')
  }

  return (
    <div className="page">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
            Tambah Customer
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari customer..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              {Object.entries(ACTIVE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query || status !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada customer'}
            description={
              query || status !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Tambahkan customer pertama untuk mulai mengelola data pelanggan FRNDLY.'
            }
            action={
              !query && status === 'all' ? (
                <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
                  Tambah Customer
                </Button>
              ) : (
                <Button variant="outline" onClick={resetFilters}>
                  Reset Pencarian
                </Button>
              )
            }
          />
        ) : (
          <>
            <TableWrap>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kontak</th>
                    <th>Kota</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono">{row.customer_code}</td>
                      <td className="strong">{row.name}</td>
                      <td className="cell-stack">
                        <span>{row.email || '-'}</span>
                        <span className="cell-muted">{row.phone || '-'}</span>
                      </td>
                      <td>{row.city || '-'}</td>
                      <td>{row.orders_count ?? '-'}</td>
                      <td>
                        <StatusBadge value={row.status} labels={ACTIVE_LABELS} variants={ACTIVE_VARIANTS} fallback="inactive" />
                      </td>
                      <td className="align-right">
                        <Dropdown
                          trigger={<span className="more-btn"><Eye size={15} /></span>}
                          label="Aksi customer"
                          align="end"
                        >
                          <MenuItem icon={Eye} onClick={() => setViewing(row)}>
                            Lihat Detail
                          </MenuItem>
                          <MenuItem icon={Pencil} onClick={() => setModal({ mode: 'edit', record: row })}>
                            Edit
                          </MenuItem>
                          <MenuItem icon={Trash2} danger onClick={() => setDeleting(row)}>
                            Hapus
                          </MenuItem>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
            <Pagination page={safePage} pageSize={pageSize} total={filtered.length} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1) }} />
          </>
        )}
      </Card>

      <Modal
        open={modal?.mode === 'create'}
        title="Tambah Customer"
        subtitle="Data pelanggan baru FRNDLY."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="customer-form" type="submit" loading={saving}>
              Simpan Customer
            </Button>
          </>
        }
      >
        <form id="customer-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Kode Customer" required>
              <input className="input" name="customer_code" defaultValue={`CUS-${pad(rows.length + 1, 4)}`} required />
            </Field>
            <Field label="Nama" required>
              <input className="input" name="name" placeholder="Nama customer" required />
            </Field>
            <Field label="Telepon">
              <input className="input" name="phone" placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Email">
              <input className="input" name="email" type="email" placeholder="email@example.com" />
            </Field>
            <Field label="Kota">
              <input className="input" name="city" placeholder="Kota" />
            </Field>
            <Field label="Provinsi">
              <input className="input" name="province" placeholder="Provinsi" />
            </Field>
            <Field label="Alamat">
              <Textarea name="address" rows={2} placeholder="Alamat lengkap" />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="active">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </Select>
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} placeholder="Catatan customer" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Customer"
        subtitle={`${modal?.record?.customer_code || ''} — ${modal?.record?.name || ''}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="customer-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form
          id="customer-edit-form"
          className="modal-form"
          onSubmit={(event) => handleEdit(event, modal.record)}
        >
          <FormGrid>
            <Field label="Nama" required>
              <input className="input" name="name" defaultValue={modal.record.name} required />
            </Field>
            <Field label="Telepon">
              <input className="input" name="phone" defaultValue={modal.record.phone || ''} placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Email">
              <input className="input" name="email" type="email" defaultValue={modal.record.email || ''} placeholder="email@example.com" />
            </Field>
            <Field label="Kota">
              <input className="input" name="city" defaultValue={modal.record.city || ''} placeholder="Kota" />
            </Field>
            <Field label="Provinsi">
              <input className="input" name="province" defaultValue={modal.record.province || ''} placeholder="Provinsi" />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={modal.record.status || 'active'}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </Select>
            </Field>
            <Field label="Alamat" className="field-span">
              <Textarea name="address" rows={2} defaultValue={modal.record.address || ''} placeholder="Alamat lengkap" />
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} defaultValue={modal.record.notes || ''} placeholder="Catatan customer" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={Boolean(viewing)}
        title="Detail Customer"
        subtitle={viewing?.customer_code}
        size="md"
        onClose={() => setViewing(null)}
      >
        {viewing && (
          <div className="detail-grid">
            <FormSection title="Profil">
              <div className="detail-row">
                <span className="detail-label">Nama</span>
                <strong>{viewing.name}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <StatusBadge value={viewing.status} labels={ACTIVE_LABELS} variants={ACTIVE_VARIANTS} fallback="inactive" />
              </div>
              <div className="detail-row">
                <span className="detail-label">Telepon</span>
                <span><Phone size={13} /> {viewing.phone || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span>{viewing.email || '-'}</span>
              </div>
            </FormSection>
            <FormSection title="Lokasi">
              <div className="detail-row">
                <span className="detail-label">Kota</span>
                <span><MapPin size={13} /> {viewing.city || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Provinsi</span>
                <span>{viewing.province || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Alamat</span>
                <span>{viewing.address || '-'}</span>
              </div>
            </FormSection>
            <FormSection title="Statistik">
              <div className="detail-row">
                <span className="detail-label">Total Order</span>
                <strong>{viewing.orders_count ?? '-'}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Belanja</span>
                <strong>{viewing.total_spent ? formatRp(viewing.total_spent) : '-'}</strong>
              </div>
            </FormSection>
            <FormSection title="Catatan">
              <p className="detail-notes">{viewing.notes || '-'}</p>
            </FormSection>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Customer?"
        message={`Data customer "${deleting?.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
