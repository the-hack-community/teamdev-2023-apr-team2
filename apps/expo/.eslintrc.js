/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@cilotta/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}
