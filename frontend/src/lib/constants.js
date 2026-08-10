import {
  Banknote,
  ClipboardList,
  CreditCard,
  FileText,
  Hourglass,
  LayoutDashboard,
  Package,
  ShoppingCart,
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
    description: 'Kelola data pelanggan FRNDLY.',
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

export const PAGE_SIZES = [10, 25, 50]
