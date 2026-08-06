import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Separator (2 변형 — Direction 2)
 *
 * 영역을 나누는 선입니다. 선 굵기 1, 라벨을 켜면 가운데 들어갑니다 (양옆 간격 12).
 *
 * **카드나 표 안에서는 쓰지 마세요** — 그쪽은 컴포넌트 자체 테두리가 담당합니다.
 * Separator 는 그 밖의 영역 분할용입니다.
 * 세로 구분선은 툴바에서 버튼 그룹을 나눌 때 씁니다.
 *
 * 라벨이 없으면 role="separator" 로 두고, 라벨이 있으면 글자를 읽어야 하므로
 * 장식용 선만 숨깁니다.
 */

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  /** "또는" 같은 구분 문구. 켜면 선이 둘로 갈라집니다. */
  label?: string;
}

export function Separator({
  direction = "horizontal",
  label,
  className,
  ...props
}: SeparatorProps) {
  const vertical = direction === "vertical";
  const line = cn("bg-separator-line", vertical ? "w-px flex-1" : "h-px flex-1");

  if (!label) {
    return (
      <div
        role="separator"
        aria-orientation={direction}
        className={cn(vertical ? "h-full w-px" : "h-px w-full", "bg-separator-line", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        vertical ? "h-full flex-col" : "w-full flex-row",
        className
      )}
      {...props}
    >
      <span aria-hidden className={line} />
      <span className="shrink-0 text-xs text-separator-label">{label}</span>
      <span aria-hidden className={line} />
    </div>
  );
}
