// styles/blueprint/blueprintPreview.css.ts

// ==============================
// Imports
// ==============================
import { style } from "@vanilla-extract/css";

import { mq, vars } from "../theme.css";

// ==============================
// Classes
// ==============================
export const wrap = style({
  position: "absolute",
  inset: 0,
  zIndex: 25, // below panel (overlay), above map layer
  pointerEvents: "auto",
  display: "grid",
  padding: vars.space.md,

  "@media": {
    [mq.md]: {
      padding: 0,
    },
  },
});

export const card = style({
  width: "100%",
  height: "100%",
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  overflow: "hidden",

  display: "grid",
  gridTemplateRows: "auto 1fr",
});

export const bar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

export const barLeft = style({
  minWidth: 0,
  display: "grid",
  gap: 2,
});

export const kicker = style({
  margin: 0,
  fontSize: vars.typography.size.xs,
  fontWeight: 900,
  letterSpacing: "0.08em",
  opacity: 0.7,
  textTransform: "uppercase",
});

export const title = style({
  margin: 0,
  fontWeight: 900,
  lineHeight: vars.typography.leading.tight,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "72ch",
});

export const barRight = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  flexShrink: 0,
});

export const openNewTab = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "8px 12px",
  fontWeight: 900,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const closeBtn = style({
  width: 40,
  height: 40,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: "transparent",
  fontSize: 20,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const iframe = style({
  width: "100%",
  height: "100%",
  border: 0,
  background: "transparent",
});
