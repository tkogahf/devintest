# Frontend Testing Policy for AI Agents

## 1. Purpose

This document defines how an AI agent must choose, implement, and classify tests for a React/TypeScript frontend.

Classify tests by their **scope** and the system boundary they verify—not by the test runner, whether they use a browser, or whether they mock HTTP.

The project uses:

- Vitest for unit tests and component/feature integration tests.
- React Testing Library for React interaction tests under Vitest.
- MSW for mocked API behavior.
- Playwright for browser integration tests and full-stack E2E tests.

Vitest recommends MSW for request mocking. Playwright also supports mocked API tests; using Playwright does not require using a real backend. [vitest](https://vitest.dev/guide/mocking/requests)

## 2. Test categories and tool selection

The following table defines this project’s testing conventions.

| Category | Boundary under test | Tools | When to use |
|---|---|---|---|
| Unit | A function or small logic module | Vitest | Business rules, validation, transformations, reducers, and edge-case permutations |
| Component | An isolated React component and its observable behavior | Vitest + React Testing Library | Rendering, local state, validation feedback, enabled/disabled states, and component interactions |
| Feature integration | Multiple frontend components, hooks, providers, and request-handling code working together | Vitest + React Testing Library + MSW | Data loading, submission, caching/state updates, retries, and API success/error scenarios |
| Browser integration | The running frontend in a real browser, usually with a mocked API | Playwright + MSW; Playwright routing when needed | Routing, application wiring, browser interactions, focus, layout-dependent behavior, and representative frontend workflows |
| Full-stack E2E | A complete user workflow through the frontend and real backend services within the declared test boundary | Playwright + real test backend | Critical workflows, actual frontend/backend compatibility, authentication integration, and persistence |

Browser integration tests must not be labeled full-stack E2E when the backend is mocked. Record the tested boundary explicitly in suite documentation.

## 3. General selection rules

The agent must:

1. Identify the behavior being changed and the failure the test should detect.
2. Choose the smallest category that can meaningfully detect that failure.
3. Add browser coverage when the behavior depends on actual browser interaction or rendering.
4. Add full-stack coverage when the behavior depends on the real backend connection or persistence.
5. Avoid reproducing the entire scenario matrix at multiple levels.

Use this allocation as the default:

- Vitest: detailed behavior and edge-case permutations.
- Playwright with mocked APIs: representative whole-app workflows and browser-specific risks.
- Playwright with a real backend: selected critical complete workflows.

Some overlap is intentional, but each overlapping test must establish an additional boundary or risk.

## 4. Unit tests

### Tools

Vitest.

### Use when

The behavior can be verified without rendering React or making network requests.

Examples:

- Validation and normalization.
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

## 5. Component tests

### Tools

Vitest + React Testing Library, using the project’s configured DOM environment.

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
- Use spies for public callback contracts when appropriate; do not replace every collaborating component with a mock.

User-visible assertions reduce dependence on implementation details. [playwright](https://playwright.dev/docs/best-practices)

### Boundary limitation

A simulated interaction does not establish real browser geometry or hit-testing. `jsdom` has no layout. Tests involving position, overlap, or actual pointer targeting require browser coverage. [testing-library](https://testing-library.com/docs/user-event/pointer)

## 6. Feature integration tests

### Tools

Vitest + React Testing Library + MSW.

### Use when

The test must verify several frontend parts working together, including normal request-handling code.

Examples:

- Fetching data and rendering a feature.
- Loading, empty, and error states.
- Form submission and frontend state updates.
- API validation errors.
- Permission failures.
- Retry behavior.
- Request payloads and query parameters.

### Agent requirements

- Render the feature with the relevant real providers and hooks.
- Let the application use its normal request path.
- Mock the API boundary with MSW instead of replacing the API client or data-fetching hook.
- Define the scenario’s expected API responses explicitly.
- Reset scenario-specific handlers between tests.
- Fail on unexpected API requests, subject to explicit project-approved exceptions.
- Assert user-visible outcomes.
- Assert request contents when those contents are part of the behavior being verified.

MSW supports mocked responses, request-dependent handling, passthrough, and network-error simulation. Vitest recommends it for request mocking. [vitest](https://vitest.dev/guide/mocking/requests)

### Coverage ownership

This category should own most API-response permutations. Do not repeat every status-code case in Playwright unless the scenario introduces a browser-specific or whole-app risk.

## 7. Browser integration tests

### Tools

Playwright + MSW as the default for mocked API scenarios.

Use Playwright routing when the test needs a capability that MSW’s browser integration does not provide equivalently.

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

Playwright recommends testing user-visible behavior. Real-browser tests address layout and interaction boundaries that `jsdom` cannot establish. [playwright](https://playwright.dev/docs/best-practices)

### Agent requirements

- Navigate to the running application instead of reconstructing it in the test.
- Prefer accessible locators.
- Assert visible outcomes.
- Use normal browser interactions rather than synthetic event dispatch when testing actual interaction behavior.
- Do not use forced interactions merely to make a failing test pass.
- Keep API scenarios deterministic and isolated.
- Document that the backend is mocked.
- Do not claim backend compatibility or persistence from mocked responses.

### MSW setup requirements

When using browser-based MSW:

- Initialize MSW before the application makes its initial API requests.
- Keep service workers enabled.
- Do not assign MSW and Playwright routing to mock the same requests.

Playwright routing may not see requests already handled by a service worker. Blocking service workers is incompatible with using MSW’s browser worker. [playwright](https://playwright.dev/docs/network)

### When to use Playwright routing instead

Use `page.route()` or `browserContext.route()` when the test requires:

- Interception of the initial document navigation before application startup.
- Named browser network failures through `route.abort(errorCode)`.
- Modification and continuation of the original outgoing request.
- Request modification followed by handoff to another route handler.

Ordinary API errors and response bodies do not require switching away from MSW. MSW can simulate generic network failures, but Playwright exposes specific abort codes and direct request-control APIs. [mswjs](https://mswjs.io/docs/http/mocking-responses/network-errors)

The `@msw/playwright` integration is a separate option that uses Playwright routing with MSW handlers. Follow the project’s chosen integration rather than mixing interception strategies ad hoc. [github](https://github.com/mswjs/playwright)

## 8. Full-stack E2E tests

### Tools

Playwright + real backend services in an isolated test environment.

### Use when

The test must establish that a complete user workflow works across the actual frontend/backend boundary.

Examples:

- Authentication followed by access to a protected workflow.
- Creating a record and retrieving it after reload.
- Updating data and confirming the persisted result.
- A critical multi-step workflow involving backend processing.

### Agent requirements

- Use the real services declared as part of the test boundary.
- Do not mock the backend calls whose integration the test is meant to verify.
- Create isolated test data and clean it up according to project policy.
- Avoid depending on shared mutable records.
- Verify persisted outcomes through a fresh retrieval when persistence is the requirement.
- Document any excluded or mocked external dependencies.
- Do not run write-capable tests against production unless an explicit project policy authorizes them.

### Coverage ownership

Keep this suite focused on critical workflows and meaningful integration risks. Detailed frontend validation and API-response matrices belong primarily in lower-level tests.

## 9. Intentional overlap example

For a “Create project” feature, assign coverage as follows:

| Category | Responsibility |
|---|---|
| Unit | Validate project names and construct payloads |
| Component | Render field errors and disabled states |
| Feature integration | Submit the correct request; handle success, validation errors, permission errors, and retries |
| Browser integration | Navigate to the feature; open the dialog; interact with the form; verify focus and the visible result using mocked responses |
| Full-stack E2E | Create a project through the real backend, reload, and verify the saved project is retrieved |

Do not repeat all validation and server-error permutations in every category.

## 10. Test isolation and mock policy

The agent must:

- Use explicit fixtures and scenario-specific data.
- Reset handlers, spies, and test state between tests.
- Keep shared MSW handlers separate from per-test overrides.
- Prevent parallel tests from modifying shared scenario state.
- Declare whether the suite uses mocked or real APIs.
- Avoid treating agreement between a mock and frontend code as proof of the real backend contract.
- Follow existing repository conventions for setup, naming, and file placement.

Tests must not depend on execution order or on a previous test’s data.

## 11. Naming conventions

Use category names that communicate the boundary:

- `unit`
- `component`
- `feature-integration`
- `browser-integration`
- `e2e`

These names are project conventions, not requirements imposed by Vitest or Playwright.

If the repository already uses different names, preserve those conventions and document the equivalent boundaries. Do not reorganize the test suite without an explicit request.

## 12. Completion checklist for the AI agent

Before completing a testing change, verify:

- [ ] The category matches the boundary actually exercised.
- [ ] The test detects the intended regression.
- [ ] The chosen tool is appropriate for that boundary.
- [ ] Browser-dependent behavior has real-browser coverage where necessary.
- [ ] Mocked-backend coverage is not presented as real-backend verification.
- [ ] Assertions primarily verify observable behavior.
- [ ] Mocking does not replace the integration the test claims to exercise.
- [ ] Test data and handlers are isolated.
- [ ] Overlapping coverage has a distinct purpose.
- [ ] The relevant tests were run, or execution limitations were stated accurately.

In the implementation summary, report the categories added or changed, the boundaries mocked, and the test execution results.