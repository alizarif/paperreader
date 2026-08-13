# PaperReader

A clean, distraction-free reader for foundational computer science and machine
learning papers. Browse a curated library, search and filter by category, and
open a focused reading view with a live reading-progress indicator.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and
Tailwind CSS.

## Features

- Curated library of classic papers with search and category filters
- Focused reading view with abstract, sections, references, and reading progress
- JSON API at `/api/papers` supporting `q` and `category` query parameters

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm ci        # install dependencies (use `npm install` if there is no lockfile yet)
npm run dev   # start the dev server at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server                 |
| `npm run build` | Create a production build                    |
| `npm run start` | Serve the production build                   |
| `npm run lint`  | Run ESLint                                   |

## API

`GET /api/papers` returns the paper catalog as JSON.

Query parameters:

- `q` — case-insensitive search across title, authors, venue, and tags
- `category` — filter to a single category (e.g. `Machine Learning`)

```bash
curl "http://localhost:3000/api/papers?category=Systems"
```

## Project structure

```
src/
  app/                 App Router pages and API routes
    api/papers/        JSON catalog endpoint
    papers/[id]/       Reading view for a single paper
  components/          UI components (header, library, reading progress)
  data/                Curated paper catalog
```

## Cloud Agent environment

This repository ships a [`.cursor/environment.json`](.cursor/environment.json)
so Cursor Cloud Agents install dependencies with `npm ci` and run the dev
server automatically.
