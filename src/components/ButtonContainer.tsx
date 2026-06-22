import type React from "react";
import type { JSX } from "react";
import "../css/ButtonContainer.css";

// 여러 버튼을 담는 ButtonContainer.
export function ButtonContainer({ children }:{ children?:React.ReactNode }):JSX.Element {
    return (
        <div id="button-container">
            {children}
        </div>
    );
}