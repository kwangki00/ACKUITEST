import * as React from "react";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import { MobileDateRangePicker } from "@/components/ui/mobile-date-range-picker";
import { useOverlay, type OverlayMode } from "@/components/ui/pointer-mode";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { CalendarMonth, type DateRange } from "@/components/ui/calendar";
/*
  탭·프리셋·상태 훅은 date-range-core 에 있습니다 — PC 와 시트가 둘 다 쓰는데 한쪽에
  두면 서로를 import 해서 순환이 생깁니다. 예전 경로가 깨지지 않게 여기서 다시 내보냅니다
*/
export {
  DateRangeTabs,
  PRESETS_BY_PRECISION,
  DEFAULT_PRESETS,
  useDateRangeDraft,
  type DateRangeTabsProps,
  type DatePreset,
} from "@/components/ui/date-range-core";
import {
  PRESETS_BY_PRECISION,
  useDateRangeDraft,
  DateRangeTabs,
  type DatePreset,
} from "@/components/ui/date-range-core";
import { CalendarUnitGrid } from "@/components/ui/calendar-unit";
import {
  addDays,
  addMonths,
  addYears,
  clamp,
  endOfUnit,
  startOfYear,
  formatByPrecision,
  formatDate,
  formatDigitsByPrecision,
  isDisabled,
  isSameDay,
  isSameMonth,
  parseByPrecision,
  PRECISION_DIGITS,
  startOfDay,
  startOfMonth,
  startOfUnit,
  toDigits,
  type DatePrecision,
} from "@/lib/date";

/**
 * Figma: DatePickerPanel — Mode=Range · Confirm=True · Precision=Day
 *
 * **두 달을 나란히** 보여줍니다. 시작일이 안 보이면 범위를 고르기 어렵기 때문입니다.
 *
 * `Confirm=True` 인 이유 — 두 날짜를 골라야 하니 중간에 잘못 눌러도 되돌릴 수 있어야 합니다.
 * (단일은 반대로 False 입니다. 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다.)
 */

export interface DateRangePickerPanelProps {
  value: DateRange;
  onConfirm: (range: DateRange) => void;
  onCancel: () => void;
  /** 고르는 단위. month·year 는 달력 대신 3×4 그리드가 뜹니다. */
  precision?: DatePrecision;
  min?: Date;
  max?: Date;
  presets?: DatePreset[];
  className?: string;
}


export function DateRangePickerPanel({
  value,
  onConfirm,
  onCancel,
  precision = "day",
  min,
  max,
  presets,
  className,
}: DateRangePickerPanelProps) {
  const quick = presets ?? PRESETS_BY_PRECISION[precision];
  const {
    draft,
    editing,
    preview,
    setPreview,
    cursor: left,
    setCursor: setLeft,
    focusReq,
    pick,
    editTab,
    reset,
    goToday,
    applyPreset,
    complete,
  } = useDateRangeDraft({ value, precision });
  const right = addMonths(left, 1);
  const today = startOfDay(new Date());

  return (
    <div className={cn("flex rounded-xl border border-cal-border bg-background-white", className)}>
      <div className="flex flex-col">
        <div className="px-4 pt-4 pb-3">
          <DateRangeTabs
            range={draft}
            editing={editing}
            onEditingChange={editTab}
            precision={precision}
          />
        </div>

        {/* 두 달은 늘 이웃합니다 — 왼쪽을 바꾸면 오른쪽이, 오른쪽을 바꾸면 왼쪽이 따라옵니다.
            따로 놀게 두면 7월과 11월이 나란히 놓여 사이가 비어 보입니다 */}
        {/*
          날짜는 두 달을 나란히 보여주지만 **월·연은 하나면 됩니다** —
          월 그리드 하나에 열두 달이 다 들어 있어서, 둘을 놓으면 같은 해가 두 번 나옵니다.
        */}
        <div className="flex gap-2 px-2 pb-2">
          {precision === "day" ? (
            <>
              <CalendarMonth
                month={left}
                onMonthChange={setLeft}
                range={draft}
                preview={preview}
                onSelect={pick}
                onPreviewChange={setPreview}
                focusDate={focusReq}
                min={min}
                max={max}
              />
              <CalendarMonth
                month={right}
                onMonthChange={(m) => setLeft(addMonths(m, -1))}
                range={draft}
                preview={preview}
                onSelect={pick}
                onPreviewChange={setPreview}
                min={min}
                max={max}
              />
            </>
          ) : (
            <CalendarUnitGrid
              unit={precision}
              cursor={left}
              onCursorChange={setLeft}
              range={draft}
              preview={preview}
              onSelect={pick}
              onPreviewChange={setPreview}
              min={min}
              max={max}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-cal-border px-4 py-3">
          <div className="flex items-center gap-1">
            <Button
              variant="link"
              size="sm"
              disabled={!draft.start && !draft.end}
              onClick={reset}
            >
              초기화
            </Button>
            {/* 범위는 달만 옮깁니다 — 근거는 useDateRangeDraft 의 goToday 주석 참고 */}
            <Button
              variant="link"
              size="sm"
              disabled={isDisabled(today, min, max)}
              onClick={goToday}
            >
              {precision === "year" ? "올해로 이동" : precision === "month" ? "이번 달로 이동" : "오늘로 이동"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              취소
            </Button>
            <Button size="sm" disabled={!complete} onClick={() => onConfirm(draft)}>
              선택
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-30 shrink-0 flex-col gap-2 border-l border-cal-border bg-surface-gray-subtle px-3 py-4">
        <p className="text-xs font-semibold text-text-subtle">빠른 선택</p>
        {quick.map((p) => (
          <Button
            key={p.label}
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * 완성형 — 입력창 + 범위 패널입니다. **Figma 에 대응물이 없습니다.**
 *
 * 단일과 마찬가지로 **직접 칠 수 있습니다.** 숫자 16자리를 이어 치면
 * `2026-01-07 ~ 2026-04-15` 가 됩니다 — 구분자는 저절로 붙습니다.
 * 여덟 자리에서 시작이, 열여섯 자리에서 종료가 정해집니다.
 */

/** 표시 문자열에서 각 칸이 앉는 자리. 정밀도마다 길이가 달라집니다. */
type RangeSeg = { side: "start" | "end"; unit: "year" | "month" | "day"; sel: [number, number] };

/**
 * `2026-01-07 ~ 2026-04-15` · `2026-01 ~ 2026-04` · `2026 ~ 2029` 의 칸 자리를 계산합니다.
 * 한쪽 길이(len)와 구분자 3칸(` ~ `)으로 뒤쪽 자리가 정해집니다.
 */
function rangeSegments(p: DatePrecision): RangeSeg[] {
  const one: { unit: "year" | "month" | "day"; sel: [number, number] }[] =
    p === "year"
      ? [{ unit: "year", sel: [0, 4] }]
      : p === "month"
        ? [
            { unit: "year", sel: [0, 4] },
            { unit: "month", sel: [5, 7] },
          ]
        : [
            { unit: "year", sel: [0, 4] },
            { unit: "month", sel: [5, 7] },
            { unit: "day", sel: [8, 10] },
          ];
  const len = p === "year" ? 4 : p === "month" ? 7 : 10;
  const shift = len + 3;
  return [
    ...one.map((s) => ({ side: "start" as const, ...s })),
    ...one.map((s) => ({
      side: "end" as const,
      unit: s.unit,
      sel: [s.sel[0] + shift, s.sel[1] + shift] as [number, number],
    })),
  ];
}

function rangeSegmentAt(pos: number, p: DatePrecision): RangeSeg {
  const segs = rangeSegments(p);
  const len = p === "year" ? 4 : p === "month" ? 7 : 10;
  // 구분자(` ~ `) 위는 앞쪽 마지막 칸으로 칩니다
  const half = segs.length / 2;
  if (pos <= len + 2) return segs.slice(0, half).find((s) => pos <= s.sel[1]) ?? segs[half - 1];
  return segs.slice(half).find((s) => pos <= s.sel[1]) ?? segs[segs.length - 1];
}

/** 숫자열에 구분자를 얹습니다. 한쪽을 다 채우기 전에는 시작만 보입니다. */
function formatRangeDigits(d: string, p: DatePrecision) {
  const size = PRECISION_DIGITS[p];
  if (d.length <= size) return formatDigitsByPrecision(d, p);
  return `${formatDigitsByPrecision(d.slice(0, size), p)} ~ ${formatDigitsByPrecision(d.slice(size), p)}`;
}

/** 값 → 숫자열. 한쪽만 있으면 그만큼만 채웁니다. */
function rangeToDigits(r: DateRange, p: DatePrecision) {
  if (!r.start) return "";
  const s = formatByPrecision(r.start, p).replace(/\D/g, "");
  return s + (r.end ? formatByPrecision(r.end, p).replace(/\D/g, "") : "");
}

export interface DateRangePickerProps
  extends Omit<
    InputProps,
    "value" | "onChange" | "defaultValue" | "trailingIcon" | "min" | "max"
  > {
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  /** 고르는 단위. 입력 자릿수와 패널 모양이 함께 바뀝니다. */
  precision?: DatePrecision;
  min?: Date;
  max?: Date;
  /** 빠른 선택 목록. 안 넘기면 `precision` 에 맞는 기본 묶음입니다. */
  presets?: DatePreset[];
  /**
   * 입력창 **옆(모바일은 아래)** 에 빠른 선택 칩을 답니다. 조회 조건에서는 켜세요 —
   * 가장 많이 하는 일이 "최근 N일" 이라 달력을 열지 않고 끝나는 경로입니다.
   * 정해진 기간 묶음이 없으면(생년월일 · 검사 시행일) 끕니다.
   */
  quickSelect?: boolean;
  /**
   * 어떻게 열지. **기본은 `PointerModeProvider` 가 정합니다** — 손가락이면 시트,
   * 마우스면 팝오버. 화면 하나만 예외로 두고 싶을 때만 직접 넘기세요.
   */
  overlay?: OverlayMode;
  /** 시트를 문서·데모 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

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
 * | day | 169 | 196 | 244 | **248** |
 * | month | 129 | 145 | 197 | **204** |
 * | year | 83 | 87 | 151 | **156** |
 *
 * `quickSelect` 일 때도 **입력창은 이 폭 그대로**입니다 — 남는 자리는 **칩이** 먹습니다.
 * 입력창을 늘리면 값의 길이는 그대로인데 오른쪽만 비어 보이지만, 칩은 원래 균등
 * 분할이라 넓어져도 자연스럽습니다. 가로 한 줄에서는 묶음이 내용 폭이라 남는 자리가
 * 아예 없고, 세로로 쌓일 때만 칩이 늘어나 옆 줄과 폭이 맞습니다.
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
  day: "w-62",
  month: "w-51",
  year: "w-39",
};

const RANGE_PLACEHOLDER: Record<DatePrecision, string> = {
  day: "YYYY-MM-DD ~ YYYY-MM-DD",
  month: "YYYY-MM ~ YYYY-MM",
  year: "YYYY ~ YYYY",
};

/** 마우스일 때 — 입력창 + 팝오버 달력. */
function PopoverDateRangePicker({
  value,
  onValueChange,
  precision = "day",
  min,
  max,
  presets,
  placeholder,
  disabled,
  readOnly,
  className,
  onKeyDown,
  quickSelect: _quickSelect,
  overlay: _overlay,
  container: _container,
  ...props
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const size = PRECISION_DIGITS[precision];
  const [digits, setDigits] = React.useState(() => rangeToDigits(value, precision));
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 날짜가 실제로 달라졌을 때만 글자를 맞춥니다.
  // value 를 통째로 지켜보면 부모가 매 렌더 새 객체를 만드는 순간 타이핑이 되돌려집니다
  const startKey = value.start?.getTime();
  const endKey = value.end?.getTime();
  React.useEffect(() => {
    setDigits(rangeToDigits(value, precision));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey, endKey, precision]);

  const commit = (raw: string) => {
    const d = toDigits(raw, size * 2);
    setDigits(d);

    if (d === "") {
      onValueChange({ start: null, end: null });
      return;
    }
    // 한쪽을 다 채우기 전에는 아직 날짜가 아닙니다
    if (d.length < size) return;

    const start = parseByPrecision(d.slice(0, size), precision);
    if (!start || isDisabled(start, min, max)) return;

    /*
      시작이 막 정해진 순간에만 알립니다.

      9~15 자리는 **종료를 치는 중**이라 아직 알릴 것이 없습니다.
      그 구간에서도 알리면 value 가 바뀌고 → 글자를 value 기준으로 맞추면서
      방금 친 아홉 번째 숫자가 잘려나갑니다. 실제로 종료 칸에 아무것도
      안 들어가던 원인이 이것이었습니다.
    */
    if (d.length === size) {
      onValueChange({ start, end: null });
      return;
    }
    if (d.length < size * 2) return;

    const parsedEnd = parseByPrecision(d.slice(size), precision);
    if (!parsedEnd || isDisabled(parsedEnd, min, max)) return;
    // 종료는 그 단위의 마지막 날입니다 — 8월을 종료로 치면 8월 31일
    const end = endOfUnit(parsedEnd, precision);
    // 뒤집어 쳤으면 바로잡습니다 — 되돌리라고 하는 것보다 낫습니다
    onValueChange(end < start ? { start: parsedEnd, end: endOfUnit(start, precision) } : { start, end });
  };

  const clear = () => {
    setDigits("");
    onValueChange({ start: null, end: null });
    inputRef.current?.focus();
  };

  // 값이 바뀌면 커서가 끝으로 튑니다 — 오르내린 칸을 렌더 직후에 다시 선택합니다
  const pendingSel = React.useRef<[number, number] | null>(null);
  React.useLayoutEffect(() => {
    const sel = pendingSel.current;
    if (!sel || !inputRef.current) return;
    inputRef.current.setSelectionRange(sel[0], sel[1]);
    pendingSel.current = null;
  });

  /**
   * 위·아래로 커서가 놓인 칸만 오르내립니다 — 시작 년/월/일, 종료 년/월/일 여섯 칸.
   *
   * 시작은 종료를 넘지 못하고 종료는 시작보다 앞서지 못합니다.
   * 넘어가게 두면 눌러둔 범위가 조용히 뒤집힙니다.
   */
  const step = (e: React.KeyboardEvent<HTMLInputElement>, dir: 1 | -1) => {
    e.preventDefault();
    const el = e.currentTarget;
    const seg = rangeSegmentAt(el.selectionStart ?? 0, precision);
    const today = startOfUnit(new Date(), precision);
    const base = (seg.side === "start" ? value.start : value.end) ?? today;

    const moved =
      seg.unit === "year"
        ? addYears(base, dir)
        : seg.unit === "month"
          ? addMonths(base, dir)
          : addDays(base, dir);

    const next =
      seg.side === "start"
        ? { start: clamp(moved, min, value.end ?? max), end: value.end }
        : { start: value.start, end: clamp(moved, value.start ?? min, max) };

    onValueChange(next);
    // 글자도 같은 렌더에서 갱신해야 커서가 제자리에 남습니다 (단일과 같은 이유)
    setDigits(rangeToDigits(next, precision));
    pendingSel.current = seg.sel;
    el.setSelectionRange(seg.sel[0], seg.sel[1]);
  };

  const text = formatRangeDigits(digits, precision);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          {...props}
          ref={inputRef}
          value={text}
          placeholder={placeholder ?? RANGE_PLACEHOLDER[precision]}
          disabled={disabled}
          readOnly={readOnly}
          inputMode="numeric"
          onChange={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || readOnly || disabled) return;
            if (e.key === "ArrowUp") step(e, 1);
            else if (e.key === "ArrowDown") step(e, -1);
          }}
          onBlur={() => {
            // 열여섯 자리를 못 채웠으면 되돌립니다 — 반쪽 기간을 남겨두면
            // 조회 조건이 무엇인지 설명되지 않습니다
            if (digits === "" || digits.length === size * 2) return;
            setDigits(rangeToDigits(value, precision));
          }}
          clearable={false}
          className={cn(PICKER_WIDTH[precision], className)}
          trailingIcon={
            <span className="flex items-center gap-1">
              {digits !== "" && !disabled && !readOnly && (
                <button
                  type="button"
                  aria-label="기간 지우기"
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
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
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
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

      <PopoverContent type="content" align="start" className="w-auto border-0 p-0 shadow-none">
        {/* 열 때마다 새로 만듭니다 — 지난번에 고르다 만 상태가 남아 있으면
            취소했는데도 그 흔적이 다시 보입니다 */}
        <DateRangePickerPanel
          key={open ? "open" : "closed"}
          value={value}
          precision={precision}
          min={min}
          max={max}
          presets={presets}
          onConfirm={(r) => {
            onValueChange(r);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * 기간을 받는 자리에 쓰는 **완성형**입니다 — 입력창 + 달력, `quickSelect` 면 칩까지.
 *
 * ```tsx
 * <FormField label="조회 기간">
 *   <DateRangePicker quickSelect value={v} onValueChange={setV} />
 * </FormField>
 * ```
 *
 * ### 라벨은 `FormField` 가 답니다 (2026-08-10)
 *
 * 그전에는 `DateRangeField` 가 라벨까지 안고 있었습니다. 이유는 **입력창과 칩이 한 값을
 * 공유**해야 하는데 호출부가 조립하면 그 계산을 매번 다시 짜야 한다는 것이었습니다.
 *
 * 칩을 이 안으로 들이면서 **호출부에서는 컨트롤이 하나**가 되었고, 그 근거가 사라졌습니다.
 * 이제 `Input` · `Select` · `Combobox` 와 같은 규칙입니다 — 감싸기만 하면 됩니다.
 *
 * | 안에 든 것 | 라벨을 어떻게 받나 |
 * |---|---|
 * | 입력창(`Input`) | `FormField` 의 `controlId` — `<label for>` 가 걸립니다 |
 * | 칩(`ToggleGroup`) | **스스로 `aria-label="빠른 선택"`** 이라 컨텍스트를 안 씁니다 |
 *
 * 덤으로 설명·에러가 필드 전체에 붙습니다. 예전 구조는 입력창만 감싸서 **메시지가
 * 생기면 칩이 그 높이까지 내려갔고**, 그걸 막으려고 줄 전체를 다시 감싸야 했습니다.
 *
 * ### 칩은 값과 어긋나면 안 됩니다
 *
 * | | |
 * |---|---|
 * | 칩을 누름 | 입력창 값이 채워집니다 |
 * | 달력에서 임의 기간을 고름 | **칩 선택이 풀립니다** |
 *
 * 활성 칩은 저장하지 않고 **매번 값과 맞춰 계산**합니다 — 어제 누른 "7일" 은 오늘 열면
 * 최근 7일이 아닙니다.
 *
 * ### 자리가 모자라면 칩이 다음 줄로 (`flex-wrap`)
 *
 * 입력창 248(day) + 칩 넷은 한 줄에 **460** 쯤 필요합니다. **컨테이너 쿼리를 쓰지 않습니다** —
 * 그건 폭을 부모에서 받아야만 성립해서, 폭 없는 자리(내용만큼 넓어지는 flex 항목)에
 * 놓으면 조용히 무너집니다. `flex-wrap` 은 그런 조건이 없어 어디에 놓아도 동작합니다.
 *
 * **남는 자리는 칩이 먹습니다** — 입력창에는 `grow` 를 주지 않습니다.
 *
 * ### 팝오버냐 시트냐는 포인터가 정합니다
 *
 * 앱 루트의 `PointerModeProvider` — 손가락이면 `MobileDateRangePicker`(시트),
 * 마우스면 팝오버. 호출부는 아무 판단도 하지 않습니다.
 *
 * **시트로 열면 입력창을 직접 칠 수 없습니다** — `readOnly` 이고 값은 시트로 바꿉니다.
 */
export function DateRangePicker(props: DateRangePickerProps) {
  const {
    quickSelect,
    presets,
    precision = "day",
    value,
    onValueChange,
    disabled,
    className,
    overlay,
    container,
  } = props;

  const quick = presets ?? PRESETS_BY_PRECISION[precision];
  const sheet = useOverlay(overlay) === "sheet";

  /*
    저장해둔 라벨을 믿지 않고 **매번 값과 맞춰 봅니다** — 프리셋은 누를 때마다 오늘
    기준으로 다시 계산되므로, 어제 누른 "7일" 은 오늘 열면 최근 7일이 아닙니다
  */
  const active =
    quick.find((p) => {
      const r = p.range();
      return isSameDay(r.start, value.start) && isSameDay(r.end, value.end);
    })?.label ?? "";

  const chips = quickSelect && quick.length > 0 && (
    <ToggleGroup
      variant="outline"
      value={active}
      onValueChange={(next: string) => {
        const p = quick.find((x) => x.label === next);
        if (p) onValueChange(p.range());
      }}
      disabled={disabled}
      // 스스로 이름을 대므로 FormField 의 라벨을 집어가지 않습니다
      aria-label="빠른 선택"
      /*
        남는 자리는 **칩이** 먹습니다. 입력창이 먹으면 값의 길이는 그대로인데
        오른쪽만 비어 보이는데, 칩은 원래 균등 분할이라 넓어져도 자연스럽습니다.

        가로 한 줄(FilterRow 가 flex-row)에서는 이 묶음이 내용 폭이라 남는 자리가
        아예 없어 80 그대로이고, 세로로 쌓일 때만(폭 100%) 늘어나 옆 줄과 맞습니다.
      */
      className={sheet ? "w-full" : "grow"}
    >
      {quick.map((p) => (
        <ToggleItem key={p.label} value={p.label} className="flex-1">
          {p.label}
        </ToggleItem>
      ))}
    </ToggleGroup>
  );

  if (sheet) {
    // 시트는 세로로 쌓습니다 — 칩이 폭을 나눠 가져 한 줄에 들어갑니다
    return (
      <MobileDateRangePicker
        {...props}
        state={props.state === "error" ? "error" : "default"}
        // 칩은 시트 구현이 자기 규칙(균등 분할)으로 그립니다
        presets={quickSelect ? quick : false}
        container={container}
      />
    );
  }

  if (!chips) return <PopoverDateRangePicker {...props} />;

  return (
    // items-end 라 한 줄일 때 칩 바닥이 입력창 바닥과 맞습니다
    <div className={cn("flex flex-wrap items-end gap-2", className)}>
      {/* grow 를 주지 않습니다 — 남는 자리는 칩이 먹습니다 (위 PICKER_WIDTH 참고) */}
      <PopoverDateRangePicker {...props} />
      {chips}
    </div>
  );
}
