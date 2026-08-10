import { useState } from 'react'
import { Plus, Pencil, ShoppingCart, Trash2 } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatRp, todayYmd } from '../../lib/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS, ORDER_STATUSES } from '../../lib/constants'
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

const EMPTY_ITEM = { product_id: '', product_name: '', quantity: 1, unit_price: 0 }

function StatusPath({ current }) {
  return (
    <div className="status-path" aria-label="Alur status pesanan">
      {ORDER_STATUSES.map((status, index) => (
        <div key={status} className={cx('status-step', status === current && 'status-step-active', ORDER_STATUSES.indexOf(current) > index && 'status-step-done')}>
          <span className="status-step-dot" />
          <span className="status-step-label">{ORDER_STATUS_LABELS[status]}</span>
        </div>
      ))}
    </div>
  )
}

function ItemsEditor({ items, onChange, products, productsById }) {
  const updateItem = (index, patch) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  const handleProductSelect = (index, productId) => {
    const product = productsById[productId]
    updateItem(index, {
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product ? Number(product.price) : 0,
    })
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)

  return (
    <div className="items-block">
      <div className="items-block-head">
        <h4>Item Order</h4>
        <Button variant="outline" size="sm" icon={Plus} onClick={() => onChange([...items, { ...EMPTY_ITEM }])}>
          Tambah Item
        </Button>
      </div>

      {items.length === 0 && <p className="hint">Belum ada item. Tambahkan minimal satu item.</p>}

      {items.map((item, index) => (
        <div className="item-row" key={item.id ?? index}>
          <div className="item-field item-field-product">
            <Select value={item.product_id} onChange={(event) => handleProductSelect(index, event.target.value)} aria-label="Produk">
              <option value="">Pilih produk...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} — {product.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="item-field">
            <input
              className="input"
              value={item.product_name}
              onChange={(event) => updateItem(index, { product_name: event.target.value })}
              placeholder="Nama item"
              aria-label="Nama item"
            />
          </div>
          <div className="item-field item-field-qty">
            <input
              className="input"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
              placeholder="Qty"
              aria-label="Jumlah"
            />
          </div>
          <div className="item-field item-field-price">
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(event) => updateItem(index, { unit_price: Number(event.target.value) })}
              placeholder="Harga"
              aria-label="Harga satuan"
            />
          </div>
          <div className="item-field item-field-remove">
            <button
              type="button"
              className="icon-btn icon-btn-danger"
              aria-label="Hapus item"
              disabled={items.length === 1}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}

      <div className="items-subtotal">
        <span>Subtotal</span>
        <strong>{formatRp(subtotal)}</strong>
      </div>
    </div>
  )
}

export default function OrdersPage({ rows, customers, refresh, onNotify, title, description }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE)
  const [createItems, setCreateItems] = useState([{ ...EMPTY_ITEM }])
  const [editItems, setEditItems] = useState([])
  const [createDiscount, setCreateDiscount] = useState(0)
  const [createShipping, setCreateShipping] = useState(0)
  const [editDiscount, setEditDiscount] = useState(0)
  const [editShipping, setEditShipping] = useState(0)

  const products = JSON.parse(localStorage.getItem('frndly_products') || '[]')
  const productsById = Object.fromEntries(products.map((product) => [String(product.id), product]))

  const openEdit = (order) => {
    setModal({ mode: 'edit', record: order })
    setEditDiscount(Number(order.discount_amount) || 0)
    setEditShipping(Number(order.shipping_cost) || 0)
    setEditItems(
      (order.items || []).map((item) => ({
        id: item.id,
        product_id: item.product_id ? String(item.product_id) : '',
        product_name: item.product_name_snapshot || '',
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price) || 0,
      })),
    )
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)
    const discount = Number(form.get('discount_amount') || 0)
    const shipping = Number(form.get('shipping_cost') || 0)
    const subtotal = createItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)
    const grandTotal = subtotal - discount + shipping

    const orderItems = createItems.map((item) => ({
      product_id: item.product_id ? Number(item.product_id) : null,
      product_name: item.product_name,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }))

    try {
      await api.post('/orders', {
        company_id: 1,
        customer_id: Number(form.get('customer_id')),
        order_code: form.get('order_code'),
        status: form.get('status') || 'draft',
        discount_amount: discount,
        shipping_cost: shipping,
        grand_total: grandTotal,
        paid_amount: 0,
        remaining_amount: grandTotal,
        deadline: form.get('deadline') || null,
        notes: form.get('notes') || null,
        order_items: orderItems,
      })
      await refresh()
      setModal(null)
      setCreateItems([{ ...EMPTY_ITEM }])
      onNotify('Order berhasil dibuat.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal membuat order.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (event, order) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const form = new FormData(event.currentTarget)

    const orderItems = editItems.map((item) => ({
      id: item.id,
      product_id: item.product_id ? Number(item.product_id) : null,
      product_name: item.product_name,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }))

    try {
      await api.put(`/orders/${order.id}`, {
        customer_id: Number(form.get('customer_id')),
        status: form.get('status'),
        discount_amount: Number(form.get('discount_amount') || 0),
        shipping_cost: Number(form.get('shipping_cost') || 0),
        deadline: form.get('deadline') || null,
        notes: form.get('notes') || null,
        order_items: orderItems,
      })
      await refresh()
      setModal(null)
      onNotify('Order berhasil diperbarui.')
    } catch (err) {
      setFormError(errorMessage(err, 'Gagal mengupdate order.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)

    try {
      await api.delete(`/orders/${deleting.id}`)
      await refresh()
      setDeleting(null)
      onNotify('Order berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus order.'), 'error')
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
    setCreateItems([{ ...EMPTY_ITEM }])
    setCreateDiscount(0)
    setCreateShipping(0)
  }

  const activeDiscount = modal?.mode === 'create' ? createDiscount : editDiscount
  const activeShipping = modal?.mode === 'create' ? createShipping : editShipping
  const activeItems = modal?.mode === 'create' ? createItems : editItems
  const activeSubtotal = activeItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)
  const activeGrandTotal = Math.max(0, activeSubtotal - activeDiscount + activeShipping)

  return (
    <div className="page">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
            Buat Order
          </Button>
        }
      />

      <Card>
        <Toolbar
          search={query}
          onSearch={(value) => { setQuery(value); setPage(1) }}
          placeholder="Cari order..."
          onReset={resetFilters}
        >
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Status</span>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
              <option value="all">Semua</option>
              {ORDER_STATUSES.map((key) => (
                <option key={key} value={key}>
                  {ORDER_STATUS_LABELS[key]}
                </option>
              ))}
            </Select>
          </div>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={query || status !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada order'}
            description={
              query || status !== 'all'
                ? 'Coba ubah kata kunci atau filter pencarian.'
                : 'Mulai dengan membuat order pertama untuk mengelola pesanan FRNDLY.'
            }
            action={
              !query && status === 'all' ? (
                <Button icon={Plus} onClick={() => setModal({ mode: 'create' })}>
                  Buat Order
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
                    <th>Customer</th>
                    <th>Status</th>
                    <th className="align-right">Total</th>
                    <th className="align-right">Terbayar</th>
                    <th className="align-right">Sisa</th>
                    <th>Deadline</th>
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td className="mono strong">{row.order_code}</td>
                      <td>{row.customer?.name || `Customer #${row.customer_id}`}</td>
                      <td>
                        <StatusBadge value={row.status} labels={ORDER_STATUS_LABELS} variants={ORDER_STATUS_VARIANTS} fallback="draft" />
                      </td>
                      <td className="align-right strong">{formatRp(row.grand_total)}</td>
                      <td className="align-right">{formatRp(row.paid_amount)}</td>
                      <td className={cx('align-right', Number(row.remaining_amount) > 0 && 'text-warning-strong')}>
                        {formatRp(row.remaining_amount)}
                      </td>
                      <td>{row.deadline ? new Date(row.deadline).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="align-right">
                        <Dropdown trigger={<span className="more-btn"><Pencil size={15} /></span>} label="Aksi order" align="end">
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
        title="Buat Order"
        subtitle="Pesanan baru dari customer."
        size="lg"
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="order-form" type="submit" loading={saving}>
              Simpan Order
            </Button>
          </>
        }
      >
        <form id="order-form" className="modal-form" onSubmit={handleCreate}>
          <StatusPath current="draft" />
          <FormGrid>
            <Field label="Kode Order" required>
              <input className="input" name="order_code" defaultValue={`ORD-${todayYmd()}-001`} required />
            </Field>
            <Field label="Customer" required>
              <Select name="customer_id" required>
                <option value="">Pilih customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="draft">
                {ORDER_STATUSES.map((statusKey) => (
                  <option key={statusKey} value={statusKey}>
                    {ORDER_STATUS_LABELS[statusKey]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Deadline">
              <input className="input" name="deadline" type="date" />
            </Field>
            <Field label="Diskon">
              <input
                className="input"
                name="discount_amount"
                type="number"
                min="0"
                step="0.01"
                value={createDiscount}
                onChange={(event) => setCreateDiscount(Number(event.target.value) || 0)}
              />
            </Field>
            <Field label="Ongkir">
              <input
                className="input"
                name="shipping_cost"
                type="number"
                min="0"
                step="0.01"
                value={createShipping}
                onChange={(event) => setCreateShipping(Number(event.target.value) || 0)}
              />
            </Field>
          </FormGrid>

          <ItemsEditor
            items={createItems}
            onChange={setCreateItems}
            products={products}
            productsById={productsById}
          />

          <div className="totals-block">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatRp(activeSubtotal)}</span>
            </div>
            <div className="totals-row">
              <span>Grand Total</span>
              <strong>{formatRp(activeGrandTotal)}</strong>
            </div>
          </div>

          <Field label="Catatan">
            <Textarea name="notes" rows={2} placeholder="Catatan order" />
          </Field>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={modal?.mode === 'edit'}
        title="Edit Order"
        subtitle={modal?.record?.order_code || ''}
        size="lg"
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button form="order-edit-form" type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form id="order-edit-form" className="modal-form" onSubmit={(event) => handleEdit(event, modal.record)}>
          <StatusPath current={modal.record.status || 'draft'} />
          <FormGrid>
            <Field label="Customer" required>
              <Select name="customer_id" defaultValue={modal.record.customer_id} required>
                <option value="">Pilih customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={modal.record.status || 'draft'}>
                {ORDER_STATUSES.map((statusKey) => (
                  <option key={statusKey} value={statusKey}>
                    {ORDER_STATUS_LABELS[statusKey]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Deadline">
              <input className="input" name="deadline" type="date" defaultValue={modal.record.deadline || ''} />
            </Field>
            <Field label="Diskon">
              <input
                className="input"
                name="discount_amount"
                type="number"
                min="0"
                step="0.01"
                value={editDiscount}
                onChange={(event) => setEditDiscount(Number(event.target.value) || 0)}
              />
            </Field>
            <Field label="Ongkir">
              <input
                className="input"
                name="shipping_cost"
                type="number"
                min="0"
                step="0.01"
                value={editShipping}
                onChange={(event) => setEditShipping(Number(event.target.value) || 0)}
              />
            </Field>
          </FormGrid>

          <ItemsEditor items={editItems} onChange={setEditItems} products={products} productsById={productsById} />

          <div className="totals-block">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatRp(activeSubtotal)}</span>
            </div>
            <div className="totals-row">
              <span>Grand Total</span>
              <strong>{formatRp(activeGrandTotal)}</strong>
            </div>
          </div>

          <Field label="Catatan">
            <Textarea name="notes" rows={2} defaultValue={modal.record.notes || ''} placeholder="Catatan order" />
          </Field>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Order?"
        message={`Order "${deleting?.order_code}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        busy={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
