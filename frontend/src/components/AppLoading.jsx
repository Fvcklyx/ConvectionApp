import { cachedBusinessName } from '../lib/branding'

// CSS animates only while this component exists. Request state controls its lifetime.
export default function AppLoading({ brandName, message = 'Menyiapkan aplikasi', error, onRetry }) {
  return <section className="app-loading" data-failed={Boolean(error)} aria-label="Pemuatan aplikasi">
    <div className="app-loading-card">
      <span className="app-loading-eyebrow">DARI IDE, MENJADI NYATA</span>
      <svg className="app-loading-art" viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <circle className="loading-orbit" cx="120" cy="120" r="105" />
        <path className="loading-guide" d="M88 60 59 73 34 113 66 133 80 111 75 187Q120 197 165 187L160 111 174 133 206 113 181 73 152 60Q120 87 88 60Z" />
        <path className="loading-thread" pathLength="100" d="M88 60 59 73 34 113 66 133 80 111 75 187Q120 197 165 187L160 111 174 133 206 113 181 73 152 60Q120 87 88 60Z" />
        <path className="loading-seams" d="M84 73Q120 103 156 73M84 180Q120 188 156 180M80 111 84 90M160 111 156 90" />
        <path className="loading-monogram" d="m105 128 11 11 22-25" />
        <circle className="loading-pin" cx="88" cy="60" r="5" />
      </svg>
      <h1>{brandName || cachedBusinessName()}</h1>
      <p className="app-loading-tagline">Merangkai setiap detail untukmu.</p>
      <div className="app-loading-status" role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'} aria-atomic="true">
        <span className="loading-dot" aria-hidden="true" />
        <span>{error || message}</span>
      </div>
      {error && <button className="app-loading-retry" type="button" onClick={onRetry}>Coba lagi</button>}
    </div>
    <small className="app-loading-footnote">{error ? 'Periksa koneksi, lalu coba kembali.' : 'Halaman terbuka segera setelah siap.'}</small>
  </section>
}
