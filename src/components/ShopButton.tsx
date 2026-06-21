import type { JSX } from "react";
import { ToggleButton } from "./ToggleButton";
import { MenuType } from "./Menu";
import "../css/ShopButton.css";
import "../css/border.css";
import "../css/button.css";
import shopIcon from "../assets/images/shop_icon.png";
import type { MenuButtonProps } from "../types/MenuButtonProps";

export function ShopButton({ buttonIndex, buttonActivateState, menuTypeRef }: MenuButtonProps): JSX.Element {
    const handleClick = () => {
        menuTypeRef.current = MenuType.SHOP_MENU;
    };

    return (
        <ToggleButton
            id="shop-button-component"
            buttonIndex={buttonIndex}
            buttonActivateState={buttonActivateState}
            onClick={handleClick}
        >
            <div className="shop-button-bar round-border" id="shop-left-close-bar"></div>
            <img id="shop-button-icon" src={shopIcon} alt="shop-button-icon" />
            <div className="shop-button-bar round-border" id="shop-right-close-bar"></div>
        </ToggleButton>
    );
}