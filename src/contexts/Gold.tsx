import type React from "react";
import { createContext, useContext, useRef, useState, type JSX } from "react";

const _LOCAL_STORAGE_KEY_GOLD = "gold";
const _LOCAL_STORAGE_KEY_GOLD_PER_CLICK = "gold-per-click";
const _LOCAL_STORAGE_KEY_GOLD_PER_SECOND = "gold-per-second";

// "gold" 스테이트를 가져오고, 수정하기 위한 API.
export interface GoldContextContents {
    // gold
    readonly gold:bigint; // getter(ref)
    addGold:(add:bigint) => GoldContextContents; // this
    useGold:(use:bigint) => GoldContextContents; // this
    setGold:(set:bigint) => GoldContextContents; // this

    // gold per click
    readonly goldPerClick:bigint; // getter(ref)
    setGoldPerClick:(set:bigint) => GoldContextContents; // this

    // gold per second
    readonly goldPerSecond:bigint;
    setGoldPerSecond:(set:bigint) => GoldContextContents;

    // 화면 반영 등등
    commit:() => void; // this
}

export const DEFAULT_GOLD = 0;
export const DEFAULT_GOLD_PER_CLICK = 1;
export const DEFAULT_GOLD_PER_SECOND = 0;

// nullable을 강조하지 않음.
// (어쩔 수 없이 초기화 값으로 null이 들어가는 것이지 중간에 null로 바뀔 수 있음을 알리는 것이 아니기 때문.)
const GoldContext = createContext<GoldContextContents | null>(null);

// "gold" 스테이트를 전역으로 사용하기 위한 컨테이너.
export function GoldProvider({ children }:{ children:React.ReactNode }):JSX.Element {
    const goldRef = useRef<bigint>(_getLocalStorageGold());
    const goldPerClickRef = useRef<bigint>(_getLocalStorageGoldPerClick());
    const goldPerSecondRef = useRef<bigint>(_getLocalStorageGoldPerSecond());

    const [_, setTick] = useState(0);

    const updateRender = () => {
        setTick((prev) => prev + 1);
    };

    const goldContext:GoldContextContents = {
        // gold
        get gold() {
            return goldRef.current;
        },
        addGold(add) {
            if(add < 0) {
                console.warn(`돈을 마이너스로 버는 거에요?`);
                return this;
            }

            goldRef.current += add;
            return this;
        },
        useGold(use) {
            if(use > this.gold) {
                console.warn(`사용하려는 골드(${use}G)는 현재 보유한 골드(${this.gold}G)보다 많아요!`); 
                return this;
            }

            goldRef.current -= use;
            return this;
        },
        setGold(set) {
            if(set < 0) {
                console.warn(`골드는 0 이하로 설정할 수 없어요!`); 
                return this;
            }

            goldRef.current = set;
            return this;
        },
        // gold per click
        get goldPerClick() {
            return goldPerClickRef.current;
        },
        setGoldPerClick(set) {
            if(set < 0) {
                console.warn(`클릭 당 골드는 0 이하로 설정할 수 없어요!`); 
                return this;
            }

            goldPerClickRef.current = set;
            return this;
        },
        // gold per second
        get goldPerSecond() {
            return goldPerSecondRef.current;
        },
        setGoldPerSecond(set) {
            if(set < 0) {
                console.warn(`초 당 골드는 0 이하로 설정할 수 없어요!`); 
                return this;
            }

            goldPerSecondRef.current = set;
            return this;
        },
        commit() {
            window.localStorage.setItem(_LOCAL_STORAGE_KEY_GOLD, this.gold.toString());
            window.localStorage.setItem(_LOCAL_STORAGE_KEY_GOLD_PER_CLICK, this.goldPerClick.toString());
            window.localStorage.setItem(_LOCAL_STORAGE_KEY_GOLD_PER_SECOND, this.goldPerSecond.toString());
            updateRender();
        }
    };

    return (
        <GoldContext.Provider value={goldContext}>
            {children}
        </GoldContext.Provider>
    );
}

export function useGoldContext():GoldContextContents {
    const goldContext = useContext(GoldContext);
    if(goldContext === null) {
        throw new Error("\"gold\" 컨텍스트는 \"GoldProvider\" 안에서만 가져올 수 있어요!");
    }
    return goldContext;
}

function _getLocalStorageGold():bigint {
    const n = BigInt(window.localStorage.getItem(_LOCAL_STORAGE_KEY_GOLD) ?? DEFAULT_GOLD);
    return n;
}

function _getLocalStorageGoldPerClick():bigint {
    const n = BigInt(window.localStorage.getItem(_LOCAL_STORAGE_KEY_GOLD_PER_CLICK) ?? DEFAULT_GOLD_PER_CLICK);
    return n;
}

function _getLocalStorageGoldPerSecond():bigint {
    const n = BigInt(window.localStorage.getItem(_LOCAL_STORAGE_KEY_GOLD_PER_SECOND) ?? DEFAULT_GOLD_PER_SECOND);
    return BigInt(n);
}