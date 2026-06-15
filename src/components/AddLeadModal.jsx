import { useEffect, useState } from 'react'
import { useLeads } from '../context/LeadsContext'
import Select from './Select'
import { IconClose } from './Icons'

const EMPTY = {
  firstName: '', lastName: '', phone: '', countryCode: '91', email: '',
  city: '', college: '', source: '', program: '', status: '',
}

export default function AddLeadModal({ onClose }) {
  const { addLead, stages, names } = useLeads()
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    source: names('sources').find((s) => /website/i.test(s)) || names('sources')[0] || '',
    status: stages[0]?.name || '',
  }))
  const [err, setErr] = useState('')

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setVal = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.firstName.trim() && !form.lastName.trim()) return setErr('Please enter a name.')
    if (!form.phone.trim() && !form.email.trim()) return setErr('Add a phone number or email.')
    addLead(form)
    onClose()
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-label="Add lead">
        <div className="modal-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Add new lead</h2>
            <p>Create a lead and start tracking it through your pipeline.</p>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close"><IconClose size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field">
              <label>First name *</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="e.g. Bhanu" autoFocus />
            </div>
            <div className="field">
              <label>Last name</label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="e.g. Prakash" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={set('phone')} placeholder="9182820698" />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={set('email')} placeholder="name@email.com" />
            </div>
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

          <div className="field-row">
            <div className="field">
              <label>Interested program</label>
              <input value={form.program} onChange={set('program')} placeholder="e.g. MBBS, USMLE" />
            </div>
            <div className="field">
              <label>Initial stage</label>
              <Select value={form.status} onChange={setVal('status')} options={stages.map((s) => s.name)} searchable={false} />
            </div>
          </div>

          {err && <div style={{ color: 'var(--st-lost-fg)', fontSize: 13, fontWeight: 500 }}>{err}</div>}
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create lead</button>
        </div>
      </div>
    </>
  )
}
