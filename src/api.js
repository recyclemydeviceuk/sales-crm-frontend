// Thin REST client for the Sales CRM backend.
// The base URL comes from VITE_API_URL (.env). In dev it defaults to "/api",
// which Vite proxies to the Node server (see vite.config.js).
const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running on port 4000?')
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
