import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginImportSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
    plugins: {
      'simple-import-sort': pluginImportSort,
    },
    rules: {
      //* Better readibility
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'max-lines': ['error', { max: 200, skipComments: true }],

      'no-undef': 'error',

      //* Best Practices
      eqeqeq: 'warn',
      'no-console': 'warn',
      'no-unused-vars': ['warn'],
      'no-invalid-this': 'error',
      'no-return-assign': 'error',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-constant-condition': 'warn',
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];
