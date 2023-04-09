module.exports = {
  '*.{js,jsx,ts,tsx}': ['turbo run lint --', 'prettier --config ./.prettierrc.js --write'],
  '*.{css,scss,md,html,json}': ['prettier --config ./.prettierrc.js --write'],
}
