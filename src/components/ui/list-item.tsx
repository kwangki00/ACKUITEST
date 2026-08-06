import * as React from "react";
import { Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckMark } from "@/components/ui/check-mark";

/**
 * Figma: ListItem (16 변형 — Type 4 × State 4)
 *
 * Popover(Type=list) 안에 들어가는 목록 항목입니다.
 * Select 패널 · Combobox · 자동완성 · 드롭다운 메뉴가 모두 이걸 씁니다.
 *
 * Type — text(기본) / check(단일 선택, 우측 표식) / checkbox(다중 선택, 좌측 박스) / match(자동완성 강조)
 *
 * 높이는 32 단일 규격입니다 (--h-list-item, 모바일 48).
 * 더 조밀한 목록이 필요해지면 Figma 에 sm 사이즈 축을 먼저 추가하세요.
 *
 * **Hover 와 Selected 의 배경이 같습니다** (둘 다 Action/Accent).
 * 방향키로 짚은 항목도 같은 배경을 씁니다. 배경이 세 가지를 동시에 뜻하므로
 * **선택은 반드시 표식으로 알려야 합니다** — 단일 선택 목록에는 check,
 * 다중 선택에는 checkbox. text · match 는 선택 표식이 없어 목록 선택에 쓰면 안 됩니다.
 *
 * 검색어 강조(query)는 Type 축과 별개라 check · checkbox 와 함께 켤 수 있습니다.
 */

type ListItemType = "text" | "check" | "checkbox" | "match";

export interface ListItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** HTML button 의 type 이 아니라 Figma 의 Type 축입니다 — 항상 button 으로 렌더합니다. */
  type?: ListItemType;
  selected?: boolean;
  /** 일부만 선택된 상태. 전체 선택 줄처럼 하위를 대표하는 항목에 씁니다. */
  indeterminate?: boolean;
  leadingIcon?: React.ReactNode;
  /**
   * 진하게 표시할 부분. 라벨 안에서 처음 나오는 위치를 찾습니다.
   * Figma 는 앞부분만 모델링했지만(Match + Rest), 자동완성은 가운데도 맞아야 합니다.
   *
   * **Type 축과 독립입니다.** Figma 는 검색 강조를 Type=Match 로 모델링했지만,
   * 검색이 있는 단일 선택 목록은 강조와 선택 표식이 **동시에** 필요합니다
   * (Figma 의 Select Open Demo 도 Type=Check 입니다).
   * 그래서 코드에서는 query 를 넘기면 어느 Type 이든 강조가 켜집니다.
   */
  query?: string;
}

/** 라벨에서 query 와 맞는 구간만 진하게 나눕니다. */
function splitMatch(label: string, query?: string) {
  if (!query) return null;
  const i = label.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return null;
  return { before: label.slice(0, i), hit: label.slice(i, i + query.length), after: label.slice(i + query.length) };
}

export function ListItem({
  type = "text",
  selected,
  indeterminate,
  disabled,
  leadingIcon,
  query,
  className,
  children,
  ...props
}: ListItemProps) {
  const label = typeof children === "string" ? children : null;
  const parts = label ? splitMatch(label, query) : null;
  const dim = selected && !disabled ? undefined : "text-text-muted-foreground";

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={cn(
        // shrink-0 이 없으면 flex 컨테이너 안에서 높이가 눌립니다.
        // flexbox 는 최대 높이를 넘으면 스크롤보다 먼저 항목을 줄입니다 —
        // 32 로 정해둔 규격이 조용히 28 이 됩니다.
        "flex h-[var(--h-list-item)] w-full shrink-0 items-center gap-2 rounded-sm px-2 text-left text-sm",
        "transition-colors outline-hidden",
        disabled ? "text-text-disabled-on" : "text-text-basic",
        !disabled && "hover:bg-action-accent focus-visible:bg-action-accent",
        // 배경만으로는 hover·커서·선택이 구분되지 않습니다 (셋 다 Action/Accent).
        // 그래서 선택은 글자로도 알립니다 — Text/Primary + Medium.
        // 우측 CheckMark 도 같은 계열(Icon/Primary)이라 한 덩어리로 읽힙니다
        selected && !disabled && "bg-action-accent font-medium text-text-primary",
        "disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        // 행 전체가 누름 대상이라 안의 박스는 표시만 합니다 —
        // 진짜 <input> 을 넣으면 Tab 이 두 번 멈춥니다
        <span
          aria-hidden
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded-sm border transition-colors",
            disabled
              ? "border-input-border-disabled bg-input-surface-disabled"
              : selected || indeterminate
                ? "border-button-primary-fill bg-button-primary-fill"
                : "border-input-border bg-input-surface"
          )}
        >
          {!disabled &&
            (indeterminate ? (
              <Minus className="size-3 text-text-basic-inverse [--icon-stroke:3]" />
            ) : selected ? (
              <CheckMark size="sm" className="size-3 text-text-basic-inverse [--icon-stroke:3]" />
            ) : null)}
        </span>
      )}

      {leadingIcon && (
        <span className="shrink-0 text-icon-gray-light [&_svg]:size-4">{leadingIcon}</span>
      )}

      <span className="min-w-0 flex-1 truncate">
        {parts ? (
          <>
            {/* 선택된 줄은 글자 전체가 Primary 라 안 맞는 부분을 흐리지 않습니다 —
                흐리면 선택 색이 반쯤 지워져 무엇이 골라졌는지 다시 흐려집니다 */}
            {parts.before && <span className={dim}>{parts.before}</span>}
            <span className="font-medium">{parts.hit}</span>
            {parts.after && <span className={dim}>{parts.after}</span>}
          </>
        ) : (
          children
        )}
      </span>

      {type === "check" && selected && !disabled && <CheckMark className="shrink-0" />}
    </button>
  );
}
