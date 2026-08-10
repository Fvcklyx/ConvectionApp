import { Children, cloneElement, isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Search, X, XCircle } from 'lucide-react'
import { PAGE_SIZES } from '../lib/constants'

const cx = (...parts) => parts.filter(Boolean).join(' ')

export function Button({ variant = 'primary', size = 'md', icon: Icon, loading, children, className, ...props }) {
  return (
    <button
      type="button"
      className={cx('btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={15} className="spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </button>
  )
}

export function IconButton({ label, className, children, ...props }) {
  return (
    <button type="button" className={cx('icon-btn', className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  )
}

export function Field({ label, required, hint, error, children, className }) {
  return (
    <label className={cx('field', className)}>
      <span className="field-label">
        {label}
        {required && <span className="field-required">*</span>}
      </span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export function Input({ className, ...props }) {
  return <input className={cx('input', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cx('input', className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className, ...props }) {
  return <textarea className={cx('input', className)} {...props} />
}

export function FormGrid({ children, className }) {
  return <div className={cx('form-grid', className)}>{children}</div>
}

export function FormSection({ title, children }) {
  return (
    <div className="form-section">
      <h4 className="form-section-title">{title}</h4>
      {children}
    </div>
  )
}

export function Badge({ variant = 'neutral', children }) {
  return <span className={cx('badge', `badge-${variant}`)}>{children}</span>
}

export function StatusBadge({ value, labels = {}, variants = {}, fallback = 'draft' }) {
  const hasKey = Object.prototype.hasOwnProperty.call(labels, value)
  const key = hasKey ? value : fallback
  const variant = Object.prototype.hasOwnProperty.call(variants, key) ? variants[key] : 'neutral'

  return <span className={cx('badge', `badge-${variant}`)}>{hasKey ? labels[value] : value ?? '-'}</span>
}

export function Card({ children, className, ...props }) {
  return (
    <section className={cx('card', className)} {...props}>
      {children}
    </section>
  )
}

export function CardHeader({ title, subtitle, actions }) {
  return (
    <div className="card-header">
      <div className="card-header-text">
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  )
}

export function Modal({ open, title, subtitle, size = 'md', onClose, footer, children }) {
  const dialogRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previousFocus.current = document.activeElement
    document.body.classList.add('modal-open')

    const getFocusable = () => {
      const node = dialogRef.current
      if (!node) return []
      return [...node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (element) => !element.disabled && element.offsetParent !== null,
      )
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const items = getFocusable()
      const active = document.activeElement
      const inside = dialogRef.current?.contains(active)

      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    dialogRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
      previousFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cx('modal', `modal-${size}`)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <div className="modal-header-text">
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <IconButton label="Tutup" onClick={onClose}>
            <X size={17} />
          </IconButton>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Hapus', cancelLabel = 'Batal', busy, onConfirm, onCancel, danger = true }) {
  return (
    <Modal
      open={open}
      title={title}
      size="sm"
      onClose={onCancel}
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm-body">
        <div className={cx('confirm-icon', danger && 'confirm-icon-danger')}>
          {danger ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
        </div>
        <p>{message}</p>
      </div>
    </Modal>
  )
}

export function Dropdown({ trigger, align = 'end', label = 'Menu', children }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const menuId = useId()

  const close = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const getItems = () => [...(ref.current?.querySelectorAll('[role="menuitem"]') || [])]

    const onPointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) close()
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        triggerRef.current?.focus()
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        const list = getItems()
        if (list.length === 0) return
        event.preventDefault()

        let next = activeIndex
        if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = list.length - 1
        else next = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length

        setActiveIndex(next)
        list[next].focus()
        return
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        const list = getItems()
        if (list[activeIndex]) {
          event.preventDefault()
          list[activeIndex].click()
          triggerRef.current?.focus()
        }
      }
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, activeIndex, close])

  const menuItems = useMemo(
    () =>
      Children.map(children, (child) =>
        isValidElement(child) && child.type === MenuItem ? cloneElement(child, { onCloseMenu: close }) : child,
      ),
    [children, close],
  )

  return (
    <div className="dropdown" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </button>
      {open && (
        <div id={menuId} className={cx('dropdown-menu', `dropdown-menu-${align}`)} role="menu">
          {menuItems}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ icon: Icon, danger, onClick, onCloseMenu, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx('menu-item', danger && 'menu-item-danger')}
      onClick={() => {
        onClick?.()
        onCloseMenu?.()
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  )
}

export function Toast({ toast }) {
  if (!toast) return null

  const Icon = toast.type === 'error' ? XCircle : CheckCircle2

  return (
    <div className={cx('toast', toast.type === 'error' ? 'toast-error' : 'toast-success')} role="status">
      <Icon size={17} />
      <span>{toast.message}</span>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-icon">
          <Icon size={26} />
        </div>
      )}
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-banner" role="alert">
      <AlertTriangle size={17} />
      <span>{message}</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  )
}

export function Skeleton({ className, style }) {
  return <div className={cx('skeleton', className)} style={style} />
}

export function TableSkeleton({ rows = 6, columns = 6 }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      <Skeleton className="skeleton-row" style={{ height: 34 }} />
      {Array.from({ length: rows }).map((_, row) => (
        <div className="skeleton-row" key={row}>
          {Array.from({ length: columns }).map((__, col) => (
            <Skeleton key={col} style={{ height: 16, width: `${55 + ((row * 7 + col * 13) % 40)}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton">
      <div className="skeleton-kpis">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} style={{ height: 92 }} />
        ))}
      </div>
      <Skeleton style={{ height: 320 }} />
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPage, onPageSize }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="pagination">
      <div className="pagination-info-wrap">
        {onPageSize && (
          <div className="pagination-size">
            <Select className="input" value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))} aria-label="Baris per halaman">
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} / hal
                </option>
              ))}
            </Select>
          </div>
        )}
        <span className="pagination-info">
          Menampilkan {from}–{to} dari {total}
        </span>
      </div>
      <div className="pagination-controls">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Sebelumnya
        </Button>
        <span className="pagination-page">
          Halaman {page} / {pageCount}
        </span>
        <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
          Berikutnya
        </Button>
      </div>
    </div>
  )
}

export function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="search-field">
      <Search size={15} />
      <input
        className="input-plain"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Bersihkan pencarian" onClick={() => onChange('')}>
          <X size={13} />
        </button>
      )}
    </div>
  )
}

export function TableWrap({ children }) {
  return <div className="table-wrap">{children}</div>
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}

export function Toolbar({ search, onSearch, placeholder, onReset, children }) {
  return (
    <div className="toolbar">
      <SearchField value={search} onChange={onSearch} placeholder={placeholder} />
      {children}
      <div className="toolbar-spacer" />
      {(search || children) && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  )
}
