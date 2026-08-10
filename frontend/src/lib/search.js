import { FileText, Package, ShoppingCart, Users } from 'lucide-react'
import { formatRp } from './format'

const match = (value, query) => JSON.stringify(value).toLowerCase().includes(query)

export function searchAll(query, data) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results = []

  data.customers.forEach((customer) => {
    if (match(customer, q)) {
      results.push({
        type: 'customers',
        id: customer.id,
        section: 'customers',
        title: customer.name,
        subtitle: `${customer.customer_code || ''}${customer.city ? ` • ${customer.city}` : ''}`,
        Icon: Users,
      })
    }
  })

  data.orders.forEach((order) => {
    if (match(order, q)) {
      results.push({
        type: 'orders',
        id: order.id,
        section: 'orders',
        title: order.order_code,
        subtitle: order.customer?.name || `Customer #${order.customer_id}`,
        Icon: ShoppingCart,
      })
    }
  })

  data.invoices.forEach((invoice) => {
    if (match(invoice, q)) {
      results.push({
        type: 'invoices',
        id: invoice.id,
        section: 'invoices',
        title: invoice.invoice_code,
        subtitle: formatRp(invoice.total_amount),
        Icon: FileText,
      })
    }
  })

  data.products.forEach((product) => {
    if (match(product, q)) {
      results.push({
        type: 'products',
        id: product.id,
        section: 'products',
        title: product.name,
        subtitle: product.sku || product.category || '',
        Icon: Package,
      })
    }
  })

  const groups = { customers: [], orders: [], invoices: [], products: [] }
  results.forEach((result) => {
    if (groups[result.type].length < 4) groups[result.type].push(result)
  })

  return Object.values(groups).flat()
}
