---
name: re-updater
description: Final step in the agentic requirements workflow. Reconciles implementation with original acceptance criteria, verifies delivery, updates the local requirements file, and outputs a completion summary. Use after developer-ui-ux when the user asks to finalise requirements, close the feature, or complete the delivery.
---

# RE Updater

Closes the requirements workflow: verifies delivery against acceptance criteria, updates the requirements file, and produces a completion summary. Runs after developer-ui-ux.

## Prerequisites

- Original user story and acceptance criteria from `requirements/<number>.md`
- `npx playwright test --reporter line` ✓
- `npm run build` ✓

## Workflow

1. **Load requirements** – Read `requirements/<number>.md`
2. **Reconcile** – Map each acceptance criterion to evidence (tests, components, routes); mark fulfilled or note gaps
3. **Update requirements file** – Mark completed criteria and add implementation summary plus verification results
4. **Verify** – Run `npm test`, `npx playwright test`, `npm run build`; all must pass
5. **Output** – Deliver completion summary (see template)

## Reconcile Template

For each acceptance criterion from `requirements/<number>.md`:

```
- [x] Given [context], when [action], then [result] → implemented in [component/service], covered by [test file]
- [ ] Criterion not yet met → [brief reason or follow-up]
```

## Completion Summary Template

```markdown
## Feature Complete

**User story:** [as stated in requirements/<number>.md]

### Delivered

- [List key deliverables: routes, components, tests]
- All acceptance criteria: [x]/[total] met

### Requirements

- Updated: `requirements/<number>.md`
```

## Requirements File Update

When finalising, update `requirements/<number>.md` directly:

- Keep acceptance criteria checklist current (`[x]` for fulfilled, `[ ]` for pending)
- Add a short "Implementation complete" note with:
  - key deliverables
  - verification command results
  - remaining follow-ups (if any)

## Context Recovery

If you lack the original requirements or number, ask the user for the requirement number and read `requirements/<number>.md`. If needed, ask the user to run `/context-recovery`.
