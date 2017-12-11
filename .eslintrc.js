module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  rules: {
    'max-len': 1,
    'space-in-parens': 1,
    'no-mixed-operators': 1,
    'padded-blocks': 1,
    'space-infix-ops': 1,
    'no-unused-vars': 1,
    'indent': 1,
    'space-before-function-paren': ['error', 'always'],
    'no-unused-vars': 1,
    'comma-dangle': [2, 'never'],
    'no-console': [1, { allow: ['warn', 'error', 'info'] }],
    'arrow-parens': 1,
    'semi': [2, 'never'],
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,

    'quotes': 1,
    'no-multiple-empty-lines': 1,
    'padded-blocks': 1,
    'no-unused-vars': 1,

    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
