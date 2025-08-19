// components/Button.tsx
import React, { ReactNode } from "react";
import Link from "next/link";
import { buttonClass } from "../styles/button.css";

type Variant = "primary" | "secondary";

type Common = {
  children: ReactNode;
  variant?: Variant;
};

type AnchorButtonProps = Common &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string; // dacă există href => randăm link
  };

type RealButtonProps = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined; // fără href => randăm button
  };

// ✅ Supraincarcare pentru typing bun în JSX
export default function Button(props: AnchorButtonProps): JSX.Element;
export default function Button(props: RealButtonProps): JSX.Element;
export default function Button({
  children,
  variant = "primary",
  href,
  ...rest
}: AnchorButtonProps | RealButtonProps) {
  // === LINK (anchor) ===
  if (href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const isExternal =
      typeof href === "string" && /^(https?:)?\/\//i.test(href);

    return (
      <Link
        href={href}
        className={buttonClass[variant]}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
        {...anchorProps}
      >
        {children}
      </Link>
    );
  }

  // === BUTTON ===
  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={buttonClass[variant]} {...buttonProps}>
      {children}
    </button>
  );
}
