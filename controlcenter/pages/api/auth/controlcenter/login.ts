// controlcenter/pages/api/auth/controlcenter/login.ts

// ==============================
// Imports
// ==============================
import type { NextApiRequest, NextApiResponse } from "next";

// ==============================
// Types
// ==============================
type LoginOk = {
  ok: true;
  token: string;
  scope: "hq" | "city";
  cityId: string;
  exp: number;
};

type LoginErr = {
  ok: false;
  error: string;
};

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
  res: NextApiResponse<LoginOk | LoginErr>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const upstream = `${apiBaseUrl()}/auth/controlcenter/login`;

    const r = await fetch(upstream, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
    });

    const data = (await r.json()) as LoginOk | LoginErr;
    res.status(r.status).json(data);
  } catch {
    res.status(502).json({ ok: false, error: "Auth proxy error" });
  }
}
