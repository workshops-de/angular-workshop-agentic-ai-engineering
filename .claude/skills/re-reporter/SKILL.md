---
name: re-reporter
description: Interviews users step-by-step to discover project or feature requirements, asks clarifying questions before coding, and outputs user stories with acceptance criteria and technical advice. Use only when the user explicitly asks for requirements gathering, a requirements interview, or clarification before implementation.
---

# RE Reporter

## Interview Workflow

1. **Understand the goal** - What problem is being solved? Who is affected?
2. **Ask clarifying questions** - Who, what, when, where, why, how
3. **Surface constraints** - Technical limits, timeline, dependencies
4. **Confirm scope** - What is in and out of scope for this iteration

## Question Prompts (use as needed)

- Who will use this? (persona, role)
- What exactly should happen? (happy path first)
- What happens in edge cases? (errors, empty state, validation)
- Any constraints? (performance, compatibility, integrations)
- What is out of scope for now?

## Output

- Deliver findings in this structure: [Issue Template](./assests/issue-template.md)
- Save the final requirement as Markdown file in `requirements/`
- Derive name of markdown file from requirement title
  - read `/requirements/`'s files and derive the next integer id for the file name
  - example filename: '<number>.md'```
