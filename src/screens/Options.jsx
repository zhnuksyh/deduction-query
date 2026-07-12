import { ChevronLeft } from 'lucide-react'

export default function Options({ game }) {
  const { settings } = game.save

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center px-6">
      <header className="mb-8 border-b border-zinc-800 pb-4">
        <button
          onClick={() => game.setScreen('menu')}
          className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          main menu
        </button>
        <h1 className="mt-3 font-display text-4xl font-black text-zinc-100">OPTIONS</h1>
      </header>

      <div className="space-y-6">
        <Toggle
          label="Sound"
          desc="UI blips and confirmations."
          value={settings.sound}
          onChange={(v) => game.setSettings({ sound: v })}
        />

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
            onChange={(e) => game.setSettings({ textScale: Number(e.target.value) })}
            className="w-full accent-crimson"
          />
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <button
            onClick={() => {
              if (confirm('Erase all progress, notebooks, and unlocks? This cannot be undone.')) {
                game.hardReset()
              }
            }}
            className="border border-crimson-dim px-4 py-2 text-xs font-bold uppercase tracking-widest text-crimson hover:bg-crimson hover:text-zinc-950"
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-display text-lg tracking-wide text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`h-7 w-14 rounded-full border transition-colors ${
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
