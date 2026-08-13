import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, ChartColumn, ClipboardList, Mail, Search, Settings, User } from "lucide-react";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import type { FilterSummaryItem } from "@/components/ui/filter-bar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { MobileListHeader } from "@/components/ui/mobile-list-header";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { TabItem, Tabs } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { DatePreset } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, addMonths, formatDate, startOfDay } from "@/lib/date";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { design, figma } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 **변수**를 모바일 값으로 고정합니다. */
function Phone({ children }: { children: (el: HTMLElement | null) => React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setEl}
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtler"
    >
      <PointerModeProvider mode="touch">{children(el)}</PointerModeProvider>
    </div>
  );
}

/** Figma 데모의 `List Area` → `List` — 회색 바탕 위 흰 라운드 박스(반경 12). */
function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-gray-subtle p-4">
      <div className="rounded-xl bg-card-surface px-4 py-1 [&>*:last-child]:border-b-0">
        {children}
      </div>
    </div>
  );
}

const today = startOfDay(new Date());

/** Figma 데모가 쓰는 빠른 선택 — 기본값(`1일·3일·7일·1개월`)이 아닙니다. */
const DEMO_PRESETS: DatePreset[] = [
  { label: "오늘", range: () => ({ start: today, end: today }) },
  { label: "1주일", range: () => ({ start: addDays(today, -6), end: today }) },
  { label: "1개월", range: () => ({ start: addDays(addMonths(today, -1), 1), end: today }) },
];

const TESTS = [
  { value: "all", label: "전체" },
  { value: "cbc", label: "일반혈액검사" },
  { value: "ua", label: "소변검사" },
  { value: "img", label: "영상의학" },
];

/**
 * 담당자 — **「전체」 항목이 없습니다.** `editable` 은 비어 있는 것이 곧 전체라
 * 자리표시가 그렇게 말하고, 지우기(X)로 언제든 돌아갑니다. 항목으로 두면 쳐서 거를 때
 * 사람 이름들 사이에 섞여 나옵니다.
 */
const OWNERS = ["김검사", "이검사", "박검사", "최검사"].map((v) => ({ value: v, label: v }));

const SORTS = [
  { value: "recv", label: "접수번호순" },
  { value: "name", label: "환자명순" },
  { value: "date", label: "보고일순" },
];

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-01", count: "접수 3건", status: "전체완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-01", count: "접수 5건", status: "전체완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-01", count: "접수 2건", status: "미완료", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "Total Cholesterol", value: "188 mg/dL", date: "2025-06-01", count: "접수 12건", status: "미완료", tone: "danger" },
  { chart: "2312349", name: "정혜진", test: "C-Reactive Protein", value: "0.8 mg/L", date: "2025-06-01", count: "접수 7건", status: "부분완료", tone: "warning" },
] as const;

/**
 * Figma: PCFilterBar (2 변형) · MobileFilterBar (2 변형)
 *
 * 조회 조건 영역입니다. **조회한 뒤에는 접어서 결과에 자리를 내줍니다.**
 *
 * ### Figma 는 둘, 코드는 하나입니다
 *
 * 두 컴포넌트가 **같은 규칙을 두 벌로 적고 있었습니다** — 상태 기계도, "조회하면 접힘" 도,
 * props 11개 중 10개도 같았습니다. 그러면 규칙을 바꿀 때 한쪽만 고쳐도 아무도 모릅니다.
 *
 * 그래서 한 벌로 합치고 **폭에 따라 배치만** 바꿉니다. Figma 가 둘로 그리는 것은
 * 맞습니다 — 그림은 한 폭만 보여줄 수 있으니까요.
 *
 * ### 미디어쿼리가 아니라 컨테이너 쿼리
 *
 * `lg:` 는 **브라우저 창**을 잽니다. 그러면 아래 390 틀 안에서도 창이 넓으면 PC 배치가
 * 나와서 모바일 모습을 볼 수 없습니다 — `.ack-mobile` 은 CSS **변수**만 덮어쓰지
 * 유틸리티 variant 는 못 막기 때문입니다.
 *
 * **자기 폭을 재는 쪽이 실제로도 맞습니다.** 사이드바가 열려 작업 영역이 좁아졌으면
 * 창이 넓어도 접힌 배치가 옳습니다. 경계는 `--container-pc`(880) 하나입니다.
 *
 * ### 좁을 때 ↔ 넓을 때
 *
 * | | 좁을 때 | 넓을 때 |
 * |---|---|---|
 * | 조건 배치 | 세로로 쌓음 | **가로 한 줄** |
 * | 접힌 줄 | 조건 칩이 **줄바꿈** | 조건 칩 + **“조건 변경” 버튼** |
 * | 캡션 | 펼치면 커짐 | 늘 `sm` |
 * | 버튼 | 화면을 반씩 | 우측에 내용 폭만큼 |
 * | 누르는 곳 | **줄 전체** | 버튼만 |
 *
 * ### 접힌 줄 — 조건 하나가 칩 하나 (2026-08-13)
 *
 * `summary` 에 `{ icon, label, value }[]` 를 넘깁니다. `·` 로 이으면 **어디까지가 한
 * 조건인지 눈이 매번 재야 합니다.**
 *
 * | 값이 | 어떻게 | 예 |
 * |---|---|---|
 * | 스스로 말함 | `{ value }` | `2026-07-14 ~ 2026-08-13` · `일반혈액검사` |
 * | **스스로 못 말함** | `{ icon, label, value }` | 담당자 `이검사` · 검색어 `김지훈` |
 *
 * **아이콘을 남발하지 마세요.** 검사항목·상태처럼 쓸 아이콘이 마땅찮은 자리에 억지로
 * 붙이면 **결국 눌러 봐야 알게 되어** 아무것도 없는 것보다 나쁩니다. `label` 은 아이콘과
 * **함께** 넘기세요 — 화면에서는 숨고 보조기술이 읽습니다.
 *
 * **「전체」는 담지 마세요** — 조건을 건 게 아니라 안 건 것이라, 넣으면
 * `전체 · 전체 · …` 가 되어 무엇을 걸었는지가 오히려 안 보입니다.
 *
 * 건수 배지는 **없앴습니다** (2026-08-13). 좁을 때만 나오던 것인데 바로 아래
 * `MobileListHeader` 가 같은 값을 이미 말합니다.
 *
 * ### 기간 입력도 한 벌입니다
 *
 * 아래 두 스토리는 **같은 `<FormField label="기간">
  <DateRangePicker quickSelect/>
</FormField>`** 를 씁니다. 모바일 쪽은 시트로, PC 쪽은
 * 팝오버로 열리는데 **호출부는 아무 판단도 하지 않습니다** — 앱 루트의
 * `PointerModeProvider` 가 정합니다 (손가락이면 시트, 마우스면 팝오버).
 *
 * 이건 폭이 아니라 **포인터**의 문제라 CSS 로는 못 고릅니다. 좁은 데스크톱 창에는
 * 팝오버가, 넓은 태블릿에는 시트가 맞습니다.
 *
 * `Select` · `Combobox` 도 같습니다 — 아래 두 스토리가 같은 컴포넌트를 씁니다.
 *
 * ### 조건의 폭 — 날짜만 반대입니다
 *
 * | | 기본 | 좁히려면 | 채우려면 |
 * |---|---|---|---|
 * | `Input` · `Select` · `Combobox` | **`w-full`** — 부모를 채움 | `FormField` 에 폭 | 그대로 |
 * | `DatePicker` · `DateRangePicker` | **값에 맞는 폭** | 그대로 | 컨트롤에 `w-full` |
 *
 * 날짜만 반대인 이유는 **자릿수가 정해져 있어서**입니다 — `2026-08-11` 은 언제나 같은
 * 길이지만, 검사 항목 목록은 얼마나 긴 이름이 올지 컴포넌트가 알 수 없습니다.
 *
 * ```tsx
 * <FormField label="검사 항목" className="@pc/filter:w-50"><Select … /></FormField>
 * ```
 *
 * - **`@pc/filter:` 를 붙이세요** — 세로로 쌓일 때는 줄을 꽉 채워야 합니다.
 *   안 붙이면 좁은 배치에서도 고정돼 줄이 안 찹니다
 * - **`FormField` 에 줍니다** — 라벨·설명·에러까지 같은 폭이어야 합니다
 * - 값은 **내용을 보고** 정합니다 — `정렬`(`w-42`)이 `검사 항목`(`w-50`)보다 좁은 건
 *   `접수번호순` 이 `일반혈액검사` 보다 짧기 때문입니다
 *
 * ### 그 밖
 *
 * - **조건은 4개까지.** 넘으면 좁을 때는 별도 필터 시트로, 넓을 때는 별도 검색 화면으로
 * - 조건 줄은 `FilterRow` 로 감싸세요 — 좁으면 세로, 넓으면 가로로 알아서 바뀝니다
 */
const meta = {
  title: "Layouts/FilterBar",
  component: FilterBar,
  parameters: { layout: "centered", ...design(figma.pcFilterBar) },
  argTypes: {
    caption: { control: "text" },
    defaultOpen: { control: "boolean" },
    changeLabel: { control: "text" },
    open: { control: false },
    children: { control: false },
    onOpenChange: { control: false },
  },
  args: { summary: "", children: null },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **이 스토리가 이번 변경의 요점입니다.**
 *
 * 위와 아래는 **완전히 같은 `FilterBar` 코드**입니다. 담긴 칸의 폭만 다릅니다 —
 * 위는 390 고정, 아래는 문서 폭 그대로. `--container-pc`(880)를 경계로 갈립니다.
 *
 * **브라우저 창을 좁혀 보세요.** 아래는 창을 따라 접힌 배치로 바뀌지만
 * **위는 계속 모바일 배치**입니다 — 창이 아니라 자기 폭을 재기 때문입니다.
 * 미디어쿼리였다면 둘 다 창을 따라 함께 바뀌었을 것입니다.
 *
 * 안에 든 `DateRangePicker` 는 **`flex-wrap`** 으로 접힙니다 — 입력창 248 + 칩 넷은 한 줄에
 * 460 쯤 필요해서, 그보다 좁으면 칩이 다음 줄로 내려갑니다. 컨테이너 쿼리가 아닌 이유는
 * 그건 폭을 부모에서 받아야만 성립해서 폭 없는 자리에 놓으면 조용히 무너지기 때문입니다.
 */
export const 두폭: Story = {
  name: "같은 코드, 두 폭",
  parameters: { layout: "padded" },
  render: function BothWidths(args) {
    const [a, setA] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [b, setB] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState("all");

    // 「전체」는 조건을 건 게 아니라 안 건 것이라 담지 않습니다
    const summary: FilterSummaryItem[] = [
      { value: `${formatDate(addDays(today, -6))} ~ ${formatDate(today)}` },
    ];

    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-xs text-text-subtle">
            390 — <code>--container-pc</code>(880) 아래라 세로로 쌓입니다
          </p>
          <div className="ack-mobile w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
            <FilterBar {...args} summary={summary}>
              <FilterRow>
                <FormField label="기간 선택">
                  <DateRangePicker quickSelect value={a} onValueChange={setA} presets={DEMO_PRESETS} />
                </FormField>
              </FilterRow>
              <FilterRow>
                <FormField label="검사 항목" className="@pc/filter:w-50">
                  <Select options={TESTS} value={test} onValueChange={setTest} />
                </FormField>
              </FilterRow>
            </FilterBar>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            문서 폭 그대로 — 880 을 넘으면 가로 한 줄 + 우측 버튼. 창을 좁히면 위와 같아집니다
          </p>
          <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-gray-light">
            <FilterBar {...args} summary={summary}>
              <FilterRow>
                <FormField label="기간 선택">
                  <DateRangePicker quickSelect value={b} onValueChange={setB} presets={DEMO_PRESETS} />
                </FormField>
              </FilterRow>
              <FilterRow>
                <FormField label="검사 항목" className="@pc/filter:w-50">
                  <Select options={TESTS} value={test} onValueChange={setTest} />
                </FormField>
              </FilterRow>
            </FilterBar>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Figma 의 Mobile Screen Demo 입니다.
 *
 * 조건 안의 컨트롤은 **PC 스토리와 글자 하나까지 같습니다** — `<FormField label="기간">
  <DateRangePicker quickSelect/>
</FormField>` · `<Select/>`.
 * 390 틀이 `touch` 로 감싸져 있어 시트로 열릴 뿐입니다.
 *
 * 조회를 누르면 접히고, 접힌 줄에 걸린 조건이 칩으로 남습니다.
 */
export const 모바일화면: Story = {
  name: "조회 화면 (Figma 데모)",
  render: function Demo() {
    const [tab, setTab] = useState("results");
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState("all");
    const [searched, setSearched] = useState(true);

    const testLabel = TESTS.find((t) => t.value === test)?.label ?? "전체";
    const rows = searched ? ROWS : [];
    const summary: FilterSummaryItem[] = [];
    if (period.start && period.end)
      summary.push({ value: `${formatDate(period.start)} ~ ${formatDate(period.end)}` });
    // 검사 항목은 값이 스스로 말하므로 아이콘이 없습니다
    if (test !== "all") summary.push({ value: testLabel });

    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <MobileTop
              variant="title"
              title="결과조회"
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

            <FilterBar
              summary={summary.length ? summary : "조건 없음"}
              onSearch={() => setSearched((v) => !v)}
              onReset={() => {
                setPeriod({ start: null, end: null });
                setTest("all");
              }}
            >
              {/*
                PC 스토리와 **같은 `DateRangePicker`** 입니다. 390 틀이 touch 로 감싸져 있어
                시트로 열립니다 — 호출부는 아무 판단도 하지 않습니다
              */}
              <FilterRow>
                <FormField label="기간 선택">
                  <DateRangePicker quickSelect container={el} value={period} onValueChange={setPeriod} presets={DEMO_PRESETS} />
                </FormField>
              </FilterRow>
              {/* 여기도 PC 스토리와 같은 `Select` 입니다 — 시트로 열립니다 */}
              <FilterRow>
                <FormField label="검사 항목">
                  {/* 시트 머리글은 감싸고 있는 FormField 라벨에서 옵니다 */}
                  <Select
                    container={el}
                    options={TESTS}
                    value={test}
                    onValueChange={setTest}
                  />
                </FormField>
              </FilterRow>
            </FilterBar>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListBox>
                <MobileListHeader
                  title="환자리스트"
                  count={`총 ${rows.length}명`}
                  onFilter={() => {}}
                />
                {rows.length ? (
                  rows.map((r) => (
                    <MobileListCard
                      key={r.chart}
                      title={r.name}
                      meta={`차트 ${r.chart} · ${r.date}`}
                      count={r.count}
                      badge={
                        <Badge tone={r.tone} size="sm">
                          {r.status}
                        </Badge>
                      }
                      onClick={() => {}}
                    />
                  ))
                ) : (
                  <EmptyState size="sm" type="no-result" onAction={() => setSearched(true)} />
                )}
              </ListBox>
            </div>

            <MBottomTabBar value={tab} onValueChange={setTab} homeIndicator />
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * **PC 조회 화면이 전부 모였습니다** — `Sidebar` + MDI 탭바 + `FilterBar` + `Table`.
 *
 * **사이드바를 접었다 펴 보세요.** 작업 영역 폭이 `--container-pc`(880)를 넘나들면
 * 조건 배치가 따라 바뀝니다 — 창 크기는 그대로인데도요. 이게 컨테이너 쿼리의 요점입니다.
 *
 * 조회를 누르면 조건이 접히고 표가 약 150px 넓어집니다.
 */
export const PC화면: Story = {
  name: "PC 화면 (전체 조립)",
  parameters: { layout: "fullscreen" },
  render: function Screen(args) {
    const [collapsed, setCollapsed] = useState(false);
    const [tab, setTab] = useState("검사결과");
    const [open, setOpen] = useState([{ value: "검사결과", label: "검사결과" }]);
    const [menuOpen, setMenuOpen] = useState<string[]>(["검사관리"]);
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState("all");
    const [sort, setSort] = useState("recv");

    const groups = [
      { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
      { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
      { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
      { name: "환경설정", icon: <Settings />, items: [] },
    ];

    const openScreen = (name: string) => {
      setOpen((p) => (p.some((t) => t.value === name) ? p : [...p, { value: name, label: name }]));
      setTab(name);
    };
    const close = (val: string) => {
      const i = open.findIndex((t) => t.value === val);
      const rest = open.filter((t) => t.value !== val);
      setOpen(rest);
      if (tab === val && rest.length) setTab(rest[Math.min(i, rest.length - 1)].value);
    };

    const summary: FilterSummaryItem[] = [];
    if (period.start && period.end)
      summary.push({ value: `${formatDate(period.start)} ~ ${formatDate(period.end)}` });
    if (test !== "all") summary.push({ value: TESTS.find((t) => t.value === test)!.label });
    summary.push({ value: SORTS.find((s) => s.value === sort)!.label });

    return (
      <div className="flex h-[700px] bg-surface-gray-subtler">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
          onSettings={() => {}}
          onLogout={() => {}}
        >
          {groups.map((g) => {
            const expanded = menuOpen.includes(g.name);
            const hasChild = g.items.length > 0;
            return (
              <div key={g.name} className="flex flex-col gap-0.5">
                <SidebarItem
                  icon={g.icon}
                  label={g.name}
                  active={g.items.includes(tab) || (!hasChild && tab === g.name)}
                  chevron={hasChild}
                  expanded={expanded}
                  onClick={() =>
                    hasChild
                      ? setMenuOpen((p) =>
                          p.includes(g.name) ? p.filter((x) => x !== g.name) : [...p, g.name]
                        )
                      : openScreen(g.name)
                  }
                />
                {expanded &&
                  g.items.map((it) => (
                    <SidebarItem
                      key={it}
                      level={2}
                      label={it}
                      active={tab === it}
                      onClick={() => openScreen(it)}
                    />
                  ))}
              </div>
            );
          })}
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 탭바는 Content 밖입니다 — 안에 두면 탭을 바꿀 때 자기 자신도 갈립니다 */}
          <Tabs
            value={tab}
            onValueChange={setTab}
            scrollable
            label="열린 화면"
            className="shrink-0 bg-background-white px-2"
          >
            {open.map((t) => (
              <TabItem
                key={t.value}
                value={t.value}
                label={t.label}
                closable
                onClose={() => close(t.value)}
              />
            ))}
          </Tabs>

          <FilterBar
            {...args}
            summary={summary.length ? summary : "조건 없음"}
            onReset={() => {
              setPeriod({ start: null, end: null });
              setTest("all");
              setSort("recv");
            }}
          >
            <FilterRow>
              <FormField label="기간설정">
                <DateRangePicker quickSelect value={period} onValueChange={setPeriod} />
              </FormField>
            </FilterRow>
            <FilterRow>
              <FormField label="검사 항목" className="@pc/filter:w-50">
                <Select options={TESTS} value={test} onValueChange={setTest} />
              </FormField>
              <FormField label="정렬" className="@pc/filter:w-42">
                <Select options={SORTS} value={sort} onValueChange={setSort} />
              </FormField>
            </FilterRow>
          </FilterBar>

          <div className="min-h-0 flex-1 overflow-auto p-6">
            <div className="overflow-hidden rounded-lg border border-table-border bg-background-white">
              <TableToolbar title="환자 리스트" count={`총 ${ROWS.length}건`} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>차트번호</TableHead>
                    <TableHead>환자명</TableHead>
                    <TableHead>검사명</TableHead>
                    <TableHead>결과</TableHead>
                    <TableHead>보고일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r) => (
                    <TableRow key={r.chart}>
                      <TableCell>{r.chart}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.test}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        <Badge tone={r.tone} size="sm">
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 조회를 마친 상태입니다. 넓을 때만 **“조건 변경” 버튼**이 나옵니다 — 마우스는 정확히
 * 겨냥하므로 누를 곳이 눈에 보여야 합니다. 좁을 때는 줄 전체가 누름 대상이라 필요 없습니다.
 *
 * **아이콘 규칙이 여기서 보입니다** — `이검사`(담당자)와 `김지훈`(검색어)은 둘 다 사람
 * 이름이라 값만으로는 구분되지 않습니다. 위 두 칩은 값이 스스로 말하므로 아이콘이 없습니다.
 *
 * 좁은 쪽은 칩이 **다음 줄로 내려가고**, 넓은 쪽은 한 줄에 섭니다.
 *
 * **펼쳐서 값을 바꾸고 조회를 눌러 보세요** — 칩이 따라 바뀝니다. 담당자를 지우면(X)
 * 그 칩이 사라집니다. 요약에 있는 조건은 펼쳤을 때 **반드시 그 자리에 있어야 합니다** —
 * 없으면 어디서 고치는지 찾을 수 없습니다.
 */
export const 접힘: Story = {
  parameters: { layout: "padded" },
  render: function Collapsed(args) {
    /*
      **조건 넷을 값으로 들고 있습니다.** 요약은 그 값에서 계산합니다 —
      펼쳐서 바꾸고 조회를 누르면 칩이 따라 바뀝니다.

      요약에 있는 조건이 펼쳤을 때 없으면 안 됩니다. 접힌 줄은 「지금 뭐가 걸려
      있나」를 말하는 자리라, 없는 조건을 말하면 어디서 고치는지 찾을 수 없습니다.
    */
    const useFilter = () => {
      const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
      const [test, setTest] = useState("cbc");
      const [owner, setOwner] = useState<string[]>(["이검사"]);
      const [keyword, setKeyword] = useState("김지훈");

      const summary: FilterSummaryItem[] = [];
      if (period.start && period.end)
        summary.push({ value: `${formatDate(period.start)} ~ ${formatDate(period.end)}` });
      // 검사 항목은 값이 스스로 말하므로 아이콘이 없습니다
      if (test !== "all") summary.push({ value: TESTS.find((t) => t.value === test)!.label });
      // 담당자와 검색어는 둘 다 사람 이름이라 값만으로는 구분되지 않습니다
      if (owner.length) summary.push({ icon: <User />, label: "담당자", value: owner[0] });
      if (keyword) summary.push({ icon: <Search />, label: "검색어", value: keyword });

      return { period, setPeriod, test, setTest, owner, setOwner, keyword, setKeyword, summary };
    };

    /*
      **컴포넌트가 아니라 함수입니다.** 렌더 안에서 `const Fields = () => …` 로 만들면
      매 렌더마다 새 컴포넌트 타입이 되어 React 가 아래를 통째로 다시 마운트합니다 —
      검색어를 한 글자 칠 때마다 포커스가 빠집니다.
    */
    const fields = (f: ReturnType<typeof useFilter>) => (
      <>
        <FilterRow>
          <FormField label="기간 선택">
            <DateRangePicker
              quickSelect
              value={f.period}
              onValueChange={f.setPeriod}
              presets={DEMO_PRESETS}
            />
          </FormField>
        </FilterRow>
        <FilterRow>
          <FormField label="검사 항목" className="@pc/filter:w-44">
            <Select options={TESTS} value={f.test} onValueChange={f.setTest} />
          </FormField>
          {/* 이름을 알면 쳐서 거르는 편이 빠릅니다 — 비어 있는 것이 곧 「전체」입니다 */}
          <FormField label="담당자" className="@pc/filter:w-36">
            <Combobox
              type="single"
              render="editable"
              options={OWNERS}
              value={f.owner}
              onValueChange={f.setOwner}
              placeholder="전체"
              clearable
            />
          </FormField>
          <FormField label="검색어" className="@pc/filter:w-56">
            <Input
              leadingIcon={<Search />}
              placeholder="환자명 또는 차트번호"
              value={f.keyword}
              onChange={(e) => f.setKeyword(e.target.value)}
              onClear={f.keyword ? () => f.setKeyword("") : undefined}
            />
          </FormField>
        </FilterRow>
      </>
    );

    const narrow = useFilter();
    const wide = useFilter();

    return (
      <div className="flex flex-col gap-6">
        <div className="ack-mobile w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
          <FilterBar {...args} defaultOpen={false} summary={narrow.summary}>
            {fields(narrow)}
          </FilterBar>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-gray-light">
          <FilterBar {...args} defaultOpen={false} summary={wide.summary}>
            {fields(wide)}
          </FilterBar>
        </div>
      </div>
    );
  },
};

/**
 * 조건이 하나뿐이어도 버튼은 그 줄 바닥에 붙습니다.
 *
 * 아직 아무것도 안 건 상태라 요약이 **문자열**입니다 — 칩이 필요 없는 자리와 문서용으로
 * `summary` 는 문자열도 그대로 받습니다.
 */
export const 조건하나: Story = {
  name: "조건 하나",
  parameters: { layout: "padded" },
  render: function NoCount(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-gray-light">
        <FilterBar {...args} summary="조건을 선택해 주세요">
          <FilterRow>
            <FormField label="검사 시행일">
              <DateRangePicker quickSelect value={v} onValueChange={setV} />
            </FormField>
          </FilterRow>
        </FilterBar>
      </div>
    );
  },
};
