import { style } from "@vanilla-extract/css";

export const grid = style({
  display: "grid",
  gap: "var(--gap, clamp(12px, 2vw, 20px))",
  gridTemplateColumns: "repeat(var(--cols, 1), minmax(0, 1fr))",
  "@media": {
    "screen and (min-width: 640px)": {
      gridTemplateColumns:
        "repeat(var(--cols-sm, var(--cols, 1)), minmax(0, 1fr))",
    },
    "screen and (min-width: 768px)": {
      gridTemplateColumns:
        "repeat(var(--cols-md, var(--cols-sm, var(--cols, 1))), minmax(0, 1fr))",
    },
    "screen and (min-width: 1024px)": {
      gridTemplateColumns:
        "repeat(var(--cols-lg, var(--cols-md, var(--cols, 1))), minmax(0, 1fr))",
    },
  },
});
