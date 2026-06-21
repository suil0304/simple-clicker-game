// 다른 개인 프로젝트에서 가져온 유틸.

// 어떤 시간들이 들어갈지 정의.
export type Times = {
    milliSecond:number;
    second:number;
    minute:number;
    hour:number;
    day:number;
    week:number;
    month:number;
    year:number;
}

// Optional.
export type TimeOptions = Partial<Times>;

// 어떤 시간이 유지될지 정하는 옵션 정의.
export type TimeKeepOptions = {
    keepMilli?:boolean;
    keepSecond?:boolean;
    keepMinute?:boolean;
    keepHour?:boolean;
    keepDay?:boolean;
    keepWeek?:boolean;
    keepMonth?:boolean;
    keepYear?:boolean;
}

// 개인 프로젝트에서는 번역 시스템을 구현해 존재하는 타입이나, 여기에서는 한국어 고정이기 때문에 되려 공간만 소모.
// 그러나 유지하였습니다.
type _Unit = {
    unit:string;
    value:number;
}

// 포맷 모드 정의.
type _Mode = "full" | "auto" | "full-zero-trailing" | "zero-trailing-without-milli" | "last-second-only";

export namespace DurationUtil {
    const DEFAULT_TIME_KEEP_OPTIONS:TimeKeepOptions = {
        keepMilli: false,
        keepSecond: true,
        keepMinute: true,
        keepHour: true,
        keepDay: true,
        keepWeek: false,
        keepMonth: false,
        keepYear: false
    };

    // 얼마를 곱해야 해당 시간이 되는지에 대한 상수.
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MONTH = DAY * 30;
    const YEAR = DAY * 365;

    // auto
    // 밀리초를 받아 자동 계산하는 함수.
    export function getAutoDurationsByMilli(ms:number, keepOptions:TimeKeepOptions = DEFAULT_TIME_KEEP_OPTIONS):Times {
        let _ms = ms;

        let year = 0;
        if(keepOptions.keepYear ?? DEFAULT_TIME_KEEP_OPTIONS.keepYear!) {
            year = Math.floor(_ms / YEAR);
            _ms %= YEAR;
        }

        let month = 0;
        if(keepOptions.keepMonth ?? DEFAULT_TIME_KEEP_OPTIONS.keepMonth!) {
            month = Math.floor(_ms / MONTH);
            _ms %= MONTH;
        }

        let week = 0;
        if(keepOptions.keepWeek ?? DEFAULT_TIME_KEEP_OPTIONS.keepWeek!) {
            week = Math.floor(_ms / WEEK);
            _ms %= WEEK;
        }

        let day = 0;
        if(keepOptions.keepDay ?? DEFAULT_TIME_KEEP_OPTIONS.keepDay!) {
            day = Math.floor(_ms / DAY);
            _ms %= DAY;
        }

        let hour = 0;
        if(keepOptions.keepHour ?? DEFAULT_TIME_KEEP_OPTIONS.keepHour!) {
            hour = Math.floor(_ms / HOUR);
            _ms %= HOUR;
        }

        let minute = 0;
        if(keepOptions.keepMinute ?? DEFAULT_TIME_KEEP_OPTIONS.keepMinute!) {
            minute = Math.floor(_ms / MINUTE);
            _ms %= MINUTE;
        }

        let second = 0;
        if(keepOptions.keepSecond ?? DEFAULT_TIME_KEEP_OPTIONS.keepSecond!) {
            second = Math.floor(_ms / SECOND);
            _ms %= SECOND;
        }

        return {
            milliSecond: (keepOptions.keepMilli ?? DEFAULT_TIME_KEEP_OPTIONS.keepMilli!) ? _ms : 0,
            second: second,
            minute: minute,
            hour: hour,
            day: day,
            week: week,
            month: month,
            year: year
        };
    }

    // 포맷까지 자동으로 해주는 함수.
    export function getAutoStringByMilli(
        ms:number,
        keepOptions:TimeKeepOptions = DEFAULT_TIME_KEEP_OPTIONS,
        mode:_Mode = "auto"
    ):string {

        const times = getAutoDurationsByMilli(ms, keepOptions);
        return formatAutoString(times, mode);
    }

    // 포맷만 해주는 함수.
    export function formatAutoString(times:TimeOptions, mode:_Mode = "auto"):string {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        const units:_Unit[] = [
            {
                unit: "년",
                value: year
            },
            {
                unit: "개월",
                value: month
            },
            {
                unit: "주",
                value: week
            },
            {
                unit: "일",
                value: day
            },
            {
                unit: "시간",
                value: hour
            },
            {
                unit: "분",
                value: minute
            },
            {
                unit: "초",
                value: second
            },
            {
                unit: "밀리초",
                value: milliSecond
            }
        ];

        return _formatDuration(units, mode);
    }

    // 포맷을 위한 함수.
    function _formatDuration(units:_Unit[], mode:_Mode):string {
        const result:string[] = [];
        // full의 경우, 0초가 되었든 무조건 넣습니다.
        if(mode === "full") {
            for(let i = 0; i < units.length; i++) {
                const curUnit = units[i];
                result.push(`${curUnit!.value}${curUnit!.unit}`);
            }

            return result.join(" ");
        }

        let startIndex:number = units.findIndex(unit => unit.value !== 0);

        if(startIndex === -1) {
            const second = units[units.length - 2];
            return `${second!.value}${second!.unit}`;
        }
        
        switch(mode) {
            // auto의 경우 0이 아닌 시간만 넣습니다.
            case "auto":
                for(let i = startIndex; i < units.length; i++) {
                    const curUnit = units[i];
                    const isLast = i + 1 === units.length;

                    if(curUnit!.value !== 0) {
                        result.push(`${curUnit!.value}${curUnit!.unit}`);
                    }

                    if(isLast) {
                        continue;
                    }
                }
                break;

            // 첫 0이 아닌 시간 이후로 0이 있든 없든 넣습니다.
            case "full-zero-trailing":
                for(let i = startIndex; i < units.length; i++) {
                    const curUnit = units[i];
                    result.push(`${curUnit!.value}${curUnit!.unit}`);
                }
                break;

            // 위의 경우에서 밀리초는 제외합니다.
            case "zero-trailing-without-milli":
                for(let i = startIndex; i < units.length; i++) {
                    const curUnit = units[i];
                    const isLast = i + 1 === units.length;

                    if(!isLast || curUnit!.value !== 0) {
                        result.push(`${curUnit!.value}${curUnit!.unit}`);
                    }
                }
                break;

            // 0이 아닌 경우를 모두 거른 후 마지막이 초만 남도록 조정합니다.
            case "last-second-only":
                for(let i = 0; i < units.length - 2; i++) {
                    const curUnit = units[i];

                    if(curUnit!.value !== 0) {
                        result.push(`${curUnit!.value}${curUnit!.unit}`);
                    }
                }

                const second = units[units.length - 2];
                result.push(`${second!.value}${second!.unit}`);
                break;
        }

        return result.join(" ");
    }

    // only
    // 해당 시간에 대한 문자열 생성.
    export function getOnlyMilli(times:TimeOptions):string {
        return `${calcMilli(times)}밀리초`;
    }

    export function getOnlySecond(times:TimeOptions):string {
        return `${calcSecond(times)}초`;
    }

    export function getOnlyMinute(times:TimeOptions):string {
        return `${calcMinute(times)}분`;
    }

    export function getOnlyHour(times:TimeOptions):string {
        return `${calcHour(times)}시간`;
    }

    export function getOnlyDay(times:TimeOptions):string {
        return `${calcDay(times)}일`;
    }

    export function getOnlyWeek(times:TimeOptions):string {
        return `${calcWeek(times)}주`;
    }

    export function getOnlyMonth(times:TimeOptions):string {
        return `${calcMonth(times)}개월`;
    }

    export function getOnlyYear(times:TimeOptions):string {
        return `${calcYear(times)}년`;
    }

    // calculate
    // 시간 계산기.
    export function calcMilli(times:TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let milliSecondNumber:number = milliSecond;
        milliSecondNumber += second * 1000;
        milliSecondNumber += minute * 1000 * 60;
        milliSecondNumber += hour * 1000 * 60 * 60;
        milliSecondNumber += day * 1000 * 60 * 60 * 24;
        milliSecondNumber += week * 1000 * 60 * 60 * 24 * 7;
        milliSecondNumber += month * 1000 * 60 * 60 * 24 * 30;
        milliSecondNumber += year * 1000 * 60 * 60 * 24 * 365;

        return milliSecondNumber;
    }

    export function calcSecond(times:TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let secondNumber:number = second;
        secondNumber += milliSecond / 1000;
        secondNumber += minute * 60;
        secondNumber += hour * 60 * 60;
        secondNumber += day * 60 * 60 * 24;
        secondNumber += week * 60 * 60 * 24 * 7;
        secondNumber += month * 60 * 60 * 24 * 30;
        secondNumber += year * 60 * 60 * 24 * 365;

        return secondNumber;
    }

    export function calcMinute(times:TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let minuteNumber:number = minute;
        minuteNumber += milliSecond / 1000 / 60;
        minuteNumber += second / 60;
        minuteNumber += hour * 60;
        minuteNumber += day * 60 * 24;
        minuteNumber += week * 60 * 24 * 7;
        minuteNumber += month * 60 * 24 * 30;
        minuteNumber += year * 60 * 24 * 365;

        return minuteNumber;
    }

    export function calcHour(times: TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let hourNumber:number = hour;
        hourNumber += milliSecond / 1000 / 60 / 60;
        hourNumber += second / 60 / 60;
        hourNumber += minute / 60;
        hourNumber += day * 24;
        hourNumber += week * 24 * 7;
        hourNumber += month * 24 * 30;
        hourNumber += year * 24 * 365;

        return hourNumber;
    }

    export function calcDay(times: TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let dayNumber:number = day;
        dayNumber += milliSecond / 1000 / 60 / 60 / 24;
        dayNumber += second / 60 / 60 / 24;
        dayNumber += minute / 60 / 24;
        dayNumber += hour / 24;
        dayNumber += week * 7;
        dayNumber += month * 30;
        dayNumber += year * 365;

        return dayNumber;
    }

    export function calcWeek(times: TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let weekNumber:number = week;
        weekNumber += milliSecond / 1000 / 60 / 60 / 24 / 7;
        weekNumber += second / 60 / 60 / 24 / 7;
        weekNumber += minute / 60 / 24 / 7;
        weekNumber += hour / 24 / 7;
        weekNumber += day / 7;
        weekNumber += (month * 30) / 7;
        weekNumber += (year * 365) / 7;

        return weekNumber;
    }

    export function calcMonth(times: TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let monthNumber:number = month;
        monthNumber += milliSecond / 1000 / 60 / 60 / 24 / 30;
        monthNumber += second / 60 / 60 / 24 / 30;
        monthNumber += minute / 60 / 24 / 30;
        monthNumber += hour / 24 / 30;
        monthNumber += day / 30;
        monthNumber += (week * 7) / 30;
        monthNumber += (year * 365) / 30;

        return monthNumber;
    }

    export function calcYear(times: TimeOptions):number {
        const milliSecond = times.milliSecond ?? 0;
        const second = times.second ?? 0;
        const minute = times.minute ?? 0;
        const hour = times.hour ?? 0;
        const day = times.day ?? 0;
        const week = times.week ?? 0;
        const month = times.month ?? 0;
        const year = times.year ?? 0;

        let yearNumber:number = year;
        yearNumber += milliSecond / 1000 / 60 / 60 / 24 / 365;
        yearNumber += second / 60 / 60 / 24 / 365;
        yearNumber += minute / 60 / 24 / 365;
        yearNumber += hour / 24 / 365;
        yearNumber += day / 365;
        yearNumber += (week * 7) / 365;
        yearNumber += (month * 30) / 365;

        return yearNumber;
    }
}