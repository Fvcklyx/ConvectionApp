import { useCallback, useEffect, useState } from 'react'
import { ChevronRight, Download, LogOut, MessageCircle, Package, Pencil, Plus, RefreshCw, Send, ShoppingBag, Star, Trash2, User } from 'lucide-react'
import AppLoading from '../AppLoading'
import ProductArtwork from '../ProductArtwork'
import ThemeToggle from '../ThemeToggle'
import { rememberBusinessName } from '../../lib/branding'
import { api } from '../../api'
import { errorMessage, formatRp, listOf } from '../../lib/format'
import { fetchAllPages } from '../../lib/pagination'
import { orderChatUrl } from '../../lib/portal'
import { Button, Card, ConfirmDialog, EmptyState, ErrorBanner, Field, FormGrid, Input, Modal, Select, Textarea } from '../ui'

const STATUS = { draft_local: 'Draft pribadi', draft: 'Menunggu konfirmasi admin', waiting_dp: 'Menunggu DP', dp_received: 'DP diterima', processing: 'Diproses', paid: 'Lunas', removed: 'Dihapus oleh admin' }
const PROFILE_FIELDS = [['name', 'Nama'], ['phone', 'No. WhatsApp / Telepon'], ['address', 'Alamat'], ['city', 'Kota'], ['province', 'Provinsi']]
const TABS = [['catalog', 'Katalog', ShoppingBag], ['orders', 'Pesanan Saya', Package], ['engagement', 'Review & Testimonial', Star]]

export default function CustomerPortal({ user, onLogout }) {
  const [company, setCompany] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [profile, setProfile] = useState({})
  const [engagement, setEngagement] = useState({ reviews: [], testimonials: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState('catalog')
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [sending, setSending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const loadData = useCallback(async (blocking = true) => {
    if (blocking) setLoading(true)
    setError('')
    try {
      const [comp, personal, drafts, feedback, adminOrders] = await Promise.all([
        api.get('/company/profile'), api.get('/portal/profile'),
        fetchAllPages(async page => (await api.get('/portal/drafts', { params: { page } })).data.data),
        api.get('/portal/engagement'),
        fetchAllPages(async page => (await api.get('/portal/orders', { params: { page } })).data.data),
      ])
      setCompany(comp.data.data)
      rememberBusinessName(comp.data.data?.name)
      setProducts(listOf(comp.data.data?.products))
      setProfile(personal.data.data)
      setOrders([...drafts, ...adminOrders])
      setEngagement(feedback.data.data)
    } catch (err) {
      setError(errorMessage(err, 'Portal gagal dimuat. Silakan coba lagi.'))
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { void loadData() }, [loadData])

  const action = async (operation, success) => {
    if (busy) return
    setBusy(true); setFormError(''); setError(''); setNotice('')
    try {
      await operation()
      setNotice(success)
      await loadData(false)
    } catch (err) { setFormError(errorMessage(err, 'Permintaan gagal. Silakan coba lagi.')) }
    finally { setBusy(false) }
  }

  const openDraft = (product, draft = null) => {
    if (!profile.customer_code) {
      setActiveTab('profile'); setNotice('Lengkapi dan simpan profil sebelum membuat draft.'); return
    }
    setFormError('')
    setEditor(draft ? { ...draft, items: draft.items.map(item => ({ product_id: item.product_id, quantity: item.quantity })) }
      : { items: [{ product_id: product.id, quantity: 24 }], notes: '', shipping_address: profile.address || '' })
  }
  const saveDraft = event => {
    event.preventDefault()
    void action(async () => {
      const body = { ...editor, items: editor.items.map(item => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) })) }
      if (editor.id) await api.put(`/portal/drafts/${editor.id}`, body)
      else await api.post('/portal/drafts', body)
      setEditor(null); setActiveTab('orders')
    }, 'Draft tersimpan di akun. Kirim ke admin saat sudah siap.')
  }
  const saveProfile = event => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(event.currentTarget))
    void action(() => api.put('/portal/profile', body), 'Profil berhasil disimpan.')
  }
  const sendReview = event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    void action(async () => { await api.post(`/portal/orders/${data.order_id}/review`, data); form.reset() }, 'Review dikirim untuk moderasi admin.')
  }
  const sendTestimonial = event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    void action(async () => { await api.post('/portal/testimonials', data); form.reset() }, 'Testimonial dikirim untuk moderasi admin.')
  }
  const downloadInvoice = invoice => void action(async () => {
    const response = await api.get(`/portal/invoices/${invoice.id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url; link.download = `${invoice.invoice_code}.pdf`
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url)
  }, 'Invoice berhasil diunduh.')

  const reviewable = orders.filter(order => order.status === 'paid' && !order.review)
  const testimonialReviews = engagement.reviews.filter(review => !engagement.testimonials.some(item => item.review_id === review.id))
  const estimate = editor?.items.reduce((sum, item) => sum + Number(products.find(p => p.id === Number(item.product_id))?.price || 0) * Number(item.quantity || 0), 0) || 0

  if (loading) return <AppLoading message="Memuat portal pelanggan" />

  return <div className="customer-portal-wrap portal-storefront">
    <header className="portal-header">
      <a className="store-brand" href="/">
        {company?.logo_url ? <img src={company.logo_url} alt="" width="38" height="38" /> : <span className="store-brand-mark">F</span>}
        <span>{company?.name || 'FRNDLY'}<small>CUSTOM APPAREL</small></span>
      </a>
      <div className="portal-account">
        <button type="button" className="portal-user" aria-label={`Buka profil ${profile.name || user?.name || 'Customer'}`} aria-pressed={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setFormError(''); setNotice('') }}>
          <User size={18} aria-hidden="true" /><span className="portal-user-copy"><strong>{profile.name || user?.name || 'Customer'}</strong><small>Profil saya</small></span><ChevronRight size={16} aria-hidden="true" />
        </button>
        <ThemeToggle /><Button className="store-button" variant="outline" icon={LogOut} onClick={onLogout}>Keluar</Button>
      </div>
    </header>
    <main className="store-container portal-content">
      <div className="portal-section-heading"><h1>Portal Pelanggan</h1><Button icon={RefreshCw} variant="outline" onClick={() => loadData()} disabled={busy}>Segarkan</Button></div>
      <nav className="portal-tabs" aria-label="Menu pelanggan">
        {TABS.map(([key, title, Icon]) => <Button key={key} className="portal-tab" icon={Icon} variant={activeTab === key ? 'primary' : 'outline'} aria-pressed={activeTab === key} onClick={() => { setActiveTab(key); setFormError('') }}>{title}</Button>)}
      </nav>
      <ErrorBanner message={error} onRetry={() => loadData()} />
      {notice && <p className="portal-notice" role="status">{notice}</p>}
      {formError && !editor && !deleting && !sending && <p className="form-error" role="alert">{formError}</p>}

      {activeTab === 'catalog' && <section>
        <div className="portal-section-heading"><h2 className="portal-catalog-title">Temukan produkmu.</h2><span>{products.length} produk tersedia</span></div>
        {!products.length ? <EmptyState title="Belum ada produk" subtitle="Katalog sedang dipersiapkan." /> :
          <div className="store-products portal-products">{products.map((prod, index) => <article className="store-product portal-product" key={prod.id}>
            <div className={`store-product-art tone-${index % 3}`}><span className="store-product-category">{prod.category || 'Custom'}</span><ProductArtwork product={prod} /></div>
            <div className="store-product-info"><h3>{prod.name}</h3><div className="portal-product-description">Sesuaikan jumlah dan spesifikasi kebutuhanmu.</div>
              <p>{Number(prod.price) > 0 ? formatRp(prod.price) : 'Konsultasikan harga'} <small>/ estimasi awal</small></p>
              <Button className="store-button primary" icon={Plus} onClick={() => openDraft(prod)} disabled={Number(prod.price) <= 0}>Buat Draft</Button>
            </div>
          </article>)}</div>}
      </section>}

      {activeTab === 'profile' && <Card className="portal-panel portal-profile">
        <div className="portal-profile-heading"><span className="portal-profile-avatar"><User size={26} aria-hidden="true" /></span><div><h2>Profil Saya</h2><p>Kelola informasi kontak dan alamat pengirimanmu.</p></div></div>
        <form onSubmit={saveProfile} key={profile.customer_code || 'new-profile'}>
          <fieldset className="portal-profile-group"><legend>Informasi akun</legend>
          <FormGrid>
            <Field label="Kode Customer"><Input value={profile.customer_code || 'Otomatis setelah profil disimpan'} readOnly /></Field>
            <Field label="Email akun"><Input value={profile.email || user?.email || ''} readOnly /></Field>
          </FormGrid>
          </fieldset>
          <fieldset className="portal-profile-group"><legend>Kontak & alamat</legend><FormGrid>
            {PROFILE_FIELDS.map(([key, label]) => <Field key={key} label={label} required className={key === 'address' ? 'field-span' : undefined}>
              <Input name={key} defaultValue={profile[key] || ''} required maxLength={key === 'address' ? 255 : key === 'phone' ? 40 : key === 'name' ? 150 : 100} autoComplete={key === 'name' ? 'name' : key === 'phone' ? 'tel' : key === 'address' ? 'street-address' : undefined} />
            </Field>)}
          </FormGrid></fieldset>
          <p className="portal-helper">Kode, email akun, status, dan catatan internal dikelola sistem/admin.</p>
          <div className="portal-profile-footer"><Button type="submit" loading={busy}>Simpan Profil</Button></div>
        </form>
      </Card>}

      {activeTab === 'orders' && <section className="portal-order-list">
        <h2>Pesanan Saya</h2>
        {!orders.length && <EmptyState title="Belum ada draft pesanan" subtitle="Pilih produk di katalog untuk memulai." />}
        {orders.map(order => {
          const wa = orderChatUrl(company?.phone, order, profile)
          return <Card className="portal-panel" key={order.id}>
            <div className="portal-section-heading"><h3>{order.order_code || `Draft #${order.id}`}</h3><span className="badge">{STATUS[order.status] || order.status}</span></div>
            <ul className="portal-order-items">{(order.order_items?.length ? order.order_items : order.items).map((item, i) => <li key={i}><span>{item.product_name_snapshot || item.product_name} × {item.quantity} pcs</span><strong>{formatRp(item.subtotal)}</strong></li>)}</ul>
            <p><strong>Total estimasi: {formatRp(order.total)}</strong></p>
            {order.submitted_at && <p>Terbayar: {formatRp(order.paid_amount)} · Sisa: {formatRp(order.remaining_amount)}</p>}
            <p>Alamat: {order.shipping_address}</p>{order.notes && <p className="portal-notes">Spesifikasi: {order.notes}</p>}
            <div className="portal-actions">
              {order.editable && <><Button icon={Pencil} variant="outline" onClick={() => openDraft(null, order)} disabled={busy}>Edit</Button><Button icon={Trash2} variant="outline" onClick={() => { setFormError(''); setDeleting(order) }} disabled={busy}>Hapus</Button></>}
              {!order.submitted_at && <Button icon={Send} onClick={() => { setFormError(''); setSending(order) }} disabled={busy}>Kirim ke Admin</Button>}
              {wa && <a className="store-button primary" href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />Buka WhatsApp</a>}
              {order.invoices.map(invoice => <Button key={invoice.id} icon={Download} variant="outline" onClick={() => downloadInvoice(invoice)} loading={busy}>Unduh {invoice.invoice_code}</Button>)}
            </div>
            <p className="portal-helper">{order.submitted_at ? 'Pesanan tercatat di dashboard. WhatsApp membuka template; tekan Kirim di WhatsApp sendiri. Edit/hapus terkunci setelah admin memproses atau menerbitkan invoice.' : 'Draft ini tersimpan di akun dan belum masuk dashboard admin. Periksa rincian sebelum mengirim.'}</p>
            {order.submitted_at && !wa && <p className="portal-helper">Nomor WhatsApp bisnis belum tersedia.</p>}
          </Card>
        })}
      </section>}

      {activeTab === 'engagement' && <section className="portal-feedback-grid">
        <Card className="portal-panel"><h2>Review Pesanan</h2>
          {reviewable.length ? <form onSubmit={sendReview}><Field label="Pesanan lunas" required><Select name="order_id" required>{reviewable.map(order => <option key={order.order_id} value={order.order_id}>{order.order_code}</option>)}</Select></Field>
            <Field label="Rating (1–10)" required><Input name="rating" type="number" min="1" max="10" defaultValue="10" required /></Field>
            <Field label="Review" required><Textarea name="review_text" maxLength={2000} required rows={4} /></Field>
            <Button type="submit" loading={busy}>Kirim Review</Button></form> : <p>Review tersedia setelah pesanan lunas. Setiap pesanan dapat direview satu kali.</p>}
          {engagement.reviews.map(review => <div className="portal-feedback-item" key={review.id}><strong>Rating {review.rating}/10</strong><p>{review.review_text}</p><small>{review.is_published ? 'Dipublikasikan' : 'Menunggu moderasi admin'}</small></div>)}
        </Card>
        <Card className="portal-panel"><h2>Testimonial</h2>
          {testimonialReviews.length ? <form onSubmit={sendTestimonial}><Field label="Review terkait" required><Select name="review_id" required>{testimonialReviews.map(review => <option key={review.id} value={review.id}>Review #{review.id} — {review.rating}/10</option>)}</Select></Field>
            <Field label="Pengalamanmu" required><Textarea name="quote" rows={4} maxLength={2000} required /></Field>
            <p className="portal-helper">Testimonial dapat ditampilkan publik setelah disetujui admin. Jangan sertakan informasi pribadi sensitif.</p>
            <Button type="submit" loading={busy}>Kirim Testimonial</Button></form> : <p>{engagement.reviews.length ? 'Semua reviewmu sudah memiliki testimonial.' : 'Kirim review terlebih dahulu untuk menambahkan testimonial terkait.'}</p>}
          {engagement.testimonials.map(item => <div className="portal-feedback-item" key={item.id}><p>{item.quote}</p><small>{item.is_published ? 'Dipublikasikan' : 'Menunggu moderasi admin'}</small></div>)}
        </Card>
      </section>}
    </main>

    <Modal open={Boolean(editor)} title={editor?.id ? 'Edit Draft Pesanan' : 'Buat Draft Pesanan'} onClose={() => { if (!busy) setEditor(null) }}>
      {editor && <form onSubmit={saveDraft}>
        {editor.items.map((item, index) => <div className="portal-item-editor" key={index}>
          <Field label="Produk" required><Select value={item.product_id} onChange={e => setEditor(prev => ({ ...prev, items: prev.items.map((row, i) => i === index ? { ...row, product_id: Number(e.target.value) } : row) }))} required>
            {!products.some(p => p.id === Number(item.product_id)) && <option value={item.product_id}>Produk tidak tersedia — pilih pengganti</option>}
            {products.map(p => <option key={p.id} value={p.id}>{p.name} — {formatRp(p.price)}</option>)}
          </Select></Field>
          <Field label="Jumlah (min. 12 pcs)" required><Input type="number" min="12" max="10000" required value={item.quantity} onChange={e => setEditor(prev => ({ ...prev, items: prev.items.map((row, i) => i === index ? { ...row, quantity: e.target.value } : row) }))} /></Field>
          {editor.items.length > 1 && <Button variant="outline" onClick={() => setEditor(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))} aria-label={`Hapus baris produk ${index + 1}`}><Trash2 size={16} /></Button>}
        </div>)}
        <Button variant="outline" icon={Plus} disabled={editor.items.length >= Math.min(20, products.length)} onClick={() => setEditor(prev => ({ ...prev, items: [...prev.items, { product_id: products.find(p => !prev.items.some(item => Number(item.product_id) === p.id))?.id, quantity: 12 }] }))}>Tambah Produk</Button>
        <Field label="Alamat Pengiriman" required><Input value={editor.shipping_address} maxLength={255} required onChange={e => setEditor({ ...editor, shipping_address: e.target.value })} /></Field>
        <Field label="Spesifikasi & Detail Desain"><Textarea value={editor.notes || ''} maxLength={3000} rows={4} onChange={e => setEditor({ ...editor, notes: e.target.value })} /></Field>
        <p><strong>Total estimasi: {formatRp(estimate)}</strong></p><p className="portal-helper">Harga dihitung ulang oleh server. Harga final, ongkir, DP, dan jadwal dikonfirmasi admin.</p>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="portal-actions"><Button variant="outline" onClick={() => setEditor(null)} disabled={busy}>Batal</Button><Button type="submit" loading={busy}>Simpan Draft</Button></div>
      </form>}
    </Modal>
    <ConfirmDialog open={Boolean(deleting)} title="Hapus draft pesanan?" message="Draft dan pesanan yang belum dikonfirmasi akan dihapus. Tindakan ini tidak dapat dibatalkan." busy={busy} onCancel={() => { if (!busy) setDeleting(null) }} onConfirm={() => action(async () => { await api.delete(`/portal/drafts/${deleting.id}`, { data: { version: deleting.version } }); setDeleting(null) }, 'Draft dihapus.')} />
    <ConfirmDialog open={Boolean(sending)} title="Kirim pesanan ke admin?" message="Rincian akan masuk dashboard admin. Chat WhatsApp tidak dikirim otomatis." danger={false} confirmLabel="Kirim ke Admin" busy={busy} onCancel={() => { if (!busy) setSending(null) }} onConfirm={() => action(async () => { await api.post(`/portal/drafts/${sending.id}/submit`, { version: sending.version }); setSending(null) }, 'Pesanan terkirim ke dashboard. Gunakan Buka WhatsApp untuk menghubungi admin.')} />
    {(deleting || sending) && formError && <div className="portal-dialog-error" role="alert">{formError}</div>}
  </div>
}
