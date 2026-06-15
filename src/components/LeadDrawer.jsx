import { useEffect, useState } from 'react'
import { useLeads } from '../context/LeadsContext'
import { CALL_STATUS_OPTIONS, DISPOSITION_OPTIONS, ORIENTATION_OPTIONS } from '../data/constants'
import { initials } from './StatusBadge'
import Select from './Select'
import { IconClose, IconCheck } from './Icons'

const opt = (arr) => arr.map((o) => ({ value: o, label: o || '— None —' }))

// Fields the drawer edits; used to build the initial form and the dirty check.
const FIELDS = [
  'firstName', 'lastName', 'email', 'countryCode', 'phone', 'city', 'college', 'source', 'program',
  'status', 'callStatus', 'callDisposition', 'orientationStatus', 'counselor', 'dateOfCalling', 'remark',
]

export default function LeadDrawer({ leadId, onClose }) {
  const { leads, updateLead, settings, stages, names } = useLeads()
  const lead = leads.find((l) => l.id === leadId)
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!lead) return
    const initial = {}
    for (const k of FIELDS) initial[k] = lead[k] ?? ''
    if (!initial.counselor) initial.counselor = settings.counselor || ''
    setForm(initial)
  }, [leadId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  if (!lead || !form) return null

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setVal = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    updateLead(lead.id, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 1400)
  }

  // Compare the form against the lead's current values (counselor falls back to the default).
  const current = {}
  for (const k of FIELDS) current[k] = lead[k] ?? ''
  if (!current.counselor) current.counselor = settings.counselor || ''
  const dirty = FIELDS.some((k) => (form[k] || '') !== (current[k] || ''))

  const headerName = `${lead.firstName} ${lead.lastName}`.trim() || 'Unnamed Lead'

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Lead details">
        <div className="drawer-head">
          <div className="lead-avatar">{initials(lead.firstName, lead.lastName)}</div>
          <div>
            <h2>{headerName}</h2>
            <div className="meta">Lead #{lead.seq ?? '—'}{lead.program ? ` · ${lead.program}` : ''}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <IconClose size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="section-title">Lead details</div>

          <div className="field-row">
            <div className="field">
              <label>First name</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="First name" />
            </div>
            <div className="field">
              <label>Last name</label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="Last name" />
            </div>
          </div>

          <div className="field-row" style={{ gridTemplateColumns: '80px 1fr' }}>
            <div className="field">
              <label>Code</label>
              <input value={form.countryCode} onChange={set('countryCode')} placeholder="91" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={set('phone')} placeholder="Phone number" />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="name@email.com" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>City</label>
              <Select creatable value={form.city} onChange={setVal('city')} options={names('cities')} placeholder="Select or type city" />
            </div>
            <div className="field">
              <label>Source</label>
              <Select creatable value={form.source} onChange={setVal('source')} options={names('sources')} placeholder="Select or type source" />
            </div>
          </div>

          <div className="field">
            <label>College</label>
            <Select creatable value={form.college} onChange={setVal('college')} options={names('colleges')} placeholder="Select or type college" />
          </div>

          <div className="field">
            <label>Interested program</label>
            <input value={form.program} onChange={set('program')} placeholder="e.g. MBBS, USMLE" />
          </div>

          <div className="section-title">Status &amp; activity</div>

          <div className="field">
            <label>Lead stage</label>
            <Select value={form.status} onChange={setVal('status')} options={stages.map((s) => s.name)} searchable={false} />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Call status</label>
              <Select value={form.callStatus} onChange={setVal('callStatus')} options={opt(CALL_STATUS_OPTIONS)} searchable={false} placeholder="— None —" />
            </div>
            <div className="field">
              <label>Date of calling</label>
              <input type="date" value={form.dateOfCalling} onChange={set('dateOfCalling')} />
            </div>
          </div>

          <div className="field">
            <label>Call disposition</label>
            <Select value={form.callDisposition} onChange={setVal('callDisposition')} options={opt(DISPOSITION_OPTIONS)} placeholder="— None —" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Orientation</label>
              <Select value={form.orientationStatus} onChange={setVal('orientationStatus')} options={opt(ORIENTATION_OPTIONS)} searchable={false} placeholder="— None —" />
            </div>
            <div className="field">
              <label>Counselor</label>
              <input value={form.counselor} onChange={set('counselor')} placeholder="Assign counselor" />
            </div>
          </div>

          <div className="field">
            <label>Remark</label>
            <textarea value={form.remark} onChange={set('remark')} placeholder="Add notes from the call…" />
          </div>
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={save} disabled={!dirty && !saved}>
            {saved ? <><IconCheck size={16} /> Saved</> : 'Save changes'}
          </button>
        </div>
      </aside>
    </>
  )
}
