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

export function Shop(props:ChildMenuProps): JSX.Element {
    const {
        game,
        upgradeItems,
        setUpgradeItems,
        isDestroyRef
    } = useShop(props.isActivate);

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

function useShop(isActivate:boolean) {
    const game = useGameContext();
    const statsContext = game.statsContext;
    const upgradeContext = game.upgradeContext;

    const [upgradeItems, setUpgradeItems] = useState<UpgradeInfo[]>([]);

    const prevGoldRef = useRef(statsContext.gold);

    const isDestroyRef = useRef(false);

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

    useAsyncEffect(refresh, [refresh]);

    useEffect(() => {
        isDestroyRef.current = false;

        const intervalID = setInterval(() => {
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

            statsContext[upgradeInfo.upgradeKey] += upgradeInfo.curValue;
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