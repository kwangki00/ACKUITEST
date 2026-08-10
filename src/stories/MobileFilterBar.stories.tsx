import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { MobileFilterBar } from "@/components/ui/mobile-filter-bar";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { MobileSelect } from "@/components/ui/mobile-select";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { MobileListHeader } from "@/components/ui/mobile-list-header";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { DatePreset } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, addMonths, formatDate, startOfDay } from "@/lib/date";
import { design, figma } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 변수를 모바일 값으로 고정합니다. */
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

const today = startOfDay(new Date());

/**
 * Figma 데모의 `List Area` → `List` 구조입니다.
 *
 * 목록이 **한 겹 더 싸여 있습니다** — 회색 바탕 위에 흰 라운드 박스(`Card/Surface`,
 * 반경 12)를 얹고 그 안에 헤더와 카드를 넣습니다. 카드가 화면 끝까지 닿지 않아
 * “목록이 하나의 덩어리” 로 읽힙니다.
 *
 * **헤더도 박스 안**입니다 — 밖에 두면 제목만 떠 있는 것처럼 보입니다.
 */
function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-gray-subtle p-4">
      {/* 마지막 카드의 구분선은 지웁니다 — 박스 모서리가 이미 목록의 끝을 말합니다 */}
      <div className="rounded-xl bg-card-surface px-4 py-1 [&>*:last-child]:border-b-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Figma 데모 화면이 쓰는 빠른 선택입니다 — 기본값(`1일·3일·7일·1개월`)이 아니라
 * **`오늘 · 1주일 · 1개월`**. 화면마다 자주 쓰는 기간이 다르니 갈아끼우라고
 * `presets` 가 열려 있습니다.
 */
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

/** Figma 데모의 환자 리스트 — 값 대신 **접수 건수**를 씁니다. */
const ROWS = [
  { chart: "2312345", name: "김진영", date: "2025-06-01", count: "접수 3건", status: "전체완료", tone: "success" },
  { chart: "2312346", name: "이수정", date: "2025-06-01", count: "접수 5건", status: "전체완료", tone: "success" },
  { chart: "2312347", name: "박상철", date: "2025-06-01", count: "접수 2건", status: "미완료", tone: "danger" },
  { chart: "2312348", name: "최민영", date: "2025-06-01", count: "접수 12건", status: "미완료", tone: "danger" },
  { chart: "2312349", name: "정혜진", date: "2025-06-01", count: "접수 7건", status: "부분완료", tone: "warning" },
  { chart: "2312350", name: "한도윤", date: "2025-05-31", count: "접수 1건", status: "전체완료", tone: "success" },
] as const;

/**
 * Figma: MobileFilterBar (2 변형 — State)
 *
 * 모바일 조회 조건 영역입니다. **조회한 뒤에는 접어서 목록에 자리를 내줍니다.**
 *
 * ### 조회하면 자동으로 접힙니다
 *
 * 조건은 한 번 정하고 **목록을 계속 보는** 경우가 대부분입니다.
 * 펼친 채로 두면 작은 화면에서 목록이 몇 줄 안 보입니다. 조회 버튼을 눌러 보세요.
 *
 * ### 요약과 건수는 접혔을 때만
 *
 * 펼치면 아래 입력 필드에 **같은 정보가 있어 중복**이고, 조건을 바꾸는 중에
 * 이전 결과 수가 남아 있으면 혼란스럽습니다.
 *
 * 요약은 걸린 조건을 `·` 로 이어 씁니다.
 *
 * ### 캡션이 상태에 따라 커집니다
 *
 * 펼치면 `base/SemiBold`(영역의 머리), 접히면 `xs`(요약이 주인공).
 *
 * ### 조건은 4개까지
 *
 * 넘으면 **별도 필터 시트로 옮기세요** — 접힌 줄의 요약이 길어져 못 읽습니다.
 *
 * ### PC 와 짝
 *
 * PC 는 `PCFilterBar` 로 탭 바로 아래에 붙입니다. 규칙은 같고 배치만 다릅니다 —
 * PC 는 가로 한 줄, 접힌 줄에 “조건 변경” 버튼이 함께 있습니다.
 */
const meta = {
  title: "Mobile/MobileFilterBar",
  component: MobileFilterBar,
  parameters: { layout: "centered", ...design(figma.mobileFilterBar) },
  argTypes: {
    count: { control: "number" },
    caption: { control: "text" },
    defaultOpen: { control: "boolean" },
    open: { control: false },
    children: { control: false },
  },
  args: { summary: "", children: null },
} satisfies Meta<typeof MobileFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Figma 의 Mobile Screen Demo 를 그대로 옮긴 화면입니다.**
 *
 * 상단 바 · 조회 조건 · 목록 헤더 · 카드 목록 · 하단 탭바가 다 놓여 있습니다.
 *
 * 확인해 볼 것:
 * - **조회를 누르면 필터가 접히고** 목록이 다섯 줄쯤 더 보입니다
 * - 접힌 줄의 요약과 건수는 **접혔을 때만** 나옵니다
 * - 빠른 선택이 데모용 **`오늘 · 1주일 · 1개월`** 입니다 (기본은 `1일·3일·7일·1개월`)
 * - 달력에서 임의 기간을 고르면 **칩 선택이 풀립니다** — 칩은 거짓말을 하면 안 됩니다
 * - 필터 바의 건수와 목록 헤더의 건수는 **같은 값**입니다
 * - 목록은 **흰 라운드 박스 한 겹**에 싸여 있습니다 (`Card/Surface` · 반경 12).
 *   헤더도 그 안입니다 — 밖에 두면 제목만 떠 있는 것처럼 보입니다
 */
export const 데모화면: Story = {
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

            <MobileFilterBar
              caption="조회 조건"
              summary={summary}
              count={rows.length}
              // 눌러 볼 수 있게 조회할 때마다 결과 있고/없고를 번갈아 보여줍니다
              onSearch={() => setSearched((v) => !v)}
              onReset={() => {
                setPeriod({ start: null, end: null });
                setTest(["all"]);
              }}
            >
              <MobileDateField
                container={el}
                label="기간 선택"
                value={period}
                onValueChange={setPeriod}
                presets={DEMO_PRESETS}
              />
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
            </MobileFilterBar>

            {/* 목록 전체가 흰 라운드 박스 안에 들어갑니다 — 헤더도 함께 */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListBox>
                <MobileListHeader
                  title="환자리스트"
                  // 필터 바의 배지와 같은 값입니다
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
 * 필터 바만 떼어 본 것입니다. 조회를 누르면 접히고, 접힌 줄을 누르면 다시 펼쳐집니다.
 */
export const 기본: Story = {
  render: function Basic(args) {
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [test, setTest] = useState<string[]>(["all"]);

    const label = TESTS.find((t) => t.value === test[0])?.label ?? "전체";
    const summary =
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)} · ${label}`
        : label;

    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <MobileFilterBar {...args} summary={summary} count={ROWS.length}>
              <MobileDateField
                container={el}
                label="기간 선택"
                value={period}
                onValueChange={setPeriod}
                presets={DEMO_PRESETS}
              />
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
            </MobileFilterBar>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListBox>
                {ROWS.slice(0, 4).map((r) => (
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
                ))}
              </ListBox>
            </div>
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * 조회를 마친 상태입니다. **요약 한 줄과 건수만** 남고 목록이 화면을 씁니다.
 * 줄을 누르면 다시 펼쳐집니다.
 */
export const 접힘: Story = {
  render: function Collapsed(args) {
    const [test, setTest] = useState<string[]>(["cbc"]);
    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <MobileFilterBar
              {...args}
              defaultOpen={false}
              summary={`${formatDate(addDays(today, -6))} ~ ${formatDate(today)} · 발주일 · 일반혈액검사`}
              count={128}
            >
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
            </MobileFilterBar>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListBox>
                <MobileListHeader title="환자리스트" count="총 128명" onFilter={() => {}} />
                {ROWS.map((r) => (
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
                ))}
              </ListBox>
            </div>
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * 건수를 넘기지 않으면 배지가 없습니다.
 * 조회 결과 수를 아직 모르는 화면(첫 진입)에서는 빼세요.
 */
export const 건수없음: Story = {
  name: "건수 없음",
  render: function NoCount(args) {
    const [period, setPeriod] = useState<DateRange>({ start: null, end: null });
    return (
      <Phone>
        {(el) => (
          <MobileFilterBar {...args} defaultOpen={false} summary="조건을 선택해 주세요">
            <MobileDateField
              container={el}
              label="기간 선택"
              value={period}
              onValueChange={setPeriod}
              presets={DEMO_PRESETS}
            />
          </MobileFilterBar>
        )}
      </Phone>
    );
  },
};
