import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * `Sidebar` 가 접혔는지. 항목이 스스로 알아야 라벨을 끄고 툴팁을 켭니다 —
 * 쓰는 쪽에서 항목마다 `collapsed` 를 넘기면 하나만 빠뜨려도 어긋납니다.
 */
export const SidebarCollapsedContext = React.createContext(false);

/**
 * Figma: SidebarItem (Navigation 페이지 · 6 변형 — Level 2 × State 3)
 *
 * 좌측 GNB 의 메뉴 항목입니다. **단독으로 쓰지 않고** `Sidebar` 나
 * `MobileMenuContent` 안에 넣습니다.
 *
 * ### 두 단계
 *
 * | | 높이 | 왼쪽 | 라벨 | 오른쪽 |
 * |---|---|---|---|---|
 * | `level={1}` | 44 | 아이콘 18 | `sm/Medium` | 펼침 화살표 16 |
 * | `level={2}` | 36 | 불릿 4 (들여쓰기 32) | `sm/Regular` | — |
 *
 * ### Active 는 두 가지 뜻입니다
 *
 * 1단계와 2단계가 **동시에** 켜집니다 — 1단계는 *현재 페이지가 속한 묶음*,
 * 2단계는 *현재 페이지 그 자체*입니다.
 *
 * 그래서 배경 틴트는 둘 다 같고(`Sidebar/Item-Active` · `-Strong`, 지금은 값이 같습니다),
 * **좌측 3px 인디케이터 바는 2단계에만** 붙습니다. 어느 줄이 지금 보고 있는 화면인지를
 * 인디케이터 하나가 가립니다 — 배경을 진하게 해서 구분하면 사이드바 전체가 무거워집니다.
 *
 * ### 그 밖
 *
 * - **하위 메뉴가 없는 1단계는 `chevron` 을 끄세요** — 눌러도 펼쳐지지 않는데
 *   화살표가 있으면 사용자가 눌러 봅니다
 * - `expanded` 가 화살표 방향입니다 (접힘 아래 · 펼침 위)
 * - `count` 는 라벨 뒤에 붙는 건수입니다
 * - Hover 는 prop 이 아니라 CSS 상태입니다 (Figma 의 `State=Hover`)
 */

type Base = {
  label: string;
  active?: boolean;
  /** 라벨 뒤에 붙는 건수. */
  count?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

/**
 * 2단계에는 아이콘·화살표가 **아예 없습니다** — Figma 변형에도 그 노드가 없어서
 * 타입에서 막습니다. 2단계에 화살표를 달면 3단계가 있는 것처럼 보입니다.
 */
export type SidebarItemProps = Base &
  (
    | {
        level?: 1;
        icon?: React.ReactNode;
        /** 하위 메뉴가 없으면 끄세요. */
        chevron?: boolean;
        expanded?: boolean;
      }
    | { level: 2; icon?: never; chevron?: never; expanded?: never }
  );

/**
 * 위 union 을 하나로 편 것입니다. **Storybook 전용**입니다 —
 * `Meta<typeof SidebarItem>` 이 union 을 교차시키면서 args 를 `never` 로 만들어
 * 스토리에서 `icon` 을 넘길 수 없게 됩니다. 앱 코드에서는 `SidebarItemProps` 를 쓰세요.
 */
export type SidebarItemFlatProps = Base & {
  level?: 1 | 2;
  icon?: React.ReactNode;
  chevron?: boolean;
  expanded?: boolean;
};

export function SidebarItem({
  label,
  active,
  count,
  onClick,
  className,
  ...rest
}: SidebarItemProps) {
  const level = rest.level ?? 1;
  const isL1 = level === 1;
  const { icon, chevron = true, expanded } = rest as {
    icon?: React.ReactNode;
    chevron?: boolean;
    expanded?: boolean;
  };

  const collapsed = React.useContext(SidebarCollapsedContext);

  // 접히면 2단계는 통째로 사라집니다 — 아이콘도 라벨도 없어 그릴 것이 없습니다
  if (collapsed && !isL1) return null;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            aria-current={active ? "page" : undefined}
            // 라벨이 화면에서 사라지므로 보조기술에는 이름을 남겨야 합니다
            aria-label={label}
            className={cn(
              "flex h-11 w-12 items-center justify-center rounded-md outline-hidden transition-colors",
              "focus-visible:ring-2 focus-visible:ring-action-focus-ring",
              "[&_svg]:size-4.5",
              active
                ? "bg-sidebar-item-active text-sidebar-text-active"
                : "text-sidebar-text-muted hover:bg-sidebar-item-hover",
              className
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        {/* 접힘 상태에서는 툴팁이 유일한 이름입니다 (Figma 문서의 “미구현” 항목) */}
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-expanded={isL1 && chevron ? !!expanded : undefined}
      className={cn(
        "relative flex w-full items-center rounded-md text-left outline-hidden transition-colors",
        "focus-visible:ring-2 focus-visible:ring-action-focus-ring",
        isL1 ? "h-11 gap-2.5 px-3" : "h-9 gap-2 pr-3 pl-8",
        active
          ? isL1
            ? "bg-sidebar-item-active"
            : "bg-sidebar-item-active-strong"
          : "hover:bg-sidebar-item-hover",
        className
      )}
    >
      {/*
        인디케이터는 2단계에만 — 1단계 Active 는 "이 묶음 안에 현재 페이지가 있다" 는
        뜻이고, 지금 보고 있는 화면은 2단계 하나뿐입니다
      */}
      {!isL1 && active && (
        <span
          aria-hidden
          className="absolute top-1/2 left-0 h-7 w-0.75 -translate-y-1/2 rounded-xs bg-sidebar-indicator"
        />
      )}

      {isL1 ? (
        <span
          className={cn(
            "shrink-0 [&_svg]:size-4.5",
            active ? "text-sidebar-text-active" : "text-sidebar-text-muted"
          )}
        >
          {icon}
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            "size-1 shrink-0 rounded-full",
            active ? "bg-sidebar-indicator" : "bg-sidebar-text-muted"
          )}
        />
      )}

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          active
            ? "font-semibold text-sidebar-text-active"
            : cn("text-sidebar-text", isL1 ? "font-medium" : "font-normal")
        )}
      >
        {label}
      </span>

      {count != null && (
        <span className="shrink-0 text-xs text-sidebar-text-muted">{count}</span>
      )}

      {isL1 && chevron && (
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 transition-transform",
            active ? "text-sidebar-text-active" : "text-sidebar-text-muted",
            expanded && "rotate-180"
          )}
        />
      )}
    </button>
  );
}
