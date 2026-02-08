import type { GeoPoint } from "../domain/geo";
import type { OrderStatus } from "../domain/status";
import type { ServiceTypeCode } from "../domain/service";
export type RealtimeEventName = "driver.location.updated" | "driver.onlineStatus.updated" | "order.created" | "order.status.updated" | "dispatch.offer.created" | "dispatch.offer.expired" | "dispatch.offer.accepted" | "dispatch.offer.declined";
export interface DriverLocationUpdatedPayload {
    driverId: string;
    vehicleId?: string;
    cityId: string;
    point: GeoPoint;
    heading?: number;
    speed?: number;
    accuracy?: number;
    recordedAt: string;
}
export interface DriverOnlineStatusUpdatedPayload {
    driverId: string;
    cityId: string;
    onlineStatus: "OFFLINE" | "ONLINE" | "BUSY";
    updatedAt: string;
}
export interface OrderCreatedPayload {
    orderId: string;
    cityId: string;
    serviceType: ServiceTypeCode;
    userId: string;
    createdAt: string;
}
export interface OrderStatusUpdatedPayload {
    orderId: string;
    cityId: string;
    status: OrderStatus;
    assignedDriverId?: string;
    assignedVehicleId?: string;
    updatedAt: string;
}
export interface DispatchOfferCreatedPayload {
    orderId: string;
    cityId: string;
    driverId: string;
    offeredAt: string;
    expiresAt: string;
}
export interface DispatchOfferExpiredPayload {
    orderId: string;
    cityId: string;
    driverId: string;
    expiredAt: string;
}
export interface DispatchOfferAcceptedPayload {
    orderId: string;
    cityId: string;
    driverId: string;
    acceptedAt: string;
}
export interface DispatchOfferDeclinedPayload {
    orderId: string;
    cityId: string;
    driverId: string;
    declinedAt: string;
}
export type RealtimeEventPayloadByName = {
    "driver.location.updated": DriverLocationUpdatedPayload;
    "driver.onlineStatus.updated": DriverOnlineStatusUpdatedPayload;
    "order.created": OrderCreatedPayload;
    "order.status.updated": OrderStatusUpdatedPayload;
    "dispatch.offer.created": DispatchOfferCreatedPayload;
    "dispatch.offer.expired": DispatchOfferExpiredPayload;
    "dispatch.offer.accepted": DispatchOfferAcceptedPayload;
    "dispatch.offer.declined": DispatchOfferDeclinedPayload;
};
export interface RealtimeEnvelope<Name extends RealtimeEventName = RealtimeEventName> {
    name: Name;
    payload: RealtimeEventPayloadByName[Name];
}
//# sourceMappingURL=realtime.d.ts.map