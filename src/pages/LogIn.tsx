import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { LogInLikeInput } from "../components/LogInLikeInput";
import {
    FORM_USER_NAME,
    FORM_USER_PASSWORD,
    USER_NAME_MAX_LENGTH,
    USER_NAME_MIN_LENGTH,
    USER_PASSWORD_MAX_LENGTH,
    USER_PASSWORD_MIN_LENGTH
} from "./Register";
import "../css/border.css";
import "../css/button.css";
import "../css/LogIn.css";
import { useGameContext } from "../core/Game";

// LogIn 생성 함수.
export function LogIn(): JSX.Element {
    const {
        userNameState,
        userPasswordState,
        userNameGoodRef,
        userPasswordGoodRef,
        disabled,
        handleAction,
        forceUpdate
    } = useLogIn();

    return (
        <div
            className="interactive-border-black round-border"
            id="login-box"
        >
            <h1>로그인</h1>
            <form action={handleAction}>
                <div id="login-input-container">
                    <LogInLikeInput
                        valueState={userNameState}
                        goodValueRef={userNameGoodRef}
                        labelValue="유저 아이디"
                        name={FORM_USER_NAME}
                        inputID="login-user-name-input"
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
                        inputID="login-user-password-input"
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
                <div id="login-button-container">
                    <button
                        type="submit"
                        disabled={disabled}
                        className="interactive-border-black round-border button-like disable-colored-button active-scale-bump-button"
                        id="login-button-submit"
                    >
                        로그인하기
                    </button>
                </div>
            </form>
        </div>
    );
}

// 자세한 내용은 Register.tsx와 비슷하거나 같습니다.
function useLogIn() {
    const game = useGameContext();
    const userContext = game.userContext;

    const userNameState = useState("");
    const userPasswordState = useState("");

    const userNameGoodRef = useRef(false);
    const userPasswordGoodRef = useRef(false);

    const isDestroyRef = useRef(false);
    const isLoginTryRef = useRef(false);
    
    const disabled = !userNameGoodRef.current || !userPasswordGoodRef.current;

    useEffect(() => {
        return () => {
            isDestroyRef.current = true;
        };
    }, []);

    const login = useCallback(async (userName:string, userPassword:string) => {
        if(isLoginTryRef.current) {
            return;
        }

        const result = await userContext.login(userName, userPassword);
        if(!result || isDestroyRef.current) {
            isLoginTryRef.current = false;
            return;
        }

        await game.refresh();

        game.dataContext.reset();

        isLoginTryRef.current = false;
    }, [game, userContext]);

    const handleAction = useCallback((data: FormData) => {
        const userNameData = data.get(FORM_USER_NAME);
        const userPasswordData = data.get(FORM_USER_PASSWORD);
        if (userNameData === null || userPasswordData === null) {
            alert("유저 아이디 또는 유저 비밀번호가 비어 있어요!");
            return;
        }

        const userName = userNameData.toString();
        const userPassword = userPasswordData.toString();

        login(userName, userPassword);
    }, [login]);

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