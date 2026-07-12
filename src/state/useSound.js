import { useCallback, useEffect } from 'react'
import { playSound, setMuted, setSfxVolume, setMusicActive, startAmbience } from '../engine/sound.js'
import { updateMusic, isMusicActive } from '../engine/music.js'

/**
 * Bridges the persisted audio settings to both audio engines (the procedural
 * SFX/ambience engine and the streaming music player) and hands back a stable
 * `play(name)` helper. Muting and the full volume mix are handled centrally, so
 * callers never check flags or levels themselves.
 */
export function useSound(game) {
  const s = game.save.settings
  const {
    sound: enabled,
    music: musicEnabled,
    musicTrack,
    masterVolume,
    musicVolume,
    sfxVolume,
  } = s

  // SFX mute + volume mix.
  useEffect(() => {
    setMuted(enabled)
    setSfxVolume({ master: masterVolume, sfx: sfxVolume })
  }, [enabled, masterVolume, sfxVolume])

  // Background music: reconcile enable/track/volume. Music also gets muted when
  // the master Sound switch is off, so one toggle silences the whole app. Its
  // effective volume is master * music.
  useEffect(() => {
    const musicOn = enabled && musicEnabled
    updateMusic({
      enabled: musicOn,
      trackKey: musicTrack,
      volume: masterVolume * musicVolume,
    })
    // Ambience yields to music whenever music is actually sounding.
    setMusicActive(isMusicActive())
  }, [enabled, musicEnabled, musicTrack, masterVolume, musicVolume])

  // Browsers block audio until a user gesture. On the first interaction, boot
  // the ambience bed and let music begin, then detach the listeners.
  useEffect(() => {
    const start = () => {
      startAmbience()
      const musicOn = enabled && musicEnabled
      updateMusic({
        enabled: musicOn,
        trackKey: musicTrack,
        volume: masterVolume * musicVolume,
        gesture: true,
      })
      setMusicActive(isMusicActive())
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    // Intentionally run once; the reconcile effect above handles later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return useCallback((name) => playSound(name), [])
}
