import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DateRangePicker,
  DateRangePickerPanel,
  DateRangeTabs,
  DEFAULT_PRESETS,
} from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import type { DatePreset } from "@/components/ui/date-range-picker";
import { addDays, addMonths, formatDate, startOfDay } from "@/lib/date";
import { design, figma } from "./figma";

const today = startOfDay(new Date());
const week = (): DateRange => ({ start: addDays(today, -6), end: today });

/** 화면마다 자주 쓰는 기간이 다르니 갈아끼웁니다 — 기본은 `1일·3일·7일·1개월`. */
const DEMO_PRESETS: DatePreset[] = [
  { label: "오늘", range: () => ({ start: today, end: today }) },
  { label: "1주일", range: () => ({ start: addDays(today, -6), end: today }) },
  { label: "1개월", range: () => ({ start: addDays(addMonths(today, -1), 1), end: today }) },
];

/**
 * Figma: DatePickerPanel — Mode=Range · Confirm=True · Precision=Day
 *
 * 기간을 고릅니다. 조회 조건에서 가장 많이 쓰는 형태입니다.
 *
 * ### 두 달을 나란히 보여줍니다
 *
 * 시작일이 안 보이면 범위를 고르기 어렵습니다. 한 달만 보여주면
 * 7월 말에서 8월 초를 고를 때 시작을 기억으로만 붙잡고 있어야 합니다.
 *
 * 두 달은 **늘 이웃합니다** — 왼쪽을 바꾸면 오른쪽이, 오른쪽을 바꾸면 왼쪽이 따라옵니다.
 * 따로 놀게 두면 7월과 11월이 나란히 놓여 사이가 비어 보입니다.
 *
 * **최신 달이 오른쪽입니다.** 조회 기간은 대개 오늘에서 거슬러 올라가는데, 이번 달을
 * 왼쪽에 두면 오른쪽은 아직 오지 않은 달이라 **화면의 절반이 고를 일 없는 자리**로
 * 남습니다. 값이 있으면 종료를 오른쪽에 둡니다 — 기간의 최신 끝이 거기입니다.
 * 시작만 있는 값(고르다 만 것)은 옮기지 않습니다: 종료를 앞으로 골라야 하니까요.
 *
 * ### 고르는 흐름
 *
 * | | |
 * |---|---|
 * | 시작을 고름 | 자동으로 종료 탭으로 넘어갑니다 |
 * | 마우스를 움직임 | **어디까지 잡힐지 미리 보여줍니다** — 눌러 보고 되돌릴 필요가 없습니다 |
 * | 시작보다 앞을 고름 | 그쪽이 시작이 됩니다. 되돌리라고 하는 것보다 낫습니다 |
 * | 둘 다 고른 뒤 탭을 누름 | 그쪽을 다시 고릅니다 (Figma 의 Edit-Start · Edit-End). **그 날짜가 보이는 곳까지 달력이 따라가고** 커서도 거기 놓입니다 |
 * | 다 고른 뒤 달력을 누름 | 새 범위를 시작합니다 |
 *
 * 시작을 다시 골랐는데 **종료보다 늦으면** 종료를 비우고 이어서 다시 고르게 합니다 —
 * 뒤집힌 범위를 남겨두면 무엇이 잘못됐는지 알기 어렵습니다.
 *
 * ### 확인 버튼이 있습니다
 *
 * 두 날짜를 골라야 하니 중간에 잘못 눌러도 되돌릴 수 있어야 합니다.
 * 단일(`DatePicker`)은 반대로 버튼이 없습니다 — 한 번 누르면 끝나는데
 * 버튼을 또 누르게 하면 번거롭습니다.
 *
 * ### 빠른 선택이 주인공입니다
 *
 * **달력을 만지지 않고 끝나는 경로**입니다. 조회 화면에서는 이것만으로 끝나는 경우가
 * 많아서 항상 열어둡니다. 기간은 오늘을 포함해 셉니다 — "3일" 은 그저께부터 오늘까지입니다.
 *
 * ### 입력창도 직접 칩니다
 *
 * 숫자 **16자리**를 이어 치면 됩니다. 구분자는 저절로 붙습니다.
 *
 * | 친 것 | 보이는 것 |
 * |---|---|
 * | `20260107` | `2026-01-07` — 여기서 시작이 정해집니다 |
 * | `2026010720260415` | `2026-01-07 ~ 2026-04-15` — 종료까지 |
 *
 * 뒤집어 쳐도 바로잡습니다. 열여섯 자리를 못 채우고 나가면 되돌립니다 —
 * 반쪽 기간을 남겨두면 조회 조건이 무엇인지 설명되지 않습니다.
 *
 * 위·아래로는 **커서가 놓인 칸만** 오르내립니다 (시작 년/월/일, 종료 년/월/일 여섯 칸).
 * 시작은 종료를 넘지 못하고 종료는 시작보다 앞서지 못합니다.
 */
/*
  2026-08-10 까지는 `DateRangePicker` 가 라벨 + 입력창 + 칩을 한 묶음으로 들고 있었습니다.
  칩이 이 컴포넌트 안으로 들어오면서 호출부에서는 컨트롤이 하나가 되어, 라벨은 다른
  컨트롤과 똑같이 `FormField` 가 답니다 — 그 스토리들도 여기로 옮겼습니다.
*/
const meta = {
  title: "Controls/DateRangePicker",
  component: DateRangePicker,
  parameters: { layout: "padded", ...design(figma.datePickerPanel) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    precision: { control: "inline-radio", options: ["day", "month", "year"] },
    value: { control: false },
    min: { control: false },
    max: { control: false },
    presets: { control: false },
    quickSelect: { control: "boolean" },
    overlay: { control: "inline-radio", options: [undefined, "popover", "sheet"] },
    container: { control: false },
    onValueChange: { control: false },
  },
  // value 가 필수 prop 이라 meta 에 있어야 스토리마다 args 를 쓰지 않아도 됩니다.
  // 각 스토리는 useState 로 덮어씁니다
  args: {
    size: "default",
    state: "default",
    value: { start: null, end: null },
    onValueChange: () => {},
  },
  decorators: [(S) => <div className="w-72">{S()}</div>],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<DateRange>({
      start: addDays(today, -6),
      end: today,
    });
    return (
      <div className="flex flex-col gap-2">
        <DateRangePicker {...args} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-muted-foreground">
          {v.start && v.end ? `${formatDate(v.start)} ~ ${formatDate(v.end)}` : "(기간 없음)"}
        </p>
      </div>
    );
  },
};

/** 값이 없으면 무엇을 고르는 자리인지 알려줍니다. */
export const 빈값: Story = {
  name: "빈 값",
  render: function Empty(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return <DateRangePicker {...args} value={v} onValueChange={setV} />;
  },
};

/**
 * 패널만 따로 본 모습입니다. 눌러 보면서 흐름을 확인하세요 —
 * 시작을 고르면 종료 탭으로 넘어가고, 마우스를 움직이면 잡힐 범위가 미리 보입니다.
 */
export const 패널: Story = {
  decorators: [],
  render: function Panel() {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex flex-col items-start gap-3">
        <DateRangePickerPanel
          value={v}
          onConfirm={setV}
          onCancel={() => {}}
          presets={DEFAULT_PRESETS}
        />
        <p className="text-2xs text-text-muted-foreground">
          확정된 값:{" "}
          {v.start && v.end ? `${formatDate(v.start)} ~ ${formatDate(v.end)}` : "(없음)"}
        </p>
      </div>
    );
  },
};

/**
 * Figma 의 `Step` 축 다섯입니다. 코드에서는 축을 따로 두지 않고
 * **값 유무 × 편집 중** 으로 계산합니다 — 같은 것을 두 번 적어두면 한쪽만 고쳐집니다.
 *
 * 색은 셋뿐입니다 — 고르는 중(파란 틴트 + 파란 테두리) / 값 있고 쉬는 중(진한 글자) /
 * 값 없음(흐린 글자).
 */
export const 탭단계: Story = {
  name: "탭 단계",
  decorators: [],
  render: () => {
    const cases: { step: string; range: DateRange; editing: "start" | "end" | null }[] = [
      { step: "Start", range: { start: null, end: null }, editing: "start" },
      { step: "End", range: { start: addDays(today, -6), end: null }, editing: "end" },
      { step: "Complete", range: { start: addDays(today, -6), end: today }, editing: null },
      { step: "Edit-Start", range: { start: addDays(today, -6), end: today }, editing: "start" },
      { step: "Edit-End", range: { start: addDays(today, -6), end: today }, editing: "end" },
    ];
    return (
      <div className="flex w-[420px] flex-col gap-3">
        {cases.map((c) => (
          <div key={c.step}>
            <p className="mb-1.5 text-xs text-text-subtle">{c.step}</p>
            <DateRangeTabs range={c.range} editing={c.editing} onEditingChange={() => {}} />
          </div>
        ))}
      </div>
    );
  },
};

/** `min` · `max` 밖은 고를 수 없습니다. 빠른 선택도 그 범위를 넘지 않게 갈아끼우세요. */
export const 범위제한: Story = {
  name: "범위 제한",
  render: function Ranged(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-text-subtle">최근 30일 안에서만</p>
        <DateRangePicker
          {...args}
          value={v}
          onValueChange={setV}
          min={addDays(today, -30)}
          max={today}
        />
      </div>
    );
  },
};

/** 라벨·에러가 필요하면 `FormField` 로 감쌉니다. */
export const State: Story = {
  render: function St(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    const error = v.start == null ? "조회 기간을 선택해 주세요." : undefined;
    return (
      <FormField label="조회 기간" required error={error}>
        <DateRangePicker
          {...args}
          state={error ? "error" : "default"}
          value={v}
          onValueChange={setV}
        />
      </FormField>
    );
  },
};


/**
 * 범위도 `Precision` 을 탑니다. 통계 화면의 **월별 · 연별 조회**가 여기입니다.
 *
 * **종료는 그 단위의 마지막 날**입니다 — 2026년 8월을 종료로 고르면 `2026-08-31`.
 * 1일로 두면 8월 2일부터가 조용히 빠져서, 화면은 8월까지라는데 자료는 하루만 나옵니다.
 *
 * 날짜는 두 달을 나란히 보여주지만 **월·연은 하나면 됩니다** —
 * 월 그리드 하나에 열두 달이 다 들어 있어서 둘을 놓으면 같은 해가 두 번 나옵니다.
 */
export const 월연범위: Story = {
  name: "월 · 연 범위",
  decorators: [],
  render: function PrecisionRange() {
    const [m, setM] = useState<DateRange>({ start: null, end: null });
    const [y, setY] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex flex-col gap-4">
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">precision=&quot;month&quot;</p>
          <DateRangePicker precision="month" value={m} onValueChange={setM} />
          <p className="mt-1.5 text-2xs text-text-muted-foreground">
            {m.start && m.end ? `${formatDate(m.start)} ~ ${formatDate(m.end)}` : "(없음)"}
          </p>
        </div>
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">precision=&quot;year&quot;</p>
          <DateRangePicker precision="year" value={y} onValueChange={setY} />
          <p className="mt-1.5 text-2xs text-text-muted-foreground">
            {y.start && y.end ? `${formatDate(y.start)} ~ ${formatDate(y.end)}` : "(없음)"}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * 화면마다 자주 쓰는 기간이 다릅니다. `presets` 로 갈아끼우고,
 * 정해진 묶음이 없으면 **`quickSelect` 를 끄세요** (생년월일 · 검사 시행일).
 */
export const 빠른선택: Story = {
  name: "빠른 선택 바꾸기",
  render: function Presets(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>({ start: null, end: null });
    return (
      /*
        **`w-fit` 을 쓰지 않습니다.** `DateRangePicker` 의 뿌리가 `flex-wrap` 이라
        `w-fit` 아래에서는 **가장 넓은 항목(입력창)** 폭으로 줄어듭니다 —
        그러면 칩이 갈 자리가 없어 다음 줄로 내려갑니다.
        여기는 빠른 선택 목록을 보여주는 자리라 폭은 넉넉히 두고 상한만 겁니다.
        폭 자체를 다루는 것은 「폭 — 부모가 정합니다」 스토리입니다.
      */
      <div className="flex max-w-160 flex-col gap-5">
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            화면 전용 목록 — <code>오늘 · 1주일 · 1개월</code>
          </p>
          <FormField label="기간">
            <DateRangePicker quickSelect {...args} presets={DEMO_PRESETS} value={a} onValueChange={setA} />
          </FormField>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            <code>quickSelect</code> 끔 — 입력창만
          </p>
          <FormField label="검사 시행일">
            <DateRangePicker {...args} value={b} onValueChange={setB} />
          </FormField>
        </div>
      </div>
    );
  },
};

/**
 * **같은 코드가 두 가지로 열립니다.** 왼쪽은 마우스, 오른쪽은 손가락 —
 * 앱 루트의 `PointerModeProvider` 가 정합니다.
 *
 * 여기서는 보여주려고 스토리가 직접 감쌌습니다. 실제 앱에서는 루트에 한 번만 둡니다.
 */
export const 오버레이: Story = {
  name: "팝오버 · 시트",
  render: function Overlay(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>(week());
    // 시트를 390 틀 안에 가둡니다 — 안 넘기면 document.body 로 나가 브라우저 창을 덮습니다
    const [frame, setFrame] = useState<HTMLDivElement | null>(null);
    return (
      <div className="flex flex-wrap items-start gap-8">
        <div>
          <p className="mb-2 text-xs text-text-subtle">마우스 — 팝오버가 트리거에 붙습니다</p>
          <PointerModeProvider mode="mouse">
            <div className="w-fit">
              <FormField label="기간">
                <DateRangePicker quickSelect {...args} value={a} onValueChange={setA} />
              </FormField>
            </div>
          </PointerModeProvider>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-subtle">
            손가락 — 시트가 아래에서 올라옵니다 (390 틀)
          </p>
          {/* 틀을 Provider 에 한 번만 알려주면 그 안의 시트가 전부 따라옵니다 */}
          <PointerModeProvider mode="touch" container={frame}>
            <div
              ref={setFrame}
              style={{ transform: "translateZ(0)" }}
              className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtler p-4"
            >
              <FormField label="기간">
                <DateRangePicker quickSelect {...args} value={b} onValueChange={setB} />
              </FormField>
            </div>
          </PointerModeProvider>
        </div>
      </div>
    );
  },
};

/**
 * **컴포넌트가 기본 폭을 갖습니다** — `day` **248** · `month` **204** · `year` **156**.
 * 조회 화면이 대부분이라 좁은 자리를 기본으로 둡니다. 칸을 채워야 하면
 * `className="w-full"` 한 줄입니다 (`Controls/DatePicker` 의 「폭」 스토리 참고).
 *
 * ### `quickSelect` 여도 폭은 그대로입니다
 *
 * 남는 자리는 **칩이 먹습니다.** 입력창을 늘리면 값의 길이는 그대로인데 오른쪽만 비어
 * 보이지만, 칩은 원래 균등 분할이라 넓어져도 자연스럽습니다.
 *
 * 가로 한 줄일 때는 이 묶음이 내용 폭이라 남는 자리가 **아예 없어** 칩도 그대로이고,
 * 세로로 쌓일 때만(`FilterBar` 의 좁은 배치) 칩이 늘어나 **옆 줄과 폭이 맞습니다.**
 */
export const 폭: Story = {
  name: "폭 — 부모가 정합니다",
  render: function Widths(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>(week());
    const [c, setC] = useState<DateRange>(week());
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            flex 항목 (<code>w-fit</code>) — 내용만큼 ≈460
          </p>
          <div className="w-fit">
            <FormField label="기간">
              <DateRangePicker quickSelect {...args} value={a} onValueChange={setA} />
            </FormField>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">360 — 칩이 다음 줄로, 각 줄이 꽉 참</p>
          <div className="w-90">
            <FormField label="기간">
              <DateRangePicker quickSelect {...args} value={b} onValueChange={setB} />
            </FormField>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            720 — 한 줄에 들어가므로 입력창은 256 그대로
          </p>
          <div className="w-180">
            <FormField label="기간">
              <DateRangePicker quickSelect {...args} value={c} onValueChange={setC} />
            </FormField>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 다른 조건과 나란히 놓은 모습입니다. **기간은 넓어서 자기 줄**을 씁니다.
 * 에러·설명은 `FormField` 가 받습니다 — 다른 컨트롤과 같습니다. 컨트롤에는 `state="error"` 만 줍니다.
 */
export const 조건줄: Story = {
  name: "다른 조건과 나란히",
  render: function InRow(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <FormField label="기간">
            <DateRangePicker quickSelect {...args} value={a} onValueChange={setA} />
          </FormField>
          <FormField label="검색" className="w-56">
            <Input placeholder="성명 또는 차트번호" />
          </FormField>
        </div>
        {/* 설명·에러가 붙어도 칩은 입력창과 같은 줄에 남습니다 */}
        <div className="flex flex-wrap items-start gap-4">
          <FormField label="기간" required description="최대 3개월까지 조회할 수 있습니다">
            <DateRangePicker quickSelect {...args} value={b} onValueChange={setB} />
          </FormField>
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <FormField label="기간" error="기간을 선택해 주세요">
            <DateRangePicker quickSelect {...args} state="error" value={b} onValueChange={setB} />
          </FormField>
        </div>
      </div>
    );
  },
};
