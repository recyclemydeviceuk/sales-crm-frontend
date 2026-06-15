import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import LeadDrawer from './LeadDrawer'
import AddLeadModal from './AddLeadModal'

const PAGE_META = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your lead performance' },
  '/leads': { title: 'Leads', subtitle: 'Manage, filter and update every lead' },
  '/pipeline': { title: 'Pipeline', subtitle: 'Track leads by stage' },
  '/settings': { title: 'Settings', subtitle: 'Workspace preferences' },
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const meta = PAGE_META[location.pathname] || { title: 'Navis CRM', subtitle: '' }

  const handleQuery = (q) => {
    setSearch(q)
    if (location.pathname !== '/leads') navigate('/leads')
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          query={search}
          onQuery={handleQuery}
          onAdd={() => setAddOpen(true)}
        />
        <main className="content">
          <Outlet context={{ search, setSearch, openLead: setSelectedId, openAdd: () => setAddOpen(true) }} />
        </main>
      </div>

      {selectedId != null && (
        <LeadDrawer leadId={selectedId} onClose={() => setSelectedId(null)} />
      )}
      {addOpen && <AddLeadModal onClose={() => setAddOpen(false)} />}
    </div>
  )
}
