import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { api } from '../../api'
import { formatRp, listOf } from '../../lib/format'

const whatsappUrl = (phone, product) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return null
  const number = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  const text = product ? `Halo, saya tertarik dengan produk ${product}. Saya ingin konsultasi lebih lanjut.` : 'Halo, saya ingin konsultasi kebutuhan apparel custom.'
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function Logo({ profile }) {
  const [failed, setFailed] = useState(false)
  return profile.logo_url && !failed ? <img className="cin-logo-image" src={profile.logo_url} alt={profile.name} loading="eager" decoding="async" onError={() => setFailed(true)} /> : <span className="cin-logo-mark" aria-hidden="true">F</span>
}

function PointerCursor() {
  const ref = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const position = useRef({ x: -100, y: -100 })
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(fine.matches && !reduced.matches)
    update()
    fine.addEventListener?.('change', update)
    reduced.addEventListener?.('change', update)
    return () => { fine.removeEventListener?.('change', update); reduced.removeEventListener?.('change', update) }
  }, [])
  useEffect(() => {
    if (!enabled) return undefined
    const move = (event) => { target.current = { x: event.clientX, y: event.clientY }; if (ref.current) ref.current.dataset.state = event.target.closest('a,button,[role="button"]') ? 'INTERACTIVE' : 'DEFAULT' }
    window.addEventListener('pointermove', move, { passive: true })
    let frame
    const animate = () => { position.current.x += (target.current.x - position.current.x) * 0.18; position.current.y += (target.current.y - position.current.y) * 0.18; if (ref.current) ref.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`; frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame) }
  }, [enabled])
  return enabled ? <span ref={ref} className="cin-cursor" data-state="DEFAULT" aria-hidden="true" /> : null
}

function MagneticButton({ children, className = '', href }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  return <motion.a aria-label={typeof children === 'string' ? children : undefined} href={href} className={`cin-button ${className}`} animate={offset} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setOffset({ x: (event.clientX - rect.left - rect.width / 2) * 0.1, y: (event.clientY - rect.top - rect.height / 2) * 0.1 }) }} onPointerLeave={() => setOffset({ x: 0, y: 0 })} whileTap={{ scale: 0.95 }}>{children}</motion.a>
}

const CinematicWorld = lazy(() => import('../landing/CinematicWorld'))

function CinematicLoader({ ready }) {
  const [gone, setGone] = useState(false)
  useEffect(() => { if (ready) { const t = window.setTimeout(() => setGone(true), 900); return () => window.clearTimeout(t) } }, [ready])
  return (
    <AnimatePresence>
      {!gone && <motion.div className="cin-loader" exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} aria-hidden={gone}>
        <div className="cin-loader-inner">
          <span className="cin-loader-mark">F</span>
          <div className="cin-loader-line"><motion.span initial={{ width: '0%' }} animate={{ width: ready ? '100%' : '72%' }} transition={{ duration: ready ? 0.8 : 1.6, ease: 'easeInOut' }} /></div>
          <p>{ready ? 'Showroom siap dijelajahi' : 'Menyiapkan ruang produksi'}</p>
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}

function Scene({ num, kicker, title, body, align = 'left', accent = '', children, id }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -90])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const clip = useTransform(scrollYProgress, [0.08, 0.35], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])
  return (
    <section id={id} ref={ref} className={`cin-scene ${accent}`}>
      <div className="cin-sticky">
        <motion.div className={`cin-copy ${align}`} style={{ y: reduced ? 0 : y, opacity: reduced ? 1 : opacity }}>
          <p className="cin-kicker">{num} — {kicker}</p>
          <motion.h2 style={{ clipPath: reduced ? undefined : clip }}>{title}</motion.h2>
          {body && <p className="cin-body">{body}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  )
}

function SceneHero({ chatUrl, ready, reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const enter = { opacity: ready ? 1 : 0, y: ready ? 0 : 40 }
  return (
    <section ref={ref} id="top" className="cin-scene cin-hero">
      <div className="cin-sticky">
        <motion.div className="cin-hero-inner" style={{ y: reduced ? 0 : titleY, opacity: reduced ? 1 : titleOpacity }}>
          <motion.p className="cin-kicker" initial={enter} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.8 }}>APPAREL CUSTOM / MADE WITH INTENTION</motion.p>
          <motion.h1 initial={enter} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>Wear the story.<br /><em>Make it yours.</em></motion.h1>
          <motion.p className="cin-lede" initial={enter} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45, duration: 0.9 }}>Apparel custom yang membawa ide, komunitas, dan momen penting menjadi sesuatu yang bisa dikenakan.</motion.p>
          <motion.div className="cin-actions" initial={enter} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.9 }}>
            <MagneticButton href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={16} /></MagneticButton>
            {chatUrl && <a className="cin-quiet" href={chatUrl} target="_blank" rel="noreferrer">Konsultasi via WhatsApp <MessageCircle size={15} /></a>}
          </motion.div>
        </motion.div>
        <a className="cin-scroll-hint" href="#fabric">Scroll to explore <ArrowDown size={14} /></a>
      </div>
    </section>
  )
}

function ReviewsMarquee({ reviews }) {
  const items = reviews.filter((item) => item.is_published !== false)
  if (!items.length) return null
  const doubled = [...items, ...items]
  return (
    <div className="cin-marquee" aria-label="Ulasan pelanggan">
      <div className="cin-marquee-track">
        {doubled.map((review, i) => (
          <div className="cin-marquee-item" key={`${review.id || 'r'}-${i}`}>
            <span className="stars">{'★'.repeat(Math.min(5, Math.max(0, Math.round(Number(review.rating || 0) / 2))))}</span>
            <p>“{review.review_text}”</p>
            <b>{review.customer_name || 'Customer FRNDLY'}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, index, phone }) {
  const image = product.image_url || product.image || product.imageUrl || product.photo_url
  return (
    <motion.article className="cin-product" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 44 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ delay: (index % 3) * 0.08, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
      <div className="cin-product-media">{image ? <img src={image} alt={product.name} loading="lazy" decoding="async" /> : <span className="cin-product-mark">{String(product.category || 'FRNDLY').slice(0, 2).toUpperCase()}</span>}<span className="cin-product-num">0{index + 1}</span></div>
      <p>{product.category || 'APPAREL CUSTOM'}</p>
      <h3>{product.name}</h3>
      <b>{product.price ? `Mulai dari ${formatRp(product.price)}` : 'Konsultasikan harga'}</b>
      {phone && <a href={whatsappUrl(phone, product.name)} target="_blank" rel="noreferrer">Eksplor produk <ArrowRight size={14} /></a>}
    </motion.article>
  )
}

function SceneProducts({ products, loading, phone }) {
  return (
    <section id="products" className="cin-scene cin-products">
      <div className="cin-sticky cin-products-sticky">
        <div className="cin-copy left">
          <p className="cin-kicker">08 — PRODUK</p>
          <motion.h2 initial={{ clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, margin: '-15% 0px' }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>Mulai dari<br /><em>sebuah bentuk.</em></motion.h2>
          <p className="cin-body">Temukan produk yang paling dekat dengan kebutuhanmu, lalu kembangkan bersama kami.</p>
        </div>
        <div className="cin-product-grid">
          {loading ? <div className="cin-empty">Menyiapkan katalog...</div> : products.length ? products.slice(0, 6).map((product, index) => <ProductCard key={product.id || index} product={product} index={index} phone={phone} />) : <div className="cin-empty">Produk sedang dipersiapkan.</div>}
        </div>
      </div>
    </section>
  )
}

function FinalScene({ profile, chatUrl, testimonials, openFaq, setOpenFaq }) {
  const faqs = [['Apa saja produk yang tersedia?', 'Kami membantu kebutuhan apparel dan atribut custom sesuai produk yang tersedia di katalog.'], ['Apakah bisa custom desain?', 'Bisa. Konsultasikan kebutuhan desain dan detail pesanan bersama tim kami terlebih dahulu.'], ['Bagaimana proses pemesanan?', 'Mulai dari konsultasi, pilih produk, konfirmasi desain, produksi, hingga pesanan selesai.'], ['Bagaimana cara menghubungi admin?', 'Gunakan tombol WhatsApp atau kontak yang tersedia di halaman ini.']]
  const quote = testimonials.filter((item) => item.is_published).slice(0, 1)[0]
  return (
    <section id="about" className="cin-scene cin-final">
      <div className="cin-sticky">
        <div className="cin-final-inner">
          <p className="cin-kicker">10 — MULAI DI SINI</p>
          <h2>Everything we make<br /><em>starts with your idea.</em></h2>
          <p className="cin-body">Mulai percakapan untuk mewujudkan kebutuhan apparel custom kamu.</p>
          <div className="cin-actions center">
            <MagneticButton className="light" href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={16} /></MagneticButton>
            {chatUrl && <a className="cin-quiet light-link" href={chatUrl} target="_blank" rel="noreferrer">atau konsultasi via WhatsApp</a>}
          </div>
          {quote && <div className="cin-final-quote"><span className="stars">★★★★★</span><p>“{quote.quote}”</p></div>}
          <div className="cin-faq" role="region" aria-label="Pertanyaan yang sering diajukan">
            {faqs.map(([question, answer], index) => (
              <div className="cin-faq-row" key={question}>
                <button aria-expanded={openFaq === index} aria-controls={`cinfaq-${index}`} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>{question}<ChevronDown size={17} /></button>
                {openFaq === index && <p id={`cinfaq-${index}`}>{answer}</p>}
              </div>
            ))}
          </div>
          <div className="cin-contact">
            {profile.address && <span><MapPin size={15} />{profile.address}</span>}
            {profile.phone && <span><Phone size={15} />{profile.phone}</span>}
            {profile.email && <span><Mail size={15} />{profile.email}</span>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [profile, setProfile] = useState({ name: 'FRNDLY', logo_url: null, phone: null, email: null, address: null })
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)
  const [scene, setScene] = useState(0)
  const [worldReady, setWorldReady] = useState(false)
  const [worldFallback, setWorldFallback] = useState(false)
  const reduced = useReducedMotion()
  const progressRef = useRef({ v: 0 })
  const pointer = useRef({ x: 0, y: 0 })
  const spin = useRef(0)
  const lastX = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })
  useMotionValueEvent(progress, 'change', (v) => { progressRef.current.v = v })
  const fgX = useTransform(progress, [0, 1], ['-8%', '10%'])
  const fgX2 = useTransform(progress, [0, 1], ['6%', '-12%'])

  useEffect(() => {
    const controller = new AbortController()
    api.get('/company/profile', { signal: controller.signal }).then(({ data }) => {
      const payload = data.data || {}
      setProfile((current) => ({ ...current, ...payload }))
      setProducts(listOf(payload.products))
      setReviews(listOf(payload.reviews))
      setTestimonials(listOf(payload.testimonials))
    }).catch(() => {}).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const featuredImageUrls = useMemo(() => products.slice(0, 6).map((product) => product.image_url || product.image || product.imageUrl || product.photo_url).filter(Boolean), [products])
  const [imagesReady, setImagesReady] = useState(true)
  useEffect(() => {
    if (!featuredImageUrls.length) { setImagesReady(true); return undefined }
    let settled = 0
    setImagesReady(false)
    const finish = () => { settled += 1; if (settled === featuredImageUrls.length) setImagesReady(true) }
    const images = featuredImageUrls.map((url) => { const image = new Image(); image.onload = finish; image.onerror = finish; image.src = url; return image })
    return () => images.forEach((image) => { image.onload = null; image.onerror = null })
  }, [featuredImageUrls])

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !window.WebGLRenderingContext) return undefined
    const sections = [...document.querySelectorAll('.cin-scene')]
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setScene(sections.indexOf(current))
    }, { threshold: [0.3, 0.6] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (worldFallback) setWorldReady(true)
  }, [worldFallback])

  const chatUrl = whatsappUrl(profile.phone)
  const ready = !reduced && !loading && worldReady && imagesReady

  const handlePointerDown = (event) => { lastX.current = event.clientX; spin.current = 0 }
  const handlePointerMove = (event) => {
    pointer.current = { x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 }
    if (lastX.current !== null) { spin.current += (event.clientX - lastX.current) * 0.006; lastX.current = event.clientX }
  }
  const handlePointerUp = () => { lastX.current = null }

  return (
    <div className={`landing-page cinematic scene-${scene}`}>
      <CinematicLoader ready={reduced || ready} />
      <PointerCursor />
      <div className="cin-world" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} aria-label="Ruang 3D sinematik FRNDLY">
        {(!('WebGLRenderingContext' in window) && !worldFallback) ? <div className="cin-world-fallback" aria-hidden="true"><span>F</span></div> : <Suspense fallback={<div className="cin-world-fallback" aria-hidden="true"><span>F</span></div>}><CinematicWorld progressRef={progressRef} pointer={pointer} spin={spin} reduced={reduced} onReady={() => setWorldReady(true)} onError={() => setWorldFallback(true)} fallback={<div className="cin-world-fallback" aria-hidden="true"><span>F</span></div>} /></Suspense>}
      </div>
      <div className="cin-fg" aria-hidden="true">
        <motion.span className="fg-word" style={{ x: fgX }}>THREAD</motion.span>
        <motion.span className="fg-word two" style={{ x: fgX2 }}>FABRIC</motion.span>
      </div>
      <motion.header className="cin-header" initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
        <a className="cin-brand" href="#top"><Logo profile={profile} /><span>{profile.name}</span></a>
        <nav aria-label="Navigasi utama"><a href="#fabric">Proses</a><a href="#products">Produk</a><a href="#about">Tentang</a></nav>
        <div className="cin-header-actions">{chatUrl && <a href={chatUrl} target="_blank" rel="noreferrer" aria-label="Hubungi FRNDLY via WhatsApp"><MessageCircle size={18} /></a>}<a className="cin-login" href="/login">Masuk</a><MagneticButton className="small" href="/login">Mulai Pesanan <ArrowRight size={15} /></MagneticButton></div>
      </motion.header>
      <div className="cin-progress" aria-label={`Scene ${scene + 1} dari 10`}><span className="cin-progress-fill" style={{ height: `${Math.min(100, ((scene + 1) / 10) * 100)}%` }} /><small>0{scene + 1}</small></div>
      <main>
        <SceneHero chatUrl={chatUrl} ready={reduced || ready} reduced={reduced} />
        <Scene id="fabric" num={2} kicker="BAHAN" accent="s-2" title={<>Kain dipilih dengan teliti.<br /><em>Setiap helai punya peran.</em></>} body="Bahan berkualitas adalah fondasi hasil akhir yang baik. Kami membantu memilihkan material yang sesuai dengan kebutuhan dan anggaranmu." />
        <Scene num={3} kicker="DESAIN" accent="s-3" title={<>Desainmu diwujudkan,<br /><em>detail tidak dilupakan.</em></>} body="Dari logo, warna, sampai ukuran — setiap elemen dirancang agar siap diproduksi tanpa kehilangan esensi idemu." />
        <Scene num={4} kicker="PEMOTONGAN" accent="s-4" title={<>Pola dipotong presisi,<br /><em>tanpa kompromi.</em></>} body="Pemotongan yang akurat menjaga keseragaman produk, baik untuk satu buah maupun ratusan pesanan." />
        <Scene num={5} kicker="CETAK & BORDIR" accent="s-5" title={<>Sulaman dan cetak<br /><em>dibuat agar tahan lama.</em></>} body="Pengerjaan cetak dan bordir dikerjakan dengan teknik yang menghasilkan detail tajam dan warna awet." />
        <Scene num={6} kicker="PENJAHITAN" accent="s-6" title={<>Jahitan rapi,<br /><em>di tangan yang berpengalaman.</em></>} body="Setiap jahitan dirapikan dengan standar produksi yang konsisten agar nyaman dipakai dan tahan lama." />
        <Scene num={7} kicker="KUALITAS" accent="s-7" title={<>Detail kecil.<br /><em>Dampak besar.</em></>} body="Quality control dilakukan di setiap tahap, karena hasil akhir yang baik adalah bentuk penghargaan pada kepercayaanmu.">
          <span className="cin-rule" />
          <ReviewsMarquee reviews={reviews} />
        </Scene>
        <SceneProducts products={products} loading={loading} phone={profile.phone} />
        <Scene num={9} kicker="PENGEMASAN" accent="s-9" title={<>Dibungkus rapi,<br /><em>siap dikirim.</em></>} body="Pesanan dikemas dengan baik agar sampai dalam kondisi terbaik, dari workshop langsung ke tanganmu." />
        <FinalScene profile={profile} chatUrl={chatUrl} testimonials={testimonials} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </main>
      <footer className="cin-footer">
        <a className="cin-brand" href="#top"><Logo profile={profile} /><span>{profile.name}</span></a>
        <span>Apparel custom untuk cerita yang berarti.</span>
        <small>© {new Date().getFullYear()} {profile.name}. All rights reserved.</small>
      </footer>
    </div>
  )
}
