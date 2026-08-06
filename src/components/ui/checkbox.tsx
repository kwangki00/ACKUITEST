import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Checkbox (18 variants)
 * Size 2 × Checked 3 × State 3
 *
 * 높이는 --h-control-* 이라 모바일에서 커집니다.
 * 박스는 sm 14 · default 16 — 라벨(12/14)보다 살짝 작습니다.
 * Error 는 필수 동의 항목 미체크처럼 체크가 강제될 때 씁니다.
 *
 * indeterminate 는 HTML 속성이 아니라 DOM 프로퍼티라서 JSX 로 못 넘깁니다.
 * 안 세우면 겉모습만 '일부 선택'이고 보조기술에는 unchecked 로 읽힙니다.
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "default";
  label?: string;
  indeterminate?: boolean;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "default", label, indeterminate, error, checked, disabled, id, ...props }, ref) => {
    const boxSize = size === "sm" ? "size-[14px]" : "size-4";
    const autoId = React.useId();
    const inputId = id ?? autoId;

    // 밖으로 넘기는 ref 와 별개로 내부 ref 가 필요합니다 — indeterminate 를
    // 세우려면 엘리먼트를 직접 만져야 하는데, forwardRef 로 받은 ref 는
    // 함수형일 수도 있어 .current 로 읽을 수 없습니다.
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2 select-none",
          size === "sm" ? "h-[var(--h-control-sm)] text-xs" : "h-[var(--h-control-default)] text-sm",
          disabled ? "cursor-not-allowed text-text-disabled-on" : "cursor-pointer text-text-basic",
          className
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={innerRef}
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
              "bg-input-surface",
              error ? "border-input-border-error" : "border-input-border",
              "peer-checked:border-button-primary-fill peer-checked:bg-button-primary-fill",
              // 체크 표시의 노출은 여기서 정합니다. peer-* 는 형제만 고를 수 있어
              // (`.peer:checked ~ *`) 박스 안의 아이콘에는 직접 걸리지 않습니다.
              "peer-checked:[&_svg]:opacity-100",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-action-focus-ring",
              "peer-disabled:border-input-border-disabled peer-disabled:bg-button-disabled-fill",
              indeterminate && "border-button-primary-fill bg-button-primary-fill"
            )}
          >
            {indeterminate ? (
              <Minus className="size-3 text-text-basic-inverse" strokeWidth={3} />
            ) : (
              <Check
                className="size-3 text-text-basic-inverse opacity-0"
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
