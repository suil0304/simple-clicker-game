import client from "../client";
import { AuthAPI as _AuthAPI } from "./auth";
import { UsersAPI as _UsersAPI } from "./users";
import { StatsAPI as _StatsAPI } from "./stats";
import { UpgradesAPI as _UpgradesAPI } from "./upgrades";
import { SettingsAPI as _SettingsAPI } from "./settings";

// 서버와 연결하는 함수를 정의.
// namespace로 구별하였습니다.
// API는 다른 API를 모아서 export import하여 내보냅니다.
// 따라서, API 하나로 다른 모든 API를 가져올 수 있습니다.
export namespace API {
    export async function getHello():Promise<string> {
        const response = await client.get("/");
        return response.data;
    }
    
    export import AuthAPI = _AuthAPI;
    export import UsersAPI = _UsersAPI;
    export import StatsAPI = _StatsAPI;
    export import UpgradesAPI = _UpgradesAPI;
    export import SettingsAPI = _SettingsAPI;
}