import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Figma: DropdownMenu (Overlay)
 *
 * **행 액션 · 더보기 메뉴**입니다. 표의 Action 셀이나 아이콘 버튼을 누르면 뜹니다.
 *
 * ### `Combobox` 와 무엇이 다른가
 *
 * | | 무엇을 하나 | 표식 |
 * |---|---|---|
 * | `Combobox` · `Select` | **값을 고릅니다** | 고른 것에 체크 |
 * | `DropdownMenu` | **동작을 실행합니다** | **없습니다** |
 *
 * 눌러서 값이 남으면 고르는 것이고, 눌러서 무언가 일어나면 실행하는 것입니다.
 * 그래서 여기에는 **선택 표시가 없습니다** — 체크가 보이면 사용자가 "지금 이게
 * 켜져 있다" 고 읽습니다.
 *
 * 같은 이유로 `ListItem` 을 쓰지 않습니다. `ListItem` 은 `selected` · `check` ·
 * `checkbox` 를 축으로 가진 **고르는 줄**이고, 여기 필요한 것은 그 축이 없는 줄입니다.
 * 높이(32)와 상태 색은 같은 토큰을 씁니다.
 *
 * ### 위험한 동작은 떼어 놓습니다
 *
 * 삭제처럼 되돌릴 수 없는 항목은 **마지막에 두고 `DropdownMenuSeparator` 로**
 * 분리하세요 — 바로 위 항목을 누르려다 미끄러지는 것을 줄입니다.
 * `tone="destructive"` 로 글자도 빨강이 됩니다.
 *
 * ### 항목이 6개를 넘으면
 *
 * 그룹으로 나누거나 별도 화면을 검토하세요. 메뉴가 길어지면 훑는 것이 일이 됩니다.
 *
 * ### 어디서 뜨나
 *
 * `TableCell(Action)` · `TableToolbar` 의 아이콘 버튼 · `Card` 의 Action 슬롯.
 * 모바일에서는 `TableToolbar` 의 아이콘 4개를 **2개 + `⋯`** 로 줄이는 자리입니다.
 *
 * ### 패널은 「떠 있는 것」 규칙 그대로입니다
 *
 * 반경 `Radius/md`(6) · `Background/White` · `Border/Gray-Light` · 그림자.
 * `Popover` · `ComboboxPanel` · `LookupPanel` 과 같은 값입니다.
 */

const DropdownMenu = MenuPrimitive.Root;
const DropdownMenuTrigger = MenuPrimitive.Trigger;
const DropdownMenuGroup = MenuPrimitive.Group;

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content> {
  /** 문서·데모에서 틀 안에 가둘 때만. 보통은 넘기지 마세요. */
  container?: HTMLElement | null;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, align = "end", container, ...props }, ref) => (
  <MenuPrimitive.Portal container={container ?? undefined}>
    <MenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "z-50 min-w-40 rounded-md border border-border-gray-light bg-background-white p-1 shadow-md",
        // 화면 밖으로 나가지 않게 — Radix 가 남은 공간을 재서 넘겨줍니다
        "max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-auto",
        // 열린 방향에서 4px 밀려나옵니다 (Popover 와 같은 키프레임)
        "data-[state=open]:animate-pop-in",
        "data-[side=bottom]:[--ack-pop-y:-4px] data-[side=top]:[--ack-pop-y:4px]",
        "data-[side=left]:[--ack-pop-x:4px] data-[side=right]:[--ack-pop-x:-4px]",
        className
      )}
      {...props}
    />
  </MenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  /** 되돌릴 수 없는 동작에만. 마지막에 두고 구분선으로 떼어 놓으세요. */
  tone?: "default" | "destructive";
  leadingIcon?: React.ReactNode;
}

/**
 * 높이 32 · 좌우 12 — `ListItem` 과 같은 규격이라 두 패널이 나란히 놓여도 맞습니다.
 *
 * hover 와 방향키 커서가 **같은 배경**입니다 (`Action/Accent`). 목록과 달리 선택이
 * 없어서 배경이 뜻하는 것이 하나뿐이라, 여기서는 헷갈릴 일이 없습니다.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, tone = "default", leadingIcon, children, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      "flex h-8 cursor-pointer items-center gap-2 rounded-sm px-3 text-sm outline-hidden select-none",
      "[&_svg]:size-4 [&_svg]:shrink-0",
      // Radix 가 hover·방향키를 highlighted 하나로 묶어 줍니다
      /*
        위험한 동작은 hover 도 붉게 — 다만 `Surface/Danger-Subtler`(#ffeeee) 입니다.
        `Badge/Danger-Soft-Fill`(#ffd9d9)은 배지가 **스스로 서 있는** 색이라 hover 로
        쓰면 눌리기도 전에 경고처럼 보입니다. 여기는 지나가는 표시일 뿐입니다
      */
      tone === "destructive"
        ? "text-text-danger data-[highlighted]:bg-surface-danger-subtler"
        : "text-text-basic data-[highlighted]:bg-action-accent",
      "data-disabled:pointer-events-none data-disabled:text-text-disabled",
      className
    )}
    {...props}
  >
    {leadingIcon && (
      <span className={cn("shrink-0", tone === "default" && "text-icon-muted-foreground")}>
        {leadingIcon}
      </span>
    )}
    {children}
  </MenuPrimitive.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/** 위험한 동작을 떼어 놓는 줄. `Divider/Gray-Light` 1px. */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-divider-gray-light", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/** 묶음 머리글. 항목이 6개에 가까워지면 그룹으로 나누세요. */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-2xs font-medium text-text-muted-foreground", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
