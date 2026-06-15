# Sales CRM — Lead Management

A minimal, spacious lead-management CRM. **React + Vite** frontend (navy-blue & white theme),
**Node + Express + MongoDB (Mongoose)** backend. Seeded with the Hyderabad team's contact
list (4,248 leads imported from the source spreadsheet).

## Features

- **Dashboard** — KPIs (total / contacted / interested / conversion), pipeline-by-stage bars, lead-source breakdown, and a priority queue of warm leads.
- **Leads** — searchable, filterable table (stage, source, college, city) with pagination and CSV export. Click any lead to open a detail drawer.
- **Lead drawer** — view contact info and update the lead stage, call status, disposition, orientation, counselor, call date, and remarks.
- **Pipeline** — drag-and-drop Kanban with per-column infinite scroll and horizontal navigation.
- **Settings** — manage every dropdown list (stages / sources / colleges / cities) with full CRUD; profile; reset-to-imported-data.

Everything is **dynamic from the backend** — leads, lists and settings live in MongoDB and every
change is persisted via the REST API.

## Quick start

The app has two parts: the API (`server/`) and the web app (root). Run both.

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # then paste your MongoDB Atlas URI into MONGODB_URI
npm run seed                # loads all 4,248 leads + lists into the database
npm run dev                 # API on http://localhost:4000
```

**MongoDB connection** — set `MONGODB_URI` in `server/.env`:

- **Atlas:** `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/sales-crm`
- **Local:** `mongodb://127.0.0.1:27017/sales-crm`
- **Leave it blank** → the server boots an embedded MongoDB (persisted in `server/data`) so it
  runs with zero setup. Great for a quick look; switch to Atlas/local for real use.

The server auto-seeds on first boot if the database is empty, so `npm run seed` is only needed
to force a re-import.

### 2. Frontend

```bash
# from the project root
npm install
npm run dev                 # web app on http://localhost:5173
```

Vite proxies `/api` → `http://localhost:4000`, so no CORS setup is needed in dev.
From the root you can also run `npm run server` (starts the API) and `npm run seed`.

## REST API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/leads` | List leads — `?status=&source=&college=&city=&search=&page=&limit=` or `?all=1` |
| POST | `/api/leads` | Create a lead |
| GET/PATCH/DELETE | `/api/leads/:id` | Read / update / delete a lead |
| POST | `/api/leads/reset` | Re-import the original lead list |
| GET | `/api/stats` | Dashboard aggregates (by stage, by source, rates) |
| GET | `/api/lists` | All managed lists grouped (stages/sources/colleges/cities) |
| POST | `/api/lists/:type` | Add an option |
| PATCH | `/api/lists/:type/:id` | Rename / recolor — **renames cascade onto leads** |
| DELETE | `/api/lists/:type/:id` | Remove (deleting a stage reassigns its leads) |
| POST | `/api/lists/:type/reset` | Restore default options |
| GET/PUT | `/api/settings` | Workspace profile |

## Tech

- **Frontend:** React 18, React Router 6, Vite 5, plain CSS (theme tokens in `src/index.css`).
- **Backend:** Node, Express 4, Mongoose 8, MongoDB. Embedded `mongodb-memory-server` fallback for zero-config dev.

## Project structure

```
src/                     # frontend
  components/   Sidebar, Topbar, Layout, LeadDrawer, AddLeadModal, ListManager, Select, …
  pages/        Dashboard, Leads, Pipeline, Settings
  context/      LeadsContext (fetches from the API, holds app state)
  api.js        REST client
  data/         leads.json + meta.json (seed source for the backend)
server/                  # backend
  src/
    models/     Lead, ListItem, Setting, Counter
    routes/     leads, lists, settings, stats
    db.js       Mongo connection (+ embedded fallback)
    seedData.js seeds from ../../src/data/*.json
    index.js    entry
```

## Re-importing the spreadsheet

`src/data/leads.json` / `meta.json` were generated from `TEAM_Hyderabad_All_Contacts.xlsx`.
To refresh, regenerate those files, then run `npm run seed` to reload the database.
