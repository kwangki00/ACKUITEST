import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileListHeader } from "@/components/ui/mobile-list-header";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { DateField } from "@/components/ui/date-field";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { Radio } from "@/components/ui/radio";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
import { Bell, Search } from "lucide-react";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
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
      <PointerModeProvider mode="touch">{children(el)}</PointerModeProvider>
    </div>
  );
}

const today = startOfDay(new Date());

/**
 * Figma 데모의 `List Area` → `List` 구조입니다 — 회색 바탕 위에 흰 라운드 박스
 * (`Card/Surface`, 반경 12). **헤더도 박스 안**입니다.
 */
function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-gray-subtle p-4">
      <div className="rounded-xl bg-card-surface px-4 py-1 [&>*:last-child]:border-b-0">
        {children}
      </div>
    </div>
  );
}

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "Total Cholesterol", value: "188 mg/dL", date: "2025-06-04", status: "완료", tone: "success" },
  { chart: "2312349", name: "정혜진", test: "C-Reactive Protein", value: "0.8 mg/L", date: "—", status: "진행중", tone: "warning" },
] as const;

const SORTS = [
  { value: "recv", label: "접수번호순" },
  { value: "name", label: "환자명순" },
  { value: "date", label: "보고일순" },
];

/**
 * Figma: MobileListHeader
 *
 * 카드 목록 위의 머리줄입니다. **제목 · 총 건수 · 정렬/필터 버튼**으로 끝입니다.
 *
 * ### 왜 있어야 하나
 *
 * 카드 목록에는 **표 헤더가 없습니다.** PC 의 `Table` 은 헤더 행이 열 이름을 알려주고
 * 거기서 정렬까지 하지만, `MobileListCard` 를 쌓으면 그 자리가 통째로 없어집니다.
 * 이 줄이 그 자리를 대신합니다 — **무엇의 목록인지 · 몇 건인지 · 어떻게 고를지.**
 *
 * ### 건수는 조회 결과 전체 수
 *
 * `FilterBar` 의 배지와 **같은 값**을 씁니다. 둘이 다르면 어느 쪽이 맞는지
 * 사용자가 판단할 수 없습니다. 화면에 보이는 카드 수가 아닙니다.
 *
 * ### 필터 버튼은 할 일이 있을 때만
 *
 * `onFilter` 를 넘기지 않으면 버튼이 사라집니다 —
 * **눌러도 아무 일이 없는 버튼은 두지 마세요.**
 *
 * ### PC 와 짝
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 제목 · 건수 | `TableToolbar` | **MobileListHeader** |
 * | 열 이름 · 정렬 | 표 헤더 행 | **필터 버튼 → 시트** |
 *
 * ### 그 밖
 *
 * - **스크롤 영역 밖**에 두세요. 목록과 함께 밀려 올라가면 몇 건인지 다시 확인할 수
 *   없습니다 (`MBottomTabBar` · Table 헤더 행과 같은 이유)
 * - 제목은 `base/Bold`, 아래 카드 제목은 `base/SemiBold` — **굵기 한 단계**로 위계를 만듭니다
 */
const meta = {
  title: "Mobile/MobileListHeader",
  component: MobileListHeader,
  parameters: { layout: "centered", ...design(figma.mobileListHeader) },
  argTypes: {
    title: { control: "text" },
    count: { control: "text" },
    filterLabel: { control: "text" },
    actions: { control: false },
    onFilter: { control: false },
  },
  args: { title: "환자리스트", count: "총 979명" },
  decorators: [
    (Story) => (
      <div className="ack-mobile w-[358px] bg-surface-gray-subtle p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: { onFilter: () => {} },
};

/**
 * 정렬·필터가 없는 목록에서는 **버튼을 빼세요.**
 * 건수를 아직 모르는 첫 진입에서는 배지도 뺍니다.
 */
export const 변형: Story = {
  name: "변형",
  render: () => (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1 text-2xs text-text-muted-foreground">전부 — 제목 · 건수 · 필터</p>
        <MobileListHeader title="환자리스트" count="총 979명" onFilter={() => {}} />
      </div>
      <div>
        <p className="mb-1 text-2xs text-text-muted-foreground">필터 없음 — 정렬할 것이 없는 목록</p>
        <MobileListHeader title="환자리스트" count="총 979명" />
      </div>
      <div>
        <p className="mb-1 text-2xs text-text-muted-foreground">건수 없음 — 아직 조회 전</p>
        <MobileListHeader title="환자리스트" onFilter={() => {}} />
      </div>
    </div>
  ),
};

/**
 * **필터 버튼을 눌러 보세요** — 정렬 시트가 열립니다.
 * 카드 목록에는 표 헤더가 없어서 정렬을 여기서 제공합니다.
 *
 * 고르는 즉시 반영되지 않고 **확인을 눌러야** 바뀝니다 —
 * 정렬은 목록 전체가 다시 그려지는 동작이라 되돌릴 여지를 둡니다.
 */
export const 정렬시트: Story = {
  name: "정렬 시트",
  parameters: { layout: "centered" },
  decorators: [],
  render: function WithSheet() {
    const [open, setOpen] = useState(false);
    const [sort, setSort] = useState("recv");
    const [draft, setDraft] = useState(sort);

    const sorted = [...ROWS];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "date") sorted.sort((a, b) => b.date.localeCompare(a.date));

    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ListBox>
              <MobileListHeader
                title="환자리스트"
                count={`총 ${ROWS.length}명`}
                onFilter={() => {
                  setDraft(sort);
                  setOpen(true);
                }}
              />
              {sorted.map((r) => (
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
              </ListBox>
            </div>

            <MobileSheet
              open={open}
              onOpenChange={setOpen}
              container={el}
              title="정렬"
              onConfirm={() => setSort(draft)}
            >
              <ChoiceGroup>
                {SORTS.map((s) => (
                  <Radio
                    key={s.value}
                    name="sort"
                    label={s.label}
                    checked={draft === s.value}
                    onChange={() => setDraft(s.value)}
                  />
                ))}
              </ChoiceGroup>
            </MobileSheet>
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * **모바일 조회 화면이 전부 모였습니다** —
 * `MobileTop` + `FilterBar` + `MobileListHeader` + `MobileListCard` + `MBottomTabBar`.
 *
 * **건수가 두 곳에 나옵니다** — 필터 바의 배지와 이 헤더의 배지. **같은 값**이어야 합니다.
 * 조회를 눌러 결과를 비워 보면 `EmptyState` 로 바뀌고 양쪽 다 0 이 됩니다.
 */
export const 조회화면: Story = {
  name: "조회 화면 (전체 조립)",
  decorators: [],
  render: function FullScreen() {
    const [tab, setTab] = useState("results");
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [empty, setEmpty] = useState(false);
    const rows = empty ? [] : ROWS;

    const summary =
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)} · 전체`
        : "기간을 선택해 주세요";

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
              defaultOpen={false}
              summary={summary}
              count={rows.length}
              // 조회할 때마다 결과가 있고/없고를 번갈아 보여줍니다
              onSearch={() => setEmpty((v) => !v)}
            >
              <FilterRow>
                <DateField
                  container={el}
                  label="기간"
                  value={period}
                  onValueChange={setPeriod}
                />
              </FilterRow>
            </FilterBar>

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
                  ))
                ) : (
                  <EmptyState size="sm" type="no-result" onAction={() => setEmpty(false)} />
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
