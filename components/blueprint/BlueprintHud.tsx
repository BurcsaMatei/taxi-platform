// components/blueprint/BlueprintHud.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import { getAllPosts } from "../../lib/blogData";
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

  // ✅ in-map panel
  onOpenDistrictPanel: (districtId: BlueprintDistrictId) => void;
  onOpenPanelItem: (districtId: BlueprintDistrictId, itemId: string) => void;
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

function blogHrefForSlug(slug: string): string {
  return `/blog/${slug}`;
}

// ==============================
// Component
// ==============================
export default function BlueprintHud(props: BlueprintHudProps): React.JSX.Element {
  const {
    isOpen,
    onToggleOpen,
    districts,
    onResetView,
    onTeleport,
    onOpenDistrictPanel,
    onOpenPanelItem,
  } = props;

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

  // ✅ Blog items din data reală
  const blogItems = React.useMemo<ReadonlyArray<HudItem>>(() => {
    const posts = getAllPosts();
    return posts.map((p) => ({
      id: `blog-${p.slug}`,
      title: p.title,
      description: p.excerpt,
      internalHref: blogHrefForSlug(p.slug),
      externalHref: "",
    }));
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
              const isBlog = d.id === "blog";

              const items: ReadonlyArray<HudItem> = isBlog
                ? blogItems
                : (panel.items as unknown as HudItem[]);

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
                      {/* ✅ “Menu” removed — keep only chevron */}
                      <span className={s.accChevron} aria-hidden="true" />
                    </Button>
                  </div>

                  {/* ✅ Open district panel (in-map) */}
                  <Button
                    type="button"
                    className={s.openPanelLink}
                    onClick={() => onOpenDistrictPanel(d.id)}
                    aria-label={`Deschide panel pentru ${d.label}`}
                  >
                    Open district panel
                  </Button>

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
                                {/* ✅ Click pe card => panel detail (in-map) */}
                                <Button
                                  type="button"
                                  className={s.accItemButton}
                                  onClick={() => onOpenPanelItem(d.id, it.id)}
                                  aria-label={`Deschide detalii pentru ${it.title}`}
                                >
                                  <div className={s.accItemMain}>
                                    <p className={s.accItemTitle}>{it.title}</p>
                                    {it.description ? (
                                      <p className={s.accItemDesc}>{it.description}</p>
                                    ) : null}
                                  </div>
                                </Button>

                                <div className={s.accItemActions}>
                                  {/* ✅ Standard: internal => Button href (SmartLink sub capotă), new tab */}
                                  {hasInternal && d.id === "blog" ? (
                                    <Button
                                      href={it.internalHref!}
                                      className={s.accActionPrimary}
                                      variant="link"
                                      newTab
                                      prefetch={false}
                                      aria-label={`Deschide articolul ${it.title} în tab nou`}
                                    >
                                      Open post
                                    </Button>
                                  ) : null}

                                  {/* ✅ Standard: external => ExternalLink (new tab) */}
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
