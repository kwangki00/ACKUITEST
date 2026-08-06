import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Select (72 variants) — Render=Text 만 네이티브로 구현
 * Chip · Combobox · Lookup 은 Popover 조합이라 별도입니다.
 */
type Size = "sm" | "default" | "lg" | "grid";
type State = "default" | "error" | "disabled" | "readonly";

// Input 과 같은 규칙 — 모바일 16px 이상으로 iOS 자동 확대를 막습니다.
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] pl-3 pr-9 text-base md:text-xs rounded-md",
  default: "h-[var(--h-input-default)] pl-3 pr-10 text-base md:text-sm rounded-md",
  lg: "h-[var(--h-input-lg)] pl-4 pr-11 text-base rounded-lg",
  grid: "h-[var(--h-datagrid)] pl-2 pr-8 text-base md:text-sm rounded-none",
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
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full appearance-none border bg-input-surface text-text-basic outline-hidden transition-colors",
            sizeMap[size],
            resolved === "default" &&
              "border-input-border focus:border-input-border-focus focus:ring-[3px] focus:ring-action-focus-ring",
            resolved === "error" &&
              "border-input-border-error focus:ring-[3px] focus:ring-action-focus-ring-danger",
            resolved === "disabled" &&
              "border-input-border-disabled bg-input-surface-disabled text-text-disabled cursor-not-allowed",
            resolved === "readonly" && "border-input-border-readonly bg-input-surface-readonly",
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
