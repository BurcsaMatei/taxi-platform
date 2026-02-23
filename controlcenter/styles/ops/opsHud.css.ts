// controlcenter/styles/ops/opsHud.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================

// Handle chevron on HUD right edge (centered vertically) — semicircle flush-attached
export const edgeToggle = style({
  position: "absolute",
  top: "50%",
  left: "100%",
  transform: "translateY(-50%)",
  width: 40,
  height: 64,
  borderRadius: "0 999px 999px 0",
  border: `1px solid ${vars.color.border}`,
  borderLeft: "none",
  background: vars.color.surface,
  color: vars.color.text,
  cursor: "pointer",
  fontWeight: 900,
  display: "grid",
  placeItems: "center",
  boxShadow: vars.shadow.md,
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing.standard}, transform ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    "&:hover": { background: vars.color.surfaceHover },
    "&:active": { transform: "translateY(-50%) scale(0.98)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const edgeChevron = style({
  fontSize: 22,
  lineHeight: 1,
});

export const header = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  alignItems: "start",
  gap: 6,
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  minHeight: 64,
});

export const headerMain = style({
  display: "grid",
  gap: 3,
  minWidth: 0,
});

export const brandRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md,
});

export const brandTitle = style({
  fontSize: 16,
  fontWeight: 900,
  letterSpacing: "-0.01em",
  textTransform: "lowercase",
});

export const pageTitle = style({
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

// Body: no stretch gaps between cards
export const body = style({
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.md,
  overflowY: "auto",
  minHeight: 0,
  alignContent: "start",
  gridAutoRows: "max-content",
});

// Card sections: compact
export const section = style({
  display: "grid",
  gap: 8,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.surface})`,
  alignContent: "start",
});

export const sectionMuted = style({
  display: "grid",
  gap: 8,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.secondary} 18%, ${vars.color.surface})`,
  opacity: 0.92,
  alignContent: "start",
});

export const sectionTitle = style({
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

// ✅ Theme inline group
export const themeInline = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
});

export const themeValue = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  fontSize: 13,
});

// actions row under “Status”
export const actionsRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md,
  marginTop: 0,
  paddingTop: 0,
});

export const actionsPills = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  flexWrap: "nowrap",
});

// Bigger pills (online/offline) inside Status
export const actionPill = style({
  display: "inline-flex",
  alignItems: "center",
  paddingInline: 12,
  paddingBlock: 8,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 900,
  fontSize: 13,
  whiteSpace: "nowrap",
});

export const actionPillMuted = style({
  display: "inline-flex",
  alignItems: "center",
  paddingInline: 12,
  paddingBlock: 8,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontWeight: 900,
  fontSize: 13,
  whiteSpace: "nowrap",
  color: vars.color.muted,
});

export const kvGrid = style({
  display: "grid",
  gap: 6,
  alignContent: "start",
});

export const kv = style({
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  gap: vars.space.md,
  alignItems: "baseline",
});

export const k = style({
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const v = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  fontWeight: 900,
});

export const vMono = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  fontSize: 13,
  overflowWrap: "anywhere",
});

export const vLinkMono = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  fontSize: 13,
  color: vars.color.link,
  selectors: {
    "&:hover": { color: vars.color.linkHover },
  },
});

export const vOk = style({
  fontWeight: 900,
});

export const vErr = style({
  fontWeight: 900,
  color: vars.color.muted,
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

export const alert = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 800,
  fontSize: 13,
  overflowWrap: "anywhere",
});

export const muted = style({
  fontWeight: 800,
  color: vars.color.muted,
  fontSize: 13,
});
