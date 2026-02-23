// controlcenter/styles/ops/opsHudTop.css.ts

// ==============================
// Imports
// ==============================
import { mq, vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const page = style({
  minHeight: "100svh",
  background: vars.color.bg,
  color: vars.color.text,
});

export const topHud = style({
  position: "sticky",
  top: 0,
  zIndex: vars.z.overlay,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.lg,
  paddingInline: vars.space.xl,
  paddingBlock: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.surface} 92%, transparent)`,
  backdropFilter: "blur(10px)",
  flexWrap: "wrap",
});

export const brand = style({
  display: "grid",
  gap: 4,
});

export const brandTitle = style({
  fontWeight: 900,
  letterSpacing: "-0.01em",
  fontSize: 16,
});

export const pageTitle = style({
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const right = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.lg,
  flexWrap: "wrap",
});

export const pills = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const pill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  paddingInline: 10,
  paddingBlock: 6,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontWeight: 900,
  fontSize: 12,
  whiteSpace: "nowrap",
});

export const pillMuted = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  paddingInline: 10,
  paddingBlock: 6,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontWeight: 900,
  fontSize: 12,
  whiteSpace: "nowrap",
  color: vars.color.muted,
});

export const mono = style({
  fontFamily: vars.typography.font.mono,
});

export const dot = style({
  width: 10,
  height: 10,
  borderRadius: 999,
  background: vars.color.muted,
});

export const dotOn = style({
  background: vars.color.primary,
});

export const tableArea = style({
  width: "100%",
  padding: vars.space.xl,
  "@media": {
    [mq.md]: {
      padding: vars.space.xl,
    },
  },
});
