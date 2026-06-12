import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import pluginLit from "eslint-plugin-lit";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import pluginWc from "eslint-plugin-wc";
import globals from "globals";
import tseslint from "typescript-eslint";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const typeScriptFiles = [
  "src/**/*.{ts,tsx}",
  "playground/**/*.{ts,tsx}",
  "scripts/**/*.ts",
  "worker/**/*.ts",
  "vite.config.ts",
  "vite.cdn.config.ts",
];
const reactFiles = ["src/react/**/*.{ts,tsx}", "src/react.ts", "playground/**/*.{ts,tsx}"];
const litFiles = ["src/components/**/*.ts"];

const importSettings = {
  ...importPlugin.flatConfigs.typescript.settings,
  "import/resolver": {
    typescript: {
      alwaysTryTypes: true,
      project: path.join(rootDir, "tsconfig.json"),
    },
    node: {
      extensions: [".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".d.ts"],
    },
  },
};

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: typeScriptFiles,
}));

export default defineConfig(
  {
    ignores: ["cdn-dist/**", "dist/**", "node_modules/**", ".wrangler/**", "bun.lock"],
  },
  {
    files: typeScriptFiles,
    ...js.configs.recommended,
  },
  ...typeCheckedConfigs,
  {
    files: typeScriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootDir,
      },
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      eqeqeq: ["error", "always"],
      "max-depth": ["warn", 4],
      "max-lines-per-function": [
        "warn",
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-params": ["warn", 6],
      "no-console": ["warn", { allow: ["error", "log"] }],
      "no-unused-vars": "off",
      "no-warning-comments": [
        "warn",
        {
          location: "anywhere",
          terms: ["fix", "fixme", "todo", "xxx"],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": [
        "error",
        {
          caseSensitive: false,
          ignore: ["\\.css$", "\\?.*$"],
        },
      ],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: importSettings,
  },
  {
    files: ["worker/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: path.join(rootDir, "tsconfig.worker.json"),
        projectService: false,
        tsconfigRootDir: rootDir,
      },
    },
  },
  {
    files: reactFiles,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootDir,
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat["jsx-runtime"].rules,
      "max-lines-per-function": [
        "warn",
        {
          max: 260,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "react/jsx-no-constructed-context-values": "error",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
    settings: {
      ...importSettings,
      react: {
        version: "detect",
      },
    },
  },
  {
    files: litFiles,
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      lit: pluginLit,
      wc: pluginWc,
    },
    rules: {
      ...pluginLit.configs["flat/recommended"].rules,
      ...pluginWc.configs["flat/recommended"].rules,
    },
  },
);
