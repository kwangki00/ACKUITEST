import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarMonth } from "@/components/ui/calendar";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addDays, addMonths, formatDate, startOfDay, startOfMonth } from "@/lib/date";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
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
 * **컴포넌트가 기본 폭을 갖습니다** — `Input` · `Select` 와 다른 점입니다.
 *
 * 날짜는 자릿수가 정해져 있어 폭이 예측됩니다. 이 제품은 조회 화면이 대부분이라
 * **좁은 자리가 기본**이고, 폼 격자처럼 칸을 꽉 채우는 자리가 예외입니다.
 * 그래서 기본을 좁게 두고, 채워야 할 때만 한 줄을 더 씁니다.
 *
 * ```tsx
 * <DatePicker … />                        // 값에 맞는 폭
 * <DatePicker className="w-full" … />     // 칸을 채웁니다
 * ```
 *
 * **격자에서 `w-full` 을 빠뜨리면 조용히 어긋납니다** — 옆 칸은 꽉 찼는데 날짜 칸만
 * 짧아 줄이 삐뚤어 보입니다. `Form/FormField` 의 `Control` 화면에서 실제로 그랬습니다.
 * tailwind-merge 가 기본 폭을 걷어내므로 `w-full` 한 줄이면 됩니다.
 *
 * ### 기본 폭이 이 값인 이유
 *
 * **여백 24 + 글자 + 간격 8 + 우측 아이콘** — 우측은 값이 있으면 지우기 16 + 간격 4 +
 * 달력 16 = **36**, 비어 있으면 달력 **16** 뿐입니다. 그래서 `day` 는 **자리표시**
 * (`YYYY-MM-DD`)가, 월·연은 **값**이 폭을 정합니다.
 *
 * | | 값 | 자리표시 | 필요 | 기본 |
 * |---|---|---|---|---|
 * | `day` | 76 | 90 | **144** | `w-37` (148) |
 * | `month` | 54 | 65 | **122** | `w-32` (128) |
 * | `year` | 34 | 36 | **102** | `w-27` (108) |
 *
 * 글자는 14px 로 실측하고 4px 만 얹었습니다 (잰 것은 Pretendard 시절입니다 — 글꼴을
 * 2026-08-12 에 Noto Sans KR 로 바꿨으니 잘리면 이 수치부터 보세요).
 * **더 좁히면 값이 잘립니다** —
 * `<input>` 이 스크롤되면서 앞자리가 밀려 나갑니다.
 *
 * ### `w-full` 과 `w-fit` 은 주는 대상이 다릅니다
 *
 * `DatePicker` 냐 `DateRangePicker` 냐로 갈리지 않습니다 — 둘 다 같은 규칙입니다.
 *
 * | 어디에 | 무슨 뜻 | 언제 |
 * |---|---|---|
 * | **컨트롤**에 `w-full` | 필드 **안에서** 칸을 채워라 | 격자 — 옆 칸과 폭을 맞출 때 |
 * | **`FormField`** 에 `w-fit` | 필드 **자체가** 내용만큼만 | 가로 나열 — 한 줄에 여러 필드 |
 * | 아무것도 안 줌 | 컨트롤은 기본 폭, 필드는 부모 폭 | 세로로 쌓는 보통 폼 |
 *
 * `FormField` 는 기본이 `w-full` 입니다. `flex flex-wrap` 줄에 그냥 넣으면 항목마다
 * 100% 를 요구해 **한 줄에 하나씩 떨어집니다** — 아래 세 번째 묶음에서 확인하세요.
 */
export const 폭: Story = {
  name: "폭",
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
            기본 — 폭을 주지 않았습니다. 단위마다 다릅니다
          </p>
          <div className="flex flex-wrap items-start gap-3">
            <FormField label="보고일" className="w-fit">
              <DatePicker value={a} onValueChange={setA} />
            </FormField>
            <FormField label="정산 월" className="w-fit">
              <DatePicker precision="month" value={b} onValueChange={setB} />
            </FormField>
            <FormField label="기준 연도" className="w-fit">
              <DatePicker precision="year" value={c} onValueChange={setC} />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            가로 나열 — <code>FormField</code> 에 <code>w-fit</code>. 아래는 빠뜨린 것
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start gap-4 rounded-md border border-border-gray-light p-3">
              <FormField label="보고일" className="w-fit">
                <DatePicker value={a} onValueChange={setA} />
              </FormField>
              <FormField label="정산 월" className="w-fit">
                <DatePicker precision="month" value={b} onValueChange={setB} />
              </FormField>
            </div>
            {/* w-fit 이 없으면 FormField 가 100% 를 요구해 한 줄에 하나씩 떨어집니다 */}
            <div className="flex flex-wrap items-start gap-4 rounded-md border border-border-danger p-3">
              <FormField label="보고일">
                <DatePicker value={a} onValueChange={setA} />
              </FormField>
              <FormField label="정산 월">
                <DatePicker precision="month" value={b} onValueChange={setB} />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            격자 — <strong>컨트롤</strong>에 <code>w-full</code>. 위는 준 것, 아래는 빠뜨린 것
          </p>
          <div className="grid w-[520px] grid-cols-2 gap-x-6 gap-y-4">
            <FormField label="검사 코드">
              <Input placeholder="CBC-001" />
            </FormField>
            <FormField label="보고일">
              <DatePicker className="w-full" value={d} onValueChange={setD} />
            </FormField>
            <FormField label="검사 코드">
              <Input placeholder="CBC-001" />
            </FormField>
            <FormField label="보고일" error="옆 칸과 폭이 안 맞습니다">
              <DatePicker value={d} onValueChange={setD} />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            <code>day</code> 는 <strong>자리표시가 폭을 정합니다</strong> —
            비워 두고 더 좁히면 <code>YYYY-MM-DD</code> 가 먼저 잘립니다
          </p>
          <div className="flex flex-wrap items-end gap-3">
            {(["w-37", "w-30", "w-24"] as const).map((w) => (
              <div key={w}>
                <p className="mb-1 text-2xs text-text-muted-foreground">{w}</p>
                <DatePicker className={w} value={e} onValueChange={setE} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * **같은 코드가 두 가지로 열립니다.** 왼쪽은 마우스라 팝오버, 오른쪽은 손가락이라
 * 시트 — 앱 루트의 `PointerModeProvider` 가 정하고 **호출부는 아무 판단도 하지
 * 않습니다.** `DateRangePicker` · `Select` · `ConfirmDialog` 와 같은 구조입니다.
 *
 * ### 달력은 한 벌입니다
 *
 * 껍데기만 갈리고 안에는 **같은 `DatePickerPanel`** 이 들어갑니다 — `MobileSelect` 가
 * 목록을 다시 만들지 않는 것과 같은 규칙입니다. 두 벌로 두면 한쪽만 고쳐도 아무도
 * 모릅니다.
 *
 * ### 시트에는 확인 버튼이 없습니다
 *
 * 단일 날짜는 **한 번 누르면 끝나는데** 버튼을 또 누르게 하면 번거롭습니다.
 * 두 날짜를 골라야 하는 범위(`DateRangePicker`)만 시트 Footer 로 확정합니다 —
 * Figma 의 `Confirm` 축과 같은 기준입니다.
 *
 * ### 시트에서는 입력창을 직접 칠 수 없습니다
 *
 * `readOnly` 로 두고 값은 달력으로 바꿉니다 — 키보드가 올라오면 달력을 덮습니다.
 * 팝오버 쪽은 그대로 여덟 자리를 칠 수 있습니다.
 */
export const 오버레이: Story = {
  name: "팝오버 · 시트",
  decorators: [],
  parameters: { layout: "padded" },
  render: function Overlay(args) {
    const [a, setA] = useState<Date | null>(startOfDay(new Date()));
    const [b, setB] = useState<Date | null>(startOfDay(new Date()));
    // 틀을 Provider 에 한 번만 알려주면 그 안의 시트가 따라옵니다
    const [frame, setFrame] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex flex-wrap items-start gap-8">
        <div>
          <p className="mb-2 text-xs text-text-subtle">마우스 — 팝오버가 트리거에 붙습니다</p>
          <PointerModeProvider mode="mouse">
            <FormField label="보고일" className="w-fit">
              <DatePicker {...args} value={a} onValueChange={setA} />
            </FormField>
          </PointerModeProvider>
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">
            손가락 — 시트가 아래에서 올라옵니다 (390 틀)
          </p>
          <PointerModeProvider mode="touch" container={frame}>
            <div
              ref={setFrame}
              style={{ transform: "translateZ(0)" }}
              className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtler p-4"
            >
              {/* 시트 머리글은 이 라벨을 그대로 씁니다 — 같은 글자를 두 번 적지 않습니다 */}
              <FormField label="보고일" className="w-fit">
                <DatePicker {...args} value={b} onValueChange={setB} />
              </FormField>
            </div>
          </PointerModeProvider>
        </div>
      </div>
    );
  },
};
