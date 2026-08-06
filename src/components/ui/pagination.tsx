import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Pagination (2 변형) + PaginationItem (32 변형 — Type 6 × Size 2 × State 3)
 *
 * 표 하단 **중앙**에 놓습니다. 총 건수와 선택 건수는 TableToolbar 가 맡으므로
 * 여기서는 페이지 이동만 담당합니다.
 *
 * 현재 페이지는 **Primary 틴트 + 진한 글자**입니다. 채움을 쓰면 주 액션 버튼과
 * 무게가 같아져 시선이 분산됩니다.
 *
 * 페이지네이션은 조밀한 게 기본이라 다른 컨트롤보다 한 단계 작습니다 —
 * default 는 --h-input-sm(32), lg 가 --h-input-default(36) 입니다.
 *
 * Figma 는 슬롯 9개를 손으로 스왑해야 하지만(1 2 ⋯ 9 10),
 * 코드는 총 페이지와 현재 페이지로 창을 계산합니다.
 */

type Size = "default" | "lg";

const sizeMap: Record<Size, { box: string; text: string; icon: string }> = {
  default: { box: "size-[var(--h-input-sm)]", text: "text-xs", icon: "[&_svg]:size-[14px]" },
  lg: { box: "size-[var(--h-input-default)]", text: "text-sm", icon: "[&_svg]:size-4" },
};

const itemBase =
  "inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-colors " +
  "focus-visible:ring-[3px] focus-visible:ring-action-focus-ring focus-visible:outline-hidden " +
  "disabled:pointer-events-none disabled:text-text-disabled-on";

export interface PaginationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  current?: boolean;
}

/** 숫자 · 이동 버튼 공용. 단독으로 쓰지 않고 Pagination 이 조립합니다. */
export function PaginationItem({
  size = "default",
  current,
  className,
  children,
  ...props
}: PaginationItemProps) {
  const s = sizeMap[size];
  return (
    <button
      type="button"
      aria-current={current ? "page" : undefined}
      className={cn(
        itemBase,
        s.box,
        s.text,
        s.icon,
        current
          ? "bg-pagination-current-surface text-pagination-current-text"
          : "text-table-text hover:bg-action-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Ellipsis({ size }: { size: Size }) {
  const s = sizeMap[size];
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center justify-center text-table-text-muted", s.box, s.text)}
    >
      …
    </span>
  );
}

/**
 * 현재 페이지 주변으로 숫자 창을 만듭니다.
 * 총 페이지가 적으면 전부, 많으면 양 끝을 남기고 가운데를 생략합니다 — 1 2 ⋯ 9 10.
 */
function buildPages(total: number, current: number, window: number): (number | "…")[] {
  if (total <= window) return Array.from({ length: total }, (_, i) => i + 1);

  const side = Math.floor((window - 3) / 2); // 양 끝 1칸씩 + 생략 1칸을 뺀 나머지
  let start = Math.max(2, current - side);
  let end = Math.min(total - 1, current + side);

  // 창이 한쪽으로 치우치면 반대쪽으로 밀어 개수를 유지합니다
  if (current - side < 2) end = Math.min(total - 1, end + (2 - (current - side)));
  if (current + side > total - 1) start = Math.max(2, start - (current + side - (total - 1)));

  const pages: (number | "…")[] = [1];
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 1부터 셉니다. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: Size;
  /** 숫자 칸 최대 개수. Figma 슬롯 구성(숫자 5개)이 기본입니다. */
  window?: number;
  /** 맨 앞·맨 뒤 버튼. 페이지가 몇 개 안 되면 꺼도 됩니다. */
  showEdges?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  size = "default",
  window: win = 5,
  showEdges = true,
  className,
  ...props
}: PaginationProps) {
  const total = Math.max(1, totalPages);
  const cur = Math.min(total, Math.max(1, page));
  const pages = buildPages(total, cur, Math.max(3, win));

  const atFirst = cur <= 1;
  const atLast = cur >= total;

  return (
    <nav aria-label="페이지" className={cn("flex items-center gap-1", className)} {...props}>
      {showEdges && (
        <PaginationItem size={size} disabled={atFirst} onClick={() => onPageChange(1)} aria-label="첫 페이지">
          <ChevronsLeft />
        </PaginationItem>
      )}
      <PaginationItem size={size} disabled={atFirst} onClick={() => onPageChange(cur - 1)} aria-label="이전 페이지">
        <ChevronLeft />
      </PaginationItem>

      {pages.map((p, i) =>
        p === "…" ? (
          <Ellipsis key={`gap-${i}`} size={size} />
        ) : (
          <PaginationItem
            key={p}
            size={size}
            current={p === cur}
            onClick={() => onPageChange(p)}
            aria-label={`${p} 페이지`}
          >
            {p}
          </PaginationItem>
        )
      )}

      <PaginationItem size={size} disabled={atLast} onClick={() => onPageChange(cur + 1)} aria-label="다음 페이지">
        <ChevronRight />
      </PaginationItem>
      {showEdges && (
        <PaginationItem size={size} disabled={atLast} onClick={() => onPageChange(total)} aria-label="마지막 페이지">
          <ChevronsRight />
        </PaginationItem>
      )}
    </nav>
  );
}
