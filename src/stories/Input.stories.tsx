import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: Input — 48 변형 (Size 4 × State 6 × Content 2)
 *
 * `<input>` 은 자식을 가질 수 없어, 아이콘·단위·클리어가 붙으면
 * 바깥 래퍼가 테두리를 그리고 안쪽 input 은 테두리를 없앱니다.
 * 폭을 고정하지 마세요 — 부모가 폭을 정하게 두면 아이콘이 잘리지 않습니다.
 *
 * ### 크기 — Figma 값 그대로
 *
 * | | 높이(PC/모바일) | 좌우 | 간격 | 글자 | 아이콘 | 반경 |
 * |---|---|---|---|---|---|---|
 * | `grid` | 34 / 36 | 8 | 8 | 14 | 16 | 4 |
 * | `sm` | 32 / 36 | 12 | 6 | 14 | 16 | 6 |
 * | `default` | 36 / 40 | 12 | 8 | 14 | 16 | 6 |
 * | `lg` | 48 / 52 | 16 | 8 | **16** | **20** | 6 |
 *
 * 글자가 모바일에서 16 인 이유는 iOS 가 그보다 작으면 포커스 때 화면을 확대해서입니다.
 * 줄이는 시점(`lg:` = 1024)은 높이가 PC 로 갈리는 지점과 같습니다.
 *
 * ### State 는 6개가 아니라 4개입니다
 *
 * Figma 의 `Focus` · `Error-Focus` 는 코드에서 상태 값이 아니라 `focus-within` 입니다 —
 * 마우스 사용자에게는 보이지 않는 상태라 prop 으로 둘 이유가 없습니다.
 * 테두리 색 변경 + 3px 링이고, 에러 위의 포커스는 링만 빨강으로 바뀝니다.
 */
const meta = {
  title: "Controls/Input",
  component: Input,
  parameters: { ...design(figma.input) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    placeholder: { control: "text" },
    unit: { control: "text", description: "원 · 건 같은 단위. 버튼이 아닙니다." },
    align: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "기본은 왼쪽. unit 이 있으면 자동으로 오른쪽입니다.",
    },
    clearable: { control: "boolean", description: "값이 있을 때 지우기 X. 기본 켬." },
    // ReactNode 는 컨트롤을 끕니다. 켜두면 Storybook 이 object 편집기를 붙이고,
    // 건드리는 순간 빈 객체 {} 가 children 으로 들어가 렌더가 깨집니다
    leadingIcon: { control: false, description: "앞 아이콘 — 검색·달력 등" },
    trailingIcon: { control: false, description: "뒤 아이콘. 지우기보다 안쪽입니다" },
    onClear: { control: false },
    onChange: { control: false },
  },
  args: { placeholder: "성명 또는 차트번호", size: "default", state: "default" },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { parameters: { ...argsSource } };

export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-3">
      {(["sm", "default", "lg", "grid"] as const).map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-16 text-xs text-text-subtle">{s}</span>
          <div className="w-64">
            <Input size={s} placeholder={s} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Readonly 는 조회 화면에서 값을 보여주되 못 고치게 할 때 씁니다. */
export const State: Story = {
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="w-64"><Input placeholder="기본" /></div>
      <div className="w-64"><Input state="error" defaultValue="잘못된 값" /></div>
      <div className="w-64"><Input disabled placeholder="비활성" /></div>
      <div className="w-64"><Input readOnly defaultValue="읽기 전용" /></div>
    </div>
  ),
};

/**
 * 슬롯 순서는 Figma 의 자식 순서 그대로입니다 — **값 · 단위 · 보조 아이콘 · 지우기.**
 * 지우기가 가장 바깥이라 눌러야 할 것이 늘 같은 자리에 있습니다.
 */
export const 슬롯: Story = {
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: function Slots() {
    const [v, setV] = useState("김진영");
    return (
      <div className="flex flex-col gap-3">
        <div className="w-72">
          <Input
            leadingIcon={<Search />}
            placeholder="성명 또는 차트번호"
            value={v}
            onChange={(e) => setV(e.target.value)}
          />
        </div>
        <div className="w-72">
          <Input trailingIcon={<Calendar />} defaultValue="2025-04-26 ~ 2026-07-07" />
        </div>
        <div className="w-40">
          <Input unit="건" defaultValue="248" clearable={false} />
        </div>
      </div>
    );
  },
};

/**
 * **값이 있으면 지우기가 저절로 나옵니다.** 아무것도 넘기지 않아도 됩니다 —
 * 눌러도 `onChange` 가 빈 값으로 한 번 울리니, 값을 상태로 들고 있어도 그대로 따라옵니다.
 *
 * | | |
 * |---|---|
 * | 빈 칸 | 안 보임 — 누를 것이 없는 버튼은 두지 않습니다 |
 * | disabled · readOnly | 안 보임 — 지울 수 없는 값입니다 |
 * | 값이 늘 있어야 하는 칸 | `clearable={false}` 로 끄세요 |
 *
 * 키보드로는 **Esc** 로 지웁니다. 브라우저 검색창과 같은 관습입니다.
 */
export const 지우기: Story = {
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: function Clear() {
    const [v, setV] = useState("김진영");
    return (
      <div className="flex flex-col gap-3">
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">
            상태로 들고 있는 값 — 지금 값: {v === "" ? "(빈 값)" : v}
          </p>
          <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="성명" />
        </div>
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">상태 없이 — 처음부터 값이 있는 칸</p>
          <Input defaultValue="20250601001" />
        </div>
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">clearable={"{false}"} — 끈 경우</p>
          <Input defaultValue="20250601001" clearable={false} />
        </div>
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">읽기 전용 · 비활성 — 자동으로 숨김</p>
          <div className="flex flex-col gap-2">
            <Input readOnly defaultValue="읽기 전용" />
            <Input disabled defaultValue="비활성" />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 숫자에 단위가 붙으면 값이 **오른쪽으로 붙습니다** — 자릿수를 맞춰 읽어야 하고
 * 단위가 값에서 떨어지면 무엇의 단위인지 흐려집니다. `align` 으로 되돌릴 수 있습니다.
 */
export const 단위와정렬: Story = {
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="w-40"><Input unit="원" defaultValue="1,250,000" /></div>
      <div className="w-40"><Input unit="mL" defaultValue="7.5" /></div>
      <div className="w-40"><Input unit="원" defaultValue="1,250,000" align="left" /></div>
    </div>
  ),
};

/**
 * `lg` 만 글자 16 · 아이콘 20 입니다. 나머지 셋은 14 · 16 으로 같습니다 —
 * 높이는 넷 다 다르지만 **글자는 두 가지뿐**입니다.
 */
export const lg는아이콘이큽니다: Story = {
  name: "lg 는 아이콘이 큽니다",
  parameters: { layout: "padded", ...design(figma.input) },
  decorators: [],
  render: function BigIcon() {
    const [v, setV] = useState("김진영");
    return (
      <div className="flex flex-col gap-3">
        {(["default", "lg"] as const).map((s) => (
          <div key={s} className="flex items-center gap-3">
            <span className="w-16 text-xs text-text-subtle">{s}</span>
            <div className="w-72">
              <Input
                size={s}
                leadingIcon={<Search />}
                value={v}
                onChange={(e) => setV(e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 * `FormField` 가 `useId()` 로 만든 id 를 내려주고 ``<input>`` 이(가) 자기 `id` 로 씁니다
 * (`<label for>` 의 짝). 설명·에러도 `aria-describedby` 로 함께 묶입니다.
 *
 * **연결을 호출부에 시키면 반드시 빠집니다** — 이 저장소도 60곳 중 26곳만 넘기고
 * 있었고, 나머지는 스크린리더로 가면 무엇을 입력하는 칸인지 안 읽혔습니다.
 * 화면은 멀쩡해서 알아챌 방법이 없습니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  parameters: { layout: "padded" },
  render: function InForm() {
    const [v, setV] = useState("");
    const error = v.trim() === "" ? "차트번호를 입력해 주세요." : undefined;
    return (
      <div className="flex w-72 flex-col gap-4">
        <FormField label="차트번호" description="숫자 7자리입니다.">
          <Input placeholder="2312345" leadingIcon={<Search />} />
        </FormField>
        <FormField label="차트번호" required error={error}>
          <Input
            state={error ? "error" : "default"}
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="2312345"
          />
        </FormField>
      </div>
    );
  },
};
