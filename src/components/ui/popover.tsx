import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/**
 * Figma: Popover (2 변형 — Type 2)
 *
 * 떠 있는 패널입니다. Select · Combobox · DropdownMenu · DatePicker 가 모두 이 위에 얹힙니다.
 *
 * Type=list    목록용 (여백 4 · 줄 간격 2). ListItem 을 담습니다.
 *              — 목록을 담을 때는 role="listbox" 를 함께 주세요.
 * Type=content 임의 콘텐츠용 (여백 16 · 간격 12). 필터 패널 · 설명 카드.
 *
 * **Figma 는 패널 모양만 정의합니다.** 위치·충돌 회피·포커스 가두기·ESC 닫기는
 * Radix 가 담당합니다 — 이건 Figma 로 표현할 수 없는 영역입니다.
 *
 * 등장 애니메이션은 코드에서 더한 것입니다. 패널이 즉시 나타나면 어디서 열렸는지
 * 알기 어려워, 열린 방향에서 짧게 밀려나오게 했습니다.
 */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

type PanelType = "list" | "content";

const typeMap: Record<PanelType, string> = {
  list: "flex flex-col gap-0.5 p-1",
  content: "flex flex-col gap-3 p-4",
};

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  type?: PanelType;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, type = "content", align = "start", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md border border-border-gray-light bg-background-white shadow-md",
        // 트리거보다 좁아지지 않게 — 목록이 트리거보다 좁으면 어디에 딸린 패널인지 흐려집니다
        "min-w-[var(--radix-popover-trigger-width)]",
        // 화면 밖으로 나가지 않게. Radix 가 남은 공간을 재서 넘겨줍니다
        "max-h-[var(--radix-popover-content-available-height)] overflow-auto",
        typeMap[type],
        // 열린 방향에서 4px 밀려나옵니다. 키프레임은 ack-theme.css 에 있고
        // 방향만 변수로 넘깁니다 — 애니메이션 하나로 네 방향을 처리합니다
        "data-[state=open]:animate-pop-in",
        "data-[side=bottom]:[--ack-pop-y:-4px] data-[side=top]:[--ack-pop-y:4px]",
        "data-[side=left]:[--ack-pop-x:4px] data-[side=right]:[--ack-pop-x:-4px]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverAnchor, PopoverClose, PopoverContent };
