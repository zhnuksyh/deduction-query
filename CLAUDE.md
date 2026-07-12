# CLAUDE.md

Instructions for working in this repository.

## Git Workflow

- **Always make atomic commits.** Each commit should represent one logical, self-contained change. Do not bundle unrelated changes into a single commit.
- **Never add a co-author.** Do not add `Co-Authored-By` trailers or any co-author attribution to commit messages.
- **No pull requests.** Commit and push directly to the branch. Do not open PRs.

## Project: Deductive Query

A browser-based mystery deduction game where players write raw SQL queries to solve
forensic cases as a data analyst for the Bureau of Digital Forensics (B.D.F.).

### Core Pillars
- Players cannot guess their way to a solution — they must query the facts and find logical flaws in relational tables.
- Fully client-side, zero-barrier: no backend, no DB install. $0 hosting.
- Cases built on classic mystery tropes (timeline inconsistencies, physical impossibilities, forensic mismatch) made legible through SQL.

### Tech Stack
- **Frontend:** React / Next.js (static export)
- **DB Engine:** sql.js (SQLite compiled to WebAssembly)
- **Editor:** CodeMirror 6 (SQL syntax highlighting + autocomplete)
- **Data Grid:** TanStack Table
- **Styling:** Tailwind CSS — base `zinc-950` (deep charcoal), crimson/teal active accents
- **Hosting:** static (GitHub Pages / Netlify / Vercel)

### Game Flow
Main Menu (OS Terminal) → Level Select (Filing Cabinet) → Game Dashboard (4 Case Tabs)

### The Four Tabs
- **A — Crime Scene:** narrative case file, forensic constraints
- **B — Case Board:** interactive ERD of the case database schema
- **C — Analysis:** CodeMirror SQL editor + TanStack results table + Detective's Notebook
- **D — Report Card:** fill-in-the-blank deduction with anti-cheat locks unlocked by running the proving query

### Deduction Report Mechanic
Running SQL intercepts the returned JSON. Rows are checked against a per-case
verification matrix; matches flip global state flags that unlock the corresponding
Report Card dropdowns. See per-case config for `blanks` → `unlockedByColumn` / `triggerValue`.
