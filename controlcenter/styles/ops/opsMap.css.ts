// controlcenter/styles/ops/opsMap.css.ts

// ==============================
// Imports
// ==============================
import { mq, vars } from "@taxi/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const page = style({
  minHeight: "100svh",
});

export const mapRoot = style({
  position: "relative",
  height: "100svh",
  width: "100%",
  overflow: "hidden",
  background: vars.color.bg,
});

export const mapFill = style({
  position: "absolute",
  inset: 0,
});

export const mapTopRight = style({
  position: "absolute",
  top: vars.space.lg,
  right: vars.space.lg,
  zIndex: vars.z.overlay,
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
});

export const mapBtn = style({
  height: 40,
  paddingInline: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontWeight: 900,
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: vars.shadow.md,
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}, background-color ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    "&:hover": { transform: "translateY(-1px)", background: vars.color.surfaceHover },
    "&:active": { transform: "translateY(0px)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const hud = style({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "min(420px, 92vw)",
  zIndex: vars.z.overlay,
  display: "block",
  borderRight: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.primary} 18%, transparent)`,
  backdropFilter: "blur(10px)",

  // ✅ IMPORTANT: allow the attached semicircle handle to render outside
  overflow: "visible",
});

export const hudInner = style({
  height: "100%",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  minHeight: 0,

  // ✅ clip HUD content (cards) while keeping outer handle visible
  overflow: "hidden",
});

export const hudCollapsed = style({
  width: 64,
});

// ✅ când e retractat, ascundem complet conținutul HUD-ului (dar NU handle-ul; e în TSX în afara hudInner)
globalStyle(`${hudCollapsed} ${hudInner}`, {
  display: "none",
});

export const hudRail = style({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: 64,
  zIndex: vars.z.overlay,
  borderRight: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.primary} 18%, transparent)`,
  backdropFilter: "blur(10px)",
  overflow: "hidden",
});

// ✅ rail-ul nu mai afișează text deloc (strip gol)
export const hudRailTop = style({});
export const hudRailBrand = style({});
export const hudRailSub = style({});
export const hudRailStats = style({});
export const hudRailPill = style({});
export const hudRailPillMuted = style({});

globalStyle(`${hudRail} *`, {
  display: "none",
});

globalStyle(`${mapRoot} .mapboxgl-ctrl-top-right`, {
  marginTop: "56px",
  "@media": {
    [mq.md]: {
      marginTop: "0px",
    },
  },
});
