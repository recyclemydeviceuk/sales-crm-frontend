import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useLeads } from '../context/LeadsContext'
import { initials } from '../components/StatusBadge'
import { IconPhone, IconBuilding, IconChevronLeft, IconChevronRight } from '../components/Icons'

const PAGE = 25

export default function Pipeline() {
  const { leads, stages, updateLead } = useLeads()
  const { openLead } = useOutletContext()

  const boardRef = useRef(null)
  const [counts, setCounts] = useState({})
  const [dragId, setDragId] = useState(null)
  const [overCol, setOverCol] = useState(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const columns = useMemo(() => {
    const map = Object.fromEntries(stages.map((s) => [s.name, []]))
    const fallback = stages[0]?.name
    for (const l of leads) (map[l.status] || map[fallback]).push(l)
    return stages.map((s) => ({ ...s, items: map[s.name] || [] }))
  }, [leads, stages])

  /* ---- horizontal scroll arrows ---- */
  const updateArrows = () => {
    const el = boardRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }
  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [stages])

  const scrollBoard = (dir) => boardRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })

  /* ---- infinite scroll per column ---- */
  const visibleCount = (col) => counts[col.id] ?? PAGE
  const onColScroll = (e, col) => {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 90) {
      setCounts((c) => {
        const cur = c[col.id] ?? PAGE
        if (cur >= col.items.length) return c
        return { ...c, [col.id]: Math.min(cur + PAGE, col.items.length) }
      })
    }
  }

  /* ---- drag & drop to change stage ---- */
  const onDragStart = (e, lead) => {
    setDragId(lead.id)
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', String(lead.id)) } catch { /* noop */ }
  }
  const onDragEnd = () => { setDragId(null); setOverCol(null) }
  const onDragOver = (e, name) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overCol !== name) setOverCol(name)
  }
  const onDrop = (e, name) => {
    e.preventDefault()
    const id = dragId ?? e.dataTransfer.getData('text/plain')
    const lead = leads.find((l) => l.id === id)
    if (lead && lead.status !== name) updateLead(id, { status: name })
    setDragId(null)
    setOverCol(null)
  }

  return (
    <>
      <div className="board-bar">
        <span className="board-hint">Drag a card to move it between stages</span>
        <div className="board-arrows">
          <button className="board-arrow" onClick={() => scrollBoard(-1)} disabled={atStart} aria-label="Scroll left">
            <IconChevronLeft size={18} />
          </button>
          <button className="board-arrow" onClick={() => scrollBoard(1)} disabled={atEnd} aria-label="Scroll right">
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="board" ref={boardRef} onScroll={updateArrows}>
        {columns.map((col) => {
          const shown = col.items.slice(0, visibleCount(col))
          return (
            <div className="board-col" key={col.id}>
              <div className="board-col-head">
                <span className="col-bar" style={{ background: col.color }} />
                <span className="ttl">{col.name}</span>
                <span className="count">{col.items.length.toLocaleString()}</span>
              </div>
              <div
                className={`board-list ${overCol === col.name ? 'drag-over' : ''}`}
                onScroll={(e) => onColScroll(e, col)}
                onDragOver={(e) => onDragOver(e, col.name)}
                onDrop={(e) => onDrop(e, col.name)}
              >
                {col.items.length === 0 && <div className="board-empty">Drop leads here</div>}
                {shown.map((l) => (
                  <div
                    className={`kanban-card ${dragId === l.id ? 'dragging' : ''}`}
                    key={l.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, l)}
                    onDragEnd={onDragEnd}
                    onClick={() => openLead(l.id)}
                  >
                    <div className="kc-top">
                      <div className="lead-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {initials(l.firstName, l.lastName)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="kc-name">{`${l.firstName} ${l.lastName}`.trim() || 'Unnamed'}</div>
                        <div className="kc-meta">{l.source || '—'}</div>
                      </div>
                    </div>
                    {l.college && (
                      <div className="kc-row">
                        <IconBuilding size={13} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.college}</span>
                      </div>
                    )}
                    {l.phone && (
                      <div className="kc-row">
                        <IconPhone size={13} />
                        <span>+{l.countryCode} {l.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
                {col.items.length > shown.length && (
                  <div className="board-foot">Showing {shown.length} of {col.items.length.toLocaleString()} · scroll for more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
