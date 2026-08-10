import { useState } from 'react'
import { Clock3, Pencil, Plus, Trash2, Truck } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDateTime, formatRp } from '../../lib/format'
import { SHIPMENT_STATUS_LABELS, SHIPMENT_STATUS_VARIANTS, SHIPMENT_STATUSES } from '../../lib/constants'
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

const cx = (...parts) => parts.filter(Boolean).join(' ')

const DEFAULT_PER_PAGE = 10

function StatusPath({ current }) {
  const flow = SHIPMENT_STATUSES.filter((key) => key !== 'cancelled')

  return (
    <div className="status-path" aria-label="Alur status pengiriman">
      {flow.map((status, index) => (
        <div
          key={status}
          className={cx(
            'status-step',
            status === current && 'status-step-active',
            flow.indexOf(current) > index && 'status-step-done',
          )}
        >
          <span className="status-step-dot" />
          <span className="status-step-label">{SHIPMENT_STATUS_LABELS[status]}</span>
        </div>
      ))}
    </div>
  )
}

function Timeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="muted-empty">Belum ada event pengiriman.</p>
  }

  const sorted = [...events].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

  return (
    <ul className="timeline">
      {sorted.map((event) => (
        <li key={event.id} className="timeline-item">
          <span className={cx('timeline-dot', `badge-${SHIPMENT_STATUS_VARIANTS[event.status] || 'neutral'}`)} />
          <div className="timeline-body">
            <div className="timeline-head">
              <strong>{SHIPMENT_STATUS_LABELS[event.status] || event.status}</strong>
              <time>{formatDateTime(event.created_at)}</time>
            </div>
            {event.notes && <p>{event.notes}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function ShippingPage({ rows, orders, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const openCreate = () => {
    setFormError('')
    setModal({ mode: 'create' })
  }

  const openEdit = (record) => {
    setFormError('')
    setModal({ mode: 'edit', record })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)
    const orderId = Number(form.get('order_id'))

    try {
      await api.post(`/orders/${orderId}/shipments`, {
        recipient_name: form.get('recipient_name'),
        recipient_phone: form.get('recipient_phone') || null,
        address: form.get('address'),
        city: form.get('city') || null,
        province: form.get('province') || null,
        courier: form.get('courier') || null,
        service: form.get('service') || null,
        tracking_number: form.get('tracking_number') || null,
        shipping_cost: Number(form.get('shipping_cost') || 0),
        status: form.get('status') || 'pending',
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Shipment berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat shipment.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, record) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/orders/${record.order_id}/shipments/${record.id}`, {
        recipient_name: form.get('recipient_name'),
        recipient_phone: form.get('recipient_phone') || null,
        address: form.get('address'),
        city: form.get('city') || null,
        province: form.get('province') || null,
        courier: form.get('courier') || null,
        service: form.get('service') || null,
        tracking_number: form.get('tracking_number') || null,
        shipping_cost: Number(form.get('shipping_cost') || 0),
        status: form.get('status') || 'pending',
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Shipment berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate shipment.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/orders/${deleting.order_id}/shipments/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Shipment berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus shipment.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
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
          <Button icon={Plus} onClick={openCreate}>
            Buat Shipment
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari shipment / tracking..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              {SHIPMENT_STATUSES.map((key) => (
                <option key={key} value={key}>
                  {SHIPMENT_STATUS_LABELS[key]}
                </option>
              ))}
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={Truck}
            title={query || status !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada shipment'}
            description={
              query || status !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Buat shipment pertama untuk mengelola pengiriman FRNDLY.'
            }
            action={
              !query && status === 'all' ? (
                <Button icon={Plus} onClick={openCreate}>
                  Buat Shipment
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
                    <th>Penerima</th>
                    <th>Kurir</th>
                    <th>Tracking</th>
                    <th>Status</th>
                    <th className="align-right">Ongkir</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.order?.order_code || `Order #${row.order_id}`}</td>
                      <td className="cell-stack">
                        <span className="strong">{row.recipient_name}</span>
                        <small>{row.city ? `${row.city}${row.province ? `, ${row.province}` : ''}` : row.recipient_phone || ''}</small>
                      </td>
                      <td>{row.courier ? `${row.courier}${row.service ? ` ${row.service}` : ''}` : '-'}</td>
                      <td className="mono">{row.tracking_number || '-'}</td>
                      <td>
                        <StatusBadge value={row.status} labels={SHIPMENT_STATUS_LABELS} variants={SHIPMENT_STATUS_VARIANTS} fallback="pending" />
                      </td>
                      <td className="align-right strong">{formatRp(row.shipping_cost)}</td>
                      <td className="align-right">
                        <Dropdown trigger={<span className="more-btn"><Pencil size={15} /></span>} label="Aksi shipment" align="end">
                          <MenuItem icon={Clock3} onClick={() => setDetail(row)}>
                            Timeline
                          </MenuItem>
                          <MenuItem icon={Pencil} onClick={() => openEdit(row)}>
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
        title="Buat Shipment"
        subtitle="Data pengiriman pesanan."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="shipment-form" type="submit" loading={saving}>
              Simpan Shipment
            </Button>
          </>
        }
      >
        <form id="shipment-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Order" required className="field-span">
              <Select name="order_id" required>
                <option value="">Pilih order...</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — {order.customer?.name || `Customer #${order.customer_id}`}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Penerima" required>
              <input className="input" name="recipient_name" placeholder="Nama penerima" required />
            </Field>
            <Field label="No. HP Penerima">
              <input className="input" name="recipient_phone" placeholder="0812xxxx" />
            </Field>
            <Field label="Alamat" required className="field-span">
              <Textarea name="address" rows={2} placeholder="Alamat lengkap" required />
            </Field>
            <Field label="Kota">
              <input className="input" name="city" placeholder="Kota" />
            </Field>
            <Field label="Provinsi">
              <input className="input" name="province" placeholder="Provinsi" />
            </Field>
            <Field label="Kurir">
              <input className="input" name="courier" placeholder="JNE, J&T, SiCepat..." />
            </Field>
            <Field label="Service">
              <input className="input" name="service" placeholder="REG, YES..." />
            </Field>
            <Field label="Tracking Number">
              <input className="input" name="tracking_number" placeholder="Nomor resi" />
            </Field>
            <Field label="Ongkir">
              <input className="input" name="shipping_cost" type="number" min="0" step="0.01" defaultValue={0} />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="pending">
                {SHIPMENT_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {SHIPMENT_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} placeholder="Catatan pengiriman" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Shipment"
        subtitle={modal?.record?.order?.order_code || `Order #${modal?.record?.order_id}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="shipment-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="shipment-edit-form" className="modal-form" onSubmit={(event) => handleEdit(event, modal.record)}>
          <StatusPath current={modal?.record?.status || 'pending'} />
          <FormGrid>
            <Field label="Penerima" required>
              <input className="input" name="recipient_name" defaultValue={modal.record.recipient_name} required />
            </Field>
            <Field label="No. HP Penerima">
              <input className="input" name="recipient_phone" defaultValue={modal.record.recipient_phone || ''} />
            </Field>
            <Field label="Alamat" required className="field-span">
              <Textarea name="address" rows={2} defaultValue={modal.record.address} required />
            </Field>
            <Field label="Kota">
              <input className="input" name="city" defaultValue={modal.record.city || ''} />
            </Field>
            <Field label="Provinsi">
              <input className="input" name="province" defaultValue={modal.record.province || ''} />
            </Field>
            <Field label="Kurir">
              <input className="input" name="courier" defaultValue={modal.record.courier || ''} />
            </Field>
            <Field label="Service">
              <input className="input" name="service" defaultValue={modal.record.service || ''} />
            </Field>
            <Field label="Tracking Number">
              <input className="input" name="tracking_number" defaultValue={modal.record.tracking_number || ''} />
            </Field>
            <Field label="Ongkir">
              <input className="input" name="shipping_cost" type="number" min="0" step="0.01" defaultValue={modal.record.shipping_cost || 0} />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={modal.record.status || 'pending'}>
                {SHIPMENT_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {SHIPMENT_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={2} defaultValue={modal.record.notes || ''} />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={Boolean(detail)}
        title="Timeline Pengiriman"
        subtitle={detail?.order?.order_code || ''}
        onClose={() => setDetail(null)}
        footer={
          <Button variant="outline" onClick={() => setDetail(null)}>
            Tutup
          </Button>
        }
      >
        <div className="detail-stack">
          <div className="detail-row">
            <span className="detail-label">Penerima</span>
            <span>{detail?.recipient_name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tracking</span>
            <span className="mono">{detail?.tracking_number || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status Saat Ini</span>
            <StatusBadge value={detail?.status} labels={SHIPMENT_STATUS_LABELS} variants={SHIPMENT_STATUS_VARIANTS} fallback="pending" />
          </div>
          <div className="detail-row">
            <span className="detail-label">Dikirim</span>
            <span>{detail?.shipped_at ? formatDateTime(detail.shipped_at) : '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Selesai</span>
            <span>{detail?.delivered_at ? formatDateTime(detail.delivered_at) : '-'}</span>
          </div>
        </div>
        <Timeline events={detail?.events} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Shipment?"
        message={`Shipment untuk "${deleting?.order?.order_code || `Order #${deleting?.order_id}`}" akan dihapus secara permanen.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
