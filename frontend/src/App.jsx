import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, TOKEN_KEY } from './api'
import { Sidebar, Header } from './components/layout'
import { ErrorBanner, PageSkeleton, Toast } from './components/ui'
import { NAV_SECTIONS } from './lib/constants'
import { errorMessage, listOf } from './lib/format'
import { searchAll } from './lib/search'
import LoginPage from './components/pages/LoginPage'
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

const resolveTheme = (preference) => {
  if (preference === 'light' || preference === 'dark') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY)

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return resolveTheme('system')
}

function AppShell({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [theme, setTheme] = useState(getInitialTheme)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('frndly_sidebar_collapsed') === '1')
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
  const [companyId, setCompanyId] = useState(null)
  const [period, setPeriod] = useState('this_month')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const applyAppearance = useCallback((nextSettings) => {
    if (!nextSettings?.appearance) return

    if (!localStorage.getItem(THEME_EXPLICIT_KEY)) {
      setTheme(resolveTheme(nextSettings.appearance.default_theme || 'system'))
    }

    if (!periodTouched.current) {
      setPeriod(nextSettings.appearance.default_period || 'this_month')
    }
  }, [])

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

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [customersRes, productsRes, ordersRes, paymentsRes, invoicesRes, productionsRes, shipmentsRes, reviewsRes, testimonialsRes, settingsRes, companyRes] = await Promise.all([
        api.get('/customers'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/payments'),
        api.get('/invoices'),
        api.get('/productions'),
        api.get('/shipments'),
        api.get('/reviews'),
        api.get('/testimonials'),
        api.get('/settings'),
        api.get('/settings/company'),
      ])

      setCustomers(listOf(customersRes.data.data))

      const productRows = listOf(productsRes.data.data)
      setProducts(productRows)
      localStorage.setItem('frndly_products', JSON.stringify(productRows))

      setOrders(listOf(ordersRes.data.data))
      setPayments(listOf(paymentsRes.data.data))
      setInvoices(listOf(invoicesRes.data.data))
      setProductions(listOf(productionsRes.data.data))
      setShipments(listOf(shipmentsRes.data.data))
      setReviews(listOf(reviewsRes.data.data))
      setTestimonials(listOf(testimonialsRes.data.data))
      setSettings(settingsRes.data.data)
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
  }, [onLogout])

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

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    loadAll()
  }, [loadAll])

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
      localStorage.setItem('frndly_sidebar_collapsed', current ? '0' : '1')
      return !current
    })
  }

  const toggleTheme = () => {
    localStorage.setItem(THEME_EXPLICIT_KEY, '1')
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
            refresh={loadAll}
            onNotify={showToast}
            title="Customers"
            description="Kelola data pelanggan FRNDLY."
            focusRecord={focus?.section === 'customers' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
          />
        )
      case 'products':
        return (
          <ProductsPage
            rows={products}
            refresh={loadAll}
            onNotify={showToast}
            title="Products"
            description="Kelola produk dan harga jual."
            focusRecord={focus?.section === 'products' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
          />
        )
      case 'orders':
        return (
          <OrdersPage
            rows={orders}
            customers={customers}
            refresh={loadAll}
            onNotify={showToast}
            title="Orders"
            description="Kelola seluruh pesanan customer."
            focusRecord={focus?.section === 'orders' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
            companyId={companyId}
          />
        )
      case 'payments':
        return (
          <PaymentsPage
            rows={payments}
            orders={orders}
            refresh={loadAll}
            onNotify={showToast}
            title="Payments"
            description="Catat DP dan pelunasan pembayaran."
          />
        )
      case 'invoices':
        return (
          <InvoicesPage
            rows={invoices}
            orders={orders}
            refresh={loadAll}
            onNotify={showToast}
            title="Invoices"
            description="Buat dan unduh invoice formal."
            focusRecord={focus?.section === 'invoices' ? focus.record : null}
            focusNonce={focus?.nonce ?? 0}
            onFocusHandled={handleFocusHandled}
          />
        )
      case 'production':
        return (
          <ProductionPage
            rows={productions}
            orders={orders}
            refresh={loadAll}
            onNotify={showToast}
            title="Production"
            description="Pantau proses produksi pesanan."
          />
        )
      case 'shipping':
        return (
          <ShippingPage
            rows={shipments}
            orders={orders}
            refresh={loadAll}
            onNotify={showToast}
            title="Shipping"
            description="Kelola pengiriman dan tracking."
          />
        )
      case 'reviews':
        return (
          <ReviewsPage
            rows={reviews}
            orders={orders}
            refresh={loadAll}
            onNotify={showToast}
            title="Reviews"
            description="Moderasi ulasan customer."
          />
        )
      case 'testimonials':
        return (
          <TestimonialsPage
            rows={testimonials}
            reviews={reviews}
            refresh={loadAll}
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
            onAppearanceSaved={applyAppearance}
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
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Token mungkin sudah tidak valid; tetap keluar.
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('frndly_products')
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AppShell user={user} onLogout={handleLogout} />
}

export default App
