/* eslint-env node */
const imports = require("postcss-import");
const envFunction = require("postcss-env-function");

module.exports = {
  plugins: [imports(), envFunction({ importFrom: "src/css/breakpoints.json" })],
};
