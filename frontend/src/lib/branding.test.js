import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { cachedBusinessName, normalizedBusinessName, rememberBusinessName, BUSINESS_NAME_KEY } from './branding.js'

test('business name normalizes and bounds untrusted settings values', () => {
  assert.equal(normalizedBusinessName(null), '')
  assert.equal(normalizedBusinessName({ name: 'invalid' }), '')
  assert.equal(normalizedBusinessName('  Nama Bisnis  '), 'Nama Bisnis')
  assert.equal(normalizedBusinessName('a'.repeat(300)).length, 255)
})

test('loading brand cache follows saved names and tolerates blocked storage', () => {
  const values = new Map()
  globalThis.window = { localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) } }
  try {
    assert.equal(cachedBusinessName(), 'FRNDLY')
    rememberBusinessName('Bisnis A')
    assert.equal(cachedBusinessName(), 'Bisnis A')
    rememberBusinessName('Bisnis B')
    assert.equal(values.get(BUSINESS_NAME_KEY), 'Bisnis B')
    window.localStorage.getItem = () => { throw Error('blocked') }
    window.localStorage.setItem = () => { throw Error('blocked') }
    assert.equal(cachedBusinessName(), 'FRNDLY')
    assert.doesNotThrow(() => rememberBusinessName('Bisnis C'))
  } finally { delete globalThis.window }
})

test('boot and React loaders share artwork and no timer controls completion', () => {
  const component = readFileSync(new URL('../components/AppLoading.jsx', import.meta.url), 'utf8')
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../../public/boot-loader.css', import.meta.url), 'utf8')
  assert.doesNotMatch(component, /setTimeout|setInterval|animationend|aria-valuenow/)
  const paths = text => [...text.matchAll(/ d="([^"]+)"/g)].map(match => match[1])
  assert.deepEqual(paths(component), paths(html))
  assert.match(css, /prefers-reduced-motion:reduce/)
  assert.match(css, /data-theme='dark'/)
  assert.match(html, /textContent = name/)
})

test('pre-render theme honors saved preference and system fallback even when storage is blocked', () => {
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  for (const [stored, darkSystem, blocked, expected] of [
    ['dark', false, false, 'dark'], ['light', true, false, 'light'],
    [null, true, false, 'dark'], ['invalid', false, false, 'light'],
    [null, true, true, 'dark'], [null, false, true, 'light'],
  ]) {
    let theme
    runInNewContext(script, {
      localStorage: { getItem: () => { if (blocked) throw Error('blocked'); return stored } },
      window: { matchMedia: () => ({ matches: darkSystem }) },
      document: { documentElement: { setAttribute: (_key, value) => { theme = value } } },
    })
    assert.equal(theme, expected)
  }
})
