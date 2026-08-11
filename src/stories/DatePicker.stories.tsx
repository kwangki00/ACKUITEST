import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarMonth } from "@/components/ui/calendar";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { addDays, addMonths, formatDate, startOfDay, startOfMonth } from "@/lib/date";
import { design, figma } from "./figma";

/**
 * Figma: DatePickerPanel — Mode=Single · Confirm=False · Precision=Day
 *
 * 입력창 + 달력 패널입니다. 완성형(`DatePicker`)은 **Figma 에 대응물이 없습니다** —
 * `Select` 와 같은 사정으로, Figma 는 패널만 정의하고 트리거는 `Input` 을 씁니다.
 *
 * ### 타이핑이 먼저입니다
 *
 * 입력창을 직접 칠 수 있습니다. **아는 날짜는 치는 편이 빠릅니다** —
 * 2025년 3월을 달력으로 가려면 년·월을 두 번 고르지만, `20250314` 는 한 번에 끝납니다.
 * 달력은 "언제쯤" 을 고를 때 쓰는 것이고, 아는 날짜에는 방해가 됩니다.
 *
 * **숫자만 칩니다. 하이픈은 저절로 붙습니다.**
 *
 * | 친 것 | 보이는 것 |
 * |---|---|
 * | `2022` | `2022` |
 * | `202212` | `2022-12` |
 * | `20221212` | `2022-12-12` — 여기서 값이 정해집니다 |
 *
 * 하이픈은 표시일 뿐 상태가 아니라, 그 위에서 Backspace 를 눌러도 멈추지 않고
 * 앞의 숫자가 지워집니다. `2022-12-12` 를 붙여넣어도 숫자만 걸러 같은 결과가 됩니다.
 *
 * **여덟 자리를 채우기 전에는 값이 바뀌지 않습니다** — `2022` 만 쳤는데
 * 2022-01-01 로 잡아버리면 다 치기도 전에 조회 조건이 달라집니다.
 * 다 못 채웠거나 없는 날짜(`20220231`)면 포커스를 벗어날 때 되돌립니다.
 *
 * ### 지우기는 달력 버튼 왼쪽입니다
 *
 * `Input` 기본 자리(가장 바깥)에 두면 값이 있을 때만 나타나면서 **달력 버튼을 안쪽으로 밀어냅니다.**
 * 늘 같은 자리에 있어야 할 것이 값 유무에 따라 움직이면 손이 헛돕니다.
 *
 * ### 키보드 — 입력창
 *
 * 위·아래로 **커서가 놓인 칸만** 오르내립니다.
 *
 * | 커서 자리 | ↑ ↓ |
 * |---|---|
 * | `2022`-12-12 | 년 ±1 |
 * | 2022-`12`-12 | 월 ±1 |
 * | 2022-12-`12` | 일 ±1 |
 *
 * 오르내린 칸은 선택된 채로 남아 연달아 누를 수 있습니다.
 * 값이 아직 없으면 오늘부터 시작합니다 — 빈 칸에서 눌렀는데 아무 일도 없으면
 * 무엇을 해야 할지 알 수 없습니다.
 *
 * **말일은 잘립니다.** 1월 31일에서 월을 올리면 3월 3일이 아니라 2월 28일이고,
 * 2월 29일에서 년을 올리면 2월 28일입니다.
 *
 * ### 키보드 — 달력
 *
 * | 키 | 동작 |
 * |---|---|
 * | 방향키 | 하루씩 |
 * | PageUp · PageDown | 한 달씩 |
 * | Home · End | 그 주의 처음 · 끝 |
 * | Enter · Space | 고르기 |
 *
 * 그리드 전체가 **탭 정지 하나**입니다. 칸마다 멈추면 다음 요소로 가는 데 42번을 눌러야 합니다.
 *
 * ### 단위를 바꾸려면
 *
 * `precision="month"` · `"year"` 로 달력 대신 3×4 그리드가 뜹니다.
 * 범위는 `DateRangePicker` 입니다.
 */
const meta = {
  title: "Controls/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded", ...design(figma.datePickerPanel) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    placeholder: { control: "text" },
    precision: { control: "inline-radio", options: ["day", "month", "year"] },
    value: { control: false },
    min: { control: false },
    max: { control: false },
    onValueChange: { control: false },
  },
  args: { size: "default", state: "default", onValueChange: () => {} },
  decorators: [(S) => <div className="w-56">{S()}</div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<Date | null>(startOfDay(new Date()));
    return <DatePicker {...args} value={v} onValueChange={setV} />;
  },
};

/** 값이 없으면 형식을 알려줍니다 — 무엇을 쳐야 하는지 모르면 달력만 쓰게 됩니다. */
export const 빈값: Story = {
  name: "빈 값",
  render: function Empty(args) {
    const [v, setV] = useState<Date | null>(null);
    return <DatePicker {...args} value={v} onValueChange={setV} />;
  },
};

/**
 * `min` · `max` 밖은 고를 수 없습니다. 경계는 포함입니다.
 * 타이핑으로도 넘어가지 못합니다 — 달력만 막으면 입력창이 뒷문이 됩니다.
 */
export const 범위제한: Story = {
  name: "범위 제한",
  decorators: [],
  render: function Ranged(args) {
    const today = startOfDay(new Date());
    const [v, setV] = useState<Date | null>(today);
    return (
      <div className="flex flex-col gap-3">
        <div className="w-56">
          <p className="mb-1.5 text-xs text-text-subtle">오늘부터 30일 뒤까지</p>
          <DatePicker
            {...args}
            value={v}
            onValueChange={setV}
            min={today}
            max={addDays(today, 30)}
          />
        </div>
        <p className="text-2xs text-text-muted-foreground">
          고른 값: {v ? formatDate(v) : "(없음)"}
        </p>
      </div>
    );
  },
};

/** 라벨·에러가 필요하면 `FormField` 로 감쌉니다. 상태 축은 Input 과 같습니다. */
export const State: Story = {
  decorators: [],
  render: function St(args) {
    const [v, setV] = useState<Date | null>(null);
    const error = v == null ? "검사일을 선택해 주세요." : undefined;
    return (
      <div className="flex flex-col gap-4">
        <div className="w-56">
          <FormField label="검사일" required error={error}>
            <DatePicker
              {...args}
              state={error ? "error" : "default"}
              value={v}
              onValueChange={setV}
            />
          </FormField>
        </div>
        {(["readonly", "disabled"] as const).map((s) => (
          <div key={s} className="w-56">
            <p className="mb-1.5 text-xs text-text-subtle">{s}</p>
            <DatePicker
              {...args}
              state={s}
              disabled={s === "disabled"}
              readOnly={s === "readonly"}
              value={startOfDay(new Date())}
              onValueChange={() => {}}
            />
          </div>
        ))}
      </div>
    );
  },
};

/** 높이는 Input · Button 과 같은 `--h-input-*` 입니다. */
export const Size: Story = {
  decorators: [],
  render: function S(args) {
    const [v, setV] = useState<Date | null>(startOfDay(new Date()));
    return (
      <div className="flex flex-col gap-4">
        {(["sm", "default", "lg"] as const).map((z) => (
          <div key={z} className="w-56">
            <p className="mb-1.5 text-xs text-text-subtle">{z}</p>
            <DatePicker {...args} size={z} value={v} onValueChange={setV} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 패널을 안 거치고 달력만 쓰는 경우입니다 — 화면에 늘 펼쳐두는 조회 조건 등.
 *
 * **그리드는 6주 고정**입니다. 필요한 주만 그리면 달을 넘길 때마다 높이가 36px 씩
 * 들썩이고, 팝오버 안에서는 아래 버튼이 손가락 밑에서 움직입니다.
 * 8월과 2월을 번갈아 눌러 보세요 — 높이가 그대로입니다.
 */
export const 달력만: Story = {
  name: "달력만",
  decorators: [],
  render: function Cal() {
    const [month, setMonth] = useState(() => startOfMonth(new Date()));
    const [v, setV] = useState<Date | null>(startOfDay(new Date()));
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="rounded-xl border border-cal-border bg-background-white">
          <CalendarMonth
            month={month}
            onMonthChange={setMonth}
            selected={v}
            onSelect={setV}
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setMonth((m) => addMonths(m, -1))}>
            이전 달
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMonth((m) => addMonths(m, 1))}>
            다음 달
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * 오늘 표시는 **날짜 아래 4px 점**입니다. 원을 쓰면 선택과 헷갈립니다.
 * 오늘이면서 선택된 날은 선택이 이깁니다 — 점까지 겹치면 시끄럽습니다.
 *
 * 일요일만 빨강입니다. 토요일은 평일과 같습니다 (Figma 도 그렇습니다).
 */
export const 셀상태: Story = {
  name: "셀 상태",
  decorators: [],
  render: function Cells() {
    const today = startOfDay(new Date());
    const [month, setMonth] = useState(() => startOfMonth(today));
    const [v, setV] = useState<Date | null>(addDays(today, 3));
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="rounded-xl border border-cal-border bg-background-white">
          <CalendarMonth
            month={month}
            onMonthChange={setMonth}
            selected={v}
            onSelect={setV}
            min={addDays(today, -10)}
            max={addDays(today, 20)}
          />
        </div>
        <p className="text-2xs text-text-muted-foreground">
          오늘 아래 점 · 선택은 파란 원 · 범위 밖은 흐림 · 이전달은 더 흐림
        </p>
      </div>
    );
  },
};

/**
 * Figma 의 `Precision` 축입니다. 달력 대신 **3×4 그리드**가 뜹니다 —
 * 열두 칸이 한 화면에 들어와 스크롤이 없습니다.
 *
 * | | 머리글 | 입력 |
 * |---|---|---|
 * | `month` | 연도 Select | `202608` → `2026-08` |
 * | `year` | ‹ 2020 – 2031 › | `2026` |
 *
 * 값은 그 단위의 **첫 날**입니다 (2026년 8월 → `2026-08-01`).
 * 표시는 단위에 맞춰 자릅니다 — 월을 고르는 화면에서 `2026-08-01` 이라고 쓰면
 * 고르지도 않은 날짜까지 정한 것처럼 보입니다.
 *
 * 연도 그리드의 시작점은 **12로 내림**합니다. 안 그러면 앞뒤로 넘길 때마다
 * 경계가 달라져 같은 해가 두 화면에 나옵니다.
 */
export const 월연선택: Story = {
  name: "월 · 연 선택",
  decorators: [],
  render: function Precision() {
    const [m, setM] = useState<Date | null>(startOfMonth(new Date()));
    const [y, setY] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
    return (
      <div className="flex flex-col gap-4">
        <div className="w-56">
          <p className="mb-1.5 text-xs text-text-subtle">precision=&quot;month&quot;</p>
          <DatePicker precision="month" value={m} onValueChange={setM} />
        </div>
        <div className="w-56">
          <p className="mb-1.5 text-xs text-text-subtle">precision=&quot;year&quot;</p>
          <DatePicker precision="year" value={y} onValueChange={setY} />
        </div>
      </div>
    );
  },
};

/**
 * **폭은 부모가 정합니다** — `Input` · `Select` 와 같은 규칙입니다.
 * 컴포넌트는 폭을 쥐지 않습니다: `FormField` 안에 놓이면 다른 필드와 나란히 칸을
 * 채워야 하는데, 자기 폭을 갖고 있으면 **날짜 칸만 혼자 짧아집니다.**
 *
 * ### 값이 실제로 차지하는 폭
 *
 * 좁게 두고 싶을 때 쓰는 값입니다. **여백 24 + 글자 + 간격 8 + 우측 아이콘** —
 * 우측은 값이 있으면 지우기 16 + 간격 4 + 달력 16 = **36**, 비어 있으면 달력 **16** 뿐입니다.
 * 그래서 `day` 는 **자리표시**(`YYYY-MM-DD`)가, 월·연은 **값**이 폭을 정합니다.
 *
 * | | 값 | 자리표시 | 필요 | 여유 있게 |
 * |---|---|---|---|---|
 * | `day` | 76 | 90 | **144** | `w-37` (148) |
 * | `month` | 54 | 65 | **122** | `w-32` (128) |
 * | `year` | 34 | 36 | **102** | `w-27` (108) |
 *
 * 글자는 Pretendard 14 로 실측했습니다. **더 좁히면 값이 잘립니다** —
 * `<input>` 이 스크롤되면서 앞자리가 밀려 나갑니다.
 *
 * ### 어디에 주나
 *
 * `FormField` 에 주면 라벨·설명·에러까지 함께 좁아집니다. 입력창만 좁히려면
 * `DatePicker` 에 직접 주세요 — `className` 은 tailwind-merge 를 거치므로
 * `w-full` 로 되돌릴 수도 있습니다.
 */
export const 폭: Story = {
  name: "폭 — 부모가 정합니다",
  decorators: [],
  parameters: { layout: "padded" },
  render: function Widths() {
    const today = startOfDay(new Date());
    const [a, setA] = useState<Date | null>(today);
    const [b, setB] = useState<Date | null>(startOfMonth(today));
    const [c, setC] = useState<Date | null>(new Date(today.getFullYear(), 0, 1));
    const [d, setD] = useState<Date | null>(today);
    const [e, setE] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-xs text-text-subtle">
            값에 맞춘 폭 — <code>w-37</code> · <code>w-32</code> · <code>w-27</code>
          </p>
          <div className="flex flex-wrap items-start gap-3">
            <FormField label="보고일" className="w-37">
              <DatePicker value={a} onValueChange={setA} />
            </FormField>
            <FormField label="정산 월" className="w-32">
              <DatePicker precision="month" value={b} onValueChange={setB} />
            </FormField>
            <FormField label="기준 연도" className="w-27">
              <DatePicker precision="year" value={c} onValueChange={setC} />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            폼 칸을 채웁니다 — 폭을 주지 않으면 부모(여기서는 320)를 따릅니다
          </p>
          <div className="w-80">
            <FormField label="보고일" description="옆 칸과 폭이 같아야 줄이 어긋나 보이지 않습니다">
              <DatePicker value={d} onValueChange={setD} />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            <code>day</code> 는 <strong>자리표시가 폭을 정합니다</strong> —
            비워 두고 폭을 줄이면 <code>YYYY-MM-DD</code> 가 먼저 잘립니다
          </p>
          <div className="flex flex-wrap items-end gap-3">
            {(["w-37", "w-30", "w-24"] as const).map((w) => (
              <div key={w}>
                <p className="mb-1 text-2xs text-text-muted-foreground">{w}</p>
                <div className={w}>
                  <DatePicker value={e} onValueChange={setE} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
