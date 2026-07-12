const MENU = [
  { key: 'new', label: 'NEW GAME' },
  { key: 'continue', label: 'CONTINUE' },
  { key: 'options', label: 'OPTIONS' },
  { key: 'credits', label: 'CREDITS' },
  { key: 'more', label: 'MORE GAMES' },
]

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
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
      {/* Title */}
      <h1 className="mb-12 font-display text-5xl font-black leading-none tracking-tight text-zinc-100 sm:text-7xl">
        DEDUCTIVE<span className="text-crimson">_</span>QUERY
      </h1>

      {/* Menu */}
      <ul className="flex flex-col items-center gap-2">
        {MENU.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => handle(item.key)}
              className="font-display text-xl tracking-wide text-zinc-400 transition-colors hover:text-crimson"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
