module.exports = {
  extends: "@danny.andrews/stylelint-config",
  ignoreFiles: ["build/**", "node_modules/**", "public/**"],
  rules: {
    "csstools/value-no-unknown-custom-properties": [
      true,
      { importFrom: ["./src/css/variables.css"] },
    ],
    "mavrin/stylelint-declaration-use-css-custom-properties": {
      cssDefinitions: ["color", "length", "linestyle"],
      ignoreValues: ["/^0$/", "1px", "1rem", "auto", "1fr"],
    },
    "max-nesting-depth": 1,
    "declaration-block-no-redundant-longhand-properties": [
      true,
      {
        ignoreShorthands: ["grid-template"],
      },
    ],
  },
};
