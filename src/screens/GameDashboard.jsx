import { useEffect, useMemo, useState } from 'react'
import { getCase } from '../cases/index.js'
import { createDatabase } from '../engine/sqlEngine.js'
import TabBar from '../components/TabBar.jsx'
import CrimeSceneTab from '../components/CrimeSceneTab.jsx'
import CaseBoardTab from '../components/CaseBoardTab.jsx'
import AnalysisTab from '../components/AnalysisTab.jsx'
import ReportCardTab from '../components/ReportCardTab.jsx'

const TABS = [
  { key: 'scene', label: 'CRIME SCENE' },
  { key: 'board', label: 'CASE BOARD' },
  { key: 'analysis', label: 'ANALYSIS' },
  { key: 'report', label: 'REPORT CARD' },
]

export default function GameDashboard({ game }) {
  const caseData = getCase(game.openCaseId)
  const [tab, setTab] = useState('scene')
  const [db, setDb] = useState(null)
  const [dbError, setDbError] = useState(null)

  // Unlocked report blanks for THIS case, hydrated from the save.
  const unlocked = useMemo(
    () => new Set(game.save.unlocks[caseData?.id] || []),
    [game.save.unlocks, caseData?.id],
  )

  // Build the case database when the case opens.
  useEffect(() => {
    let cancelled = false
    setDb(null)
    setDbError(null)
    if (!caseData?.schemaSql) return
    createDatabase(caseData.schemaSql)
      .then((database) => {
        if (!cancelled) setDb(database)
      })
      .catch((err) => {
        if (!cancelled) setDbError(err.message || String(err))
      })
    return () => {
      cancelled = true
    }
  }, [caseData?.id, caseData?.schemaSql])

  if (!caseData) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Case not found.{' '}
        <button className="ml-2 text-zinc-300 underline" onClick={() => game.setScreen('levels')}>
          back to files
        </button>
      </div>
    )
  }

  const persistUnlocks = (nextSet) => {
    game.setUnlocks(caseData.id, Array.from(nextSet))
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Case header */}
      <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-2.5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => game.setScreen('levels')}
            className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-100"
          >
            &larr; files
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm font-black tracking-wide text-crimson">
              {caseData.code} // {caseData.tag}
            </span>
            <span className="font-display text-sm tracking-wide text-zinc-200">{caseData.title}</span>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          {game.save.solvedCases.includes(caseData.id) ? 'CASE CLOSED' : 'UNRESOLVED'}
        </span>
      </header>

      {/* Folder-card: tabs stick out of the top of a white-outlined content box. */}
      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />

        <main className="min-h-0 flex-1 overflow-hidden rounded-2xl rounded-tl-none border border-zinc-100 bg-zinc-950">
          {tab === 'scene' && <CrimeSceneTab caseData={caseData} />}
          {tab === 'board' && <CaseBoardTab caseData={caseData} />}
          {tab === 'analysis' && (
            <AnalysisTab
              caseData={caseData}
              db={db}
              dbError={dbError}
              game={game}
              unlocked={unlocked}
              onUnlocksChange={persistUnlocks}
            />
          )}
          {tab === 'report' && (
            <ReportCardTab
              caseData={caseData}
              unlocked={unlocked}
              game={game}
              goToAnalysis={() => setTab('analysis')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
