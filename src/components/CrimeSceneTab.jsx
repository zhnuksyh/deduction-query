export default function CrimeSceneTab({ caseData }) {
  const scene = caseData.crimeScene
  if (!scene) {
    return <LockedCase caseData={caseData} />
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 border-l-2 border-crimson pl-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            case file // {caseData.code}
          </div>
          <h2 className="font-display text-3xl font-black text-zinc-100">{caseData.title}</h2>
        </div>

        {/* Vitals */}
        <dl className="mb-8 grid grid-cols-1 gap-px overflow-hidden rounded border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
          <Vital term="Victim" value={scene.victim} />
          <Vital term="Location" value={scene.location} />
          <Vital term="Time of death" value={scene.timeOfDeath} />
        </dl>

        {/* Report body */}
        <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
          {scene.report}
        </div>

        {/* Forensic constraints */}
        <div className="mt-8 border border-zinc-700 bg-zinc-900/40 p-4">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-300">
            forensic constraints
          </div>
          <ul className="space-y-2">
            {scene.constraints.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="text-zinc-300">▸</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
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
        <div className="mb-3 text-5xl text-zinc-700">▚▚</div>
        <h2 className="font-display text-2xl font-black text-zinc-400">{caseData.title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{caseData.teaser}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-crimson-dim">
          case data classified — solve the prior file to unlock
        </p>
      </div>
    </div>
  )
}
