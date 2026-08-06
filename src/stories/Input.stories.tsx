import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { design, figma } from "./figma";

/**
 * Figma: Input — 48 변형 (Size 4 × State 6 × Content 2)
 *
 * `<input>` 은 자식을 가질 수 없어, 아이콘·단위·클리어가 붙으면
 * 바깥 래퍼가 테두리를 그리고 안쪽 input 은 테두리를 없앱니다.
 * 폭을 고정하지 마세요 — 부모가 폭을 정하게 두면 아이콘이 잘리지 않습니다.
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
  },
  args: { placeholder: "성명 또는 차트번호", size: "default", state: "default" },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

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

/** 클리어 버튼은 값이 있을 때만 보입니다. */
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
            onClear={v ? () => setV("") : undefined}
          />
        </div>
        <div className="w-72">
          <Input trailingIcon={<Calendar />} defaultValue="2025-04-26 ~ 2026-07-07" />
        </div>
        <div className="w-40">
          <Input unit="건" defaultValue="248" className="text-right" />
        </div>
      </div>
    );
  },
};
