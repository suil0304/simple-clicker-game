import React, { useEffect, useRef, useState, type JSX } from "react";
import { Shop } from "./components/Shop";
import "./css/ClickerGame.css";
import "./css/text.css";
import "./css/item.css";
import "./css/border.css";
import { useGoldContext } from "./contexts/Gold";

export function ClickerGame(): JSX.Element {
    const { gold, clickerAreaText, handleMouseDown } = useClickerGame();

    return (
        <>
            <div
                className='clicker-area align-center-child-by-flex interactive-border-black round-border'
                onMouseDown={handleMouseDown}
            >
                <p className='clicker-area-text text-center not-user-select'>{clickerAreaText}</p>
            </div>
            <p className='click-count text-center'>{gold}G</p>
            <Shop />
        </>
    );
}

const _DEFAULT_CLICKER_AREA_TEXT = "여기를 누르세요!";

function useClickerGame() {
    const goldContext = useGoldContext();

    const [clickerAreaText, setClickerAreaText] = useState(_DEFAULT_CLICKER_AREA_TEXT);

    useEffect(() => {
        if(goldContext.goldPerSecond <= 0) {
            return;
        }

        const intervalID = setInterval(() => {
            goldContext.addGold(goldContext.goldPerSecond)
                .commit();
        }, 1000);

        return () => {
            clearInterval(intervalID);
        };
    }, [goldContext]);

    const clickTimerRef = useRef<number | null>(null);

    const handleMouseDown = (event:React.MouseEvent) => {
        _preventDefaultMultClick(event);

        goldContext.addGold(goldContext.goldPerClick)
            .commit();
        setClickerAreaText(`+${goldContext.goldPerClick}G`);

        if(clickTimerRef.current !== null) {
            clearTimeout(clickTimerRef.current);
        }

        clickTimerRef.current = window.setTimeout(() => {
            setClickerAreaText(_DEFAULT_CLICKER_AREA_TEXT);
            clickTimerRef.current = null;
        }, 2000);
    };

    return {
        gold: goldContext.gold,
        clickerAreaText,
        handleMouseDown
    };
}

function _preventDefaultMultClick(event:React.MouseEvent):void {
    if(event.detail > 1) {
        event.preventDefault();
    }
}