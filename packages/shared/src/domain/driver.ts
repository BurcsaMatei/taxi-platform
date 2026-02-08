import type { DriverOnlineStatus } from "./status";

export interface Driver {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  profilePhotoUrl?: string;

  cityId: string;

  onlineStatus: DriverOnlineStatus;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "ACTIVE" | "SUSPENDED";

  ratingAvg?: number;
  ratingCount?: number;

  createdAt: string; // ISO
}
