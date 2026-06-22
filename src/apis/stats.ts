import client from "../client";
import type { Stats, StatsDefaultData, SyncData } from "./types/stats";

const PATH = "stats";
// 서버 엔드 포인트 /stats에 대한 API 정의.
export namespace StatsAPI {
    export async function getOne():Promise<Stats> {
        const response = await client.get(`/${PATH}`);
        return response.data;
    }

    export async function doSync(syncData:SyncData):Promise<Stats> {
        const response = await client.post(`/${PATH}/sync`, syncData);
        return response.data;
    }

    // 로그인 미필요.
    export async function getDefaultData():Promise<StatsDefaultData> {
        const response = await client.get(`/${PATH}/default`);
        return response.data;
    }
}