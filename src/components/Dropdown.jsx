import { useEffect, useRef, useState } from 'react'

/**
 * A custom dropdown so we can fully style the trigger AND the popup (native
 * <select> won't let us round/skin the option list). Closes on outside-click
 * or Escape. `tone` picks the border/text accent for graded states.
 */
export default function Dropdown({ value, options, onChange, tone = 'idle', placeholder = ' ' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toneCls =
    tone === 'right'
      ? 'border-zinc-300 text-zinc-100'
      : tone === 'wrong'
        ? 'border-crimson text-crimson'
        : 'border-zinc-600 text-zinc-100 hover:border-zinc-400'

  return (
    <span ref={ref} className="relative mx-1 inline-block" style={{ verticalAlign: 'middle' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-w-[8.5rem] items-center justify-center rounded-full border bg-zinc-950 px-4 py-2 text-sm leading-none transition-colors focus:outline-none ${toneCls}`}
      >
        <span className={value ? '' : 'text-zinc-600'}>{value || placeholder}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl shadow-black/40">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={`block w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-800 ${
                opt === value ? 'text-zinc-100' : 'text-zinc-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </span>
  )
}
