import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { design, figma } from "./figma";

/**
 * Figma: Checkbox — 18 변형 (Size 2 × Checked 3 × State 3)
 *
 * Indeterminate 는 하위가 일부만 선택된 상태입니다 — 트리나 표 전체선택에 씁니다.
 * 약관 동의처럼 하나만 있을 때는 FormField 로 감싸지 마세요.
 */
const meta = {
  title: "Controls/Checkbox",
  component: Checkbox,
  parameters: { ...design(figma.checkbox) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    label: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { label: "병원 출력금지 항목 제외", size: "default" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [on, setOn] = useState(false);
    return <Checkbox {...args} checked={on} onChange={(e) => setOn(e.target.checked)} />;
  },
};

export const 상태: Story = {
  parameters: { layout: "padded", ...design(figma.checkbox) },
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="선택 안 됨" />
      <Checkbox label="선택됨" defaultChecked />
      <Checkbox label="일부 선택 — 하위가 섞여 있음" indeterminate readOnly checked />
      <Checkbox label="비활성" disabled />
      <Checkbox label="비활성 · 선택됨" disabled defaultChecked />
    </div>
  ),
};

/** 표 안에서는 sm 을 씁니다. */
export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.checkbox) },
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="sm" label="sm — 표 · 목록 안" />
      <Checkbox label="default — 폼" />
    </div>
  ),
};
