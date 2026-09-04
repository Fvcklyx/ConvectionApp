import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, BadgeCheck, Check, ChevronDown, Layers, Mail, MapPin, Menu, MessageCircle, Scissors, Search, Shirt, Sparkles, X } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { api } from '../../api'
import { formatRp, listOf } from '../../lib/format'
import ThemeToggle from '../ThemeToggle'
import ProductArtwork from '../ProductArtwork'
import AppLoading from '../AppLoading'
import { cachedBusinessName, rememberBusinessName } from '../../lib/branding'

const benefits = [
  [Scissors, 'Custom sesuai ceritamu', 'Sesuaikan desain, warna, dan detail untuk identitas brand atau komunitasmu.'],
  [Layers, 'Pilihan untuk setiap kebutuhan', 'Dari apparel hingga atribut acara, mulai dari produk yang sesuai kebutuhan.'],
  [MessageCircle, 'Konsultasi lebih mudah', 'Diskusikan spesifikasi dan biaya dengan admin sebelum pesanan dikonfirmasi.'],
]
const faqs = [
  ['Bagaimana cara memesan?', 'Pilih produk, lalu hubungi admin melalui kontak bisnis untuk membahas desain, jumlah, harga, dan jadwal.'],
  ['Apakah bisa menggunakan desain sendiri?', 'Bisa. Sampaikan referensi desain dan kebutuhan bahan kepada admin untuk diperiksa sebelum produksi.'],
  ['Bagaimana pembayaran dan pengiriman?', 'Nominal DP, pelunasan, dan pengiriman dikonfirmasi bersama admin. Tidak ada pembayaran online di halaman ini.'],
]

function GarmentArt({ compact = false }) {
  return <svg viewBox="0 0 420 410" className={compact ? 'garment-art compact' : 'garment-art'} role="img" aria-label="Ilustrasi kaos custom, bukan foto produk">
    <ellipse cx="215" cy="363" rx="134" ry="18" fill="currentColor" opacity=".08" />
    <path d="M140 62 80 90 28 177 97 216 125 171 112 343Q212 369 311 343L299 171 327 216 395 177 344 90 282 62 251 82 170 82Z" fill="var(--color-primary)" />
    <path d="M140 62Q207 151 282 62L251 56Q212 100 170 56Z" fill="var(--color-primary-active)" />
    <path d="M170 56Q212 100 251 56" fill="none" stroke="var(--surface)" strokeWidth="7" />
    <path d="M125 171 137 117M299 171 286 117M114 327Q210 350 309 327" fill="none" stroke="var(--color-primary-foreground)" opacity=".35" strokeWidth="2" strokeDasharray="5 5" />
    <rect x="167" y="166" width="92" height="95" rx="18" fill="var(--surface)" />
    <path d="M190 236V189H235M190 211H225" fill="none" stroke="var(--color-primary)" strokeWidth="12" />
    <path d="M292 233 295 330M131 251 128 332" stroke="var(--color-primary-active)" opacity=".25" strokeWidth="8" />
  </svg>
}

export default function StorefrontPage({ user }) {
  const [profile, setProfile] = useState(() => ({ name: cachedBusinessName() }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [category, setCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const hero = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 45])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError('')
    api.get('/company/profile', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) {
        setProfile(data.data || { name: 'FRNDLY' })
        rememberBusinessName(data.data?.name)
      }
    }).catch(() => { if (!controller.signal.aborted) setError('Katalog belum dapat dimuat. Silakan coba lagi.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  const products = listOf(profile.products)
  const categories = ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = useMemo(() => listOf(profile.products).filter(p => (category === 'Semua' || p.category === category) && String(p.name).toLocaleLowerCase().includes(search.toLocaleLowerCase())), [profile.products, category, search])
  const digits = String(profile.phone || '').replace(/\D/g, '')
  const phone = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  const chat = name => phone ? `https://wa.me/${phone}?text=${encodeURIComponent(name ? `Halo, saya ingin konsultasi produk ${name}.` : 'Halo, saya ingin konsultasi pesanan custom.')}` : null
  const accountUrl = user ? '/app' : '/login'
  const name = typeof profile.name === 'string' ? profile.name : 'FRNDLY'
  return <>
    {(loading || error) && <AppLoading brandName={name} message="Memuat profil bisnis dan katalog" error={error} onRetry={() => setAttempt(n => n + 1)} />}
    <div className="storefront" inert={loading || Boolean(error)} aria-hidden={loading || Boolean(error) ? true : undefined}>
    <a className="store-skip" href="#store-main">Lewati ke konten</a>
    <div className="store-nav-shell"><header className="store-nav store-container">
      <a className="store-brand" href="/">{profile.logo_url ? <img src={profile.logo_url} alt="" width="38" height="38" /> : <span className="store-brand-mark">F</span>}<span>{name}<small>CUSTOM APPAREL</small></span></a>
      <nav id="store-navigation" className={menuOpen ? 'store-links open' : 'store-links'} aria-label="Navigasi utama">
        {[['#store-main', 'Beranda'], ['#keunggulan', 'Keunggulan'], ['#katalog', 'Produk'], ['#tentang', 'Tentang']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="store-actions"><ThemeToggle /><a className="store-button primary" href={accountUrl}>{user ? 'Buka aplikasi' : 'Masuk'}<ArrowRight size={16} /></a><button className="theme-toggle store-menu" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} aria-controls="store-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </header></div>
    <main id="store-main">
      <section ref={hero} className="store-hero store-container">
        <div className="store-hero-copy"><p className="store-eyebrow"><span /> DIBUAT UNTUK IDENTITASMU</p><h1>Ide kamu.<br />Gaya kamu.<br /><span>Kami wujudkan.</span></h1><p className="store-lead">Apparel dan atribut custom untuk brand, komunitas, dan momen yang berarti. Mulai dari pilihan yang paling kamu suka.</p><div className="store-hero-actions"><a className="store-button primary" href="#katalog">Jelajahi produk <ArrowRight size={19} /></a>{chat() && <a className="store-button" href={chat()} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> Konsultasi</a>}</div><div className="store-small-points"><span><Check size={16} /> Desain personal</span><span><Check size={16} /> Konsultasi kebutuhan</span></div></div>
        <motion.div className="store-hero-art" style={{ y: reduced ? 0 : parallax }}><div className="store-art-circle" /><div className="store-art-label">YOUR NEXT<br /><strong>FAVORITE.</strong></div><GarmentArt /><div className="store-floating-tag"><span><Sparkles size={22} /></span><div><b>Custom, made for you.</b><small>Detail kecil. Identitas besar.</small></div></div><span className="store-art-note">ILUSTRASI APPAREL CUSTOM / 01</span></motion.div>
      </section>
      <div className="store-container store-divider"><span>APPAREL · AKSESORIS · ATRIBUT EVENT</span><a href="#keunggulan">Kenali prosesnya <ArrowDown size={16} /></a></div>
      <section id="keunggulan" className="store-container store-section"><div className="store-section-heading"><div><p className="store-eyebrow">LEBIH DARI SEKADAR PRODUK</p><h2>Dibuat dengan kebutuhanmu<br />sebagai titik awal.</h2></div><p>Detail yang kamu pilih membuat setiap hasil terasa lebih personal.</p></div><div className="store-benefits">{benefits.map(([Icon, title, body]) => <article key={title}><span className="store-icon"><Icon size={25} /></span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
      <section id="katalog" className="store-catalog"><div className="store-container store-section"><div className="store-section-heading"><div><p className="store-eyebrow">PILIHAN UNTUK CERITAMU</p><h2>Temukan produkmu.</h2></div><label className="store-search"><Search size={18} /><input aria-label="Cari produk" placeholder="Cari produk custom..." value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="store-categories" aria-label="Kategori produk">{categories.map(c => <button type="button" key={c} aria-pressed={category === c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
        {error ? <div className="store-empty" role="alert"><p>{error}</p><button className="store-button" onClick={() => setAttempt(n => n + 1)}>Coba lagi</button></div> : loading ? <div className="store-empty" role="status">Menyiapkan katalog produk...</div> : <><p className="store-results" role="status">{filtered.length} produk tersedia</p><div className="store-products">{filtered.map((p, index) => <article className="store-product" key={p.id}><div className={`store-product-art tone-${index % 3}`}><span className="store-product-category">{p.category || 'Custom'}</span><ProductArtwork product={p} /></div><div className="store-product-info"><h3>{p.name}</h3><p>{Number(p.price) > 0 ? formatRp(p.price) : 'Konsultasikan harga'} <small>/ estimasi awal</small></p><a href={chat(p.name) || '#kontak'} target={chat(p.name) ? '_blank' : undefined} rel="noopener noreferrer">Konsultasi produk <ArrowRight size={17} /></a></div></article>)}</div>{!filtered.length && <div className="store-empty"><Shirt size={32} /><h3>Belum ada produk yang sesuai</h3><p>Coba nama atau kategori lainnya.</p><button className="store-button" onClick={() => { setSearch(''); setCategory('Semua') }}>Reset pencarian</button></div>}</>}
      </div></section>
      <section id="tentang" className="store-container store-section"><div className="store-process"><div><p className="store-eyebrow">DARI IDE MENJADI NYATA</p><h2>Langkah sederhana.<br />Hasil yang personal.</h2><p>Sampaikan kebutuhanmu. Kami bantu menjelaskan pilihan dan prosesnya sebelum kamu melangkah lebih jauh.</p><a className="store-button primary" href={chat() || '#kontak'} target={chat() ? '_blank' : undefined} rel="noopener noreferrer">Diskusikan idemu <ArrowRight size={18} /></a></div><ol>{[['Ceritakan kebutuhan', 'Tentukan produk, jumlah, dan inspirasi desain.'], ['Konfirmasi detail', 'Sepakati spesifikasi, biaya, serta jadwal bersama admin.'], ['Produksi & pengiriman', 'Admin menginformasikan perkembangan pesanan yang sudah dikonfirmasi.']].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div></section>
      {listOf(profile.testimonials).length > 0 && <section className="store-container store-section store-quotes"><p className="store-eyebrow">CERITA PELANGGAN</p><h2>Setiap hasil punya cerita.</h2>{listOf(profile.testimonials).slice(0, 3).map(t => <blockquote key={t.id}><BadgeCheck size={23} /><p>“{t.quote}”</p><small>Testimonial yang dipublikasikan</small></blockquote>)}</section>}
      <section className="store-container store-section store-faq"><div><p className="store-eyebrow">SEBELUM MEMULAI</p><h2>Ada yang ingin<br />kamu tanyakan?</h2></div><div>{faqs.map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={18} /></summary><p>{a}</p></details>)}</div></section>
      <section id="kontak" className="store-container store-contact"><div><p className="store-eyebrow">MULAI CERITA BARUMU</p><h2>Siap bikin sesuatu<br />yang lebih kamu?</h2><a className="store-button primary" href={accountUrl}>{user ? 'Buka aplikasi' : 'Masuk / Daftar'}<ArrowRight size={18} /></a></div><address>{profile.address && <p><MapPin size={20} />{profile.address}</p>}{profile.phone && <p><MessageCircle size={20} /><a href={chat()} target="_blank" rel="noopener noreferrer">{profile.phone}</a></p>}{profile.email && <p><Mail size={20} /><span>{profile.email}</span></p>}{!profile.address && !profile.phone && !profile.email && <p>Kontak bisnis sedang dipersiapkan.</p>}</address></section>
    </main><footer className="store-container store-footer"><strong>{name}</strong><span>Apparel custom untuk cerita yang berarti.</span><small className="store-copyright">Copyright © {new Date().getFullYear()} {name}. All Rights Reserved.</small></footer>
  </div></>
}
