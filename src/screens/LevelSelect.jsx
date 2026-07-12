import { CASES, isCaseUnlocked } from '../cases/index.js'

// Folder tone per theme, echoing the GRID DAILY reference palette.
const THEME = {
  drift: { bg: '#b8bec6', text: '#1c2126', accent: '#3a4450' },
  fall: { bg: '#c9a56b', text: '#2b2013', accent: '#5c4522' },
  signal: { bg: '#1a1a1a', text: '#e8e3d5', accent: '#e11d48' },
  work: { bg: '#3d4a3a', text: '#e8e3d5', accent: '#2dd4bf' },
  paper: { bg: '#e8e3d5', text: '#26221a', accent: '#8a8266' },
}

export default function LevelSelect({ game }) {
  const { save } = game

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top bar */}
      <header className="flex items-center px-6 py-4">
        <button
          onClick={() => game.setScreen('menu')}
          className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900 text-lg text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          title="Main menu"
        >
          &times;
        </button>
      </header>

      {/* Cabinet: staggered vertical folder tabs */}
      <div className="relative flex flex-1 items-stretch overflow-x-auto px-6 py-8">
        {CASES.map((c, i) => {
          const unlocked = isCaseUnlocked(c.id, save.solvedCases)
          const solved = save.solvedCases.includes(c.id)
          const theme = unlocked ? THEME[c.folderTheme] || THEME.paper : null
          return (
            <Folder
              key={c.id}
              c={c}
              index={i}
              unlocked={unlocked}
              solved={solved}
              theme={theme}
              onOpen={() => unlocked && game.openCase(c.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function Folder({ c, index, unlocked, solved, theme, onOpen }) {
  if (!unlocked) {
    return (
      <div className="group relative flex w-40 shrink-0 cursor-not-allowed flex-col justify-between border-l border-zinc-800 bg-zinc-900/60 px-4 py-6">
        <div className="vertical-rl font-display text-lg tracking-widest text-zinc-700">
          {c.code} // LOCKED
        </div>
        <div className="text-center text-3xl text-zinc-700">▚</div>
        <div className="text-[9px] uppercase tracking-widest text-zinc-700">
          dependency unmet
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onOpen}
      style={{ backgroundColor: theme.bg, color: theme.text, marginTop: `${(index % 3) * 14}px` }}
      className="group relative flex w-56 shrink-0 flex-col justify-between px-4 py-5 text-left transition-transform hover:-translate-y-2 focus:-translate-y-2"
    >
      {/* Vertical tab label */}
      <div className="mb-4 flex items-start justify-between">
        <div className="vertical-rl h-40 font-display text-2xl font-black leading-none tracking-tight">
          {c.code} // {c.tag}
        </div>
        <span
          className="rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: solved ? theme.accent : 'transparent',
            color: solved ? theme.bg : theme.accent,
            border: `1px solid ${theme.accent}`,
          }}
        >
          {solved ? 'CLOSED' : 'UNRESOLVED'}
        </span>
      </div>

      <div>
        <div className="mb-1 text-[10px] uppercase tracking-[0.25em] opacity-60">
          FILE_{c.id.split('_')[1]}//
        </div>
        <h3 className="font-display text-xl font-black leading-tight">{c.title}</h3>
        <p className="mt-2 text-[11px] leading-snug opacity-75">{c.teaser}</p>
      </div>

      <div
        className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: theme.accent }}
      >
        open file &rarr;
      </div>
    </button>
  )
}
