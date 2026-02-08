export type RealtimeTopic =
  | `city:${string}`
  | `order:${string}`
  | `driver:${string}`
  | `controlcenter:${string}`;

export const topics = {
  city: (cityId: string): RealtimeTopic => `city:${cityId}`,
  order: (orderId: string): RealtimeTopic => `order:${orderId}`,
  driver: (driverId: string): RealtimeTopic => `driver:${driverId}`,
  controlcenter: (cityId: string): RealtimeTopic => `controlcenter:${cityId}`,
} as const;

export function isRealtimeTopic(v: unknown): v is RealtimeTopic {
  if (typeof v !== "string") return false;
  return (
    v.startsWith("city:") ||
    v.startsWith("order:") ||
    v.startsWith("driver:") ||
    v.startsWith("controlcenter:")
  );
}
