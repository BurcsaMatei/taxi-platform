// components/CookieConsent.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getStoredConsent, saveConsent, hasConsent } from "@/lib/cookies";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // starea toggle-urilor din dialog
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setShowBanner(true);
    } else {
      setAnalytics(!!stored.granted.analytics);
      setMarketing(!!stored.granted.marketing);
    }
  }, []);

  // închide dialogul cu Esc
  useEffect(() => {
    if (!openDialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDialog(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDialog]);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setShowBanner(false);
    setOpenDialog(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setShowBanner(false);
    setOpenDialog(false);
  };

  const savePrefs = () => {
    saveConsent({ necessary: true, analytics, marketing });
    setShowBanner(false);
    setOpenDialog(false);
  };

  // (exemplu) cum poți verifica dacă ai consimțământ pentru analytics
  // console.log("consent analytics?", hasConsent("analytics"));

  return (
    <>
      {showBanner && (
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
            <button
              type="button"
              onClick={() => setOpenDialog(true)}
              style={btnGhost}
              aria-haspopup="dialog"
            >
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
      )}

      {openDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-dialog-title"
          style={dialogOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenDialog(false);
          }}
        >
          <div ref={dialogRef} style={dialogCard}>
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
                <span>Măsurare anonimă trafic și performanță (ex: Google Analytics)</span>
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
      )}
    </>
  );
}

// — stiluri inline minimaliste:
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
