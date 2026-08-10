import * as React from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { useOverlay, type OverlayMode } from "@/components/ui/pointer-mode";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import {
  DateRangePicker,
  PRESETS_BY_PRECISION,
  type DatePreset,
} from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
import { isSameDay, type DatePrecision } from "@/lib/date";

/**
 * Figma: PCDateField (3 변형 — Precision 3)
 *
 * 조회 조건의 기간 입력 **한 묶음**입니다 — 라벨 + 입력창 + 빠른 선택.
 *
 * 빠른 선택이 패널 안에도 있고 여기 바깥에도 있는 이유는, 조회 화면에서
 * **가장 많이 하는 일이 "최근 N일"** 이기 때문입니다. 패널을 열지 않고 끝나는
 * 경로를 한 번 더 앞에 둡니다.
 *
 * ### 연동 규칙 — 칩은 거짓말을 하면 안 됩니다
 *
 * | | |
 * |---|---|
 * | 칩을 누름 | 입력창 값이 채워집니다 |
 * | 달력에서 임의 기간을 고름 | **칩 선택이 풀립니다** |
 *
 * 7일을 눌러둔 채로 달력에서 3월 한 달을 고르면, 칩은 여전히 "7일" 을 가리키게 됩니다.
 * 그러면 화면이 거짓 정보를 말합니다. 값이 어느 칩과도 맞지 않으면 아무것도 켜지 않습니다.
 *
 * ### 왜 Chip 이 아니라 ToggleGroup 인가
 *
 * Figma description 은 "칩" 이라고 부르지만 실제로 얹은 것은 `ToggleGroup(Outline)` 입니다.
 * 하나만 켜지는 배타 선택이라 세그먼트 컨트롤이 맞습니다 — `Chip` 은 삭제할 수 있는
 * 태그이고, 여기서는 지우는 개념이 없습니다.
 *
 * ### 자리가 모자라면 칩이 다음 줄로 내려갑니다
 *
 * 입력창 256 + 칩 넷은 한 줄에 **460 쯤** 필요합니다. 그보다 좁으면 `flex-wrap` 이
 * 칩을 다음 줄로 내립니다.
 *
 * **컨테이너 쿼리를 쓰지 않습니다.** 그건 폭을 부모에서 받아야만 성립해서, 폭 없는
 * 자리(내용만큼 넓어지는 flex 항목)에 놓으면 **조용히 무너집니다.** `flex-wrap` 은
 * 그런 조건이 없어 어디에 놓아도 동작합니다.
 *
 * ### 시트로 열지 팝오버로 열지는 앱 루트가 정합니다
 *
 * `PointerModeProvider` — **손가락이면 시트, 마우스면 팝오버**입니다.
 * 호출부는 `<DateField/>` 만 쓰고 아무 판단도 하지 않습니다.
 *
 * **폭이 아니라 포인터**가 기준입니다. 좁은 데스크톱 창에는 팝오버가, 넓은
 * 태블릿에는 시트가 맞습니다 — 폭으로 정하면 둘 다 틀립니다.
 *
 * 화면 하나만 예외로 두고 싶으면 `overlay` 를 직접 넘기세요.
 * 시트 쪽 구현은 `MobileDateField` 이고 거기서는 칩이 **폭을 나눠 갖습니다**.
 *
 * `error` 를 쓰면 에러 줄만큼 필드가 길어져 칩이 그 바닥에 맞습니다 —
 * 조회 조건에서는 잘 쓰지 않는 조합입니다.
 */

export interface DateFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  /** 고르는 단위. 빠른 선택 목록도 여기에 맞춰 바뀝니다. */
  precision?: DatePrecision;
  /** 화면마다 다릅니다. 항목이 6개를 넘으면 가로가 좁아지니 줄이세요. */
  /** 끄면 입력창만 남습니다 — 생년월일처럼 정해진 기간 묶음이 없는 경우. */
  presets?: DatePreset[] | false;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
  /**
   * 어떻게 열지. **기본은 `PointerModeProvider` 가 정합니다** — 손가락이면 시트,
   * 마우스면 팝오버. 화면 하나만 예외로 두고 싶을 때만 직접 넘기세요.
   */
  overlay?: OverlayMode;
  /** 시트를 문서·데모 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

export function DateField({
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
  overlay,
  container,
}: DateFieldProps) {
  /*
    시트냐 팝오버냐는 **폭이 아니라 포인터**의 문제라 CSS 로 고를 수 없습니다 —
    시트가 아래에서 올라오는 건 엄지가 닿는 곳이라서고, 팝오버가 트리거에 붙는 건
    마우스가 이미 거기 있어서입니다. 좁은 데스크톱 창에는 팝오버가, 넓은 태블릿에는
    시트가 맞습니다. 그래서 앱 루트에서 한 번 정하고 여기서는 받아만 씁니다.
  */
  if (useOverlay(overlay) === "sheet") {
    return (
      <MobileDateField
        label={label}
        required={required}
        description={description}
        error={error}
        value={value}
        onValueChange={onValueChange}
        precision={precision}
        presets={presets}
        min={min}
        max={max}
        disabled={disabled}
        className={className}
        container={container}
      />
    );
  }

  // 단위가 바뀌면 빠른 선택도 바뀝니다 — 월 화면에 "3일" 이 붙어 있으면
  // 눌러도 월 하나로 뭉개져서 무엇을 고른 것인지 설명되지 않습니다
  const quick = presets === false ? [] : (presets ?? PRESETS_BY_PRECISION[precision]);
  /**
   * 지금 값과 맞아떨어지는 칩을 찾습니다.
   *
   * 프리셋은 **누를 때마다 오늘 기준으로 다시 계산**되므로, 저장해둔 라벨을 믿지 않고
   * 매번 값을 맞춰 봅니다 — 어제 "7일" 을 눌러둔 화면을 오늘 열면 그 기간은
   * 더 이상 최근 7일이 아닙니다.
   */
  const active =
    quick.find((p) => {
      const r = p.range();
      return isSameDay(r.start, value.start) && isSameDay(r.end, value.end);
    })?.label ?? "";

  return (
    // 컨테이너 쿼리를 쓰지 않습니다 — 그건 폭을 부모에서 받아야만 성립해서,
    // 폭 없는 자리에 놓으면 조용히 무너집니다. flex-wrap 은 그런 조건이 없습니다:
    // 자리가 모자라면 칩이 알아서 다음 줄로 내려갑니다 (입력창 256 + 칩 ≈ 464).
    // items-end 라 한 줄일 때 칩 바닥이 입력창 바닥과 맞습니다 — 빈 라벨 자리를
    // 넣어 맞추던 것을 대신합니다 (줄바꿈되면 그 빈 자리가 유령 여백으로 남습니다)
    <div className={cn("flex flex-wrap items-end gap-2", className)}>
      <FormField
        label={label}
        required={required}
        description={description}
        error={error}
        className="w-64"
      >
        <DateRangePicker
          value={value}
          onValueChange={onValueChange}
          precision={precision}
          min={min}
          max={max}
          presets={quick}
          disabled={disabled}
          state={error ? "error" : "default"}
        />
      </FormField>

      {quick.length > 0 && (
        <ToggleGroup
          variant="outline"
          value={active}
          onValueChange={(next: string) => {
            const p = quick.find((x) => x.label === next);
            if (p) onValueChange(p.range());
          }}
          disabled={disabled}
          aria-label="빠른 선택"
        >
          {quick.map((p) => (
            <ToggleItem key={p.label} value={p.label}>
              {p.label}
            </ToggleItem>
          ))}
        </ToggleGroup>
      )}
    </div>
  );
}
