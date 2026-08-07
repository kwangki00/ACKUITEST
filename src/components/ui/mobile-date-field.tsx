import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { CalendarMonth, type DateRange } from "@/components/ui/calendar";
import { DateRangeTabs, PRESETS_BY_PRECISION, type DatePreset } from "@/components/ui/date-range-picker";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import {
  endOfUnit,
  formatByPrecision,
  isDisabled,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfUnit,
  type DatePrecision,
} from "@/lib/date";

/**
 * Figma: MobileDateField (3 변형 — Precision 3) + MobileCalendar (6 변형)
 *
 * 모바일 조회 조건의 기간 입력입니다. **PC 의 `DateField` 와 짝**이고 규칙도 같습니다 —
 * 다만 가로로 놓는 대신 **세로로 쌓습니다.**
 *
 * ### 달력은 한 달만
 *
 * PC 는 두 달을 나란히 놓지만 모바일 폭에 두 달을 넣으면 칸이 손가락보다 작아집니다.
 * 년·월도 **Select 가 아니라 ‹ 2026년 7월 › 화살표**입니다 —
 * 시트 위에 Select 패널을 또 띄우면 "시트를 두 개 겹치지 말라" 는 규칙과 부딪힙니다.
 *
 * ### 빠른 선택이 먼저입니다
 *
 * 칩만으로 끝나는 경로를 앞에 둡니다 — 조회 화면에서 가장 많이 하는 일입니다.
 * 칩은 **균등 분할**이라 폭을 나눠 갖습니다. 6개를 넘으면 가로 스크롤로 바꾸세요.
 *
 * **칩은 거짓말을 하면 안 됩니다** — 달력에서 임의 기간을 고르면 칩 선택이 풀립니다.
 *
 * ### 확인 버튼은 시트가 담당합니다
 *
 * 달력 자체에는 없습니다. 두 날짜를 골라야 하니 시트 Footer 로 확정합니다.
 */

export interface MobileDateFieldProps {
  label?: string;
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  precision?: DatePrecision;
  /** 끄면 입력창만 남습니다 — 생년월일처럼 정해진 기간 묶음이 없는 경우. */
  presets?: DatePreset[] | false;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
  /** 문서·데모에서 시트를 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

export function MobileDateField({
  label = "기간",
  value,
  onValueChange,
  precision = "day",
  presets,
  min,
  max,
  disabled,
  className,
  container,
}: MobileDateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange>(value);
  const [editing, setEditing] = React.useState<"start" | "end" | null>(null);
  const [month, setMonth] = React.useState<Date>(() => startOfMonth(value.start ?? new Date()));

  const quick = presets === false ? [] : (presets ?? PRESETS_BY_PRECISION[precision]);

  // 저장해둔 라벨을 믿지 않고 매번 값과 맞춰 봅니다 —
  // 어제 누른 "7일" 은 오늘 열면 최근 7일이 아닙니다
  const active =
    quick.find((p) => {
      const r = p.range();
      return isSameDay(r.start, value.start) && isSameDay(r.end, value.end);
    })?.label ?? "";

  const text =
    value.start && value.end
      ? `${formatByPrecision(value.start, precision)} ~ ${formatByPrecision(value.end, precision)}`
      : "";

  const openSheet = () => {
    if (disabled) return;
    setDraft(value);
    setEditing(value.start && value.end ? null : value.start ? "end" : "start");
    setMonth(startOfMonth(value.start ?? new Date()));
    setOpen(true);
  };

  const pick = (raw: Date) => {
    const d = startOfUnit(raw, precision);

    if (editing === "end" && draft.start) {
      setDraft(
        d < draft.start
          ? { start: d, end: endOfUnit(draft.start, precision) }
          : { ...draft, end: endOfUnit(raw, precision) }
      );
      setEditing(null);
      return;
    }
    if (editing === "start" && draft.end) {
      if (d > draft.end) {
        setDraft({ start: d, end: null });
        setEditing("end");
      } else {
        setDraft({ ...draft, start: d });
        setEditing(null);
      }
      return;
    }
    setDraft({ start: d, end: null });
    setEditing("end");
  };

  const today = startOfDay(new Date());

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span className="text-sm font-medium text-text-basic">{label}</span>}

      <Input
        readOnly
        value={text}
        placeholder="기간을 선택해 주세요"
        disabled={disabled}
        onChange={() => {}}
        onClick={openSheet}
        clearable={false}
        // readOnly 는 키보드를 막으려고 준 것입니다 — 값은 시트로 바꿉니다.
        // 그대로 두면 Readonly 회색이 칠해져 못 만지는 칸으로 보입니다
        className="cursor-pointer border-input-border bg-input-surface"
        trailingIcon={
          <span className="grid place-items-center text-icon-muted-foreground">
            <Calendar />
          </span>
        }
      />

      {quick.length > 0 && (
        // 칩은 균등 분할입니다 — 폭을 나눠 가져야 한 줄에 들어갑니다
        <ToggleGroup
          variant="outline"
          value={active}
          onValueChange={(next: string) => {
            const p = quick.find((x) => x.label === next);
            if (p) onValueChange(p.range());
          }}
          disabled={disabled}
          aria-label="빠른 선택"
          className="w-full"
        >
          {quick.map((p) => (
            <ToggleItem key={p.label} value={p.label} className="flex-1">
              {p.label}
            </ToggleItem>
          ))}
        </ToggleGroup>
      )}

      <MobileSheet
        open={open}
        onOpenChange={setOpen}
        title={label}
        container={container}
        confirmLabel="선택"
        confirmDisabled={!draft.start || !draft.end}
        onConfirm={() => {
          onValueChange(draft);
          setOpen(false);
        }}
      >
        {/* 탭이 고른 값을 그대로 보여줍니다 — "시작일" 대신 "2026-07-13" */}
        <DateRangeTabs
          range={draft}
          editing={editing}
          onEditingChange={(which) => {
            setEditing(which);
            const target = which === "start" ? draft.start : draft.end;
            if (target) setMonth(startOfMonth(target));
          }}
          precision={precision}
        />

        <CalendarMonth
          month={month}
          onMonthChange={setMonth}
          range={draft}
          onSelect={pick}
          min={min}
          max={max}
          header="nav"
          className="w-full p-0"
        />

        {/* 보조 동작은 둘 다 link 로 같은 무게입니다 — 어느 쪽도 주 액션이 아닙니다 */}
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            disabled={!draft.start && !draft.end}
            onClick={() => {
              setDraft({ start: null, end: null });
              setEditing("start");
            }}
          >
            초기화
          </Button>
          <Button
            variant="link"
            size="sm"
            disabled={isDisabled(today, min, max)}
            onClick={() => setMonth(startOfMonth(today))}
          >
            오늘로 이동
          </Button>
        </div>
      </MobileSheet>
    </div>
  );
}
