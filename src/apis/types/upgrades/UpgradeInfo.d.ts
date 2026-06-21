// upgrade-info.d.ts
import { UpgradeKey } from "./UpgradeKey";

export declare interface UpgradeInfo {
    readonly name:string;
    readonly description:string;
    readonly upgradeKey:UpgradeKey;
    readonly level:number;
    readonly curPrice:number;
    readonly curValue:number;
    readonly nextValue:number;
    readonly canBuy:boolean;
    readonly isMaxLevel:boolean;
}