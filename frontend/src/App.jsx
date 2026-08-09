import { useCallback, useEffect, useState } from 'react'
import { api, TOKEN_KEY } from './api'
import './App.css'

const NAV_SECTIONS = ['Dashboard', 'Customers', 'Products', 'Orders', 'Payments', 'Invoices']

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

const todayInput = () => new Date().toISOString().slice(0, 10)

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

function CustomersSection({ rows, refresh }) {
  const [error, setError] = useState('')

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
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat customer.'))
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
    } catch (err) {
      window.alert(errorMessage(err, 'Gagal menghapus customer.'))
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
                <tr key={row.id}>
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
                  <td>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function ProductsSection({ rows, refresh }) {
  const [error, setError] = useState('')

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
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat produk.'))
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
    } catch (err) {
      window.alert(errorMessage(err, 'Gagal menghapus produk.'))
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
                <tr key={row.id}>
                  <td>{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.category || '-'}</td>
                  <td>{row.material || '-'}</td>
                  <td>{row.size || '-'}</td>
                  <td>{formatRp(row.price)}</td>
                  <td>
                    <StatusBadge labels={ACTIVE_LABELS} value={row.status} />
                  </td>
                  <td>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function OrdersSection({ rows, customers, refresh }) {
  const [error, setError] = useState('')
  const [items, setItems] = useState([{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }])

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const handleProductSelect = (index, productId) => {
    const product = productsById[productId]
    updateItem(index, {
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product ? Number(product.price) : 0,
    })
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0)

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
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat order.'))
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
    } catch (err) {
      window.alert(errorMessage(err, 'Gagal menghapus order.'))
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
                <tr key={row.id}>
                  <td>{row.order_code}</td>
                  <td>{row.customer?.name || `Customer #${row.customer_id}`}</td>
                  <td>
                    <StatusBadge labels={ORDER_STATUS_LABELS} value={row.status} />
                  </td>
                  <td>{formatRp(row.grand_total)}</td>
                  <td>{formatRp(row.paid_amount)}</td>
                  <td>{formatRp(row.remaining_amount)}</td>
                  <td>{formatDate(row.deadline)}</td>
                  <td>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function PaymentsSection({ rows, orders, refresh }) {
  const [error, setError] = useState('')

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
    } catch (err) {
      setError(errorMessage(err, 'Gagal mencatat pembayaran.'))
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
    } catch (err) {
      window.alert(errorMessage(err, 'Gagal menghapus pembayaran.'))
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
                <tr key={row.id}>
                  <td>{row.order?.order_code || `Order #${row.order_id}`}</td>
                  <td>{formatRp(row.amount)}</td>
                  <td>
                    <StatusBadge labels={PAYMENT_TYPE_LABELS} value={row.payment_type} />
                  </td>
                  <td>{formatDate(row.payment_date)}</td>
                  <td>{row.reference || '-'}</td>
                  <td>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function InvoicesSection({ rows, orders, refresh }) {
  const [error, setError] = useState('')

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
    } catch (err) {
      setError(errorMessage(err, 'Gagal membuat invoice.'))
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
    } catch (err) {
      window.alert(errorMessage(err, 'Gagal menghapus invoice.'))
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
                <tr key={row.id}>
                  <td>{row.invoice_code}</td>
                  <td>{row.order?.order_code || `Order #${row.order_id}`}</td>
                  <td>{formatRp(row.total_amount)}</td>
                  <td>{formatRp(row.paid_amount)}</td>
                  <td>{formatRp(row.outstanding_amount)}</td>
                  <td>
                    <StatusBadge labels={INVOICE_STATUS_LABELS} value={row.status} />
                  </td>
                  <td>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </td>
                </tr>
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

  const renderContent = () => {
    switch (activeSection) {
      case 'Customers':
        return <CustomersSection rows={rows} refresh={loadAll} />
      case 'Products':
        return <ProductsSection rows={rows} refresh={loadAll} />
      case 'Orders':
        return <OrdersSection rows={rows} customers={customers} refresh={loadAll} />
      case 'Payments':
        return <PaymentsSection rows={rows} orders={orders} refresh={loadAll} />
      case 'Invoices':
        return <InvoicesSection rows={rows} orders={orders} refresh={loadAll} />
      default:
        return <DashboardSection metrics={metrics} activities={activities} />
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FRNDLY</p>
          <h1>Business control center</h1>
        </div>
        <div className="topbar-right">
          <span className="user-chip">{user?.name || user?.email || 'Admin'}</span>
          <button type="button" className="secondary-btn" onClick={onLogout}>
            Keluar
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {NAV_SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            className={section === activeSection ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      <main className="content">
        <ErrorNotice message={error} />
        {loading ? <Loading /> : renderContent()}
      </main>
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
