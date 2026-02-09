// api/src/modules/orders/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";
import crypto from "node:crypto";
import { makeOrderCreatedEnvelope, makeOrderStatusChangedEnvelope, topics } from "@taxi/shared";
import type { GeoPoint, OrderStatus, ServiceTypeCode } from "@taxi/shared";
import type { RealtimeHub } from "../realtime/wsServer.js";
import { publishStrict } from "../realtime/index.js";

// ==============================
// Types
// ==============================
type CreateOrderBody = {
  cityId: string;
  service: ServiceTypeCode;
  pickup: GeoPoint;
  dropoff: GeoPoint;
};

type PatchOrderStatusBody = {
  cityId: string;
  from: OrderStatus;
  to: OrderStatus;
  service?: ServiceTypeCode;
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

function normalizeService(v: unknown): ServiceTypeCode | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toUpperCase();
  if (s === "TAXI" || s === "DELIVERY" || s === "ROADSIDE") return s;
  return null;
}

function normalizeStatus(v: unknown): OrderStatus | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toUpperCase();
  // Dev-only: nu avem încă DB/state machine. Acceptăm orice status din union via cast,
  // dar păstrăm o validare minimă (non-empty).
  if (s.length === 0) return null;
  return s as OrderStatus;
}

// ==============================
// Module
// ==============================
export function registerOrdersModule(app: Express, hub: RealtimeHub): void {
  // Create order (dev happy-path)
  app.post("/orders", (req, res) => {
    const body = req.body as unknown;

    if (!body || typeof body !== "object") {
      res.status(400).json({ ok: false, error: "Invalid body" });
      return;
    }

    const b = body as Partial<CreateOrderBody>;

    if (typeof b.cityId !== "string" || b.cityId.trim().length === 0) {
      res.status(400).json({ ok: false, error: "cityId required" });
      return;
    }

    const service = normalizeService(b.service);
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
      cityId: b.cityId,
      service,
      status,
      pickup: b.pickup,
      dropoff: b.dropoff,
    });

    // publish către controlcenter + oraș (guard strict)
    publishStrict(hub, topics.controlcenter(b.cityId), env);
    publishStrict(hub, topics.city(b.cityId), env);

    res.status(201).json({ ok: true, orderId, status });
  });

  // Patch status (dev happy-path, no DB)
  app.patch("/orders/:id/status", (req, res) => {
    const orderId = String(req.params.id || "").trim();
    if (orderId.length === 0) {
      res.status(400).json({ ok: false, error: "orderId required" });
      return;
    }

    const body = req.body as unknown;
    if (!body || typeof body !== "object") {
      res.status(400).json({ ok: false, error: "Invalid body" });
      return;
    }

    const b = body as Partial<PatchOrderStatusBody>;

    if (typeof b.cityId !== "string" || b.cityId.trim().length === 0) {
      res.status(400).json({ ok: false, error: "cityId required" });
      return;
    }

    const from = normalizeStatus(b.from);
    const to = normalizeStatus(b.to);

    if (!from || !to) {
      res.status(400).json({ ok: false, error: "from/to required" });
      return;
    }

    const service = normalizeService(b.service ?? "TAXI");
    if (!service) {
      res.status(400).json({ ok: false, error: "invalid service" });
      return;
    }

    const env = makeOrderStatusChangedEnvelope({
      orderId,
      cityId: b.cityId,
      service,
      fromStatus: from,
      toStatus: to,
    });

    // publish către controlcenter + order topic (guard strict)
    publishStrict(hub, topics.controlcenter(b.cityId), env);
    publishStrict(hub, topics.order(orderId), env);

    res.status(200).json({ ok: true, orderId, from, to });
  });
}
