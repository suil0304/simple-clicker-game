import { useCallback, useEffect, useState, type JSX } from "react";
import defaultUserProfileIcon from "../assets/images/default_user_profile_icon.png";
import "../css/item.css";
import "../css/border.css";
import "../css/button.css";
import "../css/Page.css";
import "../css/UserPage.css";
import "../css/hyperlink.css";
import "../css/blackbg.css";
import statsIcon from "../assets/images/stats_icon.png";
import settingIcon from "../assets/images/settings_icon.png";
import { useGameContext, type UpdateCallback } from "../core/Game";
// import { LogInLikeInput } from "../components/LogInLikeInput";
// import { FORM_USER_PASSWORD, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from "./Register";

const _DEFAULT_BUTTON_CLASSES = "interactive-border-black round-border button-like active-scale-bump-button";

// UserPage 생성 함수.
export function UserPage():JSX.Element {
    const {
        userName,
        userNickname,
        userContext,
        // forceUpdate
    } = useUserPage();

    return (
        <div className="page-thingie" id="user-page">
            <h1 className="page-text-thingie" id="user-page-text">유저</h1>
            <div className="border-box-sizing interactive-border-black round-border" id="user-page-area">
                <img src={defaultUserProfileIcon} alt="user-profile-icon" id="user-page-profile-icon" />
                <div id="user-page-main-container">
                    <h2 id="user-page-nickname">{userNickname}</h2>
                    <p id="user-page-id">@{userName}</p>
                </div>
            </div>
            <div id="user-page-button-container">
                {/* 이전 디자인에서 비밀번호 변경 및 계정 삭제에 대한 버튼은 시간 부족 등으로 구현하지 못 했습니다. */}
                {/* (-> 가장 간단한 로그아웃 구현) */}
                <button
                    type="button"
                    className={`user-page-button ${_DEFAULT_BUTTON_CLASSES}`}
                    id="user-password-logout-button"
                    onClick={userContext.logout}
                >
                    로그아웃
                </button>
                {/* <button
                    type="button"
                    className={`user-page-button ${_DEFAULT_BUTTON_CLASSES}`}
                    id="user-password-delete-button"
                    onClick={}
                >
                    계정 삭제
                </button> */}
            </div>
            <div id="user-page-shortcut-container">
                <ShortcutLine src={statsIcon} href="user/stats" text="통계" />
                <ShortcutLine src={settingIcon} href="user/settings" text="설정" />
            </div>
            {/* 시간이 없어 계정 삭제는 미구현입니다. */}
            {/* <div className={`black-bg black-bg-with-animation `}></div>
            <div id="password-input-popup">
                <form action={}>
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
                </form>
            </div> */}
        </div>
    );
}

export function useUserPage() {
    const game = useGameContext();
    const userContext = game.userContext;

    const [userName, setUserName] = useState("");
    const [userNickname, setUserNickname] = useState("");

    const onUpdate:UpdateCallback = useCallback(() => {
        if(userContext.name) {
            setUserName(userContext.name!);
            setUserNickname(userContext.nickname === null ? userContext.name : userContext.nickname!);
        }
    }, []);

    // 등록 및 cleanup 함수 반환.
    useEffect(() => {
        game.onUpdate = onUpdate;

        return () => {
            game.onUpdate = null;
        };
    }, []);

    return {
        userName,
        userNickname,
        userContext,
        forceUpdate: game.forceUpdate
    };
}

type ShortcutLineProps = {
    href:string,
    src:string,
    text:string
};
// 코드 중복 줄이기를 위한 ShortcutLine 컴포넌트 정의.
// hyper reference를 받아 주소 연결,
// 이미지 주소 받아 등록,
// 텍스트 받아 넣기를 수행합니다.
function ShortcutLine(props:ShortcutLineProps):JSX.Element {
    return (
        <a className="no-a-decoration" href={props.href}>
            <div className={`shortcut-line border-box-sizing ${_DEFAULT_BUTTON_CLASSES}`}>
                <span className="shortcut-line-left">
                    <img src={props.src} alt="shortcut-line-icon" id="shortcut-line-icon" />
                    <p id="shortcut-line-text">{props.text}</p>
                </span>
                <p id="shortcut-line-arrow-text">{"->"}</p>
            </div>
        </a>
    );
}