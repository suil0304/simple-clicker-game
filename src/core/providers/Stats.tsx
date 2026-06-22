import { createContext, useCallback, useContext, useMemo, useRef, type JSX, type PropsWithChildren } from "react";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { isLogin } from "./User";
import { API } from "../../apis";
import { GuestUtil } from "../utils/GuestUtil";
import type { RefreshableContext } from "../../types/RefreshableContext";

const GUEST_GOLD_KEY = "gold-guest";
const GUEST_GOLD_PER_CLICK_KEY = "goldPerClick-guest";
const GUEST_GOLD_PER_SECOND_KEY = "goldPerSecond-guest";
const GUEST_CRITICAL_MULT_KEY = "criticalMult-guest";
const GUEST_CRITICAL_RATE_KEY = "criticalRate-guest";

// StatsContext는 다음과 같아야 한다 제약하는 interface.
export interface StatsContext extends RefreshableContext {
    gold:number;
    goldPerClick:number;
    goldPerSecond:number;
    criticalMult:number;
    criticalRate:number;
    clickCount?:number;
}
const StatsContext = createContext<StatsContext | null>(null);

// StatsContext 제공자.
export function Stats(props:PropsWithChildren):JSX.Element {
    const {
        goldRef,
        goldPerClickRef,
        goldPerSecondRef,
        criticalMultRef,
        criticalRateRef,
        clickCountRef,
        refresh
    } = useStats();

    // StatsContext 제공자에 넣어 제공될 객체.
    const statsContext:StatsContext = useMemo(() => {
        return {
            get gold() {
                return goldRef.current;
            },
            set gold(v) {
                goldRef.current = v;
                GuestUtil.setGuestItem(GUEST_GOLD_KEY, v);
            },
            get goldPerClick() {
                return goldPerClickRef.current;
            },
            set goldPerClick(v) {
                goldPerClickRef.current = v;
                GuestUtil.setGuestItem(GUEST_GOLD_PER_CLICK_KEY, v);
            },
            get goldPerSecond() {
                return goldPerSecondRef.current;
            },
            set goldPerSecond(v) {
                goldPerSecondRef.current = v;
                GuestUtil.setGuestItem(GUEST_GOLD_PER_SECOND_KEY, v);
            },
            get criticalMult() {
                return criticalMultRef.current;
            },
            set criticalMult(v) {
                criticalMultRef.current = v;
                GuestUtil.setGuestItem(GUEST_CRITICAL_MULT_KEY, v);
            },
            get criticalRate() {
                return criticalRateRef.current;
            },
            set criticalRate(v) {
                criticalRateRef.current = v;
                GuestUtil.setGuestItem(GUEST_CRITICAL_RATE_KEY, v);
            },
            get clickCount() {
                return clickCountRef.current;
            },
            set clickCount(v) {
                clickCountRef.current = v;
            },
            get refresh() {
                return refresh;
            }
        };
    }, []);

    // StatsContext 제공자에 statsContext 넣기.
    return (
        <StatsContext.Provider value={statsContext}>
            {props.children}
        </StatsContext.Provider>
    );
}

// 커스텀 훅.
function useStats() {
    const goldRef = useRef<number>(0);
    const goldPerClickRef = useRef<number>(0);
    const goldPerSecondRef = useRef<number>(0);
    const criticalMultRef = useRef<number>(0);
    const criticalRateRef = useRef<number>(0);

    const clickCountRef = useRef<number | undefined>(undefined);

    // RefreshableContext interface 제약을 지키기 위해 구현하는 refresh 함수.
    const refresh = useCallback(async () => {
        if(isLogin()) {
            const result = await API.StatsAPI.getOne();

            goldRef.current = result.gold;
            goldPerClickRef.current = result.goldPerClick;
            goldPerSecondRef.current = result.goldPerSecond;
            criticalMultRef.current = result.criticalMult;
            criticalRateRef.current = result.criticalRate;

            clickCountRef.current = result.clickCount;
            return;
        }

        const valueArray = [
            _getGuestGold(),
            _getGuestGoldPerClick(),
            _getGuestGoldPerSecond(),
            _getGuestCriticalMult(),
            _getGuestCriticalRate()
        ];

        if(valueArray.includes(null)) {
            const defaultData = await API.StatsAPI.getDefaultData();

            goldRef.current = defaultData.gold;
            goldPerClickRef.current = defaultData.goldPerClick;
            goldPerSecondRef.current = defaultData.goldPerSecond;
            criticalMultRef.current = defaultData.criticalMult;
            criticalRateRef.current = defaultData.criticalRate;

            GuestUtil.setGuestItem(GUEST_GOLD_KEY, goldRef.current);
            GuestUtil.setGuestItem(GUEST_GOLD_PER_CLICK_KEY, goldPerClickRef.current);
            GuestUtil.setGuestItem(GUEST_GOLD_PER_SECOND_KEY, goldPerSecondRef.current);
            GuestUtil.setGuestItem(GUEST_CRITICAL_MULT_KEY, criticalMultRef.current);
            GuestUtil.setGuestItem(GUEST_CRITICAL_RATE_KEY, criticalRateRef.current);
            return;
        }

        const refArray = [
            goldRef,
            goldPerClickRef,
            goldPerSecondRef,
            criticalMultRef,
            criticalRateRef
        ];

        for(let i = 0; i < valueArray.length; i++) {
            refArray[i].current = valueArray[i] as number;
        }
    }, []);

    useAsyncEffect(refresh, []);

    return {
        goldRef,
        goldPerClickRef,
        goldPerSecondRef,
        criticalMultRef,
        criticalRateRef,
        clickCountRef,
        refresh
    };
}

// StatsContext를 가져오는 커스텀 훅.
export function useStatsContext():StatsContext {
    const statsContext = useContext(StatsContext);
    if(!statsContext) {
        throw new Error("\"StatsContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return statsContext;
}

// Guest(미로그인 상태) 전용 localStorage 값 가져오기 함수.
function _getGuestGold():number | null {
    const result = window.localStorage.getItem(GUEST_GOLD_KEY);
    return result ? Number(result) : null;
}
function _getGuestGoldPerClick():number | null {
    const result = window.localStorage.getItem(GUEST_GOLD_PER_CLICK_KEY);
    return result ? Number(result) : null;
}
function _getGuestGoldPerSecond():number | null {
    const result = window.localStorage.getItem(GUEST_GOLD_PER_SECOND_KEY);
    return result ? Number(result) : null;
}
function _getGuestCriticalMult():number | null {
    const result = window.localStorage.getItem(GUEST_CRITICAL_MULT_KEY);
    return result ? Number(result) : null;
}
function _getGuestCriticalRate():number | null {
    const result = window.localStorage.getItem(GUEST_CRITICAL_RATE_KEY);
    return result ? Number(result) : null;
}