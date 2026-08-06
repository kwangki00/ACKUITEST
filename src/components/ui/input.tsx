import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Input (48 variants)
 * Size 4 × State 6 × Content 2
 *
 * <input> 은 자식을 가질 수 없어, 아이콘·단위·클리어가 붙으면
 * 바깥 래퍼가 테두리를 그리고 안쪽 input 은 테두리를 없앱니다.
 */
type Size = "sm" | "default" | "lg" | "grid";
type State = "default" | "error" | "disabled" | "readonly";

// 모바일은 16px 이상이어야 iOS 가 포커스 시 화면을 확대하지 않습니다.
// 줄이는 시점은 lg(1024) — Responsive 변수가 PC 로 갈리는 지점과 같아야
// 높이는 모바일인데 글자만 PC 인 구간이 생기지 않습니다.
// 글자는 sm·default·grid 가 14, lg 만 16 입니다 — 높이는 달라도 글자는 같습니다.
// 반경은 grid 만 sm(4), 나머지는 md(6).
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-base lg:text-sm rounded-md",
  default: "h-[var(--h-input-default)] px-3 gap-2 text-base lg:text-sm rounded-md",
  lg: "h-[var(--h-input-lg)] px-4 gap-2 text-base rounded-md",
  grid: "h-[var(--h-datagrid)] px-2 gap-2 text-base lg:text-sm rounded-sm",
};

const stateMap: Record<State, string> = {
  default:
    "bg-input-surface border-input-border focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-input-border-disabled",
  readonly: "bg-input-surface-readonly border-input-border-readonly",
};

// grid 는 데이터그리드 셀에 녹아 있어야 합니다. 평상시 테두리도 배경도 없어
// 행의 hover·selected 색이 그대로 비칩니다 — 흰 배경을 주면 행 위에 떠 보입니다.
// 클릭해서 포커스가 오거나 에러일 때만 나타납니다.
const gridStateMap: Record<State, string> = {
  default:
    "bg-transparent border-transparent focus-within:bg-input-surface focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-transparent",
  readonly: "bg-input-surface-readonly border-transparent",
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: Size;
  state?: State;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  unit?: string;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = "default",
      state = "default",
      leadingIcon,
      trailingIcon,
      unit,
      onClear,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const resolved: State = disabled ? "disabled" : readOnly ? "readonly" : state;
    return (
      <div
        className={cn(
          "flex w-full items-center border transition-colors",
          sizeMap[size],
          (size === "grid" ? gridStateMap : stateMap)[resolved],
          className
        )}
      >
        {leadingIcon && (
          <span className="text-icon-muted-foreground [&_svg]:size-4">{leadingIcon}</span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-hidden",
            "text-text-basic placeholder:text-text-placeholder",
            "disabled:text-text-disabled disabled:cursor-not-allowed"
          )}
          {...props}
        />
        {unit && <span className="text-text-muted-foreground">{unit}</span>}
        {onClear && !disabled && !readOnly && (
          <button
            type="button"
            onClick={onClear}
            aria-label="입력값 지우기"
            className="text-icon-muted-foreground hover:text-text-basic"
          >
            <X className="size-4" />
          </button>
        )}
        {trailingIcon && (
          <span className="text-icon-muted-foreground [&_svg]:size-4">{trailingIcon}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
