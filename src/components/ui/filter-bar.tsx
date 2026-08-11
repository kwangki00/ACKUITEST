import * as React from "react";
import { ChevronDown, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Figma: PCFilterBar (Layouts · 2 변형) · MobileFilterBar (Layouts · 2 변형)
 *
 * 조회 조건 영역입니다. **조회한 뒤에는 접어서 결과에 자리를 내줍니다.**
 *
 * ### Figma 는 둘, 코드는 하나입니다
 *
 * 두 컴포넌트가 **같은 규칙을 두 벌로 적고 있었습니다** — 상태 기계도, "조회하면
 * 접힘" 도, props 11개 중 10개도 같았습니다. 그러면 규칙을 바꿀 때 한쪽만 고쳐도
 * 아무도 모릅니다 (실제로 버튼 크기가 모바일에만 `lg` 로 남아 있었습니다).
 *
 * 그래서 **한 벌로 합치고 폭에 따라 배치만 바꿉니다.** Figma 가 둘로 그리는 것은
 * 맞습니다 — 그림은 한 폭만 보여줄 수 있으니까요.
 *
 * ### 미디어쿼리가 아니라 **컨테이너 쿼리**입니다
 *
 * `lg:` 는 **브라우저 창**을 잽니다. 그러면 문서의 390 틀 안에 넣어도 창이 넓으면
 * PC 배치가 나와서, 모바일 모습을 영영 볼 수 없습니다 (`.ack-mobile` 은 CSS 변수만
 * 덮어써서 유틸리티 variant 는 못 막습니다).
 *
 * **자기 폭을 재는 쪽이 실제로도 맞습니다** — 사이드바가 열려 작업 영역이 좁아졌으면
 * 창이 넓어도 접힌 배치가 옳습니다. 경계는 `--container-pc`(880) 하나입니다.
 *
 * ### 좁을 때 ↔ 넓을 때
 *
 * | | 좁을 때 (모바일) | 넓을 때 (PC) |
 * |---|---|---|
 * | 조건 배치 | 세로로 쌓음 | **가로 한 줄** |
 * | 접힌 줄 | 요약 + **건수 배지** | 요약 + **“조건 변경” 버튼** |
 * | 캡션 | 펼치면 커짐 (`base`) | 늘 `sm/SemiBold` |
 * | 버튼 | 화면을 반씩 (`flex-1`) | 우측에 내용 폭만큼 |
 * | 누르는 곳 | **줄 전체** | 버튼만 |
 *
 * **좁을 때 줄 전체가 눌리는 이유** — 손가락은 정확히 겨냥하기 어렵습니다.
 * 넓을 때는 마우스로 정확히 찍으므로 **누를 곳을 눈에 보이게** 둡니다 —
 * 화살표만으로는 누를 수 있다는 신호가 약합니다.
 *
 * ### 그 밖
 *
 * - **조건은 4개까지.** 넘으면 좁을 때는 별도 필터 시트로, 넓을 때는 별도 검색
 *   화면으로 옮기세요 — 요약 줄이 길어져 못 읽고, 두 줄을 넘으면 결과가 몇 줄 안 보입니다
 * - 조건 줄은 `FilterRow` 로 감싸세요. **좁으면 세로, 넓으면 가로**로 알아서 바뀝니다.
 *   기간(`DateRangePicker quickSelect`)은 넓어서 자기 줄을 쓰는 편이 좋습니다
 * - **조건의 폭은 컨트롤마다 다릅니다.** 날짜만 컴포넌트가 갖고 나머지는 감싸는 쪽이 정합니다
 *
 *   | | 기본 | 좁히려면 | 채우려면 |
 *   |---|---|---|---|
 *   | `Input` · `Select` · `Combobox` | **`w-full`** — 부모를 채움 | `FormField` 에 폭 | 그대로 |
 *   | `DatePicker` · `DateRangePicker` | **값에 맞는 폭** | 그대로 | 컨트롤에 `w-full` |
 *
 *   날짜만 반대인 이유는 자릿수가 정해져 있어서입니다 — 목록은 얼마나 긴 이름이 올지
 *   컴포넌트가 알 수 없습니다. **폭에는 `@pc/filter:` 를 붙이고 `FormField` 에 주세요** —
 *   세로로 쌓일 때는 줄을 꽉 채워야 하고, 라벨·설명·에러까지 같은 폭이어야 합니다
 *
 *   ```tsx
 *   <FormField label="검사 항목" className="@pc/filter:w-50"><Select … /></FormField>
 *   ```
 * - **안에 넣는 컨트롤도 한 벌입니다** — `<DateRangePicker/>` · `<Select/>` · `<Combobox/>`
 *   를 그대로 쓰세요. 시트로 열지 팝오버로 열지는 CSS 로 못 고르지만
 *   **`PointerModeProvider` 가 정하므로** 호출부는 판단하지 않습니다.
 *   조회 조건에서 `MobileDateRangePicker` · `MobileSelect` 를 직접 부를 자리는 없습니다
 *   (2026-08-10 — 그전에는 폭에 따라 갈아 끼우라고 적혀 있었습니다)
 * - 버튼은 `default` 크기입니다 — `--h-input-default` 가 40/36 으로 알아서 갈립니다
 * - 요약은 걸린 조건을 `·` 로 이어 씁니다
 *
 * `container-type: inline-size` 는 `position: fixed` 자손의 기준이 되지만,
 * `MobileSheet` · `Popover` 는 전부 Portal 로 빠져나가므로 영향이 없습니다.
 */

/** 조건 한 줄. **좁으면 세로, 넓으면 가로**입니다. */
export function FilterRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 @pc/filter:flex-row @pc/filter:items-end @pc/filter:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface FilterBarProps {
  /** 접혔을 때 보여줄 한 줄. 조건을 `·` 로 이어 씁니다. */
  summary: string;
  /** 조회 결과 수. **좁을 때만** 배지로 나옵니다 (넓을 때는 표·목록 헤더가 말합니다). */
  count?: number;
  /** 왼쪽 작은 제목. */
  caption?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
  /** 누르면 **자동으로 접힙니다.** */
  onSearch?: () => void;
  resetLabel?: string;
  searchLabel?: string;
  /** 넓을 때 접힌 줄에 나오는 버튼 글자. */
  changeLabel?: string;
  /** 조건 입력 줄들. `FilterRow` 로 감싸세요. 4개를 넘기지 마세요. */
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({
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
  changeLabel = "조건 변경",
  children,
  className,
}: FilterBarProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = (v: boolean) => {
    setUncontrolled(v);
    onOpenChange?.(v);
  };

  const panelId = React.useId();

  return (
    /*
      바깥은 **컨테이너 역할만** 합니다. 컨테이너 쿼리는 컨테이너 자신에게는
      적용되지 않고 **자손에게만** 걸리기 때문입니다 — 같은 요소에 @container 와
      @pc/filter:px-6 을 함께 주면 그 여백은 조용히 죽습니다.
      배치를 바꾸는 클래스는 전부 한 겹 안쪽에 둡니다 (DateRangePicker 와 같은 구조).
    */
    <div className={cn("@container/filter", className)}>
      <div
        className={cn(
          "flex flex-col border-b border-border-gray-light bg-background-white",
          /*
            넓을 때는 **이 줄이 여백을 갖습니다** — 머리줄 32 + 위아래 12 로 접힘 56,
            펼침 200 (Figma 값). 머리줄에 h-8 을 주고 여백을 그 안에 넣으면
            border-box 라 32 안에 먹혀 줄이 통째로 낮아집니다.
            좁을 때는 머리줄·필드가 각자 여백을 갖습니다.
          */
          "@pc/filter:gap-1.5 @pc/filter:px-6 @pc/filter:pt-3",
          open ? "@pc/filter:pb-4" : "@pc/filter:pb-3"
        )}
      >
      {/* ── Head ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative flex items-center gap-2 py-3 pr-3 pl-4",
          "@pc/filter:h-8 @pc/filter:gap-2.5 @pc/filter:p-0"
        )}
      >
        {/*
          좁을 때는 줄 전체가 누름 대상입니다. 넓을 때는 이 줄 안에 버튼이 둘이라
          같은 요소를 <button> 으로 둘 수 없습니다 — 버튼 안의 버튼은 잘못된 HTML 이라
          브라우저가 마크업을 재배치합니다 (SelectTrigger · TabItem 과 같은 이유).
          그래서 투명한 오버레이 버튼을 깔고 넓어지면 숨깁니다.
        */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className={cn(
            // z-10 이 필요합니다 — 이 줄의 자식 중 하나라도 transform 이 걸리면
            // (화살표의 rotate-180) 스택 문맥이 생겨 오버레이보다 위로 올라옵니다.
            // 그러면 그 위를 눌러도 오버레이에 닿지 않습니다
            "absolute inset-0 z-10 rounded-md outline-hidden",
            "focus-visible:ring-2 focus-visible:ring-action-focus-ring",
            "@pc/filter:hidden"
          )}
        >
          <span className="sr-only">조회 조건 {open ? "접기" : "펼치기"}</span>
        </button>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5 @pc/filter:flex-row @pc/filter:items-center @pc/filter:gap-2.5">
          {/*
            좁을 때는 펼치면 제목처럼 커집니다 — 그때 이 줄이 영역의 머리이고,
            접히면 요약이 주인공이라 캡션이 뒤로 물러납니다.
            넓을 때는 옆에 요약이 붙는 자리라 크기가 바뀌면 줄 높이가 흔들립니다 — 늘 sm.
          */}
          <span
            className={cn(
              "shrink-0 text-text-subtle @pc/filter:text-sm @pc/filter:font-semibold @pc/filter:text-text-basic",
              open ? "text-base font-semibold" : "text-xs"
            )}
          >
            {caption}
          </span>
          {/* 접혔을 때만 — 펼치면 아래 필드에 같은 정보가 있습니다 */}
          {!open && (
            <span className="truncate text-sm font-medium text-text-basic @pc/filter:font-normal @pc/filter:text-text-subtle">
              {summary}
            </span>
          )}
        </span>

        {/* 조건을 바꾸는 중에 이전 결과 수가 남아 있으면 혼란스럽습니다 */}
        {!open && count != null && (
          <Badge tone="neutral" size="sm" className="@pc/filter:hidden">
            {count}
          </Badge>
        )}

        {/* 넓을 때만 — 화살표만으로는 누를 수 있다는 신호가 약합니다 */}
        {!open && (
          <Button
            variant="outline"
            size="sm"
            className="hidden @pc/filter:inline-flex"
            onClick={() => setOpen(true)}
          >
            {changeLabel}
          </Button>
        )}

        {/* 좁을 때는 오버레이가 누름을 맡으므로 화살표는 장식입니다 —
            장식이니 클릭도 받지 않습니다 */}
        <ChevronDown
          aria-hidden
          className={cn(
            "pointer-events-none size-5 shrink-0 text-icon-muted-foreground",
            "transition-transform @pc/filter:hidden",
            open && "rotate-180"
          )}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={open ? "조회 조건 접기" : "조회 조건 펼치기"}
          aria-expanded={open}
          aria-controls={panelId}
          className="hidden @pc/filter:inline-flex"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
        </Button>
      </div>

      {/* ── Fields ───────────────────────────────────────────────── */}
      {open && (
        <div
          id={panelId}
          className={cn(
            "flex flex-col gap-3.5 px-4 pb-4",
            // 넓을 때 여백은 바깥이 갖습니다 — 여기서 또 주면 200 을 넘깁니다
            "@pc/filter:flex-row @pc/filter:items-end @pc/filter:gap-4 @pc/filter:p-0"
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-3.5 @pc/filter:gap-2.5">{children}</div>

          {/*
            넓을 때는 items-end 로 필드 바닥에 붙습니다 — 버튼에는 라벨이 없어
            그냥 두면 라벨 높이(17px)만큼 위로 뜹니다. 줄이 몇 개든 마지막 줄에 맞습니다.
            좁을 때는 아래에서 화면을 반씩 나눠 씁니다.
          */}
          <div className="flex gap-2 pt-1 @pc/filter:shrink-0 @pc/filter:pt-0">
            <Button variant="outline" className="flex-1 @pc/filter:flex-none" onClick={onReset}>
              {/* Figma 는 좁을 때 아이콘이 없습니다 — 글자만으로 충분하고 폭이 아깝습니다 */}
              <RefreshCw className="hidden @pc/filter:block" />
              {resetLabel}
            </Button>
            <Button
              className="flex-1 @pc/filter:flex-none"
              onClick={() => {
                onSearch?.();
                // 조회하면 접습니다 — 조건은 한 번 정하고 결과를 계속 봅니다
                setOpen(false);
              }}
            >
              <Search className="hidden @pc/filter:block" />
              {searchLabel}
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
