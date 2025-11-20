import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

const reactRecommended = reactPlugin.configs["flat/recommended"];
const reactHooksRecommended = reactHooksPlugin.configs.recommended;
const jsxA11yRecommended = jsxA11yPlugin.configs["flat/recommended"];

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "**/*.js.map",
      "**/*.map",
      "**/*.js", // optional: exclude generated JS files that live in src
      "admin/web/dist/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["admin/web/src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...(reactRecommended?.rules ?? {}),
      ...(reactHooksRecommended?.rules ?? {}),
      ...(jsxA11yRecommended?.rules ?? {}),
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  }
);
