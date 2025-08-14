// components/LogoInline.tsx
'use client';

import Link from "next/link";
// indiferent dacă folosești aliasul sau calea relativă — important e să fie în src/assets
import RawLogo from "@assets/logo.svg"; // mutat în src/assets/logo.svg

type Props = {
  href?: string;
  ariaLabel?: string;
  className?: string;
};

export default function LogoInline({
  href = "/",
  ariaLabel = "KonceptID — Acasă",
  className,
}: Props) {
  // Dacă @svgr/webpack e activ: RawLogo este un React component
  // Dacă NU e activ: RawLogo este un string (URL către asset)
  const isUrlString = typeof RawLogo === "string";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      style={{ lineHeight: 0, display: "inline-flex", alignItems: "center" }}
    >
      {isUrlString ? (
        <img
          src={RawLogo as unknown as string}
          alt="KonceptID — logo"
          style={{ display: "block", height: "100%", width: "auto" }}
        />
      ) : (
       
        <RawLogo style={{ display: "block", height: "100%", width: "auto" }} />
      )}
    </Link>
  );
}
