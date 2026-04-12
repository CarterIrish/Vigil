const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  {
    files: ["eslint.config.js", "webpack.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["client/**/*.js", "client/**/*.jsx"],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    },
  },
];