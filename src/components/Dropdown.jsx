import { useEffect, useRef, useState } from 'react'

/**
 * A custom dropdown so we can fully style the trigger AND the popup (native
 * <select> won't let us round/skin the option list). Closes on outside-click
 * or Escape. `tone` picks the border/text accent for graded states.
 */
export default function Dropdown({ value, options, onChange, tone = 'idle', play }) {
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
    // Zero-height anchor centred on the text line. The inner wrapper is the real
    // pill box so the option list can hang directly off the pill's bottom edge.
    <span
      ref={ref}
      className={`relative mx-1.5 inline-flex h-0 w-[8.5rem] align-middle ${open ? 'z-40' : ''}`}
    >
      <span className="absolute left-0 top-1/2 w-full -translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            play?.(open ? 'select' : 'open')
            setOpen((o) => !o)
          }}
          className={`flex w-full items-center justify-center rounded-full border bg-zinc-950 px-4 py-1.5 text-sm transition-colors focus:outline-none ${toneCls}`}
        >
          {/* Non-breaking space keeps a full-height line box when the value is empty. */}
          <span className="leading-normal">{value || ' '}</span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1 w-full origin-top animate-pop-in overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl shadow-black/40">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  play?.('select')
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
    </span>
  )
}
