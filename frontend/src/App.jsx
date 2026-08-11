import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, SESSION_EXPIRED_EVENT, TOKEN_KEY } from './api'
import { Sidebar, Header } from './components/layout'
import { ErrorBanner, PageSkeleton, Toast } from './components/ui'
import { NAV_SECTIONS } from './lib/constants'
import { errorMessage, listOf } from './lib/format'
import { searchAll } from './lib/search'
import { startSessionGuard, LAST_ACTIVITY_KEY, touchActivity } from './lib/session'
import { getStorageItem, removeStorageItem, setStorageItem } from './lib/storage'
import LoginPage from './components/pages/LoginPage'
import LandingPage from './components/pages/LandingPage'
import DashboardPage from './components/pages/DashboardPage'
import CustomersPage from './components/pages/CustomersPage'
import ProductsPage from './components/pages/ProductsPage'
import OrdersPage from './components/pages/OrdersPage'
import PaymentsPage from './components/pages/PaymentsPage'
import InvoicesPage from './components/pages/InvoicesPage'
import ProductionPage from './components/pages/ProductionPage'
import ShippingPage from './components/pages/ShippingPage'
import ReviewsPage from './components/pages/ReviewsPage'
import TestimonialsPage from './components/pages/TestimonialsPage'
import ReportsPage from './components/pages/ReportsPage'
import SettingsPage from './components/pages/SettingsPage'

const THEME_KEY = 'frndly_theme'
const THEME_EXPLICIT_KEY = 'frndly_theme_explicit'

const COLLECTION_KEYS = [
  'customers',
  'products',
  'orders',
  'payments',
  'invoices',
  'productions',
  'shipments',
  'reviews',
  'testimonials',
]

const SECTION_DATA = {
  customers: ['customers'],
  products: ['products'],
  orders: ['orders', 'customers', 'products'],
  payments: ['payments', 'orders'],
  invoices: ['invoices', 'orders'],
  production: ['productions', 'orders'],
  shipping: ['shipments', 'orders'],
  reviews: ['reviews', 'orders'],
  testimonials: ['testimonials', 'reviews'],
}

const resolveTheme = (preference) => {
  if (preference === 'light' || preference === 'dark') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialTheme = () => {
  const stored = getStorageItem(THEME_KEY)

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return resolveTheme('system')
}

function AppShell({ user, onLogout, onUserUpdate }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [theme, setTheme] = useState(getInitialTheme)
  const [collapsed, setCollapsed] = useState(() => getStorageItem('frndly_sidebar_collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const periodTouched = useRef(false)

  const [metrics, setMetrics] = useState([])
  const [activities, setActivities] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [productions, setProductions] = useState([])
  const [shipments, setShipments] = useState([])
  const [reviews, setReviews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [settings, setSettings] = useState(null)
  const [company, setCompany] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [period, setPeriod] = useState('this_month')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setStorageItem(THEME_KEY, theme)
  }, [theme])

  const applyAppearance = useCallback((nextSettings) => {
    if (!nextSettings?.appearance) return

    if (!getStorageItem(THEME_EXPLICIT_KEY)) {
      setTheme(resolveTheme(nextSettings.appearance.default_theme || 'system'))
    }

    if (!periodTouched.current) {
      setPeriod(nextSettings.appearance.default_period || 'this_month')
    }
  }, [])

  const handleCompanyUpdate = useCallback((nextCompany) => {
    setCompany(nextCompany)
    setCompanyId(nextCompany?.id ?? null)
  }, [])

  const handleSettingsSaved = useCallback((nextSettings) => {
    setSettings(nextSettings)
    applyAppearance(nextSettings)
  }, [applyAppearance])

  useEffect(() => {
    applyAppearance(settings)
  }, [settings, applyAppearance])

  const sections = useMemo(() => {
    const groups = []

    NAV_SECTIONS.forEach((item) => {
      const group = groups.find((entry) => entry.key === item.group)

      if (group) {
        group.items.push({ key: item.key, label: item.label, icon: item.icon })
      } else {
        groups.push({ key: item.group, label: item.group, items: [{ key: item.key, label: item.label, icon: item.icon }] })
      }
    })

    return groups
  }, [])

  const activeItem = NAV_SECTIONS.find((item) => item.key === activeSection)

  const brandName = settings?.business?.company_name?.trim() || 'FRNDLY'

  const loadCollection = useCallback(async (key) => {
    const res = await api.get(`/${key}`)
    const rows = listOf(res.data.data)

    switch (key) {
      case 'customers':
        setCustomers(rows)
        break
      case 'products':
        setProducts(rows)
        break
      case 'orders':
        setOrders(rows)
        break
      case 'payments':
        setPayments(rows)
        break
      case 'invoices':
        setInvoices(rows)
        break
      case 'productions':
        setProductions(rows)
        break
      case 'shipments':
        setShipments(rows)
        break
      case 'reviews':
        setReviews(rows)
        break
      case 'testimonials':
        setTestimonials(rows)
        break
      default:
        break
    }

    return rows
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [, , , , , , , , , settingsRes, companyRes] = await Promise.all([
        ...COLLECTION_KEYS.map(loadCollection),
        api.get('/settings'),
        api.get('/settings/company'),
      ])

      setSettings(settingsRes.data.data)
      setCompany(companyRes.data.data)
      setCompanyId(companyRes.data.data?.id ?? null)
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout()
        return
      }

      setError(errorMessage(err, 'Gagal memuat data.'))
    } finally {
      setLoading(false)
    }
  }, [loadCollection, onLogout])

  const loadDashboard = useCallback(async () => {
    try {
      const dashboardRes = await api.get('/dashboard', { params: { period } })
      setMetrics(dashboardRes.data.data.metrics)
      setActivities(dashboardRes.data.data.recentActivities)
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout()
      }
    }
  }, [period, onLogout])

  const reloadFor = useCallback(
    (section) => {
      const keys = SECTION_DATA[section] || []
      return Promise.all(keys.map(loadCollection)).then(() => loadDashboard())
    },
    [loadCollection, loadDashboard],
  )

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const onLogoutRef = useRef(onLogout)

  useEffect(() => {
    onLogoutRef.current = onLogout
  })

  useEffect(() => {
    const handleSessionExpired = () => {
      onLogoutRef.current?.()
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    const stopGuard = startSessionGuard({ onSessionExpired: handleSessionExpired })

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
      stopGuard?.()
    }
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const handleNavigate = (key) => {
    setActiveSection(key)
    setMobileOpen(false)
    setFocus(null)
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 860) {
      setMobileOpen((current) => !current)
      return
    }

    setCollapsed((current) => {
      setStorageItem('frndly_sidebar_collapsed', current ? '0' : '1')
      return !current
    })
  }

  const toggleTheme = () => {
    setStorageItem(THEME_EXPLICIT_KEY, '1')
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const handlePeriodChange = (nextPeriod) => {
    periodTouched.current = true
    setPeriod(nextPeriod)
  }

  const searchResults = useMemo(
    () => searchAll(searchQuery, { customers, orders, invoices, products }),
    [searchQuery, customers, orders, invoices, products],
  )

  const handlePickResult = (result) => {
    handleNavigate(result.section)
    setSearchQuery('')
    const pools = { customers, orders, invoices, products }
    const record = pools[result.section]?.find((row) => row.id === result.id)
    setFocus((current) => ({
      section: result.section,
      record: record || null,
      nonce: (current?.nonce ?? 0) + 1,
    }))
  }

  const handleFocusHandled = useCallback(() => {
    setFocus(null)
  }, [])

  const renderContent = () => {
    if (loading) {
      return <PageSkeleton />
    }

    if (error) {
      return <ErrorBanner message={error} onRetry={loadAll} />
    }

    switch (activeSection) {
      case 'customers':
        return (
          <CustomersPage
            rows={customers}
            refresh={() => reloadFor('customers')}
            onNotify={showToast}
            title="Customers"
            description={`Kelola data pelanggan ${brandName}.`}
            focusRecord={focus?.section === 'customers' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
            brandName={brandName}
          />
        )
      case 'products':
        return (
          <ProductsPage
            rows={products}
            refresh={() => reloadFor('products')}
            onNotify={showToast}
            title="Products"
            description="Kelola produk dan harga jual."
            focusRecord={focus?.section === 'products' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
            brandName={brandName}
          />
        )
      case 'orders':
        return (
          <OrdersPage
            rows={orders}
            customers={customers}
            products={products}
            refresh={() => reloadFor('orders')}
            onNotify={showToast}
            title="Orders"
            description="Kelola seluruh pesanan customer."
            focusRecord={focus?.section === 'orders' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
            brandName={brandName}
          />
        )
      case 'payments':
        return (
          <PaymentsPage
            rows={payments}
            orders={orders}
            refresh={() => reloadFor('payments')}
            onNotify={showToast}
            title="Payments"
            description="Catat DP dan pelunasan pembayaran."
            brandName={brandName}
          />
        )
      case 'invoices':
        return (
          <InvoicesPage
            rows={invoices}
            orders={orders}
            refresh={() => reloadFor('invoices')}
            onNotify={showToast}
            title="Invoices"
            description="Buat dan unduh invoice formal."
            focusRecord={focus?.section === 'invoices' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            brandName={brandName}
          />
        )
      case 'production':
        return (
          <ProductionPage
            rows={productions}
            orders={orders}
            refresh={() => reloadFor('production')}
            onNotify={showToast}
            title="Production"
            description="Pantau proses produksi pesanan."
            brandName={brandName}
          />
        )
      case 'shipping':
        return (
          <ShippingPage
            rows={shipments}
            orders={orders}
            refresh={() => reloadFor('shipping')}
            onNotify={showToast}
            title="Shipping"
            description="Kelola pengiriman dan tracking."
            brandName={brandName}
          />
        )
      case 'reviews':
        return (
          <ReviewsPage
            rows={reviews}
            orders={orders}
            refresh={() => reloadFor('reviews')}
            onNotify={showToast}
            title="Reviews"
            description="Moderasi ulasan customer."
            brandName={brandName}
          />
        )
      case 'testimonials':
        return (
          <TestimonialsPage
            rows={testimonials}
            reviews={reviews}
            refresh={() => reloadFor('testimonials')}
            onNotify={showToast}
            title="Testimonials"
            description="Kelola testimonial untuk ditampilkan."
          />
        )
      case 'reports':
        return (
          <ReportsPage
            title="Reports"
            description="Laporan bisnis berdasarkan data aktual."
          />
        )
      case 'settings':
        return (
          <SettingsPage
            onNotify={showToast}
            onAppearanceSaved={handleSettingsSaved}
            onUserUpdated={onUserUpdate}
            onCompanyUpdated={handleCompanyUpdate}
            title="Settings"
            description="Pengaturan aplikasi dan bisnis."
          />
        )
      default:
        return (
          <DashboardPage
            user={user}
            metrics={metrics}
            activities={activities}
            orders={orders}
            payments={payments}
            period={period}
            onPeriodChange={handlePeriodChange}
            onNavigate={handleNavigate}
            brandName={brandName}
          />
        )
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        sections={sections}
        active={activeSection}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={handleNavigate}
        user={user}
        onLogout={onLogout}
        companyLogoUrl={company?.logo_url}
        brandName={brandName}
      />

      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      <div className="main">
        <Header
          title={activeItem?.label}
          groupLabel={activeItem?.group}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
          onPickResult={handlePickResult}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
          onLogout={onLogout}
        />

        <main className="content">{renderContent()}</main>
      </div>

      <Toast toast={toast} />
    </div>
  )
}

function App() {
  const [token, setToken] = useState(() => getStorageItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  const handleLogin = (newToken, newUser) => {
    touchActivity()
    setToken(newToken)
    setUser(newUser)
  }

  const handleUserUpdate = (nextUser) => {
    setUser(nextUser)
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Token mungkin sudah tidak valid; tetap keluar.
    }

    removeStorageItem(TOKEN_KEY)
    removeStorageItem(LAST_ACTIVITY_KEY)
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return window.location.pathname === '/' ? <LandingPage /> : <LoginPage onLogin={handleLogin} />
  }

  return <AppShell user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
}

export default App
