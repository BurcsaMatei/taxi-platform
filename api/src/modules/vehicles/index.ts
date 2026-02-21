// api/src/modules/vehicles/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";
import type { GeoPoint } from "@taxi/shared";
import { makeVehicleLocationUpdatedEnvelope, makeVehiclePresenceChangedEnvelope, topics } from "@taxi/shared";

import type { RealtimeHub } from "../realtime/wsServer.js";
import { publishStrict } from "../realtime/index.js";

import { getFleetDirectory, getFleetTotal, isKnownVehicle } from "./fleetDirectory.js";

// ==============================
// Types
// ==============================
type PresenceState = {
  online: boolean;
  lastSeenMs: number;
};

type LocationState = {
  point: GeoPoint;
  lastSeenMs: number;
};

// ==============================
// Constante
// ==============================
const ONLINE_TOUCH_MS = 60_000;

// key = `${cityId}:${vehicleId}`
const presence = new Map<string, PresenceState>();
const lastLocation = new Map<string, LocationState>();

function keyOf(cityId: string, vehicleId: string): string {
  return `${cityId}:${vehicleId}`;
}

// ==============================
// Public API (in-memory snapshots)
// ==============================
export function getOnlineVehicleLocations(
  cityId: string,
  nowMs = Date.now(),
): ReadonlyArray<{ vehicleId: string; point: GeoPoint; lastSeenMs: number }> {
  const out: Array<{ vehicleId: string; point: GeoPoint; lastSeenMs: number }> = [];

  for (const [k, p] of presence.entries()) {
    if (!k.startsWith(`${cityId}:`)) continue;
    if (!p.online) continue;
    if (nowMs - p.lastSeenMs > ONLINE_TOUCH_MS) continue;

    const loc = lastLocation.get(k);
    if (!loc) continue;
    if (nowMs - loc.lastSeenMs > ONLINE_TOUCH_MS) continue;

    const vehicleId = k.slice(`${cityId}:`.length);
    out.push({ vehicleId, point: loc.point, lastSeenMs: Math.max(p.lastSeenMs, loc.lastSeenMs) });
  }

  return out;
}

export function getOnlineTouchTtlMs(): number {
  return ONLINE_TOUCH_MS;
}

// ==============================
// Module
// ==============================
export function registerVehiclesModule(app: Express, hub: RealtimeHub): void {
  app.get("/dev/fleet/:cityId", (req, res) => {
    const cityId = String(req.params.cityId || "").trim();
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });

    const vehicles = getFleetDirectory(cityId);
    const total = getFleetTotal(cityId);

    return res.status(200).json({ ok: true, cityId, total, vehicles });
  });

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
    lastLocation.set(k, { point: { lat, lng }, lastSeenMs: now });

    if (!wasOnline) {
      const envPresence = makeVehiclePresenceChangedEnvelope({ vehicleId, cityId, online: true });
      publishStrict(hub, topics.controlcenter(cityId), envPresence);
      publishStrict(hub, topics.vehicle(vehicleId), envPresence);
    }

    const envLoc = makeVehicleLocationUpdatedEnvelope({ vehicleId, cityId, point: { lat, lng } });
    publishStrict(hub, topics.controlcenter(cityId), envLoc);
    publishStrict(hub, topics.vehicle(vehicleId), envLoc);

    return res.status(200).json({ ok: true });
  });

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
      const envPresence = makeVehiclePresenceChangedEnvelope({ vehicleId, cityId, online: false });
      publishStrict(hub, topics.controlcenter(cityId), envPresence);
      publishStrict(hub, topics.vehicle(vehicleId), envPresence);
    }

    return res.status(200).json({ ok: true });
  });

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

    return res.status(200).json({ ok: true, cityId, total, online, offline: Math.max(0, total - online) });
  });
}
