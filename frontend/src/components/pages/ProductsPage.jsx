import { useState } from 'react'
import { Package, Pencil, Plus, Trash2 } from 'lucide-react'
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
  MenuItem,
  Modal,
  PageHeader,
  Pagination,
  Select,
  StatusBadge,
  TableWrap,
  Toolbar,
} from '../ui'

const DEFAULT_PER_PAGE = 10

export default function ProductsPage({ rows, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const categories = [...new Set(rows.map((row) => row.category).filter(Boolean))].sort()

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post('/products', {
        company_id: 1,
        sku: form.get('sku'),
        name: form.get('name'),
        category: form.get('category') || null,
        material: form.get('material') || null,
        model: form.get('model') || null,
        color: form.get('color') || null,
        size: form.get('size') || null,
        price: Number(form.get('price') || 0),
        status: form.get('status') || 'active',
      })
      await refresh()
      setModal(null)
      onNotify('Produk berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat produk.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, product) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/products/${product.id}`, {
        name: form.get('name'),
        category: form.get('category') || null,
        material: form.get('material') || null,
        model: form.get('model') || null,
        color: form.get('color') || null,
        size: form.get('size') || null,
        price: Number(form.get('price') || 0),
        status: form.get('status') || 'active',
      })
      await refresh()
      setModal(null)
      onNotify('Produk berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate produk.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/products/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Produk berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus produk.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
    const matchesStatus = status === 'all' || row.status === status
    const matchesCategory = category === 'all' || row.category === category
    return matchesQuery && matchesStatus && matchesCategory
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
    setCategory('all')
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
            Tambah Produk
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari produk..."
          onReset={resetFilters}
        >
          {categories.length > 0 && (
            <div className="toolbar-filter">
              <span className="toolbar-filter-label">Kategori</span>
              <Select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}>
                <option value="all">Semua</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
          )}
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
            icon={Package}
            title={query || status !== 'all' || category !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada produk'}
            description={
              query || status !== 'all' || category !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Tambahkan produk pertama untuk mulai mengelola katalog FRNDLY.'
            }
            action={
              !query && status === 'all' && category === 'all' ? (
                <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
                  Tambah Produk
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
                    <th>SKU</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Bahan</th>
                    <th>Model</th>
                    <th>Ukuran</th>
                    <th className="align-right">Harga</th>
                    <th>Status</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono">{row.sku}</td>
                      <td className="strong">{row.name}</td>
                      <td>{row.category || '-'}</td>
                      <td>{row.material || '-'}</td>
                      <td>{row.model || '-'}</td>
                      <td>{row.size || '-'}</td>
                      <td className="align-right strong">{formatRp(row.price)}</td>
                      <td>
                        <StatusBadge value={row.status} labels={ACTIVE_LABELS} variants={ACTIVE_VARIANTS} fallback="inactive" />
                      </td>
                      <td className="align-right">
                        <Dropdown trigger={<span className="more-btn"><Pencil size={15} /></span>} label="Aksi produk" align="end">
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
        title="Tambah Produk"
        subtitle="Produk baru di katalog FRNDLY."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="product-form" type="submit" loading={saving}>
              Simpan Produk
            </Button>
          </>
        }
      >
        <form id="product-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="SKU" required>
              <input className="input" name="sku" defaultValue={`PRD-${pad(rows.length + 1, 3)}`} required />
            </Field>
            <Field label="Nama Produk" required>
              <input className="input" name="name" placeholder="Nama produk" required />
            </Field>
            <Field label="Kategori">
              <input className="input" name="category" placeholder="T-Shirt, Jaket, Lanyard..." />
            </Field>
            <Field label="Bahan">
              <input className="input" name="material" placeholder="Cotton Combed 24s..." />
            </Field>
            <Field label="Model">
              <input className="input" name="model" placeholder="Model" />
            </Field>
            <Field label="Warna">
              <input className="input" name="color" placeholder="Warna" />
            </Field>
            <Field label="Ukuran">
              <input className="input" name="size" placeholder="S, M, L, XL..." />
            </Field>
            <Field label="Harga" required>
              <input className="input" name="price" type="number" min="0" step="0.01" placeholder="85000" required />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="active">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Produk"
        subtitle={`${modal?.record?.sku || ''} — ${modal?.record?.name || ''}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="product-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="product-edit-form" className="modal-form" onSubmit={(event) => handleEdit(event, modal.record)}>
          <FormGrid>
            <Field label="Nama Produk" required>
              <input className="input" name="name" defaultValue={modal.record.name} required />
            </Field>
            <Field label="Kategori">
              <input className="input" name="category" defaultValue={modal.record.category || ''} placeholder="T-Shirt, Jaket, Lanyard..." />
            </Field>
            <Field label="Bahan">
              <input className="input" name="material" defaultValue={modal.record.material || ''} placeholder="Cotton Combed 24s..." />
            </Field>
            <Field label="Model">
              <input className="input" name="model" defaultValue={modal.record.model || ''} placeholder="Model" />
            </Field>
            <Field label="Warna">
              <input className="input" name="color" defaultValue={modal.record.color || ''} placeholder="Warna" />
            </Field>
            <Field label="Ukuran">
              <input className="input" name="size" defaultValue={modal.record.size || ''} placeholder="S, M, L, XL..." />
            </Field>
            <Field label="Harga" required>
              <input className="input" name="price" type="number" min="0" step="0.01" defaultValue={modal.record.price} required />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={modal.record.status || 'active'}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Produk?"
        message={`Produk "${deleting?.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
