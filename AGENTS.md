# Frontend agent guide

## Workflow
- Read relevant code and `package.json` before editing. Follow existing patterns and keep the diff scoped.
- Use pnpm and preserve the lockfile. Add dependencies only when needed.
- Do not edit generated files, including `src/routeTree.gen.ts` if present.

## Boundaries
- Components import feature-facing hooks, actions, and components for shared state, remote data, and navigation; do not import Tanstak Store or TanStack Query directly in presentation components.
- Keep library-specific imports in their owning store, query, router, or adapter modules. Route files may use TanStack Router APIs directly.
- Define boundaries around app behavior, not one-to-one wrappers around library APIs. Preserve useful TypeScript inference; do not hide route parameters or query states behind `any`.
- TanStack Query owns remote data; Tanstack Store owns shared client state; keep local state in components and URL state in the router. Do not duplicate query data in Tanstack Store.
- Treat API responses as untrusted: every response body must pass its endpoint's Valibot schema before reaching app code. Reject invalid responses; do not silently cast or salvage them.
- Define branded domain values with reusable Valibot schemas; infer their types with `v.InferOutput`. Parse untrusted input at boundaries; do not cast it to a brand.

## Verification
- Run `pnpm check` to execute format check, lint, typecheck, and unit tests in one step. Run individual scripts (`pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`) when debugging a specific check.
- Run `pnpm build` to verify the production build separately.
- Run `pnpm test:e2e` when changing navigation or user workflows. Add or update focused tests for behavior changes.
- Always use the repo's actual pnpm scripts; do not invoke tool binaries directly.
- Report checks run, failures, skipped checks, and remaining risks.

## File size
- Aim for ≤100 lines per hand-written source file and ≤100 characters per line.
- Split by responsibility, not merely to satisfy a count; keep tightly coupled code together.
- Follow Oxfmt output. Long URLs, strings, and generated files may exceed the targets.
- If a file must exceed 100 lines, keep it cohesive; do not add pass-through files.
