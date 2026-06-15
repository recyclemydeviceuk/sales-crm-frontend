// Thin REST client for the Sales CRM backend.
// Base URL resolution:
//   1. VITE_API_URL if set (Vercel env var or .env)
//   2. In production builds, fall back to the deployed backend
//   3. In dev, "/api" (proxied to the local Node server by Vite)
const PROD_API = 'https://sales-crm-backend-hwu6.onrender.com/api'
const envUrl = import.meta.env.VITE_API_URL
// Only trust an absolute http(s) URL from env. A stray "/api" (e.g. a leftover
// host env var) is ignored so production never posts back to the frontend origin.
const isAbsolute = typeof envUrl === 'string' && /^https?:\/\//i.test(envUrl)
const RAW_BASE = isAbsolute ? envUrl : (import.meta.env.PROD ? PROD_API : '/api')
const BASE = RAW_BASE.replace(/\/$/, '')
const TOKEN_KEY = 'sales-crm-token'

let authToken = localStorage.getItem(TOKEN_KEY) || null
let onUnauthorized = null

export function setAuthToken(token) {
  authToken = token || null
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}
export function getAuthToken() {
  return authToken
}
// Called when a protected request returns 401 (expired/invalid session).
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  let res
  try {
    res = await fetch(BASE + path, { ...options, headers })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  // Session expired on a protected route → trigger logout (but not for login/register).
  if (res.status === 401 && !path.startsWith('/auth')) {
    setAuthToken(null)
    onUnauthorized?.()
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try { message = (await res.json()).error || message } catch { /* ignore */ }
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),

  // Load everything the app needs in one shot.
  bootstrap: async () => {
    const [leadsRes, lists, settings] = await Promise.all([
      request('/leads?all=1'),
      request('/lists'),
      request('/settings'),
    ])
    return { leads: leadsRes.data, lists, settings }
  },

  fetchLeads: () => request('/leads?all=1').then((r) => r.data),
  fetchLists: () => request('/lists'),

  createLead: (lead) => request('/leads', { method: 'POST', body: JSON.stringify(lead) }),
  updateLead: (id, changes) => request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
  resetLeads: () => request('/leads/reset', { method: 'POST' }),

  listCreate: (type, body) => request(`/lists/${type}`, { method: 'POST', body: JSON.stringify(body) }),
  listUpdate: (type, id, body) => request(`/lists/${type}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  listRemove: (type, id) => request(`/lists/${type}/${id}`, { method: 'DELETE' }),
  listReset: (type) => request(`/lists/${type}/reset`, { method: 'POST' }),

  saveSettings: (s) => request('/settings', { method: 'PUT', body: JSON.stringify(s) }),
}
