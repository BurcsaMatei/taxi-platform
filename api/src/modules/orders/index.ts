// api/src/modules/orders/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";
import crypto from "node:crypto";
import { makeOrderCreatedEnvelope, topics } from "@taxi/shared";
import type { GeoPoint, OrderStatus, ServiceTypeCode } from "@taxi/shared";
import type { RealtimeHub } from "../realtime/wsServer.js";

// ==============================
// Types
// ==============================
type CreateOrderBody = {
  cityId: string;
  service: ServiceTypeCode;
  pickup: GeoPoint;
  dropoff: GeoPoint;
};

// ==============================
// Utils
// ==============================
function isGeoPoint(v: unknown): v is GeoPoint {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as { lat?: unknown }).lat === "number" &&
    typeof (v as { lng?: unknown }).lng === "number"
  );
}

function parseServiceTypeCode(v: unknown): ServiceTypeCode | null {
  if (typeof v !== "string") return null;
  const normalized = v.trim().toUpperCase();
  if (normalized === "TAXI" || normalized === "DELIVERY" || normalized === "ROADSIDE") {
    return normalized as ServiceTypeCode;
  }
  return null;
}

// ==============================
// Module
// ==============================
export function registerOrdersModule(app: Express, hub: RealtimeHub): void {
  app.post("/orders", (req, res) => {
    const body = req.body as unknown;

    if (!body || typeof body !== "object") {
      res.status(400).json({ ok: false, error: "Invalid body" });
      return;
    }

    const b = body as Partial<CreateOrderBody>;

    const cityId = typeof b.cityId === "string" ? b.cityId.trim() : "";
    if (cityId.length === 0) {
      res.status(400).json({ ok: false, error: "cityId required" });
      return;
    }

    const service = parseServiceTypeCode((b as { service?: unknown }).service);
    if (!service) {
      res.status(400).json({ ok: false, error: "invalid service" });
      return;
    }

    if (!isGeoPoint(b.pickup) || !isGeoPoint(b.dropoff)) {
      res.status(400).json({ ok: false, error: "pickup/dropoff invalid" });
      return;
    }

    const orderId = crypto.randomUUID();
    const status: OrderStatus = "DRAFT";

    const env = makeOrderCreatedEnvelope({
      orderId,
      cityId,
      service,
      status,
      pickup: b.pickup,
      dropoff: b.dropoff,
    });

    // publish către controlcenter + oraș
    hub.publish(topics.controlcenter(cityId), env);
    hub.publish(topics.city(cityId), env);

    res.status(201).json({ ok: true, orderId, status });
  });
}
