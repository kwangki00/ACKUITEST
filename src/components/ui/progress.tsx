import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Progress (2 변형 — Size 2)
 *
 * 진행률 막대입니다. 파일 업로드·일괄 처리처럼 **끝이 보이는** 작업에 씁니다.
 * 끝을 알 수 없으면 Spinner 나 Skeleton 이 맞습니다.
 *
 * Header 를 켜면 위에 라벨과 퍼센트가 붙습니다 (간격 6, 라벨과 퍼센트 사이는 양끝 정렬).
 * Size — sm 4px / default 8px.
 */

type Size = "sm" | "default";

const sizeMap: Record<Size, string> = {
  sm: "h-1",
  default: "h-2",
};

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0–100. 범위를 벗어나면 잘라냅니다. */
  value: number;
  size?: Size;
  /** 켜면 위에 라벨 + 퍼센트가 붙습니다. */
  label?: string;
  showPercent?: boolean;
}

export function Progress({
  value,
  size = "default",
  label,
  showPercent,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const hasHeader = label != null || showPercent;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-2 text-xs text-progress-text">
          {label != null ? <span className="font-medium">{label}</span> : <span />}
          {showPercent && <span className="tabular-nums">{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn("w-full overflow-hidden rounded-full bg-progress-track", sizeMap[size])}
      >
        <div
          className="h-full rounded-full bg-progress-fill transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
