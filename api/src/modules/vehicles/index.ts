// api/src/modules/vehicles/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";
import { makeVehicleLocationUpdatedEnvelope, topics } from "@taxi/shared";
import type { RealtimeHub } from "../realtime/wsServer.js";

// ==============================
// Module
// ==============================
export function registerVehiclesModule(app: Express, hub: RealtimeHub): void {
  // Dev-only: update vehicle location to see dots moving on the map.
  app.patch("/dev/vehicles/:vehicleId/location", (req, res) => {
    const vehicleId = String(req.params.vehicleId || "").trim();
    const cityId = String(req.body?.cityId || "").trim();
    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);

    if (!vehicleId) return res.status(400).json({ ok: false, error: "Missing vehicleId" });
    if (!cityId) return res.status(400).json({ ok: false, error: "Missing cityId" });
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "Invalid lat/lng" });
    }

    const env = makeVehicleLocationUpdatedEnvelope({
      vehicleId,
      cityId,
      point: { lat, lng },
    });

    hub.publish(topics.controlcenter(cityId), env);

    return res.status(200).json({ ok: true });
  });
}
