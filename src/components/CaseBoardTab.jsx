import { LockedCase } from './CrimeSceneTab.jsx'

export default function CaseBoardTab({ caseData }) {
  if (!caseData.erd) return <LockedCase caseData={caseData} />

  const { tables } = caseData.erd
  // Collect FK relationships for the legend.
  const relationships = []
  tables.forEach((t) =>
    t.columns.forEach((col) => {
      if (col.fk) relationships.push({ from: `${t.name}.${col.name}`, to: col.fk })
    }),
  )

  return (
    <div className="h-full overflow-auto px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 border-l-2 border-teal pl-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            database anatomy
          </div>
          <h2 className="font-display text-2xl font-black text-zinc-100">CASE BOARD</h2>
          <p className="mt-1 text-xs text-zinc-500">
            The tables you can query. Solid dot = primary key, arrow = foreign key.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <TableCard key={t.name} table={t} />
          ))}
        </div>

        {relationships.length > 0 && (
          <div className="mt-8 border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-crimson">
              key relationships
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-zinc-400">
              {relationships.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-teal">{r.from}</span>
                  <span className="text-zinc-600">─&gt;</span>
                  <span className="text-crimson">{r.to}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function TableCard({ table }) {
  return (
    <div className="overflow-hidden rounded border border-zinc-700 bg-zinc-900">
      <div className="border-b border-zinc-700 bg-zinc-800 px-3 py-2">
        <span className="font-display text-sm font-bold tracking-wide text-zinc-100">
          {table.name}
        </span>
      </div>
      <ul className="divide-y divide-zinc-800/70">
        {table.columns.map((col) => (
          <li key={col.name} className="flex items-center justify-between px-3 py-1.5 text-xs">
            <span className="flex items-center gap-2">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  col.pk ? 'bg-crimson' : col.fk ? 'bg-teal' : 'bg-zinc-700'
                }`}
                title={col.pk ? 'primary key' : col.fk ? `foreign key -> ${col.fk}` : ''}
              />
              <span className={col.pk ? 'font-bold text-zinc-100' : 'text-zinc-300'}>
                {col.name}
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">{col.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
