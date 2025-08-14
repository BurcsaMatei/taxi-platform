// lib/cookies.ts
export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = {
  version: number;
  granted: ConsentCategories;
  updatedAt: string;
};

const KEY = "cookie_consent_v1";
const VERSION = 1;

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed?.version !== VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(consent: ConsentCategories) {
  const state: ConsentState = {
    version: VERSION,
    granted: { necessary: true, analytics: !!consent.analytics, marketing: !!consent.marketing },
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function removeConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
