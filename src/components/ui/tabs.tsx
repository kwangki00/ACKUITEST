import * as React from "react";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Figma: Tabs (12 변형) · TabItem (48 변형 — Variant 3 × Size 4 × State 4)
 *
 * `Tabs` 는 **목록 껍데기**이고 `TabItem` 이 개별 탭입니다 (Figma 이름 그대로).
 * `TabPanel` 은 코드에만 있는 짝입니다 — Figma 는 내용까지 표현하지 않습니다.
 *
 * ### 세 가지 Variant
 *
 * | | 언제 | 활성 표시 |
 * |---|---|---|
 * | `line` | **화면 상단의 주 탭** | 밑줄 2px + `Tab/Text-Active` + SemiBold |
 * | `pill` | 목록 위 필터처럼 중립적인 전환 | 흰 알약 + **그림자** |
 * | `pill-primary` | 브랜드 강조가 필요할 때 | Primary 채움 + 흰 글자 |
 *
 * **`pill` 의 그림자는 장식이 아닙니다.** 활성 알약(흰색)과 목록 바탕의 대비가
 * 1.24:1 이라 그림자를 빼면 어느 것이 켜져 있는지 구분되지 않습니다.
 *
 * ### 굵기는 `line` 만 바뀝니다
 *
 * `line` 은 활성일 때 Medium → **SemiBold**, `pill` 계열은 Medium 그대로입니다.
 * 알약은 배경이 이미 말하고 있어 굵기까지 바꾸면 글자 폭이 변해 옆 탭이 밀립니다.
 *
 * ### `<button>` 이 아니라 `<div role="tab">` 입니다
 *
 * `closable` 을 켜면 탭 안에 닫기 버튼이 들어갑니다. **버튼 안의 버튼은 잘못된 HTML**
 * 이라 브라우저가 마크업을 재배치합니다 (`SelectTrigger` 와 같은 이유).
 * 대신 Enter·Space 를 직접 처리합니다.
 *
 * ### 키보드
 *
 * 목록 전체가 **탭 정지 하나**입니다 — 탭 5개마다 멈추면 다음 요소로 가는 데 다섯 번을
 * 눌러야 합니다. 좌우 방향키로 옮기고 그때 바로 전환됩니다 (자동 활성).
 * `Home`·`End` 는 처음·끝, **`Delete` 는 닫기**(`closable` 인 탭만).
 *
 * ### 밑줄은 목록이 긋습니다
 *
 * Figma 는 탭마다 1px 밑줄을 두지만, 코드는 **목록에 한 줄**을 긋고 활성 탭만 2px
 * 표시를 얹습니다 — 탭이 끝난 뒤에도 줄이 이어져야 헤더처럼 보입니다. 겉모습은 같습니다.
 *
 * ### 그 밖
 *
 * - 높이는 `--h-input-*` 입니다. Input·Button 과 맞고 **모바일에서 자동으로 커집니다**
 * - **MDI 탭바는 `default`(36)** 입니다. `sm`(32)은 글자까지 `text-xs`(12)라 문서 탭에
 *   쓰면 눌러야 할 것이 작아 보입니다 — 화면 이름이 들어가는 자리라 본문과 같은 14 여야
 *   합니다. 탭바 자체는 위아래 2px 여백을 더해 **40** 이 됩니다 (2026-08-12 수정)
 *   (xs 24→28 · sm 32→36 · default 36→40 · lg 48→52)
 * - **`line` 은 `xs`·`sm` 을 피하세요** — 밑줄과 라벨 사이가 좁아 답답합니다
 * - **탭이 6개를 넘으면** 개수를 늘리지 말고 스크롤(`scrollable`)이나 드롭다운 전환을
 *   검토하세요
 * - `closable` 은 **여러 건을 열어두는 문서 탭**(MDI)용입니다. 고정된 화면 탭에는
 *   쓰지 마세요 — 돌아올 수 없는 탭을 닫게 됩니다
 */

type Variant = "line" | "pill" | "pill-primary";
type Size = "xs" | "sm" | "default" | "lg";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: Variant;
  size: Size;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(who: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`${who} 는 Tabs 안에서만 쓸 수 있습니다.`);
  return ctx;
}

/* ------------------------------------------------------------------ Tabs */

const listVariants = cva("flex items-center", {
  variants: {
    variant: {
      // 밑줄이 이어지도록 간격 0. 줄은 목록이 긋습니다 — 탭이 끝나도 이어집니다
      line: "gap-0 border-b border-tab-divider",
      pill: "rounded-lg bg-tab-list-surface",
      "pill-primary": "rounded-lg bg-tab-list-surface",
    },
    size: { xs: "", sm: "", default: "", lg: "" },
  },
  compoundVariants: [
    { variant: ["pill", "pill-primary"], size: "xs", class: "gap-1 p-0.75" },
    { variant: ["pill", "pill-primary"], size: "sm", class: "gap-1 p-1" },
    { variant: ["pill", "pill-primary"], size: "default", class: "gap-1 p-1" },
    { variant: ["pill", "pill-primary"], size: "lg", class: "gap-1 p-1.5" },
  ],
  defaultVariants: { variant: "line", size: "default" },
});

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  variant?: Variant;
  size?: Size;
  /** 탭이 넘칠 때 가로로 스크롤합니다. 문서 탭(MDI)처럼 개수를 모를 때 쓰세요. */
  scrollable?: boolean;
  /** 스크린 리더용 목록 이름. */
  label?: string;
  children: React.ReactNode;
}

export function Tabs({
  value,
  onValueChange,
  variant = "line",
  size = "default",
  scrollable,
  label,
  className,
  children,
  ...props
}: TabsProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // 목록 전체가 탭 정지 하나입니다 — 방향키로 옮기고 그때 바로 전환합니다
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const tabs = Array.from(
      ref.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([aria-disabled="true"])') ?? []
    );
    if (!tabs.length) return;
    const i = tabs.findIndex((t) => t.dataset.value === value);
    let next = i;
    if (e.key === "ArrowLeft") next = i <= 0 ? tabs.length - 1 : i - 1;
    if (e.key === "ArrowRight") next = i === tabs.length - 1 ? 0 : i + 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    e.preventDefault();
    const el = tabs[next];
    if (el?.dataset.value) {
      onValueChange(el.dataset.value);
      el.focus();
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange, variant, size }}>
      <div
        ref={ref}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          listVariants({ variant, size }),
          /*
            알약은 그림자가 잘리므로 스크롤을 켜지 마세요.

            overflow-y-hidden 을 함께 적어야 합니다 — CSS 는 한 축이 visible 이
            아니면 나머지 축의 visible 을 auto 로 계산합니다. overflow-x-auto 만
            주면 세로도 auto 가 되어, 내용이 1px 만 높아도 오른쪽에 세로 스크롤바가
            생깁니다 (MDI 탭바에서 실제로 그랬습니다).
          */
          scrollable && "overflow-x-auto overflow-y-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* --------------------------------------------------------------- TabItem */

const itemVariants = cva(
  cn(
    "relative flex shrink-0 cursor-pointer items-center whitespace-nowrap select-none",
    "outline-hidden transition-colors",
    "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:-outline-offset-2",
    "aria-disabled:pointer-events-none aria-disabled:text-text-disabled-on"
  ),
  {
    variants: {
      variant: {
        line: "text-tab-text-default hover:text-tab-text-active",
        pill: "rounded-md text-tab-text-default hover:text-tab-text-active",
        "pill-primary": "rounded-md text-tab-text-default hover:text-tab-text-active",
      },
      size: {
        xs: "h-[var(--h-input-xs)] gap-1 px-2 text-xs [&_svg]:size-3",
        sm: "h-[var(--h-input-sm)] gap-1.5 px-3 text-xs [&_svg]:size-3.5",
        default: "h-[var(--h-input-default)] gap-2 px-4 text-sm [&_svg]:size-4",
        lg: "h-[var(--h-input-lg)] gap-2 px-6 text-base [&_svg]:size-5",
      },
      active: { true: "", false: "font-medium" },
    },
    compoundVariants: [
      // line 만 굵기가 바뀝니다 — 알약은 배경이 이미 말하고 있습니다
      { variant: "line", active: true, class: "font-semibold text-tab-text-active" },
      { variant: "pill", active: true, class: "font-medium text-tab-text-active" },
      {
        variant: "pill-primary",
        active: true,
        class: "font-medium bg-tab-surface-active-primary text-tab-text-active-primary shadow-xs",
      },
      // 흰 알약과 바탕의 대비가 1.24:1 이라 그림자가 없으면 구분되지 않습니다
      { variant: "pill", active: true, class: "bg-tab-surface-active shadow-xs" },
    ],
    defaultVariants: { variant: "line", size: "default", active: false },
  }
);

export interface TabItemProps {
  value: string;
  label: string;
  /** 라벨 왼쪽. 뜻이 바로 오지 않으면 넣지 마세요 — 라벨이 이미 말합니다. */
  icon?: React.ReactNode;
  /** 라벨 뒤 건수. `진행중 12` 처럼 읽힙니다. */
  count?: React.ReactNode;
  disabled?: boolean;
  /** 문서 탭(MDI) 전용. 고정된 화면 탭에는 쓰지 마세요. */
  closable?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
}

export function TabItem({
  value,
  label,
  icon,
  count,
  disabled,
  closable,
  onClose,
  closeLabel,
  className,
}: TabItemProps) {
  const { value: current, onValueChange, variant, size } = useTabs("TabItem");
  const active = current === value;

  return (
    // 닫기 버튼이 안에 들어가므로 button 을 쓸 수 없습니다 — 버튼 안의 버튼은
    // 잘못된 HTML 이라 브라우저가 마크업을 재배치합니다
    <div
      role="tab"
      data-value={value}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      // 목록 전체가 탭 정지 하나 — 안에서는 방향키로 옮깁니다
      tabIndex={active && !disabled ? 0 : -1}
      onClick={() => !disabled && onValueChange(value)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onValueChange(value);
        }
        // 문서 탭은 키보드로도 닫을 수 있어야 합니다
        if (closable && (e.key === "Delete" || e.key === "Backspace")) {
          e.preventDefault();
          onClose?.();
        }
      }}
      className={cn(itemVariants({ variant, size, active }), className)}
    >
      {icon}
      <span>{label}</span>
      {count != null && (
        <span
          className={cn(
            "tabular-nums",
            size === "xs" || size === "sm" ? "text-2xs" : size === "lg" ? "text-sm" : "text-xs",
            // Primary 채움 위에서는 회색 건수가 묻힙니다
            variant === "pill-primary" && active ? "text-tab-text-active-primary" : "text-text-subtle"
          )}
        >
          {count}
        </span>
      )}

      {closable && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={closeLabel ?? `${label} 닫기`}
          onClick={(e) => {
            // 닫기를 눌렀는데 탭이 먼저 켜지면 사라진 탭을 보고 있게 됩니다
            e.stopPropagation();
            onClose?.();
          }}
          className={cn(
            "-mr-1 flex shrink-0 items-center justify-center rounded-xs",
            "text-icon-muted-foreground transition-colors hover:bg-alpha-inverse10",
            size === "lg" ? "size-5" : size === "xs" ? "size-3.5" : "size-4"
          )}
        >
          <X aria-hidden />
        </span>
      )}

      {/*
        활성 표시는 목록이 그은 1px 줄 위에 **2px** 로 얹습니다 (Figma `Variant=Line,
        State=Active` 의 하단 스트로크 2px).

        **`bottom-0` 입니다 — `-bottom-px` 가 아닙니다** (2026-08-12). 1px 내려 두면
        2px 중 아래 절반이 목록의 패딩 상자 **밖**으로 나가는데, `scrollable` 이
        `overflow-y-hidden` 이라(세로 스크롤바를 막는 용도) 그 부분이 잘려서
        **1px 만 보였습니다.** MDI 탭바가 그 조합이라 거기서만 얇아 보였습니다.
      */}
      {variant === "line" && active && (
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-tab-indicator" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------- TabPanel */

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이 패널이 딸린 탭의 값. */
  value: string;
  /** 지금 열린 탭의 값. 같을 때만 그립니다. */
  current: string;
  children: React.ReactNode;
}

/**
 * 코드에만 있는 짝입니다 — Figma 는 탭 목록까지만 그립니다.
 * 활성일 때만 그립니다. 열어둔 화면을 살려두고 싶으면 (MDI) 이걸 쓰지 말고
 * 바깥에서 직접 다루세요.
 *
 * **`Tabs` 의 컨텍스트를 쓰지 않습니다.** `Tabs` 는 `<div role="tablist">` 그 자체라
 * 컨텍스트가 목록 안에서만 살아 있는데, 패널을 목록 안에 넣으면 **잘못된 마크업**입니다
 * (`tablist` 의 자식은 `tab` 뿐입니다). 그래서 패널은 형제로 두고 지금 값을
 * `current` 로 받습니다 — 2026-08-11 이전에는 컨텍스트를 요구해서 **바르게 쓰면
 * 반드시 던졌습니다.**
 *
 * ```tsx
 * <Tabs value={v} onValueChange={setV} label="조회 결과 필터">
 *   {FILTERS.map((f) => <TabItem key={f.value} value={f.value} label={f.label} />)}
 * </Tabs>
 * {FILTERS.map((f) => (
 *   <TabPanel key={f.value} value={f.value} current={v}>…</TabPanel>
 * ))}
 * ```
 */
export function TabPanel({ value, current, className, children, ...props }: TabPanelProps) {
  if (current !== value) return null;
  return (
    <div role="tabpanel" tabIndex={0} className={cn("outline-hidden", className)} {...props}>
      {children}
    </div>
  );
}
