import { useCallback, useEffect, useState, type JSX } from "react";
import { BetweenHr } from "../utils/BetweenHr";
import { DurationUtil } from "../utils/DurationUtil";
import "../css/item.css";
import "../css/Page.css";
import "../css/StatsPage.css";
import { useGameContext } from "../core/Game";

// StatsPage 생성 함수.
export function StatsPage(): JSX.Element {
    const {
        gold,
        goldPerClick,
        goldPerSecond,
        criticalMult,
        criticalRate,
        clickCount,
        playTime
    } = useStatsPage();

    // BetweenHr을 사용하여 hr 중복을 제거하였습니다.
    const statsLines = (
        <BetweenHr>
            <StatsPageLine name="골드" value={Math.floor(gold) + "G"} />
            <StatsPageLine name="클릭 당 골드" value={goldPerClick + "G/C"} />
            <StatsPageLine name="초 당 골드" value={goldPerSecond + "G/S"} />
            <StatsPageLine name="크리티컬 배수" value={criticalMult + "X"} />
            <StatsPageLine name="크리티컬 확률" value={criticalRate + "%"} />
            <StatsPageLine name="클릭 횟수" value={clickCount ?? 0 + "회"} />
            <StatsPageLine name="총 플레이 시간" value={playTime} />
        </BetweenHr>
    );

    return (
        <div className="page-thingie" id="stats-page">
            <h1 className="page-text-thingie" id="stats-page-text">통계</h1>
            <div className="border-box-sizing interactive-border-black round-border" id="stats-page-area">
                {statsLines}
            </div>
        </div>
    );
}

function useStatsPage() {
    const game = useGameContext();
    const userContext = game.userContext;
    const statsContext = game.statsContext;

    const now = Date.now();

    const [gold, setGold] = useState(0);
    const [goldPerClick, setGoldPerClick] = useState(0);
    const [goldPerSecond, setGoldPerSecond] = useState(0);
    const [criticalMult, setCriticalMult] = useState(0);
    const [criticalRate, setCriticalRate] = useState(0);
    const [clickCount, setClickCount] = useState(0);
    const [createdAt, setCreatedAt] = useState(now);

    const playStartDate = createdAt;
    const playTime = DurationUtil.getAutoStringByMilli(now - playStartDate);

    const onUpdate = useCallback(() => {
        if(userContext.createdAt !== undefined) {
            setGold(statsContext.gold);
            setGoldPerClick(statsContext.goldPerClick);
            setGoldPerSecond(statsContext.goldPerSecond);
            setCriticalMult(statsContext.criticalMult);
            setCriticalRate(statsContext.criticalRate);
            setClickCount(statsContext.clickCount ?? 0);
            setCreatedAt(new Date(userContext.createdAt).getTime());
        }
    }, []);

    useEffect(() => {
        game.onUpdate = onUpdate;

        return () => {
            game.onUpdate = null;
        };
    }, []);

    return {
        gold,
        goldPerClick,
        goldPerSecond,
        criticalMult,
        criticalRate,
        clickCount,
        playTime
    };
}

type StatsPageLineProps = {
    name: string,
    value: any
};
function StatsPageLine(props: StatsPageLineProps): JSX.Element {
    return (
        <div className="stats-line">
            <p className="stats-line-name">{props.name}</p>
            <p className="stats-line-value">{props.value}</p>
        </div>
    );
}