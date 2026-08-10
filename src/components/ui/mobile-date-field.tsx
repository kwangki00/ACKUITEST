import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { CalendarMonth, type DateRange } from "@/components/ui/calendar";
import {
  DateRangeTabs,
  PRESETS_BY_PRECISION,
  useDateRangeDraft,
  type DatePreset,
} from "@/components/ui/date-range-picker";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import {
  formatByPrecision,
  isDisabled,
  isSameDay,
  startOfDay,
  type DatePrecision,
} from "@/lib/date";

/**
 * Figma: MobileDateField (3 변형 — Precision 3) + MobileCalendar (6 변형)
 *
 * 기간 입력의 **시트 쪽 구현**입니다.
 *
 * ### 보통은 이걸 직접 쓰지 않습니다
 *
 * **`DateField` 를 쓰세요.** 손가락이면 이 컴포넌트를, 마우스면 팝오버를
 * 알아서 고릅니다 (`PointerModeProvider`). 강제로 시트를 띄우고 싶으면
 * `<DateField overlay="sheet" />` 면 됩니다.
 *
 * 여기 직접 손을 뻗을 자리는 **모바일 전용 화면**뿐입니다 — 그때도 `DateField` 로
 * 충분하니, 이 페이지는 *시트로 열면 무엇이 달라지는지*를 설명하는 자리로 보세요.
 * Figma 에 같은 이름의 컴포넌트가 있어 이름도 그대로 둡니다.
 *
 * 가로로 놓는 대신 **세로로 쌓습니다.**
 *
 * ### 달력은 한 달만
 *
 * PC 는 두 달을 나란히 놓지만 모바일 폭에 두 달을 넣으면 칸이 손가락보다 작아집니다.
 *
 * 년·월 머리글에는 **화살표가 함께** 붙습니다 (`header="nav"`) — 옆 달로 가는 것이
 * 가장 잦은 이동인데 그때마다 Select 를 열고 고르고 닫는 건 손이 많이 갑니다.
 * Select 도 남겨 둡니다: 먼 달로 갈 길이 화살표뿐이면 수십 번 눌러야 합니다.
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
 *
 * ### 범위 규칙은 PC 와 **같은 훅**에서 옵니다
 *
 * `useDateRangeDraft` — 언제 시작이 되고 언제 종료가 되는지, 시작보다 앞을 고르면
 * 어떻게 되는지, 탭을 누르면 달을 옮길지. **겉모습만 다르지 규칙은 하나여야 합니다.**
 *
 * 2026-08-07 이전에는 이 파일이 그 규칙을 **다시 구현하고** 있었습니다 —
 * `MobileSelect` 가 “목록을 다시 만들지 않고 감싸는 컨테이너만 분기” 한 것과 달리,
 * 여기서는 알맹이까지 복사돼 있어서 한쪽만 고치면 아무도 모르는 상태였습니다.
 *
 * 껍데기(시트 vs 팝오버)는 여전히 갈립니다 — 그건 CSS 로 고를 수 없습니다.
 */

export interface MobileDateFieldProps {
  label?: string;
  /** PC 와 같은 `FormField` 를 씁니다 — 라벨·설명·에러 규칙이 한 벌입니다. */
  required?: boolean;
  description?: string;
  error?: string;
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
  required,
  description,
  error,
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
  /*
    범위를 고르는 규칙은 **PC 패널과 같은 훅**에서 옵니다 — 겉모습만 다르지
    "언제 시작이 되고 언제 종료가 되는지" 는 하나여야 합니다.
    한 달만 보여주므로 monthsVisible 은 1 입니다 (탭을 눌렀을 때 달을 옮길지 판단).
  */
  const {
    draft,
    editing,
    cursor: month,
    setCursor: setMonth,
    focusReq,
    pick,
    editTab,
    reset,
    goToday,
    restart,
    complete,
  } = useDateRangeDraft({ value, precision, monthsVisible: 1 });

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

  // 열 때마다 지금 값에서 다시 시작합니다 — 지난번에 고르다 만 흔적을 남기지 않습니다
  const openSheet = () => {
    if (disabled) return;
    restart(value);
    setOpen(true);
  };

  const today = startOfDay(new Date());

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* 라벨·설명·에러는 PC 와 같은 FormField 에서 나옵니다 — 칩은 형제입니다 */}
      <FormField label={label} required={required} description={description} error={error}>
        <Input
          readOnly
          value={text}
          placeholder="기간을 선택해 주세요"
          disabled={disabled}
          onChange={() => {}}
          onClick={openSheet}
          clearable={false}
          state={error ? "error" : undefined}
          // readOnly 는 키보드를 막으려고 준 것입니다 — 값은 시트로 바꿉니다.
          // 그대로 두면 Readonly 회색이 칠해져 못 만지는 칸으로 보입니다
          className="cursor-pointer border-input-border bg-input-surface"
          trailingIcon={
            <span className="grid place-items-center text-icon-muted-foreground">
              <Calendar />
            </span>
          }
        />
      </FormField>

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
        confirmDisabled={!complete}
        onConfirm={() => {
          onValueChange(draft);
          setOpen(false);
        }}
      >
        {/* 탭이 고른 값을 그대로 보여줍니다 — "시작일" 대신 "2026-07-13" */}
        <DateRangeTabs
          range={draft}
          editing={editing}
          onEditingChange={editTab}
          precision={precision}
        />

        {/*
          달력은 **가운데**입니다. 격자가 7칸 × 44 = 308 이라 시트 폭(358)보다 좁은데,
          w-full 로 늘리면 격자는 그대로고 오른쪽에만 빈자리가 생겨 왼쪽으로 쏠려 보입니다.
        */}
        <div className="flex justify-center">
          <CalendarMonth
            month={month}
            onMonthChange={setMonth}
            range={draft}
            onSelect={pick}
            focusDate={focusReq}
            min={min}
            max={max}
            header="nav"
            className="p-0"
          />
        </div>

        {/*
          보조 동작은 둘 다 link 로 같은 무게입니다 — 어느 쪽도 주 액션이 아닙니다.
          시트에서는 **폭을 반씩 나눠** 씁니다. 손가락으로 누르는 자리라 글자만큼만
          잡아두면 표적이 작고, 왼쪽에 몰려 있으면 오른쪽이 비어 보입니다.
        */}
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="flex-1"
            disabled={!draft.start && !draft.end}
            onClick={reset}
          >
            초기화
          </Button>
          <Button
            variant="link"
            size="sm"
            className="flex-1"
            disabled={isDisabled(today, min, max)}
            onClick={goToday}
          >
            오늘로 이동
          </Button>
        </div>
      </MobileSheet>
    </div>
  );
}
