import { Fragment, useState } from 'react'
import { gradeReport } from '../engine/verification.js'
import { LockedCase } from './CrimeSceneTab.jsx'

export default function ReportCardTab({ caseData, unlocked, game, goToAnalysis }) {
  const report = caseData.report
  const [answers, setAnswers] = useState({})
  const [graded, setGraded] = useState(null)

  if (!report) return <LockedCase caseData={caseData} />

  const alreadySolved = game.save.solvedCases.includes(caseData.id)
  const allUnlocked = Object.keys(report.blanks).every((k) => unlocked.has(k))
  const allAnswered = Object.keys(report.blanks).every((k) => answers[k] != null && answers[k] !== '')

  const submit = () => {
    const res = gradeReport(report.blanks, answers)
    setGraded(res)
    if (res.correct) game.markSolved(caseData.id)
  }

  // Split the template on {{tokens}} and interleave dropdowns.
  const parts = report.template.split(/(\{\{\w+\}\})/g)

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 border-l-2 border-crimson pl-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            deduction sheet
          </div>
          <h2 className="font-display text-2xl font-black text-zinc-100">REPORT CARD</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Each blank stays locked until the query that proves it runs in Analysis.
          </p>
        </div>

        {/* Unlock progress */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(report.blanks).map(([key, cfg]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] uppercase tracking-widest ${
                unlocked.has(key)
                  ? 'border-teal-dim bg-teal-dim/10 text-teal'
                  : 'border-zinc-800 text-zinc-600'
              }`}
            >
              {unlocked.has(key) ? '✓' : '🔒'} {cfg.label}
            </span>
          ))}
        </div>

        {/* The narrative with dropdowns */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 text-base leading-loose text-zinc-300">
          {parts.map((part, i) => {
            const m = part.match(/\{\{(\w+)\}\}/)
            if (!m) return <Fragment key={i}>{part}</Fragment>
            const key = m[1]
            const cfg = report.blanks[key]
            const isUnlocked = unlocked.has(key)
            const isRight = graded?.results[key]
            const isWrong = graded && !graded.results[key]

            if (!isUnlocked) {
              return (
                <button
                  key={i}
                  onClick={goToAnalysis}
                  title={cfg.hint}
                  className="mx-1 inline-flex select-none items-center gap-1 rounded border border-dashed border-zinc-700 bg-zinc-800/60 px-3 py-0.5 align-middle text-sm text-zinc-600 blur-[1.5px] hover:blur-0"
                >
                  🔒 locked
                </button>
              )
            }

            return (
              <select
                key={i}
                value={answers[key] || ''}
                onChange={(e) => {
                  setAnswers((a) => ({ ...a, [key]: e.target.value }))
                  setGraded(null)
                }}
                className={`mx-1 inline-block rounded border bg-zinc-950 px-2 py-0.5 align-middle text-sm focus:outline-none ${
                  isRight
                    ? 'border-teal text-teal'
                    : isWrong
                      ? 'border-crimson text-crimson'
                      : 'border-teal-dim text-zinc-100'
                }`}
              >
                <option value="" disabled>
                  select…
                </option>
                {cfg.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )
          })}
        </div>

        {/* Hints for locked blanks */}
        {!allUnlocked && (
          <div className="mt-4 border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              to unlock the remaining blanks
            </div>
            <ul className="space-y-1 text-xs text-zinc-500">
              {Object.entries(report.blanks)
                .filter(([k]) => !unlocked.has(k))
                .map(([k, cfg]) => (
                  <li key={k}>
                    <span className="text-crimson">▸</span> {cfg.hint}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Result banner */}
        {graded && (
          <div
            className={`mt-6 border p-4 text-sm ${
              graded.correct
                ? 'border-teal bg-teal-dim/10 text-teal'
                : 'border-crimson bg-crimson-dim/10 text-crimson'
            }`}
          >
            {graded.correct
              ? '✓ CASE CLOSED. Your deduction holds up. The next file is unlocked.'
              : '✗ The evidence contradicts this deduction. Re-check the highlighted blanks.'}
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goToAnalysis}
            className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 hover:text-teal"
          >
            &larr; back to analysis
          </button>
          <button
            onClick={submit}
            disabled={!allUnlocked || !allAnswered}
            className="bg-crimson px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-crimson/80 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {alreadySolved ? 'resubmit report' : 'submit report'}
          </button>
        </div>
      </div>
    </div>
  )
}
