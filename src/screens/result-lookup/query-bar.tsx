import * as React from "react";
import { RefreshCw, Search } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { DateRange } from "@/components/ui/calendar";
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
 * 조회 조건 — **한 줄**입니다.
 *
 * ### `FilterBar` 를 쓰지 않았습니다
 *
 * `FilterBar` 는 조회 뒤에 **접어서 표에 세로 자리를 내주는** 장치입니다.
 * 이 화면은 좌우로 나눠 세로가 이미 넉넉하니 접을 이유가 없고, 접는 장치를 두면
 * 누를 것만 하나 늘어납니다.
 *
 * 세로로 긴 목록 하나가 화면을 채우는 구성(모바일 · 단일 표)에서는 `FilterBar` 가
 * 맞습니다 — 거기서는 접으면 표가 150px 넓어집니다.
 *
 * ### 라벨은 `FormField` 가 답니다
 *
 * `htmlFor` 도 `id` 도 넘기지 않습니다. 버튼 묶음만 라벨이 없어서 `items-end` 로
 * 필드 바닥에 맞춥니다 — 안 그러면 라벨 높이(17px)만큼 위로 뜹니다.
 */
export function QueryBar({
  value,
  onChange,
  onSearch,
  onReset,
}: {
  value: Query;
  onChange: (next: Query) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof Query>(key: K, v: Query[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-border-gray-light bg-background-white px-6 py-4">
      <FormField label="기간설정" className="w-fit">
        <DateRangePicker
          quickSelect
          value={value.period}
          onValueChange={(period) => set("period", period)}
        />
      </FormField>

      <FormField label="조회조건" className="w-fit">
        <div className="flex items-center gap-3">
          <Input
            leadingIcon={<Search />}
            placeholder="성명 또는 차트번호"
            value={value.keyword}
            onChange={(e) => set("keyword", e.target.value)}
            onClear={value.keyword ? () => set("keyword", "") : undefined}
            className="w-64"
          />
          <div className="w-40">
            <Select
              options={TEST_OPTIONS}
              value={value.test}
              onValueChange={(test) => set("test", test)}
            />
          </div>
          <Checkbox
            label="병원 출력금지 항목 제외"
            checked={value.excludeBlocked}
            onChange={(e) => set("excludeBlocked", e.target.checked)}
          />
          <div className="w-36">
            <Select
              options={SORT_OPTIONS}
              value={value.sort}
              onValueChange={(sort) => set("sort", sort)}
            />
          </div>
        </div>
      </FormField>

      {/* 라벨이 없어 items-end 로 필드 바닥에 붙입니다 */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw />
          초기화
        </Button>
        {/* 화면의 주 액션은 하나뿐입니다 — 조회 */}
        <Button onClick={onSearch}>
          <Search />
          조회
        </Button>
      </div>
    </div>
  );
}
