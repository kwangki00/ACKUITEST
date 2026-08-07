import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: MobileTop (Layouts 페이지 · 3 변형 — Style)
 *
 * 모바일 상단 바입니다. 높이 **58** 고정, 아래에 `Divider/Gray-Light` 한 줄.
 *
 * ### 세 변형은 "왼쪽에 무엇을 두느냐" 입니다
 *
 * | `variant` | 왼쪽 | 오른쪽 | 언제 |
 * |---|---|---|---|
 * | `logo` | 로고 | 액션 | 앱 첫 화면 |
 * | `back` | ‹ 뒤로 | 액션 | 상세 화면 — **타이틀이 가운데** |
 * | `title` | 화면 이름 (`base/Bold`) | 액션 | 목록 화면 |
 *
 * `back` 만 타이틀이 가운데입니다. 뒤로 버튼과 액션의 개수가 달라도 흔들리지 않게
 * **절대 배치로 가운데를 잡습니다** — flex 로 나누면 오른쪽 아이콘이 하나 늘 때마다
 * 제목이 왼쪽으로 밀립니다.
 *
 * ### 액션은 44 짜리 탭 영역을 가집니다
 *
 * 아이콘은 24 지만 누르는 곳은 44 입니다 (iOS 44pt). `MobileTopAction` 을 쓰면
 * 크기·정렬·`aria-label` 이 함께 따라옵니다 — **아이콘만 있는 버튼이라
 * `label` 은 필수**입니다.
 *
 * ### 그 밖
 *
 * - **스크롤 영역 밖에** 두세요. 안에 넣으면 목록과 함께 밀려 올라갑니다
 *   (`MBottomTabBar` · Table 헤더 행과 같은 이유)
 * - 액션은 **2개까지**. 넘으면 `⋯` 로 묶으세요 — 58 안에서 44 짜리 탭 영역이
 *   셋 이상이면 타이틀 자리가 사라집니다
 * - `title` 변형의 이름은 화면 제목이지 앱 이름이 아닙니다. 앱 이름은 `logo` 자리입니다
 *
 * Figma 변형 이름은 원래 `Default` · `backStyle` · `e-smartTop` 이었습니다.
 * `e-smartTop` 은 다른 제품에서 넘어온 이름이라 **하는 일로 다시 지었습니다** (2026-08-07).
 */

export interface MobileTopActionProps {
  /** 화면에 글자가 없으므로 필수입니다. */
  label: string;
  /** 읽지 않은 알림 표시. 개수가 아니라 있다/없다만 알립니다. */
  dot?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

/** 상단 바의 아이콘 버튼. 누르는 곳은 44 이고 아이콘은 24 입니다. */
export function MobileTopAction({
  label,
  dot,
  onClick,
  children,
  className,
}: MobileTopActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-md",
        "text-icon-gray outline-hidden transition-colors",
        "hover:bg-sidebar-item-hover focus-visible:ring-2 focus-visible:ring-action-focus-ring",
        "[&_svg]:size-6",
        className
      )}
    >
      {children}
      {dot && (
        // 흰 테두리로 아이콘에서 떼어 놓습니다 — 겹치면 점인지 아이콘 일부인지 흐려집니다
        <span
          aria-hidden
          className="absolute top-2 right-2 size-2 rounded-full border-[1.5px] border-surface-white bg-icon-danger"
        />
      )}
    </button>
  );
}

export interface MobileTopProps {
  variant?: "logo" | "back" | "title";
  /** `back` 은 가운데, `title` 은 왼쪽에 놓입니다. `logo` 는 쓰지 않습니다. */
  title?: string;
  /** `logo` 변형의 왼쪽. 기본은 글자 로고입니다. */
  logo?: React.ReactNode;
  /** `back` 변형의 뒤로 가기. */
  onBack?: () => void;
  backLabel?: string;
  /** `MobileTopAction` 을 넣으세요. **2개까지.** */
  actions?: React.ReactNode;
  className?: string;
}

export function MobileTop({
  variant = "title",
  title,
  logo = <span className="text-lg font-bold tracking-tight text-text-primary">ACK</span>,
  onBack,
  backLabel = "뒤로",
  actions,
  className,
}: MobileTopProps) {
  return (
    <header
      className={cn(
        "relative flex h-[58px] shrink-0 items-center justify-between gap-3",
        "border-b border-divider-gray-light bg-surface-white px-5",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {variant === "logo" && logo}

        {variant === "back" && (
          <MobileTopAction label={backLabel} onClick={onBack} className="-ml-2.5">
            <ChevronLeft />
          </MobileTopAction>
        )}

        {variant === "title" && (
          <span className="min-w-0 truncate text-base font-bold text-text-basic">{title}</span>
        )}
      </div>

      {/*
        가운데 타이틀은 절대 배치입니다 — flex 로 나누면 오른쪽 액션이 하나 늘 때마다
        제목이 왼쪽으로 밀립니다. 양옆 액션 자리(44×2 + 여백)를 비워 둡니다
      */}
      {variant === "back" && title && (
        <span className="pointer-events-none absolute inset-x-24 truncate text-center text-base font-semibold text-text-basic">
          {title}
        </span>
      )}

      {actions && <div className="-mr-2.5 flex shrink-0 items-center">{actions}</div>}
    </header>
  );
}
