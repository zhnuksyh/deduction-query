/**
 * localStorage-backed save system. Everything is client-side, so a player's
 * progress, notebook text, and unlocked levels live entirely in the browser.
 */

const KEY = 'deductive-query:save:v1'

const DEFAULT_STATE = {
  // Case ids that have been fully solved (report submitted correctly).
  solvedCases: [],
  // Per-case detective's notebook text, keyed by case id.
  notebooks: {},
  // Per-case set of unlocked report blanks, keyed by case id -> string[].
  unlocks: {},
  // Last case the player opened, for CONTINUE.
  lastCaseId: null,
  settings: {
    sound: true,
    textScale: 1,
    crt: true,
  },
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(DEFAULT_STATE), ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) } }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked (private mode): fail silently, game still playable.
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  return structuredClone(DEFAULT_STATE)
}
