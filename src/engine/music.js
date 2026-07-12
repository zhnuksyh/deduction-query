/**
 * Background music player. Unlike the procedural effects/ambience (Web Audio),
 * music is a plain looping <audio> element streaming an MP3 from /public/music.
 *
 * The tracks themselves are NOT bundled in the repo — they're Uppbeat music,
 * whose licence requires an account + credit and forbids redistributing the raw
 * files. Drop your downloaded MP3s into public/music/ using the `file` names
 * below (see public/music/README.md). If a file is missing the player just
 * stays silent; the game is fully playable without it.
 */

// Vite serves /public at the app root; `import.meta.env.BASE_URL` respects the
// relative `base` we build with, so this resolves on GitHub Pages subpaths too.
const base = import.meta.env.BASE_URL || '/'

export const MUSIC_TRACKS = [
  {
    key: 'awareness',
    label: 'Awareness',
    artist: 'Simon Folwar',
    file: 'awareness.mp3',
    credit: 'https://uppbeat.io/music/tracks/simon-folwar/awareness',
  },
  {
    key: 'sunshine',
    label: 'Sunshine',
    artist: 'Danijel Zambo',
    file: 'sunshine.mp3',
    credit: 'https://uppbeat.io/music/tracks/danijel-zambo/sunshine',
  },
  {
    key: 'behind-clouds',
    label: 'Behind Clouds',
    artist: 'Tim Schaufert',
    file: 'behind-clouds.mp3',
    credit: 'https://uppbeat.io/music/tracks/tim-schaufert/behind-clouds',
  },
]

function trackByKey(key) {
  return MUSIC_TRACKS.find((t) => t.key === key) || MUSIC_TRACKS[0]
}

let audio = null
let state = {
  enabled: false,
  trackKey: MUSIC_TRACKS[0].key,
  volume: 0.6, // effective volume (master * music), applied to the element
  started: false, // whether a user gesture has let playback begin
}

function ensureAudio() {
  if (audio) return audio
  audio = new Audio()
  audio.loop = true
  audio.preload = 'auto'
  // A missing/unsupported file shouldn't spam the console or break anything.
  audio.addEventListener('error', () => {
    /* file absent or blocked — stay silent */
  })
  return audio
}

function srcFor(key) {
  const t = trackByKey(key)
  return `${base}music/${t.file}`
}

/** Attempt to play; browsers reject until a user gesture, which we swallow. */
function tryPlay() {
  if (!audio) return
  const p = audio.play()
  if (p && typeof p.catch === 'function') p.catch(() => {})
}

/**
 * Reconcile the player with a desired mix. Called on every settings change and
 * once after the first user gesture. Handles: enabling/disabling, switching
 * tracks (only reloads src when the track actually changes), and volume.
 */
export function updateMusic({ enabled, trackKey, volume, gesture = false }) {
  if (gesture) state.started = true
  if (enabled !== undefined) state.enabled = enabled
  if (trackKey !== undefined) state.trackKey = trackKey
  if (volume !== undefined) state.volume = volume

  const a = ensureAudio()
  a.volume = Math.max(0, Math.min(1, state.volume))

  const wantSrc = srcFor(state.trackKey)
  // Compare against the resolved absolute URL the element reports.
  const currentFile = a.src.split('/').pop()
  const wantFile = wantSrc.split('/').pop()
  if (currentFile !== wantFile) {
    a.src = wantSrc
  }

  if (state.enabled && state.started) {
    if (a.paused) tryPlay()
  } else {
    if (!a.paused) a.pause()
  }
}

/** Whether music is currently supposed to be sounding (for ambience gating). */
export function isMusicActive() {
  return state.enabled && state.started
}
