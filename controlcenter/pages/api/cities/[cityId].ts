// controlcenter/pages/api/cities/[cityId].ts

// ==============================
// Imports
// ==============================
import type { NextApiRequest, NextApiResponse } from "next";

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
// Constante
// ==============================
const DEFAULT_API_BASE_URL = "http://localhost:3001";

// ==============================
// Utils
// ==============================
function apiBaseUrl(): string {
  const v = process.env.API_BASE_URL;
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return DEFAULT_API_BASE_URL;
}

function getCityId(req: NextApiRequest): string | null {
  const raw = req.query.cityId;
  if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();
  return null;
}

// ==============================
// Handler
// ==============================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CityResponse>,
): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const cityId = getCityId(req);
  if (!cityId) {
    res.status(400).json({ ok: false, error: "Missing cityId" });
    return;
  }

  const base = apiBaseUrl();
  const url = `${base}/dev/cities/${encodeURIComponent(cityId)}`;

  try {
    const r = await fetch(url, { method: "GET" });

    if (!r.ok) {
      res.status(502).json({ ok: false, error: `Upstream error: ${r.status}` });
      return;
    }

    const data = (await r.json()) as unknown;

    if (!data || typeof data !== "object") {
      res.status(502).json({ ok: false, error: "Invalid upstream response" });
      return;
    }

    const d = data as Partial<CityResponseOk>;
    if (
      !d.ok ||
      !d.city ||
      typeof d.city !== "object" ||
      typeof (d.city as { id?: unknown }).id !== "string"
    ) {
      res.status(502).json({ ok: false, error: "Upstream returned unexpected shape" });
      return;
    }

    res.status(200).json(d as CityResponseOk);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    res.status(502).json({ ok: false, error: msg });
  }
}
