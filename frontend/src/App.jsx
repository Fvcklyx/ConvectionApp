import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Users,
} from 'lucide-react'
import { api, TOKEN_KEY } from './api'
import './App.css'

const NAV_SECTIONS = [
  { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Customers', label: 'Customers', icon: Users },
  { key: 'Products', label: 'Products', icon: Package },
  { key: 'Orders', label: 'Orders', icon: ShoppingCart },
  { key: 'Payments', label: 'Payments', icon: CreditCard },
  { key: 'Invoices', label: 'Invoices', icon: FileText },
]

const ORDER_STATUS_LABELS = {
  draft: 'Draft',
  waiting_dp: 'Menunggu DP',
  dp_received: 'DP Masuk',
  processing: 'Proses',
  paid: 'Lunas',
}

const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS)

const PAYMENT_TYPE_LABELS = {
  dp: 'DP',
  final: 'Lunas',
  full: 'Lunas',
}

const INVOICE_STATUS_LABELS = {
  draft: 'Draft',
  issued: 'Diterbitkan',
  paid: 'Lunas',
}

const INVOICE_STATUSES = Object.keys(INVOICE_STATUS_LABELS)

const ACTIVE_LABELS = {
  active: 'Aktif',
  inactive: 'Nonaktif',
}

const formatRp = (value) => `Rp${Number(value || 0).toLocaleString('id-ID')}`

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('id-ID') : '-')

const formatDateTime = (value) => (value ? new Date(value).toLocaleString('id-ID') : '-')

const listOf = (payload) => (Array.isArray(payload) ? payload : payload?.data ?? [])

const pad = (value, length) => String(value).padStart(length, '0')

const todayYmd = () => {
  const date = new Date()
  return `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}`
}

const todayInput = () => {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
}

const errorMessage = (error, fallback) =>
  error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]]?.[0] ||
  error.response?.data?.message ||
  fallback

function StatusBadge({ labels, value }) {
  const key = Object.prototype.hasOwnProperty.call(labels, value) ? value : 'draft'

  return <span className={`badge badge-${key}`}>{labels[key]}</span>
}

function Loading() {
  return <p className="status-text">Memuat data...</p>
}

function ErrorNotice({ message }) {
  return message ? <p className="form-error">{message}</p> : null
}

function CreateToggle({ label, onCreate, children }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const ok = await onCreate(event)
    if (ok !== false) {
      setOpen(false)
    }
  }

  return (
    <>
      <button type="button" className="secondary-btn" onClick={() => setOpen((current) => !current)}>
        <Plus size={14} />
        {open ? 'Tutup' : label}
      </button>
      {open && (
        <form className="create-form card" onSubmit={handleSubmit}>
          {children}
        </form>
      )}
    </>
  )
}

function EditRow({ onClose, onSave, error, children }) {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    const ok = await onSave(event)
    setSaving(false)
    if (ok !== false) {
      onClose()
    }
  }

  return (
    <tr className="edit-row">
      <td colSpan={99}>
        <form className="create-form edit-form" onSubmit={handleSubmit}>
          <div className="form-grid">{children}</div>
          <div className="edit-actions">
            <ErrorNotice message={error} />
            <button type="button" className="secondary-btn" onClick={onClose}>
              Batal
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}

const downloadPdf = async (invoice) => {
  try {
    const response = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.invoice_code}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (err) {
    window.alert(errorMessage(err, 'Gagal mengunduh PDF.'))
  }
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@frndly.test', password: 'password123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data.data
      localStorage.setItem(TOKEN_KEY, token)
      onLogin(token, user)
    } catch (err) {
      setError(errorMessage(err, 'Login gagal. Coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">FRNDLY</p>
        <h1>Masuk ke panel</h1>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <ErrorNotice message={error} />
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
        <p className="hint">Akun demo: admin@frndly.test / password123</p>
      </form>
    </div>
  )
}

function DashboardSection({ metrics, activities }) {
  return (
    <>
      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="card-header">
          <h3 className="card-title">Aktivitas Terbaru</h3>
        </div>
        {activities.length === 0 ? (
          <p className="empty-state">Belum ada aktivitas.</p>
        ) : (
          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li key={`${activity.title}-${index}`} className="activity-item">
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                </div>
                <span className="activity-time">{formatDateTime(activity.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function CustomersSection({ rows, refresh, onNotify }) {
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const handleCreate = async (event) => {
    setError('')
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
      onNotify('Customer berhasil dibuat.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat customer.'))
      return false
    }
  }

  const handleEdit = async (event, customer) => {
    setError('')
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
      onNotify('Customer berhasil diperbarui.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengupdate customer.'))
      return false
    }
  }

  const handleDelete = async (customer) => {
    if (!window.confirm(`Hapus customer "${customer.name}"?`)) {
      return
    }

    try {
      await api.delete(`/customers/${customer.id}`)
      await refresh()
      onNotify('Customer berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus customer.'), 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Customers</h3>
        <CreateToggle label="+ Tambah Customer" onCreate={handleCreate}>
          <div className="form-grid">
            <label>
              Kode Customer
              <input name="customer_code" defaultValue={`CUS-${pad(rows.length + 1, 4)}`} required />
            </label>
            <label>
              Nama
              <input name="name" placeholder="Nama customer" required />
            </label>
            <label>
              Telepon
              <input name="phone" placeholder="08xxxxxxxxxx" />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="email@example.com" />
            </label>
            <label>
              Kota
              <input name="city" placeholder="Kota" />
            </label>
            <label>
              Provinsi
              <input name="province" placeholder="Provinsi" />
            </label>
            <label>
              Alamat
              <textarea name="address" rows="2" placeholder="Alamat lengkap" />
            </label>
            <label>
              Status
              <select name="status" defaultValue="active">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </label>
          </div>
          <ErrorNotice message={error} />
          <button className="primary-btn" type="submit">Simpan Customer</button>
        </CreateToggle>
      </div>

      {rows.length === 0 ? (
        <p className="empty-state">Belum ada data customer.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Kota</th>
                <th>Order</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{row.customer_code}</td>
                    <td>{row.name}</td>
                    <td>
                      {row.email || '-'}
                      <br />
                      {row.phone || '-'}
                    </td>
                    <td>{row.city || '-'}</td>
                    <td>{row.orders_count ?? '-'}</td>
                    <td>
                      <StatusBadge labels={ACTIVE_LABELS} value={row.status} />
                    </td>
                    <td className="action-cell">
                      <button type="button" className="secondary-btn" onClick={() => setEditing(row)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                  {editing?.id === row.id && (
                    <EditRow onClose={() => setEditing(null)} onSave={(event) => handleEdit(event, row)} error={error}>
                      <label>
                        Nama
                        <input name="name" defaultValue={row.name} required />
                      </label>
                      <label>
                        Telepon
                        <input name="phone" defaultValue={row.phone || ''} placeholder="08xxxxxxxxxx" />
                      </label>
                      <label>
                        Email
                        <input name="email" type="email" defaultValue={row.email || ''} placeholder="email@example.com" />
                      </label>
                      <label>
                        Kota
                        <input name="city" defaultValue={row.city || ''} placeholder="Kota" />
                      </label>
                      <label>
                        Provinsi
                        <input name="province" defaultValue={row.province || ''} placeholder="Provinsi" />
                      </label>
                      <label>
                        Alamat
                        <textarea name="address" rows="2" defaultValue={row.address || ''} placeholder="Alamat lengkap" />
                      </label>
                      <label>
                        Status
                        <select name="status" defaultValue={row.status || 'active'}>
                          <option value="active">Aktif</option>
                          <option value="inactive">Nonaktif</option>
                        </select>
                      </label>
                    </EditRow>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function ProductsSection({ rows, refresh, onNotify }) {
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const handleCreate = async (event) => {
    setError('')
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
      onNotify('Produk berhasil dibuat.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat produk.'))
      return false
    }
  }

  const handleEdit = async (event, product) => {
    setError('')
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
      onNotify('Produk berhasil diperbarui.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengupdate produk.'))
      return false
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) {
      return
    }

    try {
      await api.delete(`/products/${product.id}`)
      await refresh()
      onNotify('Produk berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus produk.'), 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Products</h3>
        <CreateToggle label="+ Tambah Produk" onCreate={handleCreate}>
          <div className="form-grid">
            <label>
              SKU
              <input name="sku" defaultValue={`PRD-${pad(rows.length + 1, 3)}`} required />
            </label>
            <label>
              Nama Produk
              <input name="name" placeholder="Nama produk" required />
            </label>
            <label>
              Kategori
              <input name="category" placeholder="T-Shirt, Jaket, Lanyard..." />
            </label>
            <label>
              Bahan
              <input name="material" placeholder="Cotton Combed 24s..." />
            </label>
            <label>
              Model
              <input name="model" placeholder="Model" />
            </label>
            <label>
              Warna
              <input name="color" placeholder="Warna" />
            </label>
            <label>
              Ukuran
              <input name="size" placeholder="S, M, L, XL..." />
            </label>
            <label>
              Harga
              <input name="price" type="number" min="0" step="0.01" placeholder="85000" required />
            </label>
            <label>
              Status
              <select name="status" defaultValue="active">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </label>
          </div>
          <ErrorNotice message={error} />
          <button className="primary-btn" type="submit">Simpan Produk</button>
        </CreateToggle>
      </div>

      {rows.length === 0 ? (
        <p className="empty-state">Belum ada data produk.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Bahan</th>
                <th>Ukuran</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{row.sku}</td>
                    <td>{row.name}</td>
                    <td>{row.category || '-'}</td>
                    <td>{row.material || '-'}</td>
                    <td>{row.size || '-'}</td>
                    <td>{formatRp(row.price)}</td>
                    <td>
                      <StatusBadge labels={ACTIVE_LABELS} value={row.status} />
                    </td>
                    <td className="action-cell">
                      <button type="button" className="secondary-btn" onClick={() => setEditing(row)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                  {editing?.id === row.id && (
                    <EditRow onClose={() => setEditing(null)} onSave={(event) => handleEdit(event, row)} error={error}>
                      <label>
                        Nama Produk
                        <input name="name" defaultValue={row.name} required />
                      </label>
                      <label>
                        Kategori
                        <input name="category" defaultValue={row.category || ''} placeholder="T-Shirt, Jaket, Lanyard..." />
                      </label>
                      <label>
                        Bahan
                        <input name="material" defaultValue={row.material || ''} placeholder="Cotton Combed 24s..." />
                      </label>
                      <label>
                        Model
                        <input name="model" defaultValue={row.model || ''} placeholder="Model" />
                      </label>
                      <label>
                        Warna
                        <input name="color" defaultValue={row.color || ''} placeholder="Warna" />
                      </label>
                      <label>
                        Ukuran
                        <input name="size" defaultValue={row.size || ''} placeholder="S, M, L, XL..." />
                      </label>
                      <label>
                        Harga
                        <input name="price" type="number" min="0" step="0.01" defaultValue={row.price} required />
                      </label>
                      <label>
                        Status
                        <select name="status" defaultValue={row.status || 'active'}>
                          <option value="active">Aktif</option>
                          <option value="inactive">Nonaktif</option>
                        </select>
                      </label>
                    </EditRow>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function OrdersSection({ rows, customers, refresh, onNotify }) {
  const [error, setError] = useState('')
  const [items, setItems] = useState([{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }])
  const [editing, setEditing] = useState(null)
  const [editItems, setEditItems] = useState([])

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const updateEditItem = (index, patch) => {
    setEditItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const handleProductSelect = (index, productId) => {
    const product = productsById[productId]
    updateItem(index, {
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product ? Number(product.price) : 0,
    })
  }

  const handleEditProductSelect = (index, productId) => {
    const product = productsById[productId]
    updateEditItem(index, {
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product ? Number(product.price) : 0,
    })
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)
  const editSubtotal = editItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)

  const startEdit = (order) => {
    setEditing(order)
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
    setError('')
    const form = new FormData(event.currentTarget)
    const discount = Number(form.get('discount_amount') || 0)
    const shipping = Number(form.get('shipping_cost') || 0)
    const grandTotal = subtotal - discount + shipping

    const orderItems = items.map((item) => ({
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
      onNotify('Order berhasil dibuat.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat order.'))
      return false
    }
  }

  const handleEdit = async (event, order) => {
    setError('')
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
      onNotify('Order berhasil diperbarui.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengupdate order.'))
      return false
    }
  }

  const handleDelete = async (order) => {
    if (!window.confirm(`Hapus order "${order.order_code}"?`)) {
      return
    }

    try {
      await api.delete(`/orders/${order.id}`)
      await refresh()
      onNotify('Order berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus order.'), 'error')
    }
  }

  const products = JSON.parse(localStorage.getItem('frndly_products') || '[]')
  const productsById = Object.fromEntries(products.map((product) => [String(product.id), product]))

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Orders</h3>
        <CreateToggle label="+ Buat Order" onCreate={handleCreate}>
          <div className="form-grid">
            <label>
              Kode Order
              <input name="order_code" defaultValue={`ORD-${todayYmd()}-001`} required />
            </label>
            <label>
              Customer
              <select name="customer_id" required>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue="draft">
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deadline
              <input name="deadline" type="date" />
            </label>
            <label>
              Diskon
              <input name="discount_amount" type="number" min="0" step="0.01" defaultValue="0" />
            </label>
            <label>
              Ongkir
              <input name="shipping_cost" type="number" min="0" step="0.01" defaultValue="0" />
            </label>
          </div>

          <div className="items-block">
            <h4>Item Order</h4>
            {items.map((item, index) => (
              <div className="item-row" key={index}>
                <select value={item.product_id} onChange={(event) => handleProductSelect(index, event.target.value)}>
                  <option value="">Pilih produk...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} — {product.name}
                    </option>
                  ))}
                </select>
                <input
                  value={item.product_name}
                  onChange={(event) => updateItem(index, { product_name: event.target.value })}
                  placeholder="Nama item"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                  placeholder="Qty"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(event) => updateItem(index, { unit_price: Number(event.target.value) })}
                  placeholder="Harga"
                />
                <button
                  type="button"
                  className="danger-btn"
                  disabled={items.length === 1}
                  onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setItems((current) => [...current, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }])}
            >
              + Tambah Item
            </button>
            <p className="hint">Subtotal: {formatRp(subtotal)}</p>
          </div>

          <label>
            Catatan
            <textarea name="notes" rows="2" placeholder="Catatan order" />
          </label>
          <ErrorNotice message={error} />
          <button className="primary-btn" type="submit">Simpan Order</button>
        </CreateToggle>
      </div>

      {rows.length === 0 ? (
        <p className="empty-state">Belum ada data order.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Terbayar</th>
                <th>Sisa</th>
                <th>Deadline</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{row.order_code}</td>
                    <td>{row.customer?.name || `Customer #${row.customer_id}`}</td>
                    <td>
                      <StatusBadge labels={ORDER_STATUS_LABELS} value={row.status} />
                    </td>
                    <td>{formatRp(row.grand_total)}</td>
                    <td>{formatRp(row.paid_amount)}</td>
                    <td>{formatRp(row.remaining_amount)}</td>
                    <td>{formatDate(row.deadline)}</td>
                    <td className="action-cell">
                      <button type="button" className="secondary-btn" onClick={() => startEdit(row)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                  {editing?.id === row.id && (
                    <EditRow onClose={() => setEditing(null)} onSave={(event) => handleEdit(event, row)} error={error}>
                      <label>
                        Customer
                        <select name="customer_id" defaultValue={row.customer_id} required>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Status
                        <select name="status" defaultValue={row.status || 'draft'}>
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Deadline
                        <input name="deadline" type="date" defaultValue={row.deadline || ''} />
                      </label>
                      <label>
                        Diskon
                        <input name="discount_amount" type="number" min="0" step="0.01" defaultValue={Number(row.discount_amount) || 0} />
                      </label>
                      <label>
                        Ongkir
                        <input name="shipping_cost" type="number" min="0" step="0.01" defaultValue={Number(row.shipping_cost) || 0} />
                      </label>
                      <div className="items-block edit-items">
                        <h4>Item Order</h4>
                        {editItems.length === 0 && <p className="hint">Belum ada item.</p>}
                        {editItems.map((item, index) => (
                          <div className="item-row" key={item.id || index}>
                            <select value={item.product_id} onChange={(event) => handleEditProductSelect(index, event.target.value)}>
                              <option value="">Pilih produk...</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.sku} — {product.name}
                                </option>
                              ))}
                            </select>
                            <input
                              value={item.product_name}
                              onChange={(event) => updateEditItem(index, { product_name: event.target.value })}
                              placeholder="Nama item"
                            />
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) => updateEditItem(index, { quantity: Number(event.target.value) })}
                              placeholder="Qty"
                            />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(event) => updateEditItem(index, { unit_price: Number(event.target.value) })}
                              placeholder="Harga"
                            />
                            <button
                              type="button"
                              className="danger-btn"
                              disabled={editItems.length === 1}
                              onClick={() => setEditItems((current) => current.filter((_, i) => i !== index))}
                            >
                              Hapus
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => setEditItems((current) => [...current, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }])}
                        >
                          + Tambah Item
                        </button>
                        <p className="hint">Subtotal: {formatRp(editSubtotal)}</p>
                      </div>
                      <label>
                        Catatan
                        <textarea name="notes" rows="2" defaultValue={row.notes || ''} placeholder="Catatan order" />
                      </label>
                    </EditRow>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function PaymentsSection({ rows, orders, refresh, onNotify }) {
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const handleCreate = async (event) => {
    setError('')
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
      onNotify('Pembayaran berhasil dicatat.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mencatat pembayaran.'))
      return false
    }
  }

  const handleEdit = async (event, payment) => {
    setError('')
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
      onNotify('Pembayaran berhasil diperbarui.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengupdate pembayaran.'))
      return false
    }
  }

  const handleDelete = async (payment) => {
    if (!window.confirm('Hapus pembayaran ini?')) {
      return
    }

    try {
      await api.delete(`/payments/${payment.id}`)
      await refresh()
      onNotify('Pembayaran berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus pembayaran.'), 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Payments</h3>
        <CreateToggle label="+ Catat Pembayaran" onCreate={handleCreate}>
          <div className="form-grid">
            <label>
              Order
              <select name="order_id" required>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — sisa {formatRp(order.remaining_amount)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Jumlah
              <input name="amount" type="number" min="1" step="0.01" placeholder="Jumlah dibayar" required />
            </label>
            <label>
              Tipe
              <select name="payment_type" defaultValue="dp">
                <option value="dp">DP</option>
                <option value="final">Pelunasan</option>
              </select>
            </label>
            <label>
              Tanggal
              <input name="payment_date" type="date" defaultValue={todayInput()} required />
            </label>
            <label>
              Referensi
              <input name="reference" placeholder="TRF-BCA-xxxx" />
            </label>
            <label>
              Catatan
              <textarea name="notes" rows="2" placeholder="Catatan" />
            </label>
          </div>
          <ErrorNotice message={error} />
          <button className="primary-btn" type="submit">Simpan Pembayaran</button>
        </CreateToggle>
      </div>

      {rows.length === 0 ? (
        <p className="empty-state">Belum ada data pembayaran.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Jumlah</th>
                <th>Tipe</th>
                <th>Tanggal</th>
                <th>Referensi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{row.order?.order_code || `Order #${row.order_id}`}</td>
                    <td>{formatRp(row.amount)}</td>
                    <td>
                      <StatusBadge labels={PAYMENT_TYPE_LABELS} value={row.payment_type} />
                    </td>
                    <td>{formatDate(row.payment_date)}</td>
                    <td>{row.reference || '-'}</td>
                    <td className="action-cell">
                      <button type="button" className="secondary-btn" onClick={() => setEditing(row)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                  {editing?.id === row.id && (
                    <EditRow onClose={() => setEditing(null)} onSave={(event) => handleEdit(event, row)} error={error}>
                      <label>
                        Jumlah
                        <input name="amount" type="number" min="1" step="0.01" defaultValue={row.amount} required />
                      </label>
                      <label>
                        Tipe
                        <select name="payment_type" defaultValue={row.payment_type || 'dp'}>
                          <option value="dp">DP</option>
                          <option value="final">Pelunasan</option>
                        </select>
                      </label>
                      <label>
                        Tanggal
                        <input name="payment_date" type="date" defaultValue={row.payment_date || todayInput()} required />
                      </label>
                      <label>
                        Referensi
                        <input name="reference" defaultValue={row.reference || ''} placeholder="TRF-BCA-xxxx" />
                      </label>
                      <label>
                        Catatan
                        <textarea name="notes" rows="2" defaultValue={row.notes || ''} placeholder="Catatan" />
                      </label>
                    </EditRow>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function InvoicesSection({ rows, orders, refresh, onNotify }) {
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const handleCreate = async (event) => {
    setError('')
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
      onNotify('Invoice berhasil dibuat.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat invoice.'))
      return false
    }
  }

  const handleEdit = async (event, invoice) => {
    setError('')
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/invoices/${invoice.id}`, {
        total_amount: Number(form.get('total_amount')),
        paid_amount: Number(form.get('paid_amount') || 0),
        outstanding_amount: Math.max(0, Number(form.get('total_amount') || 0) - Number(form.get('paid_amount') || 0)),
        status: form.get('status') || 'draft',
      })
      await refresh()
      onNotify('Invoice berhasil diperbarui.')
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengupdate invoice.'))
      return false
    }
  }

  const handleDelete = async (invoice) => {
    if (!window.confirm(`Hapus invoice "${invoice.invoice_code}"?`)) {
      return
    }

    try {
      await api.delete(`/invoices/${invoice.id}`)
      await refresh()
      onNotify('Invoice berhasil dihapus.')
    } catch (err) {
      onNotify(errorMessage(err, 'Gagal menghapus invoice.'), 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Invoices</h3>
        <CreateToggle label="+ Buat Invoice" onCreate={handleCreate}>
          <div className="form-grid">
            <label>
              Order
              <select name="order_id" required>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} — {formatRp(order.grand_total)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kode Invoice
              <input name="invoice_code" defaultValue={`INV-${todayYmd()}-001`} required />
            </label>
            <label>
              Total
              <input name="total_amount" type="number" min="0" step="0.01" placeholder="Total invoice" required />
            </label>
            <label>
              Status
              <select name="status" defaultValue="draft">
                {INVOICE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {INVOICE_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ErrorNotice message={error} />
          <button className="primary-btn" type="submit">Simpan Invoice</button>
        </CreateToggle>
      </div>

      {rows.length === 0 ? (
        <p className="empty-state">Belum ada data invoice.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Order</th>
                <th>Total</th>
                <th>Terbayar</th>
                <th>Sisa</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{row.invoice_code}</td>
                    <td>{row.order?.order_code || `Order #${row.order_id}`}</td>
                    <td>{formatRp(row.total_amount)}</td>
                    <td>{formatRp(row.paid_amount)}</td>
                    <td>{formatRp(row.outstanding_amount)}</td>
                    <td>
                      <StatusBadge labels={INVOICE_STATUS_LABELS} value={row.status} />
                    </td>
                    <td className="action-cell">
                      <button type="button" className="secondary-btn" onClick={() => setEditing(row)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => downloadPdf(row)}>
                        <Download size={14} /> PDF
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                  {editing?.id === row.id && (
                    <EditRow onClose={() => setEditing(null)} onSave={(event) => handleEdit(event, row)} error={error}>
                      <label>
                        Total
                        <input name="total_amount" type="number" min="0" step="0.01" defaultValue={row.total_amount} required />
                      </label>
                      <label>
                        Terbayar
                        <input name="paid_amount" type="number" min="0" step="0.01" defaultValue={row.paid_amount} />
                      </label>
                      <label>
                        Status
                        <select name="status" defaultValue={row.status || 'draft'}>
                          {INVOICE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {INVOICE_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </EditRow>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function AppShell({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [metrics, setMetrics] = useState([])
  const [activities, setActivities] = useState([])
  const [rows, setRows] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('frndly_sidebar_collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const toggleSidebar = () => {
    if (window.innerWidth < 860) {
      setMobileOpen((current) => !current)
      return
    }

    setCollapsed((current) => {
      localStorage.setItem('frndly_sidebar_collapsed', current ? '0' : '1')
      return !current
    })
  }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardRes, customersRes, productsRes, ordersRes, paymentsRes, invoicesRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/customers'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/payments'),
        api.get('/invoices'),
      ])

      setMetrics(dashboardRes.data.data.metrics)
      setActivities(dashboardRes.data.data.recentActivities)
      setCustomers(listOf(customersRes.data.data))
      setOrders(listOf(ordersRes.data.data))

      localStorage.setItem('frndly_products', JSON.stringify(listOf(productsRes.data.data)))

      switch (activeSection) {
        case 'Customers':
          setRows(listOf(customersRes.data.data))
          break
        case 'Products':
          setRows(listOf(productsRes.data.data))
          break
        case 'Orders':
          setRows(listOf(ordersRes.data.data))
          break
        case 'Payments':
          setRows(listOf(paymentsRes.data.data))
          break
        case 'Invoices':
          setRows(listOf(invoicesRes.data.data))
          break
        default:
          setRows([])
      }
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout()
        return
      }
      setError(errorMessage(err, 'Gagal memuat data.'))
    } finally {
      setLoading(false)
    }
  }, [activeSection, onLogout])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const query = search.trim().toLowerCase()
  const visibleRows = query
    ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query))
    : rows

  const noSearchResult = query && activeSection !== 'Dashboard' && visibleRows.length === 0

  const renderContent = () => {
    if (noSearchResult) {
      return <p className="empty-state">Tidak ada hasil untuk &quot;{search.trim()}&quot; di {activeSection.toLowerCase()}.</p>
    }

    switch (activeSection) {
      case 'Customers':
        return <CustomersSection rows={visibleRows} refresh={loadAll} onNotify={showToast} />
      case 'Products':
        return <ProductsSection rows={visibleRows} refresh={loadAll} onNotify={showToast} />
      case 'Orders':
        return <OrdersSection rows={visibleRows} customers={customers} refresh={loadAll} onNotify={showToast} />
      case 'Payments':
        return <PaymentsSection rows={visibleRows} orders={orders} refresh={loadAll} onNotify={showToast} />
      case 'Invoices':
        return <InvoicesSection rows={visibleRows} orders={orders} refresh={loadAll} onNotify={showToast} />
      default:
        return <DashboardSection metrics={metrics} activities={activities} />
    }
  }

  const activeSectionLabel = NAV_SECTIONS.find((section) => section.key === activeSection)?.label ?? 'Dashboard'
  const userInitials = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase()

  const sidebarClass = ['sidebar']
    .concat(collapsed ? 'collapsed' : '')
    .concat(mobileOpen ? 'open' : '')
    .join(' ')

  return (
    <div className="app-shell">
      <aside className={sidebarClass}>
        <div className="sidebar-brand">
          <div className="brand-logo">F</div>
          <span className="brand-text">FRNDLY</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              title={collapsed ? label : undefined}
              className={key === activeSection ? 'nav-btn active' : 'nav-btn'}
              onClick={() => {
                setActiveSection(key)
                setMobileOpen(false)
              }}
            >
              <Icon size={18} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{userInitials}</div>
            <span className="user-meta">
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email || ''}</small>
            </span>
          </div>
          <button type="button" className="sidebar-logout" title="Keluar" onClick={onLogout}>
            <LogOut size={16} />
            <span className="nav-label">Keluar</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button type="button" className="icon-btn sidebar-toggle" onClick={toggleSidebar} title="Menu">
            <Menu size={18} />
          </button>
          <div className="topbar-title">
            <h1>{activeSectionLabel}</h1>
          </div>
          <div className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Cari di ${activeSectionLabel.toLowerCase()}...`}
            />
          </div>
          <div className="topbar-right">
            <span className="user-chip">{user?.name || user?.email || 'Admin'}</span>
          </div>
        </header>

        <main className="content">
          <ErrorNotice message={error} />
          {loading ? <Loading /> : renderContent()}
        </main>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <CheckCircle2 size={16} />
          {toast.message}
        </div>
      )}
    </div>
  )
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Token mungkin sudah tidak valid; tetap keluar.
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('frndly_products')
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AppShell user={user} onLogout={handleLogout} />
}

export default App
