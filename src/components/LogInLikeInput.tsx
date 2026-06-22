import clsx from "clsx";
import type React from "react";
import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, JSX } from "react";
import "../css/border.css";
import "../css/LogInLikeInput.css";

export type InputChangeEventHandlerWithCleanString = (event:React.ChangeEvent<HTMLInputElement, HTMLInputElement>, cleanValue:string) => void;
// 커스텀이 가능해지나 그 만큼 길어졌습니다.
interface LogInLikeInputProps {
    // input value에 적용할 state와 설정 함수.
    valueState:[string, React.Dispatch<React.SetStateAction<string>>];
    // patten 등에 맞는 좋은 입력 값인지를 넣는 RefObject<boolean>
    goodValueRef:React.RefObject<boolean>;
    // login like input group
    className?:string;
    id?:string;
    // login like input
    inputClassName?:string;
    inputID?:string;
    // login like label
    labelClassName?:string;
    labelID?:string;
    // label의 텍스트 value로 넣을 값 지정.
    labelValue?:string;
    // input prop things
    type?:HTMLInputTypeAttribute;
    name?:string;
    required?:boolean;
    autoComplete?:HTMLInputAutoCompleteAttribute;
    placeholder?:string;
    minLength?:number;
    maxLength?:number;
    // 원본 input과 다르게 find로 문제 문자열을 찾기 때문에 정규 표현식을 받습니다.
    pattern?:RegExp;
    // 만약 해당 input 값(change)가 좋은 값이었을 경우(성공적이었을 경우) 호출하는 함수.
    onChangeGood?:InputChangeEventHandlerWithCleanString;
}
// label과 input, 그리고 그것을 담는 div(container)를 묶어 한 컴포넌트로 분리하였습니다.
export function LogInLikeInput(props:LogInLikeInputProps):JSX.Element {
    const { value, handleChange } = useLogInLikeInput(
        props.valueState,
        props.goodValueRef,
        props.minLength,
        props.maxLength,
        props.pattern,
        props.onChangeGood
    );

    return (
        <div
            className={clsx("login-like-input-group", props.className)}
            id={props.id}
        >
            <label
                htmlFor={props.inputID}
                className={clsx("login-like-label", props.labelClassName)}
                id={props.labelID}
            >
                {props.labelValue ?? ""}
            </label>
            <input
                className={clsx("login-like-input interactive-border-black round-border", props.inputClassName)}
                id={props.inputID}
                name={props.name}
                type={props.type}
                value={value}
                required={props.required}
                autoComplete={props.autoComplete}
                onChange={handleChange}
                placeholder={props.placeholder}
            />
        </div>
    );
}

function useLogInLikeInput(
    valueState:[string, React.Dispatch<React.SetStateAction<string>>],
    goodValueRef:React.RefObject<boolean>,
    minLength?:number,
    maxLength?:number,
    pattern?:RegExp,
    onChangeGood?:InputChangeEventHandlerWithCleanString
) {
    const [value, setValue] = valueState;

    const newMinLength = minLength ?? 0;
    const newMaxLength = maxLength ?? 20;
    // 기본적으로는 띄어쓰기가 되어 있는지만 검사합니다.
    // g는 global flag로, 전역 검사를 실시합니다.
    const newPattern = pattern ?? /[\s]/g;
    const handleChange:React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
        const dirty = event.target.value;
        const clean = _getJustCleanString(dirty, newPattern);
        if(clean.length <= newMaxLength) {
            setValue(clean);
            goodValueRef.current = clean.length >= newMinLength;
            onChangeGood?.(event, clean);
        }
    };


    return {
        value,
        handleChange
    };
}

// replace it
function _getJustCleanString(str:string, regExp:RegExp):string {
    return str.replaceAll(regExp, "");
}