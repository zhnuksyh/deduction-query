import { Fragment, useState } from 'react'
import { gradeReport } from '../engine/verification.js'
import { LockedCase } from './CrimeSceneTab.jsx'

export default function ReportCardTab({ caseData, unlocked, game }) {
  const report = caseData.report
  const [answers, setAnswers] = useState({})
  const [graded, setGraded] = useState(null)

  if (!report) return <LockedCase caseData={caseData} />

  const alreadySolved = game.save.solvedCases.includes(caseData.id)
  const allAnswered = Object.keys(report.blanks).every(
    (k) => answers[k] != null && answers[k] !== '',
  )

  const submit = () => {
    const res = gradeReport(report.blanks, answers)
    setGraded(res)
    if (res.correct) game.markSolved(caseData.id)
  }

  // Split the template on {{tokens}} and interleave dropdowns.
  const parts = report.template.split(/(\{\{\w+\}\})/g)

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Report Card</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Fill each blank. The proving query must run in Analysis before the correct answer
            becomes available.
          </p>
        </div>

        {/* The narrative with inline blanks */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 text-base leading-loose text-zinc-300">
          {parts.map((part, i) => {
            const m = part.match(/\{\{(\w+)\}\}/)
            if (!m) return <Fragment key={i}>{part}</Fragment>
            const key = m[1]
            const cfg = report.blanks[key]
            const isUnlocked = unlocked.has(key)
            const isRight = graded?.results[key]
            const isWrong = graded && !graded.results[key]

            // Dynamic option set: while the proving query hasn't run, the correct
            // answer is withheld, so the blank cannot be completed by guessing.
            const options = isUnlocked
              ? cfg.options
              : cfg.options.filter((o) => o !== cfg.targetValue)

            return (
              <select
                key={i}
                value={answers[key] || ''}
                onChange={(e) => {
                  setAnswers((a) => ({ ...a, [key]: e.target.value }))
                  setGraded(null)
                }}
                className={`mx-1 inline-block min-w-[8rem] rounded-lg border bg-zinc-950 px-3 py-1 align-middle text-sm focus:outline-none ${
                  isRight
                    ? 'border-zinc-400 text-zinc-100'
                    : isWrong
                      ? 'border-crimson text-crimson'
                      : 'border-zinc-600 text-zinc-100 hover:border-zinc-400'
                }`}
              >
                <option value="" disabled>
                  &nbsp;
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )
          })}
        </div>

        {/* Result banner */}
        {graded && (
          <div
            className={`mt-6 border p-4 text-sm ${
              graded.correct
                ? 'border-zinc-500 bg-zinc-800/40 text-zinc-300'
                : 'border-crimson bg-crimson-dim/10 text-crimson'
            }`}
          >
            {graded.correct
              ? 'CASE CLOSED. Your deduction holds up. The next file is unlocked.'
              : 'The evidence contradicts this deduction. Re-check your answers.'}
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="rounded-lg bg-crimson px-8 py-3 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-crimson/80 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {alreadySolved ? 'resubmit report' : 'submit report'}
          </button>
        </div>
      </div>
    </div>
  )
}
