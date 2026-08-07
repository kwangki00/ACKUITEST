import * as React from "react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import {
  addDays,
  addMonths,
  clamp,
  isDisabled as outOfRange,
  isSameDay,
  isSameMonth,
  monthGrid,
  startOfDay,
  startOfMonth,
  weekdayLabels,
} from "@/lib/date";

/**
 * Figma: CalendarCell (9 변형 — State 9)
 *
 * 날짜 한 칸입니다. **셀 36 · 안쪽 원 32** — 원이 셀보다 작아야
 * 범위 배경(셀 전체)과 선택 표시(원)가 겹쳐도 서로 먹지 않습니다.
 *
 * | State | 무엇 |
 * |---|---|
 * | Default · Hover | 원 배경만 |
 * | **Today** | 원은 비우고 **날짜 아래 4px 점**. 원을 쓰면 Selected 와 헷갈립니다 |
 * | Selected | 원 채움 + 흰 글자 |
 * | Range-Start · Middle · End | 셀 배경이 이어지고 양 끝만 원 |
 * | Outside | 이전·다음 달. 누를 수는 있고 흐리게만 |
 *
 * 오늘이면서 선택된 날은 **Selected 가 이깁니다** — 선택 표시가 더 중요하고
 * 점까지 겹치면 시끄럽습니다.
 */

export type CellState = "default" | "today" | "selected" | "disabled" | "outside";

export interface CalendarCellProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  date: Date;
  state?: CellState;
  /** 일요일은 빨강입니다 (Cal/Text-Weekend). 토요일은 평일과 같습니다. */
  weekend?: boolean;
}

export const CalendarCell = React.forwardRef<HTMLButtonElement, CalendarCellProps>(
  ({ date, state = "default", weekend, className, ...props }, ref) => {
    const selected = state === "selected";
    const disabled = state === "disabled";

    return (
      <button
        ref={ref}
        type="button"
        role="gridcell"
        aria-selected={selected}
        aria-current={state === "today" ? "date" : undefined}
        disabled={disabled}
        tabIndex={-1}
        className={cn(
          // 셀은 배경을 갖지 않습니다 — 범위 띠가 여기에 깔릴 자리입니다
          "relative grid size-[var(--h-calendar-cell)] shrink-0 place-items-center",
          "outline-hidden disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {/* 안쪽 원 32 — hover·selected 가 여기에 칠해집니다 */}
        <span
          className={cn(
            "grid size-8 place-items-center rounded-full text-sm transition-colors",
            selected
              ? "bg-cal-cell-selected font-medium text-cal-text-selected"
              : disabled
                ? "text-cal-text-disabled"
                : state === "outside"
                  ? "text-cal-text-outside hover:bg-cal-cell-hover"
                  : cn(
                      weekend ? "text-cal-text-weekend" : "text-cal-text",
                      // 오늘은 점만으로는 눈에 덜 들어와서 글자도 한 단계 굵힙니다
                      state === "today" && "font-semibold",
                      "hover:bg-cal-cell-hover"
                    )
          )}
        >
          {date.getDate()}
        </span>

        {/* 오늘 표시 — 날짜 **위** 4px 점입니다 (Figma 도 y=4).
            선택되면 숨깁니다. 원과 점이 겹치면 무엇이 선택인지 흐려집니다 */}
        {state === "today" && (
          <span aria-hidden className="absolute top-1 size-1 rounded-full bg-cal-cell-selected" />
        )}
      </button>
    );
  }
);
CalendarCell.displayName = "CalendarCell";

/**
 * Figma: CalendarMonth (2 변형 — Selection 2)
 *
 * 한 달 달력입니다. 년·월 Select + 요일 머리글 + 날짜 그리드.
 *
 * **그리드는 6주(42칸) 고정**입니다. 필요한 주만 그리면 달을 넘길 때마다
 * 패널 높이가 들썩이고, 팝오버 안에서는 아래 버튼이 손가락 밑에서 움직입니다.
 * Figma 가 5주인 것은 대표값입니다 (description 에도 배치는 코드가 정한다고 적혀 있습니다).
 *
 * 키보드 — 방향키로 하루씩, PageUp·PageDown 으로 한 달씩, Home·End 로 주의 처음·끝.
 * 그리드 전체가 탭 정지 하나입니다 (칸마다 멈추면 42번 눌러야 다음으로 갑니다).
 */

export interface CalendarMonthProps {
  /** 보고 있는 달. 1일로 정규화해서 다룹니다. */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** 년 Select 에 채울 범위. 기본은 보고 있는 해 ±10 입니다. */
  yearRange?: [number, number];
  className?: string;
}

export function CalendarMonth({
  month,
  onMonthChange,
  selected,
  onSelect,
  min,
  max,
  yearRange,
  className,
}: CalendarMonthProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const days = React.useMemo(() => monthGrid(month), [month]);
  const labels = weekdayLabels();

  // 방향키가 짚고 있는 날. 열릴 때는 선택값, 없으면 오늘, 그것도 이 달이 아니면 1일
  const [focused, setFocused] = React.useState<Date>(() => {
    if (selected && isSameMonth(selected, month)) return selected;
    if (isSameMonth(today, month)) return today;
    return startOfMonth(month);
  });

  // 달이 바뀌면 짚는 자리도 그 달로 옮깁니다 — 안 그러면 화면 밖을 짚습니다
  React.useEffect(() => {
    setFocused((prev) => (isSameMonth(prev, month) ? prev : startOfMonth(month)));
  }, [month]);

  const gridRef = React.useRef<HTMLDivElement>(null);

  const move = (next: Date) => {
    const target = clamp(next, min, max);
    setFocused(target);
    if (!isSameMonth(target, month)) onMonthChange(startOfMonth(target));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    const map: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (key in map) {
      e.preventDefault();
      move(addDays(focused, map[key]));
    } else if (key === "PageUp" || key === "PageDown") {
      e.preventDefault();
      move(addMonths(focused, key === "PageUp" ? -1 : 1));
    } else if (key === "Home" || key === "End") {
      e.preventDefault();
      const delta = key === "Home" ? -focused.getDay() : 6 - focused.getDay();
      move(addDays(focused, delta));
    } else if (key === "Enter" || key === " ") {
      e.preventDefault();
      if (!outOfRange(focused, min, max)) onSelect(focused);
    }
  };

  // 포커스가 그리드 안에 있을 때만 짚은 칸을 실제로 포커스합니다 —
  // 아무 데서나 옮기면 패널 밖에 있던 커서를 빼앗습니다
  React.useEffect(() => {
    const el = gridRef.current;
    if (!el || !el.contains(document.activeElement) || el === document.activeElement) return;
    const btn = el.querySelector<HTMLButtonElement>('[data-focused="true"]');
    btn?.focus();
  }, [focused]);

  const year = month.getFullYear();
  const [minYear, maxYear] = yearRange ?? [year - 10, year + 10];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const stateOf = (d: Date): CellState => {
    if (outOfRange(d, min, max)) return "disabled";
    if (isSameDay(d, selected)) return "selected";
    if (!isSameMonth(d, month)) return "outside";
    if (isSameDay(d, today)) return "today";
    return "default";
  };

  return (
    <div className={cn("flex w-fit flex-col gap-3 p-2", className)}>
      {/*
        년·월은 Select 입니다 — 화살표만 있으면 먼 달로 갈 때 수십 번 눌러야 합니다.
        Figma 도 SelectTrigger(Size=sm · Render=Text) 를 씁니다.

        NativeSelect 가 아닌 이유 — 목록을 OS 가 그려서 달력 안에서 혼자 다른 모양이 됩니다.
        패널 안에 패널이 겹치는 구조라 Radix 가 레이어를 쌓아 처리합니다 (안쪽을 닫아도
        달력은 열려 있습니다).
      */}
      <div className="flex gap-2">
        <Select
          size="sm"
          aria-label="연도"
          options={years.map((y) => ({ value: String(y), label: `${y}년` }))}
          value={String(year)}
          onValueChange={(v) => onMonthChange(new Date(Number(v), month.getMonth(), 1))}
          className="flex-1"
        />
        <Select
          size="sm"
          aria-label="월"
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i),
            label: `${i + 1}월`,
          }))}
          value={String(month.getMonth())}
          onValueChange={(v) => onMonthChange(new Date(year, Number(v), 1))}
          className="flex-1"
        />
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`${year}년 ${month.getMonth() + 1}월`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(e) => {
          // 그리드 자체가 포커스를 받으면 짚고 있던 칸으로 넘깁니다
          if (e.target === e.currentTarget) {
            e.currentTarget
              .querySelector<HTMLButtonElement>('[data-focused="true"]')
              ?.focus();
          }
        }}
        className="outline-hidden focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-action-focus-ring"
      >
        <div role="row" className="flex">
          {labels.map((w, i) => (
            <div
              key={w}
              role="columnheader"
              className={cn(
                "grid w-[var(--h-calendar-cell)] place-items-center py-0.5 text-xs font-medium",
                // 일요일만 빨강입니다. 토요일은 평일과 같습니다 — Figma 도 그렇습니다
                i === 0 ? "text-cal-text-weekend" : "text-cal-header-text"
              )}
            >
              {w}
            </div>
          ))}
        </div>

        {Array.from({ length: 6 }, (_, w) => (
          <div key={w} role="row" className="flex">
            {days.slice(w * 7, w * 7 + 7).map((d) => {
              const state = stateOf(d);
              return (
                <CalendarCell
                  key={d.getTime()}
                  date={d}
                  state={state}
                  weekend={d.getDay() === 0}
                  data-focused={isSameDay(d, focused)}
                  onClick={() => {
                    setFocused(d);
                    onSelect(d);
                  }}
                  aria-label={`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
