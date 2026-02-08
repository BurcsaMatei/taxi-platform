import type { GeoPlace } from "./geo";
import type { OrderStatus } from "./status";
import type { ServiceTypeCode } from "./service";

export interface Order {
  id: string;
  cityId: string;
  serviceType: ServiceTypeCode;

  userId: string;

  pickup: GeoPlace;
  dropoff?: GeoPlace;

  notes?: string;

  status: OrderStatus;

  quotedPrice?: number;
  finalPrice?: number;
  currency: "RON";

  assignedDriverId?: string;
  assignedVehicleId?: string;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}
