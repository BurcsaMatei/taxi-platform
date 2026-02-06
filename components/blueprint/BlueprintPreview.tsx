// components/blueprint/BlueprintPreview.tsx

// ==============================
// Imports
// ==============================
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
            <p className={s.title}>{title ?? href}</p>
          </div>

          <div className={s.barRight}>
            <Button
              href={href}
              newTab
              prefetch={false}
              variant="link"
              className={s.openNewTab}
              aria-label="Deschide în tab nou"
            >
              Open new tab
            </Button>

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

        {/* same-origin iframe (internal pages/blog) */}
        <iframe className={s.iframe} title={title ?? "Preview"} src={href} loading="eager" />
      </div>
    </div>
  );
}
