import type { JSX } from "react";
import { ToggleButton } from "./ToggleButton";
import "../css/HamburgerButton.css";
import "../css/border.css";
import "../css/button.css";
import { MenuType } from "./Menu";
import type { MenuButtonProps } from "../types/MenuButtonProps";

export function HamburgerButton({ buttonIndex, buttonActivateState, menuTypeRef }: MenuButtonProps): JSX.Element {
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