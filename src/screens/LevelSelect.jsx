import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { CASES, isCaseUnlocked } from '../cases/index.js'
import CaseStamp from '../components/CaseStamp.jsx'

export default function LevelSelect({ game, play }) {
  const { save } = game
  const trackRef = useRef(null)

  // Scroll the carousel by roughly one card width per click.
  const scrollByCard = (dir) => {
    play('tab')
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-card]')
    const step = card ? card.getBoundingClientRect().width + 16 : 300
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top bar — "Menu" button placed exactly where the case page shows
          "‹ FILES". The min-height matches the case header's taller row (which is
          sized by its title) so the back button sits at the same Y on both
          screens for a seamless transition. */}
      <header className="px-6 pb-4 pt-8">
        <div className="mx-auto flex min-h-[1.25rem] w-full max-w-4xl items-center">
          <button
            onClick={() => {
              play('back')
              game.setScreen('menu')
            }}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-100"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
            menu
          </button>
        </div>
      </header>

      {/* Carousel, sized to the game-board container (max-w-4xl) so exactly three
          cards fit at once. */}
      <div className="flex min-h-0 flex-1 flex-col items-center px-6 pb-6">
        <div className="flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          {/* Carousel controls, slightly top-right. */}
          <div className="mb-3 flex justify-end gap-2">
            <CarouselButton dir="left" onClick={() => scrollByCard(-1)} />
            <CarouselButton dir="right" onClick={() => scrollByCard(1)} />
          </div>

          {/* Track: 3 cards visible, horizontal scroll. Vertical padding keeps the
              hover-lift from being clipped; no horizontal inset so the third
              card's right edge lines up with the chevron controls above. */}
          <div
            ref={trackRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto py-3"
          >
            {CASES.map((c, i) => {
              const unlocked = isCaseUnlocked(c.id, save.solvedCases)
              const solved = save.solvedCases.includes(c.id)
              return (
                <Folder
                  key={c.id}
                  c={c}
                  index={i}
                  unlocked={unlocked}
                  solved={solved}
                  onOpen={() => {
                    if (!unlocked) return
                    play('click')
                    game.openCase(c.id)
                  }}
                  onHover={() => unlocked && play('hover')}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function CarouselButton({ dir, onClick }) {
  const Icon = dir === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      className="press flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  )
}

// Each card is 1/3 of the track width (minus the gaps) so exactly three show.
const CARD_WIDTH = 'w-[calc((100%-2rem)/3)]'

function Folder({ c, index = 0, unlocked, solved, onOpen, onHover }) {
  if (!unlocked) {
    return (
      <div
        data-card
        style={{ '--stagger-i': index }}
        className={`${CARD_WIDTH} stagger-item flex min-h-0 shrink-0 animate-fade-up snap-start cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-800/60 px-5 py-6`}
      >
        <Lock className="h-7 w-7 text-zinc-600" strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <button
      data-card
      onClick={onOpen}
      onMouseEnter={onHover}
      style={{ '--stagger-i': index }}
      className={`${CARD_WIDTH} stagger-item group relative flex min-h-0 shrink-0 animate-fade-up snap-start flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-950 px-5 py-5 text-left text-zinc-200 transition-transform duration-200 hover:-translate-y-1.5 focus:-translate-y-1.5`}
    >
      {/* Vertical file code down the top-right corner. Letters are heavy; the
          "_" and "/" separators are thin for contrast. */}
      <div
        className="pointer-events-none absolute right-3 top-4 text-3xl uppercase tracking-[0.15em] text-zinc-500/20"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-black">FILE</span>
        <span className="font-light">_</span>
        <span className="font-black">{c.id.split('_')[1]}</span>
        <span className="font-light">//</span>
      </div>

      <div className="mt-auto">
        <h3 className="text-xl font-semibold leading-tight text-zinc-100">{c.title}</h3>
        <p className="mt-2 pr-6 text-[11px] leading-snug text-zinc-400">{c.teaser}</p>
      </div>

      <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
        open file
        <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
      </div>

      {/* Completion stamp, bottom-right, when the case is solved. */}
      {solved && <CaseStamp className="absolute bottom-4 right-4" />}
    </button>
  )
}
