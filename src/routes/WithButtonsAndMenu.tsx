import { useRef, useState, type JSX } from "react";
import { Outlet } from "react-router-dom";
import { Menu, MenuType } from "../components/Menu";
import { ButtonContainer } from "../components/ButtonContainer";
import type { MenuButtonProps } from "../types/MenuButtonProps";
import type { Nullable } from "../types";

// 어떤 것이 메뉴 버튼 생성 함수인지 정의.
type MenuButtonFunction = (props: MenuButtonProps) => JSX.Element;
type WithButtonsAndMenuProps = {
    buttons: MenuButtonFunction[]
};
// 버튼을 받아 Menu와 연결하여 사용할 수 있도록 하는 툴.
export function WithButtonsAndMenu(props: WithButtonsAndMenuProps): JSX.Element {
    const { buttonActivate, state, menuTypeRef } = useWithButtonsAndMenu();

    // 함수형 - 선언적으로 for문 돌리기 + 배열로 묶어 반환.
    const buttonElements: JSX.Element[] = props.buttons.map((ButtonFunc, index) => {
        return (
            // React는 반복문으로 생성한 요소에 대해 key를 요구합니다.
            <ButtonFunc
                key={`menu-button-${index}`}
                buttonIndex={index}
                buttonActivateState={state}
                menuTypeRef={menuTypeRef}
            />
        )
    });

    // Outlet은 자식 Route의 결과를 그대로 가져옵니다.
    return (
        <>
            <Outlet />
            <Menu isActivate={buttonActivate} menuTypeRef={menuTypeRef} />
            <ButtonContainer>
                {buttonElements}
            </ButtonContainer>
        </>
    );
}

function useWithButtonsAndMenu() {
    const state = useState<number | null>(null);
    const [activateIndex, _] = state;

    // MenuType은 Menu.tsx에 정의되어 있습니다.
    // 해당 메뉴가 어떤 메뉴인지 정의합니다.
    // nullable한 것은 메뉴가 닫힐 시 null로 변경되어 자식 메뉴를 비워버리기 때문입니다.
    const menuTypeRef = useRef<Nullable<MenuType>>(MenuType.HAMBURGER_BUTTON_MENU);

    return {
        buttonActivate: activateIndex !== null,
        state,
        menuTypeRef
    };
}