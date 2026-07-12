import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { LockedCase } from './CrimeSceneTab.jsx'

export default function CaseBoardTab({ caseData }) {
  if (!caseData.erd) return <LockedCase caseData={caseData} />

  const { tables } = caseData.erd

  // Collect FK edges as { fromKey, toKey } cell identifiers.
  const edges = []
  tables.forEach((t) =>
    t.columns.forEach((col) => {
      if (col.fk) {
        const [toTable, toCol] = col.fk.split('.')
        edges.push({
          from: cellKey(t.name, col.name),
          to: cellKey(toTable, toCol),
        })
      }
    }),
  )

  const containerRef = useRef(null)
  const cellRefs = useRef({}) // key -> element
  const [paths, setPaths] = useState([])

  const registerCell = useCallback((key, el) => {
    if (el) cellRefs.current[key] = el
    else delete cellRefs.current[key]
  }, [])

  // Measure cell positions and build rounded connector paths between them.
  const recompute = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const base = container.getBoundingClientRect()
    const next = []
    for (const edge of edges) {
      const a = cellRefs.current[edge.from]
      const b = cellRefs.current[edge.to]
      if (!a || !b) continue
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      // Anchor on the left edge of each cell (FK lines route on the left gutter).
      const x1 = ra.left - base.left
      const y1 = ra.top - base.top + ra.height / 2
      const x2 = rb.left - base.left
      const y2 = rb.top - base.top + rb.height / 2
      // Route out to the left, down/up, then back in — with rounded corners.
      const gutter = Math.min(x1, x2) - 24
      next.push(roundedElbow(x1, y1, x2, y2, gutter))
    }
    setPaths(next)
  }, [edges])

  useLayoutEffect(() => {
    recompute()
    const ro = new ResizeObserver(recompute)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [recompute])

  return (
    <div className="h-full overflow-auto px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            database anatomy
          </div>
          <h2 className="font-display text-2xl font-black text-zinc-100">Case Board</h2>
          <p className="mt-1 text-xs text-zinc-500">
            The tables you can query. Curved lines trace foreign keys to the column they reference.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {/* Connector overlay */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            {paths.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.7" />
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((t) => (
              <TableCard key={t.name} table={t} registerCell={registerCell} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TableCard({ table, registerCell }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg">
      <div className="border-b border-zinc-800 px-4 py-3">
        <span className="font-display text-sm font-semibold tracking-wide text-zinc-100">
          {table.name}
        </span>
      </div>
      <ul className="divide-y divide-zinc-800/60">
        {table.columns.map((col) => (
          <li
            key={col.name}
            ref={(el) => registerCell(cellKey(table.name, col.name), el)}
            className="flex items-center justify-between px-4 py-2 text-xs"
          >
            <span className={col.pk ? 'font-semibold text-zinc-100' : 'text-zinc-300'}>
              {col.name}
              {col.pk && <span className="ml-1.5 text-[9px] uppercase text-zinc-500">pk</span>}
              {col.fk && <span className="ml-1.5 text-[9px] uppercase text-teal">fk</span>}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">{col.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function cellKey(table, col) {
  return `${table}::${col}`
}

/**
 * Build an SVG path that leaves the left edge of (x1,y1), routes down a shared
 * left gutter, and re-enters the left edge of (x2,y2), with rounded corners.
 */
function roundedElbow(x1, y1, x2, y2, gutterX) {
  const r = 10
  const dir = y2 > y1 ? 1 : -1
  // Guard the radius against very short vertical runs.
  const vr = Math.min(r, Math.abs(y2 - y1) / 2)
  const hr = Math.min(r, Math.abs(x1 - gutterX), Math.abs(x2 - gutterX))
  return [
    `M ${x1} ${y1}`,
    `H ${gutterX + hr}`,
    `Q ${gutterX} ${y1} ${gutterX} ${y1 + dir * vr}`,
    `V ${y2 - dir * vr}`,
    `Q ${gutterX} ${y2} ${gutterX + hr} ${y2}`,
    `H ${x2}`,
  ].join(' ')
}
