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

/**
 * 접힌 줄에 들어가는 조건 하나 — **칩 하나로 나옵니다.**
 *
 * ### 라벨은 값이 스스로 말하지 못할 때만
 *
 * `2026-07-14 ~ 2026-08-13` · `일반혈액검사` · `완료` 는 값만 봐도 무엇인지 압니다.
 * **`이검사`(담당자)와 `김지훈`(검색어)이 문제**입니다 — 사람 이름 둘이 나란히 서면
 * 어느 쪽이 무엇인지 알 수 없어 접힌 줄이 제 일을 못 합니다.
 *
 * 그런 자리에 `icon` 을 줍니다. **화면에는 아이콘, 보조기술에는 `label`** 이 갑니다 —
 * 아이콘만 두면 스크린리더로는 이름 두 개가 그대로 나열됩니다.
 *
 * | | 어떻게 |
 * |---|---|
 * | 값만으로 아는 것 | `{ value }` — 칩 하나에 값만 |
 * | 값만으로는 모르는 것 | `{ icon, label, value }` — 아이콘 + 값, 라벨은 `sr-only` |
 * | 아이콘이 마땅찮은 것 | `{ label, value }` — 라벨 글자가 앞에 붙습니다 |
 *
 * **아이콘을 남발하지 마세요** — 검사항목·상태처럼 쓸 아이콘이 마땅찮은 자리에
 * 억지로 붙이면 결국 눌러 봐야 알게 되어, 아무것도 없는 것보다 나쁩니다
 * (`MBottomTabBar` 의 「라벨을 빼지 마세요」와 같은 이유입니다).
 */
export interface FilterSummaryItem {
  /**
   * 위 필드의 라벨과 같은 말을 쓰세요 — 펼쳤을 때와 이어져야 찾을 수 있습니다.
   * `icon` 이 함께 있으면 **화면에서는 숨고 보조기술만 읽습니다.**
   */
  label?: string;
  /** 값 앞에 붙는 표식. 크기는 칩이 정합니다 — `size-*` 를 직접 주지 마세요. */
  icon?: React.ReactNode;
  value: string;
}

export interface FilterBarProps {
  /**
   * 접혔을 때 보여줄 한 줄. 조건을 `·` 로 이어 씁니다.
   *
   * **배열로 주면 라벨이 함께 나옵니다** (2026-08-13) — 라벨은 `Text/Subtle`,
   * 값은 `Text/Basic Medium` 이라 눈은 진한 값만 훑고 라벨은 필요할 때만 읽힙니다.
   * 문자열도 그대로 받습니다 (라벨이 필요 없는 곳 · 문서용).
   *
   * **걸린 조건만 담으세요** — 「전체」는 조건을 건 게 아니라 안 건 것이라,
   * 넣으면 `전체 · 전체 · …` 가 되어 무엇을 걸었는지가 오히려 안 보입니다.
   */
  summary: string | FilterSummaryItem[];
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
          /*
            좌우 **20** 입니다 (2026-08-12. 그전에는 24). 조회 조건이 화면에서
            홀로 4px 더 안쪽으로 들어가 있었습니다 — 결과조회 화면의 본문 영역과
            판(`ResultList`)이 둘 다 20 이라, 왼쪽 세로선이 조회 조건에서만 꺾였습니다.

            Figma `PCFilterBar` 의 `L24 R24` 를 20 으로 함께 고쳤습니다. 위아래
            (12/16)는 그대로입니다 — 접힘 56 · 펼침 200 이 그 값에서 나옵니다.
          */
          "@pc/filter:gap-1.5 @pc/filter:px-5 @pc/filter:pt-3",
          // 아래 여백도 함께 움직입니다 — 안 그러면 높이는 미끄러지는데 여백만 툭 바뀝니다
          "transition-[padding-bottom] duration-200 ease-out motion-reduce:transition-none",
          open ? "@pc/filter:pb-4" : "@pc/filter:pb-3"
        )}
      >
      {/* ── Head ─────────────────────────────────────────────────── */}
      {/*
        **줄 전체가 누름 대상입니다 — 좁든 넓든** (2026-08-12).
        전에는 좁을 때만 그랬고 넓을 때는 화살표·「조건 변경」 버튼만 눌렸습니다.
        마우스로도 32px 짜리 화살표를 겨냥하는 것은 번거롭습니다.

        **클릭은 이 줄이 받고, 안쪽 버튼들은 자기 onClick 을 갖지 않습니다** —
        여기로 올려보냅니다(버블링). 각자 onClick 을 두면 버튼을 눌렀을 때 둘 다
        불려 두 번 토글되어 아무 일도 안 일어난 것처럼 보입니다.

        안쪽 버튼을 지우지 않는 이유는 **키보드와 신호** 때문입니다 — div 는 탭으로
        닿지 않고, 「조건 변경」은 누를 수 있다는 것을 눈에 보이게 합니다.
        여기에 여는 것 말고 다른 일을 하는 버튼을 넣지 마세요. 그것도 접힙니다.
      */}
      {/*
        **`select-none` 이 필요합니다** — 누르는 줄이라 글자를 잡을 일이 없습니다.
        없으면 두 번 누르거나 살짝 끌었을 때 브라우저가 글자를 잡는데, 그 사이
        패널이 펼쳐지면서 **선택이 새로 나타난 필드까지 번집니다**
        (`TabItem` · `DropdownMenuItem` 과 같은 이유).
      */}
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex cursor-pointer items-center gap-2 py-3 pr-3 pl-4 select-none",
          "@pc/filter:h-8 @pc/filter:gap-2.5 @pc/filter:p-0"
        )}
      >
        {/*
          좁을 때 **키보드로 닿는 자리**입니다. 넓을 때는 화살표·「조건 변경」 버튼이
          그 일을 하므로 숨깁니다 — 셋이 다 보이면 같은 일을 하는 탭 정지가 셋이 됩니다.
          클릭은 위 줄이 받으므로 여기에는 onClick 이 없습니다.
        */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
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
            **펼치면 캡션이 주인공, 접히면 요약이 주인공입니다** (2026-08-13 정리).

            펼쳤을 때 이 줄은 영역의 머리라 캡션이 제목처럼 섭니다. 접히면 캡션은
            **안 변하는 라벨**이라 알릴 것이 없고, 걸린 조건이 그 줄의 내용입니다 —
            그래서 캡션이 뒤로 물러나고 요약이 진해집니다.

            **넓을 때가 반대로 되어 있었습니다** — 캡션이 SemiBold·`Text/Basic` 이고
            요약이 Regular·`Text/Subtle` 이라, 매번 바뀌는 값이 안 바뀌는 라벨보다
            흐렸습니다. 좁을 때는 처음부터 지금 모양이었습니다.

            크기는 넓을 때 늘 `sm` 입니다 — 옆에 요약이 붙는 자리라 캡션이 커졌다
            작아졌다 하면 줄 높이가 흔들립니다.
          */}
          <span
            className={cn(
              "shrink-0",
              open
                ? "text-base font-semibold text-text-basic @pc/filter:text-sm"
                : "text-xs text-text-subtle @pc/filter:text-sm"
            )}
          >
            {caption}
          </span>
          {/* 접혔을 때만 — 펼치면 아래 필드에 같은 정보가 있습니다 */}
          {/*
            **조건 하나가 칩 하나입니다** (2026-08-13). `·` 로 이으면 어디까지가 한
            조건인지 눈이 매번 재야 합니다 — 특히 값이 둘 이상의 낱말일 때 그렇습니다.

            `Chip` 이 아니라 `Badge` 인 이유 — 이 시스템에서 **`Chip` 은 지울 수 있는
            태그**입니다. 여기 칩은 지우는 것이 아니라 지금 걸린 조건을 알리는 표시라,
            `Chip` 을 쓰면 없는 X 를 찾게 됩니다.

            크기는 `lg`(28 · 14px)입니다. `default`(24 · 12px)면 한글이 뭉개집니다 —
            `FormField` 라벨을 12 에서 14 로 올린 것과 같은 이유입니다.

            **넓을 때는 넘치면 잘리고, 좁을 때는 줄바꿈합니다** (2026-08-13).
            넓은 머리줄은 높이 32 고정이라 줄바꿈하면 줄이 통째로 커지지만, 좁을
            때는 높이를 안 잡고 여백으로만 잡아서(`py-3`) 늘어나도 됩니다 —
            폭이 좁아 칩 서넛이면 이미 넘치는데, 거기서 뒤를 잘라내면 걸린 조건을
            아예 볼 수 없습니다. 칩은 `shrink-0` 이라 반쪽으로 찌그러지지 않습니다.
          */}
          {!open &&
            (typeof summary === "string" ? (
              <span className="truncate text-sm font-medium text-text-basic">{summary}</span>
            ) : (
              <span className="flex min-w-0 flex-wrap items-center gap-1.5 @pc/filter:flex-nowrap @pc/filter:overflow-hidden">
                {summary.map((it) => (
                  <Badge
                    key={`${it.label ?? ""}${it.value}`}
                    tone="neutral"
                    size="lg"
                    className="shrink-0"
                  >
                    {/* 크기를 안 정하면 lucide 기본값 24 로 나옵니다 */}
                    {it.icon && (
                      <span
                        aria-hidden
                        className="shrink-0 text-icon-muted-foreground [&>svg]:size-3.5"
                      >
                        {it.icon}
                      </span>
                    )}
                    {/* 아이콘이 있으면 라벨은 보조기술 몫입니다 — 화면에는 아이콘이 말합니다 */}
                    {it.label &&
                      (it.icon ? (
                        <span className="sr-only">{it.label}</span>
                      ) : (
                        <span className="font-normal text-text-subtle">{it.label}</span>
                      ))}
                    {it.value}
                  </Badge>
                ))}
              </span>
            ))}
        </span>


        {/*
          넓을 때만 — 화살표만으로는 누를 수 있다는 신호가 약합니다.

          **`ghost` 입니다** (2026-08-12. 그전에는 `outline`). 머리줄 자체가 이미
          누를 수 있는 줄이라, 그 안에 테두리 있는 버튼이 또 서면 **누를 곳이 둘로**
          보입니다. 여기서는 「누를 수 있다」는 신호만 있으면 되고 그건 글자와 hover
          로 충분합니다 — `MobileListHeader` 의 필터 버튼이 ghost 인 것과 같은 이유입니다.
        */}
        {!open && (
          <Button variant="ghost" size="sm" className="hidden @pc/filter:inline-flex">
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
        >
          <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
        </Button>
      </div>

      {/* ── Fields ───────────────────────────────────────────────── */}
      {/*
        **여닫힘이 움직입니다** (2026-08-12). 전에는 `{open && …}` 라 DOM 에서
        빠졌다 나타나서, 접는 순간 아래 목록이 툭 올라왔습니다.

        `height: auto` 로는 애니메이션이 안 걸립니다. `Accordion` 은 Radix 가
        내용 높이를 변수로 넘겨줘서 풀었지만, 여기는 **grid 로 풉니다** —
        `grid-template-rows` 를 `0fr → 1fr` 로 옮기면 브라우저가 내용 높이를
        알아서 계산합니다. 새 의존성이 없습니다.

        **`overflow-hidden` 이 한 겹 더 필요합니다** — 0fr 로 줄어든 칸 밖으로
        내용이 그냥 삐져나옵니다. 그 안쪽이 실제 배치를 맡습니다.

        **`inert` 로 닫힌 동안을 꺼둡니다** — DOM 에 남아 있어서, 안 그러면 안 보이는
        입력창에 탭이 들어가고 스크린리더도 읽습니다. `{open && …}` 이 거저 해주던
        일이라 애니메이션을 넣으면서 직접 해야 합니다.

        **넓을 때는 움직이지 않습니다** (2026-08-12). `overflow-hidden` 은 자손의
        **포커스 링(`ring-[3px]`)까지 자릅니다.** 좁을 때는 필드가 `px-4 pb-4`(16)라
        링이 들어갈 자리가 있지만, 넓을 때는 `@pc/filter:p-0` 이라 상자에 딱 붙어서
        왼쪽·아래 링이 잘려 나갑니다.

        넓을 때는 **닫히면 `hidden`, 열리면 자르지 않습니다.** 애니메이션을 잃지만
        거기는 필드가 한 줄이라 튀는 느낌이 적고, 포커스가 어디 있는지 안 보이는
        것보다 낫습니다.
      */}
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          // 자리를 밀어내는 움직임이라 어지럼을 만들기 쉽습니다 (Accordion 과 같은 규칙)
          "motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "@pc/filter:grid-rows-[1fr] @pc/filter:transition-none",
          !open && "@pc/filter:hidden"
        )}
      >
        <div className="overflow-hidden @pc/filter:overflow-visible">
        <div
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
        </div>
      </div>
      </div>
    </div>
  );
}
