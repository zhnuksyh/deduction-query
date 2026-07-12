# Background music

The game plays a looping background track while you work a case. The tracks are
**not committed to this repo** — they're licensed from [Uppbeat](https://uppbeat.io),
whose licence requires a (free) account, credit, and forbids redistributing the
raw audio files. So you add them yourself.

## How to add the music

1. Sign in to Uppbeat and open each track below.
2. Download the MP3.
3. Drop it into **this folder** (`public/music/`) using the exact filename shown.

| Setting label   | Filename            | Source                                                            |
| --------------- | ------------------- | ----------------------------------------------------------------- |
| Awareness (default) | `awareness.mp3`     | https://uppbeat.io/music/tracks/simon-folwar/awareness            |
| Sunshine        | `sunshine.mp3`      | https://uppbeat.io/music/tracks/danijel-zambo/sunshine            |
| Behind Clouds   | `behind-clouds.mp3` | https://uppbeat.io/music/tracks/tim-schaufert/behind-clouds       |

That's it — the player picks them up automatically. Until a file is present its
track just stays silent; the game is fully playable without music.

## Changing the catalog

The track list lives in [`src/engine/music.js`](../../src/engine/music.js)
(`MUSIC_TRACKS`). Add/rename entries there and update the filenames above to
match. Each entry's `credit` URL is where the required Uppbeat attribution
points.

## Attribution

Per the Uppbeat licence you must credit the tracks you ship. The Credits screen
and this README both point at the source pages above.
