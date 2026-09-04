import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error, info) { console.error('Application render failed', error, info.componentStack) }
  render() {
    if (this.state.failed) {
      return <main className="auth-screen"><section className="auth-card" role="alert">
        <h1>Halaman gagal dimuat</h1>
        <p>Terjadi kesalahan tampilan. Muat ulang untuk mencoba kembali. Data yang belum disimpan mungkin perlu diisi ulang.</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Muat ulang</button>
        <a href="/login">Kembali ke halaman masuk</a>
      </section></main>
    }
    return this.props.children
  }
}
