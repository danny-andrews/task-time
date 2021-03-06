module.exports = {
  extends: "@danny.andrews/stylelint-config",
  ignoreFiles: ["build/**", "node_modules/**", "public/**"],
  rules: {
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [
          "./src/css/variables.css",
          {
            "custom-properties": {
              "--progress-bar-max-marker-offset": "1px",
              "--progress-bar-offset": "1px",
            },
          },
        ],
      },
    ],
    "mavrin/stylelint-declaration-use-css-custom-properties": {
      cssDefinitions: ["color", "length"],
      ignoreValues: ["/^0$/", "/^1$/", "1px", "1rem", "1fr", "-1px", "2px"],
      ignoreProperties: ["grid-template-columns"],
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
