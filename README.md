# Digital Museum

A virtual art museum built as a single-page React app — cinematic entrance, nine themed rooms, an
immersive zoom/pan artwork viewer, guided tours, a "Curator mode" for building your own exhibitions,
and a personal journey/achievements system. Everything is kept in your browser's local storage;
there is no backend and no account.

## Running it

```bash
npm install
npm run dev
```

Then open the local address Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview   # serves the built dist/ folder locally
```

## Stack

React 18 · Vite · Tailwind CSS · Framer Motion · React Router · Recharts · Lucide icons · the Web
Audio API · browser `localStorage`.

## How it's organised

```
src/
  data/         The collection: 46 artworks, 27 artists, 9 rooms, 8 periods,
                3 exhibitions, 4 guided tours, 10 achievements, 5 ambient tracks.
  hooks/        Standalone store hooks (favourites, recently viewed, progress,
                settings, audio, curator exhibitions), each backed by one
                namespaced localStorage key.
  context/      MuseumProvider composes the hooks above into one context and
                adds the things that don't belong to any single store — toasts,
                the command palette, compare tray, achievement unlocking.
  components/   UI grouped by what it's for: artwork/, gallery/, museum/,
                navigation/, search/, timeline/, audio/, layout/, ui/.
  pages/        One file per route, wired up with React.lazy in App.jsx.
  utils/        images.js, search.js, recommendations.js, dateUtils.js,
                storage.js (the only file that touches localStorage directly).
```

## A few deliberate substitutions, and why

**Ambient audio is synthesised, not streamed.** Rather than shipping or fetching audio files, the
five ambient tracks are generated live with the Web Audio API — filtered noise, detuned drones and
occasional sparkle tones. It means no audio assets to host or license, and the `AudioContext` is
only ever created after a real user gesture (a click or key press), which respects browser autoplay
policy instead of fighting it.

**Photographs come from Wikimedia Commons, with a guaranteed fallback.** Every historical artwork
image is requested through Commons' stable `Special:FilePath` redirect for a public-domain file, so
there's no API key and no backend. Because a file could theoretically be renamed upstream,
`SmartImage` catches load failures and falls back to a deterministic generated placeholder — seeded
from the artwork's id, so it's always the same placeholder for the same work — rather than ever
showing a broken-image icon.

**The Digital & Contemporary room is not real art history.** Those nine pieces are vector
compositions generated in the browser from a seed. They're labelled as demonstration works
everywhere they appear — in the room description, the artist entry, and each work's own label —
specifically so the museum never implies a false provenance for them.

## Attribution and accuracy

Every historical artwork is in the public domain. Factual fields — date, medium, dimensions,
holding location — follow the standard museum record for that work. Any interpretive reading is
confined to each artwork's "Curator's note," which the interface always labels as an interpretation
rather than a fact.

## Data and privacy

Favourites, recently viewed works, your own curated exhibitions, achievement progress and your
settings are all stored under namespaced keys in this browser's `localStorage` — nothing is sent to
a server. Settings → Data lets you export everything as a JSON backup, re-import it (validated
before anything is written), or clear it all.
