/**
 * Angled folder tabs echoing the reference: each tab is a slanted parallelogram,
 * the active one filled dark with a crimson underline, inactive ones pale.
 */
export default function TabBar({ tabs, active, onSelect }) {
  return (
    <div className="relative flex items-end gap-1 border-b-2 border-zinc-100 bg-zinc-950 px-4 pt-2">
      {tabs.map((t) => {
        const isActive = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            className={`relative -mb-0.5 px-7 py-2.5 font-display text-xs font-bold tracking-widest transition-colors ${
              isActive
                ? 'z-10 bg-zinc-950 text-zinc-100'
                : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
            style={{
              // Angled left edge like a manila folder tab.
              clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)',
            }}
          >
            {t.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-crimson" />
            )}
          </button>
        )
      })}
    </div>
  )
}
