import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DateField } from "@/components/ui/date-field";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import type { DatePreset } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
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
 * Figma: PCDateField (3 변형 — Precision) · MobileDateField (3 변형)
 *
 * 조회 조건의 **기간 입력 한 묶음**입니다 — 라벨 + 입력창 + 빠른 선택.
 * 기간을 받는 자리에서는 `DateRangePicker` 를 직접 쓰지 말고 **이걸 쓰세요.**
 *
 * ### 왜 한 묶음인가
 *
 * 입력창과 칩이 **같은 값을 봐야** 합니다.
 *
 * | | |
 * |---|---|
 * | 칩을 누름 | 입력창 값이 채워집니다 |
 * | 달력에서 임의 기간을 고름 | **칩 선택이 풀립니다** |
 *
 * 7일을 눌러둔 채로 달력에서 3월을 고르면 화면이 "최근 7일" 이라 말하면서 3월을
 * 조회하게 됩니다. **칩은 값과 어긋나면 안 됩니다.**
 *
 * 이 동기화 때문에 이 컴포넌트만 **라벨까지 안고 있습니다**(`FormField` 를 안에서
 * 씁니다). 컨트롤이 하나뿐인 `Select` · `Input` 은 호출부가 `FormField` 로 감쌉니다.
 *
 * ### 빠른 선택이 주인공입니다
 *
 * 조회 화면에서 가장 많이 하는 일이 "최근 N일" 이라, **달력을 열지 않고 끝나는
 * 경로**를 앞에 둡니다. 기간은 오늘을 포함해 셉니다 — "3일" 은 그저께~오늘.
 *
 * **"전체" 는 넣지 않습니다** — 나머지가 전부 기간인데 혼자만 조건을 지우는 동작이라
 * 같은 줄에서 무엇을 고르는 자리인지 흐려집니다. 비우는 일은 입력창의 지우기(X)가 맡습니다.
 *
 * ### PC·모바일이 한 벌입니다
 *
 * 앱 루트의 `PointerModeProvider` 가 정합니다 — **손가락이면 시트, 마우스면 팝오버.**
 * 호출부는 `<DateField/>` 하나만 쓰고 아무 판단도 하지 않습니다.
 *
 * 이건 폭이 아니라 **포인터**의 문제입니다. 좁은 데스크톱 창에는 팝오버가,
 * 넓은 태블릿에는 시트가 맞습니다.
 *
 * ### 폭은 부모가 정합니다
 *
 * `Input` 과 같은 규칙 — 고정하지 않습니다. flex 항목이면 내용만큼(≈460),
 * `flex-col` 안이면 부모 폭을 채웁니다. 자리가 모자라면 칩이 다음 줄로 내려가고
 * **각 줄이 폭을 꽉 채웁니다.**
 */
const meta = {
  title: "Controls/DateField",
  component: DateField,
  parameters: { layout: "padded", ...design(figma.pcDateField) },
  argTypes: {
    label: { control: "text" },
    required: { control: "boolean" },
    description: { control: "text" },
    error: { control: "text" },
    precision: { control: "inline-radio", options: ["day", "month", "year"] },
    overlay: { control: "inline-radio", options: [undefined, "popover", "sheet"] },
    disabled: { control: "boolean" },
    value: { control: false },
    presets: { control: false },
    onValueChange: { control: false },
    container: { control: false },
  },
  args: { label: "조회 기간", value: { start: null, end: null }, onValueChange: () => {} },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 칩을 눌러 보고, 그다음 달력에서 아무 날이나 골라 보세요 —
 * **칩 선택이 풀립니다.** 칩과 값이 어긋나지 않게 하는 규칙입니다.
 */
export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<DateRange>(week());
    return (
      <div className="flex w-fit flex-col gap-3">
        <DateField {...args} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-muted-foreground">
          {v.start && v.end ? `${formatDate(v.start)} ~ ${formatDate(v.end)}` : "(기간 없음)"}
        </p>
      </div>
    );
  },
};

/**
 * **빠른 선택은 고르는 단위를 따라갑니다.** 월 화면에 "3일" 이 붙어 있으면 눌러도
 * 월 하나로 뭉개져 무엇을 고른 것인지 설명되지 않습니다.
 *
 * 값은 그 단위의 **첫 날**이고 종료는 **마지막 날**입니다 — 8월을 종료로 고르면
 * 8월 31일. 1일로 두면 8월 2일부터가 조용히 빠집니다.
 */
export const 단위: Story = {
  render: function Precision(args) {
    const [d, setD] = useState<DateRange>(week());
    const [m, setM] = useState<DateRange>({ start: null, end: null });
    const [y, setY] = useState<DateRange>({ start: null, end: null });
    const rows = [
      ["day", "일 — 1일 · 3일 · 7일 · 1개월", d, setD],
      ["month", "월 — 1개월 · 3개월 · 6개월 · 1년", m, setM],
      ["year", "연 — 1년 · 3년 · 5년", y, setY],
    ] as const;

    return (
      <div className="flex w-fit flex-col gap-5">
        {rows.map(([p, desc, val, set]) => (
          <div key={p}>
            <p className="mb-1.5 text-xs text-text-subtle">{desc}</p>
            <DateField
              {...args}
              precision={p}
              label={p === "day" ? "조회 기간" : p === "month" ? "통계 기간" : "연도"}
              value={val}
              onValueChange={set}
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 화면마다 자주 쓰는 기간이 다릅니다. `presets` 로 갈아끼우고,
 * 정해진 묶음이 없으면 **`presets={false}`** 로 끄세요 (생년월일 · 검사 시행일).
 */
export const 빠른선택: Story = {
  name: "빠른 선택 바꾸기",
  render: function Presets(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex w-fit flex-col gap-5">
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            화면 전용 목록 — <code>오늘 · 1주일 · 1개월</code>
          </p>
          <DateField {...args} presets={DEMO_PRESETS} value={a} onValueChange={setA} />
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            <code>presets={"{false}"}</code> — 입력창만
          </p>
          <DateField {...args} label="검사 시행일" presets={false} value={b} onValueChange={setB} />
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
    return (
      <div className="flex flex-wrap items-start gap-8">
        <div>
          <p className="mb-2 text-xs text-text-subtle">마우스 — 팝오버가 트리거에 붙습니다</p>
          <PointerModeProvider mode="mouse">
            <div className="w-fit">
              <DateField {...args} value={a} onValueChange={setA} />
            </div>
          </PointerModeProvider>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-subtle">
            손가락 — 시트가 아래에서 올라옵니다 (390 틀)
          </p>
          <PointerModeProvider mode="touch">
            <div
              style={{ transform: "translateZ(0)" }}
              className="ack-mobile relative h-[560px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle p-4"
            >
              <DateField {...args} value={b} onValueChange={setB} />
            </div>
          </PointerModeProvider>
        </div>
      </div>
    );
  },
};

/**
 * 폭을 고정하지 않습니다 (`Input` 과 같은 규칙).
 *
 * 자리가 모자라면 칩이 다음 줄로 내려가고 **각 줄이 꽉 찹니다** —
 * 입력창을 256 으로 박아두면 좁은 화면에서 오른쪽이 남습니다.
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
            <DateField {...args} value={a} onValueChange={setA} />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">360 — 칩이 다음 줄로, 각 줄이 꽉 참</p>
          <div className="w-90">
            <DateField {...args} value={b} onValueChange={setB} />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-text-subtle">
            720 — 한 줄에 들어가므로 입력창은 256 그대로
          </p>
          <div className="w-180">
            <DateField {...args} value={c} onValueChange={setC} />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 다른 조건과 나란히 놓은 모습입니다. **기간은 넓어서 자기 줄**을 씁니다.
 * 에러·설명은 `DateField` 가 직접 받습니다 — 안에서 `FormField` 를 쓰기 때문입니다.
 */
export const 조건줄: Story = {
  name: "다른 조건과 나란히",
  render: function InRow(args) {
    const [a, setA] = useState<DateRange>(week());
    const [b, setB] = useState<DateRange>({ start: null, end: null });
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <DateField {...args} value={a} onValueChange={setA} />
          <FormField label="검색" className="w-56">
            <Input placeholder="성명 또는 차트번호" />
          </FormField>
        </div>
        {/* 설명·에러가 붙어도 칩은 입력창과 같은 줄에 남습니다 */}
        <div className="flex flex-wrap items-start gap-4">
          <DateField
            {...args}
            required
            description="최대 3개월까지 조회할 수 있습니다"
            value={b}
            onValueChange={setB}
          />
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <DateField {...args} error="기간을 선택해 주세요" value={b} onValueChange={setB} />
        </div>
      </div>
    );
  },
};
