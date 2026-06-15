// Minimal line icons (stroke = currentColor). Keeps the UI dependency-free.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Icon = ({ path, size = 18, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>
    {path}
  </svg>
)

export const IconDashboard = (p) => (
  <Icon {...p} path={<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>} />
)
export const IconLeads = (p) => (
  <Icon {...p} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />
)
export const IconPipeline = (p) => (
  <Icon {...p} path={<><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></>} />
)
export const IconSettings = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>} />
)
export const IconSearch = (p) => (
  <Icon {...p} path={<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>} />
)
export const IconPlus = (p) => (
  <Icon {...p} path={<><path d="M12 5v14M5 12h14" /></>} />
)
export const IconClose = (p) => (
  <Icon {...p} path={<><path d="M18 6 6 18M6 6l12 12" /></>} />
)
export const IconPhone = (p) => (
  <Icon {...p} path={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />} />
)
export const IconMail = (p) => (
  <Icon {...p} path={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>} />
)
export const IconPin = (p) => (
  <Icon {...p} path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>} />
)
export const IconBuilding = (p) => (
  <Icon {...p} path={<><path d="M3 21h18" /><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" /><path d="M19 21V11a2 2 0 0 0-2-2h-2" /><path d="M9 7h2M9 11h2M9 15h2" /></>} />
)
export const IconSource = (p) => (
  <Icon {...p} path={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>} />
)
export const IconCalendar = (p) => (
  <Icon {...p} path={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />
)
export const IconCheck = (p) => (
  <Icon {...p} path={<path d="M20 6 9 17l-5-5" />} />
)
export const IconTrend = (p) => (
  <Icon {...p} path={<><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7h-5M21 7v5" /></>} />
)
export const IconTarget = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>} />
)
export const IconSpark = (p) => (
  <Icon {...p} path={<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />} />
)
export const IconUser = (p) => (
  <Icon {...p} path={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />
)
export const IconClock = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />
)
export const IconChevronLeft = (p) => (
  <Icon {...p} path={<path d="m15 18-6-6 6-6" />} />
)
export const IconChevronDown = (p) => (
  <Icon {...p} path={<path d="m6 9 6 6 6-6" />} />
)
export const IconChevronRight = (p) => (
  <Icon {...p} path={<path d="m9 18 6-6-6-6" />} />
)
export const IconDownload = (p) => (
  <Icon {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>} />
)
export const IconNote = (p) => (
  <Icon {...p} path={<><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /><path d="M9 13h6M9 17h4" /></>} />
)
