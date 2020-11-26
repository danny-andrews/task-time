## Bugs

- Fix move functionality.
- Fix drag-and-drop in FireFox
- Fix staleness calculation to use whole days rather than difference in days,
  which calculates based on time.
- Fix memory leak.

## Features

- Add edit functionality.
- Add feature for displaying target total difficulty in list.
- Add Go-to-date button in left nav.
- Add keyboard support for reordering and moving tasks.

## Polish

- Hide warnings about cyclic dependencies in rollup build.
- Add custom error messaging to task form rather than relying on html built-in.
- Implement loading states.
- Handle text wrapping in todo item.
- Add Tooltips for icon buttons?

## Refactoring

- Wrap yDoc to return kefir atoms instead of plain observables.

## Infrastructure

- Change db providers to eliminate race condition when refreshing page.
- Use my own eslint config.
- Move infrastructure to a separate package.
- Add basic tests.
- Fix issue where composed classes are being duplicated in resulting bundle.
