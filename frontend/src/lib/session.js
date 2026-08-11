import { api, TOKEN_KEY } from '../api'
import { getStorageItem, setStorageItem } from './storage'

export const SESSION_TIMEOUT_MS = 10 * 60 * 1000

export const LAST_ACTIVITY_KEY = 'frndly_last_activity'

const HEARTBEAT_INTERVAL_MS = 30 * 1000
const INACTIVITY_CHECK_MS = 15 * 1000
const ACTIVITY_THROTTLE_MS = 5 * 1000

export const touchActivity = () => {
  setStorageItem(LAST_ACTIVITY_KEY, String(Date.now()))
}

const getLastActivity = () => Number(getStorageItem(LAST_ACTIVITY_KEY) || 0)

export const isSessionExpired = () => {
  const last = getLastActivity()
  return last > 0 && Date.now() - last >= SESSION_TIMEOUT_MS
}

const throttle = (fn, ms) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last < ms) return
    last = now
    fn(...args)
  }
}

export function startSessionGuard({ onSessionExpired }) {
  if (!getStorageItem(TOKEN_KEY)) {
    return () => {}
  }

  if (isSessionExpired()) {
    onSessionExpired()
    return () => {}
  }

  touchActivity()

  const onActivity = throttle(touchActivity, ACTIVITY_THROTTLE_MS)
  const onVisibility = () => {
    if (document.visibilityState === 'visible' && isSessionExpired()) {
      onSessionExpired()
    }
  }

  window.addEventListener('pointerdown', onActivity)
  window.addEventListener('keydown', onActivity)
  window.addEventListener('touchstart', onActivity)
  window.addEventListener('mousemove', onActivity)
  document.addEventListener('visibilitychange', onVisibility)

  let stopped = false

  const heartbeat = async () => {
    if (stopped) return

    try {
      const res = await api.post('/auth/refresh')
      if (stopped) return

      const token = res.data?.data?.token
      if (token) setStorageItem(TOKEN_KEY, token)
    } catch {
      // 401 / server unreachable sudah ditangani oleh interceptor axios.
    }
  }

  const checkInactivity = () => {
    if (stopped) return
    if (isSessionExpired()) onSessionExpired()
  }

  const heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS)
  const inactivityTimer = setInterval(checkInactivity, INACTIVITY_CHECK_MS)
  heartbeat()

  return () => {
    stopped = true
    clearInterval(heartbeatTimer)
    clearInterval(inactivityTimer)
    window.removeEventListener('pointerdown', onActivity)
    window.removeEventListener('keydown', onActivity)
    window.removeEventListener('touchstart', onActivity)
    window.removeEventListener('mousemove', onActivity)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
