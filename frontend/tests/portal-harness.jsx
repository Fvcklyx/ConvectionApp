// Isolated UI fixture: all requests handled in memory, never sends real API writes.
import React from 'react'
import { createRoot } from 'react-dom/client'
import CustomerPortal from '../src/components/pages/CustomerPortal'
import { ThemeProvider } from '../src/components/context/ThemeContext'
import { api } from '../src/api'
import { cachedBusinessName } from '../src/lib/branding'
import '../src/index.css'
import '../src/fonts.css'
import '../src/storefront.css'

let profile = { customer_code: 'CUS-QA', name: 'Customer QA', phone: '08123456789', email: 'qa@example.test', address: 'Alamat uji', city: 'Bandung', province: 'Jawa Barat' }
const products = [{ id: 1, name: 'Kaos Uji', price: 75000, category: 'Apparel' }, { id: 2, name: 'Lanyard Uji', price: 15000, category: 'Aksesoris' }]
const items = [{ product_id: 1, product_name: 'Kaos Uji', quantity: 24, unit_price: 75000, subtotal: 1800000 }]
let drafts = [{ id: 1, version: 1, items, total: 1800000, shipping_address: 'Alamat uji', notes: 'Sablon biru', editable: true, submitted_at: null, status: 'draft_local', invoices: [] }, { id: 2, version: 2, items, total: 1800000, shipping_address: 'Alamat uji', notes: 'Lunas', editable: false, submitted_at: '2026-09-04', status: 'paid', order_id: 2, order_code: 'ORD-QA-PAID', invoices: [], paid_amount: 1800000, remaining_amount: 0 }]
const feedback = { reviews: [], testimonials: [] }
const paginated = rows => ({ data: rows, current_page: 1, last_page: 1 })
api.defaults.adapter = async config => {
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {}
  if (body.items) {
    body.items = body.items.map(item => { const product = products.find(p => p.id === Number(item.product_id)); return { ...item, product_name: product.name, unit_price: product.price, subtotal: product.price * Number(item.quantity) } })
    body.total = body.items.reduce((total, item) => total + item.subtotal, 0)
  }
  let data
  if (config.url === '/company/profile') data = { name: cachedBusinessName(), phone: '08123456789', products }
  else if (config.url === '/portal/profile') { if (config.method === 'put') profile = { ...profile, ...body }; data = profile }
  else if (config.url === '/portal/orders') data = paginated([])
  else if (config.url === '/portal/engagement') data = feedback
  else if (config.url === '/portal/drafts' && config.method === 'get') data = paginated(drafts)
  else if (config.url === '/portal/drafts' && config.method === 'post') { data = { ...body, id: 3, version: 1, total: 1800000, editable: true, status: 'draft_local', invoices: [] }; drafts = [data, ...drafts] }
  else if (/\/drafts\/\d+/.test(config.url)) {
    const id = Number(config.url.match(/\/drafts\/(\d+)/)[1]); const draft = drafts.find(d => d.id === id)
    if (config.method === 'delete') drafts = drafts.filter(d => d.id !== id)
    else if (config.url.endsWith('/submit')) Object.assign(draft, { submitted_at: '2026-09-04', order_id: id, order_code: 'ORD-QA-'+id, status: 'draft', version: draft.version + 1, paid_amount: 0, remaining_amount: draft.total })
    else Object.assign(draft, body, { version: draft.version + 1 })
    data = draft
  } else if (config.url.endsWith('/review')) { data = { ...body, id: 1, is_published: false }; feedback.reviews.push(data); drafts.find(d => d.order_id === Number(body.order_id)).review = data }
  else if (config.url === '/portal/testimonials') { data = { ...body, review_id: Number(body.review_id), id: 1, is_published: false }; feedback.testimonials.push(data) }
  else throw Error('Unexpected fixture route '+config.url)
  return { data: { data }, status: 200, statusText: 'OK', config, headers: {} }
}
createRoot(document.getElementById('root')).render(<ThemeProvider><CustomerPortal user={{ name: 'Customer QA', email: 'qa@example.test' }} onLogout={() => {}} /></ThemeProvider>)
