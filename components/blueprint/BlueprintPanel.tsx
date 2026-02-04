// components/blueprint/BlueprintPanel.tsx

// ==============================
// Imports
// ==============================
import type { BlueprintDistrictId } from "../../lib/blueprintdata/districts";
import type { BlueprintDistrictPanel } from "../../lib/blueprintdata/panels";
import * as s from "../../styles/blueprint/blueprintPanel.css";
import SmartLink from "../SmartLink";

// ==============================
// Types
// ==============================
export type BlueprintPanelProps = {
  districtId: BlueprintDistrictId;
  panel: BlueprintDistrictPanel;

  onClose: () => void;
};

// ==============================
// Component
// ==============================
export default function BlueprintPanel(props: BlueprintPanelProps): React.JSX.Element {
  const { panel, onClose } = props;

  return (
    <aside className={s.wrap} data-no-drag="true" aria-label="District panel">
      <div className={s.card}>
        <button type="button" className={s.closeBtn} onClick={onClose} aria-label="Închide panel">
          ×
        </button>

        <div className={s.header}>
          <p className={s.kicker}>District</p>
          <h2 className={s.title}>{panel.title}</h2>
          <p className={s.desc}>{panel.description}</p>
        </div>

        <div className={s.list} role="list">
          {panel.items.map((it) => (
            <div key={it.id} className={s.item} role="listitem">
              <div className={s.itemMain}>
                <p className={s.itemTitle}>{it.title}</p>
                {it.description ? <p className={s.itemDesc}>{it.description}</p> : null}
              </div>

              <div className={s.itemActions}>
                <SmartLink className={s.actionPrimary} href={it.externalHref} newTab>
                  Open external site
                </SmartLink>

                {it.internalHref ? (
                  <SmartLink className={s.actionSecondary} href={it.internalHref}>
                    Open internal page
                  </SmartLink>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
