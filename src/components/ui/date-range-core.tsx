import * as React from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import type { DateRange } from "@/components/ui/calendar";
import {
  addDays,
  addMonths,
  addYears,
  endOfUnit,
  formatByPrecision,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfUnit,
  startOfYear,
  type DatePrecision,
} from "@/lib/date";

/**
 * 범위 선택의 **알맹이**입니다 — 탭 · 빠른 선택 목록 · 상태 훅.
 *
 * PC 팝오버(`date-range-picker.tsx`)와 모바일 시트(`mobile-date-range-picker.tsx`)가
 * **둘 다 여기서** 가져갑니다. 한쪽에 두면 서로를 import 해서 **순환**이 생깁니다 —
 * PC 가 시트 구현을 부르고, 시트가 규칙을 다시 가져가기 때문입니다.
 * `combobox-panel.tsx` 를 뽑은 것과 같은 이유입니다 (2026-08-11).
 *
 * **예전 경로도 그대로 동작합니다** — `date-range-picker.tsx` 가 다시 내보냅니다.
 */
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
