import {
  ArrowRight,
  Bell,
  Clock,
  FileText,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { formatDateTime, formatRp } from '../../lib/format'
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

export default function DashboardPage({ user, metrics, activities, orders, onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

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
