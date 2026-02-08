import type { VehicleStatus } from "./status";
export interface Vehicle {
    id: string;
    cityId: string;
    indicativ: string;
    plateNumber: string;
    driverId?: string;
    status: VehicleStatus;
}
//# sourceMappingURL=vehicle.d.ts.map