import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { FilterBar, FilterRow } from "@/components/ui/filter-bar";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
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

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "Total Cholesterol", value: "188 mg/dL", date: "2025-06-04", status: "완료", tone: "success" },
  { chart: "2312349", name: "정혜진", test: "C-Reactive Protein", value: "0.8 mg/L", date: "—", status: "진행중", tone: "warning" },
] as const;

/**
 * Figma: MobileListCard (3 변형 — State 3)
 *
 * 모바일에서 **표를 대체하는 카드**입니다. 행 하나가 카드 하나가 됩니다.
 *
 * ### 표마다 열이 다른데 어떻게 하나
 *
 * 카드는 **내용을 정하지 않고 자리만** 정합니다. 어느 열을 어디에 넣을지는 쓰는 쪽이 고릅니다.
 *
 * | 자리 | 몇 개 | 무엇을 넣나 |
 * |---|---|---|
 * | `title` | **1개** | 목록에서 찾는 기준 — 환자명·검사명 |
 * | `meta` | **한 줄** | 나머지 식별 정보를 `·` 로 이어 씁니다 |
 * | `count` | 1개 | 건수. 굵게 강조합니다 |
 * | `badge` 또는 `status` | **1개** | 상태 |
 * | `values` | **2개까지** | 목록에서 값까지 봐야 할 때만 |
 *
 * **그 이상은 상세 화면으로 미루세요.** 카드가 길어지면 한 화면에 몇 건 안 보여서
 * 목록의 뜻이 없어집니다. 그래서 `values` 는 **타입이 3개를 막습니다.**
 *
 * ### 점과 배지는 둘 중 하나
 *
 * 같은 정보를 두 번 말하는 셈입니다. 상태가 **2종이면 점, 3종 이상이면 배지** —
 * `Badge` 의 규칙과 같고, 여기서도 타입이 둘 다 넣는 것을 막습니다.
 *
 * ### 목록으로 보이게 쌓으세요
 *
 * 흰 배경 + 하단 구분선입니다. **간격 0 으로 붙이세요** — 사이를 띄우면
 * 카드가 낱개로 흩어져 보이고, 표를 옮긴 것이라는 감각이 사라집니다.
 */
const meta = {
  title: "Mobile/MobileListCard",
  component: MobileListCard,
  parameters: { layout: "centered", ...design(figma.mobileListCard) },
  argTypes: {
    selectable: { control: "boolean" },
    chevron: { control: "boolean" },
    values: { control: false },
    badge: { control: false },
    onClick: { control: false },
  },
  args: { title: "김진영" },
} satisfies Meta<typeof MobileListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 표 5행을 카드 5장으로 옮긴 것입니다. 값 두 개까지 함께 보여줍니다. */
export const 기본: Story = {
  render: () => (
    <Phone>
      {() => (
        <div className="flex flex-col">
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
      )}
    </Phone>
  ),
};

/**
 * 상태가 **2종뿐이면 점**으로 충분합니다 — 배지는 자리를 많이 먹습니다.
 * 3종 이상이면 배지를 쓰세요. 둘 다 켜는 것은 타입이 막습니다.
 */
export const 점표시: Story = {
  name: "점 표시 (상태 2종)",
  render: () => (
    <Phone>
      {() => (
        <div className="flex flex-col">
          {ROWS.slice(0, 4).map((r) => (
            <MobileListCard
              key={r.chart}
              title={r.name}
              meta={`차트 ${r.chart} · ${r.test} · ${r.date}`}
              status={r.tone === "success" ? "success" : "danger"}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </Phone>
  ),
};

/** 값이 필요 없으면 제목 + 한 줄이면 됩니다. 한 화면에 훨씬 많이 들어갑니다. */
export const 간단히: Story = {
  render: () => (
    <Phone>
      {() => (
        <div className="flex flex-col">
          {ROWS.map((r) => (
            <MobileListCard
              key={r.chart}
              title={r.test}
              meta={`${r.name} · 차트 ${r.chart}`}
              count={r.date === "—" ? undefined : r.value}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </Phone>
  ),
};

/**
 * 다중 선택은 **선택 모드에서만** 켭니다.
 * 평소에 체크박스가 보이면 누를 것이 둘이 되어 어느 쪽이 상세로 가는지 흐려집니다.
 */
export const 선택모드: Story = {
  name: "선택 모드",
  render: function Selectable() {
    const [mode, setMode] = useState(false);
    const [sel, setSel] = useState<string[]>([]);
    const toggle = (c: string) =>
      setSel((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

    return (
      <Phone>
        {() => (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border-gray-light bg-background-white px-4 py-3">
              <span className="text-sm font-medium text-text-basic">
                {mode ? `${sel.length}건 선택됨` : "검사이력"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMode(!mode);
                  setSel([]);
                }}
              >
                {mode ? "취소" : "선택"}
              </Button>
            </div>

            <div className="flex flex-col">
              {ROWS.map((r) => (
                <MobileListCard
                  key={r.chart}
                  title={r.name}
                  meta={`차트 ${r.chart} · ${r.test}`}
                  status={r.tone === "success" ? "success" : "danger"}
                  selectable={mode}
                  selected={sel.includes(r.chart)}
                  onSelectedChange={() => toggle(r.chart)}
                  chevron={!mode}
                  onClick={mode ? () => toggle(r.chart) : () => {}}
                />
              ))}
            </div>
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * 조회 조건 + 목록이 한 화면에 놓인 모습입니다 — **모바일 조회 화면이 완성됩니다.**
 *
 * 조회를 누르면 필터가 접히고 목록이 넓어집니다.
 */
export const 조회화면: Story = {
  name: "조회 화면 (전체 조립)",
  render: function FullScreen() {
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const summary =
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)} · 전체`
        : "기간을 선택해 주세요";

    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <FilterBar defaultOpen={false} summary={summary} count={ROWS.length}>
              <FilterRow>
                <MobileDateField
                  container={el}
                  label="기간"
                  value={period}
                  onValueChange={setPeriod}
                />
              </FilterRow>
            </FilterBar>

            <div className="flex-1 overflow-y-auto">
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
          </div>
        )}
      </Phone>
    );
  },
};
