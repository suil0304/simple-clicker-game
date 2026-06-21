import type { BuyUpgradeData } from "./BuyUpgradeData";

export declare interface GuestBuyUpgradeData extends BuyUpgradeData {
    readonly gold:number;
    readonly level:number;
}