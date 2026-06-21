import React, { useEffect } from "react";

// 이 괴상한 React 세계에서 use 없이 커스텀 훅에서 비동기를 사용할 수 있도록 해주는 커스텀 훅.
// 첫 번째와 두 번째 매개변수는 useEffect와 위치까지 같기 때문에 useEffect를 사용하는 감으로 사용할 수 있습니다.
export function useAsyncEffect(
    effect:(...args:unknown[]) => Promise<unknown>,
    deps?:React.DependencyList,
    cleanup?:() => void,
    args?:unknown[]
):void {
    useEffect(() => {
        // spread 연산자 + nullish 병합 연산자.
        effect(...(args ?? []));
        return cleanup;
    }, deps);
}