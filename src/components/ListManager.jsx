import { useMemo, useState } from 'react'
import { STAGE_COLORS } from '../data/constants'
import { IconPlus, IconClose, IconCheck, IconSearch, IconNote } from './Icons'

function Row({ item, hasColor, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)

  const commit = () => {
    const n = name.trim()
    if (n && n !== item.name) onUpdate(item.id, { name: n })
    else setName(item.name)
    setEditing(false)
  }

  return (
    <div className="lm-row">
      {hasColor && (
        <input
          type="color"
          className="lm-color"
          value={item.color || '#7585a0'}
          onChange={(e) => onUpdate(item.id, { color: e.target.value })}
          title="Change colour"
        />
      )}
      {editing ? (
        <input
          className="lm-edit"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') { setName(item.name); setEditing(false) }
          }}
          onBlur={commit}
        />
      ) : (
        <button className="lm-name" onClick={() => setEditing(true)} title="Click to rename">
          {item.name}
        </button>
      )}
      <div className="lm-actions">
        {editing ? (
          <button className="lm-icon" onMouseDown={(e) => e.preventDefault()} onClick={commit} title="Save">
            <IconCheck size={15} />
          </button>
        ) : (
          <button className="lm-icon danger" onClick={() => onRemove(item.id)} title="Delete">
            <IconClose size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function ListManager({ items, hasColor, onAdd, onUpdate, onRemove, addPlaceholder, singular }) {
  const [draft, setDraft] = useState('')
  const [color, setColor] = useState(STAGE_COLORS[1])
  const [query, setQuery] = useState('')
  const [err, setErr] = useState('')

  const add = () => {
    const n = draft.trim()
    if (!n) return
    const ok = onAdd(n, hasColor ? { color } : {})
    if (ok === false) { setErr(`“${n}” already exists.`); return }
    setDraft('')
    setErr('')
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items
  }, [items, query])

  return (
    <div className="lm">
      <div className="lm-add">
        {hasColor && (
          <input type="color" className="lm-color" value={color} onChange={(e) => setColor(e.target.value)} title="Pick a colour" />
        )}
        <input
          className="lm-input"
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setErr('') }}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={addPlaceholder || `Add ${singular || 'item'}…`}
        />
        <button className="btn btn-primary btn-sm" onClick={add}><IconPlus size={16} /> Add</button>
      </div>
      {err && <div className="lm-err">{err}</div>}

      {items.length > 7 && (
        <div className="lm-search">
          <IconSearch size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${items.length} ${singular || 'item'}s…`} />
        </div>
      )}

      <div className="lm-list">
        {filtered.length === 0 ? (
          <div className="lm-empty"><IconNote size={20} /><span>{query ? 'No matches' : 'Nothing here yet'}</span></div>
        ) : (
          filtered.map((it) => (
            <Row key={it.id} item={it} hasColor={hasColor} onUpdate={onUpdate} onRemove={onRemove} />
          ))
        )}
      </div>
    </div>
  )
}
