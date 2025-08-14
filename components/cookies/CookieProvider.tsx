// components/cookies/CookieProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent, removeConsent } from "@/lib/cookies";

type ConsentCtx = {
  // state
  analytics: boolean;
  marketing: boolean;
  bannerVisible: boolean;
  dialogOpen: boolean;
  // actions
  openSettings: () => void;
  closeDialog: () => void;
  setAnalytics: (v: boolean) => void;
  setMarketing: (v: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePrefs: () => void;
  resetConsent: () => void;
  hasConsent: (cat: "necessary" | "analytics" | "marketing") => boolean;
};

const CookieContext = createContext<ConsentCtx | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieProvider");
  return ctx;
}

export default function CookieProvider({ children }: { children: React.ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // init din localStorage
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setAnalytics(!!stored.granted.analytics);
      setMarketing(!!stored.granted.marketing);
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }
  }, []);

  // acces rapid pentru gating
  const hasConsent = (cat: "necessary" | "analytics" | "marketing") => {
    if (cat === "necessary") return true;
    return cat === "analytics" ? analytics : marketing;
  };

  // actions
  const openSettings = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => setDialogOpen(false);

  const acceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    writeConsent({ necessary: true, analytics: true, marketing: true });
    setBannerVisible(false);
    setDialogOpen(false);
  };

  const rejectAll = () => {
    setAnalytics(false);
    setMarketing(false);
    writeConsent({ necessary: true, analytics: false, marketing: false });
    setBannerVisible(false);
    setDialogOpen(false);
  };

  const savePrefs = () => {
    writeConsent({ necessary: true, analytics, marketing });
    setBannerVisible(false);
    setDialogOpen(false);
  };

  const resetConsent = () => {
    removeConsent();
    setBannerVisible(true);
  };

  const value = useMemo<ConsentCtx>(
    () => ({
      analytics,
      marketing,
      bannerVisible,
      dialogOpen,
      openSettings,
      closeDialog,
      setAnalytics,
      setMarketing,
      acceptAll,
      rejectAll,
      savePrefs,
      resetConsent,
      hasConsent,
    }),
    [analytics, marketing, bannerVisible, dialogOpen]
  );

  return (
    <CookieContext.Provider value={value}>
      {children}
      <CookieBanner />
      <CookieDialog />
    </CookieContext.Provider>
  );
}

/* ---------- UI: Banner + Dialog randate global ---------- */

function CookieBanner() {
  const { bannerVisible, openSettings, rejectAll, acceptAll } = useCookieConsent();
  if (!bannerVisible) return null;

  return (
    <div
      role="region"
      aria-label="Notificare cookie"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        padding: "12px 16px",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, flex: "1 1 auto" }}>
        Folosim cookie-uri pentru a-ți oferi o experiență mai bună.{" "}
        <Link href="/cookie-policy">Vezi detalii</Link>.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={openSettings} style={btnGhost} aria-haspopup="dialog">
          Setări
        </button>
        <button type="button" onClick={rejectAll} style={btnSecondary}>
          Refuză
        </button>
        <button type="button" onClick={acceptAll} style={btnPrimary}>
          Acceptă
        </button>
      </div>
    </div>
  );
}

function CookieDialog() {
  const {
    dialogOpen,
    closeDialog,
    analytics,
    marketing,
    setAnalytics,
    setMarketing,
    rejectAll,
    acceptAll,
    savePrefs,
  } = useCookieConsent();

  if (!dialogOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-dialog-title"
      style={dialogOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
    >
      <div style={dialogCard}>
        <h2 id="cookie-dialog-title" style={{ marginTop: 0, marginBottom: 8 }}>
          Setări cookie
        </h2>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Alege categoriile de cookie pe care le permiți. Cookie-urile necesare sunt
          mereu active pentru funcționarea site-ului.
        </p>

        <fieldset style={fieldset}>
          <legend style={legend}>Necesare</legend>
          <label style={labelRow}>
            <input type="checkbox" checked readOnly aria-readonly />
            <span>Esențiale pentru funcționarea site-ului (mereu active)</span>
          </label>
        </fieldset>

        <fieldset style={fieldset}>
          <legend style={legend}>Analitice</legend>
          <label style={labelRow}>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span>Măsurare anonimă trafic și performanță</span>
          </label>
        </fieldset>

        <fieldset style={fieldset}>
          <legend style={legend}>Marketing</legend>
          <label style={labelRow}>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span>Personalizare reclame și tracking cross‑site</span>
          </label>
        </fieldset>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <button type="button" onClick={rejectAll} style={btnSecondary}>
            Refuză tot
          </button>
          <button type="button" onClick={acceptAll} style={btnPrimary}>
            Acceptă tot
          </button>
          <button type="button" onClick={savePrefs} style={btnPrimaryOutline}>
            Salvează preferințele
          </button>
        </div>
      </div>
    </div>
  );
}

/* ——— stiluri inline minimaliste ——— */
const btnPrimary: React.CSSProperties = {
  background: "#5561F2",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 600,
  cursor: "pointer",
};
const btnPrimaryOutline: React.CSSProperties = {
  background: "#fff",
  color: "#5561F2",
  border: "1px solid #5561F2",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 600,
  cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 600,
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  background: "transparent",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 600,
  cursor: "pointer",
};
const dialogOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.35)",
  display: "grid",
  placeItems: "center",
  zIndex: 1100,
};
const dialogCard: React.CSSProperties = {
  background: "#fff",
  color: "#111827",
  maxWidth: 560,
  width: "92vw",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 10px 40px rgba(0,0,0,.18)",
};
const fieldset: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  marginTop: 12,
};
const legend: React.CSSProperties = {
  padding: "0 6px",
  fontWeight: 700,
};
const labelRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};
