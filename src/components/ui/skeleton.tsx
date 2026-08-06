import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Skeleton (9 변형 — Shape 3 × Size 3)
 *
 * 조회 중 자리를 잡아두는 회색 블록입니다. 스피너보다 화면이 덜 흔들립니다.
 *
 * **실제 콘텐츠와 같은 크기·개수로 깔아 주세요.** 로딩이 끝났을 때 레이아웃이 튀지 않습니다.
 * 표는 행 개수만큼, 카드는 카드 모양대로.
 *
 * 사이즈는 시작점일 뿐입니다 — 폭은 className 으로 자유롭게 덮어쓰세요.
 * Figma 는 정지 상태만 정의하고, 깜빡임(animate-pulse)은 코드가 담당합니다.
 */

type Shape = "text" | "circle" | "block";
type Size = "sm" | "default" | "lg";

const shapeMap: Record<Shape, Record<Size, string>> = {
  // 글자 한 줄 — 높이가 글자 크기를 따라갑니다
  text: {
    sm: "h-3 w-50 rounded-sm",
    default: "h-4 w-60 rounded-sm",
    lg: "h-5 w-70 rounded-sm",
  },
  // 아바타
  circle: {
    sm: "size-6 rounded-full",
    default: "size-10 rounded-full",
    lg: "size-14 rounded-full",
  },
  // 카드·이미지
  block: {
    sm: "h-15 w-60 rounded-md",
    default: "h-25 w-70 rounded-md",
    lg: "h-40 w-80 rounded-md",
  },
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: Shape;
  size?: Size;
}

export function Skeleton({ shape = "text", size = "default", className, ...props }: SkeletonProps) {
  return (
    <div
      // 로딩 중인 자리는 보조기술에 읽히지 않아야 합니다 —
      // 무엇이 올지 모르는 회색 상자를 읽어봐야 도움이 안 됩니다.
      // 대신 감싸는 영역에 aria-busy 를 두세요.
      aria-hidden
      className={cn("animate-pulse bg-skeleton-base", shapeMap[shape][size], className)}
      {...props}
    />
  );
}
