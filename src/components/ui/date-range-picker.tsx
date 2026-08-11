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
 * Figma: DateRangeTabs (5 변형 — Step 5)
 *
 * 시작·종료 중 **어느 쪽을 고르는 중인지** 보여주고, 눌러서 전환합니다.
 *
 * Figma 는 이걸 `Step` 축 다섯으로 모델링했지만, 코드에서는 **값 유무 × 편집 중**
 * 두 가지로 계산합니다 — 같은 것을 두 번 적어두면 한쪽만 고쳐집니다.
 *
 * | Figma Step | 코드에서는 |
 * |---|---|
 * | Start | `editing="start"`, 둘 다 빈 값 |
 * | End | `editing="end"`, 시작에 값 |
 * | Complete | `editing=null`, 둘 다 값 |
 * | Edit-Start · Edit-End | 완료 후 다시 그쪽을 편집 중 |
 *
 * 색 규칙은 세 가지입니다 — **고르는 중**(파란 틴트 + 파란 테두리) /
 * **값 있고 쉬는 중**(흰 배경 + 진한 글자) / **값 없음**(흰 배경 + 흐린 글자).
 */

export interface DateRangeTabsProps {
  range: DateRange;
  editing: "start" | "end" | null;
  onEditingChange: (which: "start" | "end") => void;
  /** 표시 단위. 월을 고르는 화면에서 2026-08-01 이라고 쓰면 하루를 고른 것처럼 보입니다. */
  precision?: DatePrecision;
  className?: string;
}

function tabTone(active: boolean, filled: boolean) {
  if (active) return "border-cal-today-border bg-cal-cell-range text-cal-text-range";
  if (filled) return "border-cal-border bg-background-white text-cal-text";
  return "border-cal-border bg-background-white text-text-subtle";
}

export function DateRangeTabs({
  range,
  editing,
  onEditingChange,
  precision = "day",
  className,
}: DateRangeTabsProps) {
  /*
    빈 칸 문구는 **짧게** 둡니다.

    "시작 월을 선택해 주세요" 처럼 문장으로 쓰면 탭이 그 글자에 맞춰 넓어지고,
    패널 전체가 따라 커집니다. 무엇을 하라는 안내는 활성 탭의 파란 테두리가
    이미 하고 있어서, 여기서는 어느 쪽인지만 밝히면 됩니다.
  */
  const unit = precision === "year" ? "연도" : precision === "month" ? "월" : "일";
  const tabs = [
    { key: "start" as const, value: range.start, empty: `시작${unit}` },
    { key: "end" as const, value: range.end, empty: `종료${unit}` },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {tabs.map((t, i) => (
        <React.Fragment key={t.key}>
          {i === 1 && <span className="shrink-0 text-sm text-text-subtle">~</span>}
          <button
            type="button"
            aria-pressed={editing === t.key}
            onClick={() => onEditingChange(t.key)}
            className={cn(
              "h-10 flex-1 rounded-md border px-2.5 text-sm font-medium transition-colors",
              "focus-visible:ring-[3px] focus-visible:ring-action-focus-ring focus-visible:outline-hidden",
              tabTone(editing === t.key, t.value != null)
            )}
          >
            {t.value ? formatByPrecision(t.value, precision) : t.empty}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * 빠른 선택 — **달력을 만지지 않고 끝나는 경로**입니다.
 * 조회 화면에서는 이것만으로 끝나는 경우가 많아서, 항상 열어둡니다.
 *
 * 기간은 **오늘을 포함해서** 셉니다 — "3일" 은 그저께부터 오늘까지입니다.
 * 화면마다 다르니 `presets` 로 갈아끼우세요.
 */
export interface DatePreset {
  label: string;
  range: () => DateRange;
}

/**
 * "전체" 는 넣지 않습니다 — 나머지가 전부 기간인데 혼자만 **조건을 지우는** 동작이라
 * 같은 줄에 있으면 무엇을 고르는 자리인지 흐려집니다. 기간을 비우는 일은
 * 입력창의 지우기(X)가 이미 맡고 있습니다 (2026-08-07 제거).
 */
const DAY_PRESETS: DatePreset[] = [
  { label: "1일", range: () => ({ start: startOfDay(new Date()), end: startOfDay(new Date()) }) },
  {
    label: "3일",
    range: () => ({ start: addDays(startOfDay(new Date()), -2), end: startOfDay(new Date()) }),
  },
  {
    label: "7일",
    range: () => ({ start: addDays(startOfDay(new Date()), -6), end: startOfDay(new Date()) }),
  },
  {
    label: "1개월",
    range: () => ({
      start: addDays(addMonths(startOfDay(new Date()), -1), 1),
      end: startOfDay(new Date()),
    }),
  },
];

/** 이번 달을 포함해 n개월. 종료는 이번 달 말일입니다. */
const lastMonths = (n: number) => () => ({
  start: startOfMonth(addMonths(new Date(), -(n - 1))),
  end: endOfUnit(new Date(), "month"),
});

/** 올해를 포함해 n년. 종료는 올해 12월 31일입니다. */
const lastYears = (n: number) => () => ({
  start: startOfYear(addYears(new Date(), -(n - 1))),
  end: endOfUnit(new Date(), "year"),
});

const MONTH_PRESETS: DatePreset[] = [
  { label: "1개월", range: lastMonths(1) },
  { label: "3개월", range: lastMonths(3) },
  { label: "6개월", range: lastMonths(6) },
  { label: "1년", range: lastMonths(12) },
];

const YEAR_PRESETS: DatePreset[] = [
  { label: "1년", range: lastYears(1) },
  { label: "3년", range: lastYears(3) },
  { label: "5년", range: lastYears(5) },
];

/**
 * **빠른 선택은 고르는 단위를 따라갑니다.**
 *
 * 월을 고르는 화면에 "3일" 이 붙어 있으면 눌러도 월 하나로 뭉개져서,
 * 무엇을 고른 것인지 설명되지 않습니다. 단위가 바뀌면 목록도 바뀌어야 합니다.
 */
export const PRESETS_BY_PRECISION: Record<DatePrecision, DatePreset[]> = {
  day: DAY_PRESETS,
  month: MONTH_PRESETS,
  year: YEAR_PRESETS,
};

/** 날짜 단위 기본값. 다른 단위는 `PRESETS_BY_PRECISION` 을 쓰세요. */
export const DEFAULT_PRESETS = DAY_PRESETS;

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

/**
 * 범위를 고르는 **규칙 한 벌**입니다. 화면은 안 그리고 상태와 판단만 쥡니다.
 *
 * PC 패널(`DateRangePickerPanel`)과 모바일 시트(`MobileDateRangePicker`)가 **같이 씁니다.**
 * 겉모습은 다르지만 — 두 달이냐 한 달이냐, 사이드 레일이 있냐 — *언제 시작이 되고
 * 언제 종료가 되는지*는 하나여야 합니다. 예전에는 두 벌이었고, 한쪽만 고치면
 * 아무도 모르는 상태였습니다.
 *
 * `monthsVisible` 은 탭을 눌렀을 때 **달을 옮길지 판단하는 데만** 씁니다 —
 * 이미 보이는 달이면 옮기지 않습니다.
 */
export function useDateRangeDraft({
  value,
  precision,
  monthsVisible = 2,
}: {
  value: DateRange;
  precision: DatePrecision;
  monthsVisible?: 1 | 2;
}) {
  // 확정 전까지는 여기서만 바뀝니다 — 취소하면 통째로 버립니다
  const [draft, setDraft] = React.useState<DateRange>(value);
  /**
   * 지금 고르는 중인 쪽. **null 은 다 골랐다는 뜻**입니다 (Figma 의 Complete).
   *
   * Figma 의 Step 축 5개가 여기서 나옵니다 —
   * `start`+빈값=Start · `end`+시작있음=End · `null`+둘다=Complete ·
   * `start`·`end`+둘다=Edit-Start·Edit-End.
   */
  const [editing, setEditing] = React.useState<"start" | "end" | null>(() =>
    value.start && value.end ? null : value.start ? "end" : "start"
  );
  const [preview, setPreview] = React.useState<Date | null>(null);
  /**
   * 보여줄 두 달을 정합니다 — 넘긴 달이 **오른쪽**에 오고 그 앞달이 왼쪽입니다.
   *
   * 조회 기간은 대개 **오늘에서 거슬러 올라갑니다.** 그런데 이번 달을 왼쪽에 두면
   * 오른쪽은 아직 오지 않은 달이라, 화면의 절반이 고를 일 없는 자리로 남습니다.
   * 최신 달을 오른쪽에 두면 그 앞달까지 함께 보여 "지난달 중순 ~ 오늘" 같은 기간을
   * 한 화면에서 고를 수 있습니다.
   *
   * 한 달만 보여주는 모바일에서는 옮기지 않습니다 — 옮기면 지난달이 열립니다.
   */
  const frame = React.useCallback(
    (rightMonth: Date) => startOfMonth(monthsVisible === 2 ? addMonths(rightMonth, -1) : rightMonth),
    [monthsVisible]
  );

  /**
   * 열 때 어디를 보여줄지.
   *
   * 종료가 있으면 **종료를 오른쪽에** 둡니다 — 기간의 최신 끝이 거기입니다.
   * 시작만 있으면(고르다 만 값) 옮기지 않습니다. 그때는 종료를 **앞으로** 골라야 해서
   * 오른쪽에 자리가 있어야 합니다.
   */
  const initial = React.useCallback(
    (v: DateRange) =>
      v.end ? frame(v.end) : v.start ? startOfMonth(v.start) : frame(new Date()),
    [frame]
  );

  const [cursor, setCursor] = React.useState<Date>(() => initial(value));
  // 오늘로 이동이 커서를 옮겨달라고 부탁하는 통로입니다. 매번 새 객체라 두 번 눌러도 반응합니다
  const [focusReq, setFocusReq] = React.useState<Date | null>(null);

  /**
   * **종료는 그 단위의 마지막 날**입니다 — 2026년 8월을 종료로 고르면 8월 31일.
   * 1일로 두면 8월 2일부터가 조용히 빠져서, 화면은 8월까지라는데 자료는 하루만 나옵니다.
   */
  const asStart = (d: Date) => startOfUnit(d, precision);
  const asEnd = (d: Date) => endOfUnit(d, precision);

  /** 고른 칸을 값으로 바꿉니다. */
  const pick = (raw: Date) => {
    setPreview(null);
    const d = asStart(raw);

    // 종료를 고르는 중 — 시작보다 앞을 고르면 그쪽이 시작이 됩니다.
    // 되돌리라고 하는 것보다 낫습니다
    if (editing === "end" && draft.start) {
      setDraft(
        d < draft.start
          ? { start: d, end: asEnd(draft.start) }
          : { ...draft, end: asEnd(raw) }
      );
      setEditing(null);
      return;
    }

    // 다 고른 뒤 시작만 다시 고르는 중 (Figma 의 Edit-Start)
    if (editing === "start" && draft.end) {
      // 종료보다 늦은 날을 시작으로 잡으면 범위가 뒤집힙니다 —
      // 종료를 비우고 이어서 다시 고르게 합니다
      if (d > draft.end) {
        setDraft({ start: d, end: null });
        setEditing("end");
      } else {
        setDraft({ ...draft, start: d });
        setEditing(null);
      }
      return;
    }

    // 그 밖에는 새 범위를 시작합니다 — 빈 상태에서 고를 때와
    // 다 고른 뒤 달력을 다시 눌렀을 때가 여기입니다
    setDraft({ start: d, end: null });
    setEditing("end");
  };

  /**
   * 탭을 누르면 그쪽을 다시 고릅니다.
   *
   * 값이 있으면 그 날짜가 **보이는 곳까지 달력을 옮기고** 커서도 거기에 둡니다 —
   * 3월을 골라놓고 8월을 보던 중에 시작 탭을 눌렀는데 8월이 그대로면
   * 무엇을 고치는 중인지 알 수 없습니다.
   *
   * 이미 보이는 달이면 옮기지 않습니다. 멀쩡히 보이는 화면이 움직이는 게 더 놀랍습니다.
   */
  const editTab = (which: "start" | "end") => {
    setEditing(which);
    const target = which === "start" ? draft.start : draft.end;
    if (!target) return;
    const visible =
      isSameMonth(target, cursor) ||
      (monthsVisible === 2 && isSameMonth(target, addMonths(cursor, 1)));
    if (!visible) setCursor(startOfMonth(target));
    setFocusReq(new Date(target));
  };

  /** 다 지웁니다 — 이어서 시작부터 고릅니다. */
  const reset = () => {
    setDraft({ start: null, end: null });
    setEditing("start");
  };

  /**
   * **달만 옮깁니다** — 오늘 하나를 넣어봐야 두 날짜를 골라야 하는 일이 끝나지
   * 않습니다. 단일(`DatePicker`)은 반대로 오늘을 바로 고릅니다.
   * 커서도 오늘 칸으로 옮겨서 이어서 방향키로 집어갈 수 있게 합니다.
   */
  const goToday = () => {
    const today = startOfDay(new Date());
    // 오늘도 오른쪽입니다 — 여는 순간과 같은 자리에 있어야 어디로 갔는지 헷갈리지 않습니다
    setCursor(frame(today));
    setFocusReq(startOfDay(new Date()));
  };

  /** 빠른 선택을 눌렀을 때 — 다 정해졌으니 활성 탭을 끕니다. */
  const applyPreset = (p: DatePreset) => {
    const r = p.range();
    setDraft(r);
    setCursor(initial(r));
    setEditing(null);
  };

  /** 열 때마다 지금 값에서 다시 시작합니다 (시트처럼 여닫는 쪽에서 씁니다). */
  const restart = (v: DateRange) => {
    setDraft(v);
    setEditing(v.start && v.end ? null : v.start ? "end" : "start");
    setCursor(initial(v));
    setPreview(null);
  };

  return {
    draft,
    editing,
    preview,
    setPreview,
    cursor,
    setCursor,
    focusReq,
    pick,
    editTab,
    reset,
    goToday,
    applyPreset,
    restart,
    complete: draft.start != null && draft.end != null,
  };
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
 * **칩과 한 줄에 놓일 때만** 쓰는 기본 폭입니다 (`quickSelect`).
 *
 * 그 밖에는 **부모가 폭을 정합니다** — `Input` · `Select` 와 같은 규칙입니다.
 * `FormField` 안에 홀로 놓이면 다른 필드와 나란히 칸을 채워야 하는데, 컴포넌트가
 * 폭을 쥐고 있으면 **날짜 칸만 혼자 짧아집니다.**
 *
 * 칩과 나란히 놓일 때는 반대입니다. 그 줄은 입력창과 칩이 폭을 나눠 갖는 자리라
 * 입력창이 먼저 자기 몫을 정해야 합니다 — 안 그러면 칩이 밀려납니다.
 *
 * 필요한 폭 = 좌우 여백 24 + 글자 + 간격 8 + 우측 아이콘. 우측은 값이 있으면
 * 지우기 16 + 간격 4 + 달력 16 = **36**, 비어 있으면 달력 **16** 뿐이라
 * `day` 는 자리표시가, 나머지는 값이 폭을 정합니다 (Pretendard 14 실측 + 4).
 *
 * | | 값 | 자리표시 | 필요 | 여기 |
 * |---|---|---|---|---|
 * | day | 169 | 196 | 244 | **248** |
 * | month | 129 | 145 | 197 | **204** |
 * | year | 83 | 87 | 151 | **156** |
 *
 * **Figma 값(250 · 200 · 180)을 따르지 않습니다** — 그림이 지우기 버튼을 그리지 않아
 * `month` 는 3px 모자라고 `year` 는 29px 남았습니다 (2026-08-11, Figma 를 코드에 맞춤).
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
          className={className}
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
 * 줄바꿈되면 각 줄이 폭을 꽉 채웁니다 (`w-* grow`). `basis-*` 로 주면 **재는 값과 놓는
 * 값이 달라져** 넓은 화면에서도 칩이 밀립니다.
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
      {/* grow — 칩이 다음 줄로 내려가면 이 줄을 혼자 쓰므로 꽉 채웁니다 */}
      <PopoverDateRangePicker {...props} className={cn(PICKER_WIDTH[precision], "grow")} />
      {chips}
    </div>
  );
}
