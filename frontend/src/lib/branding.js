import { getStorageItem, setStorageItem } from './storage.js'

export const BUSINESS_NAME_KEY = 'frndly_business_name'
export const normalizedBusinessName = value => typeof value === 'string' ? value.trim().slice(0, 255) : ''
export const cachedBusinessName = () => normalizedBusinessName(getStorageItem(BUSINESS_NAME_KEY)) || 'FRNDLY'
export const rememberBusinessName = value => {
  const name = normalizedBusinessName(value)
  if (name) setStorageItem(BUSINESS_NAME_KEY, name)
}
