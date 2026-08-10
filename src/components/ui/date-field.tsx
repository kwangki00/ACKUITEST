import * as React from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
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
 * ### 좁아지면 스스로 쌓입니다
 *
 * 입력창 256 + 칩 넷은 한 줄에 **512 쯤** 필요합니다. 그보다 좁아지면 세로로 쌓고
 * 칩이 폭을 나눠 가집니다 (`MobileDateField` 와 같은 규칙).
 *
 * 판단 기준은 브라우저 창이 아니라 **자기 폭**입니다 — `FilterBar` 안에서는 조건 칸이
 * 얼마나 넓은지가 기준이지 창이 아닙니다. 경계는 Tailwind 기본 `@lg`(512).
 *
 * 시트로 열어야 하면 여전히 `MobileDateField` 입니다 — 팝오버냐 시트냐는
 * CSS 로 고를 수 없습니다.
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
  presets?: DatePreset[];
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
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
}: DateFieldProps) {
  // 단위가 바뀌면 빠른 선택도 바뀝니다 — 월 화면에 "3일" 이 붙어 있으면
  // 눌러도 월 하나로 뭉개져서 무엇을 고른 것인지 설명되지 않습니다
  const quick = presets ?? PRESETS_BY_PRECISION[precision];
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
    // 좁아지면 세로로 쌓습니다 — 입력창 256 + 칩이 한 줄에 안 들어갑니다.
    // 창이 아니라 **자기 폭**을 재야 합니다: FilterBar 안에서는 조건 칸이 얼마나
    // 넓은지가 기준이지 브라우저 창이 아닙니다 (FilterBar 와 같은 규칙).
    // 경계는 Tailwind 기본 @lg(512) — 입력창 256 + 칩 4개가 겨우 들어가는 폭입니다
    <div
      className={cn(
        // w-full 이 **꼭 필요합니다.** container-type: inline-size 는 내용이 폭을
        // 정하면 성립하지 않습니다 — 가로 줄 안에서 내용만큼 넓어지는 flex 항목이면
        // 브라우저가 폭을 못 정해 0 으로 무너집니다. 폭을 부모에서 받아야 합니다.
        // (FilterBar 는 세로 흐름의 블록이라 이 문제가 없습니다)
        "@container/datefield w-full min-w-0",
        className
      )}
    >
      <div className="flex flex-col gap-2 @lg/datefield:flex-row @lg/datefield:items-start">
      <FormField
        label={label}
        required={required}
        description={description}
        error={error}
        className="w-full @lg/datefield:w-64"
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

      <div className="flex min-w-0 flex-col gap-1.5">
        {/* 라벨 자리를 비워 입력창과 아래를 맞춥니다.
            빈 div 에 높이를 박지 않고 라벨과 같은 글자를 숨겨 둡니다 —
            글꼴이나 라벨 크기가 바뀌어도 저절로 따라옵니다.
            세로로 쌓일 때는 옆에 맞출 것이 없으므로 이 자리도 필요 없습니다 */}
        {label && (
          <span
            aria-hidden
            className="invisible hidden text-sm font-medium @lg/datefield:block"
          >
            &nbsp;
          </span>
        )}
        <ToggleGroup
          variant="outline"
          value={active}
          onValueChange={(next: string) => {
            const p = quick.find((x) => x.label === next);
            if (p) onValueChange(p.range());
          }}
          disabled={disabled}
          aria-label="빠른 선택"
          // 세로로 쌓이면 칩이 폭을 나눠 가집니다 — MobileDateField 와 같은 규칙
          className="w-full @lg/datefield:w-auto"
        >
          {quick.map((p) => (
            <ToggleItem
              key={p.label}
              value={p.label}
              className="flex-1 @lg/datefield:flex-none"
            >
              {p.label}
            </ToggleItem>
          ))}
        </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
