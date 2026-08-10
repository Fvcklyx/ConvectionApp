import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Clock, TrendingUp, Wallet } from 'lucide-react'
import { formatDateTime, formatRp, pad } from '../../lib/format'
import { METRIC_META, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS, PERIOD_OPTIONS } from '../../lib/constants'
import { Card, CardHeader, Select, StatusBadge, TableWrap } from '../../components/ui'

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
  const [active, setActive] = useState(null)
  const wrapRef = useRef(null)
  const [wrapWidth, setWrapWidth] = useState(0)

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return undefined

    const measure = () => setWrapWidth(node.getBoundingClientRect().width)
    measure()

    if (typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (total <= 0) {
    return <p className="muted-empty">Belum ada pembayaran dalam 14 hari terakhir.</p>
  }

  const viewW = 720
  const viewH = 200
  const heightPx = 190
  const padX = 30
  const padTop = 22
  const padBottom = 24
  const innerW = viewW - padX * 2
  const innerH = viewH - padTop - padBottom

  const points = days.map((day, index) => {
    const x = padX + (index / (days.length - 1)) * innerW
    const y = padTop + innerH - (day.total / max) * innerH
    return { ...day, index, x, y }
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x} ${padTop + innerH} L${points[0].x} ${padTop + innerH} Z`

  const widthPx = wrapWidth || viewW
  const scale = Math.min(widthPx / viewW, heightPx / viewH)
  const offsetX = (widthPx - viewW * scale) / 2
  const offsetY = (heightPx - viewH * scale) / 2

  const activePoint = active !== null ? points[active] : null

  return (
    <div className="revenue-chart" ref={wrapRef}>
      <div className="revenue-canvas">
        <svg
          className="revenue-line"
          viewBox={`0 0 ${viewW} ${viewH}`}
          role="img"
          aria-label="Grafik pendapatan 14 hari terakhir"
        >
          <defs>
            <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
              <stop offset="55%" stopColor="var(--color-primary)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="revenue-area" d={areaPath} />
          <path className="revenue-line-path" d={linePath} />
          {points.map((point) => (
            <g key={point.key} className="revenue-point">
              <circle
                className="revenue-point-hit"
                cx={point.x}
                cy={point.y}
                r={18}
                tabIndex={0}
                onMouseEnter={() => setActive(point.index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(point.index)}
                onBlur={() => setActive(null)}
              />
              <circle
                className={cx('revenue-point-dot', active === point.index && 'revenue-point-dot-active')}
                cx={point.x}
                cy={point.y}
                r={active === point.index ? 5 : 3.2}
              />
            </g>
          ))}
        </svg>

        {activePoint && (
          <div
            className="revenue-tooltip"
            style={{ left: `${offsetX + activePoint.x * scale}px`, top: `${offsetY + activePoint.y * scale}px` }}
            role="status"
          >
            <span className="revenue-tooltip-label">{activePoint.label}</span>
            <strong className="revenue-tooltip-value">{formatRp(activePoint.total)}</strong>
          </div>
        )}
      </div>

      <div className="revenue-x-labels">
        {points.map((point) => (
          <span key={point.key}>{point.label}</span>
        ))}
      </div>
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

export default function DashboardPage({ user, metrics, activities, orders, payments, period, onPeriodChange, onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

  const revenue = useMemo(() => buildRevenueDays(payments), [payments])
  const paidSum = orders.reduce((sum, order) => sum + Number(order.paid_amount || 0), 0)
  const outstandingSum = orders.reduce((sum, order) => sum + Number(order.remaining_amount || 0), 0)
  const periodLabel = PERIOD_OPTIONS.find((option) => option.value === period)?.label || 'Bulan Ini'

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h2>
            {greeting}, {user?.name || 'Admin'}
          </h2>
          <p>Ringkasan bisnis FRNDLY periode {periodLabel.toLowerCase()}.</p>
        </div>
        <div className="page-header-actions">
          <div className="toolbar-filter">
            <span className="toolbar-filter-label">Periode</span>
            <Select value={period} onChange={(event) => onPeriodChange(event.target.value)}>
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
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
