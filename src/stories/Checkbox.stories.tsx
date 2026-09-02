import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
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
    indeterminate: {
      control: "boolean",
      description: "하위가 일부만 선택된 상태. DOM 프로퍼티라 ref 로 세웁니다.",
    },
    error: { control: "boolean", description: "필수 동의 미체크 등 — 테두리가 빨강으로." },
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
      {/* checked 를 같이 주지 않습니다 — indeterminate 는 Figma 의 Checked 축에서
          Unchecked·Checked 와 나란한 세 번째 값이지 '체크된 상태'가 아닙니다 */}
      <Checkbox label="일부 선택 — 하위가 섞여 있음" indeterminate />
      <Checkbox label="필수 동의 — 체크해 주세요" error />
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

/**
 * **하나만 있을 때는 감싸지 마세요** — 약관 동의처럼 박스 옆 글자가 곧 이름이라
 * `FormField` 라벨과 두 벌이 됩니다. 여기서 `FormField` 가 다는 것은
 * **그룹 전체의 이름**입니다.
 *
 * **체크박스는 `FormField` 의 컨텍스트를 읽지 않습니다** — `Radio` · `Switch` 도 같습니다.
 * 자기 라벨을 스스로 달기 때문입니다. 그래서 그룹에는 `aria-label` 을 직접 줍니다 —
 * 「직접 준 것이 이깁니다」 규칙입니다.
 *
 * 여러 개를 값 배열로 다뤄야 하면 `ChoiceGroup`(CheckboxGroup)을 쓰세요. 여기는
 * 각자 독립된 조건이라 낱개로 둡니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  parameters: { layout: "padded", ...design(figma.checkbox) },
  render: function InForm() {
    const [v, setV] = useState({ blocked: true, history: false, abnormal: false });
    return (
      <div className="w-80">
        <FormField label="조회 옵션" description="선택한 조건만 목록에 포함됩니다.">
          <div className="flex flex-col gap-2" role="group" aria-label="조회 옵션">
            <Checkbox
              label="병원 출력금지 항목 제외"
              checked={v.blocked}
              onChange={(e) => setV({ ...v, blocked: e.target.checked })}
            />
            <Checkbox
              label="검사이력 있는 환자만"
              checked={v.history}
              onChange={(e) => setV({ ...v, history: e.target.checked })}
            />
            <Checkbox
              label="이상결과 있는 항목만"
              checked={v.abnormal}
              onChange={(e) => setV({ ...v, abnormal: e.target.checked })}
            />
          </div>
        </FormField>
      </div>
    );
  },
};
