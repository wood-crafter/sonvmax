import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react": eslintPluginReact,
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    }
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
];
