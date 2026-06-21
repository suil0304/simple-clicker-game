import { createContext, useContext, useMemo, useRef, type JSX, type PropsWithChildren } from "react";
import type { ClickData } from "../../apis/types/stats";
import type { ResetableContext } from "../../types/ResetableContext";

export interface DataContext extends ResetableContext {
    totalClickAddGold:number;
    readonly clickDatas:ClickData[];
}
const DataContext = createContext<DataContext | null>(null);

export function Data(props:PropsWithChildren):JSX.Element {
    const {
        totalClickAddGoldRef,
        clickDatasRef
    } = useData();

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

    return (
        <DataContext.Provider value={dataContext}>
            {props.children}
        </DataContext.Provider>
    );
}

function useData() {
    const totalClickAddGoldRef = useRef(0);
    const clickDatasRef = useRef<ClickData[]>([]);

    return {
        totalClickAddGoldRef,
        clickDatasRef
    };
}

export function useDataContext():DataContext {
    const dataContext = useContext(DataContext);
    if(!dataContext) {
        throw new Error("\"DataContext\"는 \"Game\" 안에서만 사용 가능합니다.");
    }

    return dataContext;
}