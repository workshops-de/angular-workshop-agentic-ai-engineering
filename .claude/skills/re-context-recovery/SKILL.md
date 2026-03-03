---
name: re-context-recovery
description: Recovers missing requirement information locally from this repository. Looks up markdown files by their number in `requirements/**/*.md`
---

# RE Context Recovery

- Expect a number to be present
- If not ask of the requirement number to find a markdown file in requirements
- Check if `<number>.md` exists
- Write an error message, if `<number>.md` does not exist and quit your work immediatly. 
- Read `<number>.md` in `requirements/` to enricht the context