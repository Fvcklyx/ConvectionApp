import { useState } from 'react'
import { CreditCard, Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDate, formatRp, todayInput } from '../../lib/format'
import { PAYMENT_TYPE_LABELS, PAYMENT_TYPE_VARIANTS } from '../../lib/constants'
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
  Textarea,
  Toolbar,
} from '../ui'

const DEFAULT_PER_PAGE = 10

export default function PaymentsPage({ rows, orders, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post('/payments', {
        order_id: Number(form.get('order_id')),
        amount: Number(form.get('amount')),
        payment_type: form.get('payment_type') || 'dp',
        payment_date: form.get('payment_date'),
        reference: form.get('reference') || null,
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Pembayaran berhasil dicatat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mencatat pembayaran.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, payment) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/payments/${payment.id}`, {
        amount: Number(form.get('amount')),
        payment_type: form.get('payment_type') || 'dp',
        payment_date: form.get('payment_date'),
        reference: form.get('reference') || null,
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Pembayaran berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate pembayaran.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/payments/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Pembayaran berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus pembayaran.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
    const matchesType = type === 'all' || row.payment_type === type
    return matchesQuery && matchesType
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setQuery('')
    setType('all')
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
            Catat Pembayaran
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari pembayaran..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Tipe</span>
            <Select value={type} onChange={(event) => { setType(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              <option value="dp">DP</option>
              <option value="final">Pelunasan</option>
              <option value="full">Lunas</option>
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={query || type !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada pembayaran'}
            description={
              query || type !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Catat DP atau pelunasan pertama untuk memantau arus kas FRNDLY.'
            }
            action={
              !query && type === 'all' ? (
                <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
                  Catat Pembayaran
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
                    <th>Order</th>
                    <th>Jumlah</th>
                    <th>Tipe</th>
                    <th>Tanggal</th>
                    <th>Referensi</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.order?.order_code || `Order #${row.order_id}`}</td>
                      <td className="align-right strong">{formatRp(row.amount)}</td>
                      <td>
                        <StatusBadge value={row.payment_type} labels={PAYMENT_TYPE_LABELS} variants={PAYMENT_TYPE_VARIANTS} fallback="dp" />
                      </td>
                      <td>{formatDate(row.payment_date)}</td>
                      <td className="mono">{row.reference || '-'}</td>
                      <td className="align-right">
                        <Dropdown trigger={<span className="more-btn"><Pencil size={15} /></span>} label="Aksi pembayaran" align="end">
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
        title="Catat Pembayaran"
        subtitle="Pencatatan DP atau pelunasan."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="payment-form" type="submit" loading={saving}>
              Simpan Pembayaran
            </Button>
          </>
        }
      >
        <form id="payment-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Order" required className="field-span">
              <Select name="order_id" required>
                <option value="">Pilih order...</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — sisa {formatRp(order.remaining_amount)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Jumlah" required>
              <input className="input" name="amount" type="number" min="1" step="0.01" placeholder="Jumlah dibayar" required />
            </Field>
            <Field label="Tipe">
              <Select name="payment_type" defaultValue="dp">
                <option value="dp">DP</option>
                <option value="final">Pelunasan</option>
              </Select>
            </Field>
            <Field label="Tanggal" required>
              <input className="input" name="payment_date" type="date" defaultValue={todayInput()} required />
            </Field>
            <Field label="Referensi">
              <input className="input" name="reference" placeholder="TRF-BCA-xxxx" />
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} placeholder="Catatan" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Pembayaran"
        subtitle={modal?.record?.order?.order_code || `Order #${modal?.record?.order_id}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="payment-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="payment-edit-form" className="modal-form" onSubmit={(event) => handleEdit(event, modal?.record)}>
          <FormGrid>
            <Field label="Jumlah" required>
              <input className="input" name="amount" type="number" min="1" step="0.01" defaultValue={modal?.record?.amount} required />
            </Field>
            <Field label="Tipe">
              <Select name="payment_type" defaultValue={modal?.record?.payment_type || 'dp'}>
                <option value="dp">DP</option>
                <option value="final">Pelunasan</option>
              </Select>
            </Field>
            <Field label="Tanggal" required>
              <input className="input" name="payment_date" type="date" defaultValue={modal?.record?.payment_date || todayInput()} required />
            </Field>
            <Field label="Referensi">
              <input className="input" name="reference" defaultValue={modal?.record?.reference || ''} placeholder="TRF-BCA-xxxx" />
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} defaultValue={modal?.record?.notes || ''} placeholder="Catatan" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Pembayaran?"
        message={`Pembayaran sebesar ${formatRp(deleting?.amount)} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
