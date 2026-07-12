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

export default function MainMenu({ game }) {
  const handle = (key) => {
    switch (key) {
      case 'new':
      case 'continue':
        // Both routes land on the level-select screen.
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

      {/* Content: left-aligned title + menu. */}
      <div className="relative flex h-full w-full flex-col justify-center px-10 sm:px-16">
        <h1 className="mb-10 font-display text-5xl font-black leading-none tracking-tight text-zinc-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-7xl">
          DEDUCTIVE<span className="text-crimson">_</span>QUERY
        </h1>

        <ul className="flex w-full max-w-xs flex-col gap-2.5">
          {MENU.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handle(item.key)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-5 py-3 text-left font-display text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm transition-colors hover:border-crimson/60 hover:bg-zinc-950/70 hover:text-crimson"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
