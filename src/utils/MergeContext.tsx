import type { JSX, PropsWithChildren } from "react";
import React from "react";

// 어떤 것이 Context 제공자 함수인지 정의.
type ContextFunc = (props:PropsWithChildren) => JSX.Element;
// context와 props를 매칭해 인자로써 넣습니다.
interface MergeContextProps {
    contexts:ContextFunc[];
    contextProps?:object[];
    children:React.ReactNode;
};
// Context 합성기.
export function MergeContext(props:MergeContextProps) {
    const contextProps = props.contextProps ?? [];
    // reduceRight - 가장 끝에서 시작하여 첫 인덱스까지 순환하는 함수.
    // props.children이 들어간 자리는 initalValue로, 가장 끝(-> 맨 처음)의 prev는 props.children이 됩니다.
    const result = props.contexts.reduceRight((prev, Provider, index) => {
        // 요소 클론.
        // 제공자 안에 prev를 넣어 겹겹히 쌓습니다.
        // JS/TS의 경우, 배열에 없는 인덱스를 접근 시 에러 반환이 아닌 undefined를 반환하기 때문에 Nullish 병합 연산자를 사용하기 좋습니다.
        return React.cloneElement(<Provider />, contextProps[index] ?? {}, prev);
    }, props.children);

    return result;
}