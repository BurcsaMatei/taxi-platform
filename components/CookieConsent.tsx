// components/CookieConsent.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getStoredConsent, saveConsent, hasConsent } from "../lib/cookies"; // <- corect

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const stored = getStoredConsent();
    if (!stored) setShowBanner(true);
  }, []);

  if (!showBanner || hasConsent()) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Acord cookies"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        background: "#111827",
        color: "#fff",
        padding: "14px 16px",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <p style={{ margin: 0, lineHeight: 1.4, flex: "1 1 auto" }}>
        Folosim cookie-uri pentru funcționare și analiză anonimă. Vezi{" "}
        <Link href="/privacy" style={{ color: "#93c5fd", textDecoration: "underline" }}>
          politica de confidențialitate
        </Link>.
      </p>

      <button
        type="button"
        onClick={() => {
          saveConsent("denied");
          setShowBanner(false);
        }}
        style={{
          background: "transparent",
          border: "1px solid #6b7280",
          color: "#e5e7eb",
          padding: "8px 12px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Respinge
      </button>

      <button
        type="button"
        onClick={() => {
          saveConsent("granted");
          setShowBanner(false);
        }}
        style={{
          background: "#10b981",
          border: "none",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Accept
      </button>
    </div>
  );
}
