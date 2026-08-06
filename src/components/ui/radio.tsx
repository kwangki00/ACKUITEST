import * as React from "react";
import { cn } from "@/lib/utils";
import { ChoiceGroup, type ChoiceDirection } from "@/components/ui/choice-group";

/**
 * Figma: Radio (12 변형 — Size 2 × Selected 2 × State 3)
 *
 * 체크박스와 다른 점 — 선택 표시가 안쪽 점이고, 칠해지는 건 테두리입니다.
 * 원 안은 계속 Input/Surface 로 비어 있습니다. 체크박스처럼 통째로 칠하면
 * 두 컨트롤이 구분되지 않아 "하나만 고르는 것"이라는 신호가 사라집니다.
 *
 * 원 14/16 · 점 6/7 · 라벨 12/14. 높이는 --h-control-* 이라 모바일에서 커집니다.
 * 단독으로 쓰지 마세요 — RadioGroup 으로 묶어야 name 이 공유되고 배타 선택이 됩니다.
 */

type Size = "sm" | "default";

const RadioGroupContext = React.createContext<{
  name?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
} | null>(null);

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value"> {
  size?: Size;
  label?: string;
  error?: boolean;
  /** 기본 input 은 number·배열도 받지만 RadioGroup 이 문자열로 비교하므로 좁힙니다. */
  value?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size, label, error, checked, disabled, name, value, onChange, id, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);
    const autoId = React.useId();
    const inputId = id ?? autoId;

    const s: Size = size ?? group?.size ?? "default";
    const isError = error ?? group?.error ?? false;
    const isDisabled = disabled ?? group?.disabled ?? false;
    const resolvedName = name ?? group?.name;
    const resolvedChecked =
      checked ?? (group && value !== undefined ? group.value === value : undefined);

    const circle = s === "sm" ? "size-[14px]" : "size-4";
    // Figma 는 default 점이 7 이지만 (16−7)/2 = 4.5 라 브라우저에서 반픽셀이 됩니다.
    // 8 로 올리면 정확히 가운데 오고, 테두리와 점 사이 여백이 sm 과 똑같이 3 이 됩니다.
    const dot = s === "sm" ? "size-1.5" : "size-2";

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center select-none",
          // 라벨 간격도 사이즈를 탑니다 — sm 6 · default 8
          s === "sm"
            ? "h-[var(--h-control-sm)] gap-1.5 text-xs"
            : "h-[var(--h-control-default)] gap-2 text-sm",
          isDisabled
            ? "cursor-not-allowed text-text-disabled-on"
            : "cursor-pointer text-text-basic",
          className
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            disabled={isDisabled}
            onChange={(e) => {
              onChange?.(e);
              if (group?.onValueChange && value !== undefined) group.onValueChange(value);
            }}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              circle,
              "grid place-items-center rounded-full border bg-input-surface transition-colors",
              // 선택되면 테두리만 바뀝니다 — 안쪽은 계속 흽니다
              isError
                ? "border-input-border-error peer-checked:border-input-border-error"
                : "border-input-border peer-checked:border-button-primary-fill",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-action-focus-ring",
              "peer-disabled:border-input-border-disabled peer-disabled:bg-input-surface-disabled",
              // peer-* 는 형제만 고릅니다. 점은 이 원의 자손이라 여기서 걸어야 합니다
              "peer-checked:[&>span]:opacity-100",
              "peer-disabled:[&>span]:bg-icon-disabled-on"
            )}
          >
            <span
              className={cn(
                dot,
                "rounded-full opacity-0 transition-opacity",
                isError ? "bg-button-destructive-fill" : "bg-button-primary-fill"
              )}
            />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Vertical 이 기본입니다. 짧은 선택지 2~3개일 때만 horizontal. */
  direction?: ChoiceDirection;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
}

/**
 * Figma 의 ChoiceGroup(Type=Radio)에 대응합니다.
 * 배치는 ChoiceGroup 에 맡깁니다 — 간격 값이 두 벌이 되지 않게.
 */
export function RadioGroup({
  name,
  value,
  onValueChange,
  direction = "vertical",
  size = "default",
  disabled,
  error,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const autoName = React.useId();
  const ctx = React.useMemo(
    () => ({ name: name ?? autoName, value, onValueChange, size, disabled, error }),
    [name, autoName, value, onValueChange, size, disabled, error]
  );
  return (
    <RadioGroupContext.Provider value={ctx}>
      <ChoiceGroup
        role="radiogroup"
        direction={direction}
        className={className}
        {...props}
      >
        {children}
      </ChoiceGroup>
    </RadioGroupContext.Provider>
  );
}
