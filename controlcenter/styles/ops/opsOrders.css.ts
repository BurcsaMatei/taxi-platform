// controlcenter/styles/ops/opsOrders.css.ts

// ==============================
// Imports
// ==============================
import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

// ==============================
// Styles
// ==============================
export const tableWrap = style({
  overflow: "auto",
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

export const table = style({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "14px",
});

export const thead = style({
  position: "sticky",
  top: 0,
  background: vars.color.surface,
  zIndex: 2,
});

export const th = style({
  textAlign: "left",
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  color: vars.color.muted,
  fontWeight: 800,
  whiteSpace: "nowrap",
});

export const td = style({
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  verticalAlign: "top",
});

// ✅ VE: nu putem face "&:hover td" în selectors; folosim globalStyle
export const trHover = style({});

globalStyle(`${trHover}:hover ${td}`, {
  background: vars.color.surfaceHover,
});

export const cellMono = style({
  fontFamily: "monospace",
  fontSize: "12px",
});

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  paddingInline: vars.space.md,
  paddingBlock: "6px",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 800,
  whiteSpace: "nowrap",
});

export const badgeMuted = style({
  color: vars.color.muted,
});

export const empty = style({
  padding: vars.space.lg,
  color: vars.color.muted,
});

export const rowSplit = style({
  display: "grid",
  gap: vars.space.sm,
});

export const small = style({
  fontSize: "12px",
  color: vars.color.muted,
});
