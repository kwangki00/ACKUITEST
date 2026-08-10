import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChartColumn, FileText, Mail, Settings } from "lucide-react";
import { SidebarItem } from "@/components/ui/sidebar-item";
import type { SidebarItemFlatProps } from "@/components/ui/sidebar-item";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: SidebarItem (6 변형 — Level 2 × State 3)
 *
 * 좌측 GNB 의 메뉴 항목입니다. **단독으로 쓰지 않고** `Sidebar` 나
 * `MobileMenuContent` 안에 넣습니다 — PC 와 모바일이 같은 부품을 씁니다.
 *
 * ### 두 단계
 *
 * | | 높이 | 왼쪽 | 라벨 | 오른쪽 |
 * |---|---|---|---|---|
 * | `level={1}` | 44 | 아이콘 18 | `sm/Medium` | 펼침 화살표 16 |
 * | `level={2}` | 36 | 불릿 4 (들여쓰기 32) | `sm/Regular` | — |
 *
 * ### Active 는 두 가지 뜻입니다
 *
 * 1단계와 2단계가 **동시에** 켜집니다 —
 * **1단계는 "현재 페이지가 속한 묶음"**, **2단계는 "현재 페이지 그 자체"** 입니다.
 *
 * 그래서 배경 틴트는 둘 다 같고, **좌측 3px 인디케이터는 2단계에만** 붙습니다.
 * 어느 줄이 지금 보고 있는 화면인지를 인디케이터 하나가 가립니다 —
 * 배경을 진하게 해서 구분하면 사이드바 전체가 무거워집니다.
 *
 * ### 그 밖
 *
 * - **하위 메뉴가 없는 1단계는 `chevron` 을 끄세요** — 눌러도 펼쳐지지 않는데
 *   화살표가 있으면 사용자가 눌러 봅니다
 * - 2단계에는 아이콘·화살표를 **타입이 막습니다.** 화살표를 달면 3단계가 있는 것처럼 보입니다
 * - Hover 는 prop 이 아니라 CSS 상태입니다 (Figma 의 `State=Hover`)
 */
const meta = {
  title: "Navigation/SidebarItem",
  // union 을 편 타입으로 넘깁니다 — 그대로 두면 Storybook 이 args 를 never 로 만듭니다
  component: SidebarItem as React.FC<SidebarItemFlatProps>,
  parameters: { layout: "centered", ...design(figma.sidebarItem) },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2] },
    active: { control: "boolean" },
    chevron: { control: "boolean" },
    expanded: { control: "boolean" },
    label: { control: "text" },
    count: { control: "text" },
    icon: { control: false },
    onClick: { control: false },
  },
  args: { label: "검사관리" },
  decorators: [
    (Story) => (
      <div className="w-58 rounded-lg bg-sidebar-surface p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SidebarItemFlatProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  parameters: { ...argsSource },
  args: { icon: <FileText /> },
};

/** 6변형을 그대로 늘어놓은 것입니다. Hover 는 마우스를 올려 보세요. */
export const 변형: Story = {
  name: "변형 6종",
  render: () => (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1 px-1 text-2xs text-text-muted-foreground">Level=1</p>
        <div className="flex flex-col gap-0.5">
          <SidebarItem icon={<FileText />} label="검사관리 (Default)" />
          <SidebarItem icon={<FileText />} label="검사관리 (Active)" active expanded />
        </div>
      </div>
      <div>
        <p className="mb-1 px-1 text-2xs text-text-muted-foreground">Level=2</p>
        <div className="flex flex-col gap-0.5">
          <SidebarItem level={2} label="검사이력 (Default)" />
          <SidebarItem level={2} label="검사결과 (Active)" active />
        </div>
      </div>
    </div>
  ),
};

/**
 * **두 단계가 동시에 Active 입니다.** 검사관리는 *묶음*, 검사결과는 *현재 화면* —
 * 인디케이터 바가 붙은 줄이 지금 보고 있는 곳입니다.
 *
 * 통계관리처럼 하위 메뉴를 접으면 2단계가 사라집니다.
 * 고객SMS관리는 하위가 없어 **화살표를 껐습니다.**
 */
export const 메뉴트리: Story = {
  name: "메뉴 트리",
  render: function Tree() {
    const [open, setOpen] = useState<string[]>(["검사관리"]);
    const [page, setPage] = useState("검사결과");
    const toggle = (g: string) =>
      setOpen((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

    const groups = [
      { name: "검사관리", icon: <FileText />, items: ["통합결과조회", "검사결과", "검사이력"] },
      { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
      { name: "고객SMS관리", icon: <Mail />, items: [] },
      { name: "환경설정", icon: <Settings />, items: [] },
    ];

    return (
      <div className="flex flex-col gap-0.5">
        {groups.map((g) => {
          const expanded = open.includes(g.name);
          const hasChild = g.items.length > 0;
          return (
            <div key={g.name} className="flex flex-col gap-0.5">
              <SidebarItem
                icon={g.icon}
                label={g.name}
                // 1단계 Active = 현재 페이지가 이 묶음 안에 있다
                active={g.items.includes(page) || (!hasChild && page === g.name)}
                // 하위가 없으면 화살표를 끕니다 — 눌러도 펼쳐지지 않습니다
                chevron={hasChild}
                expanded={expanded}
                onClick={() => (hasChild ? toggle(g.name) : setPage(g.name))}
              />
              {expanded &&
                g.items.map((it) => (
                  <SidebarItem
                    key={it}
                    level={2}
                    label={it}
                    // 2단계 Active = 지금 보고 있는 화면. 인디케이터가 여기에만 붙습니다
                    active={page === it}
                    onClick={() => setPage(it)}
                  />
                ))}
            </div>
          );
        })}
      </div>
    );
  },
};

/** 건수를 붙이면 라벨 뒤에 붙습니다. 미보고 건수처럼 **바로 눈에 들어와야 할 숫자**에만 쓰세요. */
export const 건수: Story = {
  render: () => (
    <div className="flex flex-col gap-0.5">
      <SidebarItem icon={<FileText />} label="검사관리" count={128} expanded active />
      <SidebarItem level={2} label="미보고 결과" count={12} />
      <SidebarItem level={2} label="검사결과" count={116} active />
    </div>
  ),
};
