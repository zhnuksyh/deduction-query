# Deductive Query

A browser-based mystery deduction game where you play a data analyst for the
**Bureau of Digital Forensics (B.D.F.)**. Field agents upload physical evidence,
interviews, and timelines into relational databases — you sit at a terminal and
write **raw SQL** to cross-reference alibis, spot timeline impossibilities, and
crack the case.

You can't guess your way to a solution. You have to query the facts and find the
logical flaw hiding in the tables.

> Inspired by [SQL Noir](https://www.sqlnoir.com/) and the
> [SQL Murder Mystery](https://mystery.knightlab.com/).

## Core pillars

- **Deduction through SQL.** Every answer is provable with a `SELECT`; nothing is
  solvable by guessing.
- **Zero setup.** No database install, no backend, no hosting cost. The SQLite
  engine is compiled to WebAssembly and runs entirely in the browser.
- **Airtight mysteries.** Cases are built on classic tropes — timeline
  inconsistencies, physical impossibilities, forensic mismatches — made legible
  through queries.

## How it plays

1. **Main Menu** → **Level Select** (a filing-cabinet carousel of case files) →
   the four-tab case workspace.
2. Inside a case:
   - **Crime Scene** — the narrative report and forensic constraints.
   - **Case Board** — an interactive ERD of the case database (tables, columns,
     foreign-key relationships).
   - **Analysis** — a CodeMirror SQL editor over the case database, a results
     grid, and an auto-saving detective's notebook.
   - **Report Card** — a fill-in-the-blank deduction. Each blank stays locked
     until you run the query that proves it, then submit to close the case and
     unlock the next.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite (static export) |
| Styling | Tailwind CSS (deep charcoal base, crimson accent) |
| DB engine | [sql.js](https://github.com/sql-js/sql.js) — SQLite compiled to WebAssembly |
| SQL editor | [CodeMirror 6](https://codemirror.net/) |
| Data grid | [TanStack Table](https://tanstack.com/table) |
| Icons | [lucide-react](https://lucide.dev/) |

Everything is fully client-side, so it deploys to any static host (GitHub Pages,
Netlify, Vercel).

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

> On Windows, run these from PowerShell — some dependency post-install scripts
> (esbuild, sql.js) need `node` on the PATH.

## Project structure

```
src/
  assets/         static art (main-menu background)
  cases/          case data — one file per case, plus _TEMPLATE.md
  components/     tab UIs, table, dropdown, tab bar, stamp
  engine/         sql.js runtime, verification matrix, save system, error hints
  screens/        Main Menu, Level Select, Options, Credits, Game Dashboard
  state/          top-level game state hook
```

## Authoring a new case

Cases are pure data. `src/cases/_TEMPLATE.md` is a design form covering
everything a case needs: identity, the crime-scene narrative, the database
schema and seed rows (with the single planted contradiction that makes it
solvable), and the Report Card blanks with their unlock triggers. Fill it in,
add a `caseNN.js`, and register it in `src/cases/index.js`.

## Credits

- Concept & design — Deductive Query team
- Main menu art — Rebecca Hu, Illustrator & Concept Artist
- Inspired by **SQL Noir** and the **SQL Murder Mystery**
- Built on sql.js, CodeMirror, TanStack Table, React, Vite, and Tailwind CSS

All cases, suspects, and forensic data are entirely fictional.
