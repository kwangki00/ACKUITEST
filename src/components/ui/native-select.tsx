import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  selectStateClass,
  type SelectSize as Size,
  type SelectState as State,
} from "@/components/ui/select-trigger";

/**
 * 네이티브 `<select>` 입니다. **Figma 에 대응물이 없습니다.**
 *
 * Figma 의 Select 는 트리거만 정의하고 목록은 Popover + ListItem 으로 그립니다.
 * 이건 트리거만 토큰대로 칠하고 **목록은 OS 가 그립니다** — 글꼴·행 높이·hover 색이
 * 디자인 시스템과 다릅니다. 바꿀 수 없습니다.
 *
 * 그래서 기본은 `Select`(Popover 기반)를 쓰세요. 이건 다음일 때만 씁니다.
 * - 모바일에서 OS 휠 피커를 쓰고 싶을 때
 * - 목록이 아주 짧고 모양이 중요하지 않을 때 (표 셀 인라인 편집 등)
 *
 * **상태 색은 SelectTrigger 와 공유합니다.** 정의가 두 곳에 있으면 갈립니다.
 */

// Input 과 완전히 같은 규칙입니다 — 모바일 16px 이상, lg(1024)에서 축소.
// 글자는 sm·default·grid 14 / lg 16, 반경은 grid 만 sm(4) 나머지 md(6).
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] pl-3 pr-9 text-base lg:text-sm rounded-md",
  default: "h-[var(--h-input-default)] pl-3 pr-10 text-base lg:text-sm rounded-md",
  lg: "h-[var(--h-input-lg)] pl-4 pr-11 text-base rounded-md",
  grid: "h-[var(--h-datagrid)] pl-2 pr-8 text-base lg:text-sm rounded-sm",
};

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: Size;
  state?: State;
  placeholder?: string;
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
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
            // 상태 색은 SelectTrigger 와 같은 정의를 씁니다
            selectStateClass(resolved, isGrid),
            resolved === "disabled" && "cursor-not-allowed",
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
NativeSelect.displayName = "NativeSelect";
