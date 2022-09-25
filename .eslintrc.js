module.exports = {
  env: {
    node: true,
    es2021: true,
    'cypress/globals': true
  },
  extends: [
    'standard',
    'plugin:cypress/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'cypress'
  ],
  rules: {
  }
}
