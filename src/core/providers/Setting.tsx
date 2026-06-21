import { createContext, useCallback, useContext, useMemo, useState, type JSX, type PropsWithChildren } from "react";
import { isLogin } from "./User";
import { DarkMode } from "../triggers/DarkMode";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { API } from "../../apis";
import type { RefreshableContext } from "../../types";

export interface SettingContext extends RefreshableContext {
    darkMode:boolean;
}
const SettingContext = createContext<SettingContext | null>(null);

export function Setting(props:PropsWithChildren):JSX.Element {
    const {
        darkMode,
        setDarkMode,
        refresh
    } = useSetting();

    const settingContext:SettingContext = useMemo(() => {
        return {
            get darkMode() {
                return darkMode;
            },
            set darkMode(v) {
                setDarkMode(v);
                API.SettingsAPI.applySetting({ settingKey: "darkMode", settingType: "boolean", applyValue: v }).catch(() => {
                    console.error("다크모드 설정에 실패하였습니다.");
                });
            },
            get refresh() {
                return refresh;
            }
        };
    }, [darkMode]);

    return (
        <SettingContext.Provider value={settingContext}>
            {props.children}
            <DarkMode activate={darkMode} />
        </SettingContext.Provider>
    );
}

function useSetting() {
    const [darkMode, setDarkMode] = useState(() => _getDarkMode());

    const refresh = useCallback(async () => {
        if(isLogin()) {
            const result = await API.SettingsAPI.getSetting("darkMode");
            setDarkMode(result.curValue as boolean);
        }
    }, []);

    useAsyncEffect(refresh, []);

    return {
        darkMode,
        setDarkMode,
        refresh
    };
}

export function getSettingContext():SettingContext {
    const settingContext = useContext(SettingContext);
    if(!settingContext) {
        throw new Error("\"SettingContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return settingContext;
}

function _getDarkMode():boolean {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}