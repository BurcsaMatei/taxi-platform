// styles/breadcrumbs.css.ts
import { style } from "@vanilla-extract/css";

export const breadcrumbsWrapperClass = style({
  margin: "1rem 0",
  display: "flex",          // 🔹 adăugat
  justifyContent: "center", // 🔹 adăugat
});

export const breadcrumbsListClass = style({
  display: "flex",
  alignItems: "center",
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const breadcrumbLinkClass = style({
  color: "#1d4ed8", // albastru link
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
});

export const breadcrumbCurrentClass = style({
  color: "#6b7280", // gri pentru ultima treaptă
});

/* 🔹 Separatorul "/" automat */
export const breadcrumbItemClass = style({
  selectors: {
    "&:not(:first-child)::before": {
      content: "'/'",
      margin: "0 0.5rem",
      color: "#b5b5b5",
    },
  },
});
