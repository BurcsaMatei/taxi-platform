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
  bottom: vars.space.md, // ✅ important: permite calc corect pt maxHeight/overflow

  zIndex: vars.z.overlay,
  pointerEvents: "auto",

  "@media": {
    [mq.md]: {
      left: "auto",
      right: 28,
      top: 270,
      bottom: 28, // ✅
      width: "min(460px, 42vw)",
    },
  },
});

export const card = style({
  position: "relative",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  overflow: "hidden",

  padding: vars.space.md,

  display: "grid",
  gridTemplateRows: "auto 1fr", // ✅ header + zona scroll
  gap: vars.space.md,

  height: "100%", // ✅ umple wrap-ul (care are top+bottom)
  maxHeight: "46svh",

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

  zIndex: 3, // ✅ deasupra conținutului
  display: "grid",
  placeItems: "center",

  width: 40,
  height: 40,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface, // ✅ solid (opțional, dar recomandat)
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

export const backBtn = style({
  appearance: "none",
  border: `1px solid ${vars.color.border}`,
  background: "transparent",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 900,
  width: "fit-content",
  cursor: "pointer",
  marginTop: vars.space.sm,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const list = style({
  display: "grid",
  gap: vars.space.sm,

  overflowY: "auto", // ✅ scrollbar aici
  overflowX: "hidden",
  minHeight: 0, // ✅ CRUCIAL în CSS grid ca să permită overflow

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

export const itemButton = style({
  appearance: "none",
  border: 0,
  background: "transparent",
  padding: 0,
  margin: 0,
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: vars.radius.lg,
    },
  },
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

// ==============================
// Detail view
// ==============================
export const detail = style({
  display: "grid",
  gap: vars.space.sm,
  overflow: "auto",
  paddingRight: 2,
});

export const detailTitle = style({
  margin: 0,
  fontSize: vars.typography.size.md,
  fontWeight: 900,
  lineHeight: vars.typography.leading.tight,
});

export const detailDesc = style({
  margin: 0,
  opacity: 0.82,
  lineHeight: vars.typography.leading.normal,
});

export const detailActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  marginTop: vars.space.sm,
});
