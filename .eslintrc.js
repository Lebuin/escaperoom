module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prefer-const': 'off',
    'arrow-parens': 'off',
    'keyword-spacing': 'off',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'prefer-template': 'off',
    'comma-dangle': 'off',
    'no-mixed-operators': 'off',
    'padded-blocks': 'off',
    'prefer-destructuring': 'off',
    'operator-linebreak': 'off',
    'no-multi-spaces': 'off',
    'no-nested-ternary': 'off',
    'space-in-parens': 'off',
  },
};
