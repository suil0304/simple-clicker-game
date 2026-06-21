// upgrade-info-container.d.ts
import type { UpgradeInfo } from "./UpgradeInfo";

export declare interface UpgradeInfoWithGold {
    readonly upgradeInfo:UpgradeInfo;
    readonly curGold:number;
    readonly curStats:number;
}