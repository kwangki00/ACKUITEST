import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Card (6 변형 — Variant 2 × Size 3) + CardRow (2 변형)
 *
 * 제목과 내용을 묶는 표면입니다. 결과조회의 접수정보·개인정보·검사정보처럼
 * 항목을 나누는 데 씁니다.
 *
 * Variant — Outline(흰 배경 + 테두리, 기본) / Filled(옅은 회색, 테두리 없음).
 * **Filled 는 카드 안의 하위 그룹에** 씁니다. 최상위 카드를 Filled 로 두면
 * 화면 배경과 붙어 경계가 사라집니다.
 *
 * CardRow 는 라벨 폭이 고정(sm 88 / default 104)이라 여러 줄이 세로로 정렬됩니다.
 * 값이 길어 줄바꿈되어도 라벨은 상단 정렬을 유지합니다.
 */

type Variant = "outline" | "filled";
type Size = "sm" | "default" | "lg";

const CardContext = React.createContext<{ size: Size }>({ size: "default" });

const cardSize: Record<Size, string> = {
  sm: "p-4 gap-3",
  default: "p-5 gap-3.5",
  lg: "p-6 gap-4",
};

const titleSize: Record<Size, string> = {
  sm: "text-sm",
  default: "text-base",
  lg: "text-lg",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: Size;
}

export function Card({
  variant = "outline",
  size = "default",
  className,
  children,
  ...props
}: CardProps) {
  const ctx = React.useMemo(() => ({ size }), [size]);
  return (
    <CardContext.Provider value={ctx}>
      <div
        className={cn(
          "flex flex-col rounded-lg",
          cardSize[size],
          variant === "outline"
            ? "border border-card-border bg-card-surface"
            : "bg-card-surface-filled",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  /** 제목 우측에 붙는 버튼 자리 — 수정 · 더보기 등. */
  action?: React.ReactNode;
}

export function CardHeader({ title, action, className, ...props }: CardHeaderProps) {
  const { size } = React.useContext(CardContext);
  return (
    <div className={cn("flex items-center justify-between gap-2", className)} {...props}>
      <h3 className={cn("font-semibold text-card-title", titleSize[size])}>{title}</h3>
      {action}
    </div>
  );
}

/**
 * 값 줄들을 담습니다. **줄 사이는 6px** — Figma `ResultList` 의 정보 열과 같은 값입니다.
 *
 * 줄 자체는 내용만큼만 높으므로(`CardRow`), 여기 gap 이 유일한 간격 조절 손잡이입니다.
 */
export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

/**
 * **줄 높이를 못박지 않습니다** (2026-08-12). 전에는 `min-h-8`(32) 이라 20px 짜리
 * 글자 줄이 32px 을 차지해서, 네 줄짜리 카드가 필요 이상으로 헐거워 보였습니다.
 *
 * 그 높이가 지키던 것이 없었습니다 — `CardRow` 안에 들어가는 것은 `Badge sm`(20)이
 * 가장 크고, 글자 줄 높이 안에 이미 들어옵니다. 줄 간격은 `CardBody` 의 gap 이
 * 맡습니다 (Figma `ResultList` 도 gap 6 입니다).
 */
const rowSize: Record<Size, { root: string; label: string }> = {
  sm: { root: "text-xs", label: "w-22" },
  default: { root: "text-sm", label: "w-26" },
  lg: { root: "text-sm", label: "w-26" },
};

export interface CardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** 값이 없으면 하이픈을 보여줍니다 — 빈칸이면 조회가 덜 된 건지 값이 없는 건지 모릅니다. */
  children?: React.ReactNode;
}

export function CardRow({ label, className, children, ...props }: CardRowProps) {
  const { size } = React.useContext(CardContext);
  const s = rowSize[size];
  return (
    <div className={cn("flex items-start gap-3", s.root, className)} {...props}>
      <span className={cn("shrink-0 pt-0.5 text-card-label", s.label)}>{label}</span>
      <span className="min-w-0 flex-1 pt-0.5 text-card-value">
        {children == null || children === "" ? "-" : children}
      </span>
    </div>
  );
}
