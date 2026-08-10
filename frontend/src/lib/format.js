import { api } from '../api'

export const pad = (value, length) => String(value).padStart(length, '0')

export const todayYmd = () => {
  const date = new Date()
  return `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}`
}

export const todayInput = () => {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
}

export const formatRp = (value) => `Rp${Number(value || 0).toLocaleString('id-ID')}`

export const formatNumber = (value) => Number(value || 0).toLocaleString('id-ID')

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString('id-ID') : '-')

export const formatDateTime = (value) => (value ? new Date(value).toLocaleString('id-ID') : '-')

export const listOf = (payload) => (Array.isArray(payload) ? payload : payload?.data ?? [])

export const errorMessage = (error, fallback) =>
  error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]]?.[0] ||
  error.response?.data?.message ||
  fallback

export const downloadPdf = async (invoice) => {
  const response = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = `${invoice.invoice_code}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
