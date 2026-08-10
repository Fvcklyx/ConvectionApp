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

const THEME_KEY = 'frndly_theme'

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY)

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function AppShell({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [theme, setTheme] = useState(getInitialTheme)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('frndly_sidebar_collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const [metrics, setMetrics] = useState([])
  const [activities, setActivities] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

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
      const [dashboardRes, customersRes, productsRes, ordersRes, paymentsRes, invoicesRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/customers'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/payments'),
        api.get('/invoices'),
      ])

      setMetrics(dashboardRes.data.data.metrics)
      setActivities(dashboardRes.data.data.recentActivities)
      setCustomers(listOf(customersRes.data.data))

      const productRows = listOf(productsRes.data.data)
      setProducts(productRows)
      localStorage.setItem('frndly_products', JSON.stringify(productRows))

      setOrders(listOf(ordersRes.data.data))
      setPayments(listOf(paymentsRes.data.data))
      setInvoices(listOf(invoicesRes.data.data))
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
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const searchResults = useMemo(
    () => searchAll(searchQuery, { customers, orders, invoices, products }),
    [searchQuery, customers, orders, invoices, products],
  )

  const handlePickResult = (result) => {
    handleNavigate(result.section)
  }

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
