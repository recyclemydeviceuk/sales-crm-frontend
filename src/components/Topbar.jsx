import { IconSearch, IconPlus } from './Icons'

export default function Topbar({ title, subtitle, query, onQuery, onAdd }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="page-sub">{subtitle}</div>}
      </div>
      <div className="topbar-spacer" />
      <div className="search-box">
        <IconSearch size={17} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search leads by name, phone, email…"
        />
      </div>
      <button className="btn btn-primary" onClick={onAdd}>
        <IconPlus size={17} />
        Add Lead
      </button>
    </header>
  )
}
