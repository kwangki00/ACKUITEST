import type { Meta, StoryObj } from "@storybook/react";
import { NativeSelect } from "@/components/ui/native-select";
import { Select } from "@/components/ui/select";
import { design, figma } from "./figma";

/**
 * 네이티브 `<select>` 입니다. **Figma 에 대응물이 없습니다.**
 *
 * Figma 의 SelectTrigger 는 트리거만 정의하고 목록은 Popover + ListItem 으로 그립니다.
 * 이건 트리거만 토큰대로 칠하고 **목록은 OS 가 그립니다** —
 * 글꼴 · 행 높이 · hover 색이 디자인 시스템과 다르고, CSS 로 바꿀 수 없습니다.
 *
 * ### 언제 쓰나
 *
 * | | |
 * |---|---|
 * | 기본 | `Select` — 목록도 토큰대로 그립니다 |
 * | 모바일에서 OS 휠 피커가 낫다고 판단될 때 | **NativeSelect** |
 * | 목록이 아주 짧고 모양이 중요하지 않을 때 | **NativeSelect** |
 *
 * 트리거의 크기 · 상태 · 색은 `SelectTrigger` 와 같은 정의를 씁니다.
 * 어긋나는 건 **펼친 목록뿐**입니다.
 */
const meta = {
  title: "Controls/NativeSelect",
  component: NativeSelect,
  parameters: { layout: "padded", ...design(figma.selectTrigger) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    placeholder: { control: "text" },
  },
  args: { size: "default", state: "default" },
  decorators: [(S) => <div className="w-56">{S()}</div>],
  render: (args) => (
    <NativeSelect {...args} defaultValue="all">
      <option value="all">전체</option>
      <option value="blood">혈액검사</option>
      <option value="urine">소변검사</option>
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

export const Placeholder: Story = {
  args: { placeholder: "검사 항목을 선택하세요", defaultValue: "" },
};

/** 트리거는 같고 **펼친 목록만 다릅니다.** 둘 다 열어서 비교해 보세요. */
export const Select와의차이: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-56">
        <p className="mb-1.5 text-xs font-medium text-text-basic">Select</p>
        <Select
          options={[
            { value: "all", label: "전체" },
            { value: "blood", label: "혈액검사" },
            { value: "urine", label: "소변검사" },
          ]}
          value="all"
          onValueChange={() => {}}
        />
        <p className="mt-1.5 text-2xs text-text-subtle">
          목록도 ListItem — 높이 32 · 반경 4 · 선택 표시
        </p>
      </div>
      <div className="w-56">
        <p className="mb-1.5 text-xs font-medium text-text-basic">NativeSelect</p>
        <NativeSelect defaultValue="all">
          <option value="all">전체</option>
          <option value="blood">혈액검사</option>
          <option value="urine">소변검사</option>
        </NativeSelect>
        <p className="mt-1.5 text-2xs text-text-subtle">
          목록은 OS 가 그립니다 — 토큰이 안 먹습니다
        </p>
      </div>
    </div>
  ),
};

export const Size: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((z) => (
        <div key={z} className="w-56">
          <p className="mb-1.5 text-xs font-medium text-text-basic">{z}</p>
          <NativeSelect size={z} defaultValue="all">
            <option value="all">전체</option>
          </NativeSelect>
        </div>
      ))}
    </div>
  ),
};

export const State: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-3">
      {(["default", "error", "readonly", "disabled"] as const).map((s) => (
        <div key={s} className="w-56">
          <NativeSelect state={s} disabled={s === "disabled"} defaultValue="all">
            <option value="all">{s}</option>
          </NativeSelect>
        </div>
      ))}
    </div>
  ),
};
