// api/src/modules/vehicles/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";
import {
  makeVehicleLocationUpdatedEnvelope,
  makeVehiclePresenceChangedEnvelope,
  topics,
} from "@taxi/shared";

import type { RealtimeHub } from "../realtime/wsServer.js";
import { publishStrict } from "../realtime/index.js";

import { getFleetDirectory, getFleetTotal, isKnownVehicle } from "./fleetDirectory.js";

// ==============================
// Constante
// ==============================
const ONLINE_TOUCH_MS = 60_000;

// key = `${cityId}:${vehicleId}`
const presence = new Map<string, { online: boolean; lastSeenMs: number }>();

function keyOf(cityId: string, vehicleId: string): string {
  return `${cityId}:${vehicleId}`;
}

// ==============================
// Module
// ==============================
export function registerVehiclesModule(app: Express, hub: RealtimeHub): void {
  // Dev: list fleet directory (placeholder) so you know where to swap real data later.
  app.get("/dev/fleet/:cityId", (req, res) => {
    const cityId = String(req.params.cityId || "").trim();
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });

    const vehicles = getFleetDirectory(cityId);
    const total = getFleetTotal(cityId);

    return res.status(200).json({
      ok: true,
      cityId,
      total,
      vehicles,
    });
  });

  // Dev-only: update vehicle location to see markers moving on the map.
  app.patch("/dev/vehicles/:vehicleId/location", (req, res) => {
    const vehicleId = String(req.params.vehicleId || "").trim();
    const cityId = String(req.body?.cityId || "").trim();
    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);

    if (!vehicleId) return res.status(400).json({ ok: false, error: "Missing vehicleId" });
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });

    if (!isKnownVehicle(cityId, vehicleId)) {
      return res.status(404).json({ ok: false, error: "Unknown vehicleId for city" });
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "Invalid lat/lng" });
    }

    const now = Date.now();
    const k = keyOf(cityId, vehicleId);
    const prev = presence.get(k);
    const wasOnline = prev?.online === true;

    presence.set(k, { online: true, lastSeenMs: now });

    // publish presenceChanged only when we flip offline -> online
    if (!wasOnline) {
      const envPresence = makeVehiclePresenceChangedEnvelope({
        vehicleId,
        cityId,
        online: true,
      });
      publishStrict(hub, topics.controlcenter(cityId), envPresence);
      publishStrict(hub, topics.vehicle(vehicleId), envPresence);
    }

    const envLoc = makeVehicleLocationUpdatedEnvelope({
      vehicleId,
      cityId,
      point: { lat, lng },
    });

    publishStrict(hub, topics.controlcenter(cityId), envLoc);
    publishStrict(hub, topics.vehicle(vehicleId), envLoc);

    return res.status(200).json({ ok: true });
  });

  // Dev-only: force vehicle offline (so controlcenter can show offline counts deterministically)
  app.patch("/dev/vehicles/:vehicleId/offline", (req, res) => {
    const vehicleId = String(req.params.vehicleId || "").trim();
    const cityId = String(req.body?.cityId || "").trim();

    if (!vehicleId) return res.status(400).json({ ok: false, error: "Missing vehicleId" });
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });

    if (!isKnownVehicle(cityId, vehicleId)) {
      return res.status(404).json({ ok: false, error: "Unknown vehicleId for city" });
    }

    const k = keyOf(cityId, vehicleId);
    const prev = presence.get(k);
    const wasOnline = prev?.online === true;

    presence.set(k, { online: false, lastSeenMs: Date.now() });

    if (wasOnline) {
      const envPresence = makeVehiclePresenceChangedEnvelope({
        vehicleId,
        cityId,
        online: false,
      });
      publishStrict(hub, topics.controlcenter(cityId), envPresence);
      publishStrict(hub, topics.vehicle(vehicleId), envPresence);
    }

    return res.status(200).json({ ok: true });
  });

  // Optional: dev summary (for quick sanity)
  app.get("/dev/fleet/:cityId/summary", (req, res) => {
    const cityId = String(req.params.cityId || "").trim();
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });

    const total = getFleetTotal(cityId);
    const now = Date.now();

    let online = 0;

    for (const [k, v] of presence.entries()) {
      if (!k.startsWith(`${cityId}:`)) continue;
      if (!v.online) continue;
      if (now - v.lastSeenMs > ONLINE_TOUCH_MS) continue;
      online += 1;
    }

    return res.status(200).json({
      ok: true,
      cityId,
      total,
      online,
      offline: Math.max(0, total - online),
    });
  });
}
