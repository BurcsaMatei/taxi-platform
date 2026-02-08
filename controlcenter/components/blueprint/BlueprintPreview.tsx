// components/blueprint/BlueprintPreview.tsx
// - Fix runtime: guard pentru href (nu mai apelăm .includes pe undefined).
// - Iframe src folosește ?bpEmbed=1 ca Layout să ascundă Header/Footer.
// - Importuri corecte (relative din components/blueprint).

import * as React from "react";

import * as s from "../../styles/blueprint/blueprintPreview.css";
import Button from "../Button";

// ==============================
// Types
// ==============================
export type BlueprintPreviewProps = {
  href: string;
  title?: string | null;
  onClose: () => void;
};

// ==============================
// Component
// ==============================
export default function BlueprintPreview(props: BlueprintPreviewProps): React.JSX.Element {
  const { href, title, onClose } = props;

  const safeHref = typeof href === "string" ? href : "";

  const iframeSrc = React.useMemo(() => {
    if (!safeHref) return "about:blank";
    const join = safeHref.includes("?") ? "&" : "?";
    return `${safeHref}${join}bpEmbed=1`;
  }, [safeHref]);

  // ESC closes preview
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={s.wrap} data-no-drag="true" role="region" aria-label="In-map preview">
      <div className={s.card}>
        <div className={s.bar}>
          <div className={s.barLeft}>
            <p className={s.kicker}>Preview</p>
            <p className={s.title}>{title ?? safeHref}</p>
          </div>

          <div className={s.barRight}>
            {safeHref ? (
              <Button
                href={safeHref}
                newTab
                prefetch={false}
                variant="link"
                className={s.openNewTab}
                aria-label="Deschide în tab nou"
              >
                Open new tab
              </Button>
            ) : null}

            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              iconOnly
              className={s.closeBtn}
              aria-label="Închide preview"
            >
              ×
            </Button>
          </div>
        </div>

        <iframe className={s.iframe} title={title ?? "Preview"} src={iframeSrc} loading="eager" />
      </div>
    </div>
  );
}
