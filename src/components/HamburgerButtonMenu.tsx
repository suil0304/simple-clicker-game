import type { JSX } from "react";
import "../css/HamburgerButtonMenu.css";
import "../css/hyperlink.css";
import { BetweenHr } from "../utils/BetweenHr";
import { useGameContext } from "../core/Game";
import { isLogin } from "../core/providers/User";
import type { ChildMenuProps } from "./Menu";

export function HamburgerButtonMenu(_:ChildMenuProps):JSX.Element {
    const { 

    } = useHamburgerButtonMenu();

    const element = getElement();

    return (
        <>
            {element}
        </>
    );
}

function useHamburgerButtonMenu() {
    const game = useGameContext();

    return {
        game
    };
}

function _notLogInElement():JSX.Element {
    return (
        <>
            <p>
                <a className="no-a-decoration" href="/auth/login">로그인</a> / <a className="no-a-decoration" href="/auth/register">회원가입</a>
            </p>
            <hr />
        </>
    );
}

function getElement():JSX.Element {
    if (!isLogin()) {
        return _notLogInElement();
    }

    return (
        <BetweenHr>
            <p>
                <a className="no-a-decoration" href="/">클리커 게임</a>
            </p>
            <p>
                <a className="no-a-decoration" href="/user">유저 페이지</a>
            </p>
            <p>
                <a className="no-a-decoration" href="/user/stats">통계</a>
            </p>
            <p>
                <a className="no-a-decoration" href="/user/settings">설정</a>
            </p>
        </BetweenHr>
    );
}