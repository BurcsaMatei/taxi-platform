// components/Footer.tsx
'use client';

import Link from "next/link";
import {
  footerClass,
  footerLogoBoxClass,
  footerDividerClass,
  footerCopyClass,
} from "../styles/footer.css";
import { useCookieConsent } from "@/components/cookies/CookieProvider";

// ✅ logo din src/assets (SVGR)
import LogoMark from "@assets/logo.svg";

export default function Footer() {
  const { openSettings } = useCookieConsent();

  return (
    <footer className={footerClass}>
      {/* Logo centrat deasupra liniei */}
      <div className={footerLogoBoxClass}>
        <Link
          href="/"
          aria-label="KonceptID — Acasă"
          style={{ lineHeight: 0, display: "inline-flex", alignItems: "center" }}
        >
          {/* SVG inline — setăm înălțimea la ~40px ca în varianta veche */}
          <LogoMark style={{ display: "block", height: 40, width: "auto" }} />
        </Link>
      </div>

      {/* Separator sub logo */}
      <hr className={footerDividerClass} />

      {/* Text copyright */}
      <span className={footerCopyClass}>
        © {new Date().getFullYear()} KonceptID Base – All rights reserved.
      </span>

      {/* Link-uri */}
      <div style={{ marginTop: 8, fontSize: 14, textAlign: "center" }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openSettings(); // deschide dialogul de cookies instant
          }}
        >
          Setări cookie
        </a>{" "}
        · <a href="/cookie-policy">Politica Cookie</a>
      </div>
    </footer>
  );
}
