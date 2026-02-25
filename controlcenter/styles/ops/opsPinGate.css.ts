// controlcenter/styles/ops/opsPinGate.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.z.overlay,
  display: "grid",
  placeItems: "center",
  padding: vars.space.xl,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(6px)",
});

export const card = style({
  width: "min(560px, 100%)",
});

export const warn = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.muted,
  fontWeight: 800,
  overflowWrap: "anywhere",
});

export const actions = style({
  display: "flex",
  justifyContent: "flex-end",
});

export const linkBtn = style({
  border: "none",
  background: "transparent",
  color: vars.color.link,
  fontWeight: 900,
  cursor: "pointer",
  padding: 0,
  selectors: {
    "&:hover": { color: vars.color.linkHover },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});
