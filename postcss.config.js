/* eslint-env node */
const imports = require("postcss-import");
const envFunction = require("postcss-env-function");
const nesting = require("postcss-nesting");

module.exports = {
  plugins: [
    imports(),
    envFunction({ importFrom: "src/css/breakpoints.json" }),
    nesting(),
  ],
};
