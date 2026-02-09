// controlcenter/components/blueprint/BlueprintMap.tsx
// ✅ CONTROL CENTER (foundation cleanup)
// - Eliminăm complet: Panel, MiniMap, Preview.
// - Păstrăm: Map + HUD + camera (drag/zoom/WASD) + hubs + POIs + modal POI.
// - Nu introducem Mapbox acum; doar curățenie și un shell stabil.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BlueprintDistrict, BlueprintDistrictId } from "../../lib/blueprintdata/districts";
import { BLUEPRINT_DISTRICTS } from "../../lib/blueprintdata/districts";
import type { BlueprintPoi } from "../../lib/blueprintdata/pois";
import { BLUEPRINT_POIS } from "../../lib/blueprintdata/pois";
import * as sp from "../../styles/blueprint/blueprintMap.css";
import ExternalLink from "../ExternalLink";
import BlueprintHud from "./BlueprintHud";

// ==============================
// Types
// ==============================
type Point = { x: number; y: number };
type CssVars = Record<`--${string}`, string>;

type KeyState = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  up: boolean;
  left: boolean;
  down: boolean;
  right: boolean;
};

type ActivePoi = BlueprintPoi | null;

type CameraView = {
  zoom: number;
  offset: Point;
};

type StageSize = {
  width: number;
  height: number;
};

// ==============================
// Utils
// ==============================
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function isEditableTarget(t: EventTarget | null): boolean {
  if (!t || !(t instanceof HTMLElement)) return false;
  const tag = t.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return t.isContentEditable;
}

function isNoDragTarget(t: EventTarget | null): boolean {
  if (!t || !(t instanceof Element)) return false;

  if (t.closest('[data-no-drag="true"]')) return true;

  const interactive = t.closest(
    "a,button,input,textarea,select,[role='button'],[role='link'],iframe",
  );
  return Boolean(interactive);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mqx = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(Boolean(mqx.matches));

    update();

    if (typeof mqx.addEventListener === "function") {
      mqx.addEventListener("change", update);
      return () => mqx.removeEventListener("change", update);
    }

    mqx.addListener(update);
    return () => mqx.removeListener(update);
  }, []);

  return reduced;
}

function computeFitView(stage: StageSize, points: readonly Point[]): CameraView {
  if (points.length === 0) {
    return { zoom: 1, offset: { x: stage.width / 2, y: stage.height / 2 } };
  }

  let minX = points[0]!.x;
  let maxX = points[0]!.x;
  let minY = points[0]!.y;
  let maxY = points[0]!.y;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);

  const basePad = 260;
  const dynPad = Math.round(Math.max(worldW, worldH) * 0.18);
  const pad = basePad + dynPad;

  const fitW = worldW + pad * 2;
  const fitH = worldH + pad * 2;

  const z = clamp(Math.min(stage.width / fitW, stage.height / fitH), 0.65, 1.6);

  const worldCx = (minX + maxX) / 2;
  const worldCy = (minY + maxY) / 2;

  const stageCx = stage.width / 2;
  const stageCy = stage.height / 2;

  const offset = {
    x: stageCx - worldCx * z,
    y: stageCy - worldCy * z,
  };

  return { zoom: z, offset };
}

// ==============================
// Component
// ==============================
export default function BlueprintMap() {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activePoi, setActivePoi] = useState<ActivePoi>(null);

  // ✅ HUD drawer (mobile only; desktop ignoră vizual prin CSS)
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);

  const reduceMotion = usePrefersReducedMotion();

  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);

  // Default camera view (used for reset + retract fit)
  const defaultViewRef = useRef<CameraView | null>(null);
  const hasAppliedInitialFitRef = useRef(false);

  // Focus mgmt
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const poiBtnRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const lastPoiIdRef = useRef<string | null>(null);

  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    start: Point;
    startOffset: Point;
  }>({ active: false, pointerId: null, start: { x: 0, y: 0 }, startOffset: { x: 0, y: 0 } });

  const keysRef = useRef<KeyState>({
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    left: false,
    down: false,
    right: false,
  });

  const cameraAnimRef = useRef<{ raf: number; active: boolean } | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const allFitPoints = useMemo<readonly Point[]>(() => {
    const hubs: Point[] = BLUEPRINT_DISTRICTS.map((d) => ({ x: d.x, y: d.y }));
    const pois: Point[] = BLUEPRINT_POIS.map((p) => ({ x: p.x, y: p.y }));
    return [...hubs, ...pois];
  }, []);

  const cancelCameraAnim = useCallback(() => {
    const a = cameraAnimRef.current;
    if (!a || !a.active) return;
    window.cancelAnimationFrame(a.raf);
    a.active = false;
  }, []);

  const animateCamera = useCallback(
    (nextOffset: Point, nextZoom: number, durationMs = 650) => {
      if (reduceMotion || durationMs <= 10) {
        cancelCameraAnim();
        setZoom(nextZoom);
        setOffset(nextOffset);
        return;
      }

      cancelCameraAnim();

      const startZoom = zoomRef.current;
      const startOffset = offsetRef.current;

      const start = performance.now();
      const a = { raf: 0, active: true };
      cameraAnimRef.current = a;

      const tick = (now: number) => {
        const t = clamp((now - start) / durationMs, 0, 1);
        const k = easeInOutCubic(t);

        const z = startZoom + (nextZoom - startZoom) * k;
        const ox = startOffset.x + (nextOffset.x - startOffset.x) * k;
        const oy = startOffset.y + (nextOffset.y - startOffset.y) * k;

        setZoom(z);
        setOffset({ x: ox, y: oy });

        if (t < 1) {
          a.raf = window.requestAnimationFrame(tick);
        } else {
          a.active = false;
        }
      };

      a.raf = window.requestAnimationFrame(tick);
    },
    [cancelCameraAnim, reduceMotion],
  );

  const applyFitAsDefault = useCallback(
    (durationMs: number) => {
      const el = stageRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const next = computeFitView({ width: rect.width, height: rect.height }, allFitPoints);

      defaultViewRef.current = next;
      animateCamera(next.offset, next.zoom, durationMs);
    },
    [allFitPoints, animateCamera],
  );

  const restorePoiFocus = useCallback(() => {
    const id = lastPoiIdRef.current;
    if (!id) return;
    const btn = poiBtnRefs.current.get(id);
    btn?.focus();
  }, []);

  // Focus: on open -> close button
  useEffect(() => {
    if (!activePoi) return;
    const raf = window.requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => window.cancelAnimationFrame(raf);
  }, [activePoi]);

  // Focus: on close -> return to last POI
  useEffect(() => {
    if (activePoi) return;
    const raf = window.requestAnimationFrame(() => restorePoiFocus());
    return () => window.cancelAnimationFrame(raf);
  }, [activePoi, restorePoiFocus]);

  // Initial fit once (client only)
  useEffect(() => {
    if (hasAppliedInitialFitRef.current) return;
    const el = stageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const next = computeFitView({ width: rect.width, height: rect.height }, allFitPoints);
    defaultViewRef.current = next;

    setZoom(next.zoom);
    setOffset(next.offset);

    hasAppliedInitialFitRef.current = true;
  }, [allFitPoints]);

  // When HUD retracts (open -> closed), refit camera to full content
  const prevHudOpenRef = useRef<boolean>(isHudOpen);
  useEffect(() => {
    const prev = prevHudOpenRef.current;
    prevHudOpenRef.current = isHudOpen;

    if (prev && !isHudOpen) {
      const raf = window.requestAnimationFrame(() => {
        cancelCameraAnim();
        applyFitAsDefault(reduceMotion ? 0 : 520);
      });
      return () => window.cancelAnimationFrame(raf);
    }
    return undefined;
  }, [applyFitAsDefault, cancelCameraAnim, isHudOpen, reduceMotion]);

  // ESC closes modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      if (activePoi) {
        setActivePoi(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePoi]);

  // WASD / arrows movement loop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const k = e.key.toLowerCase();
      const keys = keysRef.current;

      if (k === "w") keys.w = true;
      if (k === "a") keys.a = true;
      if (k === "s") keys.s = true;
      if (k === "d") keys.d = true;

      if (e.key === "ArrowUp") keys.up = true;
      if (e.key === "ArrowLeft") keys.left = true;
      if (e.key === "ArrowDown") keys.down = true;
      if (e.key === "ArrowRight") keys.right = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const keys = keysRef.current;

      if (k === "w") keys.w = false;
      if (k === "a") keys.a = false;
      if (k === "s") keys.s = false;
      if (k === "d") keys.d = false;

      if (e.key === "ArrowUp") keys.up = false;
      if (e.key === "ArrowLeft") keys.left = false;
      if (e.key === "ArrowDown") keys.down = false;
      if (e.key === "ArrowRight") keys.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      const keys = keysRef.current;
      const any =
        keys.w || keys.a || keys.s || keys.d || keys.up || keys.left || keys.down || keys.right;

      if (any) {
        cancelCameraAnim();

        const speed = 520; // px/sec (screen space)
        const z = zoomRef.current || 1;
        const step = speed * dt;

        const dx = (keys.a || keys.left ? step : 0) + (keys.d || keys.right ? -step : 0);
        const dy = (keys.w || keys.up ? step : 0) + (keys.s || keys.down ? -step : 0);

        setOffset((prev) => ({ x: prev.x + dx * z, y: prev.y + dy * z }));
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [cancelCameraAnim]);

  // Pointer + wheel listeners
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;

      if (isNoDragTarget(e.target)) return;

      cancelCameraAnim();

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.start = { x: e.clientX, y: e.clientY };
      dragRef.current.startOffset = offsetRef.current;

      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;

      const dx = e.clientX - d.start.x;
      const dy = e.clientY - d.start.y;

      setOffset({ x: d.startOffset.x + dx, y: d.startOffset.y + dy });
    };

    const onPointerUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      if (d.pointerId !== e.pointerId) return;

      d.active = false;
      d.pointerId = null;
      setIsDragging(false);
    };

    const onWheel = (e: WheelEvent) => {
      cancelCameraAnim();

      if (isNoDragTarget(e.target)) return;

      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      const prevZoom = zoomRef.current;
      const nextZoom = clamp(prevZoom * (e.deltaY > 0 ? 0.92 : 1.08), 0.65, 1.6);

      const prevOffset = offsetRef.current;

      const wx = (pointer.x - prevOffset.x) / prevZoom;
      const wy = (pointer.y - prevOffset.y) / prevZoom;

      const nextOffset = {
        x: pointer.x - wx * nextZoom,
        y: pointer.y - wy * nextZoom,
      };

      setZoom(nextZoom);
      setOffset(nextOffset);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel as EventListener);
    };
  }, [cancelCameraAnim]);

  const layerTransform = useMemo(() => {
    return `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`;
  }, [offset.x, offset.y, zoom]);

  const onResetView = () => {
    cancelCameraAnim();
    applyFitAsDefault(reduceMotion ? 0 : 520);
  };

  const openPoi = (poi: BlueprintPoi) => {
    lastPoiIdRef.current = poi.id;
    setActivePoi(poi);
  };
  const closePoi = () => setActivePoi(null);

  const renderPoi = (poi: BlueprintPoi) => {
    const vars: CssVars = {
      "--poi-x": `${poi.x}px`,
      "--poi-y": `${poi.y}px`,
    };

    const kindClass = sp.poiKind[poi.kind];

    return (
      <div key={poi.id} className={`${sp.poi} ${kindClass}`} style={vars}>
        <button
          ref={(node) => {
            poiBtnRefs.current.set(poi.id, node);
          }}
          type="button"
          className={sp.poiHit}
          onClick={() => openPoi(poi)}
          aria-label={`Deschide ${poi.title}`}
        >
          <span className={sp.poiFill} aria-hidden="true" />
          <span className={sp.poiFlag}>
            <span className={sp.poiFlagDot} aria-hidden="true" />
            {poi.shortLabel}
          </span>

          <span className={sp.poiRoof} aria-hidden="true" />
          <span className={sp.poiBody} aria-hidden="true" />

          <span className={sp.poiMeta}>
            <span className={sp.poiTitle}>{poi.title}</span>
            <span className={sp.poiTagline}>{poi.tagline}</span>
          </span>
        </button>
      </div>
    );
  };

  const renderDistrictHub = (d: BlueprintDistrict) => {
    const vars: CssVars = {
      "--hub-x": `${d.x}px`,
      "--hub-y": `${d.y}px`,
    };

    return (
      <div key={`hub-${d.id}`} className={sp.districtHub} style={vars}>
        <button
          type="button"
          className={sp.districtHubLink}
          onClick={() => onTeleport(d.id)}
          aria-label={`Teleport către ${d.label}`}
        >
          <span className={sp.districtHubRoof} aria-hidden="true" />
          <span className={sp.districtHubBody} aria-hidden="true" />

          <span className={sp.districtHubBadge}>
            <span className={sp.districtHubDot} aria-hidden="true" />
            HUB
          </span>

          <span className={sp.districtHubLabel}>
            <span className={sp.districtHubTitle}>{d.label}</span>
            <span className={sp.districtHubHint}>Teleport</span>
          </span>
        </button>
      </div>
    );
  };

  const onTeleport = (districtId: BlueprintDistrictId) => {
    const d = BLUEPRINT_DISTRICTS.find((x) => x.id === districtId);
    if (!d) return;

    const el = stageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const targetZoom = clamp(d.zoom, 0.65, 1.6);
    const targetOffset = {
      x: cx - d.x * targetZoom,
      y: cy - d.y * targetZoom,
    };

    animateCamera(targetOffset, targetZoom, reduceMotion ? 0 : 700);
  };

  const modalTitleId = activePoi ? `poi-title-${activePoi.id}` : undefined;
  const modalDescId = activePoi ? `poi-desc-${activePoi.id}` : undefined;

  return (
    <div className={sp.root}>
      <BlueprintHud
        isOpen={isHudOpen}
        onToggleOpen={() => setIsHudOpen((v) => !v)}
        districts={BLUEPRINT_DISTRICTS}
        onResetView={onResetView}
        onTeleport={onTeleport}
      />

      <div
        ref={stageRef}
        className={`${sp.stage} ${isDragging ? sp.stageGrabbing : ""}`}
        role="region"
        aria-label="Blueprint map"
      >
        <div className={sp.layer} style={{ transform: layerTransform }}>
          {BLUEPRINT_DISTRICTS.map(renderDistrictHub)}
          {BLUEPRINT_POIS.map(renderPoi)}
        </div>

        {activePoi ? (
          <div
            className={sp.modalOverlay}
            data-no-drag="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescId}
          >
            <button
              type="button"
              className={sp.modalBackdrop}
              onClick={closePoi}
              aria-label="Închide"
            />

            <div className={sp.modal}>
              <button
                ref={closeBtnRef}
                type="button"
                className={sp.modalClose}
                onClick={closePoi}
                aria-label="Închide"
              >
                ×
              </button>

              <h2 id={modalTitleId} className={sp.modalTitle}>
                {activePoi.title}
              </h2>
              <p id={modalDescId} className={sp.modalText}>
                {activePoi.tagline}
              </p>

              <div className={sp.modalActions}>
                <ExternalLink className={sp.modalAction} href={activePoi.href} newTab>
                  Deschide site
                </ExternalLink>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
