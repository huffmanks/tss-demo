//  @ts-check
import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  {
    ignores: ["eslint.config.js", "prettier.config.js", ".output/", ".tanstack/"],
  },
  ...tanstackConfig,
  {
    rules: {
      "import/consistent-type-specifier-style": "off",
      "import/order": "off",
    },
  },
];
