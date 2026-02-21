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
  | "order.assigned"
  | "order.dispatchFailed"
  | "order.userCalledDispatch"
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

export type OrderAssignedPayload = {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  vehicleId: string; // indicativ (ex: "01")
  distanceMeters?: number;
};

export type OrderDispatchFailedReason = "NO_AVAILABLE_VEHICLE";

export type OrderDispatchFailedPayload = {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  reason: OrderDispatchFailedReason;
};

export type OrderCallTarget = "DISPATCH";
export type OrderCallSource = "USER_APP" | "DRIVER_APP" | "CONTROL_CENTER";

export type OrderUserCalledDispatchPayload = {
  orderId: string;
  cityId: string;
  service: ServiceTypeCode;
  target: OrderCallTarget; // "DISPATCH"
  phoneNumber: string; // numărul dispeceratului afișat userului
  source: OrderCallSource; // ex: "USER_APP"
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
      name: "order.assigned";
      ts: string; // ISO
      payload: OrderAssignedPayload;
    }
  | {
      name: "order.dispatchFailed";
      ts: string; // ISO
      payload: OrderDispatchFailedPayload;
    }
  | {
      name: "order.userCalledDispatch";
      ts: string; // ISO
      payload: OrderUserCalledDispatchPayload;
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

export function makeOrderAssignedEnvelope(payload: OrderAssignedPayload): RealtimeEnvelope {
  return { name: "order.assigned", ts: nowIso(), payload };
}

export function makeOrderDispatchFailedEnvelope(payload: OrderDispatchFailedPayload): RealtimeEnvelope {
  return { name: "order.dispatchFailed", ts: nowIso(), payload };
}

export function makeOrderUserCalledDispatchEnvelope(
  payload: OrderUserCalledDispatchPayload,
): RealtimeEnvelope {
  return { name: "order.userCalledDispatch", ts: nowIso(), payload };
}

export function makeVehicleLocationUpdatedEnvelope(payload: VehicleLocationUpdatedPayload): RealtimeEnvelope {
  return { name: "vehicle.locationUpdated", ts: nowIso(), payload };
}

export function makeVehiclePresenceChangedEnvelope(payload: VehiclePresenceChangedPayload): RealtimeEnvelope {
  return { name: "vehicle.presenceChanged", ts: nowIso(), payload };
}