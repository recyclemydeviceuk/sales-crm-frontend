import { useState } from 'react'
import { useLeads } from '../context/LeadsContext'
import ListManager from '../components/ListManager'
import { IconCheck, IconPipeline, IconSource, IconBuilding, IconPin } from '../components/Icons'

const TABS = [
  { key: 'stages', label: 'Stages', singular: 'stage', icon: IconPipeline, hasColor: true, hint: 'Pipeline stages. Renaming or deleting a stage updates every lead that uses it.' },
  { key: 'sources', label: 'Sources', singular: 'source', icon: IconSource, hint: 'Where leads come from (Website, Meta Ads, Referral…).' },
  { key: 'colleges', label: 'Colleges', singular: 'college', icon: IconBuilding, hint: 'Colleges leads are associated with.' },
  { key: 'cities', label: 'Cities', singular: 'city', icon: IconPin, hint: 'Cities used across leads.' },
]

export default function Settings() {
  const { settings, setSettings, stats, resetData, lists, addListItem, updateListItem, removeListItem, resetList } = useLeads()
  const [counselor, setCounselor] = useState(settings.counselor || '')
  const [org, setOrg] = useState(settings.org || '')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('stages')

  const save = () => {
    setSettings({ counselor: counselor.trim() || 'Counselor', org: org.trim() || 'Team' })
    setSaved(true)
    setTimeout(() => setSaved(false), 1400)
  }

  const reset = () => {
    if (window.confirm('Reset all leads to the original imported data? Your status changes will be lost.')) {
      resetData()
    }
  }

  const active = TABS.find((t) => t.key === tab)

  return (
    <div style={{ maxWidth: 820 }}>
      {/* ---------- Manage lists ---------- */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <div>
            <h3>Manage lists</h3>
            <span className="sub">Create, rename and remove the options used across every dropdown.</span>
          </div>
        </div>
        <div className="card-pad">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                <t.icon size={16} />
                {t.label}
                <span className="tab-count">{lists[t.key].length}</span>
              </button>
            ))}
          </div>

          <div className="lm-head">
            <p className="lm-hint">{active.hint}</p>
            <button className="btn btn-subtle btn-sm" onClick={() => {
              if (window.confirm(`Reset ${active.label.toLowerCase()} to the original imported list?`)) resetList(tab)
            }}>Reset to default</button>
          </div>

          <ListManager
            key={tab}
            items={lists[tab]}
            hasColor={active.hasColor}
            singular={active.singular}
            addPlaceholder={`Add ${active.singular}…`}
            onAdd={(name, extra) => addListItem(tab, name, extra)}
            onUpdate={(id, changes) => updateListItem(tab, id, changes)}
            onRemove={(id) => removeListItem(tab, id)}
          />
        </div>
      </div>

      {/* ---------- Profile ---------- */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><h3>Profile</h3></div>
        <div className="card-pad">
          <div className="set-grid">
            <div>
              <div className="st-h">Counselor</div>
              <div className="st-d">Shown across the workspace and used as the default assignee.</div>
            </div>
            <div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Your name</label>
                <input value={counselor} onChange={(e) => setCounselor(e.target.value)} placeholder="e.g. Priya Sharma" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Team / Organization</label>
                <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="e.g. Hyderabad Team" />
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={save}>
                  {saved ? <><IconCheck size={16} /> Saved</> : 'Save profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Data ---------- */}
      <div className="card">
        <div className="card-head"><h3>Data</h3></div>
        <div className="card-pad">
          <div className="set-row" style={{ paddingTop: 0 }}>
            <div className="flex items-center" style={{ justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div className="st-h">Lead database</div>
                <div className="st-d">{stats.total.toLocaleString()} leads stored locally in this browser.</div>
              </div>
              <span className="tag">Saved in browser</span>
            </div>
          </div>
          <div className="set-row">
            <div className="flex items-center" style={{ justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div className="st-h">Reset to imported data</div>
                <div className="st-d">Restore the original lead list. Status updates will be discarded.</div>
              </div>
              <button className="btn btn-danger" onClick={reset}>Reset data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
