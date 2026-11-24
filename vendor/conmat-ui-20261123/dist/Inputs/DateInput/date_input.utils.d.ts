export interface CalendarDay {
    date: Date;
    outside: boolean;
    selected: boolean;
    today: boolean;
    disabled: boolean;
}
interface CalendarDaysOptions {
    viewDate: Date;
    selectedDate: Date | null;
    today: Date;
    minDate?: Date;
    maxDate?: Date;
}
interface DatePopoverPositionOptions {
    trigger: {
        left: number;
        top: number;
        bottom: number;
        width: number;
    };
    popover: {
        width: number;
        height: number;
    };
    viewport: {
        width: number;
        height: number;
    };
    gap: number;
    padding: number;
}
export interface DatePopoverPosition {
    left: number;
    top: number;
    placement: "top" | "bottom";
    maxHeight: number;
}
export declare function formatDateDisplay(date: Date | null): string;
export declare function formatDateValue(date: Date | null): string;
export declare function getCalendarDays({ viewDate, selectedDate, today, minDate, maxDate, }: CalendarDaysOptions): CalendarDay[];
export declare function getDatePopoverPosition({ trigger, popover, viewport, gap, padding, }: DatePopoverPositionOptions): DatePopoverPosition;
export {};
