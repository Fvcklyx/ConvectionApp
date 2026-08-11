import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ArrowRight, Check, ChevronDown, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'motion/react'
import { api } from '../../api'
import { formatRp, listOf } from '../../lib/format'

const fallbackName = 'FRNDLY'
const motionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] }

const whatsappUrl = (phone, product) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return null
  const number = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  const text = product ? `Halo, saya tertarik dengan produk ${product}. Saya ingin konsultasi lebih lanjut.` : 'Halo, saya ingin konsultasi kebutuhan apparel custom.'
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function Logo({ profile }) {
  return profile.logo_url ? <img className="landing-logo-image" src={profile.logo_url} alt={profile.name} /> : <span className="landing-logo-mark">F</span>
}

function MagneticButton({ children, className = '', href }) {
  const x = useRef(0)
  const y = useRef(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  return <motion.a href={href} className={`${className} landing-magnetic-button`} animate={{ x: offset.x, y: offset.y }} transition={{ type: 'spring', stiffness: 280, damping: 18 }} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); x.current = (event.clientX - (rect.left + rect.width / 2)) * 0.12; y.current = (event.clientY - (rect.top + rect.height / 2)) * 0.12; setOffset({ x: x.current, y: y.current }) }} onPointerLeave={() => setOffset({ x: 0, y: 0 })} whileTap={{ scale: 0.96 }}>{children}</motion.a>
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-10% 0px' })
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 28 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={motionTransition}>{children}</motion.div>
}

function Garment({ pointer, active, dragRotation }) {
  const group = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
    if (!group.current) return
    target.current.x += (pointer.current.y * 0.28 - target.current.x) * Math.min(1, delta * 5)
    target.current.y += (pointer.current.x * 0.42 + (active ? 0.65 : 0) + dragRotation.current) * delta * 2
    dragRotation.current *= Math.pow(0.04, delta)
    group.current.rotation.x = target.current.x + Math.sin(state.clock.elapsedTime * 0.7) * 0.04
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * Math.min(1, delta * 4)
  })
  return <group ref={group} position={[0, 0, 0]}>
    <mesh castShadow scale={[1.25, 1.45, 0.38]}><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#2563eb" roughness={0.32} metalness={0.08} /></mesh>
    <mesh position={[-1.25, 0.35, 0]} rotation={[0, 0, -0.25]} castShadow><capsuleGeometry args={[0.34, 1.25, 8, 16]} /><meshStandardMaterial color="#1d4ed8" roughness={0.35} /></mesh>
    <mesh position={[1.25, 0.35, 0]} rotation={[0, 0, 0.25]} castShadow><capsuleGeometry args={[0.34, 1.25, 8, 16]} /><meshStandardMaterial color="#1d4ed8" roughness={0.35} /></mesh>
    <mesh position={[0, 1.1, 0.36]}><torusGeometry args={[0.35, 0.08, 12, 32]} /><meshStandardMaterial color="#bfdbfe" roughness={0.25} /></mesh>
  </group>
}

function ProductScene({ progress }) {
  const pointer = useRef({ x: 0, y: 0 })
  const dragRotation = useRef(0)
  const lastPointer = useRef(null)
  const [active, setActive] = useState(false)
  const [lowPower, setLowPower] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const limited = window.matchMedia('(max-width: 800px), (update: slow)')
    const update = () => setLowPower(reduced.matches || limited.matches)
    update()
    reduced.addEventListener?.('change', update)
    limited.addEventListener?.('change', update)
    return () => { reduced.removeEventListener?.('change', update); limited.removeEventListener?.('change', update) }
  }, [])
  const rotation = useTransform(progress, [0, 1], [-0.25, 1.8])
  const y = useTransform(progress, [0, 1], [0, -0.8])
  const scale = useTransform(progress, [0, 0.6, 1], [1, 0.86, 0.72])
  const [values, setValues] = useState({ rotation: -0.25, y: 0, scale: 1 })
  useEffect(() => {
    return [rotation, y, scale].map((value, index) => value.on('change', (next) => setValues((current) => ({ ...current, [index === 0 ? 'rotation' : index === 1 ? 'y' : 'scale']: next })))).reduce((dispose, current) => () => { dispose(); current() })
  }, [rotation, y, scale])
  return <div className={`landing-scene${active ? ' is-active' : ''}`} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); pointer.current = { x: (event.clientX - rect.left) / rect.width * 2 - 1, y: (event.clientY - rect.top) / rect.height * 2 - 1 }; if (lastPointer.current) dragRotation.current += (event.clientX - lastPointer.current.x) * 0.012; lastPointer.current = { x: event.clientX, y: event.clientY } }} onPointerEnter={() => setActive(true)} onPointerLeave={() => { setActive(false); pointer.current = { x: 0, y: 0 }; lastPointer.current = null }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setActive(true); lastPointer.current = { x: event.clientX, y: event.clientY } }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setActive(false); lastPointer.current = null }}><Canvas shadows={!lowPower} dpr={lowPower ? [0.75, 1] : [1, 1.5]} camera={{ position: [0, 0.2, 5.2], fov: 38 }}><ambientLight intensity={1.5} /><directionalLight position={[3, 4, 5]} intensity={3} castShadow /><pointLight position={[-3, 1, 2]} color="#93c5fd" intensity={5} /><group rotation={[0, values.rotation, 0]} position={[0, values.y, 0]} scale={values.scale}><Garment pointer={pointer} active={active} dragRotation={dragRotation} /></group></Canvas><span className="landing-scene-badge">{active ? 'DRAG / EXPLORE' : '3D / CUSTOM'}</span></div>
}

export default function LandingPage() {
  const [profile, setProfile] = useState({ name: fallbackName, logo_url: null, phone: null, email: null, address: null })
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [openFaq, setOpenFaq] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })
  const headerY = useTransform(progress, [0, 0.08], [0, -10])

  useEffect(() => {
    api.get('/company/profile').then(({ data }) => {
      const payload = data.data || {}
      setProfile((current) => ({ ...current, ...payload }))
      setProducts(listOf(payload.products))
      setReviews(listOf(payload.reviews))
      setTestimonials(listOf(payload.testimonials))
    }).catch(() => {}).finally(() => { setLoading(false); setReady(true) })
  }, [])

  const rating = useMemo(() => reviews.length ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1) : null, [reviews])
  const chatUrl = whatsappUrl(profile.phone)
  const faqs = [['Apa saja produk yang tersedia?', 'Kami membantu kebutuhan apparel dan atribut custom sesuai produk yang tersedia di katalog.'], ['Apakah bisa custom desain?', 'Bisa. Konsultasikan kebutuhan desain dan detail pesanan bersama tim kami terlebih dahulu.'], ['Bagaimana proses pemesanan?', 'Mulai dari konsultasi, pilih produk, konfirmasi desain, produksi, hingga pesanan selesai.'], ['Bagaimana cara menghubungi admin?', 'Gunakan tombol WhatsApp atau hubungi kontak yang tersedia pada bagian bawah halaman.']]
  const steps = ['Konsultasi', 'Pilih Produk', 'Konfirmasi Desain', 'Produksi', 'Selesai']

  return <div className={`landing-page${ready ? ' is-ready' : ''}`}>
    {!ready && <motion.div className="landing-loader" initial={{ opacity: 1 }} animate={{ opacity: 1 }} aria-label="Memuat FRNDLY"><div className="landing-loader-mark">F</div><div className="landing-loader-line"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45 }} /></div><small>MENYIAPKAN PENGALAMAN</small></motion.div>}
    <motion.header className="landing-header" style={{ y: headerY }}><a href="#top" className="landing-brand"><Logo profile={profile} /><span>{profile.name}</span></a><nav><a href="#products">Produk</a><a href="#process">Proses</a><a href="#about">Tentang Kami</a></nav><div className="landing-header-actions">{chatUrl && <a className="landing-icon-link" href={chatUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a>}<a className="landing-outline-button" href="/login">Masuk</a><MagneticButton className="landing-button small" href="/login">Mulai Pesanan <ArrowRight size={15} /></MagneticButton></div></motion.header>
     <main id="top">
       <motion.div className="landing-parallax-orb orb-left" style={{ y: useTransform(progress, [0, 1], [0, -260]), rotate: useTransform(progress, [0, 1], [0, 80]) }} aria-hidden="true" />
       <motion.div className="landing-parallax-orb orb-right" style={{ y: useTransform(progress, [0, 1], [0, 180]), rotate: useTransform(progress, [0, 1], [0, -55]) }} aria-hidden="true" />
      <section className="landing-hero"><div className="landing-hero-grid"><Reveal><p className="landing-kicker">APPAREL CUSTOM, MADE WITH INTENTION</p><h1>Buat sesuatu yang <em>berarti.</em></h1><p className="landing-hero-copy">Wujudkan apparel custom yang merepresentasikan cerita, komunitas, dan momen penting kamu.</p><div className="landing-hero-actions"><MagneticButton className="landing-button" href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={17} /></MagneticButton>{chatUrl && <a className="landing-text-link" href={chatUrl} target="_blank" rel="noreferrer">Konsultasi via WhatsApp <MessageCircle size={17} /></a>}</div><div className="landing-hero-note"><span><Check size={14} /> Konsultasi fleksibel</span><span><Check size={14} /> Dibuat sesuai kebutuhan</span></div></Reveal><ProductScene progress={progress} /></div><div className="landing-scroll-hint">SCROLL TO EXPLORE <span>↓</span></div></section>
      <Reveal><section className="landing-trust"><p className="landing-kicker">DIPERCAYA UNTUK BERKARYA</p><div className="landing-metrics">{rating && <div><strong>{rating}</strong><span>Rata-rata rating</span></div>}{reviews.length > 0 && <div><strong>{reviews.length}+</strong><span>Ulasan pelanggan</span></div>}{products.length > 0 && <div><strong>{products.length}+</strong><span>Pilihan produk</span></div>}<div><strong>∞</strong><span>Ide yang bisa dibuat</span></div></div></section></Reveal>
      <section id="products" className="landing-light-section"><Reveal><div className="landing-section-heading"><div><p className="landing-kicker">PILIHAN UNTUK CERITAMU</p><h2>Produk yang siap<br /><em>jadi milikmu.</em></h2></div><p>Kami percaya setiap kebutuhan punya karakter. Temukan titik awalnya di sini.</p></div></Reveal><div className="landing-product-grid">{loading ? <div className="landing-empty">Memuat katalog...</div> : products.length ? products.map((product, index) => <motion.article whileHover={{ y: -8 }} className="landing-product-card" key={product.id || index}><div className="landing-product-visual"><span>0{index + 1}</span></div><p className="landing-card-category">{product.category || 'APPAREL CUSTOM'}</p><h3>{product.name}</h3>{product.price ? <p className="landing-price">Mulai dari {formatRp(product.price)}</p> : <p className="landing-price">Konsultasikan harga</p>}{chatUrl && <a href={whatsappUrl(profile.phone, product.name)} target="_blank" rel="noreferrer">Konsultasi <ArrowRight size={15} /></a>}</motion.article>) : <div className="landing-empty">Produk sedang dipersiapkan.</div>}</div></section>
      <section className="landing-dark-section"><Reveal><div className="landing-section-heading"><div><p className="landing-kicker">LEBIH DARI SEKADAR PAKAIAN</p><h2>Kenapa memilih<br /><em>{profile.name}?</em></h2></div><p>Proses yang dimulai dari mendengarkan. Karena hasil terbaik lahir dari kolaborasi.</p></div></Reveal><div className="landing-benefits">{['Custom Design', 'Flexible Production', 'Quality Focus', 'Responsive Consultation'].map((item, index) => <motion.div whileHover={{ x: 8 }} key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Ruang untuk mewujudkan kebutuhanmu dengan cara yang lebih personal.</p></motion.div>)}</div></section>
      <section id="process" className="landing-light-section process-section"><Reveal><p className="landing-kicker">DARI IDE MENJADI NYATA</p><h2>Semudah <em>itu.</em></h2></Reveal><div className="landing-process">{steps.map((item, index) => <motion.div whileHover={{ scale: 1.04 }} key={item}><span>0{index + 1}</span><h3>{item}</h3>{index < 4 && <ArrowRight size={18} />}</motion.div>)}</div></section>
      <section className="landing-dark-section landing-reviews"><Reveal><p className="landing-kicker">CERITA DARI MEREKA</p><h2>Yang mereka <em>katakan.</em></h2></Reveal><div className="landing-review-grid">{reviews.length ? reviews.filter((item) => item.is_published !== false).slice(0, 3).map((review, index) => <motion.article whileHover={{ y: -6 }} key={review.id || index}><div className="stars">{'★'.repeat(Math.min(5, Math.max(0, Math.round(Number(review.rating || 0) / 2))))}</div><p>“{review.review_text}”</p><span>{review.customer_name || 'Customer FRNDLY'}</span></motion.article>) : <p className="landing-empty">Belum ada ulasan yang dapat ditampilkan.</p>}{testimonials.filter((item) => item.is_published).slice(0, 1).map((item) => <motion.article whileHover={{ y: -6 }} key={item.id}><div className="stars">★★★★★</div><p>“{item.content || item.testimonial_text}”</p><span>Testimonial pelanggan</span></motion.article>)}</div></section>
      <section id="about" className="landing-about"><Reveal><p className="landing-kicker">TENTANG KAMI</p><h2>{profile.name}, dibuat untuk<br /><em>cerita kamu.</em></h2></Reveal><Reveal><p>{profile.name} merupakan usaha konveksi yang melayani kebutuhan apparel dan atribut custom untuk berbagai kebutuhan, mulai dari event, komunitas, organisasi, perusahaan, hingga kebutuhan personal.</p><div className="landing-contact-list">{profile.address && <span><MapPin size={17} /> {profile.address}</span>}{profile.phone && <span><Phone size={17} /> {profile.phone}</span>}{profile.email && <span><Mail size={17} /> {profile.email}</span>}</div></Reveal></section>
      <section className="landing-faq"><Reveal><p className="landing-kicker">PERTANYAAN UMUM</p><h2>Punya pertanyaan?</h2></Reveal>{faqs.map(([question, answer], index) => <div className="landing-faq-row" key={question}><button aria-expanded={openFaq === index} aria-controls={`faq-panel-${index}`} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>{question}<ChevronDown className={openFaq === index ? 'rotated' : ''} size={19} /></button>{openFaq === index && <p id={`faq-panel-${index}`}>{answer}</p>}</div>)}</section>
      <section className="landing-final-cta"><Reveal><p className="landing-kicker">MARI MULAI</p><h2>Siap membuat sesuatu<br /><em>yang berarti?</em></h2><p>Konsultasikan kebutuhanmu bersama kami dan mulai buat pesanan sesuai kebutuhan.</p><MagneticButton className="landing-button light" href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={17} /></MagneticButton>{chatUrl && <a className="landing-text-link light-link" href={chatUrl} target="_blank" rel="noreferrer">atau konsultasi via WhatsApp</a>}</Reveal></section>
    </main>
    <footer className="landing-footer"><a href="#top" className="landing-brand"><Logo profile={profile} /><span>{profile.name}</span></a><p>Apparel custom untuk cerita yang berarti.</p><div>{profile.email && <a href={`mailto:${profile.email}`}><Mail size={15} /></a>}{chatUrl && <a href={chatUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /></a>}<a href="#top"><Globe size={15} /></a></div><small>© {new Date().getFullYear()} {profile.name}. All rights reserved.</small></footer>
  </div>
}
