import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { design, figma } from "./figma";

/**
 * Figma: FormField — 42 변형 (Size 3 × State 2 × Control 7)
 *
 * 라벨 14 Medium · 값 14 Regular — 크기가 아니라 굵기로만 위계를 만듭니다.
 * Table 이 헤더·본문을 나누는 방식과 같습니다.
 * 라벨을 Regular 로 내리면 값과 크기·굵기·색이 전부 같아져 구분이 사라집니다.
 *
 * 설명과 에러는 12 로 둡니다 — 보조 정보라 라벨보다 작아야 합니다.
 * 에러는 React Hook Form + Zod 의 검증 결과로 자동 결정됩니다 — 수동으로 켜지 마세요.
 */
const meta = {
  title: "Form/FormField",
  component: FormField,
  parameters: { ...design(figma.formField) },
  argTypes: {
    label: { control: "text" },
    required: { control: "boolean" },
    description: { control: "text" },
    error: { control: "text", description: "값이 있으면 설명 대신 에러가 보입니다." },
  },
  args: { label: "검사 항목", required: false },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: (args) => (
    <FormField {...args} htmlFor="a">
      <Input id="a" placeholder="검사명 또는 코드" />
    </FormField>
  ),
};

export const 설명: Story = {
  args: { description: "여러 항목은 쉼표로 구분합니다." },
  render: (args) => (
    <FormField {...args} htmlFor="b">
      <Input id="b" placeholder="검사명 또는 코드" />
    </FormField>
  ),
};

/** 에러가 있으면 설명은 가려집니다 — 한 번에 하나만 읽게 합니다. */
export const 에러: Story = {
  args: {
    required: true,
    description: "여러 항목은 쉼표로 구분합니다.",
    error: "검사 항목을 선택해 주세요.",
  },
  render: (args) => (
    <FormField {...args} htmlFor="c">
      <Input id="c" state="error" placeholder="검사명 또는 코드" />
    </FormField>
  ),
};

/** Control 축 — 어떤 컨트롤이든 같은 래퍼를 씁니다. */
export const Control: Story = {
  parameters: { layout: "padded", ...design(figma.formField) },
  decorators: [],
  render: () => (
    <div className="grid w-[720px] gap-4 sm:grid-cols-3">
      <FormField label="검색" htmlFor="d1">
        <Input id="d1" leadingIcon={<Search />} placeholder="성명 또는 차트번호" />
      </FormField>
      <FormField label="검사 항목" htmlFor="d2">
        <Select
          options={[
            { value: "all", label: "전체" },
            { value: "blood", label: "혈액검사" },
          ]}
          value="all"
          onValueChange={() => {}}
        />
      </FormField>
      <FormField label="옵션">
        <Checkbox label="병원 출력금지 항목 제외" />
      </FormField>
    </div>
  ),
};
