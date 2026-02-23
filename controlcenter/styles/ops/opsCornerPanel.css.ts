// controlcenter/styles/ops/opsCornerPanel.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const root = style({
  position: "absolute",
  right: vars.space.lg,
  bottom: vars.space.lg,
  zIndex: vars.z.overlay,
  width: "min(380px, calc(100vw - 2 * 16px))",

  // ✅ IMPORTANT: allow the attached semicircle handle to render above
  overflow: "visible",
});

// ✅ actual panel surface (clipped), so content respects radius & border
export const inner = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.secondary} 22%, transparent)`,
  backdropFilter: "blur(10px)",
  boxShadow: vars.shadow.md,

  // ✅ clip the content inside the rounded panel
  overflow: "hidden",

  padding: vars.space.lg,
  display: "grid",
  gap: vars.space.md,
});

export const collapseBtn = style({
  position: "absolute",
  top: 0, // ✅ referință: muchia superioară a panel-ului (root)
  right: vars.space.lg,

  // ✅ bottom edge of the semicircle is FLUSH with the top edge of the panel surface
  // panel surface begins at root top (inner is inside root). We attach relative to inner top by placing at root top.
  transform: "translateY(-100%)",

  width: 64,
  height: 36,
  borderRadius: "999px 999px 0 0", // ✅ semicerc deasupra, flat jos
  border: `1px solid ${vars.color.border}`,
  borderBottom: "none", // ✅ atașare curată la panel
  background: vars.color.surface,
  color: vars.color.text,
  cursor: "pointer",
  fontWeight: 900,
  display: "grid",
  placeItems: "center",
  boxShadow: vars.shadow.md,
  selectors: {
    "&:hover": { background: vars.color.surfaceHover },
    "&:active": { transform: "translateY(-100%) scale(0.98)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const chevron = style({
  fontSize: 14,
  lineHeight: 1,
});

// content inside the panel surface (we keep existing structure)
export const searchForm = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: vars.space.md,
  alignItems: "center",
});

export const searchInput = style({
  height: 40,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontFamily: vars.typography.font.mono,
  fontWeight: 800,
  outline: "none",
});

export const searchBtn = style({
  height: 40,
  paddingInline: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: 900,
  cursor: "pointer",
  whiteSpace: "nowrap",
  selectors: {
    "&:hover": { background: vars.color.surfaceActive },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const hint = style({
  fontWeight: 800,
  fontSize: 13,
  color: vars.color.muted,
  overflowWrap: "anywhere",
});

export const card = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
});

export const cardTitle = style({
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const cardRow = style({
  display: "grid",
  gridTemplateColumns: "90px 1fr",
  gap: vars.space.md,
  alignItems: "baseline",
});

export const cardLabel = style({
  color: vars.color.muted,
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

export const cardValue = style({
  fontWeight: 900,
});

export const cardValueMono = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
});

// Collapsed state: keep only the search (input + button), hide hint + card
export const isCollapsed = style({});

globalStyle(`${isCollapsed} ${hint}`, { display: "none" });
globalStyle(`${isCollapsed} ${card}`, { display: "none" });

// reduce padding a bit when collapsed (on the surface wrapper)
globalStyle(`${isCollapsed} ${inner}`, {
  padding: vars.space.md,
});
