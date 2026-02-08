import type { GeoPlace } from "../domain/geo";
import type { OrderStatus } from "../domain/status";
import type { ServiceTypeCode } from "../domain/service";

export interface QuoteRequest {
  cityId: string;
  serviceType: ServiceTypeCode;
  pickup: GeoPlace;
  dropoff?: GeoPlace;
}

export interface QuoteResponse {
  currency: "RON";
  quotedPrice: number;
  // opțional: distance/eta dacă vrem să le expunem încă din MVP
  distanceMeters?: number;
  durationSeconds?: number;
}

export interface CreateOrderRequest {
  cityId: string;
  serviceType: ServiceTypeCode;

  pickup: GeoPlace;
  dropoff?: GeoPlace;

  notes?: string;
  promoCode?: string;

  // pentru MVP: trimitem quote-ul calculat server-side, nu din client
}

export interface CreateOrderResponse {
  orderId: string;
  status: OrderStatus; // de obicei PAYMENT_PENDING sau DISPATCHING, depinde de model
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  nextStatus: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  orderId: string;
  status: OrderStatus;
  updatedAt: string; // ISO
}
