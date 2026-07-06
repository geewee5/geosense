# GeoSense

A geography learning game. Solve a 3×3 grid where each cell is the intersection of two
country traits (e.g. "Landlocked" × "In Africa"), play the daily puzzle, or drill yourself
in Practice mode.

**100% client-side** — React + Vite, no backend, works offline.

## Play

- **Daily Grid** — one seeded puzzle per day, same for everyone
- **Random Puzzle** — unlimited generated grids
- **Practice** — Country Quiz (pick the traits that apply) and Quick Fire (rapid yes/no)

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Deploy

Pushing to `main` auto-builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`. Enable it once under **Settings → Pages → Source:
GitHub Actions**.

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture and conventions.
