import * as React from "react";
import { ChartColumn, ClipboardList, Component, Mail, Settings } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { TabItem, TabPanel, Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { addDays, startOfDay } from "@/lib/date";
import { QueryFilter, type Query } from "./query-bar";
import { PatientList } from "./patient-list";
import { PatientDetail } from "./patient-detail";
import { PATIENTS, TOTAL_PATIENTS } from "./data";
import { ComponentGallery } from "@/screens/component-gallery";
import { useIsMobileLayout } from "@/lib/use-media-query";
import { MobileResultLookup } from "./mobile";

/**
 * 결과조회 화면입니다 — 이 저장소의 **첫 실제 화면**입니다.
 *
 * Storybook 은 부품을 하나씩 보는 자리이고, 여기는 **앱이 실제로 도는 코드**입니다.
 * 자료는 `data.ts` 에 모아 두었습니다 — 서버가 붙으면 그 파일만 갈아끼우면 됩니다.
 *
 * ### 좌우 분할입니다
 *
 * 결과 확인은 **환자를 옮겨 다니며** 합니다. 목록을 떠나 상세로 갔다가 돌아오는 것보다
 * 왼쪽에서 고르고 오른쪽에서 보는 편이 손이 덜 갑니다 — 「이전환자 · 다음환자」 버튼이
 * 그 흐름을 그대로 잇습니다.
 *
 * ### 화면 구조
 *
 * ```
 * Screen
 * ├ Sidebar 256          접으면 72
 * └ Workspace
 *    ├ MDI TabBar 40     열린 화면 목록 (탭바는 Content 밖입니다)
 *    └ Content
 *       ├ QueryBar       조회 조건 한 줄
 *       └ 좌우 분할       PatientList 540 · PatientDetail 나머지
 * ```
 *
 * **탭바를 Content 안에 두지 마세요** — 탭을 바꾸면 자기 자신도 갈리는 모순이 생깁니다.
 *
 * ### 좁아지면 통째로 갈립니다 (2026-08-12)
 *
 * **1024px 미만이면 `MobileResultLookup`** 입니다 — `--h-input-default` 같은 반응형
 * 변수가 쓰는 것과 같은 지점이라, 높이와 구조가 한 번에 바뀝니다.
 *
 * CSS 로 못 하는 이유는 **마크업 자체가 다르기** 때문입니다 (「아직 갈리는 것」).
 * 둘 다 그려놓고 하나를 숨기면 안 보이는 쪽의 상태·포커스·스크롤이 살아 있어서,
 * 창을 줄였다 늘리면 엉뚱한 자리로 돌아옵니다.
 *
 * **조회 조건·고른 환자 같은 값은 여기(위)에 있습니다.** 껍데기 안에 두면 창 폭이
 * 바뀔 때 컴포넌트가 통째로 갈리면서 값이 초기화됩니다 — 조회해 둔 조건이 창을
 * 줄였다고 사라지면 안 됩니다.
 */

const MENU = [
  { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
  { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
  { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
  { name: "환경설정", icon: <Settings />, items: [] },
  /*
    테스트 빌드 전용입니다. 빌드된 앱에서 토큰과 컴포넌트가 실제로 나오는지 눈으로
    보는 자리라 메뉴에 넣어 두었습니다 — Storybook 은 별도 빌드라 배포본에 없습니다.
    실제 제품에서는 이 줄을 지우세요.
  */
  { name: "컴포넌트", icon: <Component />, items: [] },
];

/** 사이드바에서 고른 화면이 무엇을 그리는지. 없으면 자리표시만 나옵니다. */
const SCREENS: Record<string, () => React.ReactNode> = {
  컴포넌트: () => <ComponentGallery />,
};

const today = startOfDay(new Date());

const EMPTY_QUERY: Query = {
  period: { start: addDays(today, -6), end: today },
  keyword: "",
  test: "all",
  sort: "receipt",
  excludeBlocked: false,
};

export function ResultLookupScreen() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [openGroups, setOpenGroups] = React.useState<string[]>(["검사관리"]);
  const [page, setPage] = React.useState("검사결과");

  /*
    탭바는 **열린 화면 목록**입니다. 사이드바에서 화면을 고르면 탭이 하나 생기고,
    이미 열려 있으면 새로 열지 않고 그 탭으로 갑니다 — 같은 화면이 두 번 열리면
    어느 쪽이 지금 보던 것인지 알 수 없습니다.
  */
  const [tabs, setTabs] = React.useState<string[]>(["검사결과"]);
  const [tab, setTab] = React.useState("검사결과");

  const openScreen = (name: string) => {
    setPage(name);
    setTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setTab(name);
  };

  const [query, setQuery] = React.useState<Query>(EMPTY_QUERY);
  /* 접힘 상태도 여기 둡니다 — 껍데기 안에 두면 창 폭이 바뀔 때 도로 펼쳐집니다 */
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [listPage, setListPage] = React.useState(1);
  const [chart, setChart] = React.useState(PATIENTS[5].chart);

  const index = PATIENTS.findIndex((p) => p.chart === chart);
  const patient = PATIENTS[index];

  /*
    모바일은 목록과 상세가 **다른 화면**이라 "아무도 안 고른" 상태가 필요합니다.
    PC 는 좌우 분할이라 늘 하나가 골라져 있습니다 — 그래서 값을 하나 더 둡니다.
  */
  const [mobileChart, setMobileChart] = React.useState<string | null>(null);

  /*
    상세에서 환자를 옮겨 다니는 길입니다 — PC 의 「이전환자 · 다음환자」와 같은 흐름을
    모바일에도 둡니다. 목록으로 돌아갔다 다시 고르는 것보다 훨씬 짧습니다.
    고른 값은 PC 쪽(`chart`)에도 함께 넣습니다 — 창을 넓히면 그 환자가 보여야 합니다.
  */
  const mobileIndex = PATIENTS.findIndex((p) => p.chart === mobileChart);
  const goMobile = (i: number) => {
    const next = PATIENTS[i].chart;
    setMobileChart(next);
    setChart(next);
  };

  const isMobile = useIsMobileLayout();

  const closeTab = (name: string) => {
    setTabs((prev) => {
      const i = prev.indexOf(name);
      const next = prev.filter((t) => t !== name);
      // 닫는 탭이 지금 탭이면 옆 탭으로 — 빈 화면을 보여주지 않습니다
      if (tab === name && next.length) {
        const moved = next[i] ?? next[i - 1];
        setTab(moved);
        setPage(moved);
      }
      return next;
    });
  };

  if (isMobile) {
    return (
      <MobileResultLookup
        query={query}
        onQueryChange={setQuery}
        onSearch={() => setListPage(1)}
        onReset={() => setQuery(EMPTY_QUERY)}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
        chart={mobileChart}
        onSelect={(c) => {
          setMobileChart(c);
          // 상세로 들어간 환자는 PC 로 돌아갔을 때도 그대로 보여야 합니다
          if (c) setChart(c);
        }}
        onPrev={mobileIndex > 0 ? () => goMobile(mobileIndex - 1) : undefined}
        onNext={
          mobileIndex >= 0 && mobileIndex < PATIENTS.length - 1
            ? () => goMobile(mobileIndex + 1)
            : undefined
        }
        menu={MENU}
        page={page}
        onOpenScreen={openScreen}
      />
    );
  }

  return (
    <div className="flex h-screen bg-surface-gray-subtler">
      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        title="결과조회 시스템"
        user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
        onSettings={() => {}}
        onLogout={() => {}}
      >
        {MENU.map((g) =>
          g.items.length === 0 ? (
            // 하위가 없으면 화살표를 끕니다 — 눌러도 안 펼쳐지는데 있으면 눌러 봅니다
            <SidebarItem
              key={g.name}
              icon={g.icon}
              label={g.name}
              active={page === g.name}
              chevron={false}
              onClick={() => openScreen(g.name)}
            />
          ) : (
            <SidebarGroup
              key={g.name}
              icon={g.icon}
              label={g.name}
              active={g.items.includes(page)}
              expanded={openGroups.includes(g.name)}
              onExpandedChange={() =>
                setOpenGroups((p) =>
                  p.includes(g.name) ? p.filter((x) => x !== g.name) : [...p, g.name]
                )
              }
              className="flex flex-col gap-0.5"
            >
              {g.items.map((it) => (
                <SidebarItem
                  key={it}
                  level={2}
                  label={it}
                  active={page === it}
                  onClick={() => openScreen(it)}
                />
              ))}
            </SidebarGroup>
          )
        )}
      </Sidebar>

      {/* 오른쪽은 남는 폭을 씁니다 — 고정 폭을 주면 사이드바를 접을 때 빈칸이 생깁니다 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Tabs
          value={tab}
          onValueChange={setTab}
          scrollable
          label="열린 화면"
          className="shrink-0 bg-background-white px-2"
        >
          {tabs.map((name) => (
            <TabItem
              key={name}
              value={name}
              label={name}
              // 마지막 하나는 닫지 않습니다 — 빈 화면을 보여줄 수 없습니다
              closable={tabs.length > 1}
              onClose={() => closeTab(name)}
            />
          ))}
        </Tabs>

        <TabPanel value="검사결과" current={tab} className="flex min-h-0 flex-1 flex-col">
          <QueryFilter
            value={query}
            onChange={setQuery}
            onSearch={() => setListPage(1)}
            onReset={() => setQuery(EMPTY_QUERY)}
            open={filterOpen}
            onOpenChange={setFilterOpen}
            count={TOTAL_PATIENTS}
          />

          {/*
            본문 여백 **20** · 판 사이 **16** 입니다 (Figma `결과조회-기본` 의
            `Frame 7`: pad 20 · gap 16). 24 로 두면 위의 조회 조건(pad 20)과
            어긋나 본문만 안쪽으로 밀려 보입니다.
          */}
          <div className="flex min-h-0 flex-1 gap-4 p-5">
            <PatientList
              chart={chart}
              onSelect={setChart}
              page={listPage}
              onPageChange={setListPage}
            />
            {patient ? (
              <PatientDetail
                patient={patient}
                onPrev={index > 0 ? () => setChart(PATIENTS[index - 1].chart) : undefined}
                onNext={
                  index < PATIENTS.length - 1
                    ? () => setChart(PATIENTS[index + 1].chart)
                    : undefined
                }
              />
            ) : (
              // 조회했는데 0건이면 조건을 바꾸라고 알립니다
              <div className="flex min-w-0 flex-1 items-center justify-center rounded-lg border border-table-border bg-background-white">
                <EmptyState type="no-result" onAction={() => setQuery(EMPTY_QUERY)} />
              </div>
            )}
          </div>
        </TabPanel>

        {tabs
          .filter((name) => name !== "검사결과")
          .map((name) => (
            <TabPanel
              key={name}
              value={name}
              current={tab}
              className={
                SCREENS[name]
                  ? "min-h-0 flex-1 overflow-y-auto"
                  : "flex flex-1 items-center justify-center text-sm text-text-subtle"
              }
            >
              {/* 아직 안 만든 화면은 자리만 잡아 둡니다 */}
              {SCREENS[name] ? SCREENS[name]() : `${name} 화면은 아직 없습니다`}
            </TabPanel>
          ))}
      </div>
    </div>
  );
}
