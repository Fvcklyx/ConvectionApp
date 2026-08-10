import { useState } from 'react'
import { Pencil, Plus, Quote, Sparkles, Trash2 } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDate } from '../../lib/format'
import { FEATURED_LABELS, FEATURED_VARIANTS, PUBLISHED_LABELS, PUBLISHED_VARIANTS } from '../../lib/constants'
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

const EMPTY_FORM = {
  quote: '',
  is_featured: false,
  is_published: false,
}

export default function TestimonialsPage({ rows, reviews, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)

  const sourceReviews = reviews.filter((review) => review.is_published)

  const openCreate = () => {
    setFormError('')
    setModal({ mode: 'create', form: { ...EMPTY_FORM, review_id: '' } })
  }

  const openEdit = (record) => {
    setFormError('')
    setModal({
      mode: 'edit',
      record,
      form: {
        quote: record.quote || '',
        is_featured: Boolean(record.is_featured),
        is_published: Boolean(record.is_published),
      },
    })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const m = modal

    try {
      await api.post('/testimonials', {
        review_id: m.form.review_id,
        quote: m.form.quote,
        is_featured: m.form.is_featured,
        is_published: m.form.is_published,
      })
      await refresh()
      setModal(null)
      onNotify('Testimonial berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat testimonial.'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (event, record) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const m = modal

    try {
      await api.put(`/testimonials/${record.id}`, {
        quote: m.form.quote,
        is_featured: m.form.is_featured,
        is_published: m.form.is_published,
      })
      await refresh()
      setModal(null)
      onNotify('Testimonial berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate testimonial.'))
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (record) => {
    try {
      if (record.is_published) {
        await api.patch(`/testimonials/${record.id}/unpublish`)
        onNotify('Testimonial diturunkan.')
      } else {
        await api.patch(`/testimonials/${record.id}/publish`)
        onNotify('Testimonial diterbitkan.')
      }
      await refresh()
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengubah status testimonial.'), 'error')
    }
  }

  const toggleFeature = async (record) => {
    try {
      await api.patch(`/testimonials/${record.id}/feature`)
      await refresh()
      onNotify(record.is_featured ? 'Testimonial tidak lagi featured.' : 'Testimonial dijadikan featured.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal mengubah status featured.'), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/testimonials/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Testimonial dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus testimonial.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || JSON.stringify(row).toLowerCase().includes(q)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'featured' && row.is_featured) ||
      (filter === 'draft' && !row.is_published) ||
      (filter === 'published' && row.is_published)
    return matchesQuery && matchesFilter
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setQuery('')
    setFilter('all')
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
            Buat Testimonial
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari testimonial / customer..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              <option value="featured">Featured</option>
              <option value="published">Terbit</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={Quote}
            title={query || filter !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada testimonial'}
            description={
              query || filter !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Buat testimonial dari review yang sudah terbit.'
            }
            action={
              !query && filter === 'all' ? (
                <Button icon={Plus} onClick={openCreate}>
                  Buat Testimonial
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
                    <th>Customer</th>
                    <th>Testimonial</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="cell-stack">
                        <span className="strong">{row.customer?.name || row.review?.order?.customer?.name || `Customer #${row.customer_id}`}</span>
                        <small className="mono">{row.review?.order?.order_code || ''}</small>
                      </td>
                      <td className="cell-text">
                        <span className="cell-quote">&ldquo;{row.quote}&rdquo;</span>
                      </td>
                      <td>
                        <StatusBadge value={row.is_featured} labels={FEATURED_LABELS} variants={FEATURED_VARIANTS} fallback="false" />
                      </td>
                      <td>
                        <StatusBadge value={row.is_published} labels={PUBLISHED_LABELS} variants={PUBLISHED_VARIANTS} fallback="false" />
                        <Button variant="outline" size="sm" onClick={() => togglePublish(row)}>
                          {row.is_published ? 'Turunkan' : 'Terbitkan'}
                        </Button>
                      </td>
                      <td>{formatDate(row.created_at)}</td>
                      <td className="align-right">
                        <Button variant={row.is_featured ? 'primary' : 'outline'} size="sm" icon={Sparkles} onClick={() => toggleFeature(row)}>
                          {row.is_featured ? 'Featured' : 'Jadikan Featured'}
                        </Button>
                        <Button variant="outline" size="sm" icon={Pencil} onClick={() => openEdit(row)}>
                          Edit
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
        title="Buat Testimonial"
        subtitle="Testimonial bersumber dari review terbit."
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="testimonial-form" type="submit" loading={saving}>
              Simpan Testimonial
            </Button>
          </>
        }
      >
        <form id="testimonial-form" className="modal-form" onSubmit={handleCreate}>
          <FormGrid>
            <Field label="Review" required className="field-span">
              <Select
                value={modal?.form?.review_id || ''}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, review_id: event.target.value } })}
                required
              >
                <option value="">Pilih review terbit...</option>
                {sourceReviews.map((review) => (
                  <option key={review.id} value={review.id}>
                    {review.order?.order_code || `Review #${review.id}`} — {review.customer?.name || review.order?.customer?.name || `Customer #${review.customer_id}`} ({review.rating}/10)
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Kutipan" required className="field-span">
              <Textarea
                rows={3}
                value={modal?.form?.quote || ''}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, quote: event.target.value } })}
                placeholder="Kalimat testimonial customer..."
                required
              />
            </Field>
            <Field label="Featured">
              <Select
                value={modal?.form?.is_featured ? '1' : '0'}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, is_featured: event.target.value === '1' } })}
              >
                <option value="0">Tidak</option>
                <option value="1">Featured</option>
              </Select>
            </Field>
            <Field label="Status Publikasi">
              <Select
                value={modal?.form?.is_published ? '1' : '0'}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, is_published: event.target.value === '1' } })}
              >
                <option value="0">Draft</option>
                <option value="1">Terbit</option>
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Testimonial"
        subtitle={modal?.record?.customer?.name || ''}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="testimonial-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="testimonial-edit-form" className="modal-form" onSubmit={(event) => handleUpdate(event, modal.record)}>
          <FormGrid>
            <Field label="Kutipan" required className="field-span">
              <Textarea
                rows={3}
                value={modal?.form?.quote || ''}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, quote: event.target.value } })}
                required
              />
            </Field>
            <Field label="Featured">
              <Select
                value={modal?.form?.is_featured ? '1' : '0'}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, is_featured: event.target.value === '1' } })}
              >
                <option value="0">Tidak</option>
                <option value="1">Featured</option>
              </Select>
            </Field>
            <Field label="Status Publikasi">
              <Select
                value={modal?.form?.is_published ? '1' : '0'}
                onChange={(event) => setModal({ ...modal, form: { ...modal.form, is_published: event.target.value === '1' } })}
              >
                <option value="0">Draft</option>
                <option value="1">Terbit</option>
              </Select>
            </Field>
          </FormGrid>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Testimonial?"
        message={`Testimonial dari "${deleting?.customer?.name || `Customer #${deleting?.customer_id}`}" akan dihapus secara permanen.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
