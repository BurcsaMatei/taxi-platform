// controlcenter/lib/cities/citiesClient.ts

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
};

export type CitiesResponseOk = {
  ok: true;
  cities: ReadonlyArray<CityPublic>;
};

// ==============================
// API
// ==============================
export async function fetchCities(authToken: string): Promise<ReadonlyArray<CityPublic>> {
  const t = authToken.trim();
  if (!t) throw new Error("Missing auth token");

  const res = await fetch("/api/cities", {
    method: "GET",
    headers: { authorization: `Bearer ${t}` },
  });

  const data = (await res.json()) as unknown;
  if (!res.ok) throw new Error("Cities endpoint error");

  if (!data || typeof data !== "object") throw new Error("Invalid cities response");
  const d = data as Partial<CitiesResponseOk>;
  if (!d.ok || !Array.isArray(d.cities)) throw new Error("Cities endpoint returned error");

  return d.cities as ReadonlyArray<CityPublic>;
}
