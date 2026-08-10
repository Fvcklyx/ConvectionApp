import { useState } from 'react'
import { Eye, EyeOff, Plus, Star, Trash2 } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDate } from '../../lib/format'
import { PUBLISHED_LABELS, PUBLISHED_VARIANTS } from '../../lib/constants'
import {
  Button,
  Card,
  ConfirmDialog,
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

const DEFAULT_PER_PAGE = 10

function Stars({ rating }) {
  const value = Number(rating) || 0
  const filled = Math.round(value / 2)
  const max = 5

  return (
    <span className="stars" aria-label={`Rating ${value} dari 10`} title={`${value}/10`}>
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          size={13}
          className={index < filled ? 'stars-filled' : 'stars-empty'}
          fill={index < filled ? 'currentColor' : 'none'}
        />
      ))}
      <span className="stars-value">{value}</span>
    </span>
  )
}

export default function ReviewsPage({ rows, orders, refresh, onNotify, title, description, brandName }) {
  const [query, setQuery] = useState('')
  const [published, setPublished] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const availableOrders = orders.filter(
    (order) => order.status === 'paid' && !rows.some((review) => review.order_id === order.id),
  )

  const openCreate = () => {
    setFormError('')
    setModal({ mode: 'create' })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.post('/reviews', {
        order_id: form.get('order_id'),
        rating: Number(form.get('rating')),
        review_text: form.get('review_text') || null,
        is_published: form.get('is_published') === '1',
      })
      await refresh()
      setModal(null)
      onNotify('Review berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat review.'))
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (review) => {
    try {
      if (review.is_published) {
        await api.patch(`/reviews/${review.id}/unpublish`)
        onNotify('Review diturunkan.')
      } else {
        await api.patch(`/reviews/${review.id}/publish`)
        onNotify('Review diterbitkan.')
      }
      await refresh()
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengubah status review.'), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/reviews/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Review dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus review.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
    const matchesPublished = published === 'all' || String(row.is_published) === published
    return matchesQuery && matchesPublished
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setQuery('')
    setPublished('all')
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
            Buat Review
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari review / customer..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={published} onChange={(event) => { setPublished(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              <option value="true">Terbit</option>
              <option value="false">Draft</option>
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={Star}
            title={query || published !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada review'}
            description={
              query || published !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : `Buat review dari order yang sudah lunas untuk pelanggan ${brandName}.`
            }
            action={
              !query && published === 'all' ? (
                <Button icon={Plus} onClick={openCreate}>
                  Buat Review
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
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.order?.order_code || `Order #${row.order_id}`}</td>
                      <td>{row.customer?.name || row.order?.customer?.name || `Customer #${row.customer_id}`}</td>
                      <td>
                        <Stars rating={row.rating} />
                      </td>
                      <td className="cell-text">
                        <span className="cell-clamp">{row.review_text || '-'}</span>
                      </td>
                      <td>
                        <StatusBadge value={row.is_published} labels={PUBLISHED_LABELS} variants={PUBLISHED_VARIANTS} fallback="false" />
                      </td>
                      <td>{formatDate(row.created_at)}</td>
                      <td className="align-right">
                        <Button
                          variant={row.is_published ? 'outline' : 'primary'}
                          size="sm"
                          icon={row.is_published ? EyeOff : Eye}
                          onClick={() => togglePublish(row)}
                        >
                          {row.is_published ? 'Tutup' : 'Terbitkan'}
                        </Button>
                        <Button variant="ghost" size="sm" className="icon-btn-danger" onClick={() => setDeleting(row)}>
                          <Trash2 size={15} />
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
        title="Buat Review"
        subtitle="Review untuk order yang sudah lunas."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="review-form" type="submit" loading={saving}>
              Simpan Review
            </Button>
          </>
        }
      >
        <form id="review-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Order" required className="field-span">
              <Select name="order_id" required>
                <option value="">Pilih order lunas...</option>
                {availableOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — {order.customer?.name || `Customer #${order.customer_id}`}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Rating" required hint="Skala 1–10">
              <Select name="rating" defaultValue="5" required>
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1} / 10
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status Publikasi">
              <Select name="is_published" defaultValue="0">
                <option value="0">Draft</option>
                <option value="1">Terbit</option>
              </Select>
            </Field>
            <Field label="Isi Review" className="field-span">
              <Textarea name="review_text" rows={3} placeholder="Ulasan customer tentang produk & layanan" />
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Review?"
        message={`Review untuk "${deleting?.order?.order_code || `Order #${deleting?.order_id}`}" akan dihapus secara permanen.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
