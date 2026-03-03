---
name: se-red
description: Takes existing requirements and UI tests (Playwright) following Red-Green-Refactor and Gherkin-style descriptions. Use only when the user explicitly asks to scaffold tests, generate tests from requirements, or apply se-red.
---

# SE Red

## Context Recovery

- If you lack context about what to do or to test, ask the user to run `/re-context-recovery` to load the requirement.

## Prerequisites

- Requirements as user story with acceptance criteria in Given/When/Then format
- Target component, service, or feature area

## Limits

- Do not remove existing `spec.ts` files.

## Workflow

1. **Ask for number of UI Tests** - We are in a workshop. Ask the attendee how many tests at max should be generated. Recommend to start with one test.
1. **Create Feature Branch** - Derive branch name from issue-title prefix it with `feature/`, `git switch` to that branch
1. **Parse requirements** – Extract acceptance criteria from user story; treat each Given/When/Then as a test case
1. **Implement UI tests** – Create a `spec.ts` in `tests/` for Playwright
  1. Give the test file a speaking short name depending of the feature that is tested.
  1. Focus on testing UI elements in the page. Technical tests such as URLs and parameters are considered to be weak UI-Tests
1. **Output** – Tests must initially fail (Red phase); use minimal failing assertions; avoid `it.todo()` unless the spec is deferred

## UI Tests (Playwright)

- Location: `tests/**/*.spec.ts`
- Framework: `@playwright/test` (`test`, `expect`)
- Base URL: `http://localhost:4200` (via webServer in playwright.config)
- Run: ` npx playwright test --project=chromium --reporter line`

### Naming (Gherkin-style)

```ts
test('given [context] when [action] then [expected result]', async ({ page }) => { ... });
```

### UI Element identification

- Prefer a11y selectors like `getByRole`
- Introduce `data-testid` in the template if needed
- Do not use CSS-Selectors (e.g. attribute or class selectors) that can break

### Template

- [Playwright Test Template](./assets/playwright-test-template.ts)

## Mapping Requirements to Tests

| Acceptance Criterion          | Unit Test                        | UI Test                        |
| ----------------------------- | -------------------------------- | ------------------------------ |
| Given X when Y then Z (logic) | Yes – component/service behavior | Optional – if observable in UI |
| Given X when Y then Z (UI)    | Optional – template bindings     | Yes – user flow                |
| Edge cases, validation        | Yes – isolated                   | Yes – E2E validation           |

## Red-Green-Refactor

1. **Red** – Write tests that fail. Use concrete expectations; avoid `it.todo()` except for future specs

## Output Checklist

- [ ] Playwright `spec.ts` created/updated in `tests/`
- [ ] Test names use Gherkin-style (given/when/then or should/when)
- [ ] Tests are runnable (` npx playwright test --project=chromium --reporter line`)