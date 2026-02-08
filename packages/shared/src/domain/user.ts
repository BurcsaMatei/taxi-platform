export interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  profilePhotoUrl?: string;

  defaultCityId?: string;

  createdAt: string; // ISO
  status: "ACTIVE" | "BLOCKED";
}
