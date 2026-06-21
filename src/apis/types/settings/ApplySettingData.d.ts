// apply-setting.dto.ts
import type { SettingKey } from "./SettingKey";
import type { SettingType } from "./SettingType";
import type { SettingValueType } from "./SettingValueType";

export declare interface ApplySettingData {
    readonly settingKey:SettingKey;
    readonly settingType:SettingType;
    readonly applyValue:SettingValueType;
}