import clsx from "clsx";
import React from "react";
import type { JSX } from "react";
import "../css/BetweenHr.css";

type BetweenHrProps = {
    children:React.ReactNode,
    hrClassName?:string
}
// 자식 요소 사이 사이에 hr 요소를 끼워 넣습니다.
export function BetweenHr(props:BetweenHrProps):JSX.Element {
    const childArray = React.Children.toArray(props.children);

    // hr 요소를 끼워 넣은 배열 받기.
    // reduce는 왼쪽(첫 인덱스)부터 오른쪽(끝 인덱스)까지를 순환합니다.
    const result = childArray.reduce<React.ReactNode[]>((prev, cur, curIndex) => {
        if(curIndex === 0) {
            return [cur];
        }

        // prev spread 연산자로 나열.
        // prev는 무조건 배열(정확히는 ReactNode[])입니다.
        // 이전 끼워둔 배열을 다시 가져와 앞에 배치한다 볼 수 있습니다.
        return [...prev, <hr className={clsx("between", props.hrClassName)} key={curIndex} />, cur];
    }, []);

    return (
        <>
            {result}
        </>
    );
}