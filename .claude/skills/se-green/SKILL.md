---
name: developer-green
description: Implements minimal code to make failing tests pass (Green phase of Red-Green-Refactor). Use when the user explicitly asks to make tests pass, implement to green, or apply developer-green after developer-red.
---

# Developer Green

Implements minimal production code so that existing failing tests pass. Complements developer-red, which scaffolds failing tests.

## Prerequisites

- Failing unit tests in `src/**/*.spec.ts` and/or UI tests in `tests/**/*.spec.ts`
- Requirements (user story with acceptance criteria) when available

## Workflow

0. **Run tests** – `npm test` and `npx playwright test`; capture failure messages
1. **Parse failures** – Identify what each test expects (assertions, selectors, behavior)
2. **Implement minimally** – Add the smallest amount of production code to satisfy each failing test
3. **Verify** – Re-run tests until all pass
4. **Build** – Ensure `npm run build` succeeds

## Principles

- **Minimal** – Only add code that makes tests pass; avoid speculative features
- **Don’t change tests** – Fix implementation, not expectations (unless the test is wrong)
- **One test at a time** – Prefer incremental fixes so failures remain understandable

## Angular Implementation (unit tests)

- Follow **Angular 20 best practices**: standalone components, signals, native control flow (`@if`, `@for`, `@switch`), `input()` / `output()`, OnPush
- For **components**: add template bindings, handlers, and logic to satisfy expectations
- For **services**: add methods, HTTP calls (mock in tests), and return values
- Use `TestBed` and `HttpClientTestingModule` / `provideHttpClientTesting()` as already configured in specs

## Playwright Implementation (UI tests)

- Ensure routes exist in `app.routes.ts`
- Add links, buttons, forms, and navigation the UI tests expect
- Use stable selectors: `getByRole`, `getByLabelText`, `getByText` over brittle class/ID selectors

## Test Commands

- Unit: `npm test`
- UI: `npx playwright test` (dev server must run: `npm start`)

## Output Checklist

- [ ] All unit tests pass (`npm test`)
- [ ] All Playwright tests pass (`npx playwright test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Code follows AGENTS.md style (Angular 20, signals, OnPush)

## Next Step

After all tests pass: apply **developer-ui-ux** to polish layout, accessibility, responsiveness, and visual design.
