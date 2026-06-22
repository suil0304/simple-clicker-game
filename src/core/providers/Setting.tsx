import { createContext, useCallback, useContext, useMemo, useState, type JSX, type PropsWithChildren } from "react";
import { isLogin } from "./User";
import { DarkMode } from "../triggers/DarkMode";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { API } from "../../apis";
import type { RefreshableContext } from "../../types";

// SettingContext는 다음과 같아야 제약하는 interface.
export interface SettingContext extends RefreshableContext {
    darkMode:boolean;
}
const SettingContext = createContext<SettingContext | null>(null);

// SettingContext 제공자.
export function Setting(props:PropsWithChildren):JSX.Element {
    const {
        darkMode,
        setDarkMode,
        refresh
    } = useSetting();

    // SettingContext 제공자에 넣어 제공될 객체.
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

// 커스텀 훅 정의.
function useSetting() {
    const [darkMode, setDarkMode] = useState(() => _getDarkMode());

    // RefreshableContext interface 제약을 지키기 위해 구현하는 refresh 함수.
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

// SettingContext를 가져오는 커스텀 훅.
export function getSettingContext():SettingContext {
    const settingContext = useContext(SettingContext);
    if(!settingContext) {
        throw new Error("\"SettingContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return settingContext;
}

// default값을 matchMedia 함수로 가져옵니다.
// CSS.
function _getDarkMode():boolean {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}