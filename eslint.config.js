const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["server/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "no-console": "warn",
    },
  },
];