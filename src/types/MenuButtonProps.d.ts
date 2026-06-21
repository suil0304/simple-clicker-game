import type React from "react";
import type { MenuType } from "../components/Menu";
import type { ButtonActivateState } from "../components/ToggleButton";
import type { Nullable } from "./Nullable";

// MenuButton 자식들을 위한 Props 타입.
export type MenuButtonProps = { buttonIndex:number, buttonActivateState:ButtonActivateState, menuTypeRef:React.RefObject<Nullable<MenuType>> };