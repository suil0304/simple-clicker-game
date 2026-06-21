import client from "../client";
import { AuthAPI as _AuthAPI } from "./auth";
import { UsersAPI as _UsersAPI } from "./users";
import { StatsAPI as _StatsAPI } from "./stats";
import { UpgradesAPI as _UpgradesAPI } from "./upgrades";
import { SettingsAPI as _SettingsAPI } from "./settings";

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