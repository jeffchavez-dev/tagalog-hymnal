# Awit ng Pagpuri

A Tagalog hymnal app for the Reformed Baptist Association of Churches in Luzon. It holds all 251 hymns of the printed *Awit ng Pagpuri* hymnbook and works offline once loaded.

It's a single static page: no build step, no framework, no backend.

## Features

- **Browse** the hymns by section, in the hymnbook's order.
- **Search** by title, first line, lyrics, or English hymn name. Type `#126` to jump to a hymn by number.
- **Bookmarks** (★) and **playlists** for a service order.
- **Adjustable text size** (A− / A+).
- **Piano playback** for hymns that have a MIDI file.
- **Installable and offline.** A service worker caches the page, lyrics and fonts.

Bookmarks, playlists and text size are saved in the browser's `localStorage`. They stay on that device.

## Run it locally

Any static file server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` straight from disk won't work, because the page loads `awit-hymnal.json` over HTTP.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: markup, styles and script |
| `awit-hymnal.json` | All hymn data |
| `sw.js` | Service worker (offline cache) |
| `manifest.json` | PWA manifest |
| `fonts/` | Droid Serif, bundled for offline use |
| `midi/` | MIDI files for playback |

## Hymn data

`awit-hymnal.json` is `{ "awit": [ ... ] }`, one object per hymn:

```json
{
  "id": "1",
  "collection": "awit",
  "title": "HARI'Y SAMBAHIN",
  "english_tune": "O Worship the King",
  "meter": "10 10 11 11",
  "section": "Panawagan Sa Pagsamba",
  "part": "Pagsamba't Papuri",
  "firstLine": "Hari'y sambahin ng kalangitan",
  "midi_collection": "trinity",
  "midi_id": "2",
  "text": "1 Hari'y sambahin ng kalangitan\n..."
}
```

- `english_tune`: the English hymn the text is set to (the line in parentheses under the title in the book). `null` when the book gives none.
- `section`: the book's subsection, shown as the list headers. `part` is the larger division it belongs to.
- `text`: stanzas separated by a blank line. Each verse starts with its number; a refrain starts with `Refrain:`.
- `midi_collection` + `midi_id`: points to `midi/<collection>_h<id>.mid`. Both `null` when there's no music.

The lyrics were transcribed from a scan of the printed hymnbook.

### Known gaps

- **Hymns 125–131.** The scan is missing one spread. Hymn 125 has verse 1 only, 126–130 have titles only, and 131 has verse 5 only. Each says so in its text. Fill them in from the printed book when it's available.
- **App icons.** `manifest.json` lists `icon-192.png` and `icon-512.png`, which aren't in the repo yet.

## Updating

**After any change to `awit-hymnal.json` or `index.html`, bump `CACHE` in `sw.js`** (e.g. `awit-v2` → `awit-v3`). The service worker serves its cached copy first, so installed copies won't see your change until the cache name changes.

To add music to a hymn, put the file in `midi/` as `<collection>_h<number>.mid` and set that hymn's `midi_collection` and `midi_id`. MIDI playback loads `midi-player-js` and a piano soundfont from a CDN the first time it's used, so it needs a connection then.
