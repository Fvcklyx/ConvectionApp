import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fetchAllPages } from './pagination.js'

test('loads every server page, not only the first batch', async () => {
  const requested = []
  const result = await fetchAllPages(async page => {
    requested.push(page)
    return { data: [{ id: page }], last_page: 3 }
  })
  assert.deepEqual(requested, [1, 2, 3])
  assert.deepEqual(result.map(row => row.id), [1, 2, 3])
})
test('supports empty and unpaginated lists', async () => {
  assert.deepEqual(await fetchAllPages(async () => []), [])
  assert.deepEqual(await fetchAllPages(async () => ({ data: [], last_page: 1 })), [])
})
test('rejects malformed data and propagates later-page failure', async () => {
  await assert.rejects(fetchAllPages(async () => ({ data: null })))
  await assert.rejects(fetchAllPages(async () => ({ data: [], last_page: Infinity })))
  await assert.rejects(fetchAllPages(async page => {
    if (page === 2) throw new Error('offline')
    return { data: [], last_page: 2 }
  }), /offline/)
})
