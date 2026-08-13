import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, ChartColumn, FileText, Mail, Search, Settings } from "lucide-react";
import { MobileMenuScreen } from "@/components/ui/mobile-menu";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { Badge } from "@/components/ui/badge";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { design, figma } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 변수를 모바일 값으로 고정합니다. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtler"
    >
      <PointerModeProvider mode="touch">{children}</PointerModeProvider>
    </div>
  );
}

const USER = { name: "관리자님", email: "admin@ack.co.kr", initial: "관" };

const GROUPS = [
  { name: "검사관리", icon: <FileText />, items: ["통합결과조회", "검사결과", "검사이력"] },
  { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
  { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
  { name: "환경설정", icon: <Settings />, items: [] },
];

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
] as const;

/** 메뉴 트리 한 벌 — 스토리마다 다시 쓰지 않으려고 빼둡니다. */
function MenuTree({
  page,
  onPage,
}: {
  page: string;
  onPage: (p: string) => void;
}) {
  const [open, setOpen] = useState<string[]>(["검사관리"]);
  const toggle = (g: string) =>
    setOpen((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  return (
    <>
      {GROUPS.map((g) => {
        const expanded = open.includes(g.name);
        const hasChild = g.items.length > 0;
        return (
          <div key={g.name} className="flex flex-col gap-0.5">
            <SidebarItem
              icon={g.icon}
              label={g.name}
              active={g.items.includes(page) || (!hasChild && page === g.name)}
              chevron={hasChild}
              expanded={expanded}
              onClick={() => (hasChild ? toggle(g.name) : onPage(g.name))}
            />
            {expanded &&
              g.items.map((it) => (
                <SidebarItem
                  key={it}
                  level={2}
                  label={it}
                  active={page === it}
                  onClick={() => onPage(it)}
                />
              ))}
          </div>
        );
      })}
    </>
  );
}

/**
 * Figma: MobileMenuScreen · MobileMenuContent
 *
 * 모바일 전체메뉴입니다. 하단 탭바의 **전체메뉴**를 누르면 열립니다.
 *
 * ### 시트가 아니라 전체 화면입니다
 *
 * 메뉴는 **다른 화면으로 떠나는 동작**이라 뒤 화면을 남겨둘 이유가 없습니다.
 * 날짜 선택이나 필터처럼 *뒤를 보면서 고르는* 것만 `MobileSheet` 를 씁니다.
 *
 * ### 메뉴 구조는 PC 사이드바 그대로
 *
 * `SidebarItem` 을 그대로 씁니다 — **PC 로 익힌 위치를 다시 배우지 않아도 됩니다.**
 * 상단의 사용자 정보와 설정·로그아웃도 PC 사이드바 푸터와 같은 항목입니다.
 *
 * ### 탭바는 이 컴포넌트 밖입니다
 *
 * Figma 는 `MobileMenuScreen` 안에 탭바까지 그려 두었지만, 코드에서는 **껍데기가 들고
 * 있습니다.** 탭바는 화면이 바뀌어도 계속 남아 있는 것이라 메뉴를 열 때마다 다시
 * 만들어지면 안 됩니다 — Figma 는 "화면 하나" 를 그려야 해서 함께 담을 수밖에 없습니다.
 *
 * 대신 **활성 탭은 그대로 두고** 전체메뉴 자리에만 불이 들어옵니다.
 *
 * ### 닫기(X)는 이전 화면으로
 *
 * 탭바로도 나갈 수 있지만, **메뉴를 열기 전 화면으로 되돌아가는 경로**가 따로 있는 편이
 * 안전합니다. `onClose` 를 넘기지 않으면 X 가 사라지고 탭바로만 나갑니다.
 *
 * ### 오른쪽에서 밀려 들어옵니다
 *
 * `open` 을 넘기면 컴포넌트가 여닫는 움직임을 맡습니다 — 모바일에서 화면이 바뀌는
 * 표준 움직임입니다. 나갈 때 오른쪽으로 되돌아가므로 **뒤로 가기와 방향이 맞습니다.**
 *
 * 시트의 아래→위와 **일부러 다릅니다** — 같은 움직임을 쓰면 전체 화면인지 시트인지가
 * 흐려집니다. 나감(180ms)이 들어옴(220ms)보다 조금 빠릅니다.
 *
 * 부모를 `relative overflow-hidden` 으로 두세요. `앱 껍데기` 스토리에서 눌러 보세요.
 */
const meta = {
  title: "Mobile/MobileMenuScreen",
  component: MobileMenuScreen,
  parameters: { layout: "centered", ...design(figma.mobileMenuScreen) },
  argTypes: {
    title: { control: "text" },
    user: { control: false },
    children: { control: false },
    onClose: { control: false },
    onSettings: { control: false },
    onLogout: { control: false },
  },
  args: { user: USER, children: null },
} satisfies Meta<typeof MobileMenuScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 헤더 + 사용자 + 메뉴 트리입니다. 하단 탭바는 껍데기가 붙입니다. */
export const 기본: Story = {
  render: function Basic(args) {
    const [page, setPage] = useState("검사결과");
    return (
      <Phone>
        <div className="flex h-full flex-col">
          <MobileMenuScreen {...args} onClose={() => {}} onSettings={() => {}} onLogout={() => {}}>
            <MenuTree page={page} onPage={setPage} />
          </MobileMenuScreen>
          <MBottomTabBar value="results" onValueChange={() => {}} menuOpen homeIndicator />
        </div>
      </Phone>
    );
  },
};

/**
 * `onClose` 를 넘기지 않으면 **X 가 없습니다.** 탭바로만 나갑니다 —
 * Figma 의 `Close` 를 끈 모습입니다.
 */
export const 닫기없음: Story = {
  name: "닫기 없음",
  render: function NoClose(args) {
    const [page, setPage] = useState("검사이력");
    return (
      <Phone>
        <div className="flex h-full flex-col">
          <MobileMenuScreen {...args}>
            <MenuTree page={page} onPage={setPage} />
          </MobileMenuScreen>
          <MBottomTabBar value="history" onValueChange={() => {}} menuOpen homeIndicator />
        </div>
      </Phone>
    );
  },
};

/**
 * **탭바의 전체메뉴를 눌러 열고, X 로 닫아 보세요.**
 *
 * 이것이 모바일 껍데기의 완성형입니다 —
 * `MobileTop` + 본문 + `MBottomTabBar`, 그 위로 전체메뉴가 갈아 끼워집니다.
 *
 * 확인해 볼 것:
 * - 메뉴를 **열었다 그냥 닫으면** 활성 탭이 그대로입니다
 * - 메뉴에서 **화면을 고르면** 그때 탭이 옮겨 갑니다
 * - 상단 바와 탭바는 스크롤 영역 밖이라 목록만 움직입니다
 * - 메뉴는 **오른쪽에서 밀려 들어와** 오른쪽으로 나갑니다 — 그동안 탭바는 자리를 지킵니다
 */
export const 껍데기: Story = {
  name: "앱 껍데기 (전체 조립)",
  render: function Shell() {
    const [tab, setTab] = useState("results");
    const [menu, setMenu] = useState(false);
    const [page, setPage] = useState("검사결과");

    // 메뉴에서 고른 화면을 탭에 맞춥니다 — 짝이 없으면 탭은 그대로 둡니다
    const pick = (p: string) => {
      setPage(p);
      const map: Record<string, string> = {
        통합결과조회: "results",
        검사결과: "results",
        검사이력: "history",
        "기간별 통계": "stats",
        "검사별 통계": "stats",
        "SMS 발송": "sms",
        "발송 이력": "sms",
      };
      if (map[p]) setTab(map[p]);
      setMenu(false);
    };

    return (
      <Phone>
        <div className="flex h-full flex-col">
          {/*
            본문 영역입니다. 전체메뉴가 이 자리를 덮으므로 relative + overflow-hidden 이고,
            탭바는 밖에 있어 메뉴가 들어와도 그대로 남습니다
          */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <MobileTop
              variant="title"
              title={page}
              actions={
                <>
                  <MobileTopAction label="검색">
                    <Search />
                  </MobileTopAction>
                  <MobileTopAction label="알림" dot>
                    <Bell />
                  </MobileTopAction>
                </>
              }
            />
            <div className="min-h-0 flex-1 overflow-y-auto">
              {ROWS.map((r) => (
                <MobileListCard
                  key={r.chart}
                  title={r.name}
                  meta={`차트 ${r.chart} · ${r.test}`}
                  badge={
                    <Badge tone={r.tone} size="sm">
                      {r.status}
                    </Badge>
                  }
                  values={[
                    { label: "결과", value: r.value },
                    { label: "보고일", value: r.date },
                  ]}
                  onClick={() => {}}
                />
              ))}
            </div>

            {/* 오른쪽에서 밀려 들어와 오른쪽으로 나갑니다 */}
            <MobileMenuScreen
              open={menu}
              user={USER}
              onClose={() => setMenu(false)}
              onSettings={() => {}}
              onLogout={() => {}}
            >
              <MenuTree page={page} onPage={pick} />
            </MobileMenuScreen>
          </div>

          {/* 탭바는 메뉴가 열려도 갈리지 않습니다 — 껍데기가 들고 있습니다 */}
          <MBottomTabBar
            value={tab}
            onValueChange={(v) => {
              setTab(v);
              setMenu(false);
            }}
            menuOpen={menu}
            onMenuOpen={() => setMenu(!menu)}
            homeIndicator
          />
        </div>
      </Phone>
    );
  },
};
