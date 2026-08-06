import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckboxGroupContext } from "@/components/ui/choice-group";

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
 *
 * 여러 개를 묶을 때는 CheckboxGroup 안에 넣고 value 만 주면 됩니다.
 * size · disabled · error 는 그룹에서 내려받습니다.
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value"> {
  size?: "sm" | "default";
  label?: string;
  indeterminate?: boolean;
  error?: boolean;
  /** CheckboxGroup 안에서 이 항목을 가리키는 값입니다. */
  value?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, size, label, indeterminate, error, checked, disabled, name, value, onChange, id, ...props },
    ref
  ) => {
    const group = React.useContext(CheckboxGroupContext);
    const s = size ?? group?.size ?? "default";
    const isError = error ?? group?.error ?? false;
    const isDisabled = disabled ?? group?.disabled ?? false;
    const resolvedName = name ?? group?.name;
    const resolvedChecked =
      checked ?? (group?.values && value !== undefined ? group.values.includes(value) : undefined);

    const boxSize = s === "sm" ? "size-[14px]" : "size-4";
    // 체크 표시도 박스를 따라갑니다 — sm 10 · default 12 (박스 안쪽 여백 2)
    const mark = s === "sm" ? "size-2.5" : "size-3";
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
          "inline-flex items-center select-none",
          // 라벨 간격도 사이즈를 탑니다 — sm 6 · default 8
          s === "sm"
            ? "h-[var(--h-control-sm)] gap-1.5 text-xs"
            : "h-[var(--h-control-default)] gap-2 text-sm",
          isDisabled ? "cursor-not-allowed text-text-disabled-on" : "cursor-pointer text-text-basic",
          className
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            disabled={isDisabled}
            onChange={(e) => {
              onChange?.(e);
              if (group?.onToggle && value !== undefined) group.onToggle(value, e.target.checked);
            }}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              boxSize,
              "grid place-items-center rounded-sm border transition-colors",
              "bg-input-surface",
              isError ? "border-input-border-error" : "border-input-border",
              "peer-checked:border-button-primary-fill peer-checked:bg-button-primary-fill",
              // 체크 표시의 노출은 여기서 정합니다. peer-* 는 형제만 고를 수 있어
              // (`.peer:checked ~ *`) 박스 안의 아이콘에는 직접 걸리지 않습니다.
              "peer-checked:[&_svg]:opacity-100",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-action-focus-ring",
              "peer-disabled:border-input-border-disabled peer-disabled:bg-button-disabled-fill",
              indeterminate && "border-button-primary-fill bg-button-primary-fill"
            )}
          >
            {/* 12px 안에 들어가는 글리프라 기본 1.5 로는 흐립니다.
                strokeWidth prop 은 전역 .lucide 규칙에 덮이므로 변수로 지정합니다. */}
            {indeterminate ? (
              <Minus className={cn(mark, "text-text-basic-inverse [--icon-stroke:3]")} />
            ) : (
              <Check className={cn(mark, "text-text-basic-inverse opacity-0 [--icon-stroke:3]")} />
            )}
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
