import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { addYears, isSameMonth, isSameYear, startOfDay, yearGrid } from "@/lib/date";

/**
 * Figma: CalendarUnitCell (8 변형 — State 8)
 *
 * 월·연도 한 칸입니다. **76×40** — "7월" · "2026" 이 들어가야 해서
 * 날짜 칸(36)보다 넓습니다.
 *
 * 구조는 날짜 칸과 같습니다 — **셀 전체가 범위 띠**, 안쪽 pill 이 선택 표시.
 * 다만 안쪽이 원이 아니라 모서리 8 의 알약입니다.
 *
 * `Current` 는 이번 달·올해입니다. `CalendarCell` 의 Today 와 같은 역할로
 * **위쪽 4px 점**을 씁니다.
 */

export type UnitCellState =
  | "default"
  | "current"
  | "selected"
  | "disabled"
  | "range-start"
  | "range-middle"
  | "range-end";

const unitBand: Partial<Record<UnitCellState, string>> = {
  "range-start": "bg-cal-cell-range rounded-l-lg",
  "range-middle": "bg-cal-cell-range",
  "range-end": "bg-cal-cell-range rounded-r-lg",
};

export interface CalendarUnitCellProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  state?: UnitCellState;
}

export const CalendarUnitCell = React.forwardRef<HTMLButtonElement, CalendarUnitCellProps>(
  ({ state = "default", className, children, ...props }, ref) => {
    const disabled = state === "disabled";
    const filled = state === "selected" || state === "range-start" || state === "range-end";

    return (
      <button
        ref={ref}
        type="button"
        role="gridcell"
        aria-selected={filled}
        aria-current={state === "current" ? "date" : undefined}
        disabled={disabled}
        tabIndex={-1}
        className={cn(
          "relative grid h-[var(--h-calendar-unit)] flex-1 place-items-center",
          "outline-hidden disabled:pointer-events-none",
          unitBand[state],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "grid h-full w-full place-items-center rounded-lg text-sm transition-colors",
            filled
              ? "bg-cal-cell-selected font-medium text-cal-text-selected"
              : disabled
                ? "text-cal-text-disabled"
                : state === "range-middle"
                  ? "text-cal-text-range"
                  : cn("text-cal-text", state === "current" && "font-semibold", "hover:bg-cal-cell-hover")
          )}
        >
          {children}
        </span>

        {state === "current" && (
          <span aria-hidden className="absolute top-1 size-1 rounded-full bg-cal-cell-selected" />
        )}
      </button>
    );
  }
);
CalendarUnitCell.displayName = "CalendarUnitCell";

/**
 * Figma: CalendarUnitGrid (4 변형 — Unit 2 × Selection 2)
 *
 * 월·연도 그리드입니다. **3×4 배치로 12개**를 한 화면에 담습니다 —
 * 스크롤 없이 한 해가 통째로 보입니다.
 *
 * | Unit | 머리글 | 내용 |
 * |---|---|---|
 * | `month` | 연도 Select | 1~12월. 연도를 바꿔가며 고릅니다 |
 * | `year` | ‹ 2020 – 2031 › | 12년씩 넘깁니다 |
 *
 * 연도 시작점은 **12로 내림**합니다. 안 그러면 앞뒤로 넘길 때마다 경계가 달라져
 * 같은 해가 두 화면에 나옵니다.
 */

export type CalendarUnit = "month" | "year";

export interface CalendarUnitGridProps {
  unit: CalendarUnit;
  /** 보고 있는 자리. month 면 연도만, year 면 12년 구간을 정하는 데 씁니다. */
  cursor: Date;
  onCursorChange: (d: Date) => void;
  selected?: Date | null;
  range?: { start: Date | null; end: Date | null };
  preview?: Date | null;
  onSelect: (d: Date) => void;
  onPreviewChange?: (d: Date | null) => void;
  min?: Date;
  max?: Date;
  yearRange?: [number, number];
  className?: string;
}

export function CalendarUnitGrid({
  unit,
  cursor,
  onCursorChange,
  selected,
  range,
  preview,
  onSelect,
  onPreviewChange,
  min,
  max,
  yearRange,
  className,
}: CalendarUnitGridProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const year = cursor.getFullYear();

  // month 는 그 해의 1~12월, year 는 12년 묶음
  const items: Date[] = React.useMemo(
    () =>
      unit === "month"
        ? Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))
        : yearGrid(year).map((y) => new Date(y, 0, 1)),
    [unit, year]
  );

  const same = unit === "month" ? isSameMonth : isSameYear;

  /** 미리보기까지 반영한 범위. 뒤집혀 있으면 바로잡아 그립니다. */
  const effective = React.useMemo(() => {
    if (!range) return null;
    const { start, end } = range;
    if (start && !end && preview) {
      return preview < start ? { start: preview, end: start } : { start, end: preview };
    }
    if (start && end && start > end) return { start: end, end: start };
    return { start, end };
  }, [range, preview]);

  /** 경계 판정은 **단위 단위**로 합니다 — 7월 1일과 7월 31일은 같은 칸입니다. */
  const blocked = (d: Date) => {
    if (min && d < (unit === "month" ? new Date(min.getFullYear(), min.getMonth(), 1) : new Date(min.getFullYear(), 0, 1))) return true;
    if (max && d > max) return true;
    return false;
  };

  const stateOf = (d: Date): UnitCellState => {
    if (blocked(d)) return "disabled";

    if (effective) {
      const { start, end } = effective;
      if (start && end && same(start, end) && same(d, start)) return "selected";
      if (same(d, start)) return "range-start";
      if (same(d, end)) return "range-end";
      if (start && end && d > start && d < end) return "range-middle";
    }

    if (same(d, selected)) return "selected";
    if (same(d, today)) return "current";
    return "default";
  };

  const [minYear, maxYear] = yearRange ?? [year - 10, year + 10];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const span = unit === "year" ? [items[0].getFullYear(), items[11].getFullYear()] : null;

  return (
    <div className={cn("flex w-67 flex-col gap-3 p-2", className)}>
      {unit === "month" ? (
        <Select
          size="sm"
          aria-label="연도"
          options={years.map((y) => ({ value: String(y), label: `${y}년` }))}
          value={String(year)}
          onValueChange={(v) => onCursorChange(new Date(Number(v), cursor.getMonth(), 1))}
        />
      ) : (
        // 연도는 Select 로 고를 수 없습니다 — 고르려는 대상이 연도인데
        // 연도 Select 를 두면 같은 것을 두 번 고르게 됩니다
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="이전 12년"
            onClick={() => onCursorChange(addYears(cursor, -12))}
          >
            <ChevronLeft />
          </Button>
          <span className="flex-1 text-center text-sm font-medium text-cal-text">
            {span?.[0]} – {span?.[1]}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="다음 12년"
            onClick={() => onCursorChange(addYears(cursor, 12))}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <div role="grid" aria-label={unit === "month" ? `${year}년` : `${span?.[0]}–${span?.[1]}`}>
        {[0, 1, 2, 3].map((r) => (
          <div key={r} role="row" className="flex" onMouseLeave={() => onPreviewChange?.(null)}>
            {items.slice(r * 3, r * 3 + 3).map((d) => (
              <CalendarUnitCell
                key={d.getTime()}
                state={stateOf(d)}
                onClick={() => onSelect(d)}
                onMouseEnter={() => onPreviewChange?.(d)}
                aria-label={
                  unit === "month" ? `${d.getFullYear()}년 ${d.getMonth() + 1}월` : `${d.getFullYear()}년`
                }
              >
                {unit === "month" ? `${d.getMonth() + 1}월` : d.getFullYear()}
              </CalendarUnitCell>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
