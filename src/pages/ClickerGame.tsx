import type { JSX } from "react";
import { ClickerArea } from "../components/ClickerArea";

// ClickerGame 생성 함수.
// 이미 그 기능을 ClickerArea와 WithButtonsAndMenu(buttons: [HamburgerButton, ShopButton])에 의해 대체되었기 때문에,
// ClickerArea 요소만을 반환합니다.
export function ClickerGame():JSX.Element {
    return (
        <ClickerArea />
    );
}