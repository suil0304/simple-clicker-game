import client from "../client";
import type { ApplySettingData, SettingInfo, SettingKey } from "./types/settings";

const PATH = "settings";
// 서버 엔드 포인트 /settings에 대한 API 정의.
export namespace SettingsAPI {
    export async function getSettings():Promise<SettingInfo[]> {
        const response = await client.get(`/${PATH}`);
        return response.data;
    }

    export async function getSetting(settingKey:SettingKey):Promise<SettingInfo> {
        const response = await client.get(`/${PATH}/${settingKey}`);
        return response.data;
    }

    export async function applySetting(applySettingData:ApplySettingData):Promise<SettingInfo> {
        const response = await client.post(`/${PATH}`, applySettingData);
        return response.data;
    }
}