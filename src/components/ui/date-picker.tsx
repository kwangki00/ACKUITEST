import * as React from "react";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { CalendarMonth } from "@/components/ui/calendar";
import { CalendarUnitGrid } from "@/components/ui/calendar-unit";
import {
  addDays,
  addMonths,
  addYears,
  clamp,
  formatByPrecision,
  formatDigitsByPrecision,
  isDisabled,
  parseByPrecision,
  PRECISION_DIGITS,
  startOfDay,
  startOfMonth,
  startOfUnit,
  toDigits,
  type DatePrecision,
} from "@/lib/date";

/**
 * Figma: DatePickerPanel — Mode=Single · Confirm=False · Precision=Day
 *
 * 달력 하나 + 푸터입니다. 반경 12 · 테두리 `Cal/Border` 로, 떠 있는 패널 중
 * **혼자 큽니다** — Popover 계열(6)보다 크고 Card·Dialog(8)보다도 큽니다.
 * Figma 가 그렇게 정의해 두었습니다.
 *
 * `precision` 으로 Figma 의 Precision 축을 탑니다 — `day` 는 달력,
 * `month` · `year` 는 3×4 그리드(`CalendarUnitGrid`)입니다.
 *
 * `Confirm=True`(취소·선택 버튼)는 두지 않았습니다. Figma 문서가 그렇게 권합니다 —
 * *"Single 모드는 False 를 권장합니다. 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다."*
 * 범위는 반대로 확인 버튼이 있습니다 (`DateRangePicker`).
 */

export interface DatePickerPanelProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect: (date: Date) => void;
  /** 고르는 단위. day 는 달력, month·year 는 3×4 그리드입니다. */
  precision?: DatePrecision;
  min?: Date;
  max?: Date;
  /** 값을 비웁니다. 필수 항목에는 넘기지 마세요 — 지울 수 없는데 버튼만 생깁니다. */
  onClear?: () => void;
  className?: string;
}

export function DatePickerPanel({
  month,
  onMonthChange,
  selected,
  onSelect,
  precision = "day",
  min,
  max,
  onClear,
  className,
}: DatePickerPanelProps) {
  const today = startOfDay(new Date());
  const todayBlocked = isDisabled(today, min, max);

  return (
    <div className={cn("w-fit", className)}>
      {precision === "day" ? (
        <CalendarMonth
          month={month}
          onMonthChange={onMonthChange}
          selected={selected}
          onSelect={onSelect}
          min={min}
          max={max}
        />
      ) : (
        <CalendarUnitGrid
          unit={precision}
          cursor={month}
          onCursorChange={onMonthChange}
          selected={selected}
          onSelect={onSelect}
          min={min}
          max={max}
        />
      )}

      {/* 둘 다 link 라 어느 쪽도 주 액션이 아닙니다 */}
      <div className="flex items-center justify-between border-t border-cal-border px-4 py-3">
        <Button
          variant="link"
          size="sm"
          onClick={() => onClear?.()}
          disabled={!onClear || !selected}
        >
          초기화
        </Button>
        {/*
          단일에서는 **오늘을 고릅니다** — "오늘로 이동"(달만 옮기기)이 아닙니다.

          값이 하나뿐이라 달만 옮겨봐야 결국 한 번 더 눌러야 하고, 이미 오늘이 있는
          달을 보고 있으면 눌러도 아무 반응이 없습니다. 단일에서 제일 자주 하는 일이
          "오늘로 맞추기" 라 한 번에 끝냅니다. 라벨도 그래서 "오늘" 입니다.

          범위는 반대로 달만 옮깁니다 — 거기서는 두 날짜를 골라야 해서
          오늘 하나를 넣어봐야 소용이 없습니다.
        */}
        <Button
          variant="link"
          size="sm"
          onClick={() => onSelect(startOfUnit(today, precision))}
          disabled={todayBlocked}
        >
          {precision === "year" ? "올해" : precision === "month" ? "이번 달" : "오늘"}
        </Button>
      </div>
    </div>
  );
}

/**
 * 완성형 — 입력창 + 패널입니다. **Figma 에 대응물이 없습니다** (`Select` 와 같은 사정).
 *
 * 트리거는 `Input` 입니다. 달력 버튼만 패널을 열고, **입력창은 직접 칠 수 있습니다** —
 * 2026-08-07 처럼 아는 날짜를 타이핑하는 편이 달력을 세 번 넘기는 것보다 빠릅니다.
 *
 * `PopoverTrigger` 가 아니라 `PopoverAnchor` 를 쓰는 이유 — Trigger 는 클릭을 토글로
 * 처리해서, 입력창을 눌러 커서를 옮기면 패널이 닫힙니다. Combobox 의 `editable` 과 같습니다.
 */

/**
 * 입력창의 **기본 폭**입니다 — 단위마다 다릅니다.
 *
 * 날짜는 자릿수가 정해져 있어 폭이 예측됩니다. 이 제품은 조회 화면이 대부분이라
 * **좁은 자리가 기본**이고, 폼 격자처럼 칸을 꽉 채우는 자리가 예외입니다.
 * 그래서 컴포넌트가 폭을 갖고, 채워야 할 때만 한 줄을 더 씁니다.
 *
 * ```tsx
 * <DatePicker … />                        // 값에 맞는 폭
 * <DatePicker className="w-full" … />     // 칸을 채웁니다
 * ```
 *
 * **`FormField` 격자에서는 `w-full` 을 잊지 마세요** — 안 주면 옆 칸은 꽉 찼는데
 * 날짜 칸만 짧아 줄이 어긋나 보입니다. tailwind-merge 가 기본 폭을 걷어냅니다.
 *
 * 필요한 폭 = 좌우 여백 24 + 글자 + 간격 8 + 우측 아이콘. 우측은 값이 있으면
 * 지우기 16 + 간격 4 + 달력 16 = **36**, 비어 있으면 달력 **16** 뿐이라
 * `day` 는 자리표시가, 월·연은 값이 폭을 정합니다 (Pretendard 14 실측 + 4).
 *
 * | | 값 | 자리표시 | 필요 | 기본 |
 * |---|---|---|---|---|
 * | day | 76 | 90 | 144 | **148** |
 * | month | 54 | 65 | 122 | **128** |
 * | year | 34 | 36 | 102 | **108** |
 *
 * ### `w-full` 과 `w-fit` 은 주는 대상이 다릅니다
 *
 * `DatePicker` 냐 `DateRangePicker` 냐로 갈리지 않습니다 — 둘 다 같은 규칙입니다.
 *
 * | 어디에 | 무슨 뜻 | 언제 |
 * |---|---|---|
 * | **컨트롤**에 `w-full` | 필드 **안에서** 칸을 채워라 | 격자 — 옆 칸과 폭을 맞출 때 |
 * | **`FormField`** 에 `w-fit` | 필드 **자체가** 내용만큼만 | 가로 나열 — 한 줄에 여러 필드 |
 * | 아무것도 안 줌 | 컨트롤은 기본 폭, 필드는 부모 폭 | 세로로 쌓는 보통 폼 |
 *
 * ```tsx
 * <FormField label="보고일"><DatePicker className="w-full" … /></FormField>   // 격자
 * <FormField label="보고일" className="w-fit"><DatePicker … /></FormField>    // 가로 나열
 * ```
 *
 * `FormField` 는 기본이 `w-full` 이라 `flex flex-wrap` 줄에 그냥 넣으면 항목마다
 * 100% 를 요구해 **한 줄에 하나씩 떨어집니다.**
 */
const PICKER_WIDTH: Record<DatePrecision, string> = {
  day: "w-37",
  month: "w-32",
  year: "w-27",
};

export interface DatePickerProps
  extends Omit<
    InputProps,
    // min·max 는 HTML input 에도 있지만 그쪽은 string|number 입니다. Date 로 덮어씁니다
    "value" | "onChange" | "defaultValue" | "trailingIcon" | "min" | "max"
  > {
  value?: Date | null;
  onValueChange: (date: Date | null) => void;
  /**
   * 고르는 단위. `month` · `year` 는 달력 대신 3×4 그리드가 뜨고,
   * 입력 자릿수도 6 · 4 로 줄어듭니다. 값은 그 단위의 **첫 날**입니다
   * (2026년 8월 → 2026-08-01).
   */
  precision?: DatePrecision;
  /** 고를 수 있는 가장 이른 날. 경계는 포함입니다. */
  min?: Date;
  /** 고를 수 있는 가장 늦은 날. 경계는 포함입니다. */
  max?: Date;
  /** 값이 없을 때 보여줄 문구. 비우면 형식에 맞춰 자동으로 붙습니다. */
  placeholder?: string;
}

/** 정밀도별 칸 배치. year 는 칸이 하나뿐이라 방향키가 늘 연도를 움직입니다. */
const SEGMENTS: Record<DatePrecision, { unit: "year" | "month" | "day"; sel: [number, number] }[]> = {
  day: [
    { unit: "year", sel: [0, 4] },
    { unit: "month", sel: [5, 7] },
    { unit: "day", sel: [8, 10] },
  ],
  month: [
    { unit: "year", sel: [0, 4] },
    { unit: "month", sel: [5, 7] },
  ],
  year: [{ unit: "year", sel: [0, 4] }],
};

/** 커서 위치로 칸을 고릅니다. 구분자 위는 앞 칸으로 칩니다. */
function segmentAt(pos: number, precision: DatePrecision) {
  const segs = SEGMENTS[precision];
  return segs.find((s) => pos <= s.sel[1]) ?? segs[segs.length - 1];
}

const PLACEHOLDER: Record<DatePrecision, string> = {
  day: "YYYY-MM-DD",
  month: "YYYY-MM",
  year: "YYYY",
};

export function DatePicker({
  value,
  onValueChange,
  precision = "day",
  min,
  max,
  placeholder,
  disabled,
  readOnly,
  className,
  onKeyDown,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(() => startOfMonth(value ?? new Date()));
  const size = PRECISION_DIGITS[precision];
  // 상태는 숫자만 담습니다. 화면의 구분자는 formatDigitsByPrecision 이 얹습니다
  const [digits, setDigits] = React.useState(() =>
    value ? formatByPrecision(value, precision).replace(/\D/g, "") : ""
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 밖에서 값이 바뀌면 글자와 보고 있는 달을 맞춥니다 (빠른 선택 · 폼 초기화).
  // 날짜가 실제로 달라졌을 때만입니다 — value 를 통째로 지켜보면 부모가
  // 매 렌더 새 Date 를 만드는 순간 타이핑이 되돌려집니다
  const valueKey = value?.getTime();
  React.useEffect(() => {
    setDigits(value ? formatByPrecision(value, precision).replace(/\D/g, "") : "");
    if (value) setMonth(startOfMonth(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueKey, precision]);

  const commit = (raw: string) => {
    const d = toDigits(raw, size);
    setDigits(d);

    if (d === "") {
      onValueChange(null);
      return;
    }
    // 다 채우기 전에는 아직 날짜가 아닙니다 —
    // 2022 만 쳤는데 2022-01-01 로 잡아버리면 다 치기도 전에 값이 바뀝니다
    if (d.length < size) return;

    const parsed = parseByPrecision(d, precision);
    if (parsed && !isDisabled(parsed, min, max)) {
      onValueChange(parsed);
      setMonth(startOfMonth(parsed));
    }
  };

  const clear = () => {
    setDigits("");
    onValueChange(null);
    inputRef.current?.focus();
  };

  // 값이 바뀌면 input 의 글자가 갈리면서 커서가 끝으로 튑니다.
  // 오르내린 칸을 다시 선택해 두려고 렌더 직후에 되돌립니다
  const pendingSel = React.useRef<[number, number] | null>(null);
  React.useLayoutEffect(() => {
    const sel = pendingSel.current;
    if (!sel || !inputRef.current) return;
    inputRef.current.setSelectionRange(sel[0], sel[1]);
    pendingSel.current = null;
  });

  /**
   * 위·아래로 커서가 놓인 칸만 오르내립니다 — 년에 있으면 년, 월에 있으면 월.
   *
   * 말일은 잘립니다. 1월 31일에서 월을 올리면 3월 3일이 아니라 2월 28일입니다
   * (`addMonths` 가 처리합니다). 2월 29일에서 년을 올리면 2월 28일입니다.
   *
   * 값이 아직 없으면 오늘부터 시작합니다 — 빈 칸에서 아래를 눌렀는데
   * 아무 일도 없으면 무엇을 해야 할지 알 수 없습니다.
   */
  const step = (e: React.KeyboardEvent<HTMLInputElement>, dir: 1 | -1) => {
    e.preventDefault();
    const el = e.currentTarget;
    const seg = segmentAt(el.selectionStart ?? 0, precision);
    const base = value ?? startOfUnit(new Date(), precision);
    const next =
      seg.unit === "year"
        ? addYears(base, dir)
        : seg.unit === "month"
          ? addMonths(base, dir)
          : addDays(base, dir);

    const target = clamp(next, min, max);
    onValueChange(target);
    // 글자도 같은 렌더에서 함께 갱신합니다.
    // 부모가 value 를 바꿔 오기를 기다리면(useEffect) 커서를 되돌린 **뒤에**
    // 글자가 갈려서 다시 맨 뒤로 튑니다. 한 번에 끝내야 커서가 제자리에 남습니다
    setDigits(formatByPrecision(target, precision).replace(/\D/g, ""));
    setMonth(startOfMonth(target));

    pendingSel.current = seg.sel;
    // 경계에 걸려 값이 그대로면 다시 렌더되지 않습니다 — 그때는 지금 맞춥니다
    el.setSelectionRange(seg.sel[0], seg.sel[1]);
  };

  const pick = (d: Date) => {
    onValueChange(d);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          {...props}
          ref={inputRef}
          value={formatDigitsByPrecision(digits, precision)}
          onChange={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || readOnly || disabled) return;
            if (e.key === "ArrowUp") step(e, 1);
            else if (e.key === "ArrowDown") step(e, -1);
          }}
          onBlur={() => {
            // 여덟 자리를 못 채웠거나 없는 날짜면 되돌립니다 —
            // 화면의 글자와 실제 값이 다른 채로 두면 조회 결과가 설명되지 않습니다
            if (digits === "") return;
            const parsed = parseByPrecision(digits, precision);
            if (!parsed || isDisabled(parsed, min, max)) {
              setDigits(value ? formatByPrecision(value, precision).replace(/\D/g, "") : "");
            }
          }}
          placeholder={placeholder ?? PLACEHOLDER[precision]}
          disabled={disabled}
          readOnly={readOnly}
          inputMode="numeric"
          // 지우기는 Input 것을 끄고 달력 버튼과 한 묶음으로 답니다 —
          // 기본 자리(가장 바깥)에 두면 달력 버튼이 안쪽으로 밀려
          // 늘 같은 자리에 있어야 할 것이 값 유무에 따라 움직입니다
          clearable={false}
          className={cn(PICKER_WIDTH[precision], className)}
          trailingIcon={
            <span className="flex items-center gap-1">
              {digits !== "" && !disabled && !readOnly && (
                <button
                  type="button"
                  aria-label="날짜 지우기"
                  onClick={clear}
                  className={cn(
                    "grid place-items-center rounded-xs text-icon-muted-foreground",
                    "hover:text-text-basic focus-visible:ring-2 focus-visible:ring-action-focus-ring",
                    "focus-visible:outline-hidden"
                  )}
                >
                  <X />
                </button>
              )}
              <button
                type="button"
                aria-label="달력 열기"
                aria-expanded={open}
                disabled={disabled || readOnly}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                  "grid place-items-center rounded-xs text-icon-muted-foreground",
                  "hover:text-text-basic focus-visible:ring-2 focus-visible:ring-action-focus-ring",
                  "focus-visible:outline-hidden disabled:pointer-events-none"
                )}
              >
                <Calendar />
              </button>
            </span>
          }
        />
      </PopoverAnchor>

      <PopoverContent
        type="content"
        align="start"
        className="w-auto rounded-xl border-cal-border p-0"
        // 커서를 입력창에 남깁니다 — 열자마자 달력이 포커스를 가져가면
        // 타이핑하던 사람이 흐름을 잃습니다. 달력은 Tab 으로 갑니다
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DatePickerPanel
          month={month}
          onMonthChange={setMonth}
          selected={value}
          onSelect={pick}
          precision={precision}
          min={min}
          max={max}
          onClear={() => onValueChange(null)}
        />
      </PopoverContent>
    </Popover>
  );
}
