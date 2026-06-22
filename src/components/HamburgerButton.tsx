import type { JSX } from "react";
import { ToggleButton } from "./ToggleButton";
import "../css/HamburgerButton.css";
import "../css/border.css";
import "../css/button.css";
import { MenuType } from "./Menu";
import type { MenuButtonProps } from "../types/MenuButtonProps";

// 햄버거 토글 버튼 정의.
export function HamburgerButton({ buttonIndex, buttonActivateState, menuTypeRef }: MenuButtonProps): JSX.Element {
    // 클릭 시 menuTypeRef의 current 값을 자기 자신의 고유 메뉴로 설정합니다.
    const handleClick = () => {
        menuTypeRef.current = MenuType.HAMBURGER_BUTTON_MENU;
    };

    return (
        <ToggleButton
            id="hamburger-button-component"
            buttonIndex={buttonIndex}
            buttonActivateState={buttonActivateState}
            onClick={handleClick}
        >
            <span className="hamburger-button-bar round-border" id="hamburger-left-close-bar"></span>
            <span className="hamburger-button-bar round-border hide-bar"></span>
            <span className="hamburger-button-bar round-border" id="hamburger-right-close-bar"></span>
        </ToggleButton>
    );
}