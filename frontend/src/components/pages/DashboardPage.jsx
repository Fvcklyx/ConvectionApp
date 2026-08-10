import { useMemo } from 'react'
import { ArrowRight, Clock, TrendingUp, Wallet } from 'lucide-react'
import { formatDateTime, formatRp, pad } from '../../lib/format'
import { METRIC_META, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from '../../lib/constants'
import { Card, CardHeader, StatusBadge, TableWrap } from '../../components/ui'

const cx = (...parts) => parts.filter(Boolean).join(' ')

function KpiCard({ label, value, icon: Icon, tint }) {
  return (
    <article className={cx('kpi-card', `kpi-${tint}`)}>
      <div className="kpi-icon">
        <Icon size={18} />
      </div>
      <div className="kpi-body">
        <p className="kpi-label">{label}</p>
        <strong className="kpi-value">{value}</strong>
      </div>
    </article>
  )
}

function StatusBreakdown({ orders }) {
  const counts = Object.keys(ORDER_STATUS_LABELS).map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }))
  const total = Math.max(1, counts.reduce((sum, item) => sum + item.count, 0))

  return (
    <ul className="status-list">
      {counts.map(({ status, count }) => (
        <li key={status} className="status-item">
          <div className="status-item-head">
            <StatusBadge
              value={status}
              labels={ORDER_STATUS_LABELS}
              variants={ORDER_STATUS_VARIANTS}
              fallback="draft"
            />
            <strong>{count}</strong>
          </div>
          <div className="status-bar">
            <span
              className={cx('status-bar-fill', `badge-${ORDER_STATUS_VARIANTS[status] || 'neutral'}`)}
              style={{ width: `${Math.max(count === 0 ? 0 : 4, (count / total) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function RecentOrders({ orders }) {
  if (orders.length === 0) {
    return <p className="muted-empty">Belum ada pesanan.</p>
  }

  return (
    <TableWrap>
      <table className="data-table">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Customer</th>
            <th>Status</th>
            <th className="align-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 6).map((order) => (
            <tr key={order.id}>
              <td className="mono">{order.order_code}</td>
              <td>{order.customer?.name || `Customer #${order.customer_id}`}</td>
              <td>
                <StatusBadge
                  value={order.status}
                  labels={ORDER_STATUS_LABELS}
                  variants={ORDER_STATUS_VARIANTS}
                  fallback="draft"
                />
              </td>
              <td className="align-right strong">{formatRp(order.grand_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

function Activities({ activities }) {
  if (activities.length === 0) {
    return <p className="muted-empty">Belum ada aktivitas.</p>
  }

  return (
    <ul className="activity-list">
      {activities.map((activity, index) => (
        <li key={`${activity.title}-${index}`} className="activity-item">
          <span className="activity-dot" />
          <div className="activity-body">
            <strong>{activity.title}</strong>
            <p>{activity.description}</p>
          </div>
          <span className="activity-time">{formatDateTime(activity.createdAt)}</span>
        </li>
      ))}
    </ul>
  )
}

function RevenueChart({ days, max, total }) {
  if (total <= 0) {
    return <p className="muted-empty">Belum ada pembayaran dalam 14 hari terakhir.</p>
  }

  return (
    <div className="revenue-chart" role="img" aria-label="Grafik pendapatan 14 hari terakhir">
      {days.map((day) => (
        <div className="revenue-bar-col" key={day.key} title={`${day.label}: ${formatRp(day.total)}`}>
          <div className="revenue-bar-track">
            <div
              className="revenue-bar-fill"
              style={{ height: `${Math.max(day.total > 0 ? 5 : 0, (day.total / max) * 100)}%` }}
            />
          </div>
          <span className="revenue-bar-label">{day.label}</span>
        </div>
      ))}
    </div>
  )
}

function buildRevenueDays(payments) {
  const buckets = []
  const now = new Date()

  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
    buckets.push({
      key,
      label: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      total: 0,
    })
  }

  payments.forEach((payment) => {
    if (!payment.payment_date) return
    const date = new Date(payment.payment_date)
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
    const bucket = buckets.find((item) => item.key === key)
    if (bucket) bucket.total += Number(payment.amount || 0)
  })

  return {
    days: buckets,
    total: buckets.reduce((sum, item) => sum + item.total, 0),
  }
}

export default function DashboardPage({ user, metrics, activities, orders, payments, onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

  const revenue = useMemo(() => buildRevenueDays(payments), [payments])
  const paidSum = orders.reduce((sum, order) => sum + Number(order.paid_amount || 0), 0)
  const outstandingSum = orders.reduce((sum, order) => sum + Number(order.remaining_amount || 0), 0)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h2>
            {greeting}, {user?.name || 'Admin'}
          </h2>
          <p>Ringkasan bisnis FRNDLY hari ini.</p>
        </div>
      </div>

      <div className="kpi-grid">
        {metrics.map((metric) => {
          const meta = METRIC_META[metric.label] || { label: metric.label, icon: TrendingUp, tint: 'primary' }
          return <KpiCard key={metric.label} label={meta.label} value={metric.value} icon={meta.icon} tint={meta.tint} />
        })}
      </div>

      <Card>
        <CardHeader
          title="Tren Pendapatan"
          subtitle="Pembayaran masuk 14 hari terakhir"
          actions={<strong className="revenue-total">{formatRp(revenue.total)}</strong>}
        />
        <RevenueChart days={revenue.days} max={Math.max(...revenue.days.map((day) => day.total))} total={revenue.total} />
      </Card>

      <div className="dashboard-grid">
        <Card>
          <CardHeader title="Status Pesanan" subtitle="Distribusi seluruh pesanan" />
          <StatusBreakdown orders={orders} />
          <div className="status-summary">
            <div className="status-summary-item">
              <Wallet size={15} />
              <span>Terbayar</span>
              <strong>{formatRp(paidSum)}</strong>
            </div>
            <div className="status-summary-item">
              <Clock size={15} />
              <span>Belum dibayar</span>
              <strong>{formatRp(outstandingSum)}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Aktivitas Terbaru" subtitle="Perubahan terakhir di FRNDLY" />
          <Activities activities={activities} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Pesanan Terbaru"
          subtitle="Order paling baru di sistem"
          actions={
            <button type="button" className="link-btn" onClick={() => onNavigate('orders')}>
              Lihat semua <ArrowRight size={14} />
            </button>
          }
        />
        <RecentOrders orders={orders} />
      </Card>
    </div>
  )
}
