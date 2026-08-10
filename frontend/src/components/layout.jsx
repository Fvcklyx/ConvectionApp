import { useEffect, useId, useRef, useState } from 'react'
import {
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Search,
  Sun,
} from 'lucide-react'
import { Dropdown, IconButton, MenuItem } from './ui'

const cx = (...parts) => parts.filter(Boolean).join(' ')

function ProfileTrigger({ avatarUrl, initials, name }) {
  return (
    <span className="profile-chip">
      {avatarUrl ? (
        <span className="profile-avatar profile-avatar-img">
          <img src={avatarUrl} alt="" />
        </span>
      ) : (
        <span className="profile-avatar">{initials}</span>
      )}
      <span className="profile-name">{name}</span>
      <MoreVertical size={15} />
    </span>
  )
}

function GlobalSearchPanel({ results, activeIndex, onPick, onClose, panelId }) {
  const types = [
    { key: 'customers', label: 'Customers' },
    { key: 'orders', label: 'Orders' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'products', label: 'Products' },
  ]
  const hasResults = results.length > 0
  const panelRef = useRef(null)

  useEffect(() => {
    if (activeIndex < 0) return undefined
    const node = panelRef.current?.querySelector(`[data-search-index="${activeIndex}"]`)
    node?.scrollIntoView?.({ block: 'nearest' })
    return undefined
  }, [activeIndex])

  let flatIndex = -1

  return (
    <div id={panelId} className="global-search-panel" ref={panelRef} role="listbox">
      {!hasResults ? (
        <p className="global-search-empty">Tidak ada hasil ditemukan.</p>
      ) : (
        types.map(({ key, label }) => {
          const items = results.filter((result) => result.type === key)
          if (items.length === 0) return null

          return (
            <div className="gs-group" key={key}>
              <p className="gs-group-label">{label}</p>
              {items.map((item) => {
                flatIndex += 1
                const index = flatIndex
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    id={`${panelId}-option-${index}`}
                    data-search-index={index}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={cx('gs-item', activeIndex === index && 'gs-item-active')}
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
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}

export function Sidebar({ sections, active, collapsed, mobileOpen, onNavigate, user, onLogout, companyLogoUrl }) {
  const initials = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase()

  return (
    <aside className={cx('sidebar', collapsed && 'collapsed', mobileOpen && 'open')} aria-label="Navigasi utama">
      <div className="sidebar-brand">
        {companyLogoUrl ? (
          <span className="brand-logo brand-logo-img">
            <img src={companyLogoUrl} alt="Logo bisnis" />
          </span>
        ) : (
          <div className="brand-logo">F</div>
        )}
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
          {user?.avatar_url ? (
            <span className="user-avatar user-avatar-img">
              <img src={user.avatar_url} alt="" />
            </span>
          ) : (
            <div className="user-avatar">{initials}</div>
          )}
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
  const panelId = useId()
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    setActiveIndex(-1)
  }, [searchResults])

  const handleSearchKeyDown = (event) => {
    const count = searchResults.length

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (count === 0) return
      event.preventDefault()
      const dir = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => {
        if (current < 0) return dir === 1 ? 0 : count - 1
        return (current + dir + count) % count
      })
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      if (count === 0) return
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : count - 1)
      return
    }

    if (event.key === 'Enter') {
      if (count === 0) return
      event.preventDefault()
      onPickResult(searchResults[activeIndex >= 0 ? activeIndex : 0])
    }
  }

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
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari customer, order, invoice, produk..."
            aria-label="Pencarian global"
            role="combobox"
            aria-expanded={Boolean(searchQuery)}
            aria-controls={panelId}
            aria-activedescendant={activeIndex >= 0 ? `${panelId}-option-${activeIndex}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <kbd>Ctrl K</kbd>
        </div>
        {searchQuery && (
          <GlobalSearchPanel
            results={searchResults}
            activeIndex={activeIndex}
            onPick={onPickResult}
            onClose={() => onSearchChange('')}
            panelId={panelId}
          />
        )}
      </div>

      <div className="topbar-right">
        <IconButton label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </IconButton>

        <Dropdown trigger={<ProfileTrigger avatarUrl={user?.avatar_url} initials={initials} name={user?.name || user?.email || 'Admin'} />} label="Menu profil" align="end">
          <div className="profile-dropdown-head">
            {user?.avatar_url ? (
              <span className="profile-avatar profile-avatar-lg profile-avatar-img">
                <img src={user.avatar_url} alt="" />
              </span>
            ) : (
              <span className="profile-avatar profile-avatar-lg">{initials}</span>
            )}
            <div className="profile-dropdown-meta">
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email || ''}</small>
            </div>
          </div>
          <MenuItem icon={LogOut} danger onClick={onLogout}>
            Keluar
          </MenuItem>
        </Dropdown>
      </div>
    </header>
  )
}
