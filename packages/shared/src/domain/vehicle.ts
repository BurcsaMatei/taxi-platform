import type { VehicleStatus } from "./status";

export interface Vehicle {
  id: string;
  cityId: string;

  indicativ: string; // "001"..."300" etc
  plateNumber: string;

  driverId?: string;

  status: VehicleStatus;
}
