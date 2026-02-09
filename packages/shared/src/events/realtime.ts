import type { GeoPoint } from "../domain/geo.js";
import type { OrderStatus } from "../domain/status.js";
import type { ServiceTypeCode } from "../domain/service.js";

// ==============================
// Realtime event names
// ==============================
export type RealtimeEventName =
  | "order.created"
  | "order.assigned"
  | "order.statusChanged"
  | "driver.locationUpdated"
  | "vehicle.locationUpdated";
// (mai târziu) | "dispatch.metricsUpdated"

// ==============================
// Base envelope
// ==============================
export interface RealtimeEnvelopeBase<N extends RealtimeEventName, P> {
  name: N;
  ts: string; // ISO
  payload: P;
}

// ==============================
// Event payloads
// ==============================
export interface RealtimeOrderCreatedPayload {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  status: OrderStatus;
  pickup: GeoPoint;
  dropoff: GeoPoint;
}

export interface RealtimeOrderAssignedPayload {
  orderId: string;
  cityId: string;
  driverId: string;
  vehicleId: string;
}

export interface RealtimeOrderStatusChangedPayload {
  orderId: string;
  cityId: string;
  from: OrderStatus;
  to: OrderStatus;
}

export interface RealtimeDriverLocationUpdatedPayload {
  driverId: string;
  cityId: string;
  at: GeoPoint;
}

export interface RealtimeVehicleLocationUpdatedPayload {
  vehicleId: string;
  cityId: string;
  at: GeoPoint;
}

// ==============================
// Envelope union
// ==============================
export type RealtimeEnvelope =
  | RealtimeEnvelopeBase<"order.created", RealtimeOrderCreatedPayload>
  | RealtimeEnvelopeBase<"order.assigned", RealtimeOrderAssignedPayload>
  | RealtimeEnvelopeBase<"order.statusChanged", RealtimeOrderStatusChangedPayload>
  | RealtimeEnvelopeBase<"driver.locationUpdated", RealtimeDriverLocationUpdatedPayload>
  | RealtimeEnvelopeBase<"vehicle.locationUpdated", RealtimeVehicleLocationUpdatedPayload>;

// ==============================
// Helpers
// ==============================
export function nowIso(): string {
  return new Date().toISOString();
}

export function makeOrderCreatedEnvelope(payload: RealtimeOrderCreatedPayload): RealtimeEnvelope {
  return { name: "order.created", ts: nowIso(), payload };
}

