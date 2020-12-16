# Task Time

## Development Notes

### Build System

Module bundler - rollup.js, create-config.js  
JS Transpilation - babel (check babel.config.json for plugins used)  
CSS Transforms - postcss (check postcss.config.js for plugins used)

### Polyfills

`focus-visible` - This polyfill is used to make up for the lack of :focus-visible selector support in many browsers. For those who don't know, this is useful for buttons with custom focus states. Using plain old `:focus` does not work, since the focus styling will persist after clicking a button, which is not what you want.

### Build Scripts

- `yarn build` - Run development build.
- `yarn build:analyze` - Run build and analyze output (displays size of various modules).
- `yarn build:clean` - Cleans build directory.
- `yarn bulid:icons` - Create react components from svgs via svgr.
- `yarn build:prod` - Run production build. Also runs `yarn build:clean` and outputs stats of built files.
- `yarn ci` - Command to run on CI. Runs lints and, eventually, tests.
- `yarn lint` - Lints js and css files.
- `yarn lint:css` - Lints css files.
- `yarn lint:js` - Lints js files.
- `yarn serve` - Builds and serves files for development. Also watches files and automatically reloads. Port defaults to 10001.

### Icons

Icon set by [Raj Dev](https://freeicons.io/profile/714) on [freeicons.io](https://www.freeicons.io/icon-list/business-and-online-icons).
