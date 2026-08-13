import * as React from "react";
import { Download, Pencil, Printer, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
import { Panel } from "../panel";
import {
  ORDERS,
  OWNER_OPTIONS,
  STATE_OPTIONS,
  STATE_TONE,
  TEST_OPTIONS,
  type TestOrder,
} from "./data";

/**
 * **레이아웃1 — 위 조회 조건 · 아래 목록 표.**
 *
 * 이 제품에서 가장 흔한 화면 모양입니다. `결과조회` 는 환자를 옮겨 다니느라 좌우로
 * 갈라 놓은 **예외**고, 그 흐름이 필요 없는 화면은 전부 이 모양입니다 — 조건을 정하고,
 * 결과를 훑고, 한 줄을 골라 무언가를 합니다.
 *
 * ```
 * Content
 * ├ FilterBar        조회하면 접힙니다 (200 → 56)
 * └ 본문 p-5
 *    └ Panel         제목줄 · 표 · 페이지네이션 한 덩어리
 * ```
 *
 * ### `결과조회` 와 갈리는 것 둘
 *
 * | | `결과조회` | **여기** |
 * |---|---|---|
 * | 판 | 좌우 둘 (540 + 나머지) | **하나** — 폭을 다 씁니다 |
 * | 페이지네이션 | `Pagination` 을 밖에 둠 | **`DataTable paginated`** |
 *
 * 페이지네이션이 갈리는 이유는 **자료가 어디서 잘리느냐**입니다. `결과조회` 는 서버가
 * 한 쪽씩 주므로(전체 979 · 받은 것 14) 받은 배열을 자르면 안 되지만, 여기는 24건을
 * 통째로 들고 있어 `DataTable` 이 잘라 쓰는 것이 맞습니다. **서버 페이지네이션이 붙는
 * 날 `paginated` 를 끄고 바깥에 `Pagination` 을 두세요.**
 *
 * ### 조회 조건은 `결과조회` 와 같은 부품입니다
 *
 * `FilterBar` + `FormField` + 컨트롤. 배치는 `FilterBar` 가 **자기 폭을 재서** 정하므로
 * 화면은 PC·모바일을 판단하지 않습니다. 폭은 `FormField` 에 `@pc/filter:` 로 줍니다 —
 * 안 붙이면 좁은 배치에서도 고정돼 줄이 안 찹니다.
 */

interface Query {
  period: DateRange;
  keyword: string;
  test: string;
  state: string;
  owner: string;
}

const today = startOfDay(new Date());

const EMPTY_QUERY: Query = {
  period: { start: addDays(today, -29), end: today },
  keyword: "",
  test: "all",
  state: "all",
  owner: "all",
};

/**
 * 열 정의 — **모듈 최상단**입니다. 컴포넌트 안에서 만들면 렌더마다 새 배열이 되어
 * 표가 통째로 다시 만들어지고 정렬 상태가 풀립니다.
 *
 * 폭·정렬은 `meta` 로 줍니다. **정렬을 켜는 열은 훑는 기준이 되는 것만**입니다 —
 * 검사수처럼 세는 값이나 상태처럼 순서에 뜻이 없는 값에 화살표가 보이면 눌러 보게 됩니다.
 */
const COLUMNS: DataTableColumn<TestOrder>[] = [
  { accessorKey: "date", header: "접수일", meta: { width: "w-28" } },
  { accessorKey: "receipt", header: "접수번호", meta: { width: "w-32" }, enableSorting: false },
  { accessorKey: "name", header: "성명", meta: { width: "w-20" } },
  { accessorKey: "chart", header: "차트번호", meta: { width: "w-24" }, enableSorting: false },
  // 폭을 안 주는 열이 남는 자리를 먹습니다 — 하나만 비워 둡니다
  { accessorKey: "test", header: "검사항목" },
  { accessorKey: "owner", header: "담당자", meta: { width: "w-20" }, enableSorting: false },
  {
    accessorKey: "count",
    header: "검사수",
    meta: { width: "w-16", align: "right" },
    enableSorting: false,
  },
  {
    accessorKey: "state",
    header: "상태",
    meta: { width: "w-20", align: "center" },
    enableSorting: false,
    // 3종이라 배지입니다. 색만으로 구분하지 않고 글자를 함께 씁니다
    cell: ({ row }) => (
      <span className="flex justify-center">
        <Badge tone={STATE_TONE[row.original.state]} size="sm">
          {row.original.state}
        </Badge>
      </span>
    ),
  },
  {
    accessorKey: "doneAt",
    header: "완료일",
    meta: { width: "w-28" },
    // 안 끝난 것은 빈칸이 아니라 「-」 입니다 — 빈칸은 값이 빠진 것인지 없는 것인지 모릅니다
    cell: ({ row }) => row.original.doneAt || <span className="text-text-disabled">-</span>,
  },
];

/** 조회 조건. `결과조회` 의 `QueryFilter` 와 같은 구조입니다. */
function OrderFilter({
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
  count?: number;
}) {
  const set = <K extends keyof Query>(key: K, v: Query[K]) => onChange({ ...value, [key]: v });

  // 걸린 조건만 · 로 이어 씁니다 — 「전체」는 조건이 아니라 안 건 것입니다
  const summary =
    [
      value.period.start && value.period.end
        ? `${formatDate(value.period.start)} ~ ${formatDate(value.period.end)}`
        : null,
      value.test !== "all" ? value.test : null,
      value.state !== "all" ? value.state : null,
      value.owner !== "all" ? value.owner : null,
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
      onSearch={() => {
        onOpenChange(false);
        onSearch();
      }}
    >
      <FilterRow className="@pc/filter:flex-wrap @pc/filter:gap-x-6">
        {/* `w-fit` 이 없으면 이 필드가 100% 를 요구해 나머지가 다음 줄로 밀립니다 */}
        <FormField label="접수일" className="@pc/filter:w-fit">
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
        <FormField label="검사항목" className="@pc/filter:w-44">
          <Select
            options={TEST_OPTIONS}
            value={value.test}
            onValueChange={(test) => set("test", test)}
          />
        </FormField>
        <FormField label="상태" className="@pc/filter:w-32">
          <Select
            options={STATE_OPTIONS}
            value={value.state}
            onValueChange={(state) => set("state", state)}
          />
        </FormField>
        <FormField label="담당자" className="@pc/filter:w-32">
          <Select
            options={OWNER_OPTIONS}
            value={value.owner}
            onValueChange={(owner) => set("owner", owner)}
          />
        </FormField>
      </FilterRow>
    </FilterBar>
  );
}

export function Layout1Screen() {
  const [query, setQuery] = React.useState<Query>(EMPTY_QUERY);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<TestOrder[]>([]);

  /*
    조회 버튼을 눌러야 반영됩니다 — 치는 동안 표가 계속 바뀌면 무엇을 보고 있었는지
    놓칩니다. 그래서 조건과 **적용된 조건**을 따로 둡니다.
  */
  const [applied, setApplied] = React.useState<Query>(EMPTY_QUERY);

  const rows = React.useMemo(() => {
    const kw = applied.keyword.trim();
    return ORDERS.filter(
      (o) =>
        (applied.test === "all" || o.test === applied.test) &&
        (applied.state === "all" || o.state === applied.state) &&
        (applied.owner === "all" || o.owner === applied.owner) &&
        (!kw || o.name.includes(kw) || o.chart.includes(kw))
    );
  }, [applied]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <OrderFilter
        value={query}
        onChange={setQuery}
        onSearch={() => setApplied(query)}
        onReset={() => {
          setQuery(EMPTY_QUERY);
          setApplied(EMPTY_QUERY);
        }}
        open={open}
        onOpenChange={setOpen}
        count={rows.length}
      />

      {/* 본문 여백 20 — 위 조회 조건(pad 20)과 같아야 안쪽으로 밀려 보이지 않습니다 */}
      <div className="flex min-h-0 flex-1 p-5">
        {/*
          `gap-0` 입니다. 제목줄 · 표 · 페이지네이션이 **한 표에 속하므로** 사이가
          벌어지면 서로 다른 블록으로 읽힙니다 — `PatientList` 와 같은 판단입니다.
          숨통이 필요한 자리는 `DataTable` 이 자기 여백으로 냅니다.
        */}
        <Panel className="min-w-0 flex-1 gap-0">
          <DataTable
            columns={COLUMNS}
            data={rows}
            // 접수번호가 행의 정체입니다 — index 로 두면 정렬한 뒤 선택이 엉뚱한 행으로 갑니다
            getRowId={(o) => o.id}
            selectable
            onSelectedChange={setSelected}
            paginated
            pageSize={10}
            columnControl
            stickyHeader
            framed
            headerAlign="center"
            title="검사 접수 목록"
            count={
              selected.length ? `총 ${rows.length}건 / ${selected.length}건 선택됨` : `총 ${rows.length}건`
            }
            actions={
              <>
                {/*
                  편집은 **한 줄만 골랐을 때**입니다 — 여럿을 한 번에 고치는 화면이
                  따로 있어야 하는 동작이라, 여기서 열어 주면 무엇이 바뀌는지 알 수 없습니다.
                */}
                {selected.length === 1 && (
                  <Button variant="outline" size="sm">
                    <Pencil />
                    편집
                  </Button>
                )}
                {/* 아이콘만 있는 버튼이라 aria-label 이 필수입니다. 툴팁은 눈으로 보는 사람 몫 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="내려받기">
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>내려받기</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="인쇄">
                      <Printer />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>인쇄</TooltipContent>
                </Tooltip>
              </>
            }
            // 조회했는데 0건이면 조건을 바꾸라고 알립니다
            emptyType="no-result"
            onEmptyAction={() => {
              setQuery(EMPTY_QUERY);
              setApplied(EMPTY_QUERY);
              setOpen(true);
            }}
          />
        </Panel>
      </div>
    </div>
  );
}
