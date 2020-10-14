## Bugs

- Fix issue where composed classes are being duplicated in resulting bundle.
- Fix button focus styles on mobile.
- Fix staleness calculation to use whole days rather than difference in days,
  which calculates based on time.

## Features

- Add Go-to-date button in left nav.
- Add edit functionality.
- Add reorder functionality.
- Build backend.

## Polish

- Replace isImportant checkbox with switch.
- Implement loading states.
- Add Tooltips for icon buttons?

## Refactoring

- Leverage css grid for layout.
- Inject current day through React context.

## Infrastructure

- Use my own eslint config.
- Move infrastructure to a separate package.
