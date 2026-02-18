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
  flexWrap: "wrap",
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
  flexWrap: "wrap",
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
  whiteSpace: "nowrap",
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
});

export const mono = style({
  fontFamily: "monospace",
});

export const mapCanvas = style({
  height: "min(62vh, 720px)",
  minHeight: 420,
  borderRadius: vars.radius.md,
  overflow: "hidden",
  border: `1px solid ${vars.color.border}`,
});

export const mapFill = style({
  height: "100%",
  width: "100%",
});

// ==============================
// Taxi marker (Mapbox Marker element)
// ==============================
export const taxiMarker = style({
  position: "relative",
  display: "grid",
  justifyItems: "center",
  gap: 6,
  transform: "translateY(-6px)",
});

export const taxiMarkerLabel = style({
  paddingInline: 10,
  paddingBlock: 4,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1,
  boxShadow: "0 8px 18px rgba(0,0,0,0.16)",
});

export const taxiMarkerIcon = style({
  width: 36,
  height: 36,
  display: "block",
  filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.22))",
});
