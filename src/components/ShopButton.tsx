import type { JSX } from "react";
import { ToggleButton } from "./ToggleButton";
import { MenuType } from "./Menu";
import "../css/ShopButton.css";
import "../css/border.css";
import "../css/button.css";
import shopIcon from "../assets/images/shop_icon.png";
import type { MenuButtonProps } from "../types/MenuButtonProps";

// 상점 토글 버튼 컴포넌트.
export function ShopButton({ buttonIndex, buttonActivateState, menuTypeRef }: MenuButtonProps): JSX.Element {
    // 클릭 시 RefObject<Nullable<MenuType>>에 자기 자신의 MenuType을 설정합니다.
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
            {/* HamburgerButton과는 다르게 아이콘을 가져와 사용합니다. */}
            {/* 출처: https://www.flaticon.com/kr/free-icon/street-shop-_75037?k=1780634332941 */}
            <img id="shop-button-icon" src={shopIcon} alt="shop-button-icon" />
            <div className="shop-button-bar round-border" id="shop-right-close-bar"></div>
        </ToggleButton>
    );
}