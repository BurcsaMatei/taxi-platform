// controlcenter/pages/api/cities/index.ts

// ==============================
// Imports
// ==============================
import type { NextApiRequest, NextApiResponse } from "next";

// ==============================
// Types
// ==============================
type CitiesOk = { ok: true; cities: ReadonlyArray<unknown> };
type CitiesErr = { ok: false; error: string };

// ==============================
// Utils
// ==============================
function readEnv(name: string): string | null {
  const v = process.env[name];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

function apiBaseUrl(): string {
  return readEnv("TAXI_API_BASE_URL") ?? "http://localhost:3001";
}

// ==============================
// Handler
// ==============================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CitiesOk | CitiesErr>,
) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const upstream = `${apiBaseUrl()}/cities`;
    const auth = typeof req.headers.authorization === "string" ? req.headers.authorization : "";

    const r = await fetch(upstream, {
      method: "GET",
      headers: auth ? { authorization: auth } : {},
    });

    const text = await r.text();
    const data = JSON.parse(text);
    res.status(r.status).json(data);
  } catch {
    res.status(502).json({ ok: false, error: "Cities proxy error" });
  }
}
