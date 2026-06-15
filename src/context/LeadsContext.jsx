import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { BootScreen, ErrorScreen } from '../components/Boot'

const LeadsContext = createContext(null)
const EMPTY_LISTS = { stages: [], sources: [], colleges: [], cities: [] }
// Which lead field each managed list cascades onto, for optimistic updates.
const LIST_FIELD = { stages: 'status', sources: 'source', colleges: 'college', cities: 'city' }

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([])
  const [lists, setLists] = useState(EMPTY_LISTS)
  const [settings, setSettingsState] = useState({ counselor: 'Counselor', org: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = async () => {
    const data = await api.bootstrap()
    setLeads(data.leads)
    setLists(data.lists)
    setSettingsState(data.settings)
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchAll()
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Background refresh (used to recover from a failed optimistic write).
  const refresh = () => fetchAll().catch((e) => console.error('[refresh]', e))

  useEffect(() => { load() }, [])

  /* ---------------- Leads ---------------- */
  const updateLead = async (id, changes) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l))) // optimistic
    try {
      const updated = await api.updateLead(id, changes)
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    } catch (e) {
      console.error('[updateLead]', e)
      refresh()
    }
  }

  const addLead = async (lead) => {
    try {
      const created = await api.createLead(lead)
      setLeads((prev) => [created, ...prev])
      return created
    } catch (e) {
      console.error('[addLead]', e)
      setError(e.message)
      return null
    }
  }

  const resetData = async () => {
    try {
      await api.resetLeads()
      setLeads(await api.fetchLeads())
    } catch (e) {
      console.error('[resetData]', e)
    }
  }

  /* ---------------- Managed lists (CRUD) ---------------- */
  const addListItem = async (key, name, extra = {}) => {
    const n = (name || '').trim()
    if (!n) return false
    if (lists[key].some((i) => i.name.toLowerCase() === n.toLowerCase())) return false
    try {
      const item = await api.listCreate(key, { name: n, ...extra })
      setLists((prev) => ({ ...prev, [key]: [...prev[key], item] }))
      return true
    } catch (e) {
      console.error('[addListItem]', e)
      return false
    }
  }

  const updateListItem = async (key, id, changes) => {
    const item = lists[key].find((i) => i.id === id)
    if (!item) return
    const oldName = item.name
    const renaming = changes.name && changes.name.trim() && changes.name.trim() !== oldName
    const newName = renaming ? changes.name.trim() : oldName
    if (renaming && lists[key].some((i) => i.id !== id && i.name.toLowerCase() === newName.toLowerCase())) return

    // optimistic: update the list item …
    setLists((prev) => ({ ...prev, [key]: prev[key].map((i) => (i.id === id ? { ...i, ...changes, name: newName } : i)) }))
    // … and cascade a rename onto leads that reference the old value.
    if (renaming) {
      const field = LIST_FIELD[key]
      setLeads((ls) => ls.map((l) => (l[field] === oldName ? { ...l, [field]: newName } : l)))
    }
    try {
      await api.listUpdate(key, id, { ...changes, name: newName })
    } catch (e) {
      console.error('[updateListItem]', e)
      refresh()
    }
  }

  const removeListItem = async (key, id) => {
    const item = lists[key].find((i) => i.id === id)
    if (!item) return
    if (key === 'stages') {
      if (lists.stages.length <= 1) return
      const fallback = lists.stages.find((s) => s.id !== id)?.name
      setLeads((ls) => ls.map((l) => (l.status === item.name ? { ...l, status: fallback } : l)))
    }
    setLists((prev) => ({ ...prev, [key]: prev[key].filter((i) => i.id !== id) }))
    try {
      await api.listRemove(key, id)
    } catch (e) {
      console.error('[removeListItem]', e)
      refresh()
    }
  }

  const resetList = async (key) => {
    try {
      const items = await api.listReset(key)
      setLists((prev) => ({ ...prev, [key]: items }))
      if (key === 'stages') setLeads(await api.fetchLeads())
    } catch (e) {
      console.error('[resetList]', e)
    }
  }

  const setSettings = async (s) => {
    setSettingsState(s) // optimistic
    try {
      await api.saveSettings(s)
    } catch (e) {
      console.error('[setSettings]', e)
    }
  }

  /* ---------------- Derived ---------------- */
  const stages = lists.stages
  const stageMap = useMemo(() => Object.fromEntries(stages.map((s) => [s.name, s])), [stages])
  const names = (key) => (lists[key] || []).map((i) => i.name)

  const stats = useMemo(() => {
    const byStatus = {}
    const bySource = {}
    let contacted = 0
    const firstStage = lists.stages[0]?.name
    for (const l of leads) {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1
      if (l.source) bySource[l.source] = (bySource[l.source] || 0) + 1
      if (l.status !== firstStage) contacted += 1
    }
    const total = leads.length
    const interested = (byStatus['Interested'] || 0) + (byStatus['Converted'] || 0)
    return {
      total,
      contacted,
      interested,
      converted: byStatus['Converted'] || 0,
      byStatus,
      bySource,
      contactRate: total ? Math.round((contacted / total) * 100) : 0,
      conversionRate: contacted ? Math.round(((byStatus['Converted'] || 0) / contacted) * 100) : 0,
    }
  }, [leads, lists.stages])

  const value = {
    leads, settings, setSettings, updateLead, addLead, resetData, stats,
    lists, stages, stageMap, names,
    addListItem, updateListItem, removeListItem, resetList,
    loading, error, reload: load,
  }

  return (
    <LeadsContext.Provider value={value}>
      {loading ? <BootScreen /> : error ? <ErrorScreen error={error} onRetry={load} /> : children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider')
  return ctx
}
