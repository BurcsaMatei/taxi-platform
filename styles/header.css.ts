// styles/header.css.ts
import { style, createVar, globalStyle } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

/* Vars: înălțimea header-ului (dacă ai nevoie ulterior) */
export const headerHeightVar = createVar();

/* Header wrapper */
export const headerClass = style({
  position: "sticky",
  top: 0,
  width: "100%",
  zIndex: 3000,
  background: vars.color.headerBg,
  borderBottom: `1px solid #e5e7eb`,
  boxShadow: "0 6px 28px -8px rgba(50,60,90,0.16)",
});

/* Container intern */
export const headerInnerClass = style({
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  minHeight: headerHeightVar,
});

/* Logo */
export const logoBoxClass = style({
  height: "56px",
  display: "flex",
  alignItems: "center",
  maxWidth: "240px",
});
globalStyle(`${logoBoxClass} svg`, { display: "block", height: "100%", width: "auto" });

/* Desktop nav */
export const desktopNavClass = style({
  display: "none",
  "@media": { "screen and (min-width: 901px)": { display: "flex", gap: "24px", alignItems: "center" } },
});

export const desktopNavLinkClass = style({
  color: vars.color.text,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "1.05rem",
  transition: "color 0.2s",
  ":hover": { color: vars.color.primary },
});

/* Burger button (mobil) */
export const burgerButtonClass = style({
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "2rem",
  "@media": { "screen and (min-width: 901px)": { display: "none" } },
});

/* Mobile nav container (sub header), simplu */
export const mobileNavClass = style({
  display: "block",
  background: vars.color.headerBg,
  borderTop: "1px solid #e5e7eb",
  "@media": { "screen and (min-width: 901px)": { display: "none" } },
});

/* UL vertical, fără bullets — coloană garantat */
export const mobileListClass = style({
  listStyle: "none",
  margin: 0,
  padding: `12px ${vars.spacing.lg} 16px`,
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
});

/* LI bloc */
export const mobileListItemClass = style({
  display: "block",
});

/* Link mobil — block 100%, ocupă rândul */
export const mobileNavLinkClass = style({
  display: "block",
  width: "100%",
  padding: "12px 0",
  color: vars.color.text,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "1.05rem",
  lineHeight: 1.25,
  transition: "color 0.2s",
  ":hover": { color: vars.color.primary },
});
