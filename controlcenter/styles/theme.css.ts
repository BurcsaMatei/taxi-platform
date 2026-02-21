// controlcenter/styles/theme.css.ts

// ==============================
// Re-export shim: runtime tokens vin din root (@taxi/tokens)
// IMPORTANT: fără `export type` în fișier *.css.ts (Vanilla Extract loader)
// ==============================

export { mq, themeClassDark, themeClasses, themeClassLight, vars } from "@taxi/tokens";

// Compat alias-uri (dacă există importuri vechi)
export { themeClassDark as darkThemeClass,themeClassLight as themeClass } from "@taxi/tokens";