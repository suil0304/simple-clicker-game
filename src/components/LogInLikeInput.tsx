import clsx from "clsx";
import type React from "react";
import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, JSX } from "react";
import "../css/border.css";
import "../css/LogInLikeInput.css";

export type InputChangeEventHandlerWithCleanString = (event:React.ChangeEvent<HTMLInputElement, HTMLInputElement>, cleanValue:string) => void;
interface LogInLikeInputProps {
    valueState:[string, React.Dispatch<React.SetStateAction<string>>];
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
    labelValue?:string;
    // input prop things
    type?:HTMLInputTypeAttribute;
    name?:string;
    required?:boolean;
    autoComplete?:HTMLInputAutoCompleteAttribute;
    placeholder?:string;
    minLength?:number;
    maxLength?:number;
    pattern?:RegExp;
    onChangeGood?:InputChangeEventHandlerWithCleanString;
}
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