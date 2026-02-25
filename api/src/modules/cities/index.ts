// api/src/modules/cities/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";

import type { ControlcenterTokenPayload } from "../auth/controlcenterToken.js";
import { verifyControlcenterToken } from "../auth/controlcenterToken.js";

// ==============================
// Types
// ==============================
export type CityPublic = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  dispatchPhone?: string;

  // ✅ Map initial view (single source of truth per city)
  mapCenter: { lng: number; lat: number };
  mapZoom: number;
};

type CityResponseOk = {
  ok: true;
  city: CityPublic;
};

type CitiesResponseOk = {
  ok: true;
  cities: ReadonlyArray<CityPublic>;
};

type CityResponseErr = {
  ok: false;
  error: string;
};

type CityResponse = CityResponseOk | CityResponseErr;

// ==============================
// Data (dev / MVP)
// ==============================
// ✅ extinzi ușor pe viitor (alte orașe, alte numere)
// NOTE: coordonatele sunt “aprox center” (poți rafina ulterior)
// IMPORTANT: aici e singurul loc unde “hardcodăm” view-ul per oraș.
const CITIES: ReadonlyArray<CityPublic> = [
  {
    id: "baia-mare",
    name: "Baia Mare",
    slug: "baia-mare",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0262942",
    mapCenter: { lng: 23.584, lat: 47.659 },
    mapZoom: 13,
  },
  {
    id: "cluj-napoca",
    name: "Cluj-Napoca",
    slug: "cluj-napoca",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0264942",
    mapCenter: { lng: 23.6236, lat: 46.7712 },
    mapZoom: 12.8,
  },
  {
    id: "satu-mare",
    name: "Satu Mare",
    slug: "satu-mare",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0261942",
    mapCenter: { lng: 22.8850, lat: 47.7920 },
    mapZoom: 13,
  },
  {
    id: "timisoara",
    name: "Timișoara",
    slug: "timisoara",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0256942",
    mapCenter: { lng: 21.2287, lat: 45.7489 },
    mapZoom: 12.8,
  },
  {
    id: "iasi",
    name: "Iași",
    slug: "iasi",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0232942",
    mapCenter: { lng: 27.5889, lat: 47.1585 },
    mapZoom: 12.9,
  },
] as const;

// ==============================
// Utils
// ==============================
function readEnv(name: string): string | null {
  const v = process.env[name];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

function findCity(cityId: string): CityPublic | null {
  const id = cityId.trim().toLowerCase();
  if (!id) return null;

  for (const c of CITIES) {
    if (c.id.toLowerCase() === id) return c;
    if (c.slug.toLowerCase() === id) return c;
  }
  return null;
}

function readBearerToken(req: { headers: Record<string, unknown> }): string {
  const h = req.headers.authorization;
  if (typeof h === "string" && h.toLowerCase().startsWith("bearer ")) {
    return h.slice("bearer ".length).trim();
  }
  // optional fallback (query param) — handy for non-browser clients
  const q = (req.headers["x-taxi-token"] as unknown) ?? null;
  return typeof q === "string" ? q.trim() : "";
}

function authOrNull(req: {
  headers: Record<string, unknown>;
}): { ok: true; payload: ControlcenterTokenPayload } | null {
  const secret = readEnv("TAXI_AUTH_TOKEN_SECRET");
  if (!secret) return null;

  const token = readBearerToken(req);
  if (!token) return null;

  const v = verifyControlcenterToken(secret, token);
  return v.ok ? v : null;
}

function filterCitiesForToken(payload: ControlcenterTokenPayload): ReadonlyArray<CityPublic> {
  const active = CITIES.filter((c) => c.isActive);

  if (payload.scope === "hq") return active;

  const only = payload.cityId ? active.filter((c) => c.id === payload.cityId) : [];
  return only;
}

function canAccessCity(payload: ControlcenterTokenPayload, cityId: string): boolean {
  const id = cityId.trim().toLowerCase();
  if (!id) return false;
  if (payload.scope === "hq") return true;
  return payload.cityId === id;
}

// ==============================
// Module
// ==============================
export function registerCitiesModule(app: Express): void {
  // ✅ list cities (tenant-aware)
  app.get("/cities", (req, res) => {
    const a = authOrNull(req);
    if (!a) {
      res.status(401).json({ ok: false, error: "unauthorized" } satisfies CityResponseErr);
      return;
    }

    const cities = filterCitiesForToken(a.payload);
    res.status(200).json({ ok: true, cities } satisfies CitiesResponseOk);
  });

  // ✅ city details (tenant-aware)
  app.get("/cities/:cityId", (req, res) => {
    const a = authOrNull(req);
    if (!a) {
      res.status(401).json({ ok: false, error: "unauthorized" } satisfies CityResponseErr);
      return;
    }

    const cityId = String(req.params.cityId || "").trim();
    if (!cityId) {
      res.status(400).json({ ok: false, error: "cityId required" } satisfies CityResponseErr);
      return;
    }

    if (!canAccessCity(a.payload, cityId)) {
      res.status(403).json({ ok: false, error: "forbidden" } satisfies CityResponseErr);
      return;
    }

    const city = findCity(cityId);
    if (!city) {
      res.status(404).json({ ok: false, error: "city not found" } satisfies CityResponseErr);
      return;
    }

    res.status(200).json({ ok: true, city } satisfies CityResponseOk);
  });

  // ✅ legacy dev route (kept for compatibility)
  app.get("/dev/cities/:cityId", (req, res) => {
    const cityId = String(req.params.cityId || "").trim();
    if (!cityId) {
      res.status(400).json({ ok: false, error: "cityId required" } satisfies CityResponseErr);
      return;
    }

    const city = findCity(cityId);
    if (!city) {
      res.status(404).json({ ok: false, error: "city not found" } satisfies CityResponseErr);
      return;
    }

    res.status(200).json({ ok: true, city } satisfies CityResponseOk);
  });
}