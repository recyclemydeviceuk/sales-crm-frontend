import { useMemo, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useLeads } from '../context/LeadsContext'
import StatusBadge, { initials } from '../components/StatusBadge'
import Select from '../components/Select'
import { IconDownload, IconChevronLeft, IconChevronRight, IconLeads } from '../components/Icons'

const withAll = (label, values) => [{ value: '', label }, ...values.map((v) => ({ value: v, label: v }))]

const PER_PAGE = 12

export default function Leads() {
  const { leads, stages, names } = useLeads()
  const { search, openLead } = useOutletContext()
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [college, setCollege] = useState('')
  const [city, setCity] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((l) => {
      if (status && l.status !== status) return false
      if (source && l.source !== source) return false
      if (college && l.college !== college) return false
      if (city && l.city !== city) return false
      if (q) {
        const hay = `${l.firstName} ${l.lastName} ${l.email} ${l.phone} ${l.college} ${l.city}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [leads, search, status, source, college, city])

  useEffect(() => { setPage(1) }, [search, status, source, college, city])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const resetFilters = () => { setStatus(''); setSource(''); setCollege(''); setCity('') }
  const hasFilters = status || source || college || city

  const exportCSV = () => {
    const cols = ['First Name', 'Last Name', 'Phone', 'Email', 'City', 'College', 'Source', 'Stage', 'Call Status', 'Disposition', 'Counselor', 'Remark']
    const rows = filtered.map((l) => [
      l.firstName, l.lastName, l.phone, l.email, l.city, l.college, l.source,
      l.status, l.callStatus, l.callDisposition, l.counselor, l.remark,
    ])
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [cols, ...rows].map((r) => r.map(esc).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'leads-export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const pageButtons = useMemo(() => {
    const out = []
    const span = 2
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= current - span && i <= current + span)) out.push(i)
      else if (out[out.length - 1] !== '…') out.push('…')
    }
    return out
  }, [pages, current])

  return (
    <>
      <div className="toolbar">
        <Select variant="filter" ariaLabel="Filter by stage" value={status} onChange={setStatus}
          options={withAll('All stages', stages.map((s) => s.name))} />
        <Select variant="filter" ariaLabel="Filter by source" value={source} onChange={setSource}
          options={withAll('All sources', names('sources'))} />
        <Select variant="filter" ariaLabel="Filter by college" value={college} onChange={setCollege}
          options={withAll('All colleges', names('colleges'))} />
        <Select variant="filter" ariaLabel="Filter by city" value={city} onChange={setCity}
          options={withAll('All cities', names('cities'))} />
        {hasFilters && <button className="btn btn-subtle btn-sm" onClick={resetFilters}>Clear</button>}
        <div className="grow" />
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
          <IconDownload size={16} /> Export CSV
        </button>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>{filtered.length.toLocaleString()} {filtered.length === 1 ? 'lead' : 'leads'}</h3>
          <span className="sub">{search ? `Matching “${search}”` : 'Click a lead to view & update'}</span>
        </div>

        {slice.length === 0 ? (
          <div className="empty">
            <div className="em-icon"><IconLeads size={24} /></div>
            <h3>No leads found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="leads">
                <thead>
                  <tr>
                    <th>Lead</th><th>Phone</th><th>College</th><th>City</th><th>Source</th><th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((l) => (
                    <tr key={l.id} onClick={() => openLead(l.id)}>
                      <td>
                        <div className="lead-cell">
                          <div className="lead-avatar">{initials(l.firstName, l.lastName)}</div>
                          <div>
                            <div className="lead-name">{`${l.firstName} ${l.lastName}`.trim() || 'Unnamed'}</div>
                            <div className="lead-sub">{l.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="cell-strong">{l.phone ? `+${l.countryCode} ${l.phone}` : '—'}</td>
                      <td className="cell-muted">{l.college || '—'}</td>
                      <td className="cell-muted">{l.city || '—'}</td>
                      <td className="cell-muted">{l.source || '—'}</td>
                      <td><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span>
                Showing {(current - 1) * PER_PAGE + 1}–{Math.min(current * PER_PAGE, filtered.length)} of {filtered.length.toLocaleString()}
              </span>
              <div className="pager">
                <button disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous">
                  <IconChevronLeft size={16} />
                </button>
                {pageButtons.map((p, i) =>
                  p === '…'
                    ? <span key={`e${i}`} style={{ padding: '0 4px', color: 'var(--faint)' }}>…</span>
                    : <button key={p} className={p === current ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>,
                )}
                <button disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next">
                  <IconChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
