import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn, DataTableProps } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

type Patient = {
  chart: string;
  name: string;
  test: string;
  date: string;
  count: number;
  state: "완료" | "재검" | "진행중";
};

const TONE = { 완료: "success", 재검: "danger", 진행중: "warning" } as const;

const PATIENTS: Patient[] = [
  { chart: "2312345", name: "김진영", test: "일반혈액검사", date: "2025-06-05", count: 3, state: "완료" },
  { chart: "2312346", name: "이수정", test: "생화학검사", date: "2025-06-05", count: 5, state: "완료" },
  { chart: "2312347", name: "박상철", test: "일반혈액검사", date: "2025-06-04", count: 2, state: "재검" },
  { chart: "2312348", name: "최민영", test: "소변검사", date: "2025-06-04", count: 4, state: "완료" },
  { chart: "2312349", name: "정하늘", test: "생화학검사", date: "2025-06-03", count: 7, state: "진행중" },
  { chart: "2312350", name: "한지우", test: "일반혈액검사", date: "2025-06-03", count: 1, state: "완료" },
  { chart: "2312351", name: "오세훈", test: "면역검사", date: "2025-06-02", count: 6, state: "재검" },
  { chart: "2312352", name: "윤가람", test: "소변검사", date: "2025-06-02", count: 2, state: "완료" },
  { chart: "2312353", name: "장미르", test: "생화학검사", date: "2025-06-01", count: 8, state: "진행중" },
  { chart: "2312354", name: "서다인", test: "일반혈액검사", date: "2025-06-01", count: 3, state: "완료" },
];

const COLUMNS: DataTableColumn<Patient>[] = [
  { accessorKey: "chart", header: "차트번호", meta: { width: "w-28" } },
  { accessorKey: "name", header: "성명", meta: { width: "w-20" } },
  { accessorKey: "test", header: "검사 항목" },
  { accessorKey: "date", header: "접수일", meta: { width: "w-28" } },
  // 숫자는 오른쪽 정렬입니다 — 자릿수가 맞아야 크기를 눈으로 비교할 수 있습니다
  { accessorKey: "count", header: "검사수", meta: { width: "w-20", align: "right" } },
  {
    accessorKey: "state",
    header: "상태",
    meta: { width: "w-24", align: "center" },
    // 정렬은 원본 값으로 하고 그림만 배지입니다
    cell: ({ row }) => (
      <Badge tone={TONE[row.original.state]} size="sm">
        {row.original.state}
      </Badge>
    ),
  },
];

/**
 * **표의 상태 계산을 TanStack Table(v9)에 맡긴 완성형**입니다.
 * Figma 에 대응물이 없습니다 — `Select` · `ConfirmDialog` 와 같은 층위입니다.
 *
 * ### 무엇을 대신해 주나
 *
 * | | 직접 짜면 | `DataTable` |
 * |---|---|---|
 * | 정렬 | `sort` 상태 + 비교 함수를 화면마다 | `accessorKey` 만 있으면 됩니다 |
 * | 전체 선택 | indeterminate 계산을 손으로 | `selectable` 한 줄 |
 * | 페이지네이션 | 배열 자르기 + 페이지 수 계산 | `paginated` |
 * | 빈 결과 | `colSpan` 을 눈으로 세기 | 보이는 열 수를 자동으로 |
 *
 * ### 그림은 지금 부품이 그대로 그립니다
 *
 * TanStack 은 **headless** 라 마크업을 만들지 않습니다. `Table` · `TableRow` ·
 * `TableCell` 은 Figma 와 1:1 인 채로 두고 **계산만** 가져왔습니다.
 *
 * ### v9 라 인터넷 예제가 그대로 안 됩니다
 *
 * 훅이 `useReactTable` 이 아니라 **`useTable`** 이고, 기능을 `tableFeatures({...})`
 * 로 **켠 것만** 번들에 들어옵니다. 자세한 것은 `data-table.tsx` 머리말에 있습니다.
 *
 * ### 열 폭·정렬은 `meta` 로 줍니다
 *
 * ```tsx
 * { accessorKey: "count", header: "검사수", meta: { width: "w-20", align: "right" } }
 * ```
 *
 * `width` 는 Tailwind 클래스입니다. 사용자가 끌어서 폭을 바꾸는 기능
 * (`columnSizingFeature`)은 켜지 않았습니다.
 */
const meta = {
  title: "Data/DataTable",
  /*
    제네릭 컴포넌트라 Storybook 이 TData 를 못 좁힙니다 — 그대로 두면 RowData 로
    풀려서 args 에 Patient 열을 못 넘깁니다. 구체 타입으로 고정합니다
    (`AccordionFlatProps` · `SidebarItemFlatProps` 와 같은 사정).
  */
  component: DataTable as React.FC<DataTableProps<Patient>>,
  parameters: { layout: "padded" },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    getRowId: { control: false },
    emptyType: { control: "inline-radio", options: ["no-result", "no-data", "error"] },
  },
  args: { columns: COLUMNS, data: PATIENTS, getRowId: (r: Patient) => r.chart },
} satisfies Meta<DataTableProps<Patient>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **열 이름을 누르면 정렬됩니다.** 정렬되지 않은 열의 화살표는 hover 에서만
 * 나타납니다 — 늘 보이면 어느 열이 정렬됐는지 흐려지고, 없으면 정렬되는 줄 모릅니다.
 *
 * `상태` 열은 배지로 그리지만 **정렬은 원본 값**으로 합니다.
 */
export const 기본: Story = {
  args: {},
};

/**
 * **`selectable` 한 줄이면 체크박스 열이 생깁니다.** 열 정의에 직접 넣지 마세요 —
 * 전체 선택의 **indeterminate**(일부만 선택)까지 함께 처리합니다.
 *
 * 몇 개를 골랐는지 아래에 나옵니다. `onSelectedChange` 는 TanStack 의 row 객체가
 * 아니라 **원본 배열**을 돌려줍니다.
 *
 * **`getRowId` 를 꼭 넘기세요.** 안 넘기면 배열 index 라, 정렬하거나 페이지를
 * 넘기면 선택이 엉뚱한 행으로 옮겨갑니다.
 */
export const 선택: Story = {
  render: function Selectable() {
    const [picked, setPicked] = useState<Patient[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <DataTable
          columns={COLUMNS}
          data={PATIENTS}
          getRowId={(r) => r.chart}
          selectable
          onSelectedChange={setPicked}
        />
        <p className="text-xs text-text-subtle">
          고른 값 {picked.length}건 — {picked.map((p) => p.name).join(" · ") || "없음"}
        </p>
      </div>
    );
  },
};

/**
 * **받은 배열을 잘라 쓰는 클라이언트 페이지네이션**입니다. 한 쪽이면 아예 안 나옵니다.
 *
 * 서버가 잘라 주면 `paginated` 를 끄고 바깥에서 `Pagination` 을 쓰세요 — 여기 것은
 * 전체 배열을 들고 있다는 전제입니다.
 */
export const 페이지네이션: Story = {
  args: { paginated: true, pageSize: 4 },
};

/**
 * **`paginated` 를 끄면 받은 행이 전부 나옵니다.**
 *
 * 당연해 보이지만 **한동안 안 그랬습니다** (2026-08-13 수정). `rowPaginationFeature` 가
 * features 에 늘 들어 있어서 `table.getRowModel()` 이 항상 페이지네이션을 거쳤고,
 * TanStack 기본 `pageSize` 가 10 이라 **몇 건을 넘겨도 10행만 나오고 아래는 조용히
 * 사라졌습니다.** 쪽 버튼은 `paginated` 일 때만 그리므로 화면에는 그냥
 * 「10행짜리 표」로 보일 뿐 잘렸다는 신호가 없습니다.
 *
 * **행 수를 세는 확인이 없으면 못 잡습니다** — 표는 멀쩡히 그려지고 스크롤도 됩니다.
 * 이 스토리가 그 자리를 지킵니다: 아래 표는 **24행이 전부** 보여야 합니다. 10행만 보이면 되돌아간 것입니다.
 */
export const 전부보임: Story = {
  name: "쪽 나눔 없음",
  /*
    **행을 24로 늘려 씁니다.** 위 스토리들이 쓰는 10행은 하필 TanStack 기본
    `pageSize` 와 같은 수라, 잘려도 티가 나지 않아 감시 구실을 못 합니다.
  */
  args: {
    data: Array.from({ length: 24 }, (_, i) => ({
      ...PATIENTS[i % PATIENTS.length],
      no: i + 1,
      chart: String(2312345 + i),
    })),
    paginated: false,
    framed: true,
    stickyHeader: true,
    className: "h-90",
  },
};

/**
 * **어떤 열을 볼지와 순서를 사용자가 고릅니다.** 오른쪽 위 「열」 버튼입니다.
 *
 * `ListItem` 을 쓰지 않았습니다 — `ListItem` 은 `<button>` 이라 안에 순서 버튼을
 * 넣으면 **버튼 안의 버튼**이 됩니다 (`LookupRow` · `DropdownMenuItem` 과 같은 사정).
 * `DropdownMenu` 도 아닙니다 — 그건 누르면 실행하고 끝나는 메뉴라 표식이 없는데,
 * 여기는 지금 무엇이 켜져 있는지 계속 보여야 하고 연달아 여러 개를 켭니다.
 *
 * **마지막 한 열은 끌 수 없습니다.** 전부 끄면 열 이름조차 남지 않아 무엇을 보던
 * 화면인지 알 수 없게 됩니다.
 */
export const 열표시: Story = {
  name: "열 표시 · 순서",
  args: { columnControl: true },
};

/**
 * **헤더 행은 남깁니다** — 지우면 어떤 열을 조회했는지 알 수 없습니다.
 * `colSpan` 은 지금 보이는 열 수로 자동 계산됩니다 (열을 껐다 켜도 맞습니다).
 *
 * 셋의 차이는 「다음에 무엇을 하느냐」입니다 — `no-result` 는 조건을 바꾸고,
 * `no-data` 는 만들고, `error` 는 다시 시도합니다. 컨트롤에서 바꿔 보세요.
 */
export const 빈결과: Story = {
  name: "빈 결과",
  args: { data: [], emptyType: "no-result", onEmptyAction: () => {} },
};

/**
 * **조회 화면에서 실제로 쓰는 모양**입니다 — 정렬 · 선택 · 페이지네이션 · 열 제어를
 * 한꺼번에 켜고, 행을 누르면 상세가 열리는 자리까지.
 *
 * 체크박스와 행 클릭이 함께 있으면 **누를 것이 둘**입니다. 체크박스를 눌러도 상세로
 * 가지 않도록 이벤트를 끊어 두었습니다.
 */
export const 전부: Story = {
  name: "전부 — 조회 화면",
  render: function All() {
    const [picked, setPicked] = useState<Patient[]>([]);
    const [active, setActive] = useState<string>();
    return (
      <div className="flex flex-col gap-3">
        <DataTable
          columns={COLUMNS}
          data={PATIENTS}
          getRowId={(r) => r.chart}
          selectable
          paginated
          pageSize={5}
          columnControl
          onSelectedChange={setPicked}
          onRowClick={(r) => setActive(r.chart)}
          activeRowId={active}
        />
        <p className="text-xs text-text-subtle">
          {active ? `${active} 를 보고 있습니다` : "행을 누르면 상세가 열립니다"} · 선택{" "}
          {picked.length}건
        </p>
      </div>
    );
  },
};
