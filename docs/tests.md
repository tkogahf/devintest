# Frontend Testing Policy for AI Agents

## 1. Purpose

This document defines how an AI agent must choose, implement, and classify tests for this
React/TypeScript frontend.

Classify tests by their **scope** and the system boundary they verify—not by the test runner,
whether they use a browser, or whether they mock HTTP.

The project uses:

- Vitest for unit tests and component/feature integration tests.
- React Testing Library for React interaction tests under Vitest.
- MSW for mocked API behavior, with one set of handlers shared by Vitest and Playwright.
- Playwright for browser integration tests and full-stack E2E tests.

Vitest recommends MSW for request mocking. Playwright also supports mocked API tests; using
Playwright does not require using a real backend. [vitest](https://vitest.dev/guide/mocking/requests)

## 2. Project conventions

### Services

The frontend talks to these services. Mock each one at the address the frontend actually calls.

| Service       | Role                                                                  |
| ------------- | --------------------------------------------------------------------- |
| Local backend | OS actions and other device-local operations                          |
| Hardware APIs | Read and control the physical device (see `docs/hardware.md`)         |
| Cloud APIs    | Remote services, called directly or proxied through the local backend |

When a cloud call goes through the local backend, the frontend's boundary is the local backend:
mock that endpoint, not the cloud API behind it. Mock a cloud API directly only for calls the
frontend makes to it directly.

### File locations

| What                                           | Where                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Unit, component, and feature integration tests | `src/**/*.test.{ts,tsx}`, next to the code under test                                       |
| Tests for route components                     | Prefix with `-` (e.g. `src/routes/sess/home/-HomePage.test.tsx`) so the router ignores them |
| Browser integration tests                      | `e2e/*.spec.ts`                                                                             |
| Shared MSW handlers, by service and domain     | `src/test/mocks/handlers/<service>/<domain>.ts` (e.g. `hardware/vacuum.ts`)                 |
| Shared mock response fixtures                  | `src/test/mocks/fixtures/<service>/<domain>.ts`                                             |
| Vitest MSW server (`msw/node`)                 | `src/test/mocks/server.ts`, started from `src/test/setup.ts`                                |
| Playwright MSW fixture (`@msw/playwright`)     | `e2e/fixtures.ts`                                                                           |

Vitest and Playwright import the same handler and fixture files. Do not create a second set of
mocks for either runner.

### Commands

Use the repo's pnpm scripts; do not invoke tool binaries directly.

- `pnpm test` — Vitest (unit, component, feature integration).
- `pnpm test:e2e` — Playwright (builds the app and serves it with `vite preview`).
- `pnpm check` — format check, lint, typecheck, and Vitest in one step.

### Category names

The category names in this document are concepts, not folders or file suffixes. Do not add
category directories or suffixes such as `.integration.test.ts`. Do not reorganize the test
suite without an explicit request.

## 3. Test categories and tool selection

| Category            | Boundary under test                                                                        | Tools                                                              | When to use                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Unit                | A function or small logic module                                                           | Vitest                                                             | Business rules, validation, transformations, reducers, and edge-case permutations                                          |
| Component           | An isolated React component and its observable behavior                                    | Vitest + React Testing Library                                     | Rendering, local state, validation feedback, enabled/disabled states, and component interactions                           |
| Feature integration | Multiple frontend components, hooks, providers, and request-handling code working together | Vitest + React Testing Library + MSW                               | Data loading, submission, caching/state updates, retries, and API success/error scenarios                                  |
| Browser integration | The running frontend in a real browser with a mocked API                                   | Playwright + `@msw/playwright`; raw Playwright routing when needed | Routing, application wiring, browser interactions, focus, layout-dependent behavior, and representative frontend workflows |
| Full-stack E2E      | A complete user workflow through the frontend and real backend services                    | Playwright + real test backend                                     | Critical workflows, actual frontend/backend compatibility, and persistence                                                 |

Browser integration tests must not be labeled full-stack E2E when the backend is mocked.

## 4. General selection rules

The agent must:

1. Identify the behavior being changed and the failure the test should detect.
2. Choose the smallest category that can meaningfully detect that failure.
3. Add browser coverage when the behavior depends on actual browser interaction or rendering.
4. Add full-stack coverage when the behavior depends on the real backend connection or
   persistence.
5. Avoid reproducing the entire scenario matrix at multiple levels.

Use this allocation as the default:

- Vitest: detailed behavior and edge-case permutations.
- Playwright with mocked APIs: representative whole-app workflows and browser-specific risks.
- Playwright with a real backend: selected critical complete workflows.

Some overlap is intentional, but each overlapping test must establish an additional boundary or
risk.

## 5. Unit tests

### Tools

Vitest.

### Use when

The behavior can be verified without rendering React or making network requests.

Examples:

- Validation and normalization, including Valibot schemas for branded domain values.
- Permission decisions.
- Sorting, filtering, and aggregation.
- Data transformations.
- Reducer transitions.
- Request payload construction implemented as a pure function.

### Agent requirements

- Cover representative valid, invalid, and boundary inputs.
- Prefer explicit input/output assertions.
- Do not render components merely to exercise logic that has a standalone API.
- Do not use MSW unless the code under test actually makes requests.
- Do not add Playwright coverage solely to duplicate a pure-logic test.

## 6. Component tests

### Tools

Vitest + React Testing Library, using the project's configured `jsdom` environment.

### Use when

The behavior belongs to a component and can be verified without loading the whole application.

Examples:

- Validation messages appear after user interaction.
- A submit button is disabled while a submission is pending.
- A selection updates the displayed value.
- A component calls its public callback with the expected value.
- A dialog renders its expected content and controls.

### Agent requirements

- Test through visible output and public interactions.
- Prefer role- and label-based queries.
- Provide only the providers needed by the component.
- Avoid asserting internal React state, private functions, or incidental DOM structure.
- Use spies for public callback contracts when appropriate; do not replace every collaborating
  component with a mock.

User-visible assertions reduce dependence on implementation details.
[playwright](https://playwright.dev/docs/best-practices)

### Boundary limitation

A simulated interaction does not establish real browser geometry or hit-testing. `jsdom` has no
layout. Tests involving position, overlap, or actual pointer targeting require browser coverage.
[testing-library](https://testing-library.com/docs/user-event/pointer)

## 7. Feature integration tests

### Tools

Vitest + React Testing Library + MSW (`msw/node`).

### Use when

The test must verify several frontend parts working together, including normal request-handling
code.

Examples:

- Fetching data and rendering a feature.
- Loading, empty, and error states.
- Form submission and frontend state updates.
- API validation errors.
- Retry behavior.
- Request payloads and query parameters.

### Agent requirements

- Render the feature with the relevant real providers and hooks.
- Let the application use its normal request path (`request()` and the endpoint's schema).
- Mock the API boundary with MSW instead of replacing the API client or data-fetching hook.
- Define the scenario's expected API responses explicitly.
- Reset scenario-specific handlers between tests.
- Fail on unexpected API requests (`onUnhandledRequest: 'error'`), subject to explicit
  project-approved exceptions.
- Assert user-visible outcomes.
- Assert request contents when those contents are part of the behavior being verified.

MSW supports mocked responses, request-dependent handling, passthrough, and network-error
simulation.

### TanStack Query isolation

- Create a new `QueryClient` for each test and provide it with `QueryClientProvider`.
- Disable retries in that client (`defaultOptions: { queries: { retry: false } }`) unless the
  test verifies retry behavior. Default retries with backoff make error tests slow or time out.
- Hooks and actions must reach the client through `useQueryClient()`. Code that imports the
  singleton from `src/api/queryClient.ts` shares its cache across tests and cannot be isolated;
  flag it rather than working around it in the test.

### API error scenarios

Every response must pass its endpoint's Valibot schema, so rejection of invalid responses is
behavior to test. `request()` reports failures as `ApiError` with a `type` and an error stage:

| Scenario             | MSW response                               | Expected result                                   |
| -------------------- | ------------------------------------------ | ------------------------------------------------- |
| Network failure      | `HttpResponse.error()`                     | `type: 'network'`, stage `fetch`                  |
| Body is not JSON     | `new HttpResponse('not json')`             | `type: 'parse'`, stage `body_decode`              |
| Wrong response shape | `HttpResponse.json({ unexpected: true })`  | `type: 'parse'`, stage `schema_validation`        |
| HTTP error status    | `HttpResponse.json(body, { status: 500 })` | No separate check: the result depends on the body |

`request()` does not check `response.ok`, so status codes are not a distinct error path. The
`response_read` stage (body stream failing mid-read) cannot be simulated reliably with MSW.

### Mock limits

- `HttpResponse.error()` is a network failure, not an HTTP error response.
- `delay()` slows a response but never causes a timeout. Use `delay('infinite')` to hold a
  loading state; test timeout or abort logic with fake timers.
- CORS is not enforced under `msw/node`.

### Mock data

- Mock responses must pass the endpoint's real schema. Type fixtures with
  `v.InferInput<typeof Schema>` so schema changes break them at compile time.
- Do not cast fixtures to branded types; produce them by parsing or from valid literals.

### Coverage ownership

This category should own most API-response permutations. Do not repeat every error case in
Playwright unless the scenario introduces a browser-specific or whole-app risk.

## 8. Browser integration tests

### Tools

Playwright + `@msw/playwright`, using the shared handlers from `src/test/mocks/handlers/`.

`@msw/playwright` applies MSW handlers through Playwright's network routing. It needs no service
worker and no test-only build, and per-test overrides are scoped to that test's page, so it is
safe with `fullyParallel: true`. [github](https://github.com/mswjs/playwright)

Do not use MSW's browser service worker (`mockServiceWorker.js`) or a standalone mock HTTP server
for these tests. A standalone server is one process shared by all parallel tests, so overrides
leak between them.

### Use when

The running application or real browser behavior is part of the risk.

Examples:

- Navigation through application routes.
- Direct entry to a route.
- Application-level provider and page wiring.
- Focus entering and leaving dialogs.
- Keyboard navigation.
- Virtual-keyboard interaction and focus retention.
- Pointer targeting, overlays, scrolling, and layout-dependent behavior.
- Representative workflows through multiple pages.

Real-browser tests address layout and interaction boundaries that `jsdom` cannot establish.
[playwright](https://playwright.dev/docs/best-practices)

### Agent requirements

- Use the shared fixture from `e2e/fixtures.ts`; override handlers per test through it.
- Configure unhandled API requests to fail the test.
- Navigate to the running application instead of reconstructing it in the test.
- Prefer accessible locators.
- Assert visible outcomes.
- Use normal browser interactions rather than synthetic event dispatch.
- Do not use forced interactions merely to make a failing test pass.
- Keep API scenarios deterministic and isolated.
- Do not claim backend compatibility or persistence from mocked responses.

### When to use raw Playwright routing

Use `page.route()` or `browserContext.route()` directly only when the test requires:

- Interception of the initial document navigation before application startup.
- Named browser network failures through `route.abort(errorCode)`.
- Modification and continuation of the original outgoing request.

Ordinary API responses and errors belong in MSW handlers. Do not mock the same request with both
an MSW handler and a raw route in one test. [playwright](https://playwright.dev/docs/network)

## 9. Full-stack E2E tests

**Status: not set up.** No test backend is configured. Do not add full-stack tests until one is.

### Tools

Playwright + real backend services in an isolated test environment.

### Real-service safety

Real services have real side effects:

- Hardware APIs actuate the physical device (for example, enabling the vacuum).
- The local backend performs OS actions on the machine it runs on.
- Cloud APIs may write to shared data used by other devices or people.

Rules:

- Never run tests that send commands to a real device, OS, or cloud environment unless the user
  explicitly authorizes it for that run.
- Builds used for mocked tests must not point any service address at a real service, so a
  missing handler cannot reach one.
- Declare which services are real and which are mocked in each full-stack suite.

### Use when

The test must establish that a complete user workflow works across the actual frontend/backend
boundary.

### Agent requirements

- Use the real services declared as part of the test boundary.
- Do not mock the backend calls whose integration the test is meant to verify.
- Create isolated test data and clean it up according to project policy.
- Avoid depending on shared mutable records.
- Verify persisted outcomes through a fresh retrieval when persistence is the requirement.
- Document any excluded or mocked external dependencies.

### Coverage ownership

Keep this suite focused on critical workflows. Detailed frontend validation and API-response
matrices belong in lower-level tests.

## 10. Intentional overlap example

For a "Set vacuum level" feature, assign coverage as follows:

| Category            | Responsibility                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Unit                | Validate the level range with its Valibot schema                                                     |
| Component           | Render the control, its disabled state, and validation feedback                                      |
| Feature integration | Send the correct request; handle success, network failure, and invalid responses                     |
| Browser integration | Navigate to the console; adjust the level; verify focus and the visible result with mocked responses |
| Full-stack E2E      | Only with explicit authorization: set the level on a test device and read it back                    |

Do not repeat all validation and error permutations in every category.

## 11. Test isolation and mock policy

The agent must:

- Use explicit fixtures and scenario-specific data.
- Reset handlers, spies, and test state between tests.
- Keep shared MSW handlers separate from per-test overrides.
- Prevent parallel tests from modifying shared scenario state.
- Avoid treating agreement between a mock and frontend code as proof of the real backend
  contract.

Tests must not depend on execution order or on a previous test's data.

## 12. Completion checklist for the AI agent

Before completing a testing change, verify:

- [ ] The category matches the boundary actually exercised.
- [ ] The test detects the intended regression.
- [ ] Browser-dependent behavior has real-browser coverage where necessary.
- [ ] Mocked-backend coverage is not presented as real-backend verification.
- [ ] Assertions primarily verify observable behavior.
- [ ] Mocking does not replace the integration the test claims to exercise.
- [ ] Mocks use the shared handlers and fixtures, and fixtures pass the endpoint schemas.
- [ ] Each Vitest test uses its own `QueryClient`.
- [ ] No test reaches a real device, OS, or cloud service without explicit authorization.
- [ ] Cloud calls proxied through the local backend are mocked at the local backend.
- [ ] Overlapping coverage has a distinct purpose.
- [ ] `pnpm check` (and `pnpm test:e2e` when relevant) was run, or limitations were stated.

In the implementation summary, report the categories added or changed, the boundaries mocked,
and the test execution results.
