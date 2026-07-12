import { useState } from 'react'
import bgUrl from '../assets/main-menu-bg.jpg'

const MENU = [
  { key: 'new', label: 'NEW GAME' },
  { key: 'continue', label: 'CONTINUE' },
  { key: 'options', label: 'OPTIONS' },
  { key: 'credits', label: 'CREDITS' },
  { key: 'more', label: 'MORE GAMES' },
]

// A faint SQL snippet tiled behind the art for texture.
const SQL_TEXTURE = `SELECT * FROM suspects WHERE alibi IS NULL;
SELECT name FROM keycard_logs JOIN alibis USING (suspect_id);
SELECT tod_from, tod_to FROM coroner_reports;
WHERE swipe_time BETWEEN '23:10' AND '23:25'
JOIN forensics ON forensics.case_id = cases.id
GROUP BY suspect_id HAVING count(*) > 1
`.repeat(6)

export default function MainMenu({ game, play }) {
  const [confirmNew, setConfirmNew] = useState(false)

  // There's meaningful progress if any case is solved or a case was opened.
  const hasProgress =
    game.save.solvedCases.length > 0 ||
    game.save.lastCaseId != null ||
    Object.keys(game.save.notebooks || {}).length > 0

  const startNewGame = () => {
    game.hardReset()
    game.setScreen('levels')
  }

  const handle = (key) => {
    play('click')
    switch (key) {
      case 'new':
        // Starting fresh wipes progress — confirm first if there's any.
        if (hasProgress) setConfirmNew(true)
        else startNewGame()
        break
      case 'continue':
        game.setScreen('levels')
        break
      case 'options':
        game.setScreen('options')
        break
      case 'credits':
        game.setScreen('credits')
        break
      case 'more':
        window.open('https://github.com/zhnuksyh', '_blank', 'noopener')
        break
      default:
        break
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background art */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Faint SQL texture blended over the art. */}
      <pre className="pointer-events-none absolute inset-0 select-none overflow-hidden whitespace-pre-wrap break-all p-6 font-mono text-[11px] leading-relaxed text-zinc-100/[0.04] mix-blend-overlay">
        {SQL_TEXTURE}
      </pre>

      {/* Darken + left-weighted gradient so the menu stays legible. */}
      <div className="absolute inset-0 bg-zinc-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(9,9,11,0.75) 100%)',
        }}
      />

      {/* Content: left-aligned title + menu, sitting slightly above centre and
          nudged further in from the left edge. */}
      <div className="relative flex h-full w-full flex-col justify-center pb-24 pl-24 pr-10 sm:pl-36">
        <h1 className="mb-10 font-display text-3xl font-black leading-none tracking-tight text-zinc-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl">
          DEDUCTIVE<span className="text-[#f26d78]">_</span>QUERY
        </h1>

        <ul className="flex w-full max-w-[220px] flex-col gap-2.5">
          {MENU.map((item, i) => (
            <li key={item.key} className="stagger-item animate-fade-up" style={{ '--stagger-i': i }}>
              <button
                onClick={() => handle(item.key)}
                onMouseEnter={() => play('hover')}
                className="press w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-2.5 text-left font-display text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm transition-colors hover:border-[#f26d78]/70 hover:bg-zinc-950/70"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirm overwriting an existing save before starting a new game. */}
      {confirmNew && (
        <div className="absolute inset-0 z-50 flex animate-fade-in items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
          <div className="mx-6 w-full max-w-sm animate-pop-in rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-zinc-100">
              Start a new game?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              This will erase your current progress — solved cases, unlocked files, and
              notebook notes. This can’t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  play('back')
                  setConfirmNew(false)
                }}
                className="press rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  play('click')
                  setConfirmNew(false)
                  startNewGame()
                }}
                className="press rounded-lg bg-crimson px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-crimson/80"
              >
                Erase &amp; start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
