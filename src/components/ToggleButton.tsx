import type { JSX } from "react";
import type React from "react";
import clsx from "clsx";
import { HandlerUtil } from "../utils/HandlerUtil";
import "../css/button.css";

// 기본적으로 버튼 역할 수행.
const _DEFAULT_BUTTON_CLASSES = "button-like";

// 버튼 활성화에 대한 State는 다음과 같아야 한다 정의.
export type ButtonActivateState = [number | null, React.Dispatch<React.SetStateAction<number | null>>];
export interface ButtonProps {
    className?:string;
    id?:string;
    children?:React.ReactNode;
    onClick?:React.MouseEventHandler;
    buttonActivateState:ButtonActivateState;
    buttonIndex:number;
}
// 베이스 ToggleButton 컴포넌트.
// 활성화 시 "button-activated" 클래스를 버튼에 붙입니다.
export function ToggleButton(props:ButtonProps):JSX.Element {
    const { buttonClass, handleClick } = useButton(props.buttonIndex, props.buttonActivateState, props.onClick);
    return (
        <div
            // clsx는 null, undefined 등 값이 들어올 경우 제거하면서 문자열로 포맷하는 함수입니다.
            className={clsx(buttonClass, props.className)}
            id={props.id}
            onClick={handleClick}
        >
            {/* 버튼 디자인은 자식에게 맡기기. */}
            {props.children}
        </div>
    );
}

function useButton(buttonIndex:number, buttonActivateState:ButtonActivateState, onClick?:React.MouseEventHandler) {
    const [buttonActivate, setButtonActivate] = buttonActivateState;

    const handleClick = (event:React.MouseEvent) => {
        // 기본적인 브라우저 여러 번 클릭 이벤트 방지.
        HandlerUtil.preventDefaultMultipleClick(event);
        // 이전 값이 자기 자신의 index와 같다면 null로 설정.
        // 그 경우가 아니라면 자기 자신의 index로 설정.
        setButtonActivate((prev) => {
            if(prev === buttonIndex) {
                return null;
            }
            return buttonIndex;
        });
        // onClick은 nullable합니다.
        // ?.를 사용해 onClick ? onClick(event) : null;과 같은 것을 문법 설탕으로 줄여 사용하였습니다.
        onClick?.(event);
    };

    const buttonClass = clsx(_DEFAULT_BUTTON_CLASSES, {
        "button-activated": buttonActivate === buttonIndex
    });

    return {
        buttonClass,
        handleClick
    };
}