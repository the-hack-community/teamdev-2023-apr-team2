/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@cilotta/eslint-config'], // uses the config in `packages/config/eslint`
  parser: '@typescript-eslint/parser',
  parserOptions: {
      tsconfigRootDir: __dirname,
      project: [
        './tsconfig.json',
        './apps/*/tsconfig.json',
        './packages/*/tsconfig.json',
        './apps/firebaseConfig.ts',
      ],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
}
