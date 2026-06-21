import { useEffect, useRef, useState, type JSX, type RefObject } from "react";
import "../css/item.css";
import "../css/border.css";
import "../css/button.css";
import "../css/Page.css";
import "../css/SettingPage.css";
import { useGameContext, type GameContext } from "../core/Game";
import type { SettingInfo, SettingKey } from "../apis/types/settings";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { API } from "../apis";
import type { SettingContext } from "../core/providers/Setting";

// SettingPage 생성 함수.
export function SettingPage():JSX.Element {
    const {
        game,
        settingItems,
        isDestroyRef,
        settingContext
    } = useSettingPage();

    // 함수형 - 선언적으로 SettingLine 생성.
    const settingLines = settingItems.map((settingItem) => {
        return (
            <SettingLine
                key={`setting-line-${settingItem.settingKey}`}
                game={game}
                settingItem={settingItem}
                isDestroyRef={isDestroyRef}
                settingContext={settingContext}
            />
        );
    });

    return (
        <div className="page-thingie" id="setting-page">
            <h1 className="page-text-thingie" id="setting-page-text">설정</h1>
            <div className="border-box-sizing interactive-border-black round-border" id="setting-page-area">
                {settingLines}
            </div>
        </div>
    );
}

function useSettingPage() {
    const game = useGameContext();
    const settingContext = game.settingContext;

    const [settingItems, setSettingItems] = useState<SettingInfo[]>([]);

    const isDestroyRef = useRef(false);

    useAsyncEffect(async () => {
        const result = await API.SettingsAPI.getSettings();
        setSettingItems(result);
    }, []);

    useEffect(() => {
        return () => {
            isDestroyRef.current = true;
        };
    }, []);

    return {
        game,
        settingItems,
        isDestroyRef,
        settingContext
    };
}

type SettingLineProps = {
    game:GameContext,
    settingItem:SettingInfo,
    isDestroyRef:RefObject<boolean>,
    settingContext:SettingContext
};
function SettingLine({ game, settingItem, isDestroyRef, settingContext }:SettingLineProps):JSX.Element {
    // 현재 dark-mode만 구현되어 있어, boolean 타입만 구현합니다.
    let settingThingie:JSX.Element;
    switch(settingItem.type) {
        case "boolean":
            settingThingie = (
                <button
                    type="button"
                    className="setting-boolean-button interactive-border-black round-border button-like active-scale-bump-button"
                    onClick={handleBooleanButtonClick.bind(null, game, settingItem.settingKey, isDestroyRef, settingContext)}
                >
                    {getBooleanButtonText(settingContext[settingItem.settingKey])}
                </button>
            );
            break;
        default:
            settingThingie = (
                <>

                </>
            );
    }

    return (
        <div className="setting-line interactive-border-black round-border">
            <div className="setting-line-main-container">
                <h2 className="setting-line-name">{settingItem.name}</h2>
                <p className="setting-line-description">{settingItem.description}</p>
            </div>
            {settingThingie}
        </div>
    );
}

function handleBooleanButtonClick(
    game:GameContext,
    settingKey:SettingKey,
    isDestroyRef:RefObject<boolean>,
    settingContext:SettingContext,
) {
    const value = settingContext[settingKey];
    settingContext[settingKey] = !value;

    game.forceUpdate();
    
    const doClick = async () => {
        await API.SettingsAPI.applySetting({
            settingKey: settingKey,
            settingType: "boolean",
            applyValue: !value
        });

        if(isDestroyRef.current) {
            return;
        }
    };

    doClick();
}

function getBooleanButtonText(value:boolean):"끄기" | "켜기" {
    return value ? "끄기" : "켜기";
}