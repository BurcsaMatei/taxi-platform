// controlcenter/styles/ops/opsCitySwitcher.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const root = style({
  display: "grid",
  gap: vars.space.sm,
  minWidth: 220,
});

export const search = style({
  height: 36,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontWeight: 900,
  outline: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const select = style({
  height: 36,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontWeight: 900,
  outline: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const err = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.muted,
  fontWeight: 800,
  overflowWrap: "anywhere",
});
