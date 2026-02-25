// controlcenter/styles/ops/opsCityPicker.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const page = style({
  minHeight: "100svh",
  display: "grid",
  placeItems: "center",
  padding: vars.space.xl,
  background: vars.color.bg,
  color: vars.color.text,
});

export const card = style({
  width: "min(560px, 100%)",
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  padding: vars.space.xl,
  display: "grid",
  gap: vars.space.md,
});

export const title = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const subtitle = style({
  margin: 0,
  fontWeight: 800,
  color: vars.color.muted,
  lineHeight: 1.4,
});

export const mono = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  color: vars.color.text,
});

export const form = style({
  display: "grid",
  gap: vars.space.sm,
  marginTop: vars.space.sm,
});

export const label = style({
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const input = style({
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  outline: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const btn = style({
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: vars.shadow.md,
  selectors: {
    "&:hover": { background: vars.color.surfaceActive },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const error = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 800,
  color: vars.color.muted,
});
