import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChartColumn, ClipboardList, FileText, Mail, Settings } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { design, figma } from "./figma";

const USER = { name: "관리자님", email: "admin@ack.co.kr", initial: "관" };

const GROUPS = [
  { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
  { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
  { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
  { name: "환경설정", icon: <Settings />, items: [] },
];

/** 메뉴 트리 한 벌 — 스토리마다 다시 쓰지 않으려고 빼둡니다. */
function MenuTree({ page, onPage }: { page: string; onPage: (p: string) => void }) {
  const [open, setOpen] = useState<string[]>(["검사관리"]);
  const toggle = (g: string) =>
    setOpen((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  return (
    <>
      {GROUPS.map((g) =>
        // 하위가 없으면 묶을 것이 없습니다 — 그냥 항목이고 접힘에서는 툴팁이 붙습니다
        g.items.length === 0 ? (
          <SidebarItem
            key={g.name}
            icon={g.icon}
            label={g.name}
            active={page === g.name}
            chevron={false}
            onClick={() => onPage(g.name)}
          />
        ) : (
          <SidebarGroup
            key={g.name}
            icon={g.icon}
            label={g.name}
            // 1단계 Active = 현재 페이지가 이 묶음 안에 있다
            active={g.items.includes(page)}
            expanded={open.includes(g.name)}
            onExpandedChange={() => toggle(g.name)}
            className="flex flex-col gap-0.5"
          >
            {g.items.map((it) => (
              <SidebarItem
                key={it}
                level={2}
                label={it}
                active={page === it}
                onClick={() => onPage(it)}
              />
            ))}
          </SidebarGroup>
        )
      )}
    </>
  );
}

/**
 * Figma: Sidebar (2 변형 — State)
 *
 * PC 좌측 GNB 입니다. **Header · Menu · Footer** 세 영역입니다.
 *
 * | | 펼침 | 접힘 |
 * |---|---|---|
 * | 폭 | **256** | **72** |
 * | Header | 로고 + 제목 + 토글 | 로고 (누르면 펼쳐집니다) |
 * | Menu | 1·2단계 전부 | **1단계 아이콘만** — hover 하면 서브메뉴 |
 * | Footer | Avatar + 이름·메일 + 설정·로그아웃 | 세로로 쌓음 |
 *
 * ### 접힘은 항목이 스스로 압니다
 *
 * `SidebarCollapsedContext` 로 내려줍니다 — 항목마다 `collapsed` 를 넘기게 하면
 * 하나만 빠뜨려도 그 줄만 라벨이 남습니다.
 *
 * 접히면 **2단계는 통째로 사라집니다.** 아이콘도 라벨도 없어 그릴 것이 없습니다.
 *
 * ### 접힘 상태의 이름 — 툴팁 · 서브메뉴
 *
 * 라벨이 화면에서 사라지므로 이름을 알릴 것이 필요합니다. **하위가 있느냐로 갈립니다.**
 *
 * | | 접힘에서 |
 * |---|---|
 * | 하위 없음 (`SidebarItem`) | **툴팁** — 이름만 |
 * | 하위 있음 (`SidebarGroup`) | **서브메뉴 팝오버** — 이름 + 2단계 항목 |
 *
 * 툴팁은 이름만 말할 뿐 **이동시키지 못합니다.** 하위가 있는데 툴팁만 두면 접힌 동안
 * 2단계 페이지로 갈 길이 아예 없어집니다 — `SidebarGroup` 이 그 구멍을 메웁니다.
 * 둘을 함께 띄우지 않습니다 (같은 이름이 두 번 나오고 겹칩니다).
 *
 * ### 접으면 로고가 토글입니다
 *
 * Figma 의 `State=Collapsed` 는 토글 아이콘을 숨겨 둡니다 — 그대로 두면 한 번 접고 나서
 * **다시 펼 방법이 없습니다.** 겉모습은 그대로 두고 **로고 자리를 버튼으로** 만들었습니다.
 *
 * ### 모바일 짝
 *
 * 모바일에는 사이드바가 없습니다. **`MBottomTabBar` 의 전체메뉴 → `MobileMenuScreen`**
 * 이 이 자리를 대신하고, **같은 `SidebarItem`** 을 씁니다 —
 * PC 로 익힌 메뉴 위치를 다시 배우지 않아도 됩니다.
 */
const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen", ...design(figma.sidebar) },
  argTypes: {
    collapsed: { control: "boolean" },
    title: { control: "text" },
    logo: { control: false },
    user: { control: false },
    children: { control: false },
    onCollapsedChange: { control: false },
    onSettings: { control: false },
    onLogout: { control: false },
  },
  args: { user: USER, children: null },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **헤더의 메뉴 아이콘으로 접었다 펴 보세요.** 접히면 2단계가 사라지고 1단계 아이콘만
 * 남습니다 — 아이콘에 마우스를 올리면 하위가 있는 것은 **서브메뉴**가, 없는 것은
 * **툴팁**이 뜹니다.
 */
export const 기본: Story = {
  render: function Basic(args) {
    const [collapsed, setCollapsed] = useState(false);
    const [page, setPage] = useState("검사결과");

    return (
      <div className="flex h-[600px] bg-surface-gray-subtler">
        <Sidebar
          {...args}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onSettings={() => {}}
          onLogout={() => {}}
        >
          <MenuTree page={page} onPage={setPage} />
        </Sidebar>

        {/* 작업 영역은 남는 폭을 씁니다 — 고정 폭을 주면 접을 때 빈칸이 생깁니다 */}
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-subtle">{page}</p>
        </div>
      </div>
    );
  },
};

/** Figma 의 두 변형입니다. 나란히 두면 무엇이 남고 무엇이 사라지는지 보입니다. */
export const 변형: Story = {
  name: "변형 2종",
  render: function Both(args) {
    const [page, setPage] = useState("검사결과");
    return (
      <div className="flex h-[600px] items-start gap-8 bg-surface-gray-subtler p-6">
        <div>
          <p className="mb-2 text-xs text-text-subtle">State=Expanded — 256</p>
          <div className="h-[520px] overflow-hidden rounded-lg border border-border-gray-light">
            <Sidebar {...args} onSettings={() => {}} onLogout={() => {}}>
              <MenuTree page={page} onPage={setPage} />
            </Sidebar>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-subtle">State=Collapsed — 72</p>
          <div className="h-[520px] overflow-hidden rounded-lg border border-border-gray-light">
            <Sidebar {...args} collapsed onSettings={() => {}} onLogout={() => {}}>
              <MenuTree page={page} onPage={setPage} />
            </Sidebar>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * **메뉴가 6개를 넘으면 슬롯을 늘리지 말고 이 영역이 스크롤합니다** —
 * Header 와 Footer 는 남습니다. Figma 는 슬롯이 6개라 표현할 수 없는 부분입니다.
 */
export const 긴메뉴: Story = {
  name: "긴 메뉴 (스크롤)",
  render: function Long(args) {
    const [page, setPage] = useState("검사결과");
    const extra = ["수탁관리", "청구관리", "재고관리", "장비관리", "품질관리", "공지사항"];
    return (
      <div className="flex h-[600px] bg-surface-gray-subtler">
        <Sidebar {...args} onSettings={() => {}} onLogout={() => {}}>
          <MenuTree page={page} onPage={setPage} />
          {extra.map((e) => (
            <SidebarItem
              key={e}
              icon={<FileText />}
              label={e}
              chevron={false}
              active={page === e}
              onClick={() => setPage(e)}
            />
          ))}
        </Sidebar>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-subtle">{page}</p>
        </div>
      </div>
    );
  },
};

/**
 * 사용자를 넘기지 않으면 **Footer 가 없습니다.**
 * 로그인이 필요 없는 화면이나 문서용 미리보기에 씁니다.
 */
export const 푸터없음: Story = {
  name: "푸터 없음",
  args: { user: undefined },
  render: function NoFooter(args) {
    const [page, setPage] = useState("검사결과");
    return (
      <div className="flex h-[600px] bg-surface-gray-subtler">
        <Sidebar {...args}>
          <MenuTree page={page} onPage={setPage} />
        </Sidebar>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-subtle">{page}</p>
        </div>
      </div>
    );
  },
};

/**
 * **접힌 레일의 아이콘에 마우스를 올려 보세요.** 우측에 2단계가 뜹니다.
 *
 * 접히면 2단계는 화면에서 사라집니다 — 그러면 그 페이지로 갈 길이 **아예 없어집니다.**
 * 접힘 상태의 이름을 툴팁이 알려주긴 하지만 툴팁은 **이동시키지 못합니다.**
 *
 * | | |
 * |---|---|
 * | 머리글 | 접히면 그룹 이름이 화면에 없어서 여기서 알려 줍니다 |
 * | 항목 | **펼친 사이드바와 같은 `SidebarItem` Level 2** — 들여쓰기 32 도 그대로 |
 * | 폭 | **240** = 항목 232 + 좌우 4. 펼침(256)의 항목 폭과 같은 값입니다 |
 * | 위치 | 아이콘 윗선, 레일에서 **8** |
 *
 * 마지막 `환경설정` 은 하위가 없어 **툴팁**이 뜹니다 — 둘은 함께 뜨지 않습니다.
 *
 * ### 키보드
 *
 * `Tab` 으로 아이콘에 도착하면 열리지만 **포커스는 아이콘에 남습니다** — 그러지 않으면
 * `Tab` 한 번에 메뉴 안으로 빨려 들어가 다음 1단계로 넘어갈 수 없습니다.
 * 안으로 들어가려면 `Enter` · `Space` · `→`, 나오려면 `Esc` 입니다.
 */
export const 서브메뉴: Story = {
  name: "접힘 — 서브메뉴",
  render: function Submenu(args) {
    const [page, setPage] = useState("검사결과");
    return (
      <div className="flex h-[600px] bg-surface-gray-subtler">
        <Sidebar {...args} collapsed onSettings={() => {}} onLogout={() => {}}>
          <MenuTree page={page} onPage={setPage} />
        </Sidebar>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-subtle">{page}</p>
        </div>
      </div>
    );
  },
};

