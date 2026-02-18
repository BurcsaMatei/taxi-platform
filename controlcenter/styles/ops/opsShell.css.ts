// controlcenter/styles/ops/opsShell.css.ts

// ==============================
// Imports
// ==============================
import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

// ==============================
// Styles
// ==============================
export const root = style({
  minHeight: "100svh",
  background: vars.color.bg,
  color: vars.color.text,
  display: "grid",
  gridTemplateRows: "auto 1fr",
});

export const topBar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.lg,
  paddingInline: vars.space.xl,
  paddingBlock: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const title = style({
  margin: 0,
  fontSize: "1.5rem",
  lineHeight: 1.15,
  fontWeight: 800,
  letterSpacing: "-0.01em",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.lg,
  fontSize: "0.875rem",
  color: vars.color.muted,
});

export const pill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.md,
  paddingInline: vars.space.lg,
  paddingBlock: "6px",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

export const dot = style({
  width: 8,
  height: 8,
  borderRadius: 999,
  background: vars.color.muted,
});

export const dotOn = style({
  background: vars.color.primary,
});

export const content = style({
  display: "grid",
  gap: vars.space.xl,
  padding: vars.space.xl,
});

export const twoCols = style({
  gridTemplateColumns: "1fr 420px",
});

export const panel = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  overflow: "hidden",
  minHeight: 0,

  // IMPORTANT: allow children to fill height
  display: "grid",
  gridTemplateRows: "auto 1fr",
});

export const panelHeader = style({
  padding: vars.space.xl,
  borderBottom: `1px solid ${vars.color.border}`,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.space.lg,
});

export const panelTitle = style({
  margin: 0,
  fontSize: "1.125rem",
  lineHeight: 1.15,
  fontWeight: 800,
});

export const panelBody = style({
  padding: vars.space.xl,
  minHeight: 0,

  // IMPORTANT: let map area grow and avoid "100% of 0px"
  display: "grid",
});

export const mono = style({
  fontFamily: "monospace",
});

export const mapCanvas = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,

  // IMPORTANT: real height so Mapbox can render
  height: "min(72svh, 720px)",
  minHeight: 420,
  width: "100%",
});

export const mapFill = style({
  position: "absolute",
  inset: 0,
});
