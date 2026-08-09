// eslint.config.js
// Replaces .eslintrc.cjs - ESLint v9+ (this project is on v10) requires the new flat-config
// format; the old .eslintrc.* format is no longer read at all, so lint was silently running
// against zero rules (worse, it was refusing to run entirely - see below) until this existed.
import js from '@eslint/js'
import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Base (non-TS-aware) versions of rules TypeScript itself already checks more accurately -
      // typescript-eslint's own docs call these out by name as needing to be turned off, since
      // they don't understand TS constructs (declaration merging between an interface and a
      // same-named component/function, the JSX global, etc.) and misfire on valid code.
      'no-undef': 'off',
      'no-redeclare': 'off',
      // ignoreDeclarationMerge: an `interface Foo` and a same-named `function`/`const Foo` are
      // valid, non-conflicting TypeScript (they live in separate type/value namespaces) - without
      // this the rule can't tell that apart from an actual accidental redeclaration.
      '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
    },
  },
]
