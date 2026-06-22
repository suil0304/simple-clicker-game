import { useCallback, useEffect, useRef, useState, type JSX, type RefObject } from "react";
import "../css/border.css";
import "../css/button.css";
import "../css/Shop.css";
import { useGameContext, type GameContext } from "../core/Game";
import type { UpgradeInfo } from "../apis/types/upgrades";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { API } from "../apis";
import { isLogin } from "../core/providers/User";
import type { ChildMenuProps } from "./Menu";

// 상점 메뉴 컴포넌트.
export function ShopMenu(props:ChildMenuProps): JSX.Element {
    const {
        game,
        upgradeItems,
        setUpgradeItems,
        isDestroyRef
    } = useShopMenu(props.isActivate);

    // 서버에서 받아온 upgradeInfo를 ShopItemLine에 넘겨 생성합니다.
    const shopItemLines: JSX.Element[] = upgradeItems.map((upgradeItem) => {
        return (
            <ShopItemLine
                key={`shop-item-line-${upgradeItem.upgradeKey}`}
                game={game}
                setUpgradeItems={setUpgradeItems}
                upgradeInfo={upgradeItem}
                isDestroyRef={isDestroyRef}
            />
        );
    });

    return (
        <div id="shop-component">
            {shopItemLines}
        </div>
    );
}

function useShopMenu(isActivate:boolean) {
    const game = useGameContext();
    const statsContext = game.statsContext;
    const upgradeContext = game.upgradeContext;

    const [upgradeItems, setUpgradeItems] = useState<UpgradeInfo[]>([]);

    const prevGoldRef = useRef(statsContext.gold);

    // 해당 컴포넌트가 박살난 경우 체크.
    const isDestroyRef = useRef(false);

    // upgradeInfo에 대하여 새로 고침 함수 정의.
    const refresh = useCallback(async () => {
        if (isLogin()) {
            const result = await API.UpgradesAPI.getAll();
            setUpgradeItems(result);
            return;
        }

        const result = await API.UpgradesAPI.getGuestInfos({
            ...upgradeContext,
            gold: statsContext.gold
        });
        setUpgradeItems(result);
    }, [game, statsContext, isActivate]);

    // 비동기 함수에 대하여 처리해주는 커스텀 훅을 사용합니다.
    useAsyncEffect(refresh, [refresh]);

    // 본래 onUpdate를 배열이나 Map으로 만들고 등록하는 방식으로 만들었어야 했으나,
    // 시간이 부족하여 구현하지 못 하였습니다.
    // -> 따로 도는 1초 업데이트.
    useEffect(() => {
        isDestroyRef.current = false;

        const intervalID = setInterval(() => {
            // 박살났으면 업데이트 금지.
            if(isDestroyRef.current) {
                return;
            }

            if(prevGoldRef.current !== statsContext.gold) {
                for(const updateItem of upgradeItems) {
                    if(!updateItem.canBuy && statsContext.gold >= updateItem.curPrice) {
                        refresh();
                    }
                }
            }
        }, 1000);

        return () => {
            isDestroyRef.current = true;
            // cleanup으로 비우기.
            clearInterval(intervalID);
        }
    }, [refresh]);

    return {
        game,
        upgradeItems,
        setUpgradeItems,
        isDestroyRef
    };
}

type ShopItemLineProps = {
    game: GameContext,
    setUpgradeItems: React.Dispatch<React.SetStateAction<UpgradeInfo[]>>,
    upgradeInfo: UpgradeInfo,
    isDestroyRef: RefObject<boolean>
};
// 코드 중복을 줄이기 위해 정의하였습니다.
// upgradeInfo를 받아 배치합니다.
function ShopItemLine({ game, setUpgradeItems, upgradeInfo, isDestroyRef }: ShopItemLineProps): JSX.Element {
    const {
        onClick
    } = setShopItemLine(game, setUpgradeItems, upgradeInfo, isDestroyRef);

    return (
        <div className="shop-item-line-component interactive-border-black round-border">
            <span className="shop-item-line-main-container">
                <h1 className="shop-item-line-name">{upgradeInfo.name}</h1>
                <p className="shop-item-line-level">{upgradeInfo.level}LVL</p>
            </span>
            <p className="shop-item-line-description">{upgradeInfo.description}</p>
            <p className="shop-item-line-value">{upgradeInfo.curValue} {"->"} {upgradeInfo.nextValue}</p>
            <span className="shop-item-line-button-container">
                <button
                    className="shop-item-line-buy interactive-border-black round-border button-like disable-colored-button-force active-scale-bump-button"
                    type="button"
                    onClick={onClick}
                    disabled={!upgradeInfo.canBuy || upgradeInfo.isMaxLevel}
                >
                    {!upgradeInfo.isMaxLevel ? `+1LVL(${upgradeInfo.curPrice}G)` : "MAX"}
                </button>
            </span>
        </div>
    );
}

function setShopItemLine(
    game: GameContext,
    setUpgradeItems: React.Dispatch<React.SetStateAction<UpgradeInfo[]>>,
    curUpgradeInfo: UpgradeInfo,
    isDestroyRef: RefObject<boolean>
) {
    const statsContext = game.statsContext;

    // 클릭 시 -> 게스트인 경우 계산 요청 보내고 그에 따라 업데이트.
    // 클릭 시 -> 게스트가 아닌 경우 구매 요청을 보내고 서버 정보를 받아 업데이트.
    const onClick = () => {
        const doClick = async () => {
            if (isLogin()) {
                const result = await API.UpgradesAPI.buyUpgrade({
                    upgradeKey: curUpgradeInfo.upgradeKey
                });

                if (isDestroyRef.current) {
                    return;
                }

                const updateInfo = result.upgradeInfo;
                statsContext[updateInfo.upgradeKey] = updateInfo.curValue;
                game.upgradeContext[`${updateInfo.upgradeKey}Level`] = updateInfo.level;

                const upgradeInfos = await API.UpgradesAPI.getAll();
                setUpgradeItems(upgradeInfos);
                return;
            }

            const result = await API.UpgradesAPI.buyGuestUpgrade({
                upgradeKey: curUpgradeInfo.upgradeKey,
                level: curUpgradeInfo.level,
                gold: statsContext.gold
            });
            const upgradeInfo = result.upgradeInfo;

            statsContext[upgradeInfo.upgradeKey] = result.curStats;
            game.upgradeContext[`${upgradeInfo.upgradeKey}Level`] = upgradeInfo.level;
            statsContext.gold = result.curGold;

            if (isDestroyRef.current) {
                return;
            }

            const upgradeInfos =await API.UpgradesAPI.getGuestInfos({
                ...game.upgradeContext,
                gold: statsContext.gold
            });
            setUpgradeItems(upgradeInfos);
        };

        doClick();
    }

    return {
        onClick
    };
}