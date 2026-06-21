import type { JSX } from "react";
import "../../css/darkmode.css";

type DarkModeProps = {
    activate: boolean;
};
export function DarkMode({ activate: darkMode }: DarkModeProps): JSX.Element {
    return (
        <span className={darkMode ? "dark-mode" : ""} id="dark-mode-trigger">
        </span>
    );
}