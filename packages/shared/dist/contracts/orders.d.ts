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
}
export interface CreateOrderResponse {
    orderId: string;
    status: OrderStatus;
}
export interface UpdateOrderStatusRequest {
    orderId: string;
    nextStatus: OrderStatus;
}
export interface UpdateOrderStatusResponse {
    orderId: string;
    status: OrderStatus;
    updatedAt: string;
}
//# sourceMappingURL=orders.d.ts.map