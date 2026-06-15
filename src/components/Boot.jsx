// Full-screen states shown while the app talks to the backend.

export function BootScreen() {
  return (
    <div className="boot">
      <div className="boot-card">
        <div className="boot-mark">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 19V7l6 7 6-7v12" />
          </svg>
        </div>
        <div className="boot-spinner" />
        <div className="boot-title">Loading Sales CRM…</div>
        <div className="boot-sub">Fetching leads from the database</div>
      </div>
    </div>
  )
}

export function ErrorScreen({ error, onRetry }) {
  return (
    <div className="boot">
      <div className="boot-card">
        <div className="boot-mark err">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <div className="boot-title">Can’t reach the backend</div>
        <div className="boot-sub">{error}</div>
        <div className="boot-hint">
          Start it with <code>cd server &amp;&amp; npm run dev</code>
        </div>
        <button className="btn btn-primary" onClick={onRetry} style={{ marginTop: 18 }}>Retry</button>
      </div>
    </div>
  )
}
