import { useCallback, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql, SQLite } from '@codemirror/lang-sql'
import { runQuery } from '../engine/sqlEngine.js'
import { evaluateUnlocks } from '../engine/verification.js'
import ResultsTable from './ResultsTable.jsx'
import { LockedCase } from './CrimeSceneTab.jsx'

const STARTER = '-- Query the evidence. Try:\nSELECT * FROM suspects;'

export default function AnalysisTab({ caseData, db, dbError, game, play, shake, unlocked, onUnlocksChange }) {
  const [sqlText, setSqlText] = useState(STARTER)
  const [result, setResult] = useState(null)
  const [flash, setFlash] = useState(null) // toast for newly unlocked clues

  const notebook = game.save.notebooks[caseData.id] || ''

  // Build a schema map so CodeMirror autocompletes table/column names.
  const schemaHints = {}
  caseData.erd?.tables.forEach((t) => {
    schemaHints[t.name] = t.columns.map((c) => c.name)
  })

  const execute = useCallback(() => {
    if (!db) return
    play('run')
    const res = runQuery(db, sqlText)
    setResult(res)

    if (res.error) {
      play('error')
      shake()
      return
    }

    // Intercept: check the returned rows against the case verification matrix.
    let unlockedSomething = false
    if (caseData.report?.blanks) {
      const { unlocked: nextUnlocked, newlyUnlocked } = evaluateUnlocks(
        caseData.report.blanks,
        res.rows,
        unlocked,
      )
      if (newlyUnlocked.length > 0) {
        unlockedSomething = true
        onUnlocksChange(nextUnlocked)
        const labels = newlyUnlocked.map((k) => caseData.report.blanks[k].label).join(', ')
        setFlash(`CLUE VERIFIED → ${labels}`)
        setTimeout(() => setFlash(null), 4000)
      }
    }

    // A verified clue gets its own celebratory chime; otherwise the plain
    // "query returned" confirmation. The unlock sound trails the run tick.
    if (unlockedSomething) {
      setTimeout(() => play('unlock'), 120)
    } else {
      play('success')
    }
  }, [db, sqlText, caseData.report, unlocked, onUnlocksChange, play, shake])

  // Ctrl/Cmd+Enter to run.
  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      execute()
    }
  }

  if (!caseData.schemaSql) return <LockedCase caseData={caseData} />

  return (
    <div className="flex h-full gap-4 p-5">
      {/* Main workspace */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800" onKeyDown={onKeyDown}>
        {/* SQL input. Fixed header height so its bottom border lines up with the
            notebook header's border across the gap. */}
        <div className="flex h-10 items-center justify-between border-b border-zinc-800 px-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            SQL input
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] text-zinc-600 sm:block">⌘/Ctrl + Enter</span>
            <button
              onClick={execute}
              disabled={!db}
              className="press rounded-full bg-zinc-100 px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              RUN
            </button>
          </div>
        </div>

        <div className="h-[42%] min-h-[140px] overflow-hidden border-b border-zinc-800">
          {dbError ? (
            <div className="p-4 text-xs text-zinc-400">
              Couldn’t load the case database: {dbError}
            </div>
          ) : (
            <CodeMirror
              value={sqlText}
              onChange={setSqlText}
              theme="dark"
              extensions={[sql({ dialect: SQLite, schema: schemaHints, upperCaseKeywords: true })]}
              basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
              placeholder="Write SQL here…"
            />
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            query results
          </span>
          {result && !result.error && (
            <span className="text-[10px] text-zinc-600">{result.rows.length} row(s)</span>
          )}
        </div>
        <div className="relative min-h-0 flex-1">
          {!db && !dbError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/70 text-xs text-zinc-300">
              compiling sql.js runtime…
            </div>
          )}
          <ResultsTable result={result} />

          {flash && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 animate-toast-up border border-crimson/60 bg-zinc-900 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-crimson shadow-lg shadow-crimson/10">
              {flash}
            </div>
          )}
        </div>

        {/* Footer bar — same height as the notebook footer so their top borders
            line up across the gap. */}
        <div className="flex h-8 items-center border-t border-zinc-800 px-4 text-[9px] uppercase tracking-widest text-zinc-700">
          {db ? 'ready' : 'loading engine…'}
        </div>
      </div>

      {/* Detective's Notebook sidebar */}
      <aside className="flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {/* Header height matches the SQL-input header so their bottom borders
            sit on the same line. */}
        <div className="flex h-10 items-center border-b border-zinc-800 px-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          detective's notebook
        </div>
        <textarea
          value={notebook}
          onChange={(e) => game.setNotebook(caseData.id, e.target.value)}
          placeholder="Track suspects, jot clues, list query ideas… auto-saved."
          className="flex-1 resize-none bg-transparent px-4 py-3 text-xs leading-relaxed text-zinc-300 placeholder:text-zinc-700 focus:outline-none"
          spellCheck={false}
        />
        <div className="flex h-8 items-center border-t border-zinc-800 px-4 text-[9px] uppercase tracking-widest text-zinc-700">
          auto-saved locally
        </div>
      </aside>
    </div>
  )
}
