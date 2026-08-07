import * as React from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { CalendarMonth } from "@/components/ui/calendar";
import {
  addDays,
  addMonths,
  clamp,
  formatDate,
  isDisabled,
  parseDate,
  startOfDay,
  startOfMonth,
} from "@/lib/date";

/**
 * Figma: DatePickerPanel — Mode=Single · Confirm=False · Precision=Day
 *
 * 달력 하나 + 푸터입니다. 반경 12 · 테두리 `Cal/Border` 로, 떠 있는 패널 중
 * **혼자 큽니다** — Popover 계열(6)보다 크고 Card·Dialog(8)보다도 큽니다.
 * Figma 가 그렇게 정의해 두었습니다.
 *
 * 아직 없는 축 —
 * `Mode=Range`(두 달 + DateRangeTabs + 빠른 선택), `Precision=Month·Year`(월·연 그리드),
 * `Confirm=True`(취소·선택 버튼). 단일 날짜부터 검증하고 그 위에 얹습니다.
 *
 * `Confirm` 을 아직 안 만든 이유는 Figma 문서가 그렇게 권하기 때문입니다 —
 * *"Single 모드는 False 를 권장합니다. 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다."*
 */

export interface DatePickerPanelProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect: (date: Date) => void;
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
  min,
  max,
  onClear,
  className,
}: DatePickerPanelProps) {
  const today = startOfDay(new Date());
  const todayBlocked = isDisabled(today, min, max);

  return (
    <div className={cn("w-fit", className)}>
      <CalendarMonth
        month={month}
        onMonthChange={onMonthChange}
        selected={selected}
        onSelect={onSelect}
        min={min}
        max={max}
      />

      {/* 좌측은 값을 되돌리는 동작, 우측은 자리를 옮기는 동작입니다.
          둘 다 link 라 같은 무게입니다 — 어느 쪽도 주 액션이 아닙니다 */}
      <div className="flex items-center justify-between border-t border-cal-border px-4 py-3">
        <Button
          variant="link"
          size="sm"
          onClick={() => onClear?.()}
          disabled={!onClear || !selected}
        >
          초기화
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => onMonthChange(startOfMonth(today))}
          disabled={todayBlocked}
        >
          오늘로 이동
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

export interface DatePickerProps
  extends Omit<
    InputProps,
    // min·max 는 HTML input 에도 있지만 그쪽은 string|number 입니다. Date 로 덮어씁니다
    "value" | "onChange" | "defaultValue" | "trailingIcon" | "min" | "max"
  > {
  value?: Date | null;
  onValueChange: (date: Date | null) => void;
  /** 고를 수 있는 가장 이른 날. 경계는 포함입니다. */
  min?: Date;
  /** 고를 수 있는 가장 늦은 날. 경계는 포함입니다. */
  max?: Date;
  /** 값이 없을 때 보여줄 문구. 형식을 알려주는 편이 낫습니다. */
  placeholder?: string;
}

/**
 * 숫자만 남기고 8자리로 자릅니다. `2022-12-12` 를 붙여넣어도 같은 결과입니다.
 * 문자를 치면 그냥 사라집니다 — 막는 것보다 조용히 걸러내는 편이 덜 성가십니다.
 */
function toDigits(s: string) {
  return s.replace(/\D/g, "").slice(0, 8);
}

/**
 * 숫자에 하이픈을 끼워 보여줍니다. `2022` → `2022`, `202212` → `2022-12`.
 *
 * 하이픈은 **표시일 뿐 상태가 아닙니다.** 그래서 하이픈 위에서 Backspace 를 눌러도
 * 지워질 것이 없어 멈추지 않고, 앞의 숫자가 지워집니다.
 */
function formatDigits(d: string) {
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

/**
 * 커서가 어느 칸에 있는지 — `2022-12-12` 에서 하이픈은 4·7 자리입니다.
 * 경계(하이픈 위)는 앞 칸으로 칩니다. 방금 친 칸을 계속 만지는 게 자연스럽습니다.
 */
function segmentAt(pos: number): "year" | "month" | "day" {
  if (pos <= 4) return "year";
  if (pos <= 7) return "month";
  return "day";
}

/** 칸별 선택 범위. 오르내린 뒤 그 칸을 통째로 선택해 두면 연달아 누를 수 있습니다. */
const SEGMENT_RANGE: Record<"year" | "month" | "day", [number, number]> = {
  year: [0, 4],
  month: [5, 7],
  day: [8, 10],
};

export function DatePicker({
  value,
  onValueChange,
  min,
  max,
  placeholder = "YYYY-MM-DD",
  disabled,
  readOnly,
  className,
  onKeyDown,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(() => startOfMonth(value ?? new Date()));
  // 상태는 숫자 8자리까지입니다. 화면의 하이픈은 formatDigits 가 얹습니다
  const [digits, setDigits] = React.useState(() => (value ? formatDate(value, "") : ""));
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 밖에서 값이 바뀌면 글자와 보고 있는 달을 맞춥니다 (빠른 선택 · 폼 초기화)
  React.useEffect(() => {
    setDigits(value ? formatDate(value, "") : "");
    if (value) setMonth(startOfMonth(value));
  }, [value]);

  const commit = (raw: string) => {
    const d = toDigits(raw);
    setDigits(d);

    if (d === "") {
      onValueChange(null);
      return;
    }
    // 여덟 자리를 채우기 전에는 아직 날짜가 아닙니다 —
    // 2022 만 쳤는데 2022-01-01 로 잡아버리면 다 치기도 전에 값이 바뀝니다
    if (d.length < 8) return;

    const parsed = parseDate(formatDigits(d));
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
    const seg = segmentAt(el.selectionStart ?? 0);
    const base = value ?? startOfDay(new Date());
    const next =
      seg === "year"
        ? addMonths(base, 12 * dir)
        : seg === "month"
          ? addMonths(base, dir)
          : addDays(base, dir);

    const target = clamp(next, min, max);
    onValueChange(target);
    // 글자도 같은 렌더에서 함께 갱신합니다.
    // 부모가 value 를 바꿔 오기를 기다리면(useEffect) 커서를 되돌린 **뒤에**
    // 글자가 갈려서 다시 맨 뒤로 튑니다. 한 번에 끝내야 커서가 제자리에 남습니다
    setDigits(formatDate(target, ""));
    setMonth(startOfMonth(target));

    const range = SEGMENT_RANGE[seg];
    pendingSel.current = range;
    // 경계에 걸려 값이 그대로면 다시 렌더되지 않습니다 — 그때는 지금 맞춥니다
    el.setSelectionRange(range[0], range[1]);
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
          value={formatDigits(digits)}
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
            const parsed = digits.length === 8 ? parseDate(formatDigits(digits)) : null;
            if (!parsed || isDisabled(parsed, min, max)) {
              setDigits(value ? formatDate(value, "") : "");
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          inputMode="numeric"
          // 지우기는 Input 것을 끄고 달력 버튼과 한 묶음으로 답니다 —
          // 기본 자리(가장 바깥)에 두면 달력 버튼이 안쪽으로 밀려
          // 늘 같은 자리에 있어야 할 것이 값 유무에 따라 움직입니다
          clearable={false}
          className={className}
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
                <CalendarDays />
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
          min={min}
          max={max}
          onClear={() => onValueChange(null)}
        />
      </PopoverContent>
    </Popover>
  );
}
