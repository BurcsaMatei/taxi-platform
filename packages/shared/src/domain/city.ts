// packages/shared/src/domain/city.ts

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