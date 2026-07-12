import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LockedCase } from './CrimeSceneTab.jsx'

export default function CaseBoardTab({ caseData }) {
  if (!caseData.erd) return <LockedCase caseData={caseData} />

  return <Board tables={caseData.erd.tables} />
}

function Board({ tables }) {
  // Foreign-key edges as stable { from, to } cell-key pairs.
  const edges = useMemo(() => {
    const out = []
    tables.forEach((t) =>
      t.columns.forEach((col) => {
        if (col.fk) {
          const [toTable, toCol] = col.fk.split('.')
          out.push({ from: cellKey(t.name, col.name), to: cellKey(toTable, toCol) })
        }
      }),
    )
    return out
  }, [tables])

  const containerRef = useRef(null)
  const cellRefs = useRef({}) // cellKey -> element
  const [paths, setPaths] = useState([])

  const registerCell = useRef((key, el) => {
    if (el) cellRefs.current[key] = el
    else delete cellRefs.current[key]
  }).current

  useLayoutEffect(() => {
    let frame = 0
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const base = container.getBoundingClientRect()
      const next = []
      // Each edge gets its own vertical track in the left gutter so lines never
      // sit on top of each other. Tracks are spaced 14px apart, closest to the
      // cards first.
      edges.forEach((edge, i) => {
        const a = cellRefs.current[edge.from]
        const b = cellRefs.current[edge.to]
        if (!a || !b) return
        const ra = a.getBoundingClientRect()
        const rb = b.getBoundingClientRect()
        // Anchor on the LEFT edge of both cells; the whole route lives in the
        // gutter to the left of every card, so it can't cross a table.
        const x1 = ra.left - base.left
        const y1 = ra.top - base.top + ra.height / 2
        const x2 = rb.left - base.left
        const y2 = rb.top - base.top + rb.height / 2
        const trackX = Math.min(x1, x2) - 18 - i * 14
        next.push(roundedElbow(x1, y1, x2, y2, trackX))
      })
      setPaths((prev) =>
        prev.length === next.length && prev.every((p, i) => p === next[i]) ? prev : next,
      )
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    schedule()
    const ro = new ResizeObserver(schedule)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [edges])

  // Reserve gutter width based on how many FK tracks we need.
  const gutter = 40 + edges.length * 14

  return (
    <div className="h-full overflow-auto px-8 py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-1 text-2xl font-semibold text-zinc-100">Case Board</h2>
        <p className="mb-8 text-xs text-zinc-500">
          The tables you can query. Curved lines trace foreign keys to the column they reference.
        </p>

        <div ref={containerRef} className="relative">
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            {paths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#71717a" strokeWidth="1.5" />
            ))}
          </svg>

          {/* Cards live in a single right-hand column; the left gutter is line-only. */}
          <div className="flex flex-col gap-6" style={{ paddingLeft: gutter }}>
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
    <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900">
      <div className="border-b border-zinc-800 px-4 py-3">
        <span className="text-sm font-semibold tracking-wide text-zinc-100">{table.name}</span>
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
              {col.fk && <span className="ml-1.5 text-[9px] uppercase text-zinc-400">fk</span>}
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
 * SVG path leaving the left edge of (x1,y1), routing down a dedicated vertical
 * track at trackX, and re-entering the left edge of (x2,y2), rounded corners.
 */
function roundedElbow(x1, y1, x2, y2, trackX) {
  const r = 10
  const dir = y2 > y1 ? 1 : -1
  const vr = Math.min(r, Math.abs(y2 - y1) / 2)
  const hr = Math.min(r, Math.abs(x1 - trackX), Math.abs(x2 - trackX))
  return [
    `M ${x1} ${y1}`,
    `H ${trackX + hr}`,
    `Q ${trackX} ${y1} ${trackX} ${y1 + dir * vr}`,
    `V ${y2 - dir * vr}`,
    `Q ${trackX} ${y2} ${trackX + hr} ${y2}`,
    `H ${x2}`,
  ].join(' ')
}
