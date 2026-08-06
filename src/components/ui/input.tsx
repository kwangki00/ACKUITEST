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
// md 이상에서만 Figma 에 그려진 PC 값으로 줄입니다.
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-base md:text-xs rounded-md",
  default: "h-[var(--h-input-default)] px-3 gap-2 text-base md:text-sm rounded-md",
  lg: "h-[var(--h-input-lg)] px-4 gap-2 text-base rounded-lg",
  grid: "h-[var(--h-datagrid)] px-2 gap-2 text-base md:text-sm rounded-none",
};

const stateMap: Record<State, string> = {
  default:
    "bg-input-surface border-input-border focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-input-border-disabled",
  readonly: "bg-input-surface-readonly border-input-border-readonly",
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
          stateMap[resolved],
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
        {unit && <span className="text-text-subtle">{unit}</span>}
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
