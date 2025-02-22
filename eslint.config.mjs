import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    plugins: ["simple-import-sort"],
    parser: "@typescript-eslint/parser",
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-default-export": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["exported", "const"],
          format: ["PascalCase", "strictCamelCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
      ],
    },
    ignorePatterns: ["node_modules"],
    overrides: [
      {
        files: ["*/app/**/page.tsx", "layout.tsx", "*.config.*"],
        rules: {
          "import/no-default-export": "off",
          "import/prefer-default-export": "error",
          "@typescript-eslint/naming-convention": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-require-imports": "off",
        },
      },
    ],
  }),
];

export default eslintConfig;
