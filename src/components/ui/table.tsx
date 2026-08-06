import * as React from "react";
import { cn } from "@/lib/utils";

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

export function TableHead({
  className,
  align = "left",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "center" | "right" }) {
  return (
    <th
      className={cn(
        "h-[var(--h-datagrid)] px-3 font-semibold text-table-header-text",
        "border-b border-table-border-strong whitespace-nowrap",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
      {...props}
    />
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

export function TableToolbar({
  title,
  count,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string; count?: string }) {
  return (
    <div
      className={cn(
        "flex h-[var(--h-toolbar)] items-center gap-2 border-b border-table-border px-3",
        className
      )}
      {...props}
    >
      {title && <span className="text-base font-semibold text-table-text">{title}</span>}
      {count && <span className="text-xs text-table-text-muted">{count}</span>}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
