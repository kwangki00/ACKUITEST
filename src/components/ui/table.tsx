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
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full border-collapse text-sm text-table-text", className)}
      {...props}
    />
  );
}

export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-table-header-surface" {...props} />;
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      data-selected={selected || undefined}
      className={cn(
        "border-b border-table-border transition-colors",
        "hover:bg-table-row-hover data-[selected]:bg-table-row-selected",
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
        "border-b border-table-border-strong whitespace-nowrap",
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
        "h-[var(--h-datagrid)] px-3",
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
