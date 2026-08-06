import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChoiceGroup, CheckboxGroup } from "@/components/ui/choice-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

/**
 * Figma: ChoiceGroup — 4 변형 (Type 2 × Direction 2)
 *
 * 체크박스·라디오를 여러 개 묶습니다. 간격은 세로 10 · 가로 20(행간 10).
 *
 * 코드에서는 세 겹입니다.
 * - ChoiceGroup   배치만 담당 — 간격 값의 유일한 출처
 * - RadioGroup    ChoiceGroup + 배타 선택(name 공유 · role=radiogroup)
 * - CheckboxGroup ChoiceGroup + 다중 선택(값 배열)
 *
 * Figma 의 Type 축과 Item 2~6 불리언은 코드에 없습니다 — 자식이 정하니까요.
 */
const meta = {
  title: "Controls/ChoiceGroup",
  component: ChoiceGroup,
  parameters: { ...design(figma.choiceGroup) },
  argTypes: {
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
  },
  args: { direction: "vertical" },
} satisfies Meta<typeof ChoiceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 배치만 하는 껍데기입니다. 무엇을 넣든 간격이 같습니다. */
export const 기본: Story = {
  render: (args) => (
    <ChoiceGroup {...args}>
      <Checkbox label="선택지 A" />
      <Checkbox label="선택지 B" />
      <Checkbox label="선택지 C" />
    </ChoiceGroup>
  ),
};

/** 세로 10 · 가로 20(줄바꿈 시 행간 10). Figma ChoiceGroup 과 같은 값입니다. */
export const 방향: Story = {
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">vertical — 기본 · 간격 10</p>
        <ChoiceGroup>
          <Checkbox label="혈액검사" />
          <Checkbox label="소변검사" />
          <Checkbox label="영상의학 — 라벨이 길어도 한 줄씩 내려갑니다" />
        </ChoiceGroup>
      </div>
      <div className="max-w-md">
        <p className="mb-2 text-xs font-medium text-text-basic">
          horizontal — 짧은 선택지 2~3개 · 간격 20 · 넘치면 줄바꿈(행간 10)
        </p>
        <ChoiceGroup direction="horizontal">
          {["1개월", "3개월", "6개월", "1년", "3년", "전체 기간"].map((l) => (
            <Checkbox key={l} label={l} />
          ))}
        </ChoiceGroup>
      </div>
    </div>
  ),
};

/** 다중 선택. 값이 배열입니다. */
export const CheckboxGroup_다중선택: Story = {
  name: "CheckboxGroup — 다중 선택",
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: function Multi() {
    const [v, setV] = useState<string[]>(["blood"]);
    return (
      <div className="flex flex-col gap-3">
        <CheckboxGroup value={v} onValueChange={setV} aria-label="검사 종류">
          <Checkbox value="blood" label="혈액검사" />
          <Checkbox value="urine" label="소변검사" />
          <Checkbox value="image" label="영상의학" />
          <Checkbox value="path" label="병리검사" />
        </CheckboxGroup>
        <p className="text-2xs text-text-subtle">
          고른 값: {v.length ? v.join(" · ") : "없음"}
        </p>
      </div>
    );
  },
};

/** 배타 선택. 값이 하나입니다. */
export const RadioGroup_배타선택: Story = {
  name: "RadioGroup — 배타 선택",
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: function Single() {
    const [v, setV] = useState("3m");
    return (
      <div className="flex flex-col gap-3">
        <RadioGroup direction="horizontal" value={v} onValueChange={setV} aria-label="조회 기간">
          <Radio value="1m" label="1개월" />
          <Radio value="3m" label="3개월" />
          <Radio value="6m" label="6개월" />
        </RadioGroup>
        <p className="text-2xs text-text-subtle">고른 값: {v}</p>
      </div>
    );
  },
};

/** size · disabled · error 는 그룹이 한 번에 내려줍니다. */
export const 그룹속성: Story = {
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: () => (
    <div className="flex flex-col gap-6">
      {[
        { label: "size=sm", props: { size: "sm" as const } },
        { label: "disabled", props: { disabled: true } },
        { label: "error", props: { error: true } },
      ].map(({ label, props }) => (
        <div key={label}>
          <p className="mb-2 text-xs font-medium text-text-basic">{label}</p>
          <CheckboxGroup direction="horizontal" aria-label={label} {...props}>
            <Checkbox value="a" label="선택지 A" />
            <Checkbox value="b" label="선택지 B" />
          </CheckboxGroup>
        </div>
      ))}
    </div>
  ),
};

/** FormField 의 Control 자리에 그룹째 들어갑니다 — Figma 가 말하는 본래 용도입니다. */
export const 폼: Story = {
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: function InForm() {
    const [items, setItems] = useState<string[]>([]);
    const error = items.length === 0 ? "하나 이상 선택해 주세요." : undefined;
    return (
      <div className="w-80">
        <FormField
          label="출력 항목"
          required
          description="선택한 항목만 결과지에 포함됩니다."
          error={error}
        >
          <CheckboxGroup
            value={items}
            onValueChange={setItems}
            error={!!error}
            aria-label="출력 항목"
          >
            <Checkbox value="summary" label="검사 요약" />
            <Checkbox value="detail" label="상세 수치" />
            <Checkbox value="chart" label="추이 그래프" />
          </CheckboxGroup>
        </FormField>
      </div>
    );
  },
};

/**
 * 단일 체크박스는 그룹으로 감싸지 마세요.
 * 약관 동의처럼 하나뿐이면 라벨이 옆에 오는 다른 패턴입니다.
 */
export const 그룹을쓰지않는경우: Story = {
  parameters: { layout: "padded", ...design(figma.choiceGroup) },
  render: () => (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-medium text-text-success">이렇게</p>
        <Checkbox label="개인정보 수집·이용에 동의합니다" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-danger">이러지 말고</p>
        <FormField label="동의">
          <CheckboxGroup aria-label="동의">
            <Checkbox value="agree" label="개인정보 수집·이용에 동의합니다" />
          </CheckboxGroup>
        </FormField>
        <p className="mt-1 text-2xs text-text-subtle">
          라벨이 두 번 나오고, 선택지가 하나뿐인 목록이 됩니다.
        </p>
      </div>
    </div>
  ),
};
