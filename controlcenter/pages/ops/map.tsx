// controlcenter/pages/ops/map.tsx

// ==============================
// Imports
// ==============================
import "mapbox-gl/dist/mapbox-gl.css";

import type { OrderStatus, RealtimeEnvelope } from "@taxi/shared";
import { isActiveOrderStatus, topics } from "@taxi/shared";
import { themeClassDark, themeClassLight } from "@taxi/tokens";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { GeoJSONSource, IControl, Map as MapboxMap } from "mapbox-gl";
import * as React from "react";

import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as corner from "../../styles/ops/opsCornerPanel.css";
import * as hud from "../../styles/ops/opsHud.css";
import * as s from "../../styles/ops/opsMap.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";
const FLEET_TOTAL = 250;

// Baia Mare (aprox)
const DEFAULT_CENTER: readonly [number, number] = [23.584, 47.659]; // [lng, lat]
const DEFAULT_ZOOM = 13;

// focus default (safe)
const FOCUS_ZOOM = 15.5;

// considerăm “online” dacă a trimis touch (presence/location) în ultimele 60s
const ONLINE_TTL_MS = 60_000;

// icon local (public/)
const TAXI_ICON_SRC = "/images/taxi/taxi.png";
const TAXI_ICON_ID = "taxi-icon";

const SOURCE_ID = "vehicles-source";
const LAYER_ID = "vehicles-layer";

// Mapbox styles (theme-aware)
const MAP_STYLE_LIGHT = "mapbox://styles/mapbox/streets-v12";
const MAP_STYLE_DARK = "mapbox://styles/mapbox/dark-v11";

// ==============================
// Types
// ==============================
type FleetVehicle = {
  vehicleId: string; // indicativ (ex: "01")
  indicativLabel: string; // ex: "INDICATIV 01"
  plateNumber: string; // ex: "MM01ABC"
  driverName: string; // ex: "IACOB MARIUS"
  carModel: string; // ex: "RENAUL MEGANE"
  carImagePath: string; // path (frontend asset)
  driverImagePath: string; // path (frontend asset)
};

type FleetResponse = {
  ok: true;
  cityId: string;
  total: number;
  vehicles: ReadonlyArray<FleetVehicle>;
};

type CityPublic = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  dispatchPhone?: string;
};

type CityResponseOk = {
  ok: true;
  city: CityPublic;
};

type VehiclePoint = {
  vehicleId: string; // "01".."250" (indicativ)
  lng: number;
  lat: number;
  ts: string; // ISO
};

type VehiclePresence = {
  vehicleId: string;
  online: boolean;
  ts: string; // ISO
};

type OrderAssigned = {
  orderId: string;
  vehicleId: string;
  ts: string; // ISO
};

type OrderStatusSnap = {
  orderId: string;
  status: OrderStatus;
  ts: string; // ISO
};

type DriverUiStatus = "OFFLINE" | "ONLINE" | "BUSY";

type VehicleFeatureProps = {
  vehicleId: string;
  ts: string;
};

type VehicleFeature = Feature<Point, VehicleFeatureProps>;
type VehicleFeatureCollection = FeatureCollection<Point, VehicleFeatureProps>;

// Minimal runtime shape for dynamic import (avoid import() type annotations)
type MapboxModule = {
  default: {
    accessToken: string;

    Map: new (opts: {
      container: HTMLElement;
      style: string;
      center: [number, number];
      zoom: number;
    }) => MapboxMap;

    NavigationControl: new (opts?: { visualizePitch?: boolean }) => IControl;
  };
};

type ThemeMode = "light" | "dark";

type LayerClickEvent = {
  features?: Array<{
    properties?: unknown;
  }>;
};

// ==============================
// Utils
// ==============================
function parseIsoMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Date.now();
}

function fmtIsoLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${dd} ${hh}:${mm}:${ss}`;
}

function fmtAge(nowMs: number, iso: string): string {
  const ts = parseIsoMs(iso);
  const diff = Math.max(0, nowMs - ts);

  const s2 = Math.floor(diff / 1000);
  if (s2 < 60) return `${s2}s`;
  const m = Math.floor(s2 / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function toTelHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const cleaned = trimmed.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  return `tel:${cleaned}`;
}

function normalizeIndicativInput(raw: string): string {
  const s2 = raw.trim();
  if (!s2) return "";
  const digits = s2.replace(/[^\d]/g, "");
  if (!digits) return "";

  // common: "5" -> "05"
  if (digits.length === 1) return `0${digits}`;
  return digits;
}

function getVehiclePoint(e: RealtimeEnvelope): VehiclePoint | null {
  if (e.name !== "vehicle.locationUpdated") return null;

  const p = e.payload.point;

  return {
    vehicleId: e.payload.vehicleId,
    lng: p.lng,
    lat: p.lat,
    ts: e.ts,
  };
}

function getVehiclePresence(e: RealtimeEnvelope): VehiclePresence | null {
  if (e.name !== "vehicle.presenceChanged") return null;

  return {
    vehicleId: e.payload.vehicleId,
    online: e.payload.online,
    ts: e.ts,
  };
}

function getOrderAssigned(e: RealtimeEnvelope): OrderAssigned | null {
  if (e.name !== "order.assigned") return null;

  return {
    orderId: e.payload.orderId,
    vehicleId: e.payload.vehicleId,
    ts: e.ts,
  };
}

function getOrderStatusSnap(e: RealtimeEnvelope): OrderStatusSnap | null {
  if (e.name === "order.created") {
    return { orderId: e.payload.orderId, status: e.payload.status, ts: e.ts };
  }

  if (e.name === "order.statusChanged") {
    return { orderId: e.payload.orderId, status: e.payload.toStatus, ts: e.ts };
  }

  return null;
}

function useNowTick(ms = 1000): number {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);

  return now;
}

function loadMapImage(map: MapboxMap, url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (err, image) => {
      if (err) reject(err);
      else resolve(image);
    });
  });
}

async function fetchFleetDirectory(cityId: string): Promise<FleetResponse> {
  const url = `/api/fleet/${encodeURIComponent(cityId)}`;

  const res = await fetch(url, { method: "GET" });
  const data = (await res.json()) as unknown;

  if (!res.ok) {
    throw new Error("Fleet proxy error");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid fleet response");
  }

  const d = data as Partial<FleetResponse>;
  if (!d.ok || !Array.isArray(d.vehicles)) {
    throw new Error("Fleet endpoint returned error");
  }

  return d as FleetResponse;
}

async function fetchCity(cityId: string): Promise<CityPublic> {
  const url = `/api/cities/${encodeURIComponent(cityId)}`;

  const res = await fetch(url, { method: "GET" });
  const data = (await res.json()) as unknown;

  if (!res.ok) {
    throw new Error("City proxy error");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid city response");
  }

  const d = data as Partial<CityResponseOk>;
  if (!d.ok || !d.city || typeof d.city !== "object") {
    throw new Error("City endpoint returned error");
  }

  return d.city as CityPublic;
}

function readThemeMode(): ThemeMode {
  const root = document.documentElement;
  if (root.classList.contains(themeClassDark)) return "dark";
  if (root.classList.contains(themeClassLight)) return "light";
  // fallback safe
  return "dark";
}

function useThemeMode(): ThemeMode {
  const [mode, setMode] = React.useState<ThemeMode>(() => "dark");

  React.useEffect(() => {
    setMode(readThemeMode());

    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      setMode(readThemeMode());
    });

    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return mode;
}

function styleForTheme(mode: ThemeMode): string {
  return mode === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;
}

// ==============================
// Mapbox (client-only)
// ==============================
function useMapboxMap(
  containerRef: React.RefObject<HTMLDivElement>,
  vehiclesForRender: ReadonlyArray<VehiclePoint>,
  vehiclesForSearch: ReadonlyArray<VehiclePoint>,
  themeMode: ThemeMode,
  onSelectVehicleId: (vehicleId: string) => void,
): {
  ok: boolean;
  error: string | null;
  focusVehicle: (vehicleId: string) => boolean;
  resetView: () => void;
} {
  const [state, setState] = React.useState<{ ok: boolean; error: string | null }>({
    ok: false,
    error: null,
  });

  const mapRef = React.useRef<MapboxMap | null>(null);
  const themeRef = React.useRef<ThemeMode>(themeMode);
  themeRef.current = themeMode;

  const lastStyleRef = React.useRef<string | null>(null);

  // ✅ SEARCH map: last known point (even if old)
  const vehiclesRef = React.useRef<Map<string, VehiclePoint>>(new Map<string, VehiclePoint>());

  const onSelectRef = React.useRef(onSelectVehicleId);
  onSelectRef.current = onSelectVehicleId;

  const layerClickHandlerRef = React.useRef<((ev: LayerClickEvent) => void) | null>(null);

  React.useEffect(() => {
    const m = new Map<string, VehiclePoint>();
    for (const v of vehiclesForSearch) m.set(v.vehicleId, v);
    vehiclesRef.current = m;
  }, [vehiclesForSearch]);

  const ensureLayerStack = React.useCallback(async (map: MapboxMap): Promise<void> => {
    // icon
    if (!map.hasImage(TAXI_ICON_ID)) {
      const img = await loadMapImage(map, TAXI_ICON_SRC);
      if (!map.hasImage(TAXI_ICON_ID)) {
        map.addImage(TAXI_ICON_ID, img as never);
      }
    }

    // source
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
    }

    // layer
    if (!map.getLayer(LAYER_ID)) {
      map.addLayer({
        id: LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        layout: {
          "icon-image": TAXI_ICON_ID,
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,

          "text-field": ["get", "vehicleId"],
          "text-size": 12,
          "text-anchor": "top",
          "text-offset": [0, -1.2],
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-halo-color": "rgba(255,255,255,0.95)",
          "text-halo-width": 2,
        },
      });
    }

    // click handler — must re-bind after every setStyle (style.load)
    if (!layerClickHandlerRef.current) {
      layerClickHandlerRef.current = (ev: LayerClickEvent) => {
        const f = ev.features && ev.features[0];
        if (!f) return;

        const props = f.properties as unknown;
        if (!props || typeof props !== "object") return;

        const v = props as { vehicleId?: unknown };
        if (typeof v.vehicleId !== "string" || v.vehicleId.trim().length === 0) return;

        onSelectRef.current(v.vehicleId);
      };
    }

    try {
      map.off("click", LAYER_ID, layerClickHandlerRef.current as never);
    } catch {
      // ignore
    }
    map.on("click", LAYER_ID, layerClickHandlerRef.current as never);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token.trim().length === 0) {
      setState({
        ok: false,
        error: "Missing NEXT_PUBLIC_MAPBOX_TOKEN in controlcenter/.env.local",
      });
      return;
    }

    let disposed = false;

    (async () => {
      try {
        const raw = (await import("mapbox-gl")) as unknown;
        const m = raw as MapboxModule;
        if (disposed) return;

        m.default.accessToken = token;

        const initialStyle = styleForTheme(themeRef.current);
        lastStyleRef.current = initialStyle;

        const map = new m.default.Map({
          container: el,
          style: initialStyle,
          center: DEFAULT_CENTER as unknown as [number, number],
          zoom: DEFAULT_ZOOM,
        });

        mapRef.current = map;

        const nav = new m.default.NavigationControl({ visualizePitch: true });
        map.addControl(nav, "top-right");

        const onReady = async () => {
          if (disposed) return;

          try {
            await ensureLayerStack(map);
            map.resize();
            setState({ ok: true, error: null });
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Mapbox layer init failed";
            setState({ ok: false, error: msg });
          }
        };

        map.on("load", () => {
          void onReady();
        });

        // After setStyle, Mapbox re-emits this; we must re-ensure source/layer + click handler.
        map.on("style.load", () => {
          void onReady();
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Mapbox init failed";
        setState({ ok: false, error: msg });
      }
    })();

    return () => {
      disposed = true;

      const map = mapRef.current;
      mapRef.current = null;

      try {
        map?.remove();
      } catch {
        // ignore
      }
    };
  }, [containerRef, ensureLayerStack]);

  // Theme -> style switch (minimal, safe)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextStyle = styleForTheme(themeMode);
    if (lastStyleRef.current === nextStyle) return;

    lastStyleRef.current = nextStyle;

    try {
      map.setStyle(nextStyle);
    } catch {
      // ignore
    }
  }, [themeMode]);

  // ✅ render only ONLINE markers (as before)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!src) return;

    const features: VehicleFeature[] = vehiclesForRender.map((v) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [v.lng, v.lat] },
      properties: { vehicleId: v.vehicleId, ts: v.ts },
    }));

    const data: VehicleFeatureCollection = { type: "FeatureCollection", features };
    src.setData(data);
  }, [vehiclesForRender]);

  const focusVehicle = React.useCallback((vehicleId: string): boolean => {
    const map = mapRef.current;
    if (!map) return false;

    const v = vehiclesRef.current.get(vehicleId);
    if (!v) return false;

    try {
      map.flyTo({
        center: [v.lng, v.lat],
        zoom: FOCUS_ZOOM,
        essential: true,
      });
      onSelectRef.current(vehicleId);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetView = React.useCallback((): void => {
    const map = mapRef.current;
    if (!map) return;

    try {
      map.flyTo({
        center: DEFAULT_CENTER as unknown as [number, number],
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    } catch {
      // ignore
    }
  }, []);

  return { ok: state.ok, error: state.error, focusVehicle, resetView };
}

// ==============================
// Component
// ==============================
export default function OpsMapPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const now = useNowTick(1000);
  const themeMode = useThemeMode();

  const [fleet, setFleet] = React.useState<ReadonlyArray<FleetVehicle>>([]);
  const [fleetError, setFleetError] = React.useState<string | null>(null);

  const [city, setCity] = React.useState<CityPublic | null>(null);
  const [cityError, setCityError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetchFleetDirectory(CITY_ID);
        if (!alive) return;

        setFleet(r.vehicles);
        setFleetError(null);
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : "Failed to load fleet directory";
        setFleet([]);
        setFleetError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const c = await fetchCity(CITY_ID);
        if (!alive) return;

        setCity(c);
        setCityError(null);
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : "Failed to load city info";
        setCity(null);
        setCityError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const fleetById = React.useMemo(() => {
    const m = new globalThis.Map<string, FleetVehicle>();
    for (const v of fleet) m.set(v.vehicleId, v);
    return m;
  }, [fleet]);

  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);

  const latestPresenceById = React.useMemo(() => {
    const byId = new globalThis.Map<string, VehiclePresence>();

    for (const e of events) {
      const vp = getVehiclePresence(e);
      if (!vp) continue;

      const prev = byId.get(vp.vehicleId);
      if (!prev || parseIsoMs(vp.ts) >= parseIsoMs(prev.ts)) {
        byId.set(vp.vehicleId, vp);
      }
    }

    return byId;
  }, [events]);

  const latestPointById = React.useMemo(() => {
    const byId = new globalThis.Map<string, VehiclePoint>();

    for (const e of events) {
      const p = getVehiclePoint(e);
      if (!p) continue;

      const prev = byId.get(p.vehicleId);
      if (!prev || parseIsoMs(p.ts) >= parseIsoMs(prev.ts)) {
        byId.set(p.vehicleId, p);
      }
    }

    return byId;
  }, [events]);

  const latestAssignedByOrderId = React.useMemo(() => {
    const byOrder = new globalThis.Map<string, OrderAssigned>();

    for (const e of events) {
      const a = getOrderAssigned(e);
      if (!a) continue;

      const prev = byOrder.get(a.orderId);
      if (!prev || parseIsoMs(a.ts) >= parseIsoMs(prev.ts)) {
        byOrder.set(a.orderId, a);
      }
    }

    return byOrder;
  }, [events]);

  const latestStatusByOrderId = React.useMemo(() => {
    const byOrder = new globalThis.Map<string, OrderStatusSnap>();

    for (const e of events) {
      const snap = getOrderStatusSnap(e);
      if (!snap) continue;

      const prev = byOrder.get(snap.orderId);
      if (!prev || parseIsoMs(snap.ts) >= parseIsoMs(prev.ts)) {
        byOrder.set(snap.orderId, snap);
      }
    }

    return byOrder;
  }, [events]);

  // ✅ online if we have a recent location within TTL
  // ✅ exclude if explicit presence=false is recent enough
  const vehiclesOnline = React.useMemo(() => {
    const out: VehiclePoint[] = [];

    for (const [vehicleId, p] of latestPointById.entries()) {
      const pMs = parseIsoMs(p.ts);
      if (now - pMs > ONLINE_TTL_MS) continue;

      const pres = latestPresenceById.get(vehicleId);
      if (pres) {
        const presMs = parseIsoMs(pres.ts);
        if (pres.online === false && now - presMs <= ONLINE_TTL_MS) continue;
      }

      out.push(p);
    }

    return out;
  }, [latestPointById, latestPresenceById, now]);

  // ✅ search in ALL latest points (online + offline)
  const vehiclesForSearch = React.useMemo(
    () => Array.from(latestPointById.values()),
    [latestPointById],
  );

  const onlineCount = vehiclesOnline.length;
  const offlineCount = Math.max(0, FLEET_TOTAL - onlineCount);

  const selectedVehicle = selectedVehicleId ? (fleetById.get(selectedVehicleId) ?? null) : null;

  const selectedDriverStatus: DriverUiStatus = React.useMemo(() => {
    if (!selectedVehicleId) return "OFFLINE";

    // 1) OFFLINE / ONLINE by last touch
    const p = latestPointById.get(selectedVehicleId);
    const pres = latestPresenceById.get(selectedVehicleId);

    const pMs = p ? parseIsoMs(p.ts) : 0;
    const presMs = pres ? parseIsoMs(pres.ts) : 0;

    const hasRecentPoint = !!p && now - pMs <= ONLINE_TTL_MS;
    const hasRecentOffline = !!pres && pres.online === false && now - presMs <= ONLINE_TTL_MS;

    if (!hasRecentPoint || hasRecentOffline) return "OFFLINE";

    // 2) BUSY if any assigned order for this vehicle is ACTIVE
    for (const a of latestAssignedByOrderId.values()) {
      if (a.vehicleId !== selectedVehicleId) continue;

      const st = latestStatusByOrderId.get(a.orderId);
      const status = st?.status ?? "ASSIGNED";

      if (isActiveOrderStatus(status)) return "BUSY";
    }

    return "ONLINE";
  }, [
    latestAssignedByOrderId,
    latestPointById,
    latestPresenceById,
    latestStatusByOrderId,
    now,
    selectedVehicleId,
  ]);

  const tel = city?.dispatchPhone ? toTelHref(city.dispatchPhone) : "";

  // ==============================
  // Map controls state
  // ==============================
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchHint, setSearchHint] = React.useState<string>("");

  const mapElRef = React.useRef<HTMLDivElement>(null);

  const mapStatus = useMapboxMap(mapElRef, vehiclesOnline, vehiclesForSearch, themeMode, (id) => {
    setSelectedVehicleId(id);
  });

  const computeOnlineStatusForVehicle = React.useCallback(
    (vehicleId: string): { online: boolean; lastSeenIso: string } | null => {
      const p = latestPointById.get(vehicleId);
      if (!p) return null;

      const pres = latestPresenceById.get(vehicleId);

      const pMs = parseIsoMs(p.ts);
      const presMs = pres ? parseIsoMs(pres.ts) : 0;

      const hasRecentPoint = now - pMs <= ONLINE_TTL_MS;
      const hasRecentOffline = !!pres && pres.online === false && now - presMs <= ONLINE_TTL_MS;

      return { online: hasRecentPoint && !hasRecentOffline, lastSeenIso: p.ts };
    },
    [latestPointById, latestPresenceById, now],
  );

  const onSubmitSearch = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();

      const normalized = normalizeIndicativInput(searchValue);
      if (!normalized) {
        setSearchHint("Introduce indicativ (ex: 05).");
        return;
      }

      const candidates = [normalized, normalized.replace(/^0+/, "")].filter(Boolean);

      let focusedId: string | null = null;
      for (const cand of candidates) {
        if (mapStatus.focusVehicle(cand)) {
          focusedId = cand;
          break;
        }
      }

      if (!focusedId) {
        setSearchHint(`Indicativ negăsit: ${normalized} (nu există locație în stream)`);
        return;
      }

      const snap = computeOnlineStatusForVehicle(focusedId);
      if (!snap) {
        setSearchHint(`Indicativ găsit: ${focusedId} — fără lastSeen (unexpected)`);
        return;
      }

      const lastSeen = fmtIsoLocal(snap.lastSeenIso);
      const age = fmtAge(now, snap.lastSeenIso);

      setSearchHint(
        snap.online
          ? `Indicativ ${focusedId}: ONLINE · last seen ${age} ago (${lastSeen})`
          : `Indicativ ${focusedId}: OFFLINE · last seen ${age} ago (${lastSeen})`,
      );
    },
    [computeOnlineStatusForVehicle, mapStatus, now, searchValue],
  );

  const onReset = React.useCallback(() => {
    mapStatus.resetView();
    setSearchHint("");
  }, [mapStatus]);

  // ==============================
  // HUD collapse + Corner collapse
  // ==============================
  const [hudCollapsed, setHudCollapsed] = React.useState<boolean>(false);
  const [cornerCollapsed, setCornerCollapsed] = React.useState<boolean>(false);

  const toggleHud = React.useCallback(() => {
    setHudCollapsed((v) => !v);
  }, []);

  const toggleCorner = React.useCallback(() => {
    setCornerCollapsed((v) => !v);
  }, []);

  return (
    <main className={s.page} data-page="ops-map">
      <div className={s.mapRoot} aria-label="Map canvas">
        <div ref={mapElRef} className={s.mapFill} />

        <div className={s.mapTopRight} aria-label="Map controls">
          <button className={s.mapBtn} type="button" onClick={onReset}>
            Reset map
          </button>
        </div>

        {/* HUD (left) */}
        <aside
          className={`${s.hud} ${hudCollapsed ? s.hudCollapsed : ""}`}
          aria-label="HUD"
          data-collapsed={hudCollapsed ? "1" : "0"}
        >
          {/* Edge toggle button (right middle) */}
          <button
            className={hud.edgeToggle}
            type="button"
            onClick={toggleHud}
            aria-pressed={hudCollapsed ? "true" : "false"}
            aria-label={hudCollapsed ? "Extinde HUD" : "Restrânge HUD"}
          >
            <span className={hud.edgeChevron} aria-hidden="true">
              {hudCollapsed ? "›" : "‹"}
            </span>
          </button>

          <div className={s.hudInner}>
            <header className={hud.header}>
              <div className={hud.headerMain}>
                <div className={hud.brandRow}>
                  <div className={hud.brandTitle}>galant.taxi</div>
                </div>
                <div className={hud.pageTitle}>CONTROL CENTER / MAP</div>
              </div>
            </header>

            <div className={hud.body}>
              <section className={hud.section} aria-label="Critical status">
                <div className={hud.sectionTitle}>Status</div>

                {/* Theme button + Theme value + online/offline pills */}
                <div className={hud.actionsRow} aria-label="Status actions">
                  <div className={hud.themeInline}>
                    <ThemeSwitcher />
                    <span className={hud.themeValue}>{themeMode.toUpperCase()}</span>
                  </div>

                  <div className={hud.actionsPills}>
                    <span className={hud.actionPill}>online {onlineCount}</span>
                    <span className={hud.actionPillMuted}>offline {offlineCount}</span>
                  </div>
                </div>

                <div className={hud.kvGrid}>
                  <div className={hud.kv}>
                    <div className={hud.k}>WS</div>
                    <div className={hud.v}>
                      <span
                        className={`${hud.dot} ${connected ? hud.dotOn : ""}`}
                        aria-hidden="true"
                      />
                      {connected ? "CONNECTED" : "DISCONNECTED"}
                    </div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>City</div>
                    <div className={hud.vMono}>{CITY_ID}</div>
                  </div>

                  {tel ? (
                    <div className={hud.kv}>
                      <div className={hud.k}>Dispatch</div>
                      <a className={hud.vLinkMono} href={tel}>
                        {city?.dispatchPhone}
                      </a>
                    </div>
                  ) : null}

                  {mapStatus.error ? (
                    <div className={hud.kv}>
                      <div className={hud.k}>Map</div>
                      <div className={hud.vErr}>ERROR</div>
                    </div>
                  ) : (
                    <div className={hud.kv}>
                      <div className={hud.k}>Map</div>
                      <div className={hud.vOk}>OK</div>
                    </div>
                  )}
                </div>

                {lastError ? <div className={hud.alert}>WS error: {lastError}</div> : null}
                {fleetError ? <div className={hud.alert}>Fleet error: {fleetError}</div> : null}
                {cityError ? <div className={hud.alert}>City error: {cityError}</div> : null}
              </section>

              <section className={hud.sectionMuted} aria-label="Debug">
                <div className={hud.sectionTitle}>Debug</div>

                <div className={hud.kvGrid}>
                  <div className={hud.kv}>
                    <div className={hud.k}>ready</div>
                    <div className={hud.vMono}>{ready ? "true" : "false"}</div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>topic</div>
                    <div className={hud.vMono}>{topic}</div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>events</div>
                    <div className={hud.vMono}>{events.length}</div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>lastPoints</div>
                    <div className={hud.vMono}>{latestPointById.size}</div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>lastPresence</div>
                    <div className={hud.vMono}>{latestPresenceById.size}</div>
                  </div>

                  <div className={hud.kv}>
                    <div className={hud.k}>fleet</div>
                    <div className={hud.vMono}>{fleet.length || 0}</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </aside>

        {/* Collapsed HUD rail */}
        {hudCollapsed ? <div className={s.hudRail} aria-label="Collapsed HUD rail" /> : null}

        {/* Corner panel (bottom-right) */}
        <aside
          className={`${corner.root} ${cornerCollapsed ? corner.isCollapsed : ""}`}
          aria-label="Vehicle search and selection"
          data-collapsed={cornerCollapsed ? "1" : "0"}
        >
          <button
            className={corner.collapseBtn}
            type="button"
            onClick={toggleCorner}
            aria-pressed={cornerCollapsed ? "true" : "false"}
            aria-label={cornerCollapsed ? "Extinde panoul" : "Restrânge panoul"}
          >
            <span className={corner.chevron} aria-hidden="true">
              {cornerCollapsed ? "▲" : "▼"}
            </span>
          </button>

          <div className={corner.inner}>
            <form
              className={corner.searchForm}
              onSubmit={onSubmitSearch}
              role="search"
              aria-label="Caută indicativ"
            >
              <input
                className={corner.searchInput}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputMode="numeric"
                placeholder="Caută indicativ (ex: 05)"
                aria-label="Indicativ"
              />
              <button className={corner.searchBtn} type="submit">
                Caută
              </button>
            </form>

            {searchHint ? (
              <div className={corner.hint} role="status" aria-live="polite">
                {searchHint}
              </div>
            ) : null}

            {selectedVehicle ? (
              <div className={corner.card}>
                <div className={corner.cardTitle}>Vehicul selectat</div>

                <div className={corner.cardRow}>
                  <span className={corner.cardLabel}>Indicativ</span>
                  <span className={corner.cardValueMono}>{selectedVehicle.vehicleId}</span>
                </div>

                <div className={corner.cardRow}>
                  <span className={corner.cardLabel}>Nr</span>
                  <span className={corner.cardValueMono}>{selectedVehicle.plateNumber}</span>
                </div>

                <div className={corner.cardRow}>
                  <span className={corner.cardLabel}>Șofer</span>
                  <span className={corner.cardValue}>{selectedVehicle.driverName}</span>
                </div>

                <div className={corner.cardRow}>
                  <span className={corner.cardLabel}>Status</span>
                  <span className={corner.cardValueMono}>{selectedDriverStatus}</span>
                </div>

                <div className={corner.cardRow}>
                  <span className={corner.cardLabel}>Mașină</span>
                  <span className={corner.cardValue}>{selectedVehicle.carModel}</span>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
