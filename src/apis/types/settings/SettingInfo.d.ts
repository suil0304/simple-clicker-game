// setting-info.d.ts & setting-data-contents.d.ts
import type { SettingKey } from "./SettingKey";
import type { SettingOption } from "./SettingOption";
import type { SettingType } from "./SettingType";
import type { SettingValueType } from "./SettingValueType";

export declare interface SettingInfo {
    readonly settingKey:SettingKey;

    readonly name:string;
    readonly description:string;

    readonly type:SettingType;

    readonly options:SettingOption | null;

    readonly curValue:SettingValueType;
    readonly minValue:number | null;
    readonly maxValue:number | null;
    readonly step:number | null;
}