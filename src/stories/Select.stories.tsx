import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/components/ui/select";
import { design, figma } from "./figma";

/**
 * Figma: Select — 72 변형 (Size 4 × State 6 × Render 3)
 *
 * 여기 있는 것은 Render=Text 뿐입니다.
 * 검색이 필요하면 Overlay 의 ComboboxPanel,
 * 코드·단위를 함께 봐야 하면 LookupPanel 을 붙입니다.
 */
const meta = {
  title: "Controls/Select",
  component: Select,
  parameters: { ...design(figma.select) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    placeholder: { control: "text" },
  },
  args: { size: "default", state: "default" },
  decorators: [(Story) => <div className="w-56"><Story /></div>],
  render: (args) => (
    <Select {...args}>
      <option value="all">전체</option>
      <option value="blood">혈액검사</option>
      <option value="urine">소변검사</option>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { args: { defaultValue: "all" } };

/** 값이 없을 때는 무엇을 고르는지 알려주세요. */
export const Placeholder: Story = {
  args: { placeholder: "검사 항목을 선택하세요", defaultValue: "" },
};

export const State: Story = {
  parameters: { layout: "padded", ...design(figma.select) },
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-3">
      {(["default", "error", "disabled"] as const).map((s) => (
        <div key={s} className="w-56">
          <Select state={s} disabled={s === "disabled"} defaultValue="all">
            <option value="all">{s}</option>
          </Select>
        </div>
      ))}
    </div>
  ),
};
