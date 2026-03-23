import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      globals: {
        ...globals.browser,
        DOMHighResTimeStamp: 'readonly',
        GPUTextureFormat: 'readonly',
        GPUDevice: 'readonly',
        GPUCanvasContext: 'readonly',
        GPUBuffer: 'readonly',
        GPURenderPipeline: 'readonly',
        GPUBindGroup: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte: sveltePlugin,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser,
      },
      globals: {
        HTMLCanvasElement: 'readonly',
      },
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['.svelte-kit/', 'build/', 'dist/'],
  },
];
