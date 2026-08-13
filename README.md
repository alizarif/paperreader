# PaperBrief

AI-powered paper triage for researchers. Paste a paper or upload a PDF, pick any
[OpenRouter](https://openrouter.ai) model, and get a fast, skimmable brief:

- **TL;DR** — one-sentence punchline
- **Method tags** — DiD, IV, RDD, RCT, structural, …
- **Contribution / Identification / Data / Results / Caveats** — short bullets

Everything is saved (original text + structured brief) to a local SQLite
dashboard you can search and revisit.

Built with [Next.js](https://nextjs.org) 16 (App Router), TypeScript, Tailwind
CSS, `better-sqlite3`, and `unpdf`.

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm run dev   # http://localhost:3000
```

### Configure your OpenRouter key

Open **Settings** (top-right) and paste your OpenRouter API key. It is stored
only in your browser (localStorage) and sent with each request — it is never
written to the database or committed to the repo. Use **Test connection** to
verify it, and pick a default model.

Alternatively, set a server-side fallback in a git-ignored `.env.local`:

```bash
# .env.local  (never committed)
OPENROUTER_API_KEY=sk-or-v1-…
```

## How it works

| Route              | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `/`                | Dashboard of saved briefs (searchable)                   |
| `/new`             | Paste/upload a paper, choose a model, analyze, save      |
| `/papers/[id]`     | A saved brief with the original text side-by-side        |

### API

| Endpoint                 | Method | Description                                    |
| ------------------------ | ------ | ---------------------------------------------- |
| `/api/models`            | GET    | List OpenRouter models                         |
| `/api/analyze`           | POST   | `{ text, model, apiKey }` → structured brief   |
| `/api/extract`           | POST   | multipart `file` (PDF/txt) → extracted text    |
| `/api/papers`            | GET    | List saved briefs                              |
| `/api/papers`            | POST   | `{ brief, model, sourceText }` → save          |
| `/api/papers/[id]`       | GET    | Fetch one saved brief                          |
| `/api/papers/[id]`       | DELETE | Delete a saved brief                           |
| `/api/test-key`          | POST   | `{ apiKey }` → validate the key                |

Data is stored in `data/paperbrief.db` (git-ignored).

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

## Cloud Agent environment

This repository ships a [`.cursor/environment.json`](.cursor/environment.json)
so Cursor Cloud Agents install with `npm ci` and run the dev server
automatically.
