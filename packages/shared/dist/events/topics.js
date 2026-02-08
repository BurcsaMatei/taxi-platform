export const topics = {
    city: (cityId) => `city:${cityId}`,
    order: (orderId) => `order:${orderId}`,
    driver: (driverId) => `driver:${driverId}`,
    controlcenter: (cityId) => `controlcenter:${cityId}`,
};
export function isRealtimeTopic(v) {
    if (typeof v !== "string")
        return false;
    return (v.startsWith("city:") ||
        v.startsWith("order:") ||
        v.startsWith("driver:") ||
        v.startsWith("controlcenter:"));
}
