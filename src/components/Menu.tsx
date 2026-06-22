import React, { useRef, useState, type JSX } from "react";
import "../css/border.css";
import "../css/Menu.css";
import "../css/ShopMenu.css";
import "../css/HamburgerButtonMenu.css";
import "../css/blackbg.css";
import { ShopMenu } from "./ShopMenu";
import { HamburgerButtonMenu } from "./HamburgerButtonMenu";
import clsx from "clsx";
import type { Nullable } from "../types";

export enum MenuType {
    HAMBURGER_BUTTON_MENU = "hamburger-button-menu",
    SHOP_MENU = "shop-menu"
}

enum _MenuAppearState {
    APPEAR,
    NORMAL,
    DISAPPEAR,
    GONE
}

export type ChildMenuProps = { isActivate: boolean };

type MenuProps = { isActivate: boolean, menuTypeRef: React.RefObject<Nullable<MenuType>> };
export function Menu({ isActivate, menuTypeRef }: MenuProps): JSX.Element {
    const { appearState } = useMenu(isActivate);
    const { classes, blackBGClasses } = getClasses(appearState, menuTypeRef);
    const menuChild = getMenuContents(menuTypeRef.current, isActivate);

    return (
        <>
            <div className={clsx("black-bg black-bg-with-animation", blackBGClasses)}></div>
            <div className={classes} id="menu-component">
                {menuChild}
            </div>
        </>
    );
}

const _APPEAR_OR_DISAPPEAR_DURATION = 200; // millisecond
function useMenu(isActivate: boolean) {
    const appearStateRef = useRef<_MenuAppearState>(_MenuAppearState.GONE);

    const _appearedRef = useRef(false);
    const _disappearedRef = useRef(true);

    if (_disappearedRef.current && isActivate) {
        _appearedRef.current = false;
        _disappearedRef.current = false;
    }

    if (_disappearedRef.current) {
        appearStateRef.current = _MenuAppearState.GONE;
    }
    else if (!_appearedRef.current) {
        _appearedRef.current = true;
        appearStateRef.current = _MenuAppearState.APPEAR;
    }
    else if (!isActivate) {
        _disappearedRef.current = true;
        appearStateRef.current = _MenuAppearState.DISAPPEAR;
    }
    else {
        appearStateRef.current = _MenuAppearState.NORMAL;
    }

    return {
        appearState: appearStateRef.current
    };
}

const MENU_APPEARED_CLASS = "menu-appeared";
const MENU_NORMAL_CLASS = "menu-normal";
const MENU_DISAPPEARED_CLASS = "menu-disappeared";
const BLACK_BG_APPEARED_CLASS = "black-bg-appeared";
const BLACK_BG_NORMAL_CLASS = "black-bg-normal";
const BLACK_BG_DISAPPEARED_CLASS = "black-bg-disappeared";
function getClasses(appearState: _MenuAppearState, menuTypeRef: React.RefObject<Nullable<MenuType>>) {
    const [classes, setClasses] = useState("");
    const [blackBGClasses, setBlackBGClasses] = useState("");

    const _prevStateRef = useRef<_MenuAppearState>(_MenuAppearState.GONE);
    const _timerRef = useRef<number | null>(null);

    if (_prevStateRef.current === appearState) {
        return {
            classes,
            blackBGClasses
        };
    }

    switch (appearState) {
        case _MenuAppearState.APPEAR:
            if (_timerRef.current !== null) {
                clearTimeout(_timerRef.current);
            }

            setClasses(`${menuTypeRef.current} ${MENU_APPEARED_CLASS}`);
            setBlackBGClasses(BLACK_BG_APPEARED_CLASS);

            _timerRef.current = setTimeout(() => {
                setClasses(`${menuTypeRef.current} ${MENU_NORMAL_CLASS}`);
                setBlackBGClasses(BLACK_BG_NORMAL_CLASS);
            }, _APPEAR_OR_DISAPPEAR_DURATION);
            break;
        case _MenuAppearState.DISAPPEAR:
            if (_timerRef.current !== null) {
                clearTimeout(_timerRef.current);
            }

            setClasses(`${menuTypeRef.current} ${MENU_DISAPPEARED_CLASS}`);
            setBlackBGClasses(BLACK_BG_DISAPPEARED_CLASS);

            _timerRef.current = setTimeout(() => {
                setClasses("");
                setBlackBGClasses("");
                menuTypeRef.current = null
            }, _APPEAR_OR_DISAPPEAR_DURATION);
            break;
        default:
    }

    _prevStateRef.current = appearState;

    return {
        classes,
        blackBGClasses
    };
}

// Fragment로 묶어 내보냅니다.(<></> 또는 <React.Fragment></React.Fragment>)
function getMenuContents(menuType: Nullable<MenuType>, isActivate: boolean): JSX.Element {
    switch (menuType) {
        case MenuType.HAMBURGER_BUTTON_MENU:
            return (
                <>
                    <HamburgerButtonMenu isActivate={isActivate} />
                </>
            );
        case MenuType.SHOP_MENU:
            return (
                <>
                    <ShopMenu isActivate={isActivate} />
                </>
            );
        case null:
            return (
                <>
                </>
            );
        default:
            return (
                <>
                    <p>무언가 이상한 값이 들어왔어요. :(</p>
                </>
            );
    }
}