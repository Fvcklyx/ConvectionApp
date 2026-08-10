import { useEffect, useRef } from 'react'
import {
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Search,
  Sun,
} from 'lucide-react'
import { IconButton, Dropdown } from './ui'

const cx = (...parts) => parts.filter(Boolean).join(' ')

function ProfileTrigger({ initials, name }) {
  return (
    <span className="profile-chip">
      <span className="profile-avatar">{initials}</span>
      <span className="profile-name">{name}</span>
      <MoreVertical size={15} />
    </span>
  )
}

function GlobalSearchPanel({ results, onPick, onClose }) {
  const types = [
    { key: 'customers', label: 'Customers' },
    { key: 'orders', label: 'Orders' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'products', label: 'Products' },
  ]
  const hasResults = results.length > 0

  return (
    <div className="global-search-panel">
      {!hasResults ? (
        <p className="global-search-empty">Tidak ada hasil ditemukan.</p>
      ) : (
        types.map(({ key, label }) => {
          const items = results.filter((result) => result.type === key)
          if (items.length === 0) return null

          return (
            <div className="gs-group" key={key}>
              <p className="gs-group-label">{label}</p>
              {items.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  className="gs-item"
                  onClick={() => {
                    onPick(item)
                    onClose()
                  }}
                >
                  <span className="gs-icon">{item.Icon ? <item.Icon size={15} /> : null}</span>
                  <span className="gs-text">
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                </button>
              ))}
            </div>
          )
        })
      )}
    </div>
  )
}

export function Sidebar({ sections, active, collapsed, mobileOpen, onNavigate, user, onLogout }) {
  const initials = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase()

  return (
    <aside className={cx('sidebar', collapsed && 'collapsed', mobileOpen && 'open')} aria-label="Navigasi utama">
      <div className="sidebar-brand">
        <div className="brand-logo">F</div>
        <span className="brand-text">FRNDLY</span>
      </div>

      <nav className="sidebar-nav">
        {sections.map((group) => (
          <div className="nav-group" key={group.key}>
            <p className="nav-group-label">{group.label}</p>
            {group.items.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                title={collapsed ? label : undefined}
                className={cx('nav-btn', key === active && 'active')}
                aria-current={key === active ? 'page' : undefined}
                onClick={() => onNavigate(key)}
              >
                <Icon size={18} />
                <span className="nav-label">{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <strong>{user?.name || 'Admin'}</strong>
            <small>{user?.email || ''}</small>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          <LogOut size={16} />
          <span className="nav-label">Keluar</span>
        </button>
      </div>
    </aside>
  )
}

export function Header({
  title,
  groupLabel,
  searchQuery,
  onSearchChange,
  searchResults,
  onPickResult,
  onToggleSidebar,
  theme,
  onToggleTheme,
  user,
  onLogout,
}) {
  const searchRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target && target.isContentEditable)

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      } else if (event.key === '/' && !isTyping) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!searchQuery) return undefined

    const onPointer = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onSearchChange('')
      }
    }
    const onKey = (event) => {
      if (event.key === 'Escape') onSearchChange('')
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchQuery, onSearchChange])

  const initials = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase()

  return (
    <header className="topbar">
      <IconButton label="Menu" className="sidebar-toggle" onClick={onToggleSidebar}>
        <Menu size={18} />
      </IconButton>

      <div className="topbar-title">
        <div className="breadcrumb">
          {groupLabel && <span>{groupLabel}</span>}
          <ChevronRight size={13} />
          <strong>{title}</strong>
        </div>
      </div>

      <div className="global-search" ref={panelRef}>
        <div className="global-search-box">
          <Search size={15} />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari customer, order, invoice, produk..."
            aria-label="Pencarian global"
          />
          <kbd>Ctrl K</kbd>
        </div>
        {searchQuery && (
          <GlobalSearchPanel results={searchResults} onPick={onPickResult} onClose={() => onSearchChange('')} />
        )}
      </div>

      <div className="topbar-right">
        <IconButton label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>

        <Dropdown trigger={<ProfileTrigger initials={initials} name={user?.name || user?.email || 'Admin'} />} label="Menu profil" align="end">
          <div className="profile-dropdown-head">
            <span className="profile-avatar profile-avatar-lg">{initials}</span>
            <div className="profile-dropdown-meta">
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email || ''}</small>
            </div>
          </div>
          <button type="button" className="menu-item menu-item-danger" role="menuitem" onClick={onLogout}>
            <LogOut size={15} />
            Keluar
          </button>
        </Dropdown>
      </div>
    </header>
  )
}
