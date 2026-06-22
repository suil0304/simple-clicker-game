import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type JSX, type PropsWithChildren } from "react";
import { getSettingContext as useSettingContext, Setting, type SettingContext } from "./providers/Setting";
import { MergeContext } from "../utils/MergeContext";
import { useUserContext, User, type UserContext, isLogin } from "./providers/User";
import { Stats, useStatsContext, type StatsContext } from "./providers/Stats";
import { Upgrade, useUpgradeContext, type UpgradeContext } from "./providers/Upgrade";
import type { Nullable, RefreshableContext } from "../types";
import { API } from "../apis";
import { Data, useDataContext, type DataContext } from "./providers/Data";

// onUpdate는 경과 시간을 받습니다.
// (HaxeFlixel 레퍼런스.)
export type UpdateCallback = (elapsed: number) => void;
// GameContext는 이렇게 구현 되어야 한다는 interface.
export interface GameContext extends RefreshableContext {
    // 말 그대로 틱입니다.
    // 이하 생략.
    readonly tick: bigint;

    // 게임 강제 업데이트 함수.
    // RefObject는 그 특성에 따라 React 특유의 State 주소 변경 감시 업데이트를 따라가지 않습니다.
    // 이와 같은 경우에 대해 사용하기 위해 만들었습니다.
    readonly forceUpdate: () => void;

    // 이를 true로 설정 시 1초마다의 update를 멈춥니다.
    // forceUpdate는 말 그대로 강제 업데이트기 때문에 영향 받지 않습니다.
    stopUpdate: boolean;

    // nullable한 onUpdate 함수.
    // 각 페이지마다의 업데이트를 담아 함께 돌립니다.
    onUpdate: Nullable<UpdateCallback>;

    // Context 모음.
    // Game에서 바로 접근 가능하도록 설정하였습니다.
    // 때문에, use~~Context와 같은 코드는(useGameContext 제외) Game.tsx 제외 다른 파일에서 찾아볼 수 없습니다.
    readonly userContext: UserContext;
    readonly statsContext: StatsContext;
    readonly upgradeContext: UpgradeContext;
    readonly settingContext: SettingContext;
    readonly dataContext: DataContext;
}
const GameContext = createContext<GameContext | null>(null);

const contexts = [Data, Setting, Upgrade, Stats, User];
// Game Core.
// 1초마다 onUpdate를 호출하며, 백엔드 서버와 싱크를 맞춥니다.
export function Game(props: PropsWithChildren): JSX.Element {
    return (
        // 소위 "장풍 맞은 코드"를 피하기 위해 만든 Context 함수 늘여 놓기 툴.
        <MergeContext contexts={contexts}>
            {/* _Game은 Context 중 가장 밑에 있어야 위의 Context에 접근할 수 있기 때문에 존재합니다. */}
            {/* -> internal */}
            {/* 어째서 MergeContext에 넣지 않았는가는 명시적으로 적기 위해서 입니다. */}
            <_Game>
                {props.children}
            </_Game>
        </MergeContext>
    );
}

// 사실상의 진짜 Game Core.
function _Game(props: PropsWithChildren): JSX.Element {
    // _useGame 커스텀 훅 사용(책임 분리).
    const {
        tickRef,
        stopUpdateRef,
        onUpdateRef,
        userContext,
        statsContext,
        upgradeContext,
        settingContext,
        dataContext,
        forceUpdate
    } = _useGame();

    // 제공자에 value로써 넣기 위한 GameContext 생성
    // Game 안에 있다면 useGameContext를 통해 이 객체를 받아 올 수 있습니다.
    // getter, setter를 사용하여 객체지향 느낌의 캡슐화를 시도하였습니다.
    // useMemo는 Game 재렌더링 시마다 다시 생성되는 것을 막기 위해 사용하였습니다.
    // 또한 useMemo를 사용하여 고정된(캡처된) 변수를 반환하는 것을 막기 위해서도 getter를 사용하였습니다.
    const gameContext: GameContext = useMemo(
        () => {
            return {
                get tick() {
                    return tickRef.current;
                },
                forceUpdate: forceUpdate,
                get stopUpdate() {
                    return stopUpdateRef.current;
                },
                set stopUpdate(v) {
                    stopUpdateRef.current = v;
                    forceUpdate();
                },
                get onUpdate() {
                    return onUpdateRef.current;
                },
                set onUpdate(func) {
                    onUpdateRef.current = func;
                },
                get userContext() {
                    return userContext;
                },
                get statsContext() {
                    return statsContext;
                },
                get upgradeContext() {
                    return upgradeContext;
                },
                get settingContext() {
                    return settingContext
                },
                get dataContext() {
                    return dataContext;
                },
                async refresh() {
                    await statsContext.refresh();
                    await upgradeContext.refresh();
                    await settingContext.refresh();
                },
            }
        },
        [
            userContext,
            statsContext,
            upgradeContext,
            settingContext,
            dataContext
        ]
    );

    // GameContext 제공자에 gameContext 객체 주입
    return (
        <GameContext.Provider value={gameContext}>
            {props.children}
        </GameContext.Provider>
    );
}

// 1초(ms) 상수 분리.
const TICK_MS = 1000;
function _useGame() {
    const tickRef = useRef(0n);
    // update를 위한 State.
    const [_, setTick] = useState(0n);
    const stopUpdateRef = useRef(false);
    // forceUpdate를 위한 State.
    const [__, _setForceTick] = useState(0n);

    const onUpdateRef = useRef<Nullable<UpdateCallback>>(null);

    // 마지막 update 시간 보관 RefObject.
    const _lastRef = useRef<number>(Date.now());

    // Context 가져오기.
    const userContext = useUserContext();
    const statsContext = useStatsContext();
    const upgradeContext = useUpgradeContext();
    const settingContext = useSettingContext();
    const dataContext = useDataContext();

    // doSync 함수 선언 및 update에 의존성 배열 삽입 없이 바로 사용하기 위해 RefObject 선언.
    const doSyncRef = useRef<(elapsed: number) => Promise<void> | null>(null);
    const doSync = useCallback(async (elapsed: number) => {
        try {
            if(isLogin()) {
                const syncData = await API.StatsAPI.doSync({
                    totalClickAddGold: dataContext.totalClickAddGold,
                    clickDatas: dataContext.clickDatas,
                    deltaSecondCount: Math.floor(elapsed)
                });

                dataContext.reset();

                statsContext.gold = syncData.gold;
                statsContext.goldPerClick = syncData.goldPerClick;
                statsContext.goldPerSecond = syncData.goldPerSecond;
                statsContext.criticalMult = syncData.criticalMult;
                statsContext.criticalRate = syncData.criticalRate;

                statsContext.clickCount = syncData.clickCount;
                return;
            }

            statsContext.gold += statsContext.goldPerSecond;
        }
        catch {
            dataContext.reset();
            console.error("싱크 실패");
        }
    }, [statsContext, dataContext]);

    useEffect(() => {
        doSyncRef.current = doSync;
    }, [doSync]);

    // 메인 update.
    useEffect(() => {
        const intervalID = setInterval(() => {
            if (stopUpdateRef.current) {
                return;
            }

            const cur = Date.now();
            const elapsed = (cur - _lastRef.current) / 1000;
            onUpdateRef.current?.(elapsed); // second
            _lastRef.current = cur;

            if (isLogin()) {
                doSyncRef.current?.(elapsed);
            }

            setTick((prev) => {
                tickRef.current = prev + 1n;
                return tickRef.current;
            });
        }, TICK_MS);

        return () => {
            clearInterval(intervalID);
        };
    }, []);

    const forceUpdate = useCallback(() => {
        _setForceTick((prev) => prev + 1n);
    }, []);

    return {
        tickRef,
        stopUpdateRef,
        onUpdateRef,
        userContext,
        statsContext,
        upgradeContext,
        settingContext,
        dataContext,
        forceUpdate
    };
}

// GameContext를 가져오기 위한 커스텀 훅.
export function useGameContext(): GameContext {
    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error("\"GameContext\"은 \"Game\" 안에서만 사용 가능합니다.");
    }

    return gameContext;
}