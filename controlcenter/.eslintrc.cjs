// .eslintrc.cjs

// ==============================
// Config
// ==============================
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports", "simple-import-sort", "jsx-a11y"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  ignorePatterns: [".next/", "node_modules/", "lib/gallery.data.ts"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],

    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",

    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",

    "jsx-a11y/anchor-is-valid": "off",

    // ✅ prevent rule-load crash + consistent behavior
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
    ],
  },
  settings: {
    next: { rootDir: ["./"] },
  },
};
