import { useLeads } from '../context/LeadsContext'

export default function StatusBadge({ status }) {
  const { stageMap } = useLeads()
  const color = stageMap[status]?.color || '#7585a0'
  return (
    <span className="badge" style={{ background: color + '1f', color }}>
      <span className="dot" />
      {status}
    </span>
  )
}

export function initials(first = '', last = '') {
  const a = (first || '').trim()[0] || ''
  const b = (last || '').trim()[0] || ''
  return (a + b).toUpperCase() || '·'
}
