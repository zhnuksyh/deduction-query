import { Lock } from 'lucide-react'

export default function CrimeSceneTab({ caseData }) {
  const scene = caseData.crimeScene
  if (!scene) {
    return <LockedCase caseData={caseData} />
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-zinc-100">{caseData.title}</h2>
        </div>

        {/* Vitals */}
        <dl className="mb-8 grid grid-cols-1 gap-px overflow-hidden rounded border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
          <Vital term="Victim" value={scene.victim} />
          <Vital term="Location" value={scene.location} />
          <Vital term="Time of death" value={scene.timeOfDeath} />
        </dl>

        {/* Report body — the forensic details are woven into this narrative. */}
        <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
          {scene.report}
        </div>
      </div>
    </div>
  )
}

function Vital({ term, value }) {
  return (
    <div className="bg-zinc-950 p-4">
      <dt className="mb-1 text-[10px] uppercase tracking-[0.25em] text-zinc-600">{term}</dt>
      <dd className="text-sm text-zinc-200">{value}</dd>
    </div>
  )
}

export function LockedCase({ caseData }) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="max-w-md text-center">
        <Lock className="mx-auto mb-4 h-9 w-9 text-zinc-700" strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold text-zinc-400">{caseData.title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{caseData.teaser}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-zinc-600">
          case data classified — solve the prior file to unlock
        </p>
      </div>
    </div>
  )
}
