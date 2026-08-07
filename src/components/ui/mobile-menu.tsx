import * as React from "react";
import { LogOut, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Figma: MobileMenuContent · MobileMenuScreen (Layouts 페이지)
 *
 * 모바일 전체메뉴입니다. 하단 탭바의 **전체메뉴**를 누르면 열립니다.
 *
 * ### 시트가 아니라 전체 화면입니다
 *
 * 메뉴는 **다른 화면으로 떠나는 동작**이라 뒤 화면을 남겨둘 이유가 없습니다.
 * 날짜 선택이나 필터처럼 *뒤를 보면서 고르는* 것만 `MobileSheet` 를 씁니다
 * (CLAUDE.md 의 「시트 vs 전체 화면」 표와 같은 기준).
 *
 * ### 메뉴 구조는 PC 사이드바 그대로
 *
 * `SidebarItem` 을 그대로 씁니다 — PC 로 익힌 위치를 모바일에서 다시 배우지 않아도 됩니다.
 * 상단의 사용자 정보와 설정·로그아웃도 PC 사이드바 푸터와 같은 항목입니다.
 *
 * ### 탭바는 이 컴포넌트 밖입니다
 *
 * Figma 는 `MobileMenuScreen` 안에 탭바까지 그려 두었지만, 코드에서는 **껍데기가 들고
 * 있습니다.** 탭바는 화면이 바뀌어도 계속 남아 있는 것이라 메뉴를 열 때마다 다시
 * 만들어지면 안 됩니다. Figma 는 "화면 하나" 를 그려야 해서 함께 담을 수밖에 없습니다.
 *
 * 대신 **활성 탭은 그대로 두고** 전체메뉴 자리에만 불이 들어옵니다
 * (`MBottomTabBar` 의 `menuOpen`). 다른 탭으로 바로 갈 수 있습니다.
 *
 * ### 닫기(X)는 이전 화면으로
 *
 * 탭바로도 나갈 수 있지만, **메뉴를 열기 전 화면으로 되돌아가는 경로**가 따로 있는 편이
 * 안전합니다. `onClose` 를 넘기지 않으면 X 가 사라지고 탭바로만 나갑니다.
 */

export interface MobileMenuUser {
  name: string;
  email?: string;
  /** 없으면 이름 첫 글자를 씁니다. */
  initial?: string;
}

export interface MobileMenuContentProps {
  user?: MobileMenuUser;
  onSettings?: () => void;
  onLogout?: () => void;
  /** `SidebarItem` 들. 6개를 넘으면 이 영역이 스크롤합니다. */
  children: React.ReactNode;
  className?: string;
}

function IconAction({
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
        "flex size-9 shrink-0 items-center justify-center rounded-md",
        "text-sidebar-text-muted outline-hidden transition-colors",
        "hover:bg-sidebar-item-hover focus-visible:ring-2 focus-visible:ring-action-focus-ring",
        "[&_svg]:size-5.5"
      )}
    >
      {children}
    </button>
  );
}

export function MobileMenuContent({
  user,
  onSettings,
  onLogout,
  children,
  className,
}: MobileMenuContentProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {user && (
        <>
          <div className="flex items-center gap-3 pt-1 pb-4">
            <Avatar initial={user.initial ?? user.name.slice(0, 1)} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-base font-semibold text-sidebar-text">
                {user.name}
              </span>
              {user.email && (
                <span className="truncate text-xs text-sidebar-text-muted">{user.email}</span>
              )}
            </div>
            {onSettings && (
              <IconAction label="설정" onClick={onSettings}>
                <Settings />
              </IconAction>
            )}
            {onLogout && (
              <IconAction label="로그아웃" onClick={onLogout}>
                <LogOut />
              </IconAction>
            )}
          </div>
          <div aria-hidden className="h-px shrink-0 bg-sidebar-border" />
        </>
      )}

      <nav aria-label="전체메뉴" className="flex flex-col gap-0.5 pt-3">
        {children}
      </nav>
    </div>
  );
}

export interface MobileMenuScreenProps extends MobileMenuContentProps {
  title?: string;
  /** 넘기지 않으면 X 가 없고 탭바로만 나갑니다. */
  onClose?: () => void;
}

/**
 * 헤더 + 본문입니다. **탭바는 껍데기가 따로 붙입니다** — 위 설명 참고.
 * 세로 flex 안에서 `flex-1` 로 쓰세요.
 */
export function MobileMenuScreen({
  title = "전체메뉴",
  onClose,
  className,
  children,
  ...content
}: MobileMenuScreenProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-background-white", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4 py-3.5">
        <span className="min-w-0 truncate text-lg font-bold text-sidebar-text-active">
          {title}
        </span>
        {onClose && (
          <Button variant="ghost" size="icon-sm" aria-label="전체메뉴 닫기" onClick={onClose}>
            <X />
          </Button>
        )}
      </div>

      {/* 메뉴가 길면 이 영역만 스크롤합니다 — 헤더와 탭바는 남습니다 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4">
        <MobileMenuContent {...content}>{children}</MobileMenuContent>
      </div>
    </div>
  );
}
