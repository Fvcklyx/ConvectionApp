import axios from 'axios'

export const TOKEN_KEY = 'frndly_token'

export const SESSION_EXPIRED_EVENT = 'frndly:session-expired'

const MAX_NETWORK_FAILURES = 2

let networkFailures = 0

export const emitSessionExpired = (reason) => {
  localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, { detail: { reason } }))
}

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    networkFailures = 0
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem(TOKEN_KEY)) {
        emitSessionExpired('unauthorized')
      }
    } else if (!error.response) {
      networkFailures += 1

      if (networkFailures >= MAX_NETWORK_FAILURES) {
        if (localStorage.getItem(TOKEN_KEY)) {
          emitSessionExpired('server-unreachable')
        }
      }
    }

    return Promise.reject(error)
  },
)
