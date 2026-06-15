import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconChevronDown, IconCheck, IconSearch, IconPlus } from './Icons'

const normalize = (options) =>
  options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))

/**
 * Searchable dropdown. Drop-in replacement for <select>.
 * - searchable: show a filter input (default true)
 * - creatable: allow choosing a typed value not present in options
 * - variant: 'field' (full-width form control) | 'filter' (compact pill)
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  searchable = true,
  creatable = false,
  variant = 'field',
  ariaLabel,
}) {
  const opts = normalize(options)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [rect, setRect] = useState(null)
  const [above, setAbove] = useState(false)

  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  const selected = opts.find((o) => o.value === value)
  const display = selected ? selected.label : creatable && value ? value : ''

  const q = query.trim().toLowerCase()
  const filtered = q ? opts.filter((o) => o.label.toLowerCase().includes(q)) : opts
  const showCreate =
    creatable && query.trim() && !opts.some((o) => o.label.toLowerCase() === q)
  const items = showCreate
    ? [...filtered, { value: query.trim(), label: query.trim(), __create: true }]
    : filtered

  const measure = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - r.bottom
    setAbove(spaceBelow < 300 && r.top > spaceBelow)
    setRect({ top: r.top, bottom: r.bottom, left: r.left, width: r.width })
  }

  useLayoutEffect(() => {
    if (!open) return
    measure()
    const onScroll = () => measure()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus()
  }, [open, searchable])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        close()
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const close = () => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }

  const choose = (opt) => {
    if (!opt) return
    onChange(opt.value)
    close()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(items[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  const panelWidth = rect ? Math.max(rect.width, 240) : 240
  const panelLeft = rect
    ? Math.max(8, Math.min(rect.left, window.innerWidth - panelWidth - 8))
    : 0

  return (
    <div className={`sel ${variant === 'filter' ? 'filter-w' : 'field-w'}`}>
      <button
        type="button"
        ref={triggerRef}
        className={`sel-trigger ${open ? 'open' : ''}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`sel-text ${display ? '' : 'placeholder'}`}>{display || placeholder}</span>
        <IconChevronDown size={16} className="sel-chev" />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            className="sel-panel"
            style={{
              left: panelLeft,
              width: panelWidth,
              ...(above
                ? { bottom: window.innerHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
            }}
          >
            {searchable && (
              <div className="sel-search-wrap">
                <IconSearch size={15} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search…"
                />
              </div>
            )}
            <div className="sel-list" ref={listRef}>
              {items.length === 0 && <div className="sel-empty">No matches</div>}
              {items.map((o, i) => (
                <div
                  key={(o.__create ? 'create-' : '') + o.value + i}
                  data-idx={i}
                  className={`sel-option ${i === active ? 'active' : ''} ${
                    o.__create ? 'sel-create' : ''
                  } ${!o.__create && o.value === value ? 'selected' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                >
                  {o.__create && <IconPlus size={15} />}
                  <span className="so-label">
                    {o.__create ? `Use “${o.label}”` : o.label}
                  </span>
                  {!o.__create && o.value === value && <IconCheck size={15} className="so-check" />}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
