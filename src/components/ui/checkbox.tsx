import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Checkbox (18 variants)
 * Size 2 × Checked 3 × State 3
 * 높이는 --h-control-* 이라 모바일에서 커집니다.
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "default";
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "default", label, indeterminate, checked, disabled, id, ...props }, ref) => {
    const boxSize = size === "sm" ? "size-4" : "size-[18px]";
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2 select-none",
          size === "sm" ? "h-[var(--h-control-sm)] text-xs" : "h-[var(--h-control-default)] text-sm",
          disabled ? "cursor-not-allowed text-text-disabled" : "cursor-pointer text-text-basic",
          className
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              boxSize,
              "grid place-items-center rounded-sm border transition-colors",
              "border-input-border bg-input-surface",
              "peer-checked:border-button-primary-fill peer-checked:bg-button-primary-fill",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-action-focus-ring",
              "peer-disabled:border-input-border-disabled peer-disabled:bg-surface-disabled",
              indeterminate && "border-button-primary-fill bg-button-primary-fill"
            )}
          >
            {indeterminate ? (
              <Minus className="size-3 text-text-basic-inverse" strokeWidth={3} />
            ) : (
              <Check
                className="size-3 text-text-basic-inverse opacity-0 peer-checked:opacity-100"
                strokeWidth={3}
              />
            )}
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
