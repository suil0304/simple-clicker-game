import type { ClickData } from "./ClickData";

// sync-data.dto.ts
export declare interface SyncData {
    readonly totalClickAddGold:number;
    readonly clickDatas:ClickData[];
    readonly deltaSecondCount:number;
}