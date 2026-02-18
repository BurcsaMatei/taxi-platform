// packages/shared/src/events/realtime.ts

// ==============================
// Types
// ==============================
import type { GeoPoint } from "../domain/geo.js";
import type { OrderStatus } from "../domain/status.js";
import type { ServiceTypeCode } from "../domain/service.js";

export type RealtimeEventName =
  | "order.created"
  | "order.statusChanged"
  | "vehicle.locationUpdated"
  | "vehicle.presenceChanged";

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

export type VehicleLocationUpdatedPayload = {
  vehicleId: string; // indicativ (ex: "01")
  cityId: string;
  point: GeoPoint; // { lat, lng }
  heading?: number; // degrees (0..360)
  speed?: number; // dev-only (unit not assumed)
};

export type VehiclePresenceChangedPayload = {
  vehicleId: string; // indicativ (ex: "01")
  cityId: string;
  online: boolean;
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
    }
  | {
      name: "vehicle.locationUpdated";
      ts: string; // ISO
      payload: VehicleLocationUpdatedPayload;
    }
  | {
      name: "vehicle.presenceChanged";
      ts: string; // ISO
      payload: VehiclePresenceChangedPayload;
    };

// ==============================
// Factories
// ==============================
function nowIso(): string {
  return new Date().toISOString();
}

export function makeOrderCreatedEnvelope(payload: OrderCreatedPayload): RealtimeEnvelope {
  return { name: "order.created", ts: nowIso(), payload };
}

export function makeOrderStatusChangedEnvelope(payload: OrderStatusChangedPayload): RealtimeEnvelope {
  return { name: "order.statusChanged", ts: nowIso(), payload };
}

export function makeVehicleLocationUpdatedEnvelope(payload: VehicleLocationUpdatedPayload): RealtimeEnvelope {
  return { name: "vehicle.locationUpdated", ts: nowIso(), payload };
}

export function makeVehiclePresenceChangedEnvelope(payload: VehiclePresenceChangedPayload): RealtimeEnvelope {
  return { name: "vehicle.presenceChanged", ts: nowIso(), payload };
}
