# devintest

Single-page application foundation built with React, TypeScript, and Vite.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm (repository uses `package-lock.json`)

## Setup

```bash
nvm use          # optional, matches .nvmrc
npm install
npx playwright install --with-deps chromium   # only needed for end-to-end tests
```

## Development

```bash
npm run dev      # Vite dev server on http://localhost:5173
```

## Verification commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Strict TypeScript project build check (`tsc -b`) |
| `npm run lint` | ESLint over the whole repository |
| `npm test` | Vitest + React Testing Library component tests |
| `npm run test:e2e` | Playwright smoke tests (builds and serves the app automatically) |
| `npm run build` | Type check plus production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |

## Folder structure

```
e2e/                     Playwright end-to-end specs
src/
  app/                   App shell, root component, global styles
  features/              One folder per feature; add new features here
    home/                Placeholder home page and its component test
  shared/                Cross-feature components, hooks, and utilities
  test/                  Vitest setup
```

Each feature owns its components, tests, and feature-local logic. Component tests live
next to the component they cover (`HomePage.tsx` / `HomePage.test.tsx`).

## Accessibility

The shell uses semantic landmarks (`header`, `nav`, `main`, `footer`), a visible-on-focus
skip link that moves focus to `main`, and a global `:focus-visible` outline. The home page
content is reachable and operable with the keyboard alone.

## Intentionally not included yet

These were left out to keep the foundation minimal. Suggested landing spots when needed:

- **Routing** (e.g. React Router): mount the router in `src/app/App.tsx` and give each
  route a feature folder under `src/features/`.
- **State management** (e.g. Zustand, Redux Toolkit): start with React state inside a
  feature; promote to a store under `src/app/` (providers) or `src/shared/` only when
  state is genuinely cross-feature.
- **UI framework / design system**: replace `src/app/styles.css` and introduce shared
  primitives under `src/shared/`.
- **API client / data fetching** (e.g. TanStack Query, generated client): add a
  `src/shared/api/` module for transport and per-feature hooks for queries.
- **Authentication**: add a provider in `src/app/` and route guards once routing exists.
- **Mock services** (e.g. MSW): add handlers under `src/test/` and wire them into the
  Vitest setup file and the Playwright web server.
