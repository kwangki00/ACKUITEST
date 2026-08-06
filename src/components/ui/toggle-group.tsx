import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: ToggleGroup (8 변형) + ToggleItem (32 변형 — Variant 2 × Size 4 × State 4)
 *
 * 조회 조건이나 표시 방식을 바꾸는 세그먼트 컨트롤입니다.
 * 누르는 즉시 반영되며 저장 버튼이 없습니다.
 *
 * 비슷한 것들과의 구분 — 겉모습이 아니라 **무엇이 바뀌는지**로 고릅니다.
 * - 아래 영역 내용이 통째로 바뀜        → Tabs
 * - 조회 조건만 바뀜 (즉시 반영)        → ToggleGroup
 * - 저장 버튼을 눌러야 반영됨           → ChoiceGroup(Radio)
 * 스크린리더는 이 셋을 다르게 읽으므로 겉모습만 보고 고르면 안 됩니다.
 *
 * Variant — Pill(리스트 배경 위 알약) / Outline(테두리가 이어진 세그먼트).
 * Pill 의 선택 배경은 리스트 배경과 대비 1.24:1 이라 **그림자가 필수**입니다.
 * 높이는 --h-input-* 이라 Input·Button·Tabs 와 줄이 맞습니다.
 */

type Variant = "pill" | "outline";
type Size = "xs" | "sm" | "default" | "lg";

/** 항목 규격 — 두 variant 가 공유합니다. */
const itemSize: Record<Size, string> = {
  xs: "h-[var(--h-input-xs)] px-2 gap-1 text-xs [&_svg]:size-3",
  sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-xs [&_svg]:size-[14px]",
  default: "h-[var(--h-input-default)] px-4 gap-2 text-sm [&_svg]:size-4",
  lg: "h-[var(--h-input-lg)] px-6 gap-2 text-base [&_svg]:size-5",
};

/** Outline 은 양 끝 항목이 모서리를 그립니다 — 사이즈마다 반경이 다릅니다. */
const outlineEnds: Record<Size, string> = {
  xs: "first:rounded-l-sm last:rounded-r-sm",
  sm: "first:rounded-l-md last:rounded-r-md",
  default: "first:rounded-l-md last:rounded-r-md",
  lg: "first:rounded-l-lg last:rounded-r-lg",
};

/** Pill 그룹의 안쪽 여백만 사이즈를 탑니다. 반경 8 · 간격 4 는 공통. */
const pillPad: Record<Size, string> = {
  xs: "p-0.5",
  sm: "p-0.5",
  default: "p-1",
  lg: "p-1.5",
};

const ToggleGroupContext = React.createContext<{
  variant: Variant;
  size: Size;
  isSelected: (v: string) => boolean;
  toggle: (v: string) => void;
  multiple: boolean;
  disabled?: boolean;
} | null>(null);

export interface ToggleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  variant?: Variant;
  size?: Size;
  /** single 이 기본입니다. multiple 은 서식 툴바처럼 여러 개를 동시에 켤 때. */
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: never) => void;
  disabled?: boolean;
}

export function ToggleGroup({
  variant = "pill",
  size = "default",
  type = "single",
  value,
  onValueChange,
  disabled,
  className,
  children,
  ...props
}: ToggleGroupProps) {
  const multiple = type === "multiple";

  const ctx = React.useMemo(() => {
    const values = multiple ? ((value as string[]) ?? []) : value != null ? [value as string] : [];
    return {
      variant,
      size,
      multiple,
      disabled,
      isSelected: (v: string) => values.includes(v),
      toggle: (v: string) => {
        if (!onValueChange) return;
        const emit = onValueChange as (x: string | string[]) => void;
        if (multiple) emit(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
        // single 은 같은 값을 다시 눌러도 해제하지 않습니다 — 조회 조건이
        // 아무것도 선택되지 않은 상태로 빠지면 무엇을 보고 있는지 알 수 없습니다
        else emit(v);
      },
    };
  }, [variant, size, multiple, disabled, value, onValueChange]);

  return (
    <ToggleGroupContext.Provider value={ctx}>
      <div
        // single 은 라디오 묶음으로 읽혀야 합니다. multiple 은 누름 버튼 묶음입니다.
        role={multiple ? "group" : "radiogroup"}
        className={cn(
          "inline-flex items-center",
          variant === "pill"
            ? cn("gap-1 rounded-lg bg-toggle-list-surface", pillPad[size])
            : "gap-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
  value: string;
}

export function ToggleItem({ value, className, disabled, children, ...props }: ToggleItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleItem 은 ToggleGroup 안에서만 씁니다.");

  const selected = ctx.isSelected(value);
  const isDisabled = disabled ?? ctx.disabled ?? false;

  return (
    <button
      type="button"
      role={ctx.multiple ? undefined : "radio"}
      aria-checked={ctx.multiple ? undefined : selected}
      aria-pressed={ctx.multiple ? selected : undefined}
      disabled={isDisabled}
      onClick={() => ctx.toggle(value)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap",
        "transition-colors select-none",
        "focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px]",
        "focus-visible:ring-action-focus-ring",
        "disabled:pointer-events-none",
        itemSize[ctx.size],
        ctx.variant === "pill"
          ? cn(
              "rounded-md",
              selected
                // 흰 알약과 회색 리스트 배경의 대비가 1.24:1 뿐이라 그림자가 형태를 만듭니다
                ? "bg-toggle-surface-pill text-text-basic shadow-xs"
                : "text-toggle-text-default hover:text-text-basic",
              isDisabled && "text-text-disabled-on"
            )
          : cn(
              "border border-toggle-border",
              // 테두리를 겹쳐 세그먼트 사이가 2px 로 두꺼워지지 않게 합니다
              "-ml-px first:ml-0",
              outlineEnds[ctx.size],
              selected
                // 선택 항목의 테두리가 이웃보다 위에 와야 좌우가 끊기지 않습니다
                ? "relative z-10 border-toggle-border-selected bg-toggle-surface-selected text-toggle-text-selected"
                : "bg-background-white text-text-basic hover:bg-action-accent",
              isDisabled && "bg-input-surface-disabled text-text-disabled-on"
            ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
