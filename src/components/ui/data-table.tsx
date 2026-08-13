import * as React from "react";
import { ArrowDown, ArrowUp, Columns3 } from "lucide-react";
import {
  columnOrderingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { CellData, ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Pagination } from "./pagination";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { TableEmptyRow } from "./empty-state";
import type { EmptyStateType } from "./empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

/**
 * **표의 상태 계산을 TanStack Table 에 맡긴 완성형**입니다.
 * Figma 에 대응물이 없습니다 — `Select` · `ConfirmDialog` 와 같은 층위입니다.
 *
 * ### 왜 완성형인가
 *
 * `Table` · `TableRow` · `TableCell` 은 **Figma 와 1:1 인 표현 부품**이라 그대로 둡니다.
 * TanStack 은 headless 라 마크업을 만들지 않으므로, 정렬·선택·페이지네이션 **계산만**
 * 가져오고 그림은 지금 부품이 그대로 그립니다. 그래서 둘이 겹치지 않습니다.
 *
 * 화면마다 `useTable` 을 직접 부르면 같은 조립을 매번 다시 짜게 됩니다 —
 * 정렬 화살표를 `TableHead` 에 연결하는 방식, 전체 선택의 indeterminate, 빈 결과의
 * `colSpan` 이 화면마다 조금씩 달라집니다.
 *
 * ### v9 입니다 — 인터넷 예제는 대부분 v8 이라 그대로 안 됩니다
 *
 * | | v8 | **v9 (여기)** |
 * |---|---|---|
 * | 훅 | `useReactTable` | **`useTable`** |
 * | 기능 | 항상 전부 포함 | **`tableFeatures({...})` 로 켠 것만** — 트리셰이킹됩니다 |
 * | 행 모델 | `getSortedRowModel()` | **`createSortedRowModel()`** 을 features 에 넘김 |
 * | 상태 읽기 | `table.getState()` | **`table.state`** |
 *
 * `useLegacyTable`(v8 API 흉내)도 있지만 **`@deprecated`** 라 쓰지 않습니다.
 * 메서드 이름(`getIsSorted` · `getToggleAllRowsSelectedHandler` …)은 v8 과 같습니다.
 *
 * ### 안 넣은 것
 *
 * 필터링 · 그룹핑 · 열 너비 조절 · 가상 스크롤은 켜지 않았습니다. 켜면 번들에
 * 들어오는데 아직 쓸 자리가 없습니다 — 필요해지면 `dataTableFeatures` 에 한 줄
 * 더하면 됩니다.
 *
 * **서버 페이지네이션이 붙으면** `paginated` 를 끄고 바깥에서 `Pagination` 을 쓰세요.
 * 여기 페이지네이션은 받은 배열을 잘라 쓰는 클라이언트 방식입니다.
 */

/**
 * 켠 기능만 번들에 들어옵니다 — v9 가 v8 과 가장 크게 다른 점입니다.
 * 모듈 최상단에 한 번만 만듭니다. 컴포넌트 안에서 만들면 렌더마다 새 객체가 되어
 * 테이블이 통째로 다시 만들어집니다.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
});

export type DataTableFeatures = typeof dataTableFeatures;

/**
 * 열 정의. `ColumnDef` 의 첫 인자가 features 인 것이 v9 입니다.
 *
 * `TValue` 기본이 `any` 인 것은 TanStack 이 권하는 방식입니다 — 열마다 값 타입이
 * 다른 배열을 하나로 묶어야 해서, 좁히면 `accessorFn` 의 반환 타입이 서로 안 맞습니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData, TValue = any> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;

/**
 * 열의 폭·정렬. **`columnSizingFeature` 를 켜지 않았습니다** — 그건 사용자가 끌어서
 * 너비를 바꾸는 기능이라 무겁고, 여기 필요한 것은 고정 폭 한 줄입니다.
 *
 * `width` 는 Tailwind 클래스(`"w-24"`)로 줍니다. `align` 은 `TableHead` · `TableCell`
 * 이 이미 갖고 있는 축이라 그대로 넘깁니다 — 숫자 열은 `right` 입니다.
 */
export interface DataTableColumnMeta {
  width?: string;
  align?: "left" | "center" | "right";
}

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > extends DataTableColumnMeta {}
}

/** 선택 열의 고정 id. 열 제어 목록에서 걸러내는 데 씁니다. */
const SELECT_COLUMN_ID = "__select";

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  /**
   * 행을 무엇으로 구분할지. **안 넘기면 배열 index** 라 정렬·페이지 이동에서
   * 선택이 엉뚱한 행으로 옮겨갑니다. 고유 키가 있으면 반드시 넘기세요.
   */
  getRowId?: (row: TData, index: number) => string;
  /** 왼쪽에 체크박스 열이 생깁니다. 열 정의에 직접 넣지 마세요 — 전체 선택까지 함께 처리합니다. */
  selectable?: boolean;
  onSelectedChange?: (rows: TData[]) => void;
  /** 클라이언트 페이지네이션. 서버가 자르면 끄고 바깥에서 `Pagination` 을 쓰세요. */
  paginated?: boolean;
  pageSize?: number;
  /** 어떤 열을 볼지 · 순서를 사용자가 고릅니다. */
  columnControl?: boolean;
  /** 행 전체를 누를 수 있게 합니다. 체크박스 열과 함께 쓰면 누를 것이 둘이 됩니다. */
  onRowClick?: (row: TData) => void;
  /** 지금 강조할 행 — `getRowId` 가 돌려주는 값과 같은 형식입니다. */
  activeRowId?: string;
  /**
   * 스크롤해도 열 이름이 남습니다.
   *
   * **스크롤은 감싸는 쪽이 갖습니다** — 여기서 만들지 않습니다. 표를 담는 자리가
   * 이미 `overflow-y-auto` 인 경우가 대부분인데(화면의 `TableFrame` 이 그렇습니다),
   * 여기서 또 만들면 스크롤이 두 겹이 되어 헤더가 안 붙습니다.
   */
  stickyHeader?: boolean;
  /**
   * 칸 좌우 여백을 12 → 8 로 줄입니다.
   *
   * **열이 많을 때 씁니다.** 칸은 `whitespace-nowrap` 이라 폭이 모자라면 줄바꿈이
   * 아니라 표가 가로로 넓어지는데, 8열쯤 되면 여백만 192px 을 먹습니다 — 결과조회
   * 화면의 환자리스트(500px 에 8열)가 그래서 넘쳤습니다.
   *
   * 글자 크기는 건드리지 않습니다 — 「헤더·본문 모두 14」 규칙 그대로입니다.
   */
  dense?: boolean;
  /**
   * **머리줄만** 한꺼번에 정렬합니다. 칸은 `meta.align` 그대로입니다.
   *
   * 둘을 갈라 두는 이유는 축이 다르기 때문입니다 — 값은 **읽는 방식**이 정합니다
   * (숫자는 오른쪽, 자릿수가 맞아야 크기를 눈으로 비교합니다). 열 이름은 **읽는
   * 값이 아니라 칸의 머리**라, 폭이 제각각인 열 위에서 전부 왼쪽에 붙어 있으면
   * 가운데·오른쪽 정렬된 값과 어긋나 보입니다.
   *
   * 안 넘기면 칸을 따라갑니다.
   */
  headerAlign?: "left" | "center" | "right";
  /**
   * 표 위의 머리줄 — 제목 · 건수 · 액션이 **테두리 밖**에 섭니다.
   *
   * `TableToolbar`(표에 딱 붙는 한 겹)와 다른 구성입니다. 판 안에 섹션이 여럿일 때는
   * 제목이 표 바깥에 있어야 하고, 표는 자기 테두리를 갖습니다 — 결과조회 화면이
   * 그 모양입니다.
   *
   * **열 제어 버튼도 이 줄에 섭니다.** 따로 한 줄을 더 만들면 표 위에 줄이 둘이 됩니다.
   */
  title?: string;
  /** 건수. 칩으로 나옵니다 — 회색 글자로 두면 부제처럼 읽혀 세는 값이라는 게 흐려집니다. */
  count?: string;
  /** 머리줄 오른쪽에 붙는 버튼들. 열 제어보다 앞에 놓입니다. */
  actions?: React.ReactNode;
  /**
   * 표에 **자기 테두리**를 두릅니다 (페이지네이션은 밖입니다).
   *
   * 기본은 끔입니다 — 감싸는 자리가 이미 테두리를 가진 경우가 있어서(화면의
   * `TableFrame`), 켜 두면 선이 두 겹이 됩니다.
   */
  framed?: boolean;
  /** 결과가 0건일 때. `no-result`(조건을 바꿈) · `no-data`(만듦) · `error`(다시 시도) */
  emptyType?: EmptyStateType;
  onEmptyAction?: () => void;
  className?: string;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  selectable,
  onSelectedChange,
  paginated,
  pageSize = 20,
  columnControl,
  onRowClick,
  activeRowId,
  stickyHeader,
  dense,
  headerAlign,
  title,
  count,
  actions,
  framed,
  emptyType = "no-result",
  onEmptyAction,
  className,
}: DataTableProps<TData>) {
  /*
    체크박스 열은 여기서 붙입니다 — 호출부가 열 정의에 직접 넣으면 전체 선택의
    indeterminate 계산을 매번 다시 짜야 하고, 한 곳만 빠뜨려도 그 표만 헤더
    체크박스가 반쪽으로 동작합니다 (「연결을 호출부에 시키면 반드시 빠집니다」).
  */
  const allColumns = React.useMemo(() => {
    if (!selectable) return columns;
    const selectColumn: DataTableColumn<TData> = {
      id: SELECT_COLUMN_ID,
      meta: { width: "w-10", align: "center" },
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="전체 선택"
          checked={table.getIsAllRowsSelected()}
          // 일부만 선택된 상태. 안 세우면 보조기술에는 unchecked 로 읽힙니다
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="행 선택"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          // 행 클릭과 겹치지 않게 — 체크박스를 누르면 상세로 가지 않습니다
          onClick={(e) => e.stopPropagation()}
        />
      ),
    };
    return [selectColumn, ...columns];
  }, [columns, selectable]);

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    getRowId,
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
  });

  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  /* 선택이 바뀌면 알립니다 — 호출부는 TanStack 의 row 객체가 아니라 원본을 받습니다 */
  const selectedKey = JSON.stringify(table.state.rowSelection ?? {});
  React.useEffect(() => {
    if (!onSelectedChange) return;
    onSelectedChange(table.getSelectedRowModel().rows.map((r) => r.original));
    // selectedKey 가 선택 상태를 대표합니다 — table 은 매 렌더 새 객체라 의존성에 못 둡니다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {/*
        머리줄 — 제목 · 건수 · 액션 · 열 제어가 **한 줄**에 섭니다. 열 제어만 따로
        한 줄을 더 만들면 표 위에 줄이 둘이 되어, 어느 것이 표의 머리인지 흐려집니다.
      */}
      {(title || count || actions || columnControl) && (
        <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
          {title && <span className="text-base font-semibold text-table-text">{title}</span>}
          {/* 톤은 늘 neutral 입니다 — 건수에 색을 주면 상태처럼 읽힙니다 */}
          {count && <Badge tone="neutral">{count}</Badge>}
          <span className="ml-auto flex items-center gap-2">
            {actions}
            {columnControl && <ColumnControl table={table} />}
          </span>
        </div>
      )}

      <div className={cn("min-h-0 flex-1", framed && "overflow-hidden rounded-md border border-table-border")}>
        <Table>
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const meta = header.column.columnDef.meta;
                  return (
                    <TableHead
                      key={header.id}
                      align={headerAlign ?? meta?.align}
                      className={cn(dense && "px-2", meta?.width)}
                      /*
                        정렬할 수 있는 열에만 넘깁니다 — 불가능한 열에 화살표가 보이면
                        사용자가 눌러 봅니다. TableHead 는 sort 가 undefined 면
                        정렬 UI 를 아예 그리지 않습니다
                      */
                      sort={canSort ? (sorted === false ? "none" : sorted) : undefined}
                      onSortChange={
                        canSort ? (next) => header.column.toggleSorting(next === "desc") : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              /* 헤더 행은 남깁니다 — 지우면 어떤 열을 조회했는지 알 수 없습니다 */
              <TableEmptyRow
                colSpan={visibleColumnCount}
                type={emptyType}
                onAction={onEmptyAction}
              />
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  selected={row.getIsSelected() || row.id === activeRowId}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      align={cell.column.columnDef.meta?.align}
                      className={cn(dense && "px-2")}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && table.getPageCount() > 1 && (
        /* 페이지네이션은 스크롤 영역 밖입니다 — 몇 쪽을 보고 있었는지가 사라지면 안 됩니다 */
        <div className="flex h-12 shrink-0 items-center justify-center">
          <Pagination
            page={(table.state.pagination?.pageIndex ?? 0) + 1}
            totalPages={table.getPageCount()}
            onPageChange={(p) => table.setPageIndex(p - 1)}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ 열 표시 · 순서 */

/**
 * 어떤 열을 볼지와 순서를 고르는 팝오버.
 *
 * **`ListItem` 을 쓰지 않습니다** — `ListItem` 은 `<button>` 이라 안에 순서 버튼을
 * 넣으면 버튼 안의 버튼이 됩니다 (`LookupRow` · `DropdownMenuItem` 과 같은 사정).
 *
 * **`DropdownMenu` 도 아닙니다** — 그건 「누르면 실행하고 끝나는」 메뉴라 표식이
 * 없는데, 여기는 지금 무엇이 켜져 있는지 계속 보여야 하고 연달아 여러 개를 켭니다.
 */
function ColumnControl<TData extends RowData>({
  table,
}: {
  table: ReturnType<typeof useTable<DataTableFeatures, TData>>;
}) {
  const columns = table.getAllLeafColumns().filter((c) => c.id !== SELECT_COLUMN_ID);

  const move = (id: string, delta: number) => {
    const order = columns.map((c) => c.id);
    const from = order.indexOf(id);
    const to = from + delta;
    if (to < 0 || to >= order.length) return;
    order.splice(to, 0, order.splice(from, 1)[0]);
    // 선택 열은 늘 맨 앞입니다 — 순서 목록에서 뺐으니 다시 앞에 붙입니다
    table.setColumnOrder(table.getAllLeafColumns().some((c) => c.id === SELECT_COLUMN_ID)
      ? [SELECT_COLUMN_ID, ...order]
      : order);
  };

  return (
    <Popover>
      {/*
        **아이콘만 · ghost** 입니다. 머리줄 오른쪽 끝에서 내려받기·인쇄 같은 아이콘
        버튼들과 나란히 서는 자리라, 혼자 테두리를 두르면 그것만 눌러야 할 것처럼 보입니다.

        글자가 없으므로 `aria-label` 은 필수이고, 눈으로 보는 사람에게는 툴팁이
        말해 줍니다 — 둘은 읽는 사람이 겹치지 않습니다.
      */}
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="열 표시 · 순서">
              <Columns3 />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>열 표시 · 순서</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-56 p-1">
        {columns.map((column, i) => {
          const label =
            typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;
          return (
            <div
              key={column.id}
              className="flex h-8 items-center gap-2 rounded-sm px-2 hover:bg-action-accent"
            >
              <Checkbox
                size="sm"
                label={label}
                checked={column.getIsVisible()}
                /*
                  마지막 한 열까지 끄면 표가 통째로 사라집니다 — 열 이름조차 남지
                  않아 무엇을 보던 화면인지 알 수 없게 됩니다
                */
                disabled={column.getIsVisible() && table.getVisibleLeafColumns().length <= 1}
                onChange={column.getToggleVisibilityHandler()}
                className="min-w-0 flex-1"
              />
              <span className="flex shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${label} 위로`}
                  disabled={i === 0}
                  onClick={() => move(column.id, -1)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${label} 아래로`}
                  disabled={i === columns.length - 1}
                  onClick={() => move(column.id, 1)}
                >
                  <ArrowDown />
                </Button>
              </span>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
