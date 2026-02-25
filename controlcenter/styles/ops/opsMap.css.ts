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

// ✅ HQ city selector “near HUD edge”
export const mapTopHud = style({
  position: "absolute",
  zIndex: vars.z.overlay,
  display: "grid",
  gap: vars.space.sm,

  // mobile default: under top-right controls
  top: `calc(${vars.space.lg} + 52px)`,
  right: vars.space.lg,
  left: vars.space.lg,

  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.surface} 92%, transparent)`,
  backdropFilter: "blur(10px)",
  boxShadow: vars.shadow.md,

  "@media": {
    // desktop: attach next to HUD width
    [mq.md]: {
      top: vars.space.lg,
      right: "auto",
      left: `calc(min(420px, 92vw) + ${vars.space.lg})`,
      width: "min(360px, calc(100vw - 420px - 3 * 16px))",
    },
  },
});

globalStyle(`${mapRoot}[data-hud-collapsed="1"] ${mapTopHud}`, {
  left: `calc(64px + ${vars.space.lg})`,
});

// HUD
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
  overflow: "visible",
});

export const hudInner = style({
  height: "100%",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  minHeight: 0,
  overflow: "hidden",
});

export const hudCollapsed = style({
  width: 64,
});

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

// rail placeholders
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
