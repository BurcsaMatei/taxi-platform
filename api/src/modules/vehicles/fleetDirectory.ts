// api/src/modules/vehicles/fleetDirectory.ts

// ==============================
// Types
// ==============================
export type FleetVehicle = {
  vehicleId: string; // indicativ (ex: "01")
  indicativLabel: string; // ex: "INDICATIV 01"
  plateNumber: string; // ex: "MM01ABC"
  driverName: string; // ex: "IACOB MARIUS"
  carModel: string; // ex: "RENAUL MEGANE" (placeholder)
  carImagePath: string; // path (frontend asset)
  driverImagePath: string; // path (frontend asset)
};

// ==============================
// Constante
// ==============================
const CAR_IMAGE_DEFAULT = "/images/taxi/taxi.png";
const DRIVER_IMAGE_DEFAULT = "/images/drivers/driver-placeholder.png";

const CITY_BAIA_MARE = "baia-mare";
const FLEET_SIZE = 250;

// ==============================
// Utils
// ==============================
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!;
}

// ==============================
// Data (PLACEHOLDER)
// ==============================
// NOTE: AICI vei înlocui ulterior cu date reale (250 intrări).
const DRIVER_FIRST = ["IACOB", "POP", "ION", "VASILE", "MARIUS", "ALEX", "ANDREI", "DAN", "RARES", "BOGDAN"] as const;
const DRIVER_LAST = ["MARIUS", "IONESCU", "POPA", "VASILESCU", "DUMITRU", "MARIN", "STAN", "MATEI", "RADU", "PETRE"] as const;

const CAR_MODELS = [
  "RENAULT MEGANE",
  "DACIA LOGAN",
  "SKODA OCTAVIA",
  "VW GOLF",
  "TOYOTA COROLLA",
  "HYUNDAI I30",
  "FORD FOCUS",
] as const;

function buildBaiaMareFleet(): ReadonlyArray<FleetVehicle> {
  const out: FleetVehicle[] = [];

  for (let i = 1; i <= FLEET_SIZE; i += 1) {
    const id = pad2(i); // 01..99, apoi 100..250 (rămâne "100" etc.)
    const first = pick(DRIVER_FIRST, i);
    const last = pick(DRIVER_LAST, i + 3);
    const car = pick(CAR_MODELS, i + 5);

    out.push({
      vehicleId: id,
      indicativLabel: `INDICATIV ${id}`,
      plateNumber: `MM${id}ABC`,
      driverName: `${first} ${last}`,
      carModel: car,
      carImagePath: CAR_IMAGE_DEFAULT,
      driverImagePath: DRIVER_IMAGE_DEFAULT,
    });
  }

  // Cerința ta explicită pentru INDICATIV 01:
  out[0] = {
    vehicleId: "01",
    indicativLabel: "INDICATIV 01",
    plateNumber: "MM01ABC",
    driverName: "IACOB MARIUS",
    carModel: "RENAUL MEGANE",
    carImagePath: CAR_IMAGE_DEFAULT,
    driverImagePath: DRIVER_IMAGE_DEFAULT,
  };

  return out;
}

const FLEET_BAIA_MARE = buildBaiaMareFleet();

// ==============================
// API
// ==============================
export function getFleetDirectory(cityId: string): ReadonlyArray<FleetVehicle> {
  const c = cityId.trim().toLowerCase();
  if (c === CITY_BAIA_MARE) return FLEET_BAIA_MARE;
  return [];
}

export function getFleetTotal(cityId: string): number {
  const c = cityId.trim().toLowerCase();
  if (c === CITY_BAIA_MARE) return FLEET_SIZE;
  return 0;
}

export function isKnownVehicle(cityId: string, vehicleId: string): boolean {
  const fleet = getFleetDirectory(cityId);
  const id = vehicleId.trim();
  return fleet.some((v) => v.vehicleId === id);
}
