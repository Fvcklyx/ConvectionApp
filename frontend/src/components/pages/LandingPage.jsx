import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronDown, Mail, MapPin, MessageCircle, Phone, RotateCw } from 'lucide-react'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
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
  return profile.logo_url && !failed ? <img className="landing-logo-image" src={profile.logo_url} alt={profile.name} loading="eager" decoding="async" onError={() => setFailed(true)} /> : <span className="landing-logo-mark" aria-hidden="true">F</span>
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
  return enabled ? <span ref={ref} className="landing-cursor" data-state="DEFAULT" aria-hidden="true" /> : null
}

function MagneticButton({ children, className = '', href }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  return <motion.a aria-label={typeof children === 'string' ? children : undefined} href={href} className={`landing-button ${className}`} animate={offset} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setOffset({ x: (event.clientX - rect.left - rect.width / 2) * 0.1, y: (event.clientY - rect.top - rect.height / 2) * 0.1 }) }} onPointerLeave={() => setOffset({ x: 0, y: 0 })} whileTap={{ scale: 0.95 }}>{children}</motion.a>
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-12% 0px' })
  const reduced = useReducedMotion()
  return <motion.div ref={ref} className={className} initial={reduced ? false : { opacity: 0, y: 36 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: reduced ? 0 : 0.8, ease: [0.2, 0.8, 0.2, 1] }}>{children}</motion.div>
}

const InteractiveCanvas = lazy(() => import('../landing/InteractiveCanvas'))

function LoadingStatus({ apiLoading, sceneReady, canvasReady, imagesReady }) {
  const stage = apiLoading ? 'Mengambil profil dan katalog' : !sceneReady ? 'Menyiapkan ruang 3D' : !canvasReady ? 'Menyiapkan model interaktif' : !imagesReady ? 'Menyiapkan visual produk' : 'Showroom siap dijelajahi'
  const ready = !apiLoading && sceneReady && canvasReady && imagesReady
  return <div className={`landing-loading-status${ready ? ' is-ready' : ''}`} aria-live="polite"><span className="landing-loading-dot" /><span>{stage}</span><b>{apiLoading ? '01' : ready ? '03' : '02'}</b></div>
}

function ScrollScrubVideo({ src, poster, className = '' }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      const value = Math.min(1, Math.max(0, -rect.top / range))
      if (video.readyState >= 1 && Number.isFinite(video.duration)) video.currentTime = value * video.duration
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [])
  return <div ref={sectionRef} className={`scroll-scrub-video ${className}`}><div className="scroll-scrub-video-sticky"><video ref={videoRef} src={src} poster={poster} muted playsInline preload="metadata" aria-label="Visual proses pembuatan apparel" /></div></div>
}

function ProductVisual({ product, index }) {
  const image = product.image_url || product.image || product.imageUrl || product.photo_url
  const label = String(product.category || product.name || 'APPAREL CUSTOM').toUpperCase()
  return <div className={`product-poster poster-${index % 4}`} aria-label={image ? `Visual produk ${product.name}` : `Komposisi abstrak untuk ${product.name}`}>
    {image ? <img src={image} alt={product.name} loading="lazy" decoding="async" /> : <><span className="product-poster-grid" /><span className="product-poster-fabric" /><span className="product-poster-label">{label.slice(0, 26)}</span></>}
    <span className="product-poster-number">0{index + 1}</span>
  </div>
}

function ProductScene({ progress, apiLoading, imagesReady }) {
  const pointer = useRef({ x: 0, y: 0 })
  const rotation = useRef(0)
  const velocity = useRef(0)
  const dragStart = useRef(null)
  const moved = useRef(false)
  const lastX = useRef(null)
  const [detail, setDetail] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const [fallback, setFallback] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const ref = useRef(null)
  const scrollRotation = useTransform(progress, [0, 0.4], [0, 1.2])
  const scrollScale = useTransform(progress, [0, 0.25], [1, 0.75])
  const sceneValues = { rotation: scrollRotation, scale: scrollScale }
  useEffect(() => { const reduced = window.matchMedia('(prefers-reduced-motion: reduce)'); const slow = window.matchMedia('(update: slow)'); const unsupported = !window.WebGLRenderingContext; const update = () => setFallback(reduced.matches || slow.matches || unsupported); update(); reduced.addEventListener?.('change', update); slow.addEventListener?.('change', update); return () => { reduced.removeEventListener?.('change', update); slow.removeEventListener?.('change', update) } }, [])
  useEffect(() => { if (!('IntersectionObserver' in window)) { setVisible(true); return undefined } const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '300px' }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect() }, [])
  const changePointer = (event) => { const rect = event.currentTarget.getBoundingClientRect(); pointer.current = { x: (event.clientX - rect.left) / rect.width * 2 - 1, y: (event.clientY - rect.top) / rect.height * 2 - 1 }; if (lastX.current !== null) { const delta = event.clientX - lastX.current; rotation.current += delta * 0.012; velocity.current = delta * 0.012; if (dragStart.current && Math.hypot(event.clientX - dragStart.current.x, event.clientY - dragStart.current.y) > 10) moved.current = true } lastX.current = event.clientX }
  useEffect(() => { const timer = window.setInterval(() => { rotation.current += velocity.current; velocity.current *= 0.92 }, 16); return () => window.clearInterval(timer) }, [])
  return <div ref={ref} className={`landing-garment-stage${active ? ' is-active' : ''}`} tabIndex="0" role="button" aria-label="Model produk interaktif, tekan Enter untuk detail" aria-pressed={detail} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setDetail((value) => !value) } if (event.key === 'ArrowLeft') rotation.current -= 0.3; if (event.key === 'ArrowRight') rotation.current += 0.3 }} onPointerMove={changePointer} onPointerEnter={() => setActive(true)} onPointerLeave={() => { setActive(false); pointer.current = { x: 0, y: 0 }; lastX.current = null }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragStart.current = { x: event.clientX, y: event.clientY }; moved.current = false; lastX.current = event.clientX }} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); lastX.current = null; if (!moved.current) setDetail((value) => !value); dragStart.current = null }} onPointerCancel={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); lastX.current = null; dragStart.current = null }}><div className="landing-stage-glow" />{visible && !fallback ? <Suspense fallback={<div className="landing-garment-fallback" aria-hidden="true"><span>F</span></div>}><InteractiveCanvas values={sceneValues} pointer={pointer} rotation={rotation} detail={detail} onReady={() => setCanvasReady(true)} onError={() => setFallback(true)} fallback={<div className="landing-garment-fallback" aria-hidden="true"><span>F</span></div>} /></Suspense> : <div className="landing-garment-fallback" aria-hidden="true"><span>F</span></div>}<LoadingStatus apiLoading={apiLoading} sceneReady={visible} canvasReady={fallback || canvasReady} imagesReady={imagesReady} /><span className="landing-stage-label"><RotateCw size={14} /> Drag / tap to explore</span></div>
}

export default function LandingPage() {
  const [profile, setProfile] = useState({ name: 'FRNDLY', logo_url: null, phone: null, email: null, address: null })
  const [products, setProducts] = useState([]); const [reviews, setReviews] = useState([]); const [testimonials, setTestimonials] = useState([]);   const [loading, setLoading] = useState(true); const [openFaq, setOpenFaq] = useState(0); const [scene, setScene] = useState(0)
  const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 }); const orbY = useTransform(progress, [0, 1], [0, -260]); const anchorY = useTransform(progress, [0, 1], [0, -180]); const anchorRotate = useTransform(progress, [0, 1], [-8, 28]); const anchorScale = useTransform(progress, [0, .35, 1], [1, 1.16, .78]); const anchorClip = useTransform(progress, [0, .35, .7, 1], ['inset(0% 0% 0% 0%)', 'inset(4% 0% 8% 0%)', 'inset(0% 5% 0% 5%)', 'inset(12% 0% 0% 0%)'])
  useEffect(() => { const controller = new AbortController(); api.get('/company/profile', { signal: controller.signal }).then(({ data }) => { const payload = data.data || {}; setProfile((current) => ({ ...current, ...payload })); setProducts(listOf(payload.products)); setReviews(listOf(payload.reviews)); setTestimonials(listOf(payload.testimonials)) }).catch(() => {}).finally(() => { if (!controller.signal.aborted) setLoading(false) }); return () => controller.abort() }, [])
  const featuredImageUrls = useMemo(() => products.slice(0, 6).map((product) => product.image_url || product.image || product.imageUrl || product.photo_url).filter(Boolean), [products])
  const [imagesReady, setImagesReady] = useState(true)
  useEffect(() => { if (!featuredImageUrls.length) { setImagesReady(true); return undefined } let settled = 0; setImagesReady(false); const finish = () => { settled += 1; if (settled === featuredImageUrls.length) setImagesReady(true) }; const images = featuredImageUrls.map((url) => { const image = new Image(); image.onload = finish; image.onerror = finish; image.src = url; return image }); return () => images.forEach((image) => { image.onload = null; image.onerror = null }) }, [featuredImageUrls])
  const chatUrl = whatsappUrl(profile.phone); const rating = useMemo(() => reviews.length ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1) : null, [reviews]); const steps = ['Konsultasi', 'Pilih Produk', 'Konfirmasi Desain', 'Produksi', 'Selesai']; const faqs = [['Apa saja produk yang tersedia?', 'Kami membantu kebutuhan apparel dan atribut custom sesuai produk yang tersedia di katalog.'], ['Apakah bisa custom desain?', 'Bisa. Konsultasikan kebutuhan desain dan detail pesanan bersama tim kami terlebih dahulu.'], ['Bagaimana proses pemesanan?', 'Mulai dari konsultasi, pilih produk, konfirmasi desain, produksi, hingga pesanan selesai.'], ['Bagaimana cara menghubungi admin?', 'Gunakan tombol WhatsApp atau kontak yang tersedia di halaman ini.']]
  useEffect(() => { const sections = [...document.querySelectorAll('.landing-scene')]; if (!('IntersectionObserver' in window)) return undefined; const observer = new IntersectionObserver((entries) => { const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (current) setScene(sections.indexOf(current)) }, { threshold: [0.25, 0.55, 0.8] }); sections.forEach((section) => observer.observe(section)); return () => observer.disconnect() }, [])
  return <div className={`landing-page scene-${scene}`}><PointerCursor /><motion.div className="landing-cinematic-anchor" style={{ y: anchorY, rotate: anchorRotate, scale: anchorScale, clipPath: anchorClip }} aria-hidden="true"><span /><span /><span /></motion.div><div className="landing-progress" aria-label={`Scene ${scene + 1} dari 9`}><span style={{ height: `${Math.min(100, ((scene + 1) / 9) * 100)}%` }} /><small>0{scene + 1}</small></div><motion.header className="landing-header"><a className="landing-brand" href="#top"><Logo profile={profile} /><span>{profile.name}</span></a><nav aria-label="Navigasi utama"><a href="#products">Produk</a><a href="#process">Proses</a><a href="#about">Tentang</a></nav><div className="landing-header-actions">{chatUrl && <a href={chatUrl} target="_blank" rel="noreferrer" aria-label="Hubungi FRNDLY via WhatsApp"><MessageCircle size={18} /></a>}<a className="landing-login" href="/login">Masuk</a><MagneticButton className="small" href="/login">Mulai Pesanan <ArrowRight size={15} /></MagneticButton></div></motion.header>
    <main id="top"><section className="landing-scene landing-hero"><motion.div className="landing-orb orb-one" style={{ y: orbY }} /><motion.div className="landing-orb orb-two" style={{ y: orbY }} /><div className="landing-hero-content"><Reveal><p className="landing-kicker">APPAREL CUSTOM / MADE WITH INTENTION</p><h1>Wear the story.<br /><em>Make it yours.</em></h1><p className="landing-lede">Apparel custom yang membawa ide, komunitas, dan momen penting menjadi sesuatu yang bisa dikenakan.</p><div className="landing-actions"><MagneticButton href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={17} /></MagneticButton>{chatUrl && <a className="landing-quiet-link" href={chatUrl} target="_blank" rel="noreferrer">Konsultasi via WhatsApp <MessageCircle size={16} /></a>}</div></Reveal><ProductScene progress={progress} apiLoading={loading} imagesReady={imagesReady} /></div><a className="landing-scroll" href="#story">Scroll to explore <ArrowDown size={15} /></a></section>
      <section id="story" className="landing-scene landing-story"><Reveal><p className="landing-kicker">01 / THE STORY</p><div className="story-layout"><h2>Yang kamu pakai<br /><em>punya arti.</em></h2><div><p>Kami percaya apparel bukan sekadar bahan dan ukuran. Ia menyimpan identitas, menyatukan orang, dan membuat sebuah momen tinggal lebih lama.</p><span className="landing-rule" /></div></div></Reveal></section>
      <section id="products" className="landing-scene landing-products"><Reveal><p className="landing-kicker">02 / THE COLLECTION</p><div className="scene-heading"><h2>Mulai dari<br /><em>sebuah bentuk.</em></h2><p>Temukan produk yang paling dekat dengan kebutuhanmu, lalu kembangkan bersama kami.</p></div></Reveal><div className="landing-product-grid">{loading ? <div className="landing-empty">Menyiapkan katalog...</div> : products.length ? products.slice(0, 6).map((product, index) => <motion.article className="landing-product-card" key={product.id || index} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}><ProductVisual product={product} index={index} /><p>{product.category || 'APPAREL CUSTOM'}</p><h3>{product.name}</h3><b>{product.price ? `Mulai dari ${formatRp(product.price)}` : 'Konsultasikan harga'}</b>{profile.phone && <a href={whatsappUrl(profile.phone, product.name)} target="_blank" rel="noreferrer">Eksplor produk <ArrowRight size={15} /></a>}</motion.article>) : <div className="landing-empty">Produk sedang dipersiapkan.</div>}</div></section>
      <section id="process" className="landing-scene landing-process-scene"><Reveal><p className="landing-kicker">03 / THE PROCESS</p><h2>From idea<br /><em>to reality.</em></h2></Reveal><div className="landing-process-list">{steps.map((step, index) => <motion.div key={step} whileInView={{ x: 0, opacity: 1 }} initial={{ x: -30, opacity: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}><span>0{index + 1}</span><h3>{step}</h3>{index < steps.length - 1 && <ArrowRight size={18} />}</motion.div>)}</div></section>
      <section className="landing-scene landing-quality"><div className="quality-media"><ScrollScrubVideo src="https://cdn.coverr.co/videos/coverr-a-person-sewing-a-piece-of-clothing-1575/1080p.mp4" poster="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=85" /></div><Reveal><p className="landing-kicker">04 / THE STANDARD</p><div className="quality-card"><span className="quality-stamp">FRNDLY<br />QUALITY</span><div><h2>Detail kecil.<br /><em>Dampak besar.</em></h2><p>Dari konsultasi yang responsif sampai hasil produksi yang sesuai kebutuhan, setiap tahap dikerjakan dengan perhatian.</p></div></div></Reveal></section>
      <section className="landing-scene landing-reviews"><Reveal><p className="landing-kicker">05 / THEIR WORDS</p><h2>Made together,<br /><em>worn proudly.</em></h2></Reveal><div className="landing-review-grid">{reviews.filter((item) => item.is_published !== false).slice(0, 3).map((review, index) => <motion.article key={review.id || index} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }}><span className="stars">{'★'.repeat(Math.min(5, Math.max(0, Math.round(Number(review.rating || 0) / 2))))}</span><p>“{review.review_text}”</p><b>{review.customer_name || 'Customer FRNDLY'}</b></motion.article>)}{testimonials.filter((item) => item.is_published).slice(0, 1).map((item) => <article key={item.id}><span className="stars">★★★★★</span><p>“{item.content || item.testimonial_text}”</p><b>Testimonial pelanggan</b></article>)}{!reviews.length && !testimonials.length && <p className="landing-empty">Belum ada ulasan yang dapat ditampilkan.</p>}</div>{rating && <div className="landing-rating"><strong>{rating}</strong><span>Rata-rata pengalaman pelanggan</span></div>}</section>
      <section id="about" className="landing-scene landing-about"><Reveal><p className="landing-kicker">06 / FIND US</p><h2>{profile.name}, dibuat untuk<br /><em>cerita kamu.</em></h2><p className="about-copy">Usaha konveksi untuk kebutuhan apparel dan atribut custom, dari event, komunitas, organisasi, perusahaan, hingga kebutuhan personal.</p><div className="landing-contact-list">{profile.address && <span><MapPin size={16} />{profile.address}</span>}{profile.phone && <span><Phone size={16} />{profile.phone}</span>}{profile.email && <span><Mail size={16} />{profile.email}</span>}</div></Reveal></section>
      <section className="landing-scene landing-faq"><Reveal><p className="landing-kicker">07 / FAQ</p><h2>Masih penasaran?</h2></Reveal>{faqs.map(([question, answer], index) => <div className="landing-faq-row" key={question}><button aria-expanded={openFaq === index} aria-controls={`faq-${index}`} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>{question}<ChevronDown size={18} /></button>{openFaq === index && <p id={`faq-${index}`}>{answer}</p>}</div>)}</section>
      <section className="landing-scene landing-final"><Reveal><p className="landing-kicker">08 / START HERE</p><h2>Make something<br /><em>meaningful.</em></h2><p>Mulai percakapan untuk mewujudkan kebutuhan apparel custom kamu.</p><MagneticButton className="light" href="/login">Bergabung &amp; Mulai Pesanan <ArrowRight size={17} /></MagneticButton>{chatUrl && <a className="landing-quiet-link light-link" href={chatUrl} target="_blank" rel="noreferrer">atau konsultasi via WhatsApp</a>}</Reveal></section>
    </main><footer className="landing-footer"><a className="landing-brand" href="#top"><Logo profile={profile} /><span>{profile.name}</span></a><span>Apparel custom untuk cerita yang berarti.</span><small>© {new Date().getFullYear()} {profile.name}. All rights reserved.</small></footer>
  </div>
}
