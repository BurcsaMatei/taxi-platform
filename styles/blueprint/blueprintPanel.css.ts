// styles/blueprint/blueprintPanel.css.ts

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

  left: vars.space.md,
  right: vars.space.md,
  top: vars.space.md,

  zIndex: vars.z.overlay,
  pointerEvents: "auto",

  "@media": {
    [mq.md]: {
      left: "auto",
      right: 28,
      top: 270, // sub minimap (≈ 28 + 220 + gap)
      width: "min(460px, 42vw)",
    },
  },
});

export const card = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  overflow: "hidden",
  padding: vars.space.md,
  maxHeight: "46svh",

  display: "grid",
  gap: vars.space.md,

  "@media": {
    [mq.md]: {
      maxHeight: "calc(100% - 28px)",
      padding: vars.space.lg,
    },
  },
});

export const closeBtn = style({
  position: "absolute",
  right: 10,
  top: 10,
  width: 40,
  height: 40,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: 20,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const header = style({
  position: "relative",
  paddingRight: 56,
  display: "grid",
  gap: vars.space.xs,
});

export const kicker = style({
  margin: 0,
  fontSize: vars.typography.size.xs,
  fontWeight: 900,
  letterSpacing: "0.08em",
  opacity: 0.72,
  textTransform: "uppercase",
});

export const title = style({
  margin: 0,
  fontSize: vars.typography.size.lg,
  fontWeight: 900,
  lineHeight: vars.typography.leading.tight,
});

export const desc = style({
  margin: 0,
  opacity: 0.82,
  lineHeight: vars.typography.leading.normal,
});

export const list = style({
  display: "grid",
  gap: vars.space.sm,
  overflow: "auto",
  paddingRight: 2,
});

export const item = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: "rgba(127,127,127,0.06)",
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
});

export const itemMain = style({
  display: "grid",
  gap: 2,
});

export const itemTitle = style({
  margin: 0,
  fontSize: vars.typography.size.sm,
  fontWeight: 900,
  lineHeight: vars.typography.leading.tight,
});

export const itemDesc = style({
  margin: 0,
  fontSize: vars.typography.size.sm,
  opacity: 0.8,
});

export const itemActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
});

export const actionPrimary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "10px 14px",
  fontWeight: 900,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const actionSecondary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "10px 14px",
  fontWeight: 900,
  lineHeight: 1,
  opacity: 0.9,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});
