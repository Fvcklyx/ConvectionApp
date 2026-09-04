import test from 'node:test'
import assert from 'node:assert/strict'
import { orderChatUrl } from './portal.js'

test('WhatsApp template uses confirmed order number, server amounts and encoded details', () => {
  const order = { order_code: 'ORD-TEST', total: 1800000, shipping_address: 'Jl. A & B', notes: 'Biru #1 + ukuran M', items: [{ product_name: 'Kaos', quantity: 24, unit_price: 75000, subtotal: 1800000 }] }
  const url = new URL(orderChatUrl('0812-3456-7890', order, { name: 'Customer', customer_code: 'CUS-TEST', phone: '08123' }))
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/6281234567890')
  const message = url.searchParams.get('text')
  for (const text of ['ORD-TEST', 'CUS-TEST', '24 pcs', 'Rp1.800.000', 'Jl. A & B', 'Biru #1 + ukuran M']) assert.ok(message.includes(text))
  assert.equal(orderChatUrl('', order, {}), null)
  assert.equal(orderChatUrl('0812345', { ...order, order_code: null }, {}), null)
})
