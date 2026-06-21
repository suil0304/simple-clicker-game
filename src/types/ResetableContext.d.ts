// 객체 구현 중 reset 함수를 무조건 지녀야 한다 강제하는 interface 제약.
export interface ResetableContext {
    readonly reset:() => void | Promise<void>;
}