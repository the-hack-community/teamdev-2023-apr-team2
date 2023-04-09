/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@cilotta/eslint-config'], // uses the config in `packages/config/eslint`
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
}
