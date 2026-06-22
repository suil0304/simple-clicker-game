import type { JSX } from "react";
import "../css/HamburgerButtonMenu.css";
import "../css/hyperlink.css";
import { BetweenHr } from "../utils/BetweenHr";
import { isLogin } from "../core/providers/User";
import type { ChildMenuProps } from "./Menu";

// HamburgerButton으로 열리는 메뉴 정의.
export function HamburgerButtonMenu(_:ChildMenuProps):JSX.Element {
    // 안에 들어가는 요소는 getElement로 생성하도록 책임을 위임했습니다.
    const element = getElement();

    return (
        <>
            {element}
        </>
    );
}

// Guest(미로그인 상태)일 경우 생성하는 요소.
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

    // 로그인 중일 경우 생성하는 요소.
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