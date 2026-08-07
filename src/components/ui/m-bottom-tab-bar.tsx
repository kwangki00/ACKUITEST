import * as React from "react";
import { ChartColumn, Clipboard, FileText, Mail, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: MBottomTabBar (Layouts 페이지 · 5 변형 — 메뉴선택)
 *
 * 모바일 하단 탭바입니다. PC 의 `Sidebar` 자리를 대신합니다.
 *
 * ### 마지막 자리는 홈이 아니라 전체메뉴
 *
 * 소비자용 앱은 마지막을 홈·마이페이지로 두지만 **이 시스템은 직원용**입니다.
 * 돌아갈 홈이 따로 없고, 자주 쓰는 넷 말고도 들어갈 메뉴가 계속 생깁니다.
 *
 * 전체메뉴를 누르면 **PC 와 같은 메뉴 구조**를 오버레이로 띄웁니다 —
 * PC 로 익힌 위치를 모바일에서 다시 배우지 않아도 됩니다.
 *
 * ### 전체메뉴를 열어도 활성 탭은 그대로입니다
 *
 * 여는 동안만 마지막 자리에 불이 들어오고(`menuOpen`), 닫으면 원래 탭으로 돌아옵니다.
 * **메뉴에서 다른 화면으로 이동해야** `value` 가 바뀝니다 — 메뉴를 열었다 닫은 것은
 * 화면 이동이 아니라서, 그때 탭이 옮겨 가면 어디에 있었는지를 잃습니다.
 *
 * ### 탭은 5개까지
 *
 * 넘으면 **전체메뉴로 몰아주세요.** 390 폭에서 5개면 한 칸이 78 이고,
 * 여섯 개가 되면 10px 라벨이 두 줄로 접히거나 잘립니다. 타입이 6개째를 막습니다.
 *
 * ### 그 밖
 *
 * - 아이콘 24 · 라벨 10(`2xs`). **라벨을 빼지 마세요** — 아이콘만으로는 통계조회와
 *   검사이력을 구분하지 못합니다
 * - 활성은 **색 + 굵기 두 가지**로 알립니다. 색만으로는 색각 이상에서 안 보입니다
 * - 아래 24px 은 홈 인디케이터 자리입니다 (Safe Area). `homeIndicator` 는 문서용
 *   장식이고 실제 기기에서는 OS 가 그리므로 끄세요
 * - 자리를 잡는 것은 쓰는 쪽입니다 — 세로 flex 의 마지막에 두거나 `sticky bottom-0`
 *   을 붙이세요. 스크롤 영역 안에 넣으면 같이 밀려 올라갑니다
 */

export interface MBottomTabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * **전체메뉴를 뺀 4개까지.** 전체메뉴가 마지막 자리를 늘 차지하므로 합쳐서 5개입니다 —
 * 5개째를 타입이 막습니다.
 */
type Items =
  | readonly [MBottomTabItem]
  | readonly [MBottomTabItem, MBottomTabItem]
  | readonly [MBottomTabItem, MBottomTabItem, MBottomTabItem]
  | readonly [MBottomTabItem, MBottomTabItem, MBottomTabItem, MBottomTabItem];

/** Figma 변형과 같은 4개. 전체메뉴는 마지막 자리에 따로 붙습니다. */
export const SCL_TABS = [
  { value: "results", label: "결과조회", icon: <Clipboard /> },
  { value: "history", label: "검사이력", icon: <FileText /> },
  { value: "stats", label: "통계조회", icon: <ChartColumn /> },
  { value: "sms", label: "SMS", icon: <Mail /> },
] as const satisfies Items;

export interface MBottomTabBarProps {
  /** 전체메뉴를 뺀 탭들. 전체메뉴까지 합쳐 5개를 넘길 수 없습니다. */
  items?: Items;
  value: string;
  onValueChange: (value: string) => void;
  /**
   * 전체메뉴를 눌렀을 때. **`onValueChange` 는 호출되지 않습니다** —
   * 메뉴를 여는 것은 화면 이동이 아닙니다.
   */
  onMenuOpen?: () => void;
  /** 메뉴가 열려 있는 동안만 마지막 자리에 불이 들어옵니다. */
  menuOpen?: boolean;
  menuLabel?: string;
  /** 문서·데모용 장식. 실제 기기에서는 OS 가 그립니다. */
  homeIndicator?: boolean;
  className?: string;
}

function Tab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      // 어느 탭에 있는지를 스크린 리더에도 알립니다 — 색·굵기는 눈에만 보입니다
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 pt-1 pb-0.5",
        "outline-hidden transition-colors",
        "rounded-md focus-visible:ring-2 focus-visible:ring-action-focus-ring",
        "[&_svg]:size-6 [&_svg]:shrink-0",
        // 색과 굵기를 함께 바꿉니다 — 색만으로는 색각 이상에서 구분되지 않습니다
        active ? "text-icon-primary" : "text-icon-gray-light"
      )}
    >
      {icon}
      <span
        className={cn(
          "text-2xs",
          active ? "font-semibold text-text-primary" : "text-text-subtle"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function MBottomTabBar({
  items = SCL_TABS,
  value,
  onValueChange,
  onMenuOpen,
  menuOpen = false,
  menuLabel = "전체메뉴",
  homeIndicator = false,
  className,
}: MBottomTabBarProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        "relative flex shrink-0 border-t border-divider-gray-light bg-surface-white",
        // 아래 24 는 홈 인디케이터 자리입니다 (Safe Area)
        "px-2 pt-2.5 pb-6",
        className
      )}
    >
      {items.map((t) => (
        <Tab
          key={t.value}
          label={t.label}
          icon={t.icon}
          // 메뉴가 열려 있으면 불은 전체메뉴로 옮겨 갑니다 — value 는 그대로입니다
          active={!menuOpen && value === t.value}
          onClick={() => onValueChange(t.value)}
        />
      ))}

      <Tab
        label={menuLabel}
        icon={<Menu />}
        active={menuOpen}
        onClick={() => onMenuOpen?.()}
      />

      {homeIndicator && (
        <span
          aria-hidden
          className="absolute bottom-1.75 left-1/2 h-1.25 w-33.5 -translate-x-1/2 rounded-full bg-input-border-disabled"
        />
      )}
    </nav>
  );
}
