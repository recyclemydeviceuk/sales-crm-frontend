import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { LeadsProvider } from './context/LeadsContext'
import { BootScreen } from './components/Boot'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Pipeline from './pages/Pipeline'
import Settings from './pages/Settings'

// Gate the whole app behind a valid session. Data (LeadsProvider) only
// loads once authenticated.
function Protected() {
  const { ready, token } = useAuth()
  if (!ready) return <BootScreen />
  if (!token) return <Navigate to="/login" replace />
  return (
    <LeadsProvider>
      <Layout />
    </LeadsProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
