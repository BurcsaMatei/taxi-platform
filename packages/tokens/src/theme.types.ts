// packages/tokens/src/theme.types.ts

// Re-export types from the vanilla-extract style module using a plain .ts file
// to avoid exposing `export type` directly from a *.css.ts file (vanilla-extract loader).
export type { ThemeMode, ThemeVars } from "./theme.css";
