import client from "../client";
import type { UpdateUserData, UserSafeData } from "./types/users";
import type { RegisterOrLoginData } from "./types/auth";

const PATH = "users";
export namespace UsersAPI {
    export async function getOne():Promise<UserSafeData> {
        const response = await client.get(`/${PATH}`);
        return response.data;
    }

    export async function update(userData:UpdateUserData):Promise<UserSafeData> {
        const response = await client.put(`/${PATH}`, userData);
        return response.data;
    }

    export async function remove(userData:RegisterOrLoginData):Promise<UserSafeData> {
        const response = await client.delete(`/${PATH}`, { data: userData });
        return response.data;
    }
}