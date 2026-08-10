import {
  Banknote,
  BarChart3,
  ClipboardList,
  CreditCard,
  Factory,
  FileText,
  Hourglass,
  LayoutDashboard,
  Package,
  Quote,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'Menu Utama',
    description: 'Ringkasan bisnis Anda.',
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: Users,
    group: 'Penjualan',
    description: 'Kelola data pelanggan bisnis Anda.',
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    group: 'Penjualan',
    description: 'Kelola seluruh pesanan customer.',
  },
  {
    key: 'invoices',
    label: 'Invoices',
    icon: FileText,
    group: 'Penjualan',
    description: 'Buat dan unduh invoice formal.',
  },
  {
    key: 'payments',
    label: 'Payments',
    icon: CreditCard,
    group: 'Penjualan',
    description: 'Catat DP dan pelunasan pembayaran.',
  },
  {
    key: 'products',
    label: 'Products',
    icon: Package,
    group: 'Katalog',
    description: 'Kelola produk dan harga jual.',
  },
  {
    key: 'production',
    label: 'Production',
    icon: Factory,
    group: 'Operasional',
    description: 'Pantau proses produksi pesanan.',
  },
  {
    key: 'shipping',
    label: 'Shipping',
    icon: Truck,
    group: 'Operasional',
    description: 'Kelola pengiriman dan tracking.',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: Star,
    group: 'Engagement',
    description: 'Moderasi ulasan customer.',
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    icon: Quote,
    group: 'Engagement',
    description: 'Kelola testimonial untuk ditampilkan.',
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: BarChart3,
    group: 'Wawasan',
    description: 'Laporan bisnis berdasarkan data aktual.',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'Sistem',
    description: 'Pengaturan aplikasi dan bisnis.',
  },
]

export const ORDER_STATUS_LABELS = {
  draft: 'Draft',
  waiting_dp: 'Menunggu DP',
  dp_received: 'DP Masuk',
  processing: 'Proses',
  paid: 'Lunas',
}

export const ORDER_STATUS_VARIANTS = {
  draft: 'neutral',
  waiting_dp: 'warning',
  dp_received: 'info',
  processing: 'primary',
  paid: 'success',
}

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS)

export const PRODUCTION_STATUS_LABELS = {
  design: 'Design',
  approval: 'Approval',
  production: 'Produksi',
  quality_control: 'Quality Check',
  packing: 'Packing',
  shipping: 'Shipping',
}

export const PRODUCTION_STATUS_VARIANTS = {
  design: 'neutral',
  approval: 'info',
  production: 'primary',
  quality_control: 'warning',
  packing: 'secondary',
  shipping: 'success',
}

export const PRODUCTION_STATUSES = Object.keys(PRODUCTION_STATUS_LABELS)

export const SHIPMENT_STATUS_LABELS = {
  pending: 'Pending',
  packed: 'Dikemas',
  shipped: 'Dikirim',
  in_transit: 'Dalam Perjalanan',
  delivered: 'Selesai',
  cancelled: 'Batal',
}

export const SHIPMENT_STATUS_VARIANTS = {
  pending: 'warning',
  packed: 'info',
  shipped: 'primary',
  in_transit: 'primary',
  delivered: 'success',
  cancelled: 'neutral',
}

export const SHIPMENT_STATUSES = Object.keys(SHIPMENT_STATUS_LABELS)

export const PUBLISHED_LABELS = {
  true: 'Terbit',
  false: 'Draft',
}

export const PUBLISHED_VARIANTS = {
  true: 'success',
  false: 'neutral',
}

export const FEATURED_LABELS = {
  true: 'Featured',
  false: 'Tidak',
}

export const FEATURED_VARIANTS = {
  true: 'primary',
  false: 'neutral',
}

export const PAYMENT_TYPE_LABELS = {
  dp: 'DP',
  final: 'Pelunasan',
  full: 'Lunas',
}

export const PAYMENT_TYPE_VARIANTS = {
  dp: 'info',
  final: 'success',
  full: 'success',
}

export const INVOICE_STATUS_LABELS = {
  draft: 'Draft',
  issued: 'Diterbitkan',
  paid: 'Lunas',
}

export const INVOICE_STATUS_VARIANTS = {
  draft: 'neutral',
  issued: 'info',
  paid: 'success',
}

export const INVOICE_STATUSES = Object.keys(INVOICE_STATUS_LABELS)

export const ACTIVE_LABELS = {
  active: 'Aktif',
  inactive: 'Nonaktif',
}

export const ACTIVE_VARIANTS = {
  active: 'success',
  inactive: 'neutral',
}

export const METRIC_META = {
  'Total Orders': { label: 'Total Pesanan', icon: ShoppingCart, tint: 'primary' },
  'Active Orders': { label: 'Pesanan Aktif', icon: ClipboardList, tint: 'info' },
  Revenue: { label: 'Pendapatan', icon: Banknote, tint: 'success' },
  Outstanding: { label: 'Piutang', icon: Hourglass, tint: 'warning' },
  Customers: { label: 'Pelanggan', icon: Users, tint: 'primary' },
  Products: { label: 'Produk', icon: Package, tint: 'purple' },
}

export const REPORT_TABS = [
  { key: 'sales', label: 'Penjualan', icon: ShoppingCart },
  { key: 'profit', label: 'Profit', icon: Banknote },
  { key: 'customers', label: 'Pelanggan', icon: Users },
  { key: 'products', label: 'Produk', icon: Package },
]

export const PAGE_SIZES = [10, 25, 50]

export const PERIOD_OPTIONS = [
  { value: 'this_month', label: 'Bulan Ini' },
  { value: 'last_month', label: 'Bulan Lalu' },
  { value: 'last_3_months', label: '3 Bulan Terakhir' },
  { value: 'this_year', label: 'Tahun Ini' },
  { value: 'all_time', label: 'Semua Waktu' },
]
