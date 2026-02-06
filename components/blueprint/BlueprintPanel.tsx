// components/blueprint/BlueprintPanel.tsx
// - Panel draggable (md+) cu Pointer Events + clamp în viewport-ul hărții.
// - Poziția este aplicată prin CSS vars (--bp-panel-dx/--bp-panel-dy) setate imperativ pe element (fără style prop în JSX).
// - Persist opțional în localStorage (reaplicat + clamped la mount/resize).
// - Nu schimbăm logica list/detail/preview.

import { useCallback, useEffect, useRef } from "react";

import type { BlueprintDistrictId } from "../../lib/blueprintdata/districts";
import type {
  BlueprintDistrictPanel,
  BlueprintDistrictPanelItem,
} from "../../lib/blueprintdata/panels";
import * as s from "../../styles/blueprint/blueprintPanel.css";
import { mq } from "../../styles/theme.css";
import Button from "../Button";
import ExternalLink from "../ExternalLink";

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

  // ✅ in-map preview (replaces map area)
  onOpenPreview: (href: string, title?: string) => void;
};

type SavedPos = { dx: number; dy: number };

// ==============================
// Constante
// ==============================
const LS_KEY = "bp.panel.pos.v1";
const CLAMP_PAD = 10;

// ==============================
// Helpers
// ==============================
function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function readSavedPos(): SavedPos | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const dx = (parsed as { dx?: unknown }).dx;
    const dy = (parsed as { dy?: unknown }).dy;

    if (!isFiniteNumber(dx) || !isFiniteNumber(dy)) return null;

    // guard: absurd values
    if (Math.abs(dx) > 5000 || Math.abs(dy) > 5000) return null;

    return { dx, dy };
  } catch {
    return null;
  }
}

function writeSavedPos(pos: SavedPos): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(pos));
  } catch {
    // ignore
  }
}

function isMdUpNow(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return Boolean(window.matchMedia(mq.md).matches);
}

// ==============================
// Component
// ==============================
export default function BlueprintPanel(props: BlueprintPanelProps): React.JSX.Element {
  const { panel, onClose, onSelectItem, onBack, onOpenPreview } = props;

  const items: readonly BlueprintDistrictPanelItem[] = props.itemsOverride ?? panel.items;
  const activeItemId = typeof props.activeItemId === "string" ? props.activeItemId : null;

  const activeItem = activeItemId ? (items.find((x) => x.id === activeItemId) ?? null) : null;
  const showList = !activeItem;

  const wrapRef = useRef<HTMLElement | null>(null);

  const dxRef = useRef<number>(0);
  const dyRef = useRef<number>(0);

  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    startDx: number;
    startDy: number;
    stageRect: DOMRect | null;
    startWrapRect: DOMRect | null;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startDx: 0,
    startDy: 0,
    stageRect: null,
    startWrapRect: null,
  });

  const applyVars = useCallback((dx: number, dy: number) => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--bp-panel-dx", `${Math.round(dx)}px`);
    el.style.setProperty("--bp-panel-dy", `${Math.round(dy)}px`);
    dxRef.current = dx;
    dyRef.current = dy;
  }, []);

  const clampDelta = useCallback((deltaX: number, deltaY: number) => {
    const st = dragRef.current.stageRect;
    const wr = dragRef.current.startWrapRect;
    if (!st || !wr) return { deltaX, deltaY };

    const minDeltaX = st.left + CLAMP_PAD - wr.left;
    const maxDeltaX = st.right - CLAMP_PAD - wr.right;

    const minDeltaY = st.top + CLAMP_PAD - wr.top;
    const maxDeltaY = st.bottom - CLAMP_PAD - wr.bottom;

    const cx = Math.max(minDeltaX, Math.min(maxDeltaX, deltaX));
    const cy = Math.max(minDeltaY, Math.min(maxDeltaY, deltaY));

    return { deltaX: cx, deltaY: cy };
  }, []);

  const endDrag = useCallback(() => {
    const d = dragRef.current;
    if (!d.active) return;

    d.active = false;
    d.pointerId = null;

    if (isMdUpNow()) {
      writeSavedPos({ dx: dxRef.current, dy: dyRef.current });
    }
  }, []);

  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!isMdUpNow()) return;

      const el = wrapRef.current;
      if (!el) return;

      e.preventDefault();

      const stageEl = el.parentElement;
      const stageRect = stageEl ? stageEl.getBoundingClientRect() : null;

      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      dragRef.current.startDx = dxRef.current;
      dragRef.current.startDy = dyRef.current;
      dragRef.current.stageRect = stageRect;
      dragRef.current.startWrapRect = el.getBoundingClientRect();

      try {
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const onMove = (ev: PointerEvent) => {
        const d = dragRef.current;
        if (!d.active) return;
        if (d.pointerId !== ev.pointerId) return;

        const rawDeltaX = ev.clientX - d.startX;
        const rawDeltaY = ev.clientY - d.startY;

        const { deltaX, deltaY } = clampDelta(rawDeltaX, rawDeltaY);

        const nextDx = d.startDx + deltaX;
        const nextDy = d.startDy + deltaY;

        applyVars(nextDx, nextDy);
      };

      const onUp = (ev: PointerEvent) => {
        const d = dragRef.current;
        if (!d.active) return;
        if (d.pointerId !== ev.pointerId) return;

        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);

        endDrag();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [applyVars, clampDelta, endDrag],
  );

  // apply saved pos (md+ only) + clamp on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyFromStorage = () => {
      if (!isMdUpNow()) return;

      const el = wrapRef.current;
      if (!el) return;

      // reset vars to measure base rect correctly for clamp
      applyVars(0, 0);

      const saved = readSavedPos();
      if (!saved) return;

      const stageEl = el.parentElement;
      if (!stageEl) return;

      const st = stageEl.getBoundingClientRect();
      const wr = el.getBoundingClientRect();

      // clamp dx/dy by treating them as deltas applied from current base rect
      const minDx = st.left + CLAMP_PAD - wr.left;
      const maxDx = st.right - CLAMP_PAD - wr.right;

      const minDy = st.top + CLAMP_PAD - wr.top;
      const maxDy = st.bottom - CLAMP_PAD - wr.bottom;

      const dx = Math.max(minDx, Math.min(maxDx, saved.dx));
      const dy = Math.max(minDy, Math.min(maxDy, saved.dy));

      applyVars(dx, dy);
    };

    const raf = window.requestAnimationFrame(applyFromStorage);

    window.addEventListener("resize", applyFromStorage);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", applyFromStorage);
    };
  }, [applyVars]);

  return (
    <aside ref={wrapRef} className={s.wrap} data-no-drag="true" aria-label="District panel">
      {/* IMPORTANT: păstrăm s.card ca nod real => CSS-ul de overflow / z-index rămâne valid */}
      <div className={s.card} aria-label="District panel card">
        <Button
          type="button"
          className={s.closeBtn}
          onClick={() => {
            endDrag();
            onClose();
          }}
          aria-label="Închide panel"
          variant="ghost"
          iconOnly
        >
          ×
        </Button>

        {/* ✅ Drag handle (md+ only) */}
        <button
          type="button"
          className={s.dragHandle}
          onPointerDown={onHandlePointerDown}
          aria-label="Mută panel"
        >
          <span className={s.dragHandleInner} aria-hidden="true" />
        </button>

        <div className={s.header}>
          <p className={s.kicker}>District</p>
          <h2 className={s.title}>{panel.title}</h2>
          <p className={s.desc}>{panel.description}</p>

          {!showList ? (
            <Button
              type="button"
              className={s.backBtn}
              onClick={onBack}
              aria-label="Înapoi la listă"
              variant="ghost"
            >
              ← Back
            </Button>
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
                  {/* ✅ extern: ExternalLink (recomandat) */}
                  {it.externalHref ? (
                    <ExternalLink className={s.actionPrimary} href={it.externalHref} newTab>
                      Deschide site
                    </ExternalLink>
                  ) : null}

                  {/* ✅ intern: in-map preview */}
                  {it.internalHref ? (
                    <Button
                      type="button"
                      className={s.actionSecondary}
                      onClick={() => onOpenPreview(it.internalHref!, it.title)}
                      variant="link"
                    >
                      Open preview
                    </Button>
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
                <ExternalLink className={s.actionPrimary} href={activeItem.externalHref} newTab>
                  Deschide site
                </ExternalLink>
              ) : null}

              {activeItem.internalHref ? (
                <Button
                  type="button"
                  className={s.actionSecondary}
                  onClick={() => onOpenPreview(activeItem.internalHref!, activeItem.title)}
                  variant="link"
                >
                  Open preview
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
