// Development-only fixture, not imported by the production entry point.
// Requests are deferred until an explicit button click; no delays or real API writes.
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import StorefrontPage from '../src/components/pages/StorefrontPage'
import { api } from '../src/api'
import { cachedBusinessName } from '../src/lib/branding'
import '../src/index.css'
import '../src/storefront.css'

let pending
api.defaults.adapter = config => new Promise((resolve, reject) => {
  pending = { config, resolve, reject }
})

// oxlint-disable-next-line react/only-export-components
function Harness() {
  const [run, setRun] = useState(0)
  const [theme, setTheme] = useState('light')
  const resolve = () => pending?.resolve({ data: { data: { name: cachedBusinessName(), products: [] } }, status: 200, statusText: 'OK', headers: {}, config: pending.config })
  return <>
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 20000, display: 'flex', flexWrap: 'wrap', gap: 4, background: 'var(--surface)' }}>
      <button onClick={resolve}>Selesaikan permintaan</button>
      <button onClick={() => pending?.reject(new Error('Simulated network failure'))}>Gagalkan permintaan</button>
      <button onClick={() => setRun(n => n + 1)}>Ulangi pengujian</button>
      <button onClick={() => { const next = theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = next; setTheme(next) }}>Tema {theme}</button>
    </div>
    <StorefrontPage key={run} />
  </>
}

createRoot(document.getElementById('root')).render(<Harness />)
