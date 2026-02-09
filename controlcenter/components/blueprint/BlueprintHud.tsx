// controlcenter/components/blueprint/BlueprintHud.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import type { BlueprintDistrict, BlueprintDistrictId } from "../../lib/blueprintdata/districts";
import { BLUEPRINT_PANELS } from "../../lib/blueprintdata/panels";
import * as s from "../../styles/blueprint/blueprintHud.css";
import Button from "../Button";
import ExternalLink from "../ExternalLink";

// ==============================
// Types
// ==============================
export type BlueprintHudProps = {
  isOpen: boolean;
  onToggleOpen: () => void;

  districts: readonly BlueprintDistrict[];

  onResetView: () => void;
  onTeleport: (districtId: BlueprintDistrictId) => void;
};

type HudItem = {
  id: string;
  title: string;
  description?: string;
  internalHref?: string;
  externalHref?: string;
};

// ==============================
// Utils
// ==============================
function toTitleId(id: BlueprintDistrictId): string {
  return `hud-acc-${id}`;
}

function openHref(href: string, newTab: boolean): void {
  if (typeof window === "undefined") return;

  if (newTab) {
    window.open(href, "_blank", "noopener,noreferrer");
  } else {
    window.location.assign(href);
  }
}

// ==============================
// Component
// ==============================
export default function BlueprintHud(props: BlueprintHudProps): React.JSX.Element {
  const { isOpen, onToggleOpen, districts, onResetView, onTeleport } = props;

  // ✅ Acordeon per district (multi-open)
  const [openSet, setOpenSet] = React.useState<ReadonlySet<BlueprintDistrictId>>(() => new Set());

  const toggle = React.useCallback((id: BlueprintDistrictId) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div
      className={`${s.hud} ${isOpen ? s.hudOpen : ""}`}
      data-no-drag="true"
      data-open={isOpen ? "true" : "false"}
    >
      {/* ✅ Desktop: retract/expand pill (right-mid) */}
      <Button
        type="button"
        className={s.hudSideToggle}
        onClick={onToggleOpen}
        aria-label={isOpen ? "Retrage HUD" : "Extinde HUD"}
        aria-expanded={isOpen}
        data-no-drag="true"
      >
        <span className={s.hudSideToggleIcon} aria-hidden="true" />
      </Button>

      <div className={s.hudInner}>
        <Button
          type="button"
          className={s.hudHandle}
          onClick={onToggleOpen}
          aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={isOpen}
        >
          <span className={s.hudHandlePill} aria-hidden="true" />
          <span className={s.hudHandleArrow} aria-hidden="true" />
        </Button>

        <div className={s.hudContent}>
          <Button type="button" className={s.hudBtn} onClick={onResetView}>
            Reset view
          </Button>

          <div className={s.hudDistricts} aria-label="District menu">
            {districts.map((d) => {
              const accId = toTitleId(d.id);
              const isAccOpen = openSet.has(d.id);

              const panel = BLUEPRINT_PANELS[d.id];
              const items = panel.items as unknown as ReadonlyArray<HudItem>;

              return (
                <div key={d.id} className={s.accWrap}>
                  {/* Header row: Teleport + Accordion toggle */}
                  <div className={s.accHeader}>
                    <Button
                      type="button"
                      className={s.teleportButton}
                      onClick={() => onTeleport(d.id)}
                      aria-label={`Teleport către ${d.label}`}
                    >
                      {d.label}
                    </Button>

                    <Button
                      type="button"
                      className={s.accToggle}
                      onClick={() => toggle(d.id)}
                      aria-expanded={isAccOpen}
                      aria-controls={accId}
                      aria-label={`${isAccOpen ? "Închide" : "Deschide"} submeniu ${d.label}`}
                      title={isAccOpen ? "Închide" : "Deschide"}
                    >
                      <span className={s.accChevron} aria-hidden="true" />
                    </Button>
                  </div>

                  {/* Accordion body */}
                  <div
                    id={accId}
                    className={`${s.accBody} ${isAccOpen ? s.accBodyOpen : ""}`}
                    role="region"
                    aria-label={`${d.label} submenu`}
                  >
                    <div className={s.accBodyInner}>
                      {items.length === 0 ? (
                        <p className={s.accEmpty}>No items yet.</p>
                      ) : (
                        <ul className={s.accList}>
                          {items.map((it) => {
                            const hasExternal =
                              typeof it.externalHref === "string" && it.externalHref.length > 0;
                            const hasInternal =
                              typeof it.internalHref === "string" && it.internalHref.length > 0;

                            return (
                              <li key={it.id} className={s.accItem}>
                                <div className={s.accItemMain}>
                                  <p className={s.accItemTitle}>{it.title}</p>
                                  {it.description ? (
                                    <p className={s.accItemDesc}>{it.description}</p>
                                  ) : null}
                                </div>

                                <div className={s.accItemActions}>
                                  {hasInternal ? (
                                    <Button
                                      type="button"
                                      className={s.accActionPrimary}
                                      variant="link"
                                      onClick={() => openHref(it.internalHref!, false)}
                                      aria-label={`Deschide ${it.title}`}
                                    >
                                      Open
                                    </Button>
                                  ) : null}

                                  {hasExternal ? (
                                    <ExternalLink
                                      className={s.accActionSecondary}
                                      href={it.externalHref!}
                                      newTab
                                      aria-label={`Deschide site-ul pentru ${it.title} în tab nou`}
                                    >
                                      Open site
                                    </ExternalLink>
                                  ) : null}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
