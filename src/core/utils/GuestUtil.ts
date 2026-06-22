import { isLogin } from "../providers/User";

// Guest(미로그인 상태)에 대해 적용 가능한 유틸.
export namespace GuestUtil {
    export function setGuestItem(key:string, value:number) {
        if(!isLogin()) {
            window.localStorage.setItem(key, value.toString());
        }
    }
}