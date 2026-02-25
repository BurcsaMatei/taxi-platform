// api/src/modules/auth/index.ts

// ==============================
// Imports
// ==============================
import type { Express, Request, Response } from "express";

import type { ControlcenterScope, ControlcenterTokenPayload } from "./controlcenterToken.js";
import { signControlcenterToken } from "./controlcenterToken.js";

// ==============================
// Types
// ==============================
type LoginBody = {
  cityId?: unknown;
  pin?: unknown;
};

type LoginOk = {
  ok: true;
  token: string;
  scope: ControlcenterScope;
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
function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function readEnv(name: string): string | null {
  const v = process.env[name];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

function readIntEnv(name: string): number | null {
  const v = readEnv(name);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

function parsePinsJson(raw: string): Record<string, string> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (!isObject(parsed)) return null;

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof k !== "string") continue;
    if (typeof v !== "string") continue;

    const key = k.trim().toLowerCase();
    const val = v.trim();
    if (!key || !val) continue;

    out[key] = val;
  }

  return out;
}

function bad(res: Response, code: number, msg: string): void {
  const body: LoginErr = { ok: false, error: msg };
  res.status(code).json(body);
}

// ==============================
// Module
// ==============================
export function registerAuthModule(app: Express): void {
  app.post("/auth/controlcenter/login", (req: Request, res: Response) => {
    const secret = readEnv("TAXI_AUTH_TOKEN_SECRET");
    const hqPin = readEnv("TAXI_CONTROL_CENTER_HQ_PIN");
    const hqCityId = readEnv("TAXI_CONTROL_CENTER_HQ_CITY_ID");
    const pinsJson = readEnv("TAXI_CONTROL_CENTER_CITY_PINS_JSON");

    if (!secret) return bad(res, 500, "Missing TAXI_AUTH_TOKEN_SECRET");
    if (!hqPin) return bad(res, 500, "Missing TAXI_CONTROL_CENTER_HQ_PIN");
    if (!hqCityId) return bad(res, 500, "Missing TAXI_CONTROL_CENTER_HQ_CITY_ID");
    if (!pinsJson) return bad(res, 500, "Missing TAXI_CONTROL_CENTER_CITY_PINS_JSON");

    const cityPins = parsePinsJson(pinsJson);
    if (!cityPins) return bad(res, 500, "Invalid TAXI_CONTROL_CENTER_CITY_PINS_JSON");

    const ttl = readIntEnv("TAXI_AUTH_TOKEN_TTL_SEC") ?? 86_400;

    const body = req.body as unknown;
    const b = (isObject(body) ? (body as LoginBody) : {}) as LoginBody;

    const cityIdRaw = typeof b.cityId === "string" ? b.cityId.trim().toLowerCase() : "";
    const pinRaw = typeof b.pin === "string" ? b.pin.trim() : "";

    if (!cityIdRaw) return bad(res, 400, "Missing cityId");
    if (!pinRaw) return bad(res, 400, "Missing pin");

    const n = nowSec();
    const exp = n + ttl;

    // ✅ HQ: pin matches HQ pin => global token (HQ can see all cities)
    if (pinRaw === hqPin) {
      const payload: ControlcenterTokenPayload = {
        v: 1,
        sub: "controlcenter",
        scope: "hq",
        iat: n,
        exp,
      };

      const token = signControlcenterToken(secret, payload);

      const out: LoginOk = {
        ok: true,
        token,
        scope: "hq",
        cityId: hqCityId,
        exp,
      };

      res.status(200).json(out);
      return;
    }

    // ✅ CITY: pin matches exactly for that cityId
    const expectedCityPin = cityPins[cityIdRaw];
    if (!expectedCityPin || expectedCityPin !== pinRaw) {
      return bad(res, 401, "Invalid PIN");
    }

    const payload: ControlcenterTokenPayload = {
      v: 1,
      sub: "controlcenter",
      scope: "city",
      cityId: cityIdRaw,
      iat: n,
      exp,
    };

    const token = signControlcenterToken(secret, payload);

    const out: LoginOk = {
      ok: true,
      token,
      scope: "city",
      cityId: cityIdRaw,
      exp,
    };

    res.status(200).json(out);
  });
}