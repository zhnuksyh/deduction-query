import { ChevronLeft, ChevronRight } from 'lucide-react'

// Curated beginner SQL video tutorials (open in a new tab).
const VIDEOS = [
  {
    title: 'SQL Tutorial — Full Database Course for Beginners',
    by: 'freeCodeCamp',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  },
  {
    title: 'Learn SQL In 60 Minutes',
    by: 'Web Dev Simplified',
    url: 'https://www.youtube.com/watch?v=p3qvj9hO_Bo',
  },
  {
    title: 'SQL Explained in 100 Seconds',
    by: 'Fireship',
    url: 'https://www.youtube.com/watch?v=zsjvFFKOm3c',
  },
]

// The core clauses a player needs to solve cases.
const CLAUSES = [
  {
    kw: 'SELECT … FROM',
    desc: 'Pick which columns to see, from which table.',
    ex: 'SELECT name, handedness FROM suspects;',
  },
  {
    kw: 'WHERE',
    desc: 'Keep only the rows that match a condition.',
    ex: "SELECT * FROM keycard_logs WHERE wing = 'East Wing';",
  },
  {
    kw: 'LIKE',
    desc: 'Match text by pattern: % = any run of characters, _ = one character.',
    ex: "SELECT * FROM alibis WHERE statement LIKE '%never%';",
  },
  {
    kw: 'IN',
    desc: 'Match any value from a set — shorter than chaining ORs.',
    ex: "SELECT * FROM suspects WHERE relationship IN ('Ex-husband', 'Rival');",
  },
  {
    kw: 'AND / OR / BETWEEN',
    desc: 'Combine conditions; BETWEEN checks a range (inclusive).',
    ex: "SELECT * FROM keycard_logs\nWHERE swipe_time BETWEEN '23:10' AND '23:25';",
  },
  {
    kw: 'JOIN … ON',
    desc: 'Combine two tables by a matching column (usually a key).',
    ex: 'SELECT s.name, a.statement\nFROM suspects s\nJOIN alibis a ON a.suspect_id = s.id;',
  },
  {
    kw: 'ORDER BY … LIMIT',
    desc: 'Sort the results (DESC to reverse) and cap how many rows come back.',
    ex: 'SELECT * FROM keycard_logs\nORDER BY swipe_time DESC LIMIT 5;',
  },
  {
    kw: 'DISTINCT',
    desc: 'Drop duplicate rows/values — handy for “how many different …”.',
    ex: 'SELECT COUNT(DISTINCT incident_id) FROM access_logs;',
  },
  {
    kw: 'GROUP BY … HAVING',
    desc: 'Bucket rows to aggregate (COUNT, SUM…); HAVING filters the buckets.',
    ex: 'SELECT suspect_id, COUNT(*) FROM keycard_logs\nGROUP BY suspect_id HAVING COUNT(*) > 1;',
  },
]

export default function Guide({ game, play }) {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <button
            onClick={() => {
              play?.('click')
              game.setScreen('menu')
            }}
            onMouseEnter={() => play?.('hover')}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-100"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
            main menu
          </button>
          <h1 className="mt-3 font-display text-4xl font-black text-zinc-100">GUIDE BOOK</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Everything you need to crack a case with SQL.
          </p>
        </header>

        {/* How the game works */}
        <Section title="How the investigation works">
          <ol className="space-y-2 text-sm leading-relaxed text-zinc-300">
            <Step n="1">
              Read the <b className="text-zinc-100">Crime Scene</b> — the report hides every fact
              you'll need to prove.
            </Step>
            <Step n="2">
              Study the <b className="text-zinc-100">Case Board</b> — the tables, their columns,
              and how they connect (foreign keys).
            </Step>
            <Step n="3">
              Write SQL in <b className="text-zinc-100">Analysis</b> to cross-reference the
              evidence and surface the contradiction.
            </Step>
            <Step n="4">
              Fill in the <b className="text-zinc-100">Report Card</b>. Each blank unlocks only
              after you run the query that proves it — then submit to close the case.
            </Step>
          </ol>
          <p className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400">
            You can't guess your way through. The database never lies — find where a{' '}
            <i>suspect</i> does.
          </p>
        </Section>

        {/* SQL cheat sheet */}
        <Section title="SQL you'll actually use">
          <div className="space-y-3">
            {CLAUSES.map((c) => (
              <div key={c.kw} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-[#f26d78]">{c.kw}</span>
                  <span className="text-right text-xs text-zinc-400">{c.desc}</span>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300">
                  {c.ex}
                </pre>
              </div>
            ))}
          </div>
        </Section>

        {/* Video tutorials */}
        <Section title="Learn SQL — video tutorials">
          <div className="space-y-2">
            {VIDEOS.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => play?.('hover')}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-600"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-200">{v.title}</div>
                  <div className="text-xs text-zinc-500">{v.by}</div>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase leading-none tracking-widest text-zinc-500">
                  <span className="pt-px">watch</span>
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </a>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">{title}</h2>
      {children}
    </section>
  )
}

function Step({ n, children }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-[10px] font-bold text-zinc-400">
        {n}
      </span>
      <span>{children}</span>
    </li>
  )
}
