export const getStorageItem = (key) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    return false
  }

  return true
}

export const removeStorageItem = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    return false
  }

  return true
}
