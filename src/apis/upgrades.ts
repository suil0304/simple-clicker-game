import client from "../client";
import type { BuyUpgradeData, GuestUpgradeData, UpgradeInfo, UpgradeInfoWithGold, UpgradeKey } from "./types/upgrades";
import type { GuestBuyUpgradeData } from "./types/upgrades/GuestBuyUpgradeData";

const PATH = "upgrades";
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

    export async function getGuestInfos(guestUpgradeData:GuestUpgradeData):Promise<UpgradeInfo[]> {
        const response = await client.post(`/${PATH}/guest/infos`, guestUpgradeData);
        return response.data;
    }

    export async function buyGuestUpgrade(guestBuyUpgraedData:GuestBuyUpgradeData):Promise<UpgradeInfoWithGold> {
        const response = await client.post(`/${PATH}/guest`, guestBuyUpgraedData)
        return response.data;
    }
}