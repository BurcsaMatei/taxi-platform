// lib/cookies.ts

const KEY = "cookie_consent";

/** Model granular (compatibil cu CookieProvider) */
export type ConsentCategories = {
  necessary?: boolean;    // implicit true când e grant total
  analytics?: boolean;
  marketing?: boolean;
};

export type ConsentObject =
  | { granted: ConsentCategories }
  | { denied: true };

/** Compat cu banner-ul simplu */
export type ConsentValue = "granted" | "denied";

/** Return type pentru readConsent() */
export type StoredConsent = ConsentObject | null;

function isBrowser() {
  return typeof window !== "undefined";
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string, days = 365) {
  if (!isBrowser()) return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/** Normalizează valori vechi (string) sau JSON parțial la formatul granular */
function normalizeToObject(input: unknown): ConsentObject | null {
  if (!input) return null;

  // 1) Dacă e deja obiect cu granted/denied
  if (typeof input === "object" && input !== null) {
    const obj = input as any;
    if ("denied" in obj) return { denied: true };
    if ("granted" in obj) {
      const g = obj.granted ?? {};
      return {
        granted: {
          necessary: g.necessary ?? true,
          analytics: !!g.analytics,
          marketing: !!g.marketing,
        },
      };
    }
  }

  // 2) String vechi: "granted" / "denied"
  if (input === "granted") {
    return { granted: { necessary: true, analytics: true, marketing: true } };
  }
  if (input === "denied") return { denied: true };

  return null;
}

/** Citește din localStorage/cookie și normalizează la ConsentObject */
export function readConsent(): StoredConsent {
  if (!isBrowser()) return null;

  // încercăm JSON din localStorage
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      try {
        const json = JSON.parse(raw);
        const normalized = normalizeToObject(json);
        if (normalized) return normalized;
      } catch {
        // nu e JSON – poate fi string "granted"/"denied"
        const normalized = normalizeToObject(raw);
        if (normalized) return normalized;
      }
    }
  } catch {
    // ignore
  }

  // fallback cookie (string)
  const c = readCookie(KEY);
  return normalizeToObject(c);
}

/** Scrie consent – acceptă obiect granular sau string simplu */
export function writeConsent(value: ConsentObject | ConsentValue): void {
  if (!isBrowser()) return;

  const normalized = normalizeToObject(value);
  if (!normalized) return;

  // localStorage JSON (granular)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }

  // cookie – păstrăm un rezumat compact pentru simplitate
  const cookieValue =
    "denied" in normalized ? "denied" : "granted";
  writeCookie(KEY, cookieValue, 365);
}

/** Șterge ambele stocări */
export function removeConsent(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  removeCookie(KEY);
}

/** API simplu pentru banner minimalist */
export function getStoredConsent(): ConsentValue | null {
  const data = readConsent();
  if (!data) return null;
  if ("denied" in data) return "denied";
  return "granted";
}

export function saveConsent(value: ConsentValue) {
  writeConsent(value);
}

/** True dacă avem vreun tip de grant */
export function hasConsent(): boolean {
  const data = readConsent();
  if (!data) return false;
  if ("denied" in data) return false;
  const g = data.granted;
  return !!(g.necessary ?? true) || !!g.analytics || !!g.marketing;
}

/** Type guard – verifică dacă StoredConsent are granted */
export function isGrantedConsent(
  x: StoredConsent
): x is { granted: ConsentCategories } {
  return !!x && typeof x === "object" && "granted" in x;
}

/* Alias-uri pentru compatibilitate cu cod existent */
export const clearConsent = removeConsent;
