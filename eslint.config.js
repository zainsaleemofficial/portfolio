import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
export default defineConfig([
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '.agents/**',
      'artifacts/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  ...astro.configs.recommended,
])
