export type RealtimeTopic = `city:${string}` | `order:${string}` | `driver:${string}` | `controlcenter:${string}`;
export declare const topics: {
    readonly city: (cityId: string) => RealtimeTopic;
    readonly order: (orderId: string) => RealtimeTopic;
    readonly driver: (driverId: string) => RealtimeTopic;
    readonly controlcenter: (cityId: string) => RealtimeTopic;
};
export declare function isRealtimeTopic(v: unknown): v is RealtimeTopic;
//# sourceMappingURL=topics.d.ts.map