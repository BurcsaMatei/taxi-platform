// styles/blueprint/blueprintHud.css.ts

// ==============================
// Imports
// ==============================
import { style } from "@vanilla-extract/css";

import { mq, vars } from "../theme.css";

// ==============================
// Constante
// ==============================
const DOCK_W = "clamp(220px, 22vw, 320px)";
const DOCK_W_COLLAPSED = 64;

// ==============================
// Classes
// ==============================
export const hud = style({
  position: "absolute",
  left: vars.space.md,
  right: vars.space.md,
  bottom: vars.space.md,
  zIndex: vars.z.overlay,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  overflow: "hidden",

  maxHeight: 56,
  transform: "translate3d(0, 0, 0)",
  transition: `max-height ${vars.motion.fast} ${vars.motion.easing.standard}`,

  "@media": {
    [mq.md]: {
      position: "relative",
      left: "auto",
      right: "auto",
      bottom: "auto",

      // ✅ allow the side toggle to visually sit outside the HUD (over map area)
      zIndex: vars.z.overlay,
      overflow: "visible",

      borderRadius: vars.radius.xl,
      boxShadow: vars.shadow.sm,

      // ✅ collapsed by default on desktop; open state expands width
      width: DOCK_W_COLLAPSED,

      // ✅ CRUCIAL: stay constrained by the grid row; allow internal scroll instead
      height: "100%",
      minHeight: 0,
      alignSelf: "stretch",

      maxHeight: "none",
      transition: `width ${vars.motion.fast} ${vars.motion.easing.standard}`,
      transform: "none",
    },
  },
});

export const hudOpen = style({
  maxHeight: "62svh",

  "@media": {
    [mq.md]: {
      width: DOCK_W,
    },
  },
});

// ==============================
// Desktop side toggle (semi-circle, attached to HUD)
// ==============================
export const hudSideToggle = style({
  display: "none",

  "@media": {
    [mq.md]: {
      display: "grid",
      placeItems: "center",
      position: "absolute",

      // ✅ attached to the HUD edge; protrudes to the RIGHT (map side)
      left: "100%",
      top: "50%",
      transform: "translate3d(0, -50%, 0)",

      // ✅ semi-circle look
      width: 28,
      height: 44,
      borderRadius: "0 999px 999px 0",

      // ✅ feels "merged" with HUD border (no double border line)
      border: `1px solid ${vars.color.border}`,
      borderLeft: 0,
      background: vars.color.surface,
      boxShadow: vars.shadow.sm,

      cursor: "pointer",

      // ✅ over the map (stage has no z-index)
      zIndex: vars.z.overlay,

      selectors: {
        "&:hover": { background: "rgba(127,127,127,0.08)" },
        "&:active": { background: "rgba(127,127,127,0.12)" },
        "&:focus-visible": {
          outline: `2px solid ${vars.color.focus}`,
          outlineOffset: 2,
        },
      },
    },
  },
});

export const hudSideToggleIcon = style({
  width: 10,
  height: 10,
  borderRight: "2px solid rgba(0,0,0,0.65)",
  borderBottom: "2px solid rgba(0,0,0,0.65)",

  // ✅ direction/orientation kept as-is (per your confirmation)
  transform: "rotate(-45deg)",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}`,

  selectors: {
    [`${hud}[data-open="false"] &`]: {
      transform: "rotate(135deg)",
    },
  },
});

// ==============================
// Inner layout
// ==============================
export const hudInner = style({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gap: vars.space.sm,
  padding: vars.space.sm,

  "@media": {
    [mq.md]: {
      height: "100%",
      minHeight: 0, // ✅ CRUCIAL: allows the 1fr row to be scrollable
      padding: vars.space.md,
      gap: vars.space.md,

      // ✅ collapsed desktop => hide inner content (side toggle remains visible)
      selectors: {
        [`${hud}[data-open="false"] &`]: {
          display: "none",
        },
      },
    },
  },
});

export const hudHandle = style({
  appearance: "none",
  border: 0,
  background: "transparent",
  cursor: "pointer",
  width: "100%",
  height: 40,
  display: "grid",
  placeItems: "center",
  padding: 0,

  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: vars.radius.lg,
    },
  },

  "@media": {
    [mq.md]: {
      display: "none",
    },
  },
});

export const hudHandlePill = style({
  width: 56,
  height: 6,
  borderRadius: 999,
  background: "rgba(127,127,127,0.28)",
});

export const hudHandleArrow = style({
  width: 10,
  height: 10,
  marginTop: 8,
  borderRight: "2px solid rgba(0,0,0,0.6)",
  borderBottom: "2px solid rgba(0,0,0,0.6)",
  transform: "rotate(45deg)",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}`,

  selectors: {
    [`${hudOpen} &`]: {
      transform: "rotate(225deg)",
    },
  },
});

export const hudContent = style({
  display: "grid",
  gap: vars.space.md,
  overflow: "auto",
  paddingBottom: vars.space.sm,

  "@media": {
    [mq.md]: {
      // ✅ CRUCIAL: keep content scrollable inside the HUD, not affecting grid row sizing
      minHeight: 0,
      overflow: "auto",
      paddingBottom: 0,
    },
  },
});

export const hudDistricts = style({
  display: "grid",
  gridAutoFlow: "row",
  gap: vars.space.md,
});

/** Reset btn */
export const hudBtn = style({
  justifySelf: "start",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 999,
  padding: "8px 12px",
  background: "transparent",
  color: "inherit",
  fontWeight: 800,
  lineHeight: 1,
  cursor: "pointer",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}, background-color ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      backgroundColor: "rgba(127,127,127,0.10)",
    },
    "&:active": {
      transform: "translateY(0px)",
      backgroundColor: "rgba(127,127,127,0.14)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

// ==============================
// Accordion
// ==============================
export const accWrap = style({
  display: "grid",
  gap: 8,
});

export const accHeader = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  alignItems: "center",
});

export const accToggle = style({
  appearance: "none",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 12,
  background: "transparent",
  cursor: "pointer",
  padding: "10px 12px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontWeight: 900,
  fontSize: 12,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

export const accChevron = style({
  width: 10,
  height: 10,
  borderRight: "2px solid rgba(0,0,0,0.6)",
  borderBottom: "2px solid rgba(0,0,0,0.6)",
  transform: "rotate(45deg)",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    [`${accToggle}[aria-expanded="true"] &`]: {
      transform: "rotate(225deg)",
    },
  },
});

export const accBody = style({
  overflow: "hidden",
  maxHeight: 0,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: "rgba(127,127,127,0.06)",
  transition: `max-height ${vars.motion.fast} ${vars.motion.easing.standard}`,
});

export const accBodyOpen = style({
  maxHeight: "360px",
});

export const accBodyInner = style({
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
  overflow: "auto",
  maxHeight: 360,
});

export const accEmpty = style({
  margin: 0,
  fontSize: 12,
  opacity: 0.78,
});

export const accList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: vars.space.sm,
});

export const accItem = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
});

export const accItemButton = style({
  appearance: "none",
  border: 0,
  padding: 0,
  margin: 0,
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: vars.radius.lg,
    },
  },
});

export const accItemMain = style({
  display: "grid",
  gap: 2,
});

export const accItemTitle = style({
  margin: 0,
  fontSize: 13,
  fontWeight: 900,
  lineHeight: 1.2,
});

export const accItemDesc = style({
  margin: 0,
  fontSize: 12,
  opacity: 0.82,
  lineHeight: 1.35,
});

export const accItemActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
});

export const accActionPrimary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "9px 12px",
  fontWeight: 900,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const accActionSecondary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "9px 12px",
  fontWeight: 900,
  lineHeight: 1,
  opacity: 0.9,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const teleportButton = style({
  appearance: "none",
  border: `1px solid ${vars.color.border}`,
  background: "transparent",
  borderRadius: 12,
  padding: "10px 12px",
  fontSize: 13,
  fontWeight: 900,
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
  selectors: {
    "&:hover": {
      background: "rgba(127,127,127,0.10)",
    },
    "&:active": {
      background: "rgba(127,127,127,0.14)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

export const openPanelLink = style({
  appearance: "none",
  border: 0,
  padding: 0,
  margin: 0,
  background: "transparent",
  textAlign: "left",
  width: "fit-content",
  cursor: "pointer",

  fontSize: 12,
  color: "rgba(0,0,0,0.65)",
  textDecoration: "underline",

  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: 8,
    },
  },
});
