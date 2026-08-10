import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Figma: MobileListHeader (Layouts 페이지)
 *
 * 카드 목록 위의 머리줄입니다. **제목 · 총 건수 · 정렬/필터 버튼**으로 끝입니다.
 *
 * ### 왜 있어야 하나
 *
 * 카드 목록에는 **표 헤더가 없습니다.** PC 의 `Table` 은 헤더 행이 열 이름을 알려주고
 * 거기서 정렬까지 하지만, `MobileListCard` 를 쌓으면 그 자리가 통째로 없어집니다.
 * 이 줄이 그 자리를 대신합니다 — **무엇의 목록인지 · 몇 건인지 · 어떻게 고를지.**
 *
 * ### 건수는 조회 결과 전체 수입니다
 *
 * `FilterBar` 의 배지와 **같은 값**을 씁니다. 둘이 다르면 어느 쪽이 맞는지
 * 사용자가 판단할 수 없습니다. 화면에 보이는 카드 수가 아니라 조회된 전체 건수입니다.
 *
 * ### 필터 버튼은 할 일이 있을 때만
 *
 * `onFilter` 를 넘기지 않으면 버튼이 사라집니다. **눌러도 아무 일이 없는 버튼은 두지
 * 마세요** — 정렬·필터가 없는 목록이면 끄는 것이 맞습니다.
 *
 * 누르면 정렬·필터 `MobileSheet` 를 엽니다.
 *
 * ### 그 밖
 *
 * - **스크롤 영역 밖**에 두세요. 목록과 함께 밀려 올라가면 몇 건인지 다시 확인할 수
 *   없습니다 (`MBottomTabBar` · Table 헤더 행과 같은 이유)
 * - 제목은 `base/Bold` (`Card/Title`) — 아래 카드의 제목이 `base/SemiBold` 라
 *   **굵기 한 단계로** 위계를 만듭니다
 */

export interface MobileListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  /**
   * 조회 결과 **전체** 건수. `FilterBar` 의 배지와 같은 값을 쓰세요.
   * 넘기지 않으면 배지가 없습니다.
   */
  count?: React.ReactNode;
  /** 넘기지 않으면 버튼이 사라집니다. 정렬·필터가 없는 목록에서는 넘기지 마세요. */
  onFilter?: () => void;
  filterLabel?: string;
  /** 버튼 오른쪽에 더 붙일 것. 2개를 넘기지 마세요. */
  actions?: React.ReactNode;
}

export function MobileListHeader({
  title,
  count,
  onFilter,
  filterLabel = "정렬 · 필터",
  actions,
  className,
  ...props
}: MobileListHeaderProps) {
  return (
    <div
      className={cn("flex h-10 shrink-0 items-center gap-2 px-1", className)}
      {...props}
    >
      <span className="min-w-0 truncate text-base font-bold text-card-title">{title}</span>

      {count != null && (
        <Badge tone="neutral" styleVariant="soft" size="sm">
          {count}
        </Badge>
      )}

      <span className="ml-auto flex shrink-0 items-center gap-1">
        {actions}
        {onFilter && (
          <Button variant="ghost" size="icon-sm" aria-label={filterLabel} onClick={onFilter}>
            <SlidersHorizontal />
          </Button>
        )}
      </span>
    </div>
  );
}
