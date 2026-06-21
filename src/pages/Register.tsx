import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { LogInLikeInput } from "../components/LogInLikeInput";
import "../css/border.css";
import "../css/button.css";
import "../css/Register.css";
import { useGameContext } from "../core/Game";

// 이 상수들은 LogIn.tsx에서도 사용됩니다.
export const USER_NAME_MIN_LENGTH = 2;
export const USER_NAME_MAX_LENGTH = 10;
export const USER_PASSWORD_MIN_LENGTH = 8;
export const USER_PASSWORD_MAX_LENGTH = 22;
export const FORM_USER_NAME = "user-name";
export const FORM_USER_PASSWORD = "user-password";

// Register 생성 함수.
export function Register():JSX.Element {
    const {
        userNameState,
        userPasswordState,
        userNameGoodRef,
        userPasswordGoodRef,
        disabled,
        handleAction,
        forceUpdate
    } = useRegister();

    return (
        <div
            className="interactive-border-black round-border"
            id="register-box"
        >
            <h1>회원가입</h1>
            <form action={handleAction}>
                <div id="register-input-container">
                    <LogInLikeInput
                        valueState={userNameState}
                        goodValueRef={userNameGoodRef}
                        labelValue="유저 아이디"
                        name={FORM_USER_NAME}
                        inputID="register-user-name-input"
                        type="text"
                        required
                        autoComplete="name"
                        pattern={/[^a-zA-Z0-9]/g}
                        minLength={USER_NAME_MIN_LENGTH}
                        maxLength={USER_NAME_MAX_LENGTH}
                        placeholder={`(영어 소대문자 + 숫자, 최소 ${USER_NAME_MIN_LENGTH}자리, 최대 ${USER_NAME_MAX_LENGTH}자리)`}
                        onChangeGood={forceUpdate}
                    />
                    <LogInLikeInput
                        valueState={userPasswordState}
                        goodValueRef={userPasswordGoodRef}
                        labelValue="유저 비밀번호"
                        name={FORM_USER_PASSWORD}
                        inputID="register-user-password-input"
                        type="password"
                        required
                        autoComplete="current-password"
                        pattern={/[^a-zA-Z0-9!@#$%^&*(){}=~`\[\]\-]/g}
                        minLength={USER_PASSWORD_MIN_LENGTH}
                        maxLength={USER_PASSWORD_MAX_LENGTH}
                        placeholder={`(영어 소대문자 + 숫자 + 특수문자, 최소 ${USER_PASSWORD_MIN_LENGTH}자리, 최대 ${USER_PASSWORD_MAX_LENGTH}자리)`}
                        onChangeGood={forceUpdate}
                    />
                </div>
                <div id="register-button-container">
                    <button
                        type="submit"
                        disabled={disabled}
                        className="interactive-border-black round-border button-like disable-colored-button active-scale-bump-button"
                        id="register-button-submit"
                    >
                        회원가입하기
                    </button>
                </div>
            </form>
        </div>
    );
}

function useRegister() {
    const game = useGameContext();
    const userContext = game.userContext;

    const userNameState = useState("");
    const userPasswordState = useState("");

    const userNameGoodRef = useRef(false);
    const userPasswordGoodRef = useRef(false);

    // 비동기 요청을 보내고 받기 전에 해당 창이 제거되는 경우.
    const isDestroyRef = useRef(false);
    // 이미 요청을 보냈음에도 다시 한 번 보내는 경우 방지.
    const isRegisteringRef = useRef(false);

    const disabled = !userNameGoodRef.current || !userPasswordGoodRef.current;

    useEffect(() => {
        return () => {
            isDestroyRef.current = true;
        };
    }, []);

    const register = useCallback(async (userName:string, userPassword:string) => {
        if(isRegisteringRef.current) {
            return;
        }

        isRegisteringRef.current = true;
        const result = await userContext.register(userName, userPassword);
        if(!result || isDestroyRef.current) {
            isRegisteringRef.current = false;
            return;
        }

        await game.refresh();

        game.dataContext.reset();

        isRegisteringRef.current = false;
    }, [game, userContext]);

    const handleAction = useCallback((data:FormData) => {
        const userNameData = data.get(FORM_USER_NAME);
        const userPasswordData = data.get(FORM_USER_PASSWORD);
        if(userNameData === null || userPasswordData === null) {
            alert("유저 아이디 또는 유저 비밀번호가 비어 있어요!");
            return;
        }

        const userName = userNameData.toString();
        const userPassword = userPasswordData.toString();

        register(userName, userPassword);
    }, [register]);

    return {
        userNameState,
        userPasswordState,
        userNameGoodRef,
        userPasswordGoodRef,
        disabled,
        handleAction,
        forceUpdate: game.forceUpdate
    };
}