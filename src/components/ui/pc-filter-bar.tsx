import * as React from "react";
import { ChevronDown, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma: PCFilterBar (Layouts 페이지 · 2 변형 — State)
 *
 * PC 조회 조건 영역입니다. **MDI 탭바 바로 아래**에 붙이고, 조회한 뒤에는 접어서
 * 표에 자리를 내줍니다.
 *
 * ### 조회하면 자동으로 접힙니다
 *
 * 조건은 한 번 정하고 **표를 계속 보는** 경우가 대부분입니다.
 * 접으면 **표가 150px 넓어집니다** (펼침 ~200 · 접힘 56).
 *
 * ### 모바일과 다른 점
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 조건 배치 | **가로 한 줄** | 세로로 쌓음 |
 * | 접힌 줄 | 요약 + **“조건 변경” 버튼** | 요약 + 건수 배지 |
 * | 캡션 | 늘 `sm/SemiBold` | 펼치면 커집니다 |
 *
 * **접힌 줄에 버튼을 함께 두는 이유** — 화살표만으로는 누를 수 있다는 신호가 약합니다.
 * 모바일은 줄 전체가 누름 대상이라 필요 없지만, PC 는 마우스로 정확히 겨냥하므로
 * 누를 곳을 눈에 보이게 둡니다.
 *
 * ### 버튼은 필드 바닥에 맞춥니다
 *
 * 조회·초기화에는 라벨이 없어 그냥 두면 필드보다 **17px 위로 뜹니다**(라벨 높이).
 * Figma 는 빈 공간을 넣어 맞추지만 코드는 `items-end` 로 붙입니다 —
 * 필드 개수나 줄 수가 바뀌어도 따라옵니다.
 *
 * ### 조건은 4개까지
 *
 * 넘으면 **행을 추가하지 말고 별도 검색 화면**을 검토하세요. 조건 영역이 두 줄을
 * 넘으면 접기 전에도 표가 몇 줄 안 보입니다.
 *
 * 기간은 `DateField`(Figma 의 PCDateField)를 쓰세요 — 빠른 선택으로 달력을 열지 않고
 * 끝낼 수 있습니다. 모바일 짝은 `MobileFilterBar` 이고 규칙은 같습니다.
 */

export interface PCFilterBarProps {
  /** 접혔을 때 보여줄 한 줄. 조건을 `·` 로 이어 씁니다. */
  summary: string;
  /** 왼쪽 작은 제목. 기본 "조회조건". */
  caption?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
  /** 누르면 **자동으로 접힙니다.** */
  onSearch?: () => void;
  resetLabel?: string;
  searchLabel?: string;
  changeLabel?: string;
  /** 조건 입력 줄들. `PCFilterRow` 로 감싸세요. 4개를 넘기지 마세요. */
  children: React.ReactNode;
  className?: string;
}

/** 조건 한 줄. 넓은 필드(기간)는 자기 줄을 쓰는 편이 읽기 좋습니다. */
export function PCFilterRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex items-end gap-4", className)}>{children}</div>;
}

export function PCFilterBar({
  summary,
  caption = "조회조건",
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  onReset,
  onSearch,
  resetLabel = "초기화",
  searchLabel = "조회",
  changeLabel = "조건 변경",
  children,
  className,
}: PCFilterBarProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = (v: boolean) => {
    setUncontrolled(v);
    onOpenChange?.(v);
  };

  const panelId = React.useId();

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border-b border-border-gray-light bg-background-white px-6 pt-3",
        open ? "pb-4" : "pb-3",
        className
      )}
    >
      {/* ── Head ─────────────────────────────────────────────────── */}
      <div className="flex h-8 items-center gap-2.5">
        <span className="shrink-0 text-sm font-semibold text-text-basic">{caption}</span>

        {/* 접혔을 때만 — 펼치면 아래 필드에 같은 정보가 있습니다 */}
        {!open && (
          <span className="min-w-0 flex-1 truncate text-sm text-text-subtle">{summary}</span>
        )}

        <div className={cn("flex items-center gap-2", open && "ml-auto")}>
          {/* 화살표만으로는 누를 수 있다는 신호가 약합니다 */}
          {!open && (
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              {changeLabel}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={open ? "조회 조건 접기" : "조회 조건 펼치기"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
          >
            <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* ── Fields ───────────────────────────────────────────────── */}
      {open && (
        <div id={panelId} className="flex items-end gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">{children}</div>

          {/*
            items-end 로 필드 바닥에 붙입니다 — 라벨이 없어 그냥 두면 17px 위로 뜹니다.
            줄이 몇 개든 마지막 줄 바닥에 맞습니다
          */}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={onReset}>
              <RefreshCw />
              {resetLabel}
            </Button>
            <Button
              onClick={() => {
                onSearch?.();
                // 조회하면 접습니다 — 조건은 한 번 정하고 표를 계속 봅니다
                setOpen(false);
              }}
            >
              <Search />
              {searchLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
