import type { JSX } from "react";
import { ClickerGame } from "./ClickerGame";
import { GoldProvider } from "./contexts/Gold";

export function App():JSX.Element {
    return (
        <GoldProvider>
            <ClickerGame />
        </GoldProvider>
    );
}