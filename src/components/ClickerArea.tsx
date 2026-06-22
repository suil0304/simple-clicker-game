import React, { useCallback, useEffect, useRef, useState, type JSX } from "react";
import "../css/ClickerArea.css";
import "../css/text.css";
import "../css/item.css";
import "../css/border.css";
import "../css/button.css";
import { HandlerUtil } from "../utils/HandlerUtil";
import { useGameContext } from "../core/Game";
import type { StatsContext } from "../core/providers/Stats";
import clsx from "clsx";

const _DEFAULT_CLICKER_AREA_CLASSES = "align-center-child-by-flex interactive-border-black round-border button-like";

// 클릭 영역과 골드를 담는 함수.
export function ClickerArea():JSX.Element {
    const { gold, clickerAreaText, clickerAreaClass, handleMouseDown } = useClickerArea();

    return (
        <>
            <div
                className={clickerAreaClass}
                id="clicker-area"
                onMouseDown={handleMouseDown}
            >
                <p className='text-center not-user-select' id="clicker-area-text">{clickerAreaText}</p>
            </div>
            <p className='text-center' id="click-count">{Math.round(gold)}G</p>
        </>
    );
}

const _DEFAULT_CLICKER_AREA_TEXT = "여기를 누르세요!";

function useClickerArea() {
    const game = useGameContext();
    const statsContext = game.statsContext;
    const dataContext = game.dataContext;

    // RefObject는 값을 변경해도 React가 알아채지 못 하기 때문에 ClickerArea에서는 State를 함께 사용합니다.
    const [gold, setGold] = useState(statsContext.gold);

    const [clickerAreaText, setClickerAreaText] = useState(_DEFAULT_CLICKER_AREA_TEXT);
    const [_clickerAreaActive, _setClickerAreaActive] = useState<boolean>(false);

    const clickTimerRef = useRef<number | null>(null);

    // 크리티컬 등은 기본적으로 클라이언트가 계산 후 서버가 검증하여 적용합니다.
    const handleMouseDown = useCallback((event:React.MouseEvent) => {
        HandlerUtil.preventDefaultMultipleClick(event);

        const isCritical = _isCritical(statsContext);

        let add = statsContext.goldPerClick;
        if(isCritical) {
            add *= statsContext.criticalMult;
        }

        console.log(add);

        let text = `+${Math.round(add)}G`;
        if(isCritical) {
            text += "(Critical!)";
        }

        dataContext.totalClickAddGold += Math.floor(add);
        // 요인 등.
        dataContext.clickDatas.push({
            isCritical: isCritical
        });

        // 변경 값을 설정하여 화면 업데이트를 수행합니다.
        setGold((prev) => prev + add);
        statsContext.gold += add;
        setClickerAreaText(text);

        if(clickTimerRef.current !== null) {
            clearTimeout(clickTimerRef.current);
        }

        clickTimerRef.current = window.setTimeout(() => {
            setClickerAreaText(_DEFAULT_CLICKER_AREA_TEXT);
            clickTimerRef.current = null;
        }, 2000);
    }, [statsContext, dataContext]);


    // 초 당 골드를 해금했을 때, 클라이언트 애니메이션 설정.
    const onUpdate = useCallback((_:number) => {
        setGold(statsContext.gold);

        if(statsContext.goldPerSecond <= 0) {
            return;
        }

        if(clickTimerRef.current === null) {
            _setClickerAreaActive(true);
            setClickerAreaText(`+${statsContext.goldPerSecond}G(Auto)`);

            setTimeout(() => {
                _setClickerAreaActive(false);
            }, 350);
        }
    }, [statsContext]);

    // useEffect로 안전하게 onUpdate를 설정 및 cleanup으로 초기화합니다.
    useEffect(() => {
        game.onUpdate = onUpdate;

        return () => {
            game.onUpdate = null;
        };
    }, [game]);

    // clsx로 is-activate를 조건에 따라 넣기.
    const clickerAreaClass = clsx(_DEFAULT_CLICKER_AREA_CLASSES, {
        "is-active": _clickerAreaActive
    });

    return {
        gold: gold,
        clickerAreaText,
        clickerAreaClass,
        handleMouseDown
    };
}

function _isCritical(statsContext:StatsContext):boolean {
    const rand = Math.random() * 100;
    return rand >= (100 - statsContext.criticalRate);
}