import * as React from "react";
import { CircleAlert, Inbox, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma: EmptyState (Feedback 페이지 · 6 변형 — Type 3 × Size 2)
 *
 * 내용이 없을 때 자리를 채웁니다. **빈 공간을 그냥 두면 로딩 중인지 결과가 없는지
 * 알 수 없습니다.**
 *
 * ### 셋의 차이는 “다음에 무엇을 하느냐” 입니다
 *
 * | `type` | 무슨 상황 | 사용자가 할 일 | 버튼 |
 * |---|---|---|---|
 * | `no-result` | 조회했는데 결과가 0건 | **조건을 바꿉니다** | `조건 초기화` (outline) |
 * | `no-data` | 데이터 자체가 없음 | **만듭니다** | `추가` (**Primary**) |
 * | `error` | 불러오기 실패 | **다시 시도합니다** | `다시 시도` (outline) |
 *
 * **`no-data` 만 Primary 버튼**입니다 — 셋 중 유일하게 *새로 만드는* 동작이라
 * 그 화면의 주 액션입니다. 나머지 둘은 되돌리거나 다시 해보는 것이라 outline 입니다.
 *
 * 상황이 다르면 **문구도 달라야 합니다.** `type` 만 정하면 제목·설명·버튼 글자가
 * 함께 따라옵니다 — Figma 는 TEXT 프로퍼티가 세트 전체 공유라 변형마다 다른 기본
 * 문구를 줄 수 없어 여섯 변형이 모두 "조회 결과가 없습니다" 로 보입니다.
 * **코드에는 그 제약이 없어 채웠습니다.**
 *
 * ### 표 안에서는 헤더 행 아래에
 *
 * **헤더까지 지우지 마세요** — 어떤 열을 조회했는지 알 수 없어집니다.
 * `<tbody>` 안에 행 하나를 놓고 `colSpan` 으로 폭을 채우세요.
 *
 * ### 그 밖
 *
 * - `size="sm"` 은 **카드 안 · 시트 안**처럼 좁은 영역용입니다 (세로 여백 72 → 40)
 * - `onAction` 을 넘기지 않으면 **버튼이 사라집니다.** 사용자가 할 수 있는 일이
 *   없을 때만 그렇게 하세요 — 막다른 길에 버튼만 없으면 더 답답합니다
 * - **실패는 Toast 만으로 두지 마세요** (`Toast` 규칙과 같음). 조회가 실패했으면
 *   화면에도 `type="error"` 를 남깁니다
 */

export type EmptyStateType = "no-result" | "no-data" | "error";

const PRESET: Record<
  EmptyStateType,
  { icon: React.ReactNode; title: string; description: string; action: string; primary?: boolean }
> = {
  "no-result": {
    icon: <Search />,
    title: "조회 결과가 없습니다",
    description: "조건을 바꿔 다시 조회해 보세요.",
    action: "조건 초기화",
  },
  "no-data": {
    icon: <Inbox />,
    title: "등록된 항목이 없습니다",
    description: "새 항목을 추가해 주세요.",
    action: "추가",
    // 셋 중 유일하게 새로 만드는 동작이라 이 화면의 주 액션입니다
    primary: true,
  },
  error: {
    icon: <CircleAlert />,
    title: "불러오지 못했습니다",
    description: "잠시 후 다시 시도해 주세요. 계속되면 전산실로 문의하세요.",
    action: "다시 시도",
  },
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: EmptyStateType;
  /** `sm` 은 카드·시트처럼 좁은 영역용입니다. */
  size?: "default" | "sm";
  /** 넘기지 않으면 `type` 에 맞는 기본 문구를 씁니다. */
  title?: string;
  /** `null` 을 넘기면 설명 줄이 사라집니다. */
  description?: string | null;
  /** 넘기지 않으면 **버튼이 없습니다.** 할 수 있는 일이 없을 때만 그렇게 하세요. */
  onAction?: () => void;
  actionLabel?: string;
  /** 아이콘을 끕니다. 좁은 곳에서 세로를 더 줄여야 할 때만. */
  icon?: React.ReactNode | false;
}

export function EmptyState({
  type = "no-result",
  size = "default",
  title,
  description,
  onAction,
  actionLabel,
  icon,
  className,
  ...props
}: EmptyStateProps) {
  const p = PRESET[type];
  const sm = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        sm ? "gap-2 py-10" : "gap-3 py-18",
        className
      )}
      {...props}
    >
      {icon !== false && (
        <span
          aria-hidden
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-surface-gray-subtler",
            "text-icon-muted-foreground",
            sm ? "size-11 [&_svg]:size-5" : "size-14 [&_svg]:size-6"
          )}
        >
          {icon ?? p.icon}
        </span>
      )}

      <div className="flex flex-col gap-1">
        <p className={cn("font-semibold text-text-basic", sm ? "text-sm" : "text-base")}>
          {title ?? p.title}
        </p>
        {/* null 을 넘기면 설명이 사라집니다 — undefined 는 기본 문구 */}
        {description !== null && (
          <p className={cn("text-text-subtle", sm ? "text-xs" : "text-sm")}>
            {description ?? p.description}
          </p>
        )}
      </div>

      {onAction && (
        <Button
          variant={p.primary ? "default" : "outline"}
          size={sm ? "sm" : "default"}
          onClick={onAction}
        >
          {p.primary && <Plus />}
          {actionLabel ?? p.action}
        </Button>
      )}
    </div>
  );
}

/**
 * 표 안에 넣는 짝입니다 — **헤더 행은 남기고 본문만** 채웁니다.
 * 헤더까지 지우면 어떤 열을 조회했는지 알 수 없어집니다.
 *
 * ```tsx
 * <TableBody>
 *   {rows.length ? rows.map(...) : <TableEmptyRow colSpan={6} onAction={reset} />}
 * </TableBody>
 * ```
 */
export function TableEmptyRow({
  colSpan,
  ...props
}: EmptyStateProps & { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState {...props} />
      </td>
    </tr>
  );
}
