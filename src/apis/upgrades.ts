import client from "../client";
import type { BuyUpgradeData, GuestUpgradeData, UpgradeInfo, UpgradeInfoWithGold, UpgradeKey } from "./types/upgrades";
import type { GuestBuyUpgradeData } from "./types/upgrades/GuestBuyUpgradeData";

const PATH = "upgrades";
// 서버 엔드 포인트 /upgrades에 대한 API 정의.
export namespace UpgradesAPI {
    export async function getAll():Promise<UpgradeInfo[]> {
        const response = await client.get(`/${PATH}`);
        return response.data;
    }

    export async function getOne(upgradeKey:UpgradeKey):Promise<UpgradeInfo> {
        const response = await client.get(`/${PATH}/${upgradeKey}`);
        return response.data;
    }

    export async function buyUpgrade(upgradeType:BuyUpgradeData):Promise<UpgradeInfoWithGold> {
        const response = await client.post(`/${PATH}`, upgradeType);
        return response.data;
    }

    // 로그인 미필요.
    export async function getGuestInfos(guestUpgradeData:GuestUpgradeData):Promise<UpgradeInfo[]> {
        const response = await client.post(`/${PATH}/guest/infos`, guestUpgradeData);
        return response.data;
    }

    // 로그인 미필요.
    export async function buyGuestUpgrade(guestBuyUpgraedData:GuestBuyUpgradeData):Promise<UpgradeInfoWithGold> {
        const response = await client.post(`/${PATH}/guest`, guestBuyUpgraedData)
        return response.data;
    }
}