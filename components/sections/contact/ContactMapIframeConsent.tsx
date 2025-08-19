// components/sections/contact/ContactMapIframeConsent.tsx
import { useState } from "react";

type Props = {
  src: string;
  title?: string; // <-- optional, default mai jos
};

export default function ContactMapIframeConsent({ src, title = "Hartă Google – Locația KonceptID" }: Props) {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <div
        role="region"
        aria-label="Previzualizare hartă"
        style={{ background: "#f3f4f6", borderRadius: 12, padding: 16, textAlign: "center" }}
      >
        <p style={{ marginTop: 0, marginBottom: 12 }}>
          Pentru a încărca harta Google, avem nevoie de consimțământul tău.
        </p>
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-controls="contact-map-iframe"
          aria-label="Încarcă harta Google"
          style={{
            background: "#5561F2",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            padding: "10px 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Încarcă harta
        </button>
      </div>
    );
  }

  return (
    <iframe
      id="contact-map-iframe"
      title={title}                 // ✅ titlu explicit (A11y)
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{ border: 0, width: "100%", height: 420, borderRadius: 12 }}
    />
  );
}
