import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileFilterBar } from "@/components/ui/mobile-filter-bar";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { MobileSelect } from "@/components/ui/mobile-select";
import { FormField } from "@/components/ui/form-field";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
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

const TESTS = [
  { value: "all", label: "전체" },
  { value: "cbc", label: "일반혈액검사" },
  { value: "ua", label: "소변검사" },
  { value: "img", label: "영상의학" },
];

const ROWS = [
  { name: "김진영", chart: "2312345", test: "White Blood Cell", date: "2025-06-05" },
  { name: "이수정", chart: "2312346", test: "Hemoglobin", date: "2025-06-05" },
  { name: "박상철", chart: "2312347", test: "Fasting Glucose", date: "2025-06-04" },
  { name: "최민영", chart: "2312348", test: "Total Cholesterol", date: "2025-06-04" },
];

/**
 * Figma: MobileFilterBar (2 변형 — State 2)
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
 * ### 조건은 4개까지
 *
 * 넘으면 **별도 필터 시트로 옮기세요** — 접힌 줄의 요약이 길어져 못 읽습니다.
 *
 * ### PC 와 짝
 *
 * PC 는 `PCFilterBar` 로 탭 바로 아래에 붙이고 조회 후 접으면 표가 150px 넓어집니다.
 * 규칙은 같고 배치만 다릅니다.
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
 * 실제 화면 조각입니다 — 필터 바 아래에 목록이 이어집니다.
 * **조회를 누르면 접히고 목록이 넓어집니다.**
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
                label="기간"
                value={period}
                onValueChange={setPeriod}
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

            {/* 조건을 접으면 이 목록이 넓어집니다 */}
            <div className="flex-1 overflow-y-auto">
              {ROWS.map((r) => (
                <div
                  key={r.chart}
                  className="border-b border-divider-gray-light bg-background-white px-4 py-3"
                >
                  <p className="text-sm font-medium text-text-basic">
                    {r.name} <span className="text-text-subtle">· {r.chart}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-text-subtle">
                    {r.test} · {r.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * 조회를 마친 상태입니다. 요약 한 줄과 건수만 남고 목록이 화면을 씁니다.
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
              summary={`${formatDate(addDays(today, -6))} ~ ${formatDate(today)} · 일반혈액검사`}
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

            <div className="flex-1 overflow-y-auto">
              {ROWS.map((r) => (
                <div
                  key={r.chart}
                  className="border-b border-divider-gray-light bg-background-white px-4 py-3"
                >
                  <p className="text-sm font-medium text-text-basic">
                    {r.name} <span className="text-text-subtle">· {r.chart}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-text-subtle">
                    {r.test} · {r.date}
                  </p>
                </div>
              ))}
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
              label="기간"
              value={period}
              onValueChange={setPeriod}
            />
          </MobileFilterBar>
        )}
      </Phone>
    );
  },
};
