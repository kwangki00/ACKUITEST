import * as React from "react";
import { Search } from "lucide-react";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { FormField } from "@/components/ui/form-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { DateRange } from "@/components/ui/calendar";
import { formatDate } from "@/lib/date";
import { SORT_OPTIONS, TEST_OPTIONS } from "./data";

/** 이 화면이 들고 있는 조회 조건 한 벌. */
export interface Query {
  period: DateRange;
  keyword: string;
  test: string;
  sort: string;
  excludeBlocked: boolean;
}

/**
 * 조회 조건 — **PC·모바일 한 벌**입니다 (2026-08-12 통합).
 *
 * ### 왜 하나인가
 *
 * 전에는 PC 가 `QueryBar`(안 접히는 한 줄), 모바일이 `FilterBar` 였습니다.
 * **컨트롤 다섯이 두 곳에 각각 적혀 있어서**, 조건을 하나 더하면 한쪽만 고치기 딱
 * 좋은 모양이었습니다 — `PCFilterBar` · `MobileFilterBar` 를 하나로 합쳤던 것과 같은
 * 종류입니다. 그림은 한 폭만 보여줄 수 있으니 **Figma 가 둘로 그리는 것은 맞습니다.**
 *
 * ### 배치는 `FilterBar` 가 자기 폭을 재서 정합니다
 *
 * 창이 아니라 **이 줄의 폭**이 기준입니다 (`--container-pc` 880). 사이드바가 열려
 * 작업 영역이 좁아졌으면 창이 넓어도 접힌 배치가 옳습니다.
 *
 * | | 좁을 때 | 넓을 때 |
 * |---|---|---|
 * | 조건 | 세로로 쌓음 | 가로 한 줄 |
 * | 접힌 줄 | 요약 + 건수 배지 | 요약 + 「조건 변경」 |
 * | 버튼 | 화면을 반씩 | 우측에 내용 폭만큼 |
 *
 * ### 이전 방침 — 「PC 는 접지 않는다」 (2026-08-12 뒤집음)
 *
 * 좌우 분할이라 세로가 넉넉해서 접을 이유가 없다고 적어뒀었습니다. 그 판단 자체는
 * 여전히 맞지만, **조건 정의가 두 벌이 되는 값이 더 컸습니다.** 접는 장치가 하나
 * 늘어나는 것은 감수합니다 — 조회 뒤 자동으로 접히므로 누를 일은 드뭅니다.
 *
 * ### 폭은 `FormField` 에 `@pc/filter:` 로
 *
 * 라벨·설명·에러까지 같은 폭이어야 해서 컨트롤이 아니라 `FormField` 에 줍니다.
 * `@pc/filter:` 를 안 붙이면 좁은 배치에서도 고정돼 줄이 안 찹니다.
 */
export function QueryFilter({
  value,
  onChange,
  onSearch,
  onReset,
  open,
  onOpenChange,
  count,
}: {
  value: Query;
  onChange: (next: Query) => void;
  onSearch: () => void;
  onReset: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 접혔을 때 요약 옆에 붙는 배지. 조회 결과 전체 수입니다. */
  count?: number;
}) {
  const set = <K extends keyof Query>(key: K, v: Query[K]) => onChange({ ...value, [key]: v });

  /*
    접혔을 때 보이는 한 줄입니다. 걸린 조건을 · 로 이어 씁니다 — 펼치면 아래 필드에
    같은 정보가 있어 중복이라, 요약과 건수는 접혔을 때만 나옵니다.
  */
  const summary =
    [
      value.period.start && value.period.end
        ? `${formatDate(value.period.start)} ~ ${formatDate(value.period.end)}`
        : null,
      TEST_OPTIONS.find((o) => o.value === value.test)?.label,
      value.keyword || null,
    ]
      .filter(Boolean)
      .join(" · ") || "조건 없음";

  return (
    <FilterBar
      open={open}
      onOpenChange={onOpenChange}
      summary={summary}
      count={count}
      onReset={onReset}
      /* 조회하면 접힙니다 — 조건은 한 번 정하고 결과를 계속 봅니다 */
      onSearch={() => {
        onOpenChange(false);
        onSearch();
      }}
    >
      {/*
        **넓으면 한 줄**입니다 (Figma `결과조회-기본` 과 같은 모양). 기간이 칩까지
        460 쯤이라 넷을 더하면 1,260 가량 되는데, 1920 에서 사이드바를 빼도 남습니다.

        `flex-wrap` 을 함께 줍니다 — `FilterRow` 는 기본이 `flex-row`(안 접힘)라
        1440 처럼 좁은 데스크톱에서는 넘칩니다. 컨테이너 쿼리로 한 단계를 더 두는
        것보다, 자리가 모자랄 때 알아서 내려가는 편이 어디에 놓아도 무너지지 않습니다
        (`DateRangePicker` 의 칩과 같은 판단입니다).
      */}
      <FilterRow className="@pc/filter:flex-wrap @pc/filter:gap-x-6">
        {/*
          **`w-fit` 이 없으면 이 필드가 줄을 통째로 먹습니다.** `FormField` 기본이
          `w-full` 이라 `flex-wrap` 줄에서 100% 를 요구하고, 그러면 남는 자리를
          칩(`grow`)이 다 먹어 나머지 넷이 다음 줄로 밀립니다.

          좁을 때는 붙이지 않습니다 — 세로로 쌓일 때는 줄을 꽉 채워야 하고,
          그때 칩이 늘어나야 아래 검색어·정렬 줄과 폭이 맞습니다.
        */}
        <FormField label="기간설정" className="@pc/filter:w-fit">
          <DateRangePicker
            quickSelect
            value={value.period}
            onValueChange={(period) => set("period", period)}
          />
        </FormField>
        <FormField label="검색어" className="@pc/filter:w-64">
          <Input
            leadingIcon={<Search />}
            placeholder="성명 또는 차트번호"
            value={value.keyword}
            onChange={(e) => set("keyword", e.target.value)}
            onClear={value.keyword ? () => set("keyword", "") : undefined}
          />
        </FormField>
        <FormField label="검사 항목" className="@pc/filter:w-40">
          <Select
            options={TEST_OPTIONS}
            value={value.test}
            onValueChange={(test) => set("test", test)}
          />
        </FormField>
        <FormField label="정렬" className="@pc/filter:w-36">
          <Select
            options={SORT_OPTIONS}
            value={value.sort}
            onValueChange={(sort) => set("sort", sort)}
          />
        </FormField>
        {/*
          **입력창과 같은 높이의 자리**를 주고 그 안에서 가운데로 둡니다.

          `FilterRow` 는 넓을 때 `items-end` 라 바닥을 맞추는데, 체크박스는 20px 이고
          입력창은 36px(`--h-input-default`)이라 그냥 두면 가운데가 16px 처집니다.
          라벨이 없어 위로도 못 맞추니, 컨트롤 한 칸만큼의 자리를 만들어 그 안에서
          가운데를 잡는 것이 맞습니다 — 버튼 묶음을 `items-end` 로 붙이는 것과 같은
          사정입니다.

          좁을 때는 높이를 주지 않습니다. 세로로 쌓이면 맞출 상대가 없습니다.
        */}
        <div className="flex items-center @pc/filter:h-[var(--h-input-default)]">
          <Checkbox
            label="병원 출력금지 항목 제외"
            checked={value.excludeBlocked}
            onChange={(e) => set("excludeBlocked", e.target.checked)}
          />
        </div>
      </FilterRow>
    </FilterBar>
  );
}
