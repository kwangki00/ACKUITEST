import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * Figma: Tooltip (4 변형 — Placement 4) + Arrow 불리언
 *
 * 아이콘만 있는 요소의 설명을 띄웁니다. 접힌 Sidebar 나 아이콘 버튼처럼
 * **라벨이 없는 곳에 필수**입니다.
 *
 * `aria-label` 과 역할이 다릅니다 — 그건 보조기술만 읽고, 눈으로 보는 사람에게는
 * 아무 단서가 되지 않습니다. 아이콘 버튼에는 둘 다 필요합니다.
 *
 * **터치 기기에는 hover 가 없습니다.** 툴팁에만 있는 정보를 두지 마세요 —
 * 모바일에서는 아예 뜨지 않습니다.
 *
 * 한 줄 라벨용입니다. 여러 줄 설명이 필요하면 `Popover type="content"` 를 쓰세요.
 *
 * **Figma 는 말풍선 모양만 정의합니다.** Placement 는 화살표 방향일 뿐이고,
 * 실제 위치와 충돌 회피는 Radix 가 정합니다 — 화면 끝에서는 반대편으로 뒤집힙니다.
 */

/**
 * 앱 루트에 하나 둡니다.
 *
 * `delayDuration` — 뜨기까지 기다리는 시간. Radix 기본 700ms 는 업무 화면에는
 * 깁니다. 툴바를 훑을 때 답답해서 400 으로 줄였습니다.
 *
 * `skipDelayDuration` — 하나가 뜬 뒤 옆으로 옮기면 기다리지 않고 바로 보여줍니다.
 * 아이콘이 늘어선 툴바에서 이게 없으면 하나씩 400ms 를 다시 기다립니다.
 * 이 이점 때문에 Provider 를 컴포넌트 안에 숨기지 않고 밖에 둡니다.
 */
function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 300,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** 화살표. 끄면 말풍선만 뜹니다 (Figma 의 Arrow 불리언). */
  arrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, arrow = true, sideOffset, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      // 화살표가 6 만큼 튀어나오므로 그만큼 더 띄웁니다 — 안 그러면 촉이 트리거에 박힙니다
      sideOffset={sideOffset ?? (arrow ? 6 : 4)}
      className={cn(
        // 여백 10/6 · 반경 6 — Figma 값 그대로입니다.
        // 그림자는 없습니다. 어두운 바탕(대비 16.98:1)이 이미 배경과 분리됩니다.
        // 굵기는 적지 않습니다 — text-xs 가 기본으로 SemiBold 입니다 (Figma 는 Medium)
        "z-50 rounded-md bg-tooltip-surface px-2.5 py-1.5",
        "text-xs text-tooltip-text",
        // 말풍선이 화면을 가로지르지 않게. 한 줄 라벨용이라 좁게 잡습니다
        "max-w-56",
        // Popover 와 같은 등장 — 열린 방향에서 짧게 밀려나옵니다
        "data-[state=delayed-open]:animate-pop-in",
        "data-[side=bottom]:[--ack-pop-y:-4px] data-[side=top]:[--ack-pop-y:4px]",
        "data-[side=left]:[--ack-pop-x:4px] data-[side=right]:[--ack-pop-x:-4px]",
        className
      )}
      {...props}
    >
      {children}
      {arrow && (
        // Figma 는 12×6 입니다. Radix 기본은 10×5 라 그대로 두면 조금 뾰족합니다
        <TooltipPrimitive.Arrow width={12} height={6} className="fill-tooltip-surface" />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
