import type { AxiosError } from "axios";
import client from "../client";
import type { JwtContainer, RegisterOrLoginData } from "./types/auth";
import { JWT_KEY } from "../core/providers/User";

const PATH = "auth";
// 서버 엔드 포인트 /auth에 대한 API 정의.
// 당연하게도, 이 엔드 포인트에 대해 유저 인증은 필요하지 않습니다.
export namespace AuthAPI {
    export type SuccessWithMessage = {
        success:boolean,
        message:string
    };

    export async function register(userData:RegisterOrLoginData):Promise<SuccessWithMessage> {
        try {
            const response = await client.post(`/${PATH}/register`, userData);
            const jwtContainer:JwtContainer = response.data;

            window.localStorage.setItem(JWT_KEY, jwtContainer.token);

            return {
                success: true,
                message: "가입에 성공하였습니다."
            };
        }
        catch(e) {
            const error = e as AxiosError;

            switch(error.response?.status) {
                case 409:
                    return {
                        success: false,
                        message: "이미 존재하는 계정입니다."
                    };
                case 500:
                    return {
                        success: false,
                        message: "DB에 무언가 이상이 생겼어요. 다시 시도해 주세요."
                    };
                default:
                    return {
                        success: false,
                        message: "무언가 이상이 생겼어요."
                    }
            }
        }
    }

    export async function login(userData:RegisterOrLoginData):Promise<SuccessWithMessage> {
        try {
            const response = await client.post(`/${PATH}/login`, userData);
            const jwtContainer:JwtContainer = response.data;

            window.localStorage.setItem(JWT_KEY, jwtContainer.token);

            return {
                success: true,
                message: "로그인에 성공하였습니다."
            };
        }
        catch(e) {
            const error = e as AxiosError;

            switch(error.response?.status) {
                case 401:
                    return {
                        success: false,
                        message: "이름 또는 비밀번호가 일치하지 않습니다."
                    };
                case 500:
                    return {
                        success: false,
                        message: "DB에 무언가 이상이 생겼어요. 다시 시도해 주세요."
                    };
                default:
                    return {
                        success: false,
                        message: "무언가 이상이 생겼어요."
                    }
            }
        }
    }
}