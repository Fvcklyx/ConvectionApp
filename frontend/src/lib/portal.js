const formatRp = value => `Rp${Number(value || 0).toLocaleString('id-ID')}`

export function orderChatUrl(phone, order, profile) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits || !order.order_code) return null
  const number = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  const items = order.order_items?.length ? order.order_items : order.items
  const lines = [
    `Halo admin, saya ingin konfirmasi pesanan ${order.order_code}.`,
    `Customer: ${profile.name || '-'} (${profile.customer_code || '-'})`,
    `Telepon: ${profile.phone || '-'}`, '',
    ...items.map((item, index) => `${index + 1}. ${item.product_name_snapshot || item.product_name} — ${item.quantity} pcs × ${formatRp(item.unit_price)} = ${formatRp(item.subtotal)}`),
    '', `Total estimasi: ${formatRp(order.total)}`, `Alamat kirim: ${order.shipping_address}`,
    `Spesifikasi/catatan: ${order.notes || '-'}`, '',
    'Mohon konfirmasi harga final, ongkir, DP, dan jadwal produksi. Pesanan sudah tercatat di dashboard.',
  ]
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}
