import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PCFilterBar, PCFilterRow } from "@/components/ui/pc-filter-bar";
import { DateField } from "@/components/ui/date-field";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
import { ChartColumn, ClipboardList, Mail, Settings } from "lucide-react";
import { design, figma } from "./figma";

const today = startOfDay(new Date());

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
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "Total Cholesterol", value: "188 mg/dL", date: "2025-06-04", status: "완료", tone: "success" },
  { chart: "2312349", name: "정혜진", test: "C-Reactive Protein", value: "0.8 mg/L", date: "—", status: "진행중", tone: "warning" },
] as const;

/**
 * Figma: PCFilterBar (2 변형 — State)
 *
 * PC 조회 조건 영역입니다. **MDI 탭바 바로 아래**에 붙이고, 조회한 뒤에는 접어서
 * 표에 자리를 내줍니다.
 *
 * ### 조회하면 자동으로 접힙니다
 *
 * 조건은 한 번 정하고 **표를 계속 보는** 경우가 대부분입니다.
 * 접으면 **표가 150px 넓어집니다** (펼침 ~200 · 접힘 56). 조회 버튼을 눌러 보세요.
 *
 * ### 모바일과 다른 점
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 조건 배치 | **가로 한 줄** | 세로로 쌓음 |
 * | 접힌 줄 | 요약 + **“조건 변경” 버튼** | 요약 + 건수 배지 |
 * | 캡션 | 늘 `sm/SemiBold` | 펼치면 커집니다 |
 *
 * **접힌 줄에 버튼을 함께 두는 이유** — 화살표만으로는 누를 수 있다는 신호가 약합니다.
 * 모바일은 줄 전체가 누름 대상이라 필요 없지만, PC 는 마우스로 정확히 겨냥하므로
 * 누를 곳을 눈에 보이게 둡니다.
 *
 * ### 버튼은 필드 바닥에 맞춥니다
 *
 * 조회·초기화에는 라벨이 없어 그냥 두면 필드보다 **17px 위로 뜹니다**(라벨 높이).
 * Figma 는 빈 공간을 넣어 맞추지만 코드는 `items-end` 로 붙입니다 —
 * 필드 개수나 줄 수가 바뀌어도 따라옵니다.
 *
 * ### 조건은 4개까지
 *
 * 넘으면 **행을 추가하지 말고 별도 검색 화면**을 검토하세요.
 */
const meta = {
  title: "Layouts/PCFilterBar",
  component: PCFilterBar,
  parameters: { layout: "fullscreen", ...design(figma.pcFilterBar) },
  argTypes: {
    caption: { control: "text" },
    defaultOpen: { control: "boolean" },
    changeLabel: { control: "text" },
    open: { control: false },
    children: { control: false },
    onOpenChange: { control: false },
  },
  args: { summary: "", children: null },
} satisfies Meta<typeof PCFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 조회를 누르면 접히고, 접힌 줄의 **조건 변경**을 누르면 다시 펼쳐집니다. */
export const 기본: Story = {
  render: function Basic(args) {
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState("all");
    const [sort, setSort] = useState("recv");
    const [q, setQ] = useState("");

    const summary = [
      period.start && period.end ? `${formatDate(period.start)} ~ ${formatDate(period.end)}` : null,
      TESTS.find((t) => t.value === test)?.label,
      SORTS.find((s) => s.value === sort)?.label,
      q || null,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <div className="min-h-[400px] bg-surface-gray-subtle">
        <PCFilterBar
          {...args}
          summary={summary}
          onReset={() => {
            setPeriod({ start: null, end: null });
            setTest("all");
            setSort("recv");
            setQ("");
          }}
        >
          {/* 기간은 넓어서 자기 줄을 씁니다 — 빠른 선택 칩이 옆에 붙습니다 */}
          <PCFilterRow>
            <DateField label="기간설정" value={period} onValueChange={setPeriod} />
          </PCFilterRow>

          <PCFilterRow>
            <FormField label="검색" className="w-70">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="성명 또는 차트번호"
              />
            </FormField>
            <FormField label="검사 항목" className="w-50">
              <Select options={TESTS} value={test} onValueChange={setTest} />
            </FormField>
            <FormField label="정렬" className="w-42">
              <Select options={SORTS} value={sort} onValueChange={setSort} />
            </FormField>
          </PCFilterRow>
        </PCFilterBar>

        <p className="p-6 text-sm text-text-subtle">여기부터 표가 들어옵니다.</p>
      </div>
    );
  },
};

/** 조회를 마친 상태입니다. **요약 한 줄과 조건 변경 버튼만** 남고 표가 화면을 씁니다. */
export const 접힘: Story = {
  render: function Collapsed(args) {
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    return (
      <div className="min-h-[400px] bg-surface-gray-subtle">
        <PCFilterBar
          {...args}
          defaultOpen={false}
          summary={`${formatDate(addDays(today, -6))} ~ ${formatDate(today)} · 발주일 · 전체 · 접수번호순`}
        >
          <PCFilterRow>
            <DateField label="기간설정" value={period} onValueChange={setPeriod} />
          </PCFilterRow>
        </PCFilterBar>
        <p className="p-6 text-sm text-text-subtle">
          접힌 만큼 표가 넓어집니다 — 펼침 ~200 · 접힘 56.
        </p>
      </div>
    );
  },
};

/**
 * 조건이 **기간 하나뿐**인 화면입니다. 버튼은 여전히 그 줄 바닥에 붙습니다 —
 * `items-end` 라 줄이 몇 개든 마지막 줄에 맞습니다.
 */
export const 조건하나: Story = {
  name: "조건 하나",
  render: function One(args) {
    const [period, setPeriod] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="min-h-[300px] bg-surface-gray-subtle">
        <PCFilterBar {...args} summary="조건을 선택해 주세요">
          <PCFilterRow>
            <DateField label="검사 시행일" value={period} onValueChange={setPeriod} />
          </PCFilterRow>
        </PCFilterBar>
      </div>
    );
  },
};

/**
 * **PC 조회 화면이 전부 모였습니다** — `Sidebar` + MDI 탭바 + `PCFilterBar` + `Table`.
 *
 * CLAUDE.md 의 화면 구조 그대로입니다:
 *
 * ```
 * Screen
 * ├ Sidebar 256          접으면 72
 * └ Workspace
 *    ├ MDI TabBar        열린 화면 목록
 *    └ Content
 *       ├ PCFilterBar    조회 후 접힘
 *       └ Body           표
 * ```
 *
 * **조회를 눌러 조건이 접히면 표가 그만큼 넓어집니다.** 사이드바도 접어 보세요.
 */
export const PC화면: Story = {
  name: "PC 화면 (전체 조립)",
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

    const summary = `${period.start && period.end ? `${formatDate(period.start)} ~ ${formatDate(period.end)}` : "전체 기간"} · ${
      TESTS.find((t) => t.value === test)?.label
    } · ${SORTS.find((s) => s.value === sort)?.label}`;

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

          <PCFilterBar
            {...args}
            summary={summary}
            onReset={() => {
              setPeriod({ start: null, end: null });
              setTest("all");
              setSort("recv");
            }}
          >
            <PCFilterRow>
              <DateField label="기간설정" value={period} onValueChange={setPeriod} />
            </PCFilterRow>
            <PCFilterRow>
              <FormField label="검사 항목" className="w-50">
                <Select options={TESTS} value={test} onValueChange={setTest} />
              </FormField>
              <FormField label="정렬" className="w-42">
                <Select options={SORTS} value={sort} onValueChange={setSort} />
              </FormField>
            </PCFilterRow>
          </PCFilterBar>

          {/* 조건이 접히면 이 영역이 넓어집니다 */}
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
