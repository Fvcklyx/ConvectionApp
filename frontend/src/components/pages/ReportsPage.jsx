import { useEffect, useState } from 'react'
import { Banknote, Download, Package, ShoppingCart, Users } from 'lucide-react'
import { api } from '../../api'
import { errorMessage, formatDate, formatNumber, formatRp } from '../../lib/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS, REPORT_TABS } from '../../lib/constants'
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Input,
  StatusBadge,
  TableWrap,
} from '../ui'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const SUMMARY_META = {
  sales: [
    { key: 'total_orders', label: 'Total Pesanan', icon: ShoppingCart, format: formatNumber },
    { key: 'total_quantity', label: 'Total Qty', icon: Package, format: formatNumber },
    { key: 'revenue', label: 'Pendapatan', icon: Banknote, format: formatRp },
    { key: 'average_order_value', label: 'Rata-rata Order', icon: Banknote, format: formatRp },
  ],
  profit: [
    { key: 'revenue', label: 'Pendapatan', icon: Banknote, format: formatRp },
    { key: 'production_cost', label: 'Biaya Produksi', icon: Package, format: formatRp },
    { key: 'shipping_cost', label: 'Ongkir', icon: ShoppingCart, format: formatRp },
    { key: 'profit', label: 'Profit', icon: Banknote, format: formatRp, accent: 'profit' },
  ],
  customers: [
    { key: 'total_customers', label: 'Total Pelanggan', icon: Users, format: formatNumber },
    { key: 'new_customers', label: 'Pelanggan Baru', icon: Users, format: formatNumber },
    { key: 'repeat_customers', label: 'Pelanggan Ulang', icon: Users, format: formatNumber },
    { key: 'average_customer_value', label: 'Nilai Rata-rata', icon: Banknote, format: formatRp },
  ],
  products: [
    { key: 'total_quantity', label: 'Total Qty', icon: Package, format: formatNumber },
    { key: 'revenue', label: 'Pendapatan', icon: Banknote, format: formatRp },
    { key: 'cost', label: 'Biaya', icon: Package, format: formatRp },
    { key: 'profit', label: 'Profit', icon: Banknote, format: formatRp, accent: 'profit' },
  ],
}

const SALES_COLUMNS = [
  { key: 'order_code', label: 'Kode Order', className: 'mono strong' },
  { key: 'customer_name', label: 'Customer', render: (row) => row.customer_name || '-' },
  { key: 'order_date', label: 'Tanggal', render: (row) => formatDate(row.order_date) },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} labels={ORDER_STATUS_LABELS} variants={ORDER_STATUS_VARIANTS} fallback="draft" />,
  },
  { key: 'quantity', label: 'Qty', render: (row) => formatNumber(row.quantity), numeric: true },
  { key: 'subtotal', label: 'Subtotal', render: (row) => formatRp(row.subtotal), numeric: true },
  { key: 'discount_amount', label: 'Diskon', render: (row) => formatRp(row.discount_amount), numeric: true },
  { key: 'shipping_cost', label: 'Ongkir', render: (row) => formatRp(row.shipping_cost), numeric: true },
  { key: 'grand_total', label: 'Total', render: (row) => formatRp(row.grand_total), numeric: true },
]

const PROFIT_COLUMNS = [
  { key: 'order_code', label: 'Kode Order', className: 'mono strong' },
  { key: 'customer_name', label: 'Customer', render: (row) => row.customer_name || '-' },
  { key: 'order_date', label: 'Tanggal', render: (row) => formatDate(row.order_date) },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} labels={ORDER_STATUS_LABELS} variants={ORDER_STATUS_VARIANTS} fallback="draft" />,
  },
  { key: 'grand_total', label: 'Total', render: (row) => formatRp(row.grand_total), numeric: true },
  { key: 'production_cost', label: 'Biaya Produksi', render: (row) => formatRp(row.production_cost), numeric: true },
  { key: 'shipping_cost', label: 'Ongkir', render: (row) => formatRp(row.shipping_cost), numeric: true },
  { key: 'discount_amount', label: 'Diskon', render: (row) => formatRp(row.discount_amount), numeric: true },
  { key: 'profit', label: 'Profit', render: (row) => <span className={cx(row.profit < 0 && 'text-danger')}>{formatRp(row.profit)}</span>, numeric: true },
]

const CUSTOMER_COLUMNS = [
  { key: 'customer_name', label: 'Customer', render: (row) => row.customer_name || '-' },
  { key: 'customer_code', label: 'Kode', className: 'mono' },
  { key: 'city', label: 'Kota', render: (row) => row.city || '-' },
  { key: 'order_count', label: 'Jumlah Order', render: (row) => formatNumber(row.order_count), numeric: true },
  { key: 'total_spent', label: 'Total Belanja', render: (row) => formatRp(row.total_spent), numeric: true },
  { key: 'last_order_date', label: 'Order Terakhir', render: (row) => formatDate(row.last_order_date) },
]

const PRODUCT_COLUMNS = [
  { key: 'product_name', label: 'Produk', render: (row) => row.product_name || '-' },
  { key: 'sku', label: 'SKU', className: 'mono' },
  { key: 'category', label: 'Kategori', render: (row) => row.category || '-' },
  { key: 'quantity', label: 'Qty', render: (row) => formatNumber(row.quantity), numeric: true },
  { key: 'revenue', label: 'Pendapatan', render: (row) => formatRp(row.revenue), numeric: true },
  { key: 'cost', label: 'Biaya', render: (row) => formatRp(row.cost), numeric: true },
  { key: 'profit', label: 'Profit', render: (row) => <span className={cx(row.profit < 0 && 'text-danger')}>{formatRp(row.profit)}</span>, numeric: true },
]

const TAB_COLUMNS = {
  sales: SALES_COLUMNS,
  profit: PROFIT_COLUMNS,
  customers: CUSTOMER_COLUMNS,
  products: PRODUCT_COLUMNS,
}

export default function ReportsPage({ title, description }) {
  const [tab, setTab] = useState('sales')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  const load = async (type = tab) => {
    setLoading(true)
    setError('')
    const params = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    try {
      const res = await api.get(`/reports/${type}`, { params })
      setData(res.data.data)
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat laporan.'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const handleApply = () => {
    load()
  }

  const handleExport = async () => {
    setExporting(true)
    const params = { format: 'csv' }
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    try {
      const response = await api.get(`/reports/${tab}/export`, { params, responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${tab}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(errorMessage(err, 'Gagal mengekspor laporan.'))
    } finally {
      setExporting(false)
    }
  }

  const summary = data?.summary || {}
  const rows = data?.rows || []
  const columns = TAB_COLUMNS[tab] || []

  const activeTab = REPORT_TABS.find((item) => item.key === tab)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="page-header-actions">
          <Button icon={Download} variant="outline" onClick={handleExport} loading={exporting}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="report-tabs" role="tablist" aria-label="Jenis laporan">
        {REPORT_TABS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={cx('report-tab', tab === item.key && 'report-tab-active')}
              onClick={() => setTab(item.key)}
            >
              <Icon size={15} />
              {item.label}
            </button>
          )
        })}
      </div>

      <Card className="report-filter-card">
        <Field label="Dari Tanggal">
          <Input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} />
        </Field>
        <Field label="Sampai Tanggal">
          <Input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} />
        </Field>
        <Button variant="outline" onClick={handleApply}>
          Terapkan
        </Button>
      </Card>

      {error && (
        <Card className="report-error">
          <EmptyState title="Gagal memuat laporan" description={error} action={<Button variant="outline" onClick={() => load()}>Coba Lagi</Button>} />
        </Card>
      )}

      {!error && (
        <>
          <div className="report-summary">
            {SUMMARY_META[tab].map((metric) => {
              const Icon = metric.icon
              const value = summary[metric.key]
              return (
                <Card key={metric.key} className="report-metric">
                  <div className={cx('report-metric-icon', metric.accent === 'profit' && (value < 0 ? 'metric-icon-danger' : 'metric-icon-success'))}>
                    <Icon size={17} />
                  </div>
                  <div className="report-metric-body">
                    <span className="report-metric-label">{metric.label}</span>
                    <span className={cx('report-metric-value', metric.accent === 'profit' && value < 0 && 'text-danger')}>
                      {loading ? '…' : metric.format(value)}
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="report-table-card">
            <CardHeader title={activeTab?.label} subtitle={`${rows.length} baris`} />
            {loading ? (
              <div className="report-loading">Memuat data laporan...</div>
            ) : rows.length === 0 ? (
              <EmptyState icon={activeTab?.icon} title="Belum ada data" description="Ubah rentang tanggal untuk melihat laporan." />
            ) : (
              <TableWrap>
                <table className="data-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.id ?? row.product_id ?? row.customer_code ?? index}-${index}`}>
                        {columns.map((column) => (
                          <td key={column.key} className={cx(column.className, column.numeric && 'align-right')}>
                            {column.render ? column.render(row) : row[column.key] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
