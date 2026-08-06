import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Chip (6 변형 — Size 3 × State 2)
 *
 * 라벨 + 삭제 버튼으로 이루어진 **제거 가능한** 태그입니다.
 * 사용처 — Select 의 다중 선택 값, 적용된 검색 필터 태그, 태그 입력 필드.
 *
 * **Badge 와 구분** — 상태·카테고리를 색으로 구분해 보여주기만 하면 Badge 입니다.
 * Chip 은 사용자가 지울 수 있다는 뜻을 담습니다. 지울 수 없으면 Badge 를 쓰세요.
 *
 * 높이는 Select 트리거에 맞춰 sm 20 / default 24 / lg 28 — Badge 와 같은 축입니다.
 * 다만 모서리는 Badge 가 full, Chip 은 sm(4) 입니다. 둘을 나란히 놓아도 구분됩니다.
 */

type Size = "sm" | "default" | "lg";

const sizeMap: Record<Size, { root: string; icon: string }> = {
  sm: { root: "h-5 gap-[3px] px-1.5 text-xs", icon: "size-3" },
  default: { root: "h-6 gap-1 px-2 text-xs", icon: "size-[14px]" },
  lg: { root: "h-7 gap-1 px-2.5 text-sm", icon: "size-4" },
};

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  disabled?: boolean;
  /** 없으면 삭제 버튼이 빠진 읽기 전용 칩이 됩니다. */
  onRemove?: () => void;
  /** 삭제 버튼의 보조기술 문구. 기본은 "<라벨> 삭제". */
  removeLabel?: string;
}

export function Chip({
  size = "default",
  disabled,
  onRemove,
  removeLabel,
  className,
  children,
  ...props
}: ChipProps) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-sm whitespace-nowrap",
        s.root,
        disabled
          ? "bg-button-disabled-fill text-text-disabled-on"
          : "bg-action-accent text-text-basic",
        className
      )}
      {...props}
    >
      {/* min-w-0 이 없으면 truncate 가 동작하지 않습니다 —
          flex 자식은 기본 min-width:auto 라 내용보다 작아지지 않고 밖으로 넘칩니다 */}
      <span className="min-w-0 truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          // 칩이 누를 수 있는 영역(Select 트리거 등) 안에 있을 때
          // 삭제가 바깥 클릭으로 새면 패널이 같이 열립니다
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
          aria-label={removeLabel ?? `${typeof children === "string" ? children : ""} 삭제`.trim()}
          className={cn(
            "-mr-0.5 grid shrink-0 place-items-center rounded-xs",
            "hover:bg-alpha-inverse10 disabled:pointer-events-none",
            "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
          )}
        >
          <X className={s.icon} />
        </button>
      )}
    </span>
  );
}
