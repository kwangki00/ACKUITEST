import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: AccordionItem (Card 페이지 · 6 변형 — Size 2 × State 3)
 *
 * **공간을 아끼면서 많은 내용을 담는 접이식 영역**입니다.
 *
 * ### `Card` 와 무엇이 다른가
 *
 * | | |
 * |---|---|
 * | **항상 보여야 함** | `Card` |
 * | **공간을 아껴야 함** | `Accordion` |
 *
 * **접힌 내용은 잘 안 봅니다.** 자주 보는 항목은 `defaultValue` 로 펼쳐 두세요 —
 * 중요한 정보를 접어두면 없는 것과 비슷해집니다. 부가 정보에 쓰는 것이 맞습니다.
 *
 * ### 화살표는 「지금 상태」입니다
 *
 * 펼쳐져 있으면 **위**(`chevron-up`), 접혀 있으면 **아래**입니다.
 * "누르면 일어날 일" 로 읽어 반대로 두면, 같은 화면에서 같은 화살표가 두 뜻을
 * 갖게 됩니다 — `Sidebar` 의 1단계 화살표와 같은 규칙입니다.
 *
 * ### 한 번에 하나만 펼칠지
 *
 * `type="single"` 이면 하나를 열 때 다른 것이 닫힙니다. **항목이 많으면 `single`**
 * 쪽이 스크롤을 줄입니다. `collapsible` 을 켜면 열린 것을 다시 눌러 닫을 수 있습니다
 * (안 켜면 항상 하나는 열려 있습니다).
 *
 * ### 쌓으면 목록처럼 보입니다
 *
 * 항목마다 **하단 구분선만** 있어서 여러 개를 쌓으면 선이 이어집니다.
 * 바깥을 테두리 프레임으로 감싸면 하나의 덩어리가 됩니다 — `Accordion` 에
 * `className="rounded-lg border border-card-border"` 를 주세요.
 *
 * ### 높이 애니메이션은 변수가 필요합니다
 *
 * `height: auto` 로는 애니메이션이 안 걸립니다. Radix 가 내용 높이를
 * `--radix-accordion-content-height` 로 넘겨주고, 키프레임(`ack-theme.css`)이 그걸
 * 씁니다. `prefers-reduced-motion` 에서는 즉시 바뀝니다 — 자리를 밀어내는 움직임이라
 * 어지럼을 만들기 쉽습니다.
 */

export type AccordionSize = "sm" | "default";

const AccordionSizeContext = React.createContext<AccordionSize>("default");

export type AccordionProps = (
  | React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
) & {
  /** 트리거 높이 — `sm` 44 · `default` 52 (Figma Size 축). */
  size?: AccordionSize;
};

/**
 * 위 union 을 하나로 편 것입니다. **Storybook 전용**입니다 —
 * `Meta<typeof Accordion>` 이 union 을 교차시키면서 args 를 `never` 로 만들어
 * 스토리에서 `type` 조차 못 넘깁니다 (`SidebarItemFlatProps` 와 같은 사정).
 * 앱 코드에서는 `AccordionProps` 를 그대로 쓰세요.
 */
export type AccordionFlatProps = {
  size?: AccordionSize;
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: never) => void;
  className?: string;
  children?: React.ReactNode;
};

/**
 * 항목들을 감쌉니다. `type="single"` 이면 하나씩, `"multiple"` 이면 여러 개가 열립니다.
 *
 * `size` 는 여기서 한 번만 주면 항목이 전부 따라옵니다 — 항목마다 넘기면 하나만
 * 빠뜨려도 그 줄만 높이가 다릅니다 (`SidebarCollapsedContext` 와 같은 이유).
 */
const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ size = "default", className, ...props }, ref) => (
  <AccordionSizeContext.Provider value={size}>
    <AccordionPrimitive.Root
      ref={ref}
      className={cn("flex flex-col", className)}
      {...(props as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>)}
    />
  </AccordionSizeContext.Provider>
));
Accordion.displayName = "Accordion";

/**
 * 접히는 항목 하나. **하단 구분선만** 있습니다 — 쌓으면 선이 이어져 목록처럼 보입니다.
 *
 * 마지막 항목의 선은 남깁니다. 바깥을 테두리로 감쌌을 때 그 선이 테두리와 겹쳐
 * 자연스럽고, 안 감쌌으면 목록이 끝났다는 표시가 됩니다.
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-card-border last:border-b-0", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const triggerSize: Record<AccordionSize, string> = {
  sm: "h-11 text-sm",
  default: "h-13 text-base",
};

/**
 * 누르는 줄. 제목 왼쪽, 화살표 오른쪽입니다.
 *
 * `<button>` 이라 **안에 버튼을 넣지 마세요** — 버튼 안의 버튼은 잘못된 HTML 이라
 * 브라우저가 마크업을 재배치합니다 (`SelectTrigger` · `TabItem` 과 같은 사정).
 * 줄에 액션이 필요하면 트리거 밖, 항목 안에 따로 놓으세요.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const size = React.useContext(AccordionSizeContext);
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          // group — Radix 는 data-state 를 **트리거에** 답니다. 화살표에 직접 걸면 안 돕니다
          "group flex flex-1 items-center gap-2 px-4 text-left font-medium text-text-basic",
          // Card 에는 hover 표면 토큰이 없습니다 — 누를 수 있는 줄이라 목록·표와 같은
          // Action/Accent 를 씁니다 (ListItem · DropdownMenu 와 같은 색)
          "outline-hidden transition-colors hover:bg-action-accent",
          "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:ring-inset",
          triggerSize[size],
          className
        )}
        {...props}
      >
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {/*
          화살표는 **지금 상태**입니다 — 펼쳐져 있으면 위. "누르면 일어날 일" 로 읽어
          반대로 두면 같은 화살표가 화면에서 두 뜻을 갖게 됩니다
        */}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4.5 shrink-0 text-icon-muted-foreground transition-transform",
            "group-data-[state=open]:rotate-180"
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * 펼쳐지는 내용. **텍스트뿐 아니라 표·카드 무엇이든** 넣을 수 있습니다.
 *
 * 여백은 좌우 16 · 아래 16 이고 위는 0 입니다 — 트리거가 이미 자기 높이를 갖고 있어
 * 위에 또 띄우면 제목과 내용이 멀어집니다.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-text-subtle",
      "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
    )}
    {...props}
  >
    <div className={cn("px-4 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
