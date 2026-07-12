import { useCallback, useEffect } from 'react'
import { playSound, setMuted } from '../engine/sound.js'

/**
 * Bridges the persisted `settings.sound` flag to the audio engine and hands
 * back a stable `play(name)` helper. Any component can call `play('unlock')`,
 * `play('click')`, etc. — muting is handled centrally, so callers never check
 * the flag themselves.
 */
export function useSound(game) {
  const enabled = game.save.settings.sound

  // Keep the engine's mute state in sync with the setting.
  useEffect(() => {
    setMuted(enabled)
  }, [enabled])

  return useCallback((name) => playSound(name), [])
}
