import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, Download, EllipsisVertical, Printer, Search, Share2 } from "lucide-react";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MobileListHeader } from "@/components/ui/mobile-list-header";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { FormField } from "@/components/ui/form-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardRow } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, startOfDay } from "@/lib/date";

const PATIENTS = [
  { chart: "2312345", name: "김진영", test: "일반혈액검사", date: "2025-06-05", count: "3건", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "생화학검사", date: "2025-06-05", count: "5건", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "일반혈액검사", date: "2025-06-04", count: "2건", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "소변검사", date: "2025-06-04", count: "4건", status: "완료", tone: "success" },
] as const;

const RESULTS = [
  { name: "White Blood Cell (WBC)", value: "6.5 10³/μL", ref: "4.0 ~ 10.0", high: false },
  { name: "Hemoglobin", value: "13.2 g/dL", ref: "12.0 ~ 16.0", high: false },
  { name: "Fasting Glucose", value: "142 mg/dL", ref: "70 ~ 100", high: true },
] as const;

/* ---------------------------------------------------------------- 화면 */

/** 목록 — 조회 조건은 접어두고 카드로 훑습니다. */
function ListScreen({ onOpen }: { onOpen: (chart: string) => void }) {
  const today = startOfDay(new Date());
  const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
  const [test, setTest] = useState<string | undefined>("all");
  const [open, setOpen] = useState(false);

  return (
    <>
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

      {/* 조회 뒤에는 접힙니다 — 조건은 한 번 정하고 목록을 계속 봅니다 */}
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
          <FormField label="검사 항목">
            <Select
              options={[
                { value: "all", label: "전체" },
                { value: "cbc", label: "일반혈액검사" },
              ]}
              value={test}
              onValueChange={setTest}
            />
          </FormField>
        </FilterRow>
      </FilterBar>

      {/* 카드에는 표 헤더가 없어서 이 줄이 무엇의 목록인지 · 몇 건인지를 대신합니다 */}
      <MobileListHeader title="환자 목록" count={PATIENTS.length} onFilter={() => setOpen(true)} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {PATIENTS.map((p) => (
          <MobileListCard
            key={p.chart}
            title={p.name}
            meta={`차트 ${p.chart} · ${p.test}`}
            count={p.count}
            badge={
              <Badge tone={p.tone} size="sm">
                {p.status}
              </Badge>
            }
            values={[{ label: "보고일", value: p.date }]}
            onClick={() => onOpen(p.chart)}
          />
        ))}
      </div>
    </>
  );
}

/** 상세 — 전체 화면으로 갑니다. 시트가 아니라 다른 화면으로 떠나는 동작입니다. */
function DetailScreen({ chart, onBack }: { chart: string; onBack: () => void }) {
  const p = PATIENTS.find((x) => x.chart === chart)!;

  return (
    <>
      {/*
        back 변형만 타이틀이 절대 배치로 가운데입니다 — 오른쪽 아이콘이 하나 늘어도
        제목이 왼쪽으로 밀리지 않습니다
      */}
      <MobileTop
        variant="back"
        title={p.name}
        onBack={onBack}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MobileTopAction label="더 보기">
                <EllipsisVertical />
              </MobileTopAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem leadingIcon={<Printer />}>인쇄</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Share2 />}>공유</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-border-gray-light bg-background-white px-4 py-3">
          <span className="text-sm text-text-subtle">차트 {p.chart}</span>
          <Badge tone={p.tone} size="sm">
            {p.status}
          </Badge>
        </div>

        {/* 늘 보는 값은 카드 — PC 와 같은 기준입니다 */}
        <div className="p-4">
          <Card>
            <CardBody>
              <CardRow label="검사 항목">{p.test}</CardRow>
              <CardRow label="보고일">{p.date}</CardRow>
              <CardRow label="담당의">최원우</CardRow>
            </CardBody>
          </Card>
        </div>

        {/*
          좁은 화면에서는 표를 넣지 않습니다 — 가로 스크롤이 생기면 무엇을 보는지
          알 수 없습니다. 항목마다 아코디언 한 줄로 펼칩니다
        */}
        <Accordion
          type="multiple"
          size="sm"
          defaultValue={["r0"]}
          className="border-t border-card-border bg-card-surface"
        >
          {RESULTS.map((r, i) => (
            <AccordionItem key={r.name} value={`r${i}`}>
              <AccordionTrigger>
                <span className="flex w-full items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">{r.name}</span>
                  {r.high && (
                    <Badge tone="danger" size="sm">
                      높음
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  <CardRow label="결과">{r.value}</CardRow>
                  <CardRow label="참고치">{r.ref}</CardRow>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 스토리 */

/**
 * **PC 와 같은 흐름을 모바일에서 본 것**입니다. 카드를 누르면 상세로 갑니다.
 *
 * ### 무엇이 갈리나
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 상세로 가는 길 | **MDI 새 탭** | **전체 화면** — 뒤로 가기로 돌아옵니다 |
 * | 목록 | `Table` | `MobileListCard` |
 * | 항목별 결과 | `Table` | **`Accordion`** — 좁은 폭에 표를 넣으면 가로로 밀립니다 |
 * | 넘치는 액션 | 버튼 + `⋯` | `⋯` 하나 |
 *
 * **상세가 시트가 아닌 이유** — 「시트 vs 전체 화면」의 *다른 화면으로 떠남 → 전체 화면*
 * 입니다. 뒤를 보면서 고르는 것(날짜 · 필터)만 시트입니다.
 *
 * ### 같은 코드로 도는 것
 *
 * 조회 조건은 **PC 스토리와 글자 하나까지 같습니다** — `FilterBar` · `DateRangePicker` ·
 * `Select` 그대로입니다. 390 틀이 `mode="touch"` 라 시트로 열릴 뿐입니다.
 *
 * `MobileTop` 의 `⋯` 는 `DropdownMenu` 입니다. 액션이 2개를 넘으면 이렇게 묶습니다 —
 * 58 안에서 44 짜리 탭 영역이 셋 이상이면 타이틀 자리가 사라집니다.
 */
const meta = {
  title: "Example/모바일 화면",
  parameters: {
    layout: "centered",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 목록에서상세로: Story = {
  name: "목록 → 상세",
  render: function Screen() {
    const [chart, setChart] = useState<string | null>(null);
    const [tab, setTab] = useState("results");
    const [frame, setFrame] = useState<HTMLDivElement | null>(null);

    return (
      <PointerModeProvider mode="touch" container={frame}>
        <div
          ref={setFrame}
          style={{ transform: "translateZ(0)" }}
          className="ack-mobile relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
        >
          {chart ? (
            <DetailScreen chart={chart} onBack={() => setChart(null)} />
          ) : (
            <ListScreen onOpen={setChart} />
          )}

          {/* 탭바는 스크롤 영역 밖입니다 — 안에 넣으면 목록과 함께 밀려 올라갑니다 */}
          <MBottomTabBar value={tab} onValueChange={setTab} homeIndicator />
        </div>
      </PointerModeProvider>
    );
  },
};
