// controlcenter/components/ops/map/OpsCornerPanel.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import * as corner from "../../../styles/ops/opsCornerPanel.css";
import type { DriverUiStatus, FleetVehicle } from "./opsMap.types";

// ==============================
// Types
// ==============================
export type OpsCornerPanelProps = {
  cornerCollapsed: boolean;
  onToggleCorner: () => void;

  searchValue: string;
  onChangeSearchValue: (next: string) => void;
  onSubmitSearch: (ev: React.FormEvent) => void;
  searchHint: string;

  selectedVehicle: FleetVehicle | null;
  selectedDriverStatus: DriverUiStatus;
};

// ==============================
// Component
// ==============================
export default function OpsCornerPanel(props: OpsCornerPanelProps): React.JSX.Element {
  const {
    cornerCollapsed,
    onToggleCorner,
    searchValue,
    onChangeSearchValue,
    onSubmitSearch,
    searchHint,
    selectedVehicle,
    selectedDriverStatus,
  } = props;

  return (
    <aside
      className={`${corner.root} ${cornerCollapsed ? corner.isCollapsed : ""}`}
      aria-label="Vehicle search and selection"
      data-collapsed={cornerCollapsed ? "1" : "0"}
    >
      <button
        className={corner.collapseBtn}
        type="button"
        onClick={onToggleCorner}
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
            onChange={(e) => onChangeSearchValue(e.target.value)}
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
  );
}
