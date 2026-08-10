import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { SidebarCollapsedContext, SidebarItem } from "@/components/ui/sidebar-item";

/**
 * Figma: SidebarSubmenu (Navigation 페이지)
 *
 * **하위 메뉴를 가진 1단계**입니다. 1단계 줄과 그 아래 2단계 항목들을 한 덩어리로 묶습니다.
 *
 * ### 왜 묶어야 하나
 *
 * 접히면 **2단계는 통째로 사라집니다** — 아이콘도 라벨도 없어 그릴 것이 없기 때문입니다.
 * 그러면 2단계 페이지로 갈 길이 **아예 없어집니다.** 접힘 상태의 이름은 `Tooltip` 이
 * 알려주지만 툴팁은 이름만 말할 뿐 이동시키지 못합니다.
 *
 * 그래서 접히면 아이콘에 hover · focus 했을 때 **우측에 서브메뉴가 뜹니다.**
 * 그걸 그리려면 1단계가 자기 하위 항목을 알아야 하는데, 형제로 나란히 놓으면 알 수 없습니다 —
 * 이 컴포넌트가 있는 이유입니다.
 *
 * ```tsx
 * <SidebarGroup icon={<FileText />} label="검사관리" active expanded={open} onExpandedChange={setOpen}>
 *   <SidebarItem level={2} label="통합결과조회" active />
 *   <SidebarItem level={2} label="검사결과" />
 * </SidebarGroup>
 * ```
 *
 * | | 펼침 (256) | 접힘 (72) |
 * |---|---|---|
 * | 1단계 | 줄 + 화살표 | 아이콘 |
 * | 2단계 | `expanded` 면 아래에 | **hover 하면 우측 팝오버** |
 * | 이름 | 라벨 그대로 | 팝오버 **머리글** |
 *
 * ### 툴팁과 함께 띄우지 않습니다
 *
 * 하위가 있는 1단계는 툴팁 대신 이것을 띄웁니다 — 둘이 같이 뜨면 같은 이름이 두 번 나오고
 * 서로 겹칩니다. 하위가 없는 1단계는 그대로 `SidebarItem` 이고 툴팁이 붙습니다.
 *
 * ### 팝오버 안에서는 접힘을 끕니다
 *
 * `SidebarItem` 은 `SidebarCollapsedContext` 가 `true` 면 2단계에서 **`null` 을 반환**합니다.
 * 팝오버는 접힘 상태에서 뜨는 것이라 그대로 두면 **내용이 통째로 비어** 나옵니다.
 * 안쪽에서 컨텍스트를 `false` 로 되돌려 평소 모양대로 그립니다.
 *
 * ### 왜 hover 인데 `Popover` 인가
 *
 * `Tooltip` 은 **읽는 것**이라 안에 누를 것을 두면 안 되고, Radix `HoverCard` 는 이 저장소에
 * 없습니다. 그래서 `Popover` 를 `open` 으로 직접 몰고 hover · focus 로 여닫습니다.
 *
 * 레일과 패널 **사이 8px 틈**을 지나는 동안 닫히면 못 씁니다. 그래서 나가는 것은
 * **120ms 미룹니다** — 그 사이 패널에 들어오면 취소됩니다.
 *
 * ### 키보드
 *
 * | 키 | |
 * |---|---|
 * | `Tab` 으로 아이콘에 도착 | 팝오버가 열립니다 (**포커스는 아이콘에 남습니다**) |
 * | `Enter` · `Space` · `→` | 팝오버 **안으로** 들어갑니다 |
 * | `Esc` | 닫고 아이콘으로 돌아옵니다 |
 *
 * 도착만 해도 열리는 이유는 hover 와 같은 것을 보여주기 위해서입니다. 다만 그때 포커스까지
 * 옮기면 `Tab` 한 번에 메뉴 안으로 빨려 들어가 **다음 1단계로 넘어갈 수 없습니다.**
 */

export interface SidebarGroupProps {
  label: string;
  icon?: React.ReactNode;
  /** 이 묶음 안에 현재 페이지가 있는지. */
  active?: boolean;
  /** 라벨 뒤 건수. */
  count?: React.ReactNode;
  /** 펼침 상태에서 하위가 보이는지. 접힘에서는 쓰이지 않습니다. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** `SidebarItem level={2}` 들. */
  children: React.ReactNode;
  className?: string;
  /** 문서·데모에서 팝오버를 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

/** 나가는 길에 8px 틈을 지나야 해서 닫기를 미룹니다. */
const CLOSE_DELAY = 120;

export function SidebarGroup({
  label,
  icon,
  active,
  count,
  expanded,
  onExpandedChange,
  children,
  className,
  container,
}: SidebarGroupProps) {
  const collapsed = React.useContext(SidebarCollapsedContext);
  const [open, setOpen] = React.useState(false);
  // 열 때 포커스를 안으로 넣을지 — hover·Tab 은 두고, Enter·→ 만 들어갑니다
  const moveFocus = React.useRef(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  React.useEffect(() => cancel, []);

  const show = () => {
    cancel();
    setOpen(true);
  };
  const hide = () => {
    cancel();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  if (!collapsed) {
    return (
      <div className={className}>
        <SidebarItem
          level={1}
          icon={icon}
          label={label}
          active={active}
          count={count}
          expanded={expanded}
          onClick={() => onExpandedChange?.(!expanded)}
        />
        {expanded && children}
      </div>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        cancel();
        setOpen(next);
      }}
    >
      <div
        className={cn("relative", className)}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={(e) => {
          // 묶음 안(아이콘 ↔ 패널)에서 오간 것은 나간 것이 아닙니다
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide();
        }}
      >
        <PopoverAnchor asChild>
          <div>
            <SidebarItem
              level={1}
              icon={icon}
              label={label}
              active={active}
              // 접힘의 SidebarItem 은 툴팁을 답니다 — 서브메뉴와 겹치므로 여기서는 끕니다
              tooltip={false}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => {
                moveFocus.current = true;
                setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight") return;
                e.preventDefault();
                moveFocus.current = true;
                setOpen(true);
              }}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          type="list"
          side="right"
          align="start"
          sideOffset={8}
          /*
            패널은 Portal 로 빠져나가 이 div 의 자식이 아닙니다. focus 는 React 트리를
            타고 올라와 위 onFocus·onBlur 에 잡히지만 **pointerenter·leave 는 아예
            버블하지 않아** 여기에 직접 달아야 합니다. 안 그러면 레일에서 패널로
            건너가는 8px 틈에서 닫혀 아무것도 누를 수 없습니다
          */
          onPointerEnter={show}
          onPointerLeave={hide}
          collisionPadding={8}
          collisionBoundary={container ?? undefined}
          // hover 로 연 것에는 포커스를 옮기지 않습니다 — Tab 한 번에 메뉴로
          // 빨려 들어가면 다음 1단계로 넘어갈 수 없습니다
          onOpenAutoFocus={(e) => {
            if (!moveFocus.current) e.preventDefault();
            moveFocus.current = false;
          }}
          // 마우스로 다른 곳을 눌렀을 때 포커스가 튀지 않게
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-60"
          aria-label={label}
        >
          {/*
            접히면 그룹 이름이 화면에 없습니다 — 어느 묶음을 열었는지 여기서 알려줍니다.
            2단계 줄(36)과 같은 높이라 아래 항목과 줄이 맞습니다
          */}
          <div className="flex h-9 items-center px-3 text-sm font-semibold text-sidebar-text">
            {label}
          </div>
          <div aria-hidden className="-mx-1 mb-0.5 h-px bg-divider-gray-light" />

          {/* 안쪽은 접힘이 아닙니다 — 안 그러면 2단계가 전부 null 이 되어 빈 패널이 뜹니다 */}
          <SidebarCollapsedContext.Provider value={false}>
            {children}
          </SidebarCollapsedContext.Provider>
        </PopoverContent>
      </div>
    </Popover>
  );
}
