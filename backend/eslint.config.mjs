
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      
      // Relax method binding rules
      '@typescript-eslint/unbound-method': 'off',
      
      // Allow unused variables (common in tests)
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // Allow async functions without await
      '@typescript-eslint/require-await': 'off',
      
      // Make floating promises a warning instead of error
      '@typescript-eslint/no-floating-promises': 'warn',
      
      // Prettier config
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
