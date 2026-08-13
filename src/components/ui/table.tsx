import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Figma: TableCell 21 · TableHeaderCell 8 · TableRow 4 · TableToolbar 4
 *
 * 헤더와 본문 글자는 둘 다 14 입니다 — 굵기로만 구분합니다.
 * 행 높이는 --h-datagrid 라 모바일에서 커집니다.
 * 페이지네이션과 스크롤 둘 다 씁니다 — 한 화면에서 훑는 목록은 스크롤,
 * 건수가 많고 위치를 기억해야 하면 페이지네이션. 건수는 툴바에 표시합니다.
 */
/**
 * 표가 머리인지 몸통인지 — `TableRow` 가 스스로 알기 위한 것입니다.
 *
 * `TableRow` 는 머리·몸통 양쪽에 쓰이는데 **hover·선택 배경은 몸통에만** 있어야
 * 합니다. 줄마다 `header` 를 넘기게 하면 하나만 빠뜨려도 그 표의 머리줄이 마우스를
 * 올릴 때 색이 바뀝니다 (`SidebarCollapsedContext` · `AccordionSizeContext` 와 같은 이유).
 */
const TableSectionContext = React.createContext<"head" | "body">("body");

/**
 * 표면은 **흰색**입니다 (`Table/Row-Surface`). Figma 의 `TableCell` 기본 채움이
 * 그것이고, 머리줄만 `Table/Header-Surface`(회색)로 그 위를 덮습니다.
 *
 * 2026-08-12 이전에는 이 흰색이 없어서 **행이 투명**이었습니다 — 스토리는 감싸는 div 에
 * `bg-table-row-surface` 를 손으로 발라 가리고 있었고, 화면에 그냥 놓으면 뒤의 회색이
 * 그대로 비쳤습니다.
 */
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full border-collapse bg-table-row-surface text-sm text-table-text",
        className
      )}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <TableSectionContext.Provider value="head">
      <thead className={cn("bg-table-header-surface", className)} {...props} />
    </TableSectionContext.Provider>
  );
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <TableSectionContext.Provider value="body">
      <tbody {...props} />
    </TableSectionContext.Provider>
  );
}

export function TableRow({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  const isHead = React.useContext(TableSectionContext) === "head";
  return (
    <tr
      data-selected={selected || undefined}
      className={cn(
        "transition-colors",
        /*
          머리줄은 아무것도 더하지 않습니다 — 아래 선은 `TableHead` 가 자기
          `Border-Strong` 으로 긋고(칸의 테두리가 줄의 테두리를 이깁니다),
          hover·선택은 몸통에만 있는 상태입니다. 머리에 hover 배경이 걸리면
          정렬하려고 마우스를 올렸을 때 줄 전체가 눌린 것처럼 보입니다.
        */
        !isHead && [
          "border-b border-table-border",
          "hover:bg-table-row-hover data-[selected]:bg-table-row-selected",
        ],
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  /**
   * 정렬 상태. **정렬할 수 있는 열에만** 넘기세요 —
   * 불가능한 열에 화살표가 보이면 사용자가 눌러 봅니다 (Figma 문서의 경고).
   */
  sort?: "none" | "asc" | "desc";
  onSortChange?: (next: "asc" | "desc") => void;
}

export function TableHead({
  className,
  align = "left",
  sort,
  onSortChange,
  children,
  ...props
}: TableHeadProps) {
  const sortable = sort !== undefined;
  const active = sort === "asc" || sort === "desc";

  const label = (
    <span className="inline-flex items-center gap-1">
      {children}
      {sortable && (
        /*
          정렬되지 않은 열의 화살표는 **hover 에서만** 나타납니다.
          늘 보이면 어느 열이 실제로 정렬돼 있는지 흐려지고,
          아예 없으면 정렬할 수 있다는 걸 모릅니다.
        */
        <ArrowUpDown
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 transition-opacity",
            active ? "opacity-100" : "opacity-0 group-hover/th:opacity-40"
          )}
        />
      )}
    </span>
  );

  return (
    <th
      aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}
      className={cn(
        "group/th h-[var(--h-datagrid)] px-3 font-semibold text-table-header-text",
        /*
          **아래 선을 `border-b` 로 긋지 않습니다** (2026-08-13).

          표가 `border-collapse: collapse` 라 테두리가 **칸이 아니라 표의 격자**에
          그려집니다. 그래서 `stickyHeader` 로 머리줄이 떠도 **선은 따라오지 않고**
          제자리에 남습니다 — Chrome 에서는 아예 안 그려집니다. 머리줄에 아래 선이
          없으면 첫 행이 머리줄에 붙어 어디까지가 열 이름인지 흐려집니다.

          `inset` 그림자는 **칸 안쪽**에 그려서 칸을 따라 움직입니다. 굵기·색은
          같고 `border-box` 라 높이도 그대로입니다.
        */
        "shadow-[inset_0_-1px_0_var(--color-table-border-strong)] whitespace-nowrap",
        sortable && "cursor-pointer hover:bg-table-border",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
      onClick={sortable ? () => onSortChange?.(sort === "asc" ? "desc" : "asc") : undefined}
      {...props}
    >
      {sortable ? (
        // th 자체는 누를 수 없어서 안에 버튼을 둡니다 — 키보드로도 정렬해야 합니다
        <button
          type="button"
          className="outline-hidden focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-action-focus-ring"
          onClick={(e) => {
            e.stopPropagation();
            onSortChange?.(sort === "asc" ? "desc" : "asc");
          }}
        >
          {label}
        </button>
      ) : (
        label
      )}
    </th>
  );
}

export function TableCell({
  className,
  align = "left",
  numeric,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right";
  numeric?: boolean;
}) {
  return (
    <td
      className={cn(
        /*
          **줄바꿈하지 않습니다** — 행 높이가 --h-datagrid 로 고정이라, 두 줄이 되면
          그 행만 커져 격자가 깨집니다. `2025-06-01` 처럼 하이픈이 든 값은 폭이
          조금만 모자라도 하이픈에서 잘려 두 줄이 됩니다 (2026-08-12에 겪었습니다).
          `TableHead` 는 원래 nowrap 이었는데 칸만 빠져 있었습니다.

          긴 글이 들어가면 표가 가로로 넓어집니다 — 담는 자리가 스크롤하거나,
          그 열에 `truncate` 를 주세요.
        */
        "h-[var(--h-datagrid)] px-3 whitespace-nowrap",
        numeric && "text-right tabular-nums",
        !numeric && align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
      {...props}
    />
  );
}

export interface TableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /**
   * 건수. **칩으로 나옵니다** — 제목 옆 회색 글자로 두면 부제처럼 읽혀
   * 세는 값이라는 게 흐려집니다 (Figma 도 Badge 입니다).
   *
   * 선택이 있으면 `총 13건 / 3건 선택됨` 처럼 한 칩에 함께 적으세요.
   * 칩을 둘로 나누면 어느 쪽이 전체인지 매번 읽어야 합니다.
   */
  count?: string;
  size?: "default" | "lg";
}

export function TableToolbar({
  title,
  count,
  size = "default",
  children,
  className,
  ...props
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-table-border px-3",
        size === "lg" ? "h-[var(--h-toolbar-lg)]" : "h-[var(--h-toolbar)]",
        className
      )}
      {...props}
    >
      {title && <span className="text-base font-semibold text-table-text">{title}</span>}
      {/* 톤은 늘 neutral 입니다. 건수에 색을 주면 상태처럼 읽힙니다 */}
      {count && <Badge tone="neutral">{count}</Badge>}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
