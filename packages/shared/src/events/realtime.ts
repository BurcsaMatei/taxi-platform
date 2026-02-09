// packages/shared/src/events/realtime.ts

// ==============================
// Types
// ==============================
import type { GeoPoint } from "../domain/geo.js";
import type { OrderStatus } from "../domain/status.js";
import type { ServiceTypeCode } from "../domain/service.js";

export type RealtimeEventName = "order.created" | "order.statusChanged";

export type OrderCreatedPayload = {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  status: OrderStatus;
  pickup: GeoPoint;
  dropoff: GeoPoint;
};

export type OrderStatusChangedPayload = {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
};

export type RealtimeEnvelope =
  | {
      name: "order.created";
      ts: string; // ISO
      payload: OrderCreatedPayload;
    }
  | {
      name: "order.statusChanged";
      ts: string; // ISO
      payload: OrderStatusChangedPayload;
    };

// ==============================
// Factories
// ==============================
function nowIso(): string {
  return new Date().toISOString();
}

export function makeOrderCreatedEnvelope(payload: OrderCreatedPayload): RealtimeEnvelope {
  return {
    name: "order.created",
    ts: nowIso(),
    payload,
  };
}

export function makeOrderStatusChangedEnvelope(
  payload: OrderStatusChangedPayload
): RealtimeEnvelope {
  return {
    name: "order.statusChanged",
    ts: nowIso(),
    payload,
  };
}
