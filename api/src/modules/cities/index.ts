// api/src/modules/cities/index.ts

// ==============================
// Imports
// ==============================
import type { Express } from "express";

// ==============================
// Types
// ==============================
type CityPublic = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  dispatchPhone?: string;
};

type CityResponseOk = {
  ok: true;
  city: CityPublic;
};

type CityResponseErr = {
  ok: false;
  error: string;
};

type CityResponse = CityResponseOk | CityResponseErr;

// ==============================
// Data (dev / MVP)
// ==============================
// ✅ aici extinzi ușor pe viitor (alte orașe, alte numere)
const CITIES: ReadonlyArray<CityPublic> = [
  {
    id: "baia-mare",
    name: "Baia Mare",
    slug: "baia-mare",
    timezone: "Europe/Bucharest",
    isActive: true,
    dispatchPhone: "0262942",
  },
] as const;

// ==============================
// Utils
// ==============================
function findCity(cityId: string): CityPublic | null {
  const id = cityId.trim().toLowerCase();
  if (!id) return null;

  for (const c of CITIES) {
    if (c.id.toLowerCase() === id) return c;
    if (c.slug.toLowerCase() === id) return c;
  }
  return null;
}

// ==============================
// Module
// ==============================
export function registerCitiesModule(app: Express): void {
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