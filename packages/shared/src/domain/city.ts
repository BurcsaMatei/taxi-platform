// packages/shared/src/domain/city.ts

import type { GeoPoint } from "./geo.js";

export interface City {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;

  // ✅ per-city dispatch number (for "Sună direct")
  // optional ca să nu rupă consumatori existenți
  dispatchPhone?: string;
}

// Shape-ul public al unui oraș expus de API (GET /cities, GET /cities/:cityId)
export interface CityPublic {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  dispatchPhone?: string;

  // ✅ Map initial view (single source of truth per city)
  mapCenter: GeoPoint;
  mapZoom: number;
}