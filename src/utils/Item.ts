import rawShopItem from "../assets/json/shop-item.json";

export type ValueType = "stack" | "multiply";

export interface ItemJSONContents {
    "item-key":string;
    "name":string;
    "description":string;
    "base-price":number[];
    "mult-price":number;
    "base-value":number[];
    "mult-value":number;
    "type-value":ValueType;
}

export const items:ItemJSONContents[] = rawShopItem as ItemJSONContents[];

export interface SaveItemContents {
    "level":number;
}

export function setItemJSON(key:string, value:SaveItemContents):SaveItemContents {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
}

export function getItemJSON(key:string):SaveItemContents {
    const lawJSON:string | null = window.localStorage.getItem(key);
    const result:SaveItemContents = lawJSON !== null ? JSON.parse(lawJSON) : initItemJSON(key);
    return result;
}

export function initItemJSON(key:string):SaveItemContents {
    const item:SaveItemContents = {
        level: 0
    };
    
    window.localStorage.setItem(key, JSON.stringify(item));
    return item;
}