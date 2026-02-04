// styles/blueprint/blueprintMiniMap.css.ts

// ==============================
// Imports
// ==============================
import { style } from "@vanilla-extract/css";

// ==============================
// Classes
// ==============================
export const wrap = style({
  position: "absolute",
  top: 28,
  right: 28,
  zIndex: 30,
  pointerEvents: "none", // nu fură drag-ul
});

export const card = style({
  width: 300,
  height: 220,
  borderRadius: 32,
  border: "2px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 20px 56px rgba(0,0,0,0.12)",
  backdropFilter: "blur(20px)",
  padding: 20,
});

export const map = style({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 24,
  background: "rgba(0,0,0,0.03)",
  overflow: "hidden",
});

export const viewRect = style({
  position: "absolute",
  borderRadius: 16,
  border: "4px solid rgba(0, 98, 255, 0.85)",
  background: "rgba(0, 98, 255, 0.08)",
});

export const poiDot = style({
  position: "absolute",
  width: 12,
  height: 12,
  borderRadius: 999,
  background: "rgba(0,0,0,0.28)",
});

export const hubDot = style({
  position: "absolute",
  width: 16,
  height: 16,
  borderRadius: 999,
  background: "rgba(0, 98, 255, 0.85)",
  boxShadow: "0 0 0 4px rgba(255,255,255,0.9)",
});
