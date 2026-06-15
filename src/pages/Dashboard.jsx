import { useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useLeads } from '../context/LeadsContext'
import StatusBadge, { initials } from '../components/StatusBadge'
import {
  IconLeads, IconPhone, IconSpark, IconTarget, IconTrend, IconChevronRight,
} from '../components/Icons'

function Donut({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const R = 54, C = 2 * Math.PI * R
  let offset = 0
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line-soft)" strokeWidth="18" />
      {segments.map((s, i) => {
        const len = (s.value / total) * C
        const dash = `${len} ${C - len}`
        const el = (
          <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color}
            strokeWidth="18" strokeDasharray={dash} strokeDashoffset={-offset}
            strokeLinecap="butt" transform="rotate(-90 70 70)" />
        )
        offset += len
        return el
      })}
      <text x="70" y="65" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--ink)">{total.toLocaleString()}</text>
      <text x="70" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--muted)" letterSpacing="0.5">LEADS</text>
    </svg>
  )
}

export default function Dashboard() {
  const { leads, stats, stages } = useLeads()
  const { openLead } = useOutletContext()
  const navigate = useNavigate()

  const maxStage = Math.max(1, ...stages.map((s) => stats.byStatus[s.name] || 0))

  const sources = useMemo(() => {
    const palette = ['#0f2452', '#2a5cd0', '#4f7fe6', '#16a97d', '#e0991f', '#94a3b8']
    return Object.entries(stats.bySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  }, [stats.bySource])

  const priority = useMemo(
    () => leads.filter((l) => l.status === 'Interested' || l.status === 'Follow-Up').slice(0, 6),
    [leads],
  )

  const kpis = [
    { label: 'Total Leads', value: stats.total.toLocaleString(), icon: IconLeads, bg: 'var(--st-contacted-bg)', fg: 'var(--navy-500)', foot: `Across ${Object.keys(stats.bySource).length} sources` },
    { label: 'Contacted', value: stats.contacted.toLocaleString(), icon: IconPhone, bg: '#e3f6ef', fg: 'var(--st-interested-fg)', foot: `${stats.contactRate}% of all leads`, trend: 'up' },
    { label: 'Interested', value: stats.interested.toLocaleString(), icon: IconSpark, bg: '#fff3df', fg: 'var(--st-follow-fg)', foot: 'Warm + converted' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: IconTarget, bg: '#e4f7e6', fg: 'var(--st-converted-fg)', foot: 'Of contacted leads' },
  ]

  return (
    <>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">
              <div>
                <div className="kpi-label">{k.label}</div>
              </div>
              <div className="kpi-icon" style={{ background: k.bg, color: k.fg }}>
                <k.icon size={20} />
              </div>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-foot">
              {k.trend && <IconTrend size={14} className="kpi-trend up" />}
              <span>{k.foot}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Pipeline by stage</h3>
            <span className="sub">{stats.total.toLocaleString()} total</span>
          </div>
          <div className="card-pad">
            {stages.map((s) => {
              const v = stats.byStatus[s.name] || 0
              return (
                <div className="bar-row" key={s.id}>
                  <div className="bar-label">
                    <span className="col-bar" style={{ background: s.color }} />
                    {s.name}
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(v / maxStage) * 100}%`, background: s.color }} />
                  </div>
                  <div className="bar-val">{v.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Lead sources</h3></div>
          <div className="card-pad">
            <div className="donut-wrap">
              <Donut segments={sources} />
              <div className="donut-legend">
                {sources.map((s) => (
                  <div className="legend-item" key={s.name}>
                    <span className="lg-dot" style={{ background: s.color }} />
                    <span className="lg-name">{s.name.length > 22 ? s.name.slice(0, 21) + '…' : s.name}</span>
                    <span className="lg-val">{s.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-head">
          <div>
            <h3>Priority queue</h3>
            <span className="sub">Interested &amp; follow-up leads that need action</span>
          </div>
          <button className="btn btn-subtle btn-sm" onClick={() => navigate('/leads')}>
            View all <IconChevronRight size={15} />
          </button>
        </div>
        {priority.length === 0 ? (
          <div className="empty">
            <div className="em-icon"><IconSpark size={24} /></div>
            <h3>No warm leads yet</h3>
            <p>Update lead statuses to build your priority queue.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="leads">
              <thead>
                <tr>
                  <th>Lead</th><th>College</th><th>Phone</th><th>Stage</th><th>Source</th>
                </tr>
              </thead>
              <tbody>
                {priority.map((l) => (
                  <tr key={l.id} onClick={() => openLead(l.id)}>
                    <td>
                      <div className="lead-cell">
                        <div className="lead-avatar">{initials(l.firstName, l.lastName)}</div>
                        <div>
                          <div className="lead-name">{`${l.firstName} ${l.lastName}`.trim() || 'Unnamed'}</div>
                          <div className="lead-sub">{l.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-muted">{l.college || '—'}</td>
                    <td className="cell-strong">{l.phone ? `+${l.countryCode} ${l.phone}` : '—'}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td className="cell-muted">{l.source || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
