// packages/shared/src/domain/auth.ts

// ==============================
// Controlcenter auth (doar tipuri — sign/verify trăiesc în api)
// ==============================
export type ControlcenterScope = "hq" | "city";

export type ControlcenterTokenPayload = {
  v: 1;
  sub: "controlcenter";
  scope: ControlcenterScope;
  cityId?: string; // only for scope=city
  iat: number; // unix seconds
  exp: number; // unix seconds
};
