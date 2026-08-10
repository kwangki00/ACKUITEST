import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Figma: MobileListCard (3 변형 — State 3)
 *
 * 모바일에서 **표를 대체하는 카드**입니다. 행 하나가 카드 하나가 됩니다.
 *
 * ### 열을 어떻게 나누나
 *
 * 표마다 열이 다르므로 카드는 **내용을 정하지 않고 자리만** 정합니다.
 * 어느 열을 어디에 넣을지는 쓰는 쪽이 고릅니다.
 *
 * | 자리 | 몇 개 | 무엇을 넣나 |
 * |---|---|---|
 * | `title` | **1개** | 사람이 목록에서 찾는 기준 — 환자명·검사명 |
 * | `meta` | **한 줄** | 나머지 식별 정보를 `·` 로 이어 씁니다 |
 * | `count` | 1개 | 건수. SemiBold 로 강조합니다 |
 * | `badge` 또는 `status` | **1개** | 상태 |
 * | `values` | **2개까지** | 목록에서 값까지 봐야 할 때만 |
 *
 * **그 이상은 상세 화면으로 미루세요.** 카드가 길어지면 한 화면에 몇 건 안 보여서
 * 목록의 뜻이 없어집니다.
 *
 * ### 점과 배지를 둘 다 켜지 마세요
 *
 * 같은 정보를 두 번 말하는 셈입니다. 상태가 **2종이면 점, 3종 이상이면 배지** —
 * `Badge` 의 규칙과 같습니다. 타입으로 둘 중 하나만 받게 막아뒀습니다.
 *
 * ### 그 밖
 *
 * - `selectable` 은 **선택 모드에서만** 켜세요. 평소에 체크박스가 있으면 누를 것이 둘이 됩니다
 * - `chevron` 은 상세로 이동한다는 신호입니다. 이동이 없으면 끄세요
 * - 흰 배경 + 하단 구분선입니다. **간격 0 으로 붙여 쌓으세요** — 카드가 아니라 목록으로 보여야 합니다
 */

export interface CardValue {
  label: string;
  value: React.ReactNode;
}

type BaseProps = {
  title: string;
  /** 나머지 식별 정보를 `·` 로 이어 쓴 한 줄. */
  meta?: string;
  /** 건수 — 목록에서 많은 항목을 먼저 찾는 경우가 많아 굵게 씁니다. */
  count?: string;
  /**
   * 라벨 + 값 **2개까지**. 세 개를 넣으면 타입이 막습니다 —
   * 목록에서 값까지 봐야 할 때만 쓰세요.
   */
  values?: [CardValue] | [CardValue, CardValue];
  selected?: boolean;
  /** 다중 선택 모드에서만 켜세요. */
  selectable?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 상세로 이동한다는 신호. 이동이 없으면 끄세요. */
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * 점과 배지는 **둘 중 하나만** 받습니다 — 같은 정보를 두 번 말하지 않게
 * 타입에서 막습니다 (2종이면 점, 3종 이상이면 배지).
 */
export type MobileListCardProps = BaseProps &
  (
    | { badge?: React.ReactNode; status?: never }
    | { status: "success" | "warning" | "danger" | "neutral"; badge?: never }
  );

const statusColor: Record<string, string> = {
  success: "bg-badge-success-text",
  warning: "bg-badge-warning-text",
  danger: "bg-badge-danger-text",
  neutral: "bg-badge-neutral-text",
};

export function MobileListCard({
  title,
  meta,
  count,
  values,
  badge,
  status,
  selected,
  selectable,
  onSelectedChange,
  chevron = true,
  onClick,
  className,
}: MobileListCardProps) {
  return (
    <div
      // 카드 전체가 누름 대상입니다 — 작은 화면에서 정확히 겨냥할 곳을 좁히면 안 됩니다
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "flex items-start gap-3 border-b border-card-border py-3.5 pr-3 pl-4",
        "outline-hidden transition-colors",
        selected ? "bg-table-row-selected" : "bg-card-surface",
        onClick && "cursor-pointer active:bg-table-row-hover",
        "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:-outline-offset-2",
        className
      )}
    >
      {selectable && (
        <span className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onChange={(e) => onSelectedChange?.(e.target.checked)}
            aria-label={`${title} 선택`}
          />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {status && (
            <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", statusColor[status])} />
          )}
          <span className="min-w-0 flex-1 truncate text-base font-semibold text-card-title">
            {title}
          </span>
          {badge}
        </div>

        {(meta || count) && (
          <div className="flex items-center gap-1.5">
            {meta && <span className="min-w-0 flex-1 truncate text-xs text-card-label">{meta}</span>}
            {count && <span className="shrink-0 text-xs font-semibold text-text-basic">{count}</span>}
          </div>
        )}

        {values && (
          // 값은 균등 분할입니다 — 라벨이 위, 값이 아래
          <div className="flex gap-3">
            {values.map((v) => (
              <div key={v.label} className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-2xs text-card-label">{v.label}</span>
                <span className="truncate text-sm font-medium text-card-value">{v.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {chevron && onClick && (
        <ChevronRight aria-hidden className="mt-0.5 size-4.5 shrink-0 text-icon-muted-foreground" />
      )}
    </div>
  );
}
