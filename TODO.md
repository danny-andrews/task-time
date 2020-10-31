## Bugs

- Fix button focus styles on mobile.
- Fix issue where composed classes are being duplicated in resulting bundle.
- Fix staleness calculation to use whole days rather than difference in days,
  which calculates based on time.

## Features

- Add Go-to-date button in left nav.
- Add edit functionality.
- Add reorder functionality.
- Add new todos to top of list.

## Polish

- Replace isImportant checkbox with switch.
- Add custom error messaging to task form rather than relying on html built-in.
- Implement loading states.
- Handle text wrapping in todo item.
- Add Tooltips for icon buttons?

## Refactoring

- Inject current day through React context.

## Infrastructure

- Deploy backend.
- Use my own eslint config.
- Move infrastructure to a separate package.
- Add basic tests
