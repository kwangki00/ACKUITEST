import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Spinner (8 변형 — Tone 2 × Size 4)
 *
 * 끝을 알 수 없는 작업의 로딩 표시입니다. 버튼 안, 작은 영역에 씁니다.
 *
 * Skeleton 과의 구분 — 영역 전체가 로딩 중이면 Skeleton, 짧고 작은 대기면 Spinner.
 * **3초 이상 걸리면 Spinner 만으로 부족합니다** — 진행 상태나 안내 문구를 함께 두세요.
 *
 * Figma 는 호를 270°(위에서 시계방향)로 그리고 안쪽 반지름을 0.8 로 둡니다.
 * 즉 테두리 두께가 지름의 10% 입니다. CSS 는 4변 중 한 변만 트랙 색으로 두면
 * 같은 모양이 나옵니다 — 나머지 3변(270°)이 인디케이터입니다.
 */

type Tone = "default" | "onPrimary";
type Size = "xs" | "sm" | "default" | "lg";

// 두께 = 지름 × 0.1 (Figma innerRadius 0.8)
const sizeMap: Record<Size, string> = {
  xs: "size-[14px] border-[1.5px]",
  sm: "size-4 border-[1.5px]",
  default: "size-5 border-2",
  lg: "size-8 border-[3px]",
};

const toneMap: Record<Tone, string> = {
  default: "border-spinner-indicator border-l-spinner-track",
  // 트랙은 같은 색을 35% 로 깝니다 — Primary 버튼 위에서 흰 계열로 보여야 합니다
  onPrimary: "border-spinner-on-primary border-l-spinner-on-primary/35",
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  /** 화면에 안 보이지만 보조기술이 읽는 문구. 버튼 안처럼 옆에 글자가 있으면 비워두세요. */
  label?: string;
}

export function Spinner({
  tone = "default",
  size = "default",
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex shrink-0", className)}
      {...props}
    >
      <span className={cn("animate-spin rounded-full", sizeMap[size], toneMap[tone])} />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
