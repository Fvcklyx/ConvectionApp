import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('dashboard navigation cannot suspend the entire application for a menu module', () => {
  const app = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8')
  for (const page of ['Dashboard', 'Customers', 'Products', 'Orders', 'Payments', 'Invoices', 'Production', 'Shipping', 'Reviews', 'Testimonials', 'Reports', 'Settings']) {
    assert.match(app, new RegExp(`import ${page}Page from`))
    assert.doesNotMatch(app, new RegExp(`const ${page}Page = lazy`))
  }
  const shell = app.slice(app.indexOf('function AppShell'), app.indexOf('function App()'))
  assert.doesNotMatch(shell, /<AppLoading/)
  for (const page of ['Reports', 'Settings']) {
    const source = readFileSync(new URL(`../components/pages/${page}Page.jsx`, import.meta.url), 'utf8')
    assert.doesNotMatch(source, /AppLoading/)
  }
})
