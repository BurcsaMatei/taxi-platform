// api/src/modules/auth/controlcenterToken.ts

// ==============================
// Imports
// ==============================
import { createHmac, timingSafeEqual } from "node:crypto";

// ==============================
// Types
// ==============================
export type ControlcenterScope = "hq" | "city";

export type ControlcenterTokenPayload = {
  v: 1;
  sub: "controlcenter";
  scope: ControlcenterScope;
  cityId?: string; // only for scope=city
  iat: number; // unix seconds
  exp: number; // unix seconds
};

// ==============================
// Utils
// ==============================
function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeToBuffer(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/") + pad;
  return Buffer.from(b64, "base64");
}

function hmac(secret: string, payloadB64: string): Buffer {
  return createHmac("sha256", secret).update(payloadB64).digest();
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function parsePayload(raw: unknown): ControlcenterTokenPayload | null {
  if (!isObject(raw)) return null;

  const v = raw.v;
  const sub = raw.sub;
  const scope = raw.scope;
  const iat = raw.iat;
  const exp = raw.exp;
  const cityId = raw.cityId;

  if (v !== 1) return null;
  if (sub !== "controlcenter") return null;
  if (scope !== "hq" && scope !== "city") return null;
  if (typeof iat !== "number" || !Number.isFinite(iat)) return null;
  if (typeof exp !== "number" || !Number.isFinite(exp)) return null;

  if (scope === "city") {
    if (typeof cityId !== "string" || cityId.trim().length === 0) return null;
    return {
      v: 1,
      sub: "controlcenter",
      scope: "city",
      cityId: cityId.trim().toLowerCase(),
      iat,
      exp,
    };
  }

  return { v: 1, sub: "controlcenter", scope: "hq", iat, exp };
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

// ==============================
// API
// ==============================
export function signControlcenterToken(secret: string, payload: ControlcenterTokenPayload): string {
  const json = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(json, "utf8"));
  const sig = hmac(secret, payloadB64);
  const sigB64 = base64UrlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyControlcenterToken(
  secret: string,
  token: string,
): { ok: true; payload: ControlcenterTokenPayload } | { ok: false; error: string } {
  const trimmed = token.trim();
  if (!trimmed) return { ok: false, error: "missing token" };

  const parts = trimmed.split(".");
  if (parts.length !== 2) return { ok: false, error: "invalid token format" };

  const payloadB64 = parts[0] ?? "";
  const sigB64 = parts[1] ?? "";
  if (!payloadB64 || !sigB64) return { ok: false, error: "invalid token parts" };

  let sig: Buffer;
  try {
    sig = base64UrlDecodeToBuffer(sigB64);
  } catch {
    return { ok: false, error: "invalid signature encoding" };
  }

  const expected = hmac(secret, payloadB64);

  if (sig.length !== expected.length) return { ok: false, error: "bad signature" };
  if (!timingSafeEqual(sig, expected)) return { ok: false, error: "bad signature" };

  let payloadRaw: unknown;
  try {
    const json = base64UrlDecodeToBuffer(payloadB64).toString("utf8");
    payloadRaw = JSON.parse(json) as unknown;
  } catch {
    return { ok: false, error: "invalid payload" };
  }

  const payload = parsePayload(payloadRaw);
  if (!payload) return { ok: false, error: "invalid payload shape" };

  const n = nowSec();
  if (payload.exp <= n) return { ok: false, error: "token expired" };
  if (payload.iat > n + 60) return { ok: false, error: "token iat in future" };

  return { ok: true, payload };
}