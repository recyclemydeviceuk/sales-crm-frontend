// Default pipeline stages — seed for the managed "Stages" list.
// Users can rename / recolor / add / remove these from Settings.
export const DEFAULT_STAGES = [
  { id: 'new',            name: 'New',            color: '#7585a0' },
  { id: 'contacted',      name: 'Contacted',      color: '#2a5cd0' },
  { id: 'follow-up',      name: 'Follow-Up',      color: '#e0991f' },
  { id: 'interested',     name: 'Interested',     color: '#16a97d' },
  { id: 'converted',      name: 'Converted',      color: '#2fb84a' },
  { id: 'not-interested', name: 'Not Interested', color: '#e05757' },
]

// Default swatches offered when adding a new stage.
export const STAGE_COLORS = [
  '#7585a0', '#2a5cd0', '#4f7fe6', '#16a97d', '#2fb84a',
  '#e0991f', '#e05757', '#9b59d0', '#d04590', '#0ea5b5',
]

// Detailed call outcomes seen in the source data (fixed options).
export const CALL_STATUS_OPTIONS = ['', 'Connected', 'Not Connected']

export const DISPOSITION_OPTIONS = [
  '',
  'Interested for Seminar',
  'Interested for upcoming webinar',
  'Person is busy and call back',
  'Not responding',
  'Call not connected',
  'Call disconnected after Intro',
  'Switched off',
  'No. out of service/coverage',
  'Language Barrier',
  'Not interested',
]

export const ORIENTATION_OPTIONS = ['', 'Pending', 'Scheduled', 'Interested', 'Attended', 'Not Interested']
