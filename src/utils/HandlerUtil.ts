import type React from "react";

// 매우 간단한 HandlerUtil.
// 여러 Handler에 대하여 사용하기 좋은 함수를 여기에 모아 놓습니다.
export namespace HandlerUtil {
    // onClick
    export function preventDefaultMultipleClick(event:React.MouseEvent):void {
        if(event.detail > 1) {
            event.preventDefault();
        }
    }
}