import { createContext, useCallback, useContext, useMemo, useRef, type JSX, type PropsWithChildren } from "react";
import { API } from "../../apis";
import type { RegisterOrLoginData } from "../../apis/types/auth";
import type { Nullable } from "../../types";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";

// 상수로 JWT이 담기는 localStorage 키 설정.
export const JWT_KEY = "jwt";

// UserContext는 이래야 한다는 interface 규약.
export interface UserContext {
    readonly name?:string;
    nickname?:Nullable<string>;

    readonly createdAt?:Date;

    readonly login:(name:string, password:string) => Promise<boolean>;
    readonly logout:() => void;
    readonly register:(name:string, password:string) => Promise<boolean>;
    readonly deleteUser:(name:string, password:string) => Promise<void>;
}
const UserContext = createContext<UserContext | null>(null);

// UserContext 제공자.
// UserContext는 유저 이름 및 닉네임 등과 로그인, 로그아웃 등 함수를 보유합니다.
export function User(props:PropsWithChildren):JSX.Element {
    const {
        nameRef,
        nicknameRef,
        createdAtRef,
        setAll
    } = useUser();

    // getter로 Ref를 참조하도록 하여 의존성 배열에 state를 넣지 않아도 되도록 하였습니다.
    // setter로 RefObject<Nullable<string> | undefined>.current를 직접적으로 설정 가능하도록 합니다.
    const userContext:UserContext = useMemo(() => {
        return {
            get name() {
                return nameRef.current
            },
            get nickname() {
                return nicknameRef.current;
            },
            set nickname(v) {
                nicknameRef.current = v;
                // 닉네임은 변경 즉시 update 요청을 보냅니다.
                // Promise.catch로 에러를 잡는 처리만 정의합니다.
                API.UsersAPI.update({ nickname: v }).catch(() => {
                    console.error("닉네임을 업데이트하지 못 했습니다.");
                });
            },
            get createdAt() {
                return createdAtRef.current;
            },
            async login(name, password) {
                return _handleRegisterOrSomething(
                    name, 
                    password,
                    API.AuthAPI.login,
                    () => {
                        setAll();
                        window.location.href = "/";
                    }
                );
            },
            logout() {
                removeJwt();
                window.location.href = "/";
            },
            async register(name, password) {
                return _handleRegisterOrSomething(
                    name, 
                    password,
                    API.AuthAPI.register,
                    () => {
                        setAll();
                        window.location.href = "/";
                    }
                );
            },
            async deleteUser(name, password) {
                await API.UsersAPI.remove({ name, password });
                removeJwt();
                await setAll();
                window.alert("성공적으로 계정을 삭제했습니다. 안녕히 가세요.");
                window.location.href = "/";
            },
        };
    }, []);

    // UserContext 제공자에 userContext 제공.
    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    );
}

function useUser() {
    const nameRef = useRef<string | undefined>(undefined);
    const nicknameRef = useRef<Nullable<string> | undefined>(undefined);
    const createdAtRef = useRef<Date | undefined>(undefined);

    const setAll = useCallback(_setAll.bind(null, nameRef, nicknameRef, createdAtRef), []);
    useAsyncEffect(setAll, [])

    return {
        nameRef,
        nicknameRef,
        createdAtRef,
        setAll
    };
}

export function useUserContext():UserContext {
    const userContext = useContext(UserContext);
    if(!userContext) {
        throw new Error("\"UserContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }
    
    return userContext;
}

export function isLogin():boolean {
    const jwtToken = getJwt();
    return jwtToken !== null && jwtToken !== "";
}

export function getJwt():string | null {
    return window.localStorage.getItem(JWT_KEY);
}

function removeJwt():void {
    window.localStorage.removeItem(JWT_KEY)
}

async function _handleRegisterOrSomething(
    name:string,
    password:string,
    func:(userData:RegisterOrLoginData) => Promise<API.AuthAPI.SuccessWithMessage>,
    onSuccess?:() => void,
    onFailed?:() => void
):Promise<boolean> {
    const successWithMessage = await func({ name, password });
    window.alert(successWithMessage.message);

    if(successWithMessage.success) {
        onSuccess?.();
        return true;
    }
    else {
        onFailed?.();
        return false;
    }
}

async function _setAll(
    nameRef:React.RefObject<string | undefined>,
    nicknameRef:React.RefObject<Nullable<string> | undefined>,
    createdAtRef:React.RefObject<Date | undefined>
):Promise<void> {
    if(isLogin()) {
        const result = await API.UsersAPI.getOne();
        nameRef.current = result.name;
        nicknameRef.current = result.nickname;
        createdAtRef.current = result.createdAt;
        return;
    }

    nameRef.current = undefined;
    nicknameRef.current = undefined;
    createdAtRef.current =undefined;
}