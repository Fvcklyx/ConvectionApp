export async function fetchAllPages(fetchPage) {
  const rows = []
  let page = 1
  let lastPage = 1
  do {
    const payload = await fetchPage(page)
    const batch = Array.isArray(payload) ? payload : payload?.data
    if (!Array.isArray(batch)) throw new Error('Format daftar dari server tidak valid.')
    rows.push(...batch)
    lastPage = Array.isArray(payload) ? 1 : Number(payload.last_page ?? 1)
    if (!Number.isSafeInteger(lastPage) || lastPage < 1) throw new Error('Metadata halaman tidak valid.')
    page += 1
  } while (page <= lastPage)
  return rows
}
