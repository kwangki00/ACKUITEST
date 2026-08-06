import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Select (72 variants) — Render=Text 만 네이티브로 구현
 * Chip · Combobox · Lookup 은 Popover 조합이라 별도입니다.
 */
type Size = "sm" | "default" | "lg" | "grid";
type State = "default" | "error" | "disabled" | "readonly";

// Input 과 완전히 같은 규칙입니다 — 모바일 16px 이상, lg(1024)에서 축소.
// 글자는 sm·default·grid 14 / lg 16, 반경은 grid 만 sm(4) 나머지 md(6).
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] pl-3 pr-9 text-base lg:text-sm rounded-md",
  default: "h-[var(--h-input-default)] pl-3 pr-10 text-base lg:text-sm rounded-md",
  lg: "h-[var(--h-input-lg)] pl-4 pr-11 text-base rounded-md",
  grid: "h-[var(--h-datagrid)] pl-2 pr-8 text-base lg:text-sm rounded-sm",
};

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: Size;
  state?: State;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = "default", state = "default", placeholder, children, disabled, ...props }, ref) => {
    const resolved: State = disabled ? "disabled" : state;
    const isGrid = size === "grid";
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full appearance-none border text-text-basic outline-hidden transition-colors",
            sizeMap[size],
            // grid 는 셀에 녹아 있어야 합니다 — 평상시 테두리·배경 없이
            // 행의 hover·selected 색이 비치고, 포커스·에러일 때만 나타납니다.
            isGrid
              ? "bg-transparent focus:bg-input-surface"
              : "bg-input-surface",
            resolved === "default" &&
              (isGrid
                ? "border-transparent focus:border-input-border-focus focus:ring-[3px] focus:ring-action-focus-ring"
                : "border-input-border focus:border-input-border-focus focus:ring-[3px] focus:ring-action-focus-ring"),
            resolved === "error" &&
              "border-input-border-error bg-input-surface focus:ring-[3px] focus:ring-action-focus-ring-danger",
            resolved === "disabled" &&
              cn(
                "bg-input-surface-disabled text-text-disabled cursor-not-allowed",
                isGrid ? "border-transparent" : "border-input-border-disabled"
              ),
            resolved === "readonly" &&
              cn(
                "bg-input-surface-readonly",
                isGrid ? "border-transparent" : "border-input-border-readonly"
              ),
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-icon-muted-foreground"
          aria-hidden
        />
      </div>
    );
  }
);
Select.displayName = "Select";
