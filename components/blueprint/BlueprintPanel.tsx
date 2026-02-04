// components/blueprint/BlueprintPanel.tsx

// ==============================
// Imports
// ==============================
import type { BlueprintDistrictId } from "../../lib/blueprintdata/districts";
import type {
  BlueprintDistrictPanel,
  BlueprintDistrictPanelItem,
} from "../../lib/blueprintdata/panels";
import * as s from "../../styles/blueprint/blueprintPanel.css";
import SmartLink from "../SmartLink";

// ==============================
// Types
// ==============================
export type BlueprintPanelProps = {
  districtId: BlueprintDistrictId;
  panel: BlueprintDistrictPanel;

  // ✅ override (ex: blog posts)
  itemsOverride?: readonly BlueprintDistrictPanelItem[] | null;

  // ✅ detail mode
  activeItemId?: string | null;

  onSelectItem: (itemId: string) => void;
  onBack: () => void;

  onClose: () => void;
};

// ==============================
// Component
// ==============================
export default function BlueprintPanel(props: BlueprintPanelProps): React.JSX.Element {
  const { panel, onClose, onSelectItem, onBack } = props;

  const items: readonly BlueprintDistrictPanelItem[] = props.itemsOverride ?? panel.items;
  const activeItemId = typeof props.activeItemId === "string" ? props.activeItemId : null;

  const activeItem = activeItemId ? (items.find((x) => x.id === activeItemId) ?? null) : null;

  const showList = !activeItem;

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

          {!showList ? (
            <button
              type="button"
              className={s.backBtn}
              onClick={onBack}
              aria-label="Înapoi la listă"
            >
              ← Back
            </button>
          ) : null}
        </div>

        {showList ? (
          <div className={s.list} role="list">
            {items.map((it) => (
              <div key={it.id} className={s.item} role="listitem">
                <button
                  type="button"
                  className={s.itemButton}
                  onClick={() => onSelectItem(it.id)}
                  aria-label={`Deschide detalii pentru ${it.title}`}
                >
                  <div className={s.itemMain}>
                    <p className={s.itemTitle}>{it.title}</p>
                    {it.description ? <p className={s.itemDesc}>{it.description}</p> : null}
                  </div>
                </button>

                <div className={s.itemActions}>
                  {it.externalHref ? (
                    <SmartLink className={s.actionPrimary} href={it.externalHref} newTab>
                      Open site (new tab)
                    </SmartLink>
                  ) : null}

                  {/* ✅ internal link doar în tab nou, ca să rămânem în hartă */}
                  {it.internalHref ? (
                    <SmartLink className={s.actionSecondary} href={it.internalHref} newTab>
                      Open internal (new tab)
                    </SmartLink>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.detail} aria-label="Panel detail">
            <h3 className={s.detailTitle}>{activeItem.title}</h3>
            {activeItem.description ? (
              <p className={s.detailDesc}>{activeItem.description}</p>
            ) : null}

            <div className={s.detailActions}>
              {activeItem.externalHref ? (
                <SmartLink className={s.actionPrimary} href={activeItem.externalHref} newTab>
                  Open site (new tab)
                </SmartLink>
              ) : null}

              {activeItem.internalHref ? (
                <SmartLink className={s.actionSecondary} href={activeItem.internalHref} newTab>
                  Open internal (new tab)
                </SmartLink>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
