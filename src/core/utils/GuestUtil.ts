import { isLogin } from "../providers/User";

export namespace GuestUtil {
    export function setGuestItem(key:string, value:number) {
        if(!isLogin()) {
            window.localStorage.setItem(key, value.toString());
        }
    }
}