import { type JSX } from "react";
import { DEFAULT_GOLD_PER_CLICK, DEFAULT_GOLD_PER_SECOND, useGoldContext, type GoldContextContents } from "../contexts/Gold";
import { getItemJSON, items, setItemJSON, type ItemJSONContents, type ValueType } from "../utils/Item";
import "../css/Shop.css";
import "../css/border.css";

export function Shop():JSX.Element {
    const goldContext = useGoldContext();

    const shopItemLines:JSX.Element[] = items.map((item) => {
        return <ShopItemLine
            key={item["item-key"]}
            shopItem={item}
            goldContext={goldContext}
        />;
    });

    return (
        <div className="shop-component">
            {shopItemLines}
        </div>
    );
}

type ShopItemLineProps = { shopItem:ItemJSONContents, goldContext:GoldContextContents };
function ShopItemLine({ shopItem, goldContext }:ShopItemLineProps):JSX.Element {
    const key = shopItem["item-key"];

    const itemJSON = getItemJSON(key);

    const curValue = calcValue(itemJSON.level, shopItem["base-value"], shopItem["mult-value"], shopItem["type-value"]);
    const nextValue = calcValue(itemJSON.level + 1, shopItem["base-value"], shopItem["mult-value"], shopItem["type-value"]);

    const curPrice = calcPrice(itemJSON.level, shopItem["base-price"], shopItem["mult-price"]);

    return (
        <div className="shop-item-line-component interactive-border-black round-border">
            <span>
                <span className="shop-item-line-main-container">
                    <h1 className="shop-item-line-name">{shopItem.name}</h1>
                    <p className="shop-item-line-level">{itemJSON.level}LVL</p>
                </span>
                <p className="shop-item-line-description">{shopItem.description}</p>
                <p className="shop-item-line-value">{curValue} {"->"} {nextValue}</p>
            </span>
            <span>
                <button
                    className="shop-item-line-buy interactive-border-black round-border"
                    type="button"
                    onClick={_onClick.bind(null, key, goldContext, itemJSON.level, curPrice, nextValue)}
                    disabled={goldContext.gold < curPrice}
                >
                    +1LVL({curPrice}G)
                </button>
            </span>
        </div>
    );
}

// level은 0부터 시작합니다.
// earn-money key를 가진 아이템 1레벨 구매: basePrice[level] -> 25
// for문으로 순회-구매하는 경우 따로 구현해주세요.
export function calcPrice(level:number, bases:number[], mult:number):number {
    const lastIndex = bases.length - 1;
    if(level <= lastIndex) {
        return Math.floor(bases[level]);
    }

    const last = bases[lastIndex];
    return Math.floor(last * (mult ** (level - lastIndex)));
}

export function calcValue(level:number, bases:number[], mult:number, type:ValueType = "multiply"):number {
    const lastIndex = bases.length - 1;

    switch(type) {
        case "stack":
            const startIndex = 0;
            return Math.floor(bases[startIndex] * level);
        case "multiply":
            if(level <= lastIndex) {
                return bases[level];
            }

            const last = bases[lastIndex];
            return Math.floor(last * (mult ** (level - lastIndex)));
    }
}

function _onClick(key:string, goldContext:GoldContextContents, curLevel:number, curPrice:number, curValue:number):void {
    if(goldContext.gold < curPrice) {
        return;
    }

    goldContext.useGold(BigInt(curPrice));

    let result:number = 0;
    switch(key) {
        case "earn-money-upgrade":
            result = DEFAULT_GOLD_PER_CLICK + curValue;
            goldContext.setGoldPerClick(BigInt(result));
            break;
        case "earn-money-second-upgrade":
            result = DEFAULT_GOLD_PER_SECOND + curValue;
            goldContext.setGoldPerSecond(BigInt(result));
            break;
        default:
    }

    setItemJSON(key, {
        level: curLevel + 1
    });

    goldContext.commit();
}