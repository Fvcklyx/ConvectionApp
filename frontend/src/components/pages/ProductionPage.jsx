import { useState } from 'react'
import { ArrowRight, Clock3, Factory, PlayCircle } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDateTime } from '../../lib/format'
import {
  PRODUCTION_STATUS_LABELS,
  PRODUCTION_STATUS_VARIANTS,
  PRODUCTION_STATUSES,
} from '../../lib/constants'
import {
  Button,
  Card,
  EmptyState,
  Field,
  FormGrid,
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
  return (
    <div className="status-path" aria-label="Alur status produksi">
      {PRODUCTION_STATUSES.map((status, index) => (
        <div
          key={status}
          className={cx(
            'status-step',
            status === current && 'status-step-active',
            PRODUCTION_STATUSES.indexOf(current) > index && 'status-step-done',
          )}
        >
          <span className="status-step-dot" />
          <span className="status-step-label">{PRODUCTION_STATUS_LABELS[status]}</span>
        </div>
      ))}
    </div>
  )
}

function Timeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="muted-empty">Belum ada event produksi.</p>
  }

  const sorted = [...events].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

  return (
    <ul className="timeline">
      {sorted.map((event) => (
        <li key={event.id} className="timeline-item">
          <span className={cx('timeline-dot', `badge-${PRODUCTION_STATUS_VARIANTS[event.status] || 'neutral'}`)} />
          <div className="timeline-body">
            <div className="timeline-head">
              <strong>{PRODUCTION_STATUS_LABELS[event.status] || event.status}</strong>
              <time>{formatDateTime(event.created_at)}</time>
            </div>
            {event.notes && <p>{event.notes}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function ProductionPage({ rows, orders, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const productionOrderIds = new Set(rows.map((row) => Number(row.order_id)))
  const availableOrders = orders.filter((order) => !productionOrderIds.has(Number(order.id)))

  const openCreate = () => {
    setFormError('')
    setModal({ mode: 'create' })
  }

  const openUpdate = (record) => {
    setFormError('')
    setModal({ mode: 'update', record })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post(`/orders/${form.get('order_id')}/production`, {
        status: form.get('status') || 'design',
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Production order berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat production order.'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (event, record) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.patch(`/orders/${record.order_id}/production/status`, {
        status: form.get('status'),
        notes: form.get('notes') || null,
      })
      await refresh()
      setModal(null)
      onNotify('Status produksi berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal memperbarui status produksi.'))
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
          <Button icon={PlayCircle} onClick={openCreate} disabled={availableOrders.length === 0}>
            Mulai Produksi
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari produksi..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              {PRODUCTION_STATUSES.map((key) => (
                <option key={key} value={key}>
                  {PRODUCTION_STATUS_LABELS[key]}
                </option>
              ))}
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={Factory}
            title={query || status !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada produksi'}
            description={
              query || status !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Mulai production order untuk memantau proses produksi pesanan FRNDLY.'
            }
            action={
              !query && status === 'all' && availableOrders.length > 0 ? (
                <Button icon={PlayCircle} onClick={openCreate}>
                  Mulai Produksi
                </Button>
              ) : (
                !query && status === 'all' ? null : (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Pencarian
                  </Button>
                )
              )
            }
          />
        ) : (
          <>
            <TableWrap>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Kode Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Mulai</th>
                    <th>Selesai</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.order?.order_code || `Order #${row.order_id}`}</td>
                      <td>{row.order?.customer?.name || `Customer #${row.order?.customer_id}`}</td>
                      <td>
                        <StatusBadge value={row.status} labels={PRODUCTION_STATUS_LABELS} variants={PRODUCTION_STATUS_VARIANTS} fallback="design" />
                      </td>
                      <td>{formatDateTime(row.started_at)}</td>
                      <td>{row.completed_at ? formatDateTime(row.completed_at) : '-'}</td>
                      <td className="align-right">
                        <Button variant="ghost" size="sm" onClick={() => setDetail(row)}>
                          Timeline
                        </Button>
                        <Button variant="outline" size="sm" icon={ArrowRight} onClick={() => openUpdate(row)}>
                          Update
                        </Button>
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
        title="Mulai Produksi"
        subtitle="Buat production order untuk pesanan."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="production-form" type="submit" loading={saving}>
              Mulai Produksi
            </Button>
          </>
        }
      >
        <form id="production-form" className="modal-form" onSubmit={handleCreate}>
          {availableOrders.length === 0 && <p className="hint">Semua pesanan sudah memiliki production order.</p>}
          <FormGrid>
            <Field label="Order" required className="field-span">
              <Select name="order_id" required>
                <option value="">Pilih order...</option>
                {availableOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — {order.customer?.name || `Customer #${order.customer_id}`}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status Awal">
              <Select name="status" defaultValue="design">
                {PRODUCTION_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {PRODUCTION_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={3} placeholder="Catatan awal produksi" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'update'}
        title="Update Status Produksi"
        subtitle={modal?.record?.order?.order_code || ''}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="production-status-form" type="submit" loading={saving}>
              Simpan Status
            </Button>
          </>
        }
      >
        <form id="production-status-form" className="modal-form" onSubmit={(event) => handleUpdate(event, modal?.record)}>
          <StatusPath current={modal?.record?.status || 'design'} />
          <FormGrid>
            <Field label="Status" required>
              <Select name="status" defaultValue={modal?.record?.status}>
                {PRODUCTION_STATUSES.map((key) => (
                  <option key={key} value={key}>
                    {PRODUCTION_STATUS_LABELS[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Catatan" className="field-span">
              <Textarea name="notes" rows={3} placeholder="Catatan perubahan status" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={Boolean(detail)}
        title="Timeline Produksi"
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
            <span className="detail-label">Customer</span>
            <span>{detail?.order?.customer?.name || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status Saat Ini</span>
            <StatusBadge value={detail?.status} labels={PRODUCTION_STATUS_LABELS} variants={PRODUCTION_STATUS_VARIANTS} fallback="design" />
          </div>
          <div className="detail-row">
            <span className="detail-label">Dimulai</span>
            <span className="with-icon"><Clock3 size={14} /> {formatDateTime(detail?.started_at)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Selesai</span>
            <span className="with-icon"><Clock3 size={14} /> {detail?.completed_at ? formatDateTime(detail.completed_at) : '-'}</span>
          </div>
        </div>
        <Timeline events={detail?.events} />
      </Modal>
    </div>
  )
}
