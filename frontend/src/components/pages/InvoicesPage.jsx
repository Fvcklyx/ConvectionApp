import { useState } from 'react'
import { Download, FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '../../api'
import { downloadPdf, errorMessage, formatRp, todayYmd } from '../../lib/format'
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANTS, INVOICE_STATUSES } from '../../lib/constants'
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
  SearchField,
  Select,
  StatusBadge,
  TableWrap,
} from '../ui'

const DEFAULT_PER_PAGE = 10

export default function InvoicesPage({ rows, orders, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post('/invoices', {
        order_id: Number(form.get('order_id')),
        invoice_code: form.get('invoice_code'),
        total_amount: Number(form.get('total_amount')),
        paid_amount: Number(form.get('paid_amount') || 0),
        status: form.get('status') || 'draft',
      })
      await refresh()
      setModal(null)
      onNotify('Invoice berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat invoice.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, invoice) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)
    const total = Number(form.get('total_amount') || 0)
    const paid = Number(form.get('paid_amount') || 0)

    try {
      await api.put(`/invoices/${invoice.id}`, {
        total_amount: total,
        paid_amount: paid,
        outstanding_amount: Math.max(0, total - paid),
        status: form.get('status') || 'draft',
      })
      await refresh()
      setModal(null)
      onNotify('Invoice berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate invoice.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/invoices/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Invoice berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus invoice.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async (invoice) => {
    try {
      await downloadPdf(invoice)
      onNotify('PDF invoice berhasil diunduh.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengunduh PDF.'), 'error')
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
    const matchesStatus = status === 'all' || row.status === status
    return matchesQuery && matchesStatus
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / DEFAULT_PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * DEFAULT_PER_PAGE, safePage * DEFAULT_PER_PAGE)

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
            Buat Invoice
          </Button>
        }
      />

      <Card>
        <div className="toolbar">
          <SearchField value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder="Cari invoice..." />
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              {INVOICE_STATUSES.map((key) => (
                <option key={key} value={key}>
                  {INVOICE_STATUS_LABELS[key]}
                </option>
              ))}
            </Select>
          </div>
          <div className="toolbar-spacer" />
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={query || status !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada invoice'}
            description={
              query || status !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Buat invoice pertama untuk mulai menerbitkan tagihan FRNDLY.'
            }
            action={
              !query && status === 'all' ? (
                <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
                  Buat Invoice
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
                    <th>Order</th>
                    <th className="align-right">Total</th>
                    <th className="align-right">Terbayar</th>
                    <th className="align-right">Sisa</th>
                    <th>Status</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.invoice_code}</td>
                      <td className="mono">{row.order?.order_code || `Order #${row.order_id}`}</td>
                      <td className="align-right strong">{formatRp(row.total_amount)}</td>
                      <td className="align-right">{formatRp(row.paid_amount)}</td>
                      <td className="align-right">{formatRp(row.outstanding_amount)}</td>
                      <td>
                        <StatusBadge value={row.status} labels={INVOICE_STATUS_LABELS} variants={INVOICE_STATUS_VARIANTS} fallback="draft" />
                      </td>
                      <td className="align-right">
                        <Dropdown trigger={<span className="more-btn"><Pencil size={15} /></span>} label="Aksi invoice" align="end">
                          <MenuItem icon={Download} onClick={() => handleDownload(row)}>
                            Download PDF
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
            <Pagination page={safePage} pageSize={DEFAULT_PER_PAGE} total={filtered.length} onPage={setPage} />
          </>
        )}
      </Card>

      <Modal
        open={modal?.mode === 'create'}
        title="Buat Invoice"
        subtitle="Terbitkan tagihan dari order."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="invoice-form" type="submit" loading={saving}>
              Simpan Invoice
            </Button>
          </>
        }
      >
        <form id="invoice-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Order" required className="field-span">
              <Select name="order_id" required>
                <option value="">Pilih order...</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — {formatRp(order.grand_total)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Kode Invoice" required>
              <input className="input" name="invoice_code" defaultValue={`INV-${todayYmd()}-001`} required />
            </Field>
            <Field label="Total" required>
              <input className="input" name="total_amount" type="number" min="0" step="0.01" placeholder="Total invoice" required />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="draft">
                {INVOICE_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {INVOICE_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Invoice"
        subtitle={modal?.record?.invoice_code || ''}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="invoice-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="invoice-edit-form" className="modal-form" onSubmit={(event) => handleEdit(event, modal.record)}>
          <FormGrid>
            <Field label="Total" required>
              <input className="input" name="total_amount" type="number" min="0" step="0.01" defaultValue={modal.record.total_amount} required />
            </Field>
            <Field label="Terbayar">
              <input className="input" name="paid_amount" type="number" min="0" step="0.01" defaultValue={modal.record.paid_amount} />
            </Field>
            <Field label="Status" className="field-span">
              <Select name="status" defaultValue={modal.record.status || 'draft'}>
                {INVOICE_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {INVOICE_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Invoice?"
        message={`Invoice "${deleting?.invoice_code}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
