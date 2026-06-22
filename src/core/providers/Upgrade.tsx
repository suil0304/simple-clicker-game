import { createContext, useCallback, useContext, useMemo, useRef, type JSX, type PropsWithChildren } from "react";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { isLogin } from "./User";
import { API } from "../../apis";
import { GuestUtil } from "../utils/GuestUtil";
import type { RefreshableContext } from "../../types/RefreshableContext";

const GUEST_GOLD_PER_CLICK_LEVEL_KEY = "goldPerClickLevel-guest";
const GUEST_GOLD_PER_SECOND_LEVEL_KEY = "goldPerSecondLevel-guest";
const GUEST_CRITICAL_MULT_LEVEL_KEY = "criticalMultLevel-guest";
const GUEST_CRITICAL_RATE_LEVEL_KEY = "criticalRateLevel-guest";

// UpgradeContext는 다음과 같아야 한다 제약하는 interface.
export interface UpgradeContext extends RefreshableContext {
    goldPerClickLevel:number;
    goldPerSecondLevel:number;
    criticalMultLevel:number;
    criticalRateLevel:number;
}
const UpgradeContext = createContext<UpgradeContext | null>(null);

// UpgradeContext 제공자.
export function Upgrade(props:PropsWithChildren):JSX.Element {
    const {
        goldPerClickLevelRef,
        goldPerSecondLevelRef,
        criticalMultLevelRef,
        criticalRateLevelRef,
        refresh
    } = useUpgrade();

    // value에 넣어 제공할 객체.
    const upgradeContext:UpgradeContext = useMemo(() => {
        return {
            get goldPerClickLevel() {
                return goldPerClickLevelRef.current;
            },
            set goldPerClickLevel(v) {
                goldPerClickLevelRef.current = v;
                GuestUtil.setGuestItem(GUEST_GOLD_PER_CLICK_LEVEL_KEY, v);
            },
            get goldPerSecondLevel() {
                return goldPerSecondLevelRef.current;
            },
            set goldPerSecondLevel(v) {
                goldPerSecondLevelRef.current = v;
                GuestUtil.setGuestItem(GUEST_GOLD_PER_SECOND_LEVEL_KEY, v);
            },
            get criticalMultLevel() {
                return criticalMultLevelRef.current;
            },
            set criticalMultLevel(v) {
                criticalMultLevelRef.current = v;
                GuestUtil.setGuestItem(GUEST_CRITICAL_MULT_LEVEL_KEY, v);
            },
            get criticalRateLevel() {
                return criticalRateLevelRef.current;
            },
            set criticalRateLevel(v) {
                criticalRateLevelRef.current = v;
                GuestUtil.setGuestItem(GUEST_CRITICAL_RATE_LEVEL_KEY, v);
            },
            get refresh() {
                return refresh;
            }
        };
    }, []);

    // UpgradeContext 제공자에 upgradeContext 넣기.
    return (
        <UpgradeContext.Provider value={upgradeContext}>
            {props.children}
        </UpgradeContext.Provider>
    );
}

// 커스텀 훅 정의.
function useUpgrade() {
    const goldPerClickLevelRef = useRef(0);
    const goldPerSecondLevelRef = useRef(0);
    const criticalMultLevelRef = useRef(0);
    const criticalRateLevelRef = useRef(0);

    // RefreshableContext interface 제약을 지키기 위해 구현하는 refresh 함수.
    const refresh = useCallback(async () => {
        if(isLogin()) {
            const result = await API.UpgradesAPI.getAll();
            const refArray = [
                goldPerClickLevelRef,
                goldPerSecondLevelRef,
                criticalMultLevelRef,
                criticalRateLevelRef
            ]

            for(let i = 0; i < refArray.length; i++) {
                refArray[i].current = result[i].level;
            }

            return;
        }

        goldPerClickLevelRef.current = _getGuestGoldPerClickLevel();
        goldPerSecondLevelRef.current = _getGuestGoldPerSecondLevel();
        criticalMultLevelRef.current = _getGuestCriticalMultLevel();
        criticalRateLevelRef.current = _getGuestCriticalRateLevel();
    }, []);

    useAsyncEffect(refresh, []);

    return {
        goldPerClickLevelRef,
        goldPerSecondLevelRef, 
        criticalMultLevelRef,
        criticalRateLevelRef,
        refresh
    };
}

// UpgradeContext를 가져오는 커스텀 훅.
export function useUpgradeContext():UpgradeContext {
    const upgradeContext = useContext(UpgradeContext);
    if(!upgradeContext) {
        throw new Error("\"UpgradeContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return upgradeContext;
}

// Guest(미로그인 상태) 전용 localStorage에서 값 가져오기 함수들.
function _getGuestGoldPerClickLevel():number {
    const result = window.localStorage.getItem(GUEST_GOLD_PER_CLICK_LEVEL_KEY);
    return result ? Number(result) : 0;
}

function _getGuestGoldPerSecondLevel():number {
    const result = window.localStorage.getItem(GUEST_GOLD_PER_SECOND_LEVEL_KEY);
    return result ? Number(result) : 0;
}

function _getGuestCriticalMultLevel():number {
    const result = window.localStorage.getItem(GUEST_CRITICAL_MULT_LEVEL_KEY);
    return result ? Number(result) : 0;
}

function _getGuestCriticalRateLevel():number {
    const result = window.localStorage.getItem(GUEST_CRITICAL_RATE_LEVEL_KEY);
    return result ? Number(result) : 0;
}