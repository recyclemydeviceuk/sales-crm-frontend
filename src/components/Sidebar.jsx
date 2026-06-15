import { NavLink } from 'react-router-dom'
import { useLeads } from '../context/LeadsContext'
import {
  IconDashboard, IconLeads, IconPipeline, IconSettings, IconSpark,
} from './Icons'

const nav = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: IconLeads, badgeKey: 'total' },
  { to: '/pipeline', label: 'Pipeline', icon: IconPipeline },
]

export default function Sidebar() {
  const { stats, settings } = useLeads()
  const counselor = settings.counselor || 'Counselor'
  const init = counselor.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <aside className="sidebar">
      <div className="brand">
        <div>
          <div className="brand-name">Sales CRM</div>
          <div className="brand-sub">Lead Management</div>
        </div>
      </div>

      <div className="nav-label">Menu</div>
      {nav.map(({ to, label, icon: Ic, badgeKey, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Ic size={19} />
          <span>{label}</span>
          {badgeKey && <span className="nav-badge">{stats[badgeKey].toLocaleString()}</span>}
        </NavLink>
      ))}

      <div className="nav-label">Workspace</div>
      <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <IconSettings size={19} />
        <span>Settings</span>
      </NavLink>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{init || 'CN'}</div>
          <div>
            <div className="nm">{counselor}</div>
            <div className="rl">{settings.org || 'Counselor'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
