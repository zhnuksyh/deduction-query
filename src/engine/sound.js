/**
 * Procedural sound engine. Every effect is synthesized with the Web Audio API
 * at play time — there are NO audio asset files, which keeps the zero-barrier,
 * $0-hosting pillar intact (nothing extra to download, no binaries in the repo).
 *
 * The engine is a lazy singleton: the AudioContext is only created on the first
 * sound, and only after a user gesture (browsers block audio before that). A
 * muted flag lets the Options "Sound" toggle silence everything cheaply.
 */

let ctx = null
let master = null
let muted = false

function ensureContext() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.18 // keep the whole palette gentle
  master.connect(ctx.destination)
  return ctx
}

export function setMuted(value) {
  muted = !value // callers pass the "sound enabled" flag
}

/**
 * Play a single oscillator "voice" with a short attack/decay envelope.
 * All of the named effects below are built from one or more of these.
 */
function tone({ freq, type = 'sine', start = 0, dur = 0.12, gain = 1, glideTo = null }) {
  if (!ctx || !master) return
  const t0 = ctx.currentTime + start
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo != null) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)

  // Fast attack, exponential decay — reads as a clean digital "blip".
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

// The sound palette. Each entry is a small composition of tones.
const EFFECTS = {
  // Light UI feedback.
  hover: () => tone({ freq: 620, type: 'sine', dur: 0.05, gain: 0.35 }),
  click: () => tone({ freq: 420, type: 'triangle', dur: 0.08, gain: 0.7, glideTo: 300 }),
  tab: () => tone({ freq: 520, type: 'triangle', dur: 0.09, gain: 0.6, glideTo: 660 }),
  toggle: () => tone({ freq: 700, type: 'square', dur: 0.06, gain: 0.4 }),
  back: () => tone({ freq: 360, type: 'triangle', dur: 0.1, gain: 0.6, glideTo: 240 }),

  // Dropdown interactions.
  open: () => tone({ freq: 480, type: 'sine', dur: 0.07, gain: 0.4, glideTo: 600 }),
  select: () => tone({ freq: 560, type: 'triangle', dur: 0.08, gain: 0.5 }),

  // SQL run + results.
  run: () => {
    tone({ freq: 300, type: 'square', dur: 0.05, gain: 0.4 })
    tone({ freq: 460, type: 'square', start: 0.05, dur: 0.06, gain: 0.4 })
  },
  success: () => {
    // A rising two-note "query returned rows" confirmation.
    tone({ freq: 523, type: 'sine', dur: 0.1, gain: 0.6 })
    tone({ freq: 784, type: 'sine', start: 0.08, dur: 0.14, gain: 0.55 })
  },
  error: () => {
    // A low, dissonant buzz for a failed query.
    tone({ freq: 180, type: 'sawtooth', dur: 0.18, gain: 0.5, glideTo: 120 })
    tone({ freq: 174, type: 'square', start: 0.02, dur: 0.16, gain: 0.25 })
  },

  // The game's key moments.
  unlock: () => {
    // Bright ascending arpeggio — "clue verified".
    tone({ freq: 659, type: 'sine', dur: 0.12, gain: 0.6 })
    tone({ freq: 880, type: 'sine', start: 0.09, dur: 0.12, gain: 0.6 })
    tone({ freq: 1175, type: 'sine', start: 0.18, dur: 0.18, gain: 0.55 })
  },
  solved: () => {
    // A four-note fanfare for CASE CLOSED.
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) =>
      tone({ freq: f, type: 'triangle', start: i * 0.11, dur: 0.22, gain: 0.6 }),
    )
    tone({ freq: 1568, type: 'sine', start: 0.44, dur: 0.4, gain: 0.4 })
  },
}

/**
 * Play a named effect. No-op when muted or when the effect is unknown. The
 * first call after a user gesture lazily boots (and resumes) the AudioContext.
 */
export function playSound(name) {
  if (muted) return
  const c = ensureContext()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  const effect = EFFECTS[name]
  if (effect) {
    try {
      effect()
    } catch {
      // Never let an audio glitch break gameplay.
    }
  }
}
