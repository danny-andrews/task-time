## Bugs

- Fix move functionality.
- Fix drag-and-drop in FireFox
- Fix staleness calculation to use whole days rather than difference in days,
  which calculates based on time.

## Features

- Add Go-to-date button in left nav.
- Add edit functionality.
- Add new todos to top of list.
- Add keyboard support for reordering and moving tasks.

## Polish

- Hide warnings about cyclic dependencies in rollup build.
- Replace isImportant checkbox with switch.
- Add custom error messaging to task form rather than relying on html built-in.
- Implement loading states.
- Handle text wrapping in todo item.
- Add Tooltips for icon buttons?

## Refactoring

- Inject current day through React context.

## Infrastructure

- Use my own eslint config.
- Move infrastructure to a separate package.
- Add basic tests
- Fix issue where composed classes are being duplicated in resulting bundle.
