// packages/shared/src/contracts/orders.ts

// ==============================
// Imports
// ==============================
import type { GeoPoint } from "../domain/geo.js";
import type { OrderStatus } from "../domain/status.js";
import type { ServiceTypeCode } from "../domain/service.js";
import type { OrderCallSource, OrderCallTarget } from "../events/realtime.js";

// ==============================
// POST /orders
// ==============================
export interface CreateOrderRequest {
  cityId: string;
  service: ServiceTypeCode;
  pickup: GeoPoint;
  dropoff: GeoPoint;
}

export type CreateOrderResponse =
  | {
      ok: true;
      orderId: string;
      status: OrderStatus;
      assignedVehicleId: string | null;
      dispatch: "OK" | "FAILED";
      reason?: string;
    }
  | { ok: false; error: string };

// ==============================
// PATCH /orders/:id/status (orderId în URL)
// ==============================
export interface PatchOrderStatusRequest {
  cityId: string;
  from: OrderStatus;
  to: OrderStatus;
  service?: ServiceTypeCode;
}

export type PatchOrderStatusResponse =
  | { ok: true; orderId: string; from: OrderStatus; to: OrderStatus }
  | { ok: false; error: string };

// ==============================
// POST /orders/:id/call (orderId în URL)
// ==============================
export interface CallOrderRequest {
  cityId: string;
  service: ServiceTypeCode;
  target: OrderCallTarget;
  phoneNumber: string;
  source?: OrderCallSource;
}

export type CallOrderResponse = { ok: true } | { ok: false; error: string };
