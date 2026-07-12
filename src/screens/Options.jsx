import { ChevronLeft } from 'lucide-react'
import { MUSIC_TRACKS } from '../engine/music.js'

export default function Options({ game, play }) {
  const { settings } = game.save
  const set = (partial) => game.setSettings(partial)

  return (
    // Scrollable column: there are now enough controls that centring could
    // overflow on short viewports, so the panel scrolls instead.
    <div className="mx-auto flex h-full w-full max-w-xl flex-col px-6">
      <header className="shrink-0 border-b border-zinc-800 pb-4 pt-10">
        <button
          onClick={() => {
            play('back')
            game.setScreen('menu')
          }}
          className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          main menu
        </button>
        <h1 className="mt-3 font-display text-4xl font-black text-zinc-100">OPTIONS</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto py-6">
        <Section title="Audio">
          <Toggle
            label="Sound"
            desc="UI blips, ambience, and music (master switch)."
            value={settings.sound}
            onChange={(v) => {
              set({ sound: v })
              // Give audible confirmation when enabling. The engine's mute flag
              // syncs via an effect after render, so defer the blip a tick so it
              // isn't swallowed while the flag is still "muted".
              if (v) setTimeout(() => play('toggle'), 0)
              else play('toggle') // still audible: unmute happens on next render
            }}
          />

          <Slider
            label="Master volume"
            value={settings.masterVolume}
            disabled={!settings.sound}
            onChange={(v) => set({ masterVolume: v })}
          />
          <Slider
            label="Music volume"
            value={settings.musicVolume}
            disabled={!settings.sound || !settings.music}
            onChange={(v) => set({ musicVolume: v })}
          />
          <Slider
            label="Effects volume"
            value={settings.sfxVolume}
            disabled={!settings.sound}
            onChange={(v) => set({ sfxVolume: v })}
          />
        </Section>

        <Section title="Music">
          <Toggle
            label="Background music"
            desc="Looping soundtrack while you work a case."
            value={settings.music}
            disabled={!settings.sound}
            onChange={(v) => {
              set({ music: v })
              play('toggle')
            }}
          />

          <div>
            <div className="mb-2 font-display text-lg tracking-wide text-zinc-200">Track</div>
            <div className="space-y-1.5">
              {MUSIC_TRACKS.map((t) => {
                const active = settings.musicTrack === t.key
                return (
                  <button
                    key={t.key}
                    disabled={!settings.sound || !settings.music}
                    onClick={() => {
                      set({ musicTrack: t.key })
                      play('select')
                    }}
                    className={`press flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? 'border-crimson/70 bg-crimson/5'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span>
                      <span className={`text-sm ${active ? 'text-crimson' : 'text-zinc-200'}`}>
                        {t.label}
                      </span>
                      <span className="ml-2 text-xs text-zinc-500">{t.artist}</span>
                    </span>
                    {active && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-crimson">
                        playing
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
              Music by Uppbeat. Add the track files to <code>public/music/</code> — the game
              stays silent until they’re present. See the README there.
            </p>
          </div>
        </Section>

        <Section title="Display">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg tracking-wide text-zinc-200">Text scale</span>
              <span className="text-sm text-zinc-300">{settings.textScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.35"
              step="0.05"
              value={settings.textScale}
              onChange={(e) => set({ textScale: Number(e.target.value) })}
              className="w-full accent-crimson"
            />
          </div>
        </Section>

        <div className="border-t border-zinc-800 pt-6">
          <button
            onClick={() => {
              if (confirm('Erase all progress, notebooks, and unlocks? This cannot be undone.')) {
                play('back')
                game.hardReset()
              }
            }}
            className="press border border-crimson-dim px-4 py-2 text-xs font-bold uppercase tracking-widest text-crimson hover:bg-crimson hover:text-zinc-950"
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">{title}</h2>
      {children}
    </section>
  )
}

function Slider({ label, value, onChange, disabled }) {
  return (
    <div className={disabled ? 'opacity-40' : ''}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display text-lg tracking-wide text-zinc-200">{label}</span>
        <span className="text-sm text-zinc-300">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-crimson disabled:cursor-not-allowed"
      />
    </div>
  )
}

function Toggle({ label, desc, value, onChange, disabled }) {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-40' : ''}`}>
      <div>
        <div className="font-display text-lg tracking-wide text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
      <button
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`press h-7 w-14 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed ${
          value ? 'border-zinc-700 bg-zinc-700' : 'border-zinc-700 bg-zinc-800'
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-zinc-100 transition-transform ${
            value ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
