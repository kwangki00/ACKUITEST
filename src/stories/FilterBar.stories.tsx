import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, ChartColumn, ClipboardList, Mail, Search, Settings } from "lucide-react";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { DateField } from "@/components/ui/date-field";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { Select } from "@/components/ui/select";
import { MobileSelect } from "@/components/ui/mobile-select";
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
import { design, figma } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 **변수**를 모바일 값으로 고정합니다. */
function Phone({ children }: { children: (el: HTMLElement | null) => React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setEl}
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
    >
      {children(el)}
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
 * | 접힌 줄 | 요약 + **건수 배지** | 요약 + **“조건 변경” 버튼** |
 * | 캡션 | 펼치면 커짐 | 늘 `sm/SemiBold` |
 * | 버튼 | 화면을 반씩 | 우측에 내용 폭만큼 |
 * | 누르는 곳 | **줄 전체** | 버튼만 |
 *
 * ### 껍데기는 한 벌, 안에 넣는 컨트롤은 아직 갈립니다
 *
 * 시트로 열지 팝오버로 열지는 **CSS 로 고를 수 없습니다.** 좁은 화면은
 * `MobileDateField` · `MobileSelect`, 넓은 화면은 `DateField` · `Select` 를 넣으세요.
 * 자리를 정하는 껍데기만 한 벌이 됐습니다.
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
    count: { control: "number" },
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
 * 안에 든 `DateField` 도 같은 방식으로 **스스로 쌓입니다** — 입력창 256 + 칩 넷은
 * 한 줄에 512 쯤 필요해서, 그보다 좁으면 칩이 아래로 내려가 폭을 나눠 가집니다.
 */
export const 두폭: Story = {
  name: "같은 코드, 두 폭",
  parameters: { layout: "padded" },
  render: function BothWidths(args) {
    const [a, setA] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [b, setB] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState("all");

    const summary = `${formatDate(addDays(today, -6))} ~ ${formatDate(today)} · 발주일 · 전체`;

    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-xs text-text-subtle">
            390 — <code>--container-pc</code>(880) 아래라 세로로 쌓입니다
          </p>
          <div className="ack-mobile w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
            <FilterBar {...args} summary={summary} count={ROWS.length}>
              <FilterRow>
                <DateField label="기간 선택" value={a} onValueChange={setA} presets={DEMO_PRESETS} />
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
            <FilterBar {...args} summary={summary} count={ROWS.length}>
              <FilterRow>
                <DateField label="기간 선택" value={b} onValueChange={setB} presets={DEMO_PRESETS} />
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
 * Figma 의 Mobile Screen Demo 입니다. 조건 안에는 **시트로 여는 컨트롤**을 넣었습니다
 * (`MobileDateField` · `MobileSelect`) — 껍데기는 같아도 이건 CSS 로 못 고릅니다.
 *
 * 조회를 누르면 접히고, 접힌 줄에 요약과 건수 배지가 나옵니다.
 */
export const 모바일화면: Story = {
  name: "조회 화면 (Figma 데모)",
  render: function Demo() {
    const [tab, setTab] = useState("results");
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState<string[]>(["all"]);
    const [searched, setSearched] = useState(true);

    const testLabel = TESTS.find((t) => t.value === test[0])?.label ?? "전체";
    const rows = searched ? ROWS : [];
    const summary =
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)} · 발주일 · ${testLabel}`
        : testLabel;

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
              summary={summary}
              count={rows.length}
              onSearch={() => setSearched((v) => !v)}
              onReset={() => {
                setPeriod({ start: null, end: null });
                setTest(["all"]);
              }}
            >
              <FilterRow>
                <MobileDateField
                  container={el}
                  label="기간 선택"
                  value={period}
                  onValueChange={setPeriod}
                  presets={DEMO_PRESETS}
                />
              </FilterRow>
              <FilterRow>
                <FormField label="검사 항목">
                  <MobileSelect
                    container={el}
                    title="검사 항목"
                    options={TESTS}
                    value={test}
                    onValueChange={setTest}
                    searchable={false}
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

    const summary = `${
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)}`
        : "전체 기간"
    } · ${TESTS.find((t) => t.value === test)?.label} · ${SORTS.find((s) => s.value === sort)?.label}`;

    return (
      <div className="flex h-[700px] bg-surface-gray-subtle">
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
            size="sm"
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
            summary={summary}
            onReset={() => {
              setPeriod({ start: null, end: null });
              setTest("all");
              setSort("recv");
            }}
          >
            <FilterRow>
              <DateField label="기간설정" value={period} onValueChange={setPeriod} />
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
 * 조회를 마친 상태입니다. 좁을 때는 **건수 배지**, 넓을 때는 **“조건 변경” 버튼**이
 * 나옵니다 — 마우스는 정확히 겨냥하므로 누를 곳이 눈에 보여야 합니다.
 */
export const 접힘: Story = {
  parameters: { layout: "padded" },
  render: function Collapsed(args) {
    const [a, setA] = useState<DateRange>({ start: null, end: null });
    const [b, setB] = useState<DateRange>({ start: null, end: null });
    const summary = `${formatDate(addDays(today, -6))} ~ ${formatDate(today)} · 발주일 · 일반혈액검사`;

    return (
      <div className="flex flex-col gap-6">
        <div className="ack-mobile w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
          <FilterBar {...args} defaultOpen={false} summary={summary} count={128}>
            <FilterRow>
              <DateField label="기간 선택" value={a} onValueChange={setA} />
            </FilterRow>
          </FilterBar>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-gray-light">
          <FilterBar {...args} defaultOpen={false} summary={summary} count={128}>
            <FilterRow>
              <DateField label="기간 선택" value={b} onValueChange={setB} />
            </FilterRow>
          </FilterBar>
        </div>
      </div>
    );
  },
};

/**
 * 건수를 넘기지 않으면 배지가 없습니다 — 조회 전이라 결과 수를 아직 모르는 화면.
 * 조건이 하나뿐이어도 버튼은 그 줄 바닥에 붙습니다.
 */
export const 건수없음: Story = {
  name: "건수 없음 · 조건 하나",
  parameters: { layout: "padded" },
  render: function NoCount(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-gray-light">
        <FilterBar {...args} summary="조건을 선택해 주세요">
          <FilterRow>
            <DateField label="검사 시행일" value={v} onValueChange={setV} />
          </FilterRow>
        </FilterBar>
      </div>
    );
  },
};
