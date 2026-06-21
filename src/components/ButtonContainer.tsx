import type React from "react";
import type { JSX } from "react";
import "../css/ButtonContainer.css";

export function ButtonContainer({ children }:{ children?:React.ReactNode }):JSX.Element {
    return (
        <div id="button-container">
            {children}
        </div>
    );
}