import type { JSX } from "react";
import type React from "react";
import clsx from "clsx";
import { HandlerUtil } from "../utils/HandlerUtil";
import "../css/button.css";

const _DEFAULT_BUTTON_CLASSES = "button-like";

export type ButtonActivateState = [number | null, React.Dispatch<React.SetStateAction<number | null>>];
export interface ButtonProps {
    className?:string;
    id?:string;
    children?:React.ReactNode;
    onClick?:React.MouseEventHandler;
    buttonActivateState:ButtonActivateState;
    buttonIndex:number;
}
/**
 * 활성화 시 "button-activated" 클래스를 버튼에 붙입니다.
 * 버튼 고유의 클래스를 "className"에 붙여 CSS로 작업해주세요.
 */
export function ToggleButton(props:ButtonProps):JSX.Element {
    const { buttonClass, handleClick } = useButton(props.buttonIndex, props.buttonActivateState, props.onClick);
    return (
        <div
            className={clsx(buttonClass, props.className)}
            id={props.id}
            onClick={handleClick}
        >
            {props.children}
        </div>
    );
}

function useButton(buttonIndex:number, buttonActivateState:ButtonActivateState, onClick?:React.MouseEventHandler) {
    const [buttonActivate, setButtonActivate] = buttonActivateState;

    const handleClick = (event:React.MouseEvent) => {
        HandlerUtil.preventDefaultMultipleClick(event);
        setButtonActivate((prev) => {
            if(prev === buttonIndex) {
                return null;
            }
            return buttonIndex;
        });
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