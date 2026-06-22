import { createContext, useContext, useMemo, useRef, type JSX, type PropsWithChildren } from "react";
import type { ClickData } from "../../apis/types/stats";
import type { ResetableContext } from "../../types/ResetableContext";

// DataContext는 다음과 같아야 한다는 제약 interface.
export interface DataContext extends ResetableContext {
    totalClickAddGold:number;
    readonly clickDatas:ClickData[];
}
const DataContext = createContext<DataContext | null>(null);

// DataContext 제공자.
export function Data(props:PropsWithChildren):JSX.Element {
    const {
        totalClickAddGoldRef,
        clickDatasRef
    } = useData();

    // DataContext 제공자에 넣어 제공될 객체.
    const dataContext:DataContext = useMemo(() => {
        return {
            get totalClickAddGold() {
                return totalClickAddGoldRef.current;
            },
            set totalClickAddGold(v) {
                totalClickAddGoldRef.current = v;
            },
            get clickDatas() {
                return clickDatasRef.current;
            },
            reset() {
                totalClickAddGoldRef.current = 0;
                clickDatasRef.current.length = 0;
            },
        };
    }, []);

    // DataContext 제공자에 dataContext 넣기.
    return (
        <DataContext.Provider value={dataContext}>
            {props.children}
        </DataContext.Provider>
    );
}

// 커스텀 훅 정의.
function useData() {
    const totalClickAddGoldRef = useRef(0);
    const clickDatasRef = useRef<ClickData[]>([]);

    return {
        totalClickAddGoldRef,
        clickDatasRef
    };
}

// DataContext를 가져오는 커스텀 훅.
export function useDataContext():DataContext {
    const dataContext = useContext(DataContext);
    if(!dataContext) {
        throw new Error("\"DataContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return dataContext;
}