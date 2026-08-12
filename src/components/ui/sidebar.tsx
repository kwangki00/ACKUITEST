import * as React from "react";
import { LogOut, Menu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { SidebarCollapsedContext } from "@/components/ui/sidebar-item";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Figma: Sidebar (Navigation 페이지 · 2 변형 — State)
 *
 * PC 좌측 GNB 입니다. **Header · Menu · Footer** 세 영역입니다.
 *
 * | | 펼침 | 접힘 |
 * |---|---|---|
 * | 폭 | **256** | **72** |
 * | Header | 로고 + 제목 + 토글 | 로고 (누르면 펼쳐집니다) |
 * | Menu | 1·2단계 전부 | **1단계 아이콘만** + 툴팁 |
 * | Footer | Avatar + 이름·메일 + 설정·로그아웃 | 세로로 쌓음 |
 *
 * ### 접힘은 항목이 스스로 압니다
 *
 * `SidebarCollapsedContext` 로 내려줍니다 — 항목마다 `collapsed` 를 넘기게 하면
 * 하나만 빠뜨려도 그 줄만 라벨이 남습니다.
 *
 * 접히면 **2단계는 통째로 사라집니다.** 아이콘도 라벨도 없어 그릴 것이 없습니다.
 *
 * ### 접힘 상태의 이름은 툴팁입니다
 *
 * 라벨이 화면에서 사라지므로 **툴팁이 유일한 이름**입니다 (`aria-label` 도 함께).
 * Figma 문서에 "Tooltip 이 필요합니다 (미구현)" 이라고 적혀 있던 자리입니다 —
 * 코드에는 `Tooltip` 이 있으니 채웠습니다. **앱 루트에 `TooltipProvider` 가 필요합니다.**
 *
 * ### 접으면 로고가 토글입니다
 *
 * Figma 의 `State=Collapsed` 는 토글 아이콘을 숨겨 둡니다 — 그대로 두면 한 번 접고 나서
 * **다시 펼 방법이 없습니다.** 코드는 겉모습을 그대로 두고 **로고 자리를 버튼으로**
 * 만들었습니다 (툴팁 "메뉴 펼치기").
 *
 * ### 그 밖
 *
 * - **메뉴가 6개를 넘으면** 슬롯을 늘리지 말고 이 영역이 스크롤합니다 —
 *   Header 와 Footer 는 남습니다
 * - Header 높이는 펼침·접힘 **둘 다 52** 입니다. Figma 는 40·52 로 갈려 있어
 *   접을 때 로고가 위아래로 튑니다 (2026-08-07, Figma 정리 대상)
 * - 폭이 바뀌므로 오른쪽 작업 영역은 **남는 폭을 쓰게** 두세요 (`flex-1`).
 *   고정 폭을 주면 접을 때 빈칸이 생깁니다
 */

export interface SidebarUser {
  name: string;
  email?: string;
  /** 없으면 이름 첫 글자를 씁니다. */
  initial?: string;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 로고 옆 제목. 접히면 숨습니다. */
  title?: string;
  logo?: React.ReactNode;
  user?: SidebarUser;
  onSettings?: () => void;
  onLogout?: () => void;
  /** `SidebarItem` 들. 6개를 넘으면 이 영역이 스크롤합니다. */
  children: React.ReactNode;
  className?: string;
}

function FooterAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md",
        "text-sidebar-text-muted outline-hidden transition-colors",
        "hover:bg-sidebar-item-hover focus-visible:ring-2 focus-visible:ring-action-focus-ring",
        "[&_svg]:size-4.5"
      )}
    >
      {children}
    </button>
  );
}

const DEFAULT_LOGO = (
  <span className="text-base font-bold tracking-tight text-text-primary">ACK</span>
);

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  title = "결과조회 시스템",
  logo = DEFAULT_LOGO,
  user,
  onSettings,
  onLogout,
  children,
  className,
}: SidebarProps) {
  const toggle = () => onCollapsedChange?.(!collapsed);

  return (
    <SidebarCollapsedContext.Provider value={collapsed}>
      <nav
        aria-label="주요 메뉴"
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar-surface",
          "transition-[width] duration-150",
          collapsed ? "w-18" : "w-64",
          className
        )}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex h-13 shrink-0 items-center border-b border-sidebar-border px-3">
          {collapsed ? (
            // 접히면 로고 자리가 토글입니다 — 아니면 다시 펼 방법이 없습니다
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="메뉴 펼치기"
                  aria-expanded={false}
                  onClick={toggle}
                  className={cn(
                    "flex h-9 w-full cursor-pointer items-center justify-center rounded-md",
                    "outline-hidden transition-colors",
                    "hover:bg-sidebar-item-hover focus-visible:ring-2 focus-visible:ring-action-focus-ring"
                  )}
                >
                  {logo}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">메뉴 펼치기</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <span className="flex shrink-0 items-center">{logo}</span>
              <span className="ml-2.5 min-w-0 flex-1 truncate text-sm font-bold text-sidebar-text">
                {title}
              </span>
              <button
                type="button"
                aria-label="메뉴 접기"
                aria-expanded
                onClick={toggle}
                className={cn(
                  "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md",
                  "text-sidebar-text-muted outline-hidden transition-colors",
                  "hover:bg-sidebar-item-hover focus-visible:ring-2 focus-visible:ring-action-focus-ring"
                )}
              >
                <Menu className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* ── Menu ──── 6개를 넘으면 여기만 스크롤합니다 ─────────────── */}
        <div
          className={cn(
            // overflow-x 를 함께 꺼야 합니다 — 한 축이 visible 이 아니면 나머지 축도
            // auto 로 계산돼서, 세로만 켰는데 가로 스크롤바가 따라 생깁니다.
            // 접힘 폭 72 안쪽이 정확히 48(아이콘 칸)이라 1px 만 넘쳐도 드러납니다
            "flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto pt-2 pb-2",
            collapsed ? "items-center px-3" : "px-3"
          )}
        >
          {children}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        {user && (
          <div
            className={cn(
              "flex shrink-0 border-t border-sidebar-border",
              collapsed
                ? "flex-col items-center gap-2.5 px-0 py-3.5"
                : "items-center gap-2 py-3.5 pr-3 pl-4"
            )}
          >
            <Avatar
              size={collapsed ? "sm" : "default"}
              initial={user.initial ?? user.name.slice(0, 1)}
            />

            {!collapsed && (
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-sidebar-text">{user.name}</span>
                {user.email && (
                  <span className="truncate text-2xs text-sidebar-text-muted">{user.email}</span>
                )}
              </div>
            )}

            {onSettings && (
              <FooterAction label="설정" onClick={onSettings}>
                <Settings />
              </FooterAction>
            )}
            {onLogout && (
              <FooterAction label="로그아웃" onClick={onLogout}>
                <LogOut />
              </FooterAction>
            )}
          </div>
        )}
      </nav>
    </SidebarCollapsedContext.Provider>
  );
}
