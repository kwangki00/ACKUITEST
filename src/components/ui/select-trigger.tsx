import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFieldBinding } from "@/components/ui/form-field";

/**
 * Figma: SelectTrigger (120 변형 — Size 4 × State 6 × Render 5)
 *
 * **트리거는 하나입니다.** 네이티브 Select 든 Combobox 든 같은 껍데기를 씁니다.
 * Figma 에도 SelectTrigger 하나뿐이고, 드롭다운 패널만 따로(ComboboxPanel) 있습니다.
 *
 * 안에 무엇을 넣느냐가 Render 축입니다 — 값 글자 / 칩 / 요약 / 입력.
 * 여기서는 껍데기(크기·상태·아이콘·Clear·Chevron)만 담당하고
 * 값 표현은 children 으로 받습니다.
 *
 * 상태·색 규칙은 Input 과 완전히 같습니다.
 *
 * <div role="combobox"> 인 이유 — 칩의 삭제 버튼이나 Clear 가 안에 들어가는데
 * 버튼 안의 버튼은 잘못된 HTML 입니다. 대신 Enter·Space 를 직접 처리합니다.
 */

export type SelectSize = "sm" | "default" | "lg" | "grid";
export type SelectState = "default" | "error" | "disabled" | "readonly";

/** 껍데기 규격 — Figma Size 축 그대로. */
const sizeMap: Record<SelectSize, string> = {
  sm: "h-[var(--h-input-sm)] gap-1.5 px-3 text-base lg:text-sm rounded-md [&_svg]:size-4",
  default: "h-[var(--h-input-default)] gap-2 px-3 text-base lg:text-sm rounded-md [&_svg]:size-4",
  // lg 만 아이콘이 20 입니다 — 글자도 16 이라 짝이 맞습니다 (Input 과 같은 규칙)
  lg: "h-[var(--h-input-lg)] gap-2 px-4 text-base rounded-md [&_svg]:size-5",
  grid: "h-[var(--h-datagrid)] gap-2 px-2 text-base lg:text-sm rounded-sm [&_svg]:size-4",
};

const stateMap: Record<SelectState, string> = {
  default:
    "bg-input-surface border-input-border focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-input-border-disabled text-text-disabled",
  readonly: "bg-input-surface-readonly border-input-border-readonly",
};

/**
 * grid 는 데이터그리드 셀에 녹아 있어야 합니다 — 평상시 테두리도 배경도 없이
 * 행의 hover·selected 색이 비치고, 포커스·에러일 때만 나타납니다. Input 과 같은 규칙.
 */
const gridStateMap: Record<SelectState, string> = {
  default:
    "bg-transparent border-transparent focus-within:bg-input-surface focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-transparent text-text-disabled",
  readonly: "bg-input-surface-readonly border-transparent",
};

/** 네이티브 <select> 등 껍데기를 직접 그리는 쪽도 같은 상태 색을 쓰도록 내보냅니다. */
export function selectStateClass(state: SelectState, grid = false) {
  return (grid ? gridStateMap : stateMap)[state];
}

export interface SelectTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  /** 패널이 열려 있는지 — aria-expanded 로 나갑니다. */
  open?: boolean;
  leadingIcon?: React.ReactNode;
  /** 화살표 왼쪽 전체 해제. 필수 항목에는 쓰지 마세요. */
  onClear?: () => void;
  /** 값 표현 — 글자 · 칩 · 요약 무엇이든. */
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  (
    {
      size = "default",
      state = "default",
      disabled,
      open,
      leadingIcon,
      onClear,
      className,
      children,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const resolved: SelectState = disabled ? "disabled" : state;
    const isGrid = size === "grid";

    /*
      **div 는 `<label for>` 로 못 묶습니다.** for 가 가리킬 수 있는 것은 input ·
      select · textarea 같은 labelable 요소뿐이라, 여기에 걸면 조용히 아무 일도
      일어나지 않습니다 (실제로 그 상태였습니다). 대신 라벨의 id 를 aria-labelledby
      로 가리킵니다.

      직접 준 이름이 있으면 그게 이깁니다 — 달력의 년·월 Select 처럼 라벨을 둘
      자리가 없어 aria-label 을 쓰는 곳이 컨텍스트를 집어가지 않게 합니다.
    */
    const field = useFieldBinding({ ariaLabel, ariaLabelledBy, ariaDescribedBy, labelable: false });

    return (
      <div
        ref={ref}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        {...field}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          // 안의 <input> 이나 버튼에서 올라온 키는 건드리지 않습니다.
          // 안 그러면 Editable 렌더에서 Space 를 칠 때마다 트리거가 눌립니다
          if (e.target !== e.currentTarget) return;
          // div 는 네이티브 버튼이 공짜로 주던 Enter·Space 가 없습니다
          if (!disabled && (e.key === "Enter" || e.key === " ") && !e.defaultPrevented) {
            e.preventDefault();
            (e.currentTarget as HTMLElement).click();
          }
        }}
        className={cn(
          "flex w-full items-center border transition-colors outline-hidden",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          sizeMap[size],
          selectStateClass(resolved, isGrid),
          className
        )}
        {...props}
      >
        {leadingIcon && (
          <span className="shrink-0 text-icon-muted-foreground">{leadingIcon}</span>
        )}

        <span className="flex min-w-0 flex-1 items-center gap-1">{children}</span>

        <span className="flex shrink-0 items-center gap-1">
          {onClear && !disabled && (
            <button
              type="button"
              aria-label="선택 해제"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className={cn(
                "grid size-4 place-items-center rounded-xs text-icon-muted-foreground",
                "hover:text-text-basic focus-visible:ring-2",
                "focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
              )}
            >
              <X />
            </button>
          )}
          <ChevronDown className="text-icon-muted-foreground" aria-hidden />
        </span>
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";
