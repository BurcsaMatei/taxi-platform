// components/ExternalLink.tsx
import { AnchorHTMLAttributes } from "react";

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function ExternalLink({ href, children, className, ...rest }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}   // ✅ propagăm clasa primită
      {...rest}
    >
      {children}
    </a>
  );
}
