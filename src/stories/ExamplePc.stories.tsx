import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ChartColumn,
  ClipboardList,
  Copy,
  Download,
  EllipsisVertical,
  Mail,
  Pencil,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Trash2,
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { TabItem, TabPanel, Tabs } from "@/components/ui/tabs";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { FormField } from "@/components/ui/form-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardRow } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@/components/ui/table";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, startOfDay } from "@/lib/date";

/* ---------------------------------------------------------------- 자료 */

const PATIENTS = [
  { chart: "2312345", name: "김진영", test: "일반혈액검사", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "생화학검사", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "일반혈액검사", date: "2025-06-04", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "소변검사", date: "2025-06-04", status: "완료", tone: "success" },
  { chart: "2312349", name: "정혜진", test: "면역검사", date: "2025-06-03", status: "진행중", tone: "warning" },
] as const;

const RESULTS = [
  { name: "White Blood Cell (WBC)", value: "6.5", unit: "10³/μL", ref: "4.0 ~ 10.0", flag: null },
  { name: "Hemoglobin", value: "13.2", unit: "g/dL", ref: "12.0 ~ 16.0", flag: null },
  { name: "Platelet Count", value: "245", unit: "10³/μL", ref: "150 ~ 400", flag: null },
  { name: "Fasting Glucose", value: "142", unit: "mg/dL", ref: "70 ~ 100", flag: "H" },
  { name: "Total Cholesterol", value: "188", unit: "mg/dL", ref: "0 ~ 200", flag: null },
] as const;

const MENU = [
  { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
  { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
  { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
  { name: "환경설정", icon: <Settings />, items: [] },
];

type Tab = { id: string; label: string; kind: "list" | "detail"; chart?: string };

/* ---------------------------------------------------------------- 조각 */

/** 상세 머리 — 이름 · 차트번호 · 상태, 우측에 액션. 넘치는 것은 `⋯` 로 묶습니다. */
function DetailHeader({ chart }: { chart: string }) {
  const p = PATIENTS.find((x) => x.chart === chart)!;
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border-gray-light bg-background-white px-6 py-4">
      <h1 className="text-lg font-bold text-text-basic">{p.name}</h1>
      <span className="text-sm text-text-subtle">차트 {p.chart}</span>
      <Badge tone={p.tone} size="sm">
        {p.status}
      </Badge>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Printer />
          인쇄
        </Button>
        <Button variant="outline" size="sm">
          <Download />
          다운로드
        </Button>
        {/* 툴바에 파란 버튼을 두지 않습니다 — 화면의 주 액션과 충돌합니다 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="더 보기">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem leadingIcon={<Pencil />}>결과 수정</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Share2 />}>공유</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="destructive" leadingIcon={<Trash2 />}>
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/** 상세 본문 — Tabs 안에 Card · Table · Accordion 이 함께 놓입니다. */
function Detail({ chart }: { chart: string }) {
  const [tab, setTab] = useState("result");
  const p = PATIENTS.find((x) => x.chart === chart)!;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <DetailHeader chart={chart} />

      <div className="shrink-0 bg-background-white px-6">
        <Tabs value={tab} onValueChange={setTab} label="상세 화면 탭">
          <TabItem value="result" label="검사 결과" count={RESULTS.length} />
          <TabItem value="history" label="이전 이력" count={4} />
          <TabItem value="note" label="판독 소견" />
        </Tabs>
      </div>

      <TabPanel value="result" current={tab} className="flex flex-col gap-4 p-6">
        {/* 한 줄 요약은 Card — 늘 보여야 하는 값이라 접지 않습니다 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody>
              <CardRow label="접수일">{p.date}</CardRow>
              <CardRow label="보고일">{p.date}</CardRow>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardRow label="검사 항목">{p.test}</CardRow>
              <CardRow label="검체">전혈 · EDTA</CardRow>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardRow label="담당의">최원우</CardRow>
              <CardRow label="의뢰기관">서울내과의원</CardRow>
            </CardBody>
          </Card>
        </div>

        <div className="overflow-hidden rounded-lg border border-table-border bg-table-row-surface">
          <TableToolbar title="항목별 결과" count={`총 ${RESULTS.length}건`} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>검사명</TableHead>
                <TableHead align="right">결과</TableHead>
                <TableHead>단위</TableHead>
                <TableHead>참고치</TableHead>
                <TableHead>판정</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESULTS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell align="right">{r.value}</TableCell>
                  <TableCell>{r.unit}</TableCell>
                  <TableCell>{r.ref}</TableCell>
                  <TableCell>
                    {r.flag ? (
                      <Badge tone="danger" size="sm">
                        높음
                      </Badge>
                    ) : (
                      <span className="text-text-subtle">정상</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 가끔 보는 것은 Accordion — 접어두면 표가 화면을 더 씁니다 */}
        <Accordion
          type="multiple"
          className="rounded-lg border border-card-border bg-card-surface"
        >
          <AccordionItem value="ref">
            <AccordionTrigger>참고치 안내</AccordionTrigger>
            <AccordionContent>
              참고치는 검사 방법과 장비에 따라 다를 수 있습니다. 판정은 의료진의 종합적인
              해석이 필요합니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specimen">
            <AccordionTrigger>검체 정보</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1">
                <CardRow label="채취일시">2025-06-05 09:20</CardRow>
                <CardRow label="접수일시">2025-06-05 10:05</CardRow>
                <CardRow label="검체 상태">양호</CardRow>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabPanel>

      <TabPanel value="history" current={tab} className="p-6 text-sm text-text-subtle">
        같은 환자의 지난 검사 결과입니다. 추이를 보려면 통계 화면으로 이동하세요.
      </TabPanel>
      <TabPanel value="note" current={tab} className="p-6">
        <Card className="bg-card-surface-filled">
          공복 혈당이 기준치를 넘습니다. 2주 뒤 재검을 권합니다.
        </Card>
      </TabPanel>
    </div>
  );
}

/** 목록 — 조회 조건 + 표. 행을 누르면 상세 탭이 열립니다. */
function List({ onOpen }: { onOpen: (chart: string) => void }) {
  const today = startOfDay(new Date());
  const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
  const [test, setTest] = useState<string | undefined>("all");
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <FilterBar
        open={open}
        onOpenChange={setOpen}
        summary="2025-06-01 ~ 2025-06-05 · 전체"
        count={PATIENTS.length}
        onReset={() => {}}
        onSearch={() => setOpen(false)}
      >
        <FilterRow>
          <FormField label="기간 선택">
            <DateRangePicker quickSelect value={period} onValueChange={setPeriod} />
          </FormField>
        </FilterRow>
        <FilterRow>
          <FormField label="검사 항목" className="@pc/filter:w-50">
            <Select
              options={[
                { value: "all", label: "전체" },
                { value: "cbc", label: "일반혈액검사" },
                { value: "chem", label: "생화학검사" },
              ]}
              value={test}
              onValueChange={setTest}
            />
          </FormField>
        </FilterRow>
      </FilterBar>

      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-table-border bg-table-row-surface">
          <TableToolbar title="환자 목록" count={`총 ${PATIENTS.length}건`}>
            <Button variant="outline" size="sm">
              <RefreshCw />
              새로고침
            </Button>
          </TableToolbar>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>차트번호</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead>검사명</TableHead>
                <TableHead>보고일</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PATIENTS.map((p) => (
                <TableRow
                  key={p.chart}
                  onClick={() => onOpen(p.chart)}
                  className="cursor-pointer"
                >
                  <TableCell>{p.chart}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.test}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <Badge tone={p.tone} size="sm">
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-text-subtle">행을 누르면 상세 화면이 새 탭으로 열립니다.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 스토리 */

/**
 * **목록에서 행을 눌러 상세로 가는 흐름 전체**입니다. 지금까지 만든 것이 실제 화면에서
 * 어떻게 만나는지 보는 자리라, 부품 하나를 보려면 각 컴포넌트 문서로 가세요.
 *
 * ### 무엇이 여기서 처음 만나나
 *
 * `Tabs` · `Card` · `Accordion` · `DropdownMenu` — 넷이 한 화면에 함께 놓인 적이
 * 없었습니다. Figma 의 「다음 작업」에도 *"상세 화면에서 Card · Accordion · Tabs 가
 * 검증됩니다"* 라고 적혀 있습니다.
 *
 * ### 상세는 MDI 새 탭으로 열립니다
 *
 * 탭바는 **열린 화면 목록**이라, 행을 누르면 환자별로 탭이 하나 생깁니다.
 * 여러 환자를 나란히 놓고 비교하는 일이 실제로 있어서 그렇게 두었습니다.
 *
 * **닫는 탭이 지금 탭이면 옆 탭으로 옮깁니다** — 빈 화면을 보여주지 않습니다.
 * 규칙으로만 적어두고 돌려본 적이 없던 부분이라 여기서 확인합니다.
 * 같은 환자를 다시 누르면 **새로 열지 않고 그 탭으로 갑니다.**
 *
 * ### 접는 것과 안 접는 것
 *
 * | | |
 * |---|---|
 * | 늘 보는 값 (접수일 · 검체 · 담당의) | **`Card`** |
 * | 가끔 보는 값 (참고치 안내 · 검체 상세) | **`Accordion`** |
 *
 * 접힌 내용은 잘 안 봅니다. 표가 화면을 더 쓰게 하려고 접는 것이지,
 * 중요한 값을 숨기려는 게 아닙니다.
 *
 * ### 사이드바를 접었다 펴 보세요
 *
 * 작업 영역이 `--container-pc`(880)를 넘나들면 조회 조건 배치가 바뀝니다 —
 * 창 크기는 그대로인데도요.
 */
const meta = {
  title: "Example/PC 화면",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 목록에서상세로: Story = {
  name: "목록 → 상세",
  render: function Screen() {
    const [collapsed, setCollapsed] = useState(false);
    const [openGroups, setOpenGroups] = useState<string[]>(["검사관리"]);
    const [page, setPage] = useState("검사결과");

    const [tabs, setTabs] = useState<Tab[]>([{ id: "list", label: "검사결과", kind: "list" }]);
    const [tab, setTab] = useState("list");

    const openDetail = (chart: string) => {
      const p = PATIENTS.find((x) => x.chart === chart)!;
      const id = `detail-${chart}`;
      // 같은 환자를 다시 누르면 새로 열지 않고 그 탭으로 갑니다
      setTabs((prev) =>
        prev.some((t) => t.id === id)
          ? prev
          : [...prev, { id, label: `${p.name} (${chart})`, kind: "detail", chart }]
      );
      setTab(id);
    };

    const closeTab = (id: string) => {
      setTabs((prev) => {
        const i = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        // 닫는 탭이 지금 탭이면 옆 탭으로 — 빈 화면을 보여주지 않습니다
        if (tab === id) setTab((next[i] ?? next[i - 1] ?? next[0]).id);
        return next;
      });
    };

    return (
      <div className="flex h-[860px] bg-surface-gray-subtle">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
          onSettings={() => {}}
          onLogout={() => {}}
        >
          {MENU.map((g) =>
            g.items.length === 0 ? (
              <SidebarItem
                key={g.name}
                icon={g.icon}
                label={g.name}
                active={page === g.name}
                chevron={false}
                onClick={() => setPage(g.name)}
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
                    onClick={() => setPage(it)}
                  />
                ))}
              </SidebarGroup>
            )
          )}
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
            {tabs.map((t) => (
              <TabItem
                key={t.id}
                value={t.id}
                label={t.label}
                // 목록은 돌아올 곳이라 닫지 않습니다 — 닫을 수 있는 건 문서 탭뿐입니다
                closable={t.kind === "detail"}
                onClose={() => closeTab(t.id)}
              />
            ))}
          </Tabs>

          {tabs.map((t) => (
            <TabPanel
              key={t.id}
              value={t.id}
              current={tab}
              className="flex min-h-0 flex-1 flex-col"
            >
              {t.kind === "list" ? <List onOpen={openDetail} /> : <Detail chart={t.chart!} />}
            </TabPanel>
          ))}
        </div>
      </div>
    );
  },
};
