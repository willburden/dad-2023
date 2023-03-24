module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  rules: {
    indent: ['error', 2],
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'import/no-absolute-path': 'off',
  },
};
