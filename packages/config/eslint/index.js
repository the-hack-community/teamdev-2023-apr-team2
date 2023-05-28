/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    node: true,
    jest: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:tailwindcss/recommended',
    'plugin:jest/recommended',
    'plugin:@next/next/recommended',
    'next',
    'next/core-web-vitals',
    'turbo',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: ['tailwindcss', 'simple-import-sort', 'import', 'trim'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        args: 'all',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    'react/jsx-key': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': 'error',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
    ],
    'react/jsx-fragments': ['error', 'syntax'],
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['GOOGLE_MAP_API_KEY'],
      },
    ],
    'tailwindcss/no-custom-classname': 'error',
    'tailwindcss/classnames-order': ['error', { config: '../tailwind' }],
    'react-hooks/exhaustive-deps': 'off',
    'trim/class-name': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'no-restricted-syntax': 'off',
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['layout.tsx', 'template.tsx', 'head.tsx'],
      rules: {
        'react/function-component-definition': 'off',
      },
    },
    {
      files: ['*.test.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
  ignorePatterns: ['**/*.config.js', '**/*.config.cjs', 'packages/config/**'],
  reportUnusedDisableDirectives: true,
}

module.exports = config
