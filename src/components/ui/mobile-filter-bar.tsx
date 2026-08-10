import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Figma: MobileFilterBar (2 변형 — State 2)
 *
 * 모바일 조회 조건 영역입니다. **조회한 뒤에는 접어서 목록에 자리를 내줍니다.**
 *
 * ### 조회하면 자동으로 접힙니다
 *
 * 조건은 한 번 정하고 **목록을 계속 보는** 경우가 대부분입니다.
 * 펼친 채로 두면 작은 화면에서 목록이 몇 줄 안 보입니다.
 *
 * ### 요약과 건수는 접혔을 때만
 *
 * 펼치면 아래 입력 필드에 **같은 정보가 있어 중복**이고, 조건을 바꾸는 중에
 * 이전 결과 수가 남아 있으면 혼란스럽습니다.
 *
 * 요약은 걸린 조건을 `·` 로 이어 씁니다 — `2025-04-26 ~ 2026-07-07 · 발주일 · 전체`.
 *
 * ### 조건은 4개까지
 *
 * 넘으면 **별도 필터 시트로 옮기세요.** 접힌 줄의 요약이 길어져 못 읽습니다.
 *
 * 기간은 `MobileDateField` 를 쓰세요 — 빠른 선택 칩으로 달력을 열지 않고 끝낼 수 있습니다.
 */

export interface MobileFilterBarProps {
  /** 접혔을 때 보여줄 한 줄. 조건을 `·` 로 이어 씁니다. */
  summary: string;
  /** 조회 결과 수. 접혔을 때만 배지로 나옵니다. */
  count?: number;
  /** 접힌 줄의 작은 글씨. 기본 "조회 조건". */
  caption?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
  /** 누르면 **자동으로 접힙니다.** */
  onSearch?: () => void;
  resetLabel?: string;
  searchLabel?: string;
  /** 조건 입력 필드들. 4개를 넘기지 마세요. */
  children: React.ReactNode;
  className?: string;
}

export function MobileFilterBar({
  summary,
  count,
  caption = "조회 조건",
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  onReset,
  onSearch,
  resetLabel = "초기화",
  searchLabel = "조회",
  children,
  className,
}: MobileFilterBarProps) {
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
        "flex flex-col border-b border-border-gray-light bg-background-white",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 py-3 pr-3 pl-4 text-left",
          "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/*
            펼치면 제목처럼 커집니다 — 그때는 이 줄이 영역의 머리이고,
            접히면 요약이 주인공이라 캡션이 뒤로 물러납니다.
          */}
          <span
            className={cn(
              "text-text-subtle",
              open ? "text-base font-semibold" : "text-xs"
            )}
          >
            {caption}
          </span>
          {/* 접혔을 때만 — 펼치면 아래 필드에 같은 정보가 있습니다 */}
          {!open && (
            <span className="truncate text-sm font-medium text-text-basic">{summary}</span>
          )}
        </span>

        {/* 조건을 바꾸는 중에 이전 결과 수가 남아 있으면 혼란스럽습니다 */}
        {!open && count != null && (
          <Badge tone="neutral" size="sm">
            {count}
          </Badge>
        )}

        <ChevronDown
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-icon-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div id={panelId} className="flex flex-col gap-3.5 px-4 pb-4">
          {children}

          {/*
            Figma 는 Size=default 입니다 — 모바일에서 --h-input-default 가 40 이라
            lg(52)로 올리면 조건 영역이 그만큼 높아져 목록이 밀립니다.
            둘 다 flex-1 로 화면을 반씩 나눠 씁니다
          */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onReset}>
              {resetLabel}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onSearch?.();
                // 조회하면 접습니다 — 조건은 한 번 정하고 목록을 계속 봅니다
                setOpen(false);
              }}
            >
              {searchLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
