// 혹시 몰라 동적으로 마우스 모양 등등 변경할 때 사용하면 좋은 마우스 유틸.

export enum MouseShape {
    // normal
    AUTO = "auto",
    DEFAULT = "default", // 웹의 기본 동작에 따라 행동하는 것이 아닌 마우스 기본 생김새임을 주의하세요.
    NONE = "none", // 숨기기

    // link/select
    POINTER = "pointer",
    TEXT = "text",
    VERTICAL_TEXT = "vertical-text", // 세로 텍스트 입력
    CELL = "cell", // 표 셀 선택
    CROSSHAIR = "crosshair", // 십자선

    // drag/move
    MOVE = "move",
    GRAB = "GRAB",
    GRABBING = "grabbing",
    ALL_SCROLL = "all_scroll",

    // loading/state
    WAIT = "wait",
    PROGRESS = "progress",
    HELP = "help",
    CONTEXT_MENU = "context-menu", // 말 그대로라고 하네용

    // not allowed
    NOT_ALLOWED = "not-allowed",
    NO_DROP = "no-drop",

    // zoom-in/zoom-out
    ZOOM_IN = "zoom-in",
    ZOOM_OUT = "zoom-out",

    // copy/alias
    COPY = "copy",
    ALIAS = "alias", // 바로가기 생성

    // direction resize
    N_RESIZE = "n-resize", // 위
    E_RESIZE = "e-resize", // 오른
    S_RESIZE = "s-resize", // 아래
    W_RESIZE = "w-resize", // 왼

    // diagonal resize
    NE_RESIZE = "ne-resize", // 위-오른
    NW_RESIZE = "nw-resize", // 위-왼
    SE_RESIZE = "se-resize", // 아래-오른
    SW_RESIZE = "sw-resize", // 아래-왼

    // both-direction resize
    EW_RESIZE = "ew-resize", // 왼/오른
    NS_RESIZE = "ew-resize", // 위/아래
    NESW_RESIZE = "nesw-resize", // 위-왼/아래-오른
    NWSE_RESIZE = "nwse-resize", // 아래-왼/위-오른

    // column/row resize
    COL_RESIZE = "col-resize",
    ROW_RESIZE = "row-resize",
}

export namespace MouseUtil {
    export function mouseChange(element:HTMLElement, shape:MouseShape):void {
        element.style.cursor = shape;
    }
}