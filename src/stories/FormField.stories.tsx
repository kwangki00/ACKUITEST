import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/choice-group";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
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
 *
 * ### 래퍼에 size 는 없습니다
 *
 * Figma 의 `Size` 축은 래퍼가 아니라 **안쪽 컨트롤의 높이**입니다.
 * `<Input size="lg" />` 처럼 컨트롤에 직접 주세요.
 *
 * ### Control 은 prop 이 아니라 children 입니다
 *
 * 래퍼는 라벨 · 필수 표시 · 설명 · 에러만 담당하고 **안에 무엇이 들어가는지 모릅니다.**
 * Figma 의 Control 축 7종은 코드에서 그냥 children 입니다 — `Control` 스토리를 보세요.
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

const TESTS = [
  { value: "cbc", label: "일반혈액검사" },
  { value: "ua", label: "소변검사" },
  { value: "img", label: "영상의학" },
];

/** 한 칸 — 라벨 위, 컨트롤 아래. 격자에서 반복해 쓰려고 따로 뺐습니다. */
function Cell({ note, children }: { note: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-2xs text-text-muted-foreground">{note}</p>
      {children}
    </div>
  );
}

/**
 * Control 축 7종 — **어떤 컨트롤이든 같은 래퍼를 씁니다.**
 * Figma Documentation 의 `Prop-control` 과 같은 구성입니다.
 *
 * 래퍼는 라벨 · 필수 표시 · 설명 · 에러만 담당하고, 안에 무엇이 들어가는지는
 * 모릅니다. 그래서 `Control` 은 코드에서 **prop 이 아니라 children** 입니다.
 */
export const Control: Story = {
  parameters: { layout: "padded", ...design(figma.formField) },
  decorators: [],
  render: function Controls() {
    const [multi, setMulti] = useState<string[]>(["cbc", "ua"]);
    const [tests, setTests] = useState<string[]>(["cbc"]);
    const [period, setPeriod] = useState<string>("3m");
    const [range, setRange] = useState<DateRange>({ start: null, end: null });

    return (
      <div className="grid w-[760px] gap-x-6 gap-y-5 sm:grid-cols-2">
        <Cell note="Input">
          <FormField label="검사 코드" required description="영문 대문자와 숫자만 입력하세요." htmlFor="c1">
            <Input id="c1" placeholder="텍스트를 입력해 주세요." />
          </FormField>
        </Cell>
        <Cell note="Input + Error">
          <FormField label="검사 코드" required error="이미 등록된 검사 코드입니다." htmlFor="c2">
            <Input id="c2" state="error" defaultValue="CBC-001" />
          </FormField>
        </Cell>

        <Cell note="InputGroup — 아이콘·버튼이 붙는 필드">
          <FormField label="검사 수가" description="검사명 또는 코드로 찾습니다." htmlFor="c3">
            <InputGroup>
              <Input id="c3" leadingIcon={<Search />} placeholder="검사명 또는 코드" />
              <Button>조회</Button>
            </InputGroup>
          </FormField>
        </Cell>
        <Cell note="InputGroup + Error — 안쪽 Input 까지 연동">
          <FormField label="검사 수가" error="검사를 먼저 조회해 주세요." htmlFor="c4">
            <InputGroup>
              <Input id="c4" state="error" placeholder="검사명 또는 코드" />
              <Button>조회</Button>
            </InputGroup>
          </FormField>
        </Cell>

        <Cell note="Textarea">
          <FormField label="특이사항" description="검사 결과에 대한 특이사항을 기재합니다." htmlFor="c5">
            <Textarea id="c5" placeholder="내용을 입력해 주세요." />
          </FormField>
        </Cell>
        <Cell note="Textarea + Counter — 길이 제한이 있을 때">
          <FormField label="특이사항" htmlFor="c6">
            <Textarea id="c6" counter maxLength={500} placeholder="내용을 입력해 주세요." />
          </FormField>
        </Cell>

        <Cell note="Select — 단일">
          <FormField label="검사 종류" htmlFor="c7">
            <Select options={TESTS} value="cbc" onValueChange={() => {}} />
          </FormField>
        </Cell>
        <Cell note="Combobox — 다중(칩)">
          <FormField label="검사 항목">
            <Combobox type="multi" render="chip" options={TESTS} value={multi} onValueChange={setMulti} />
          </FormField>
        </Cell>

        <Cell note="Select + Error">
          <FormField label="검사 종류" required error="검사 종류를 선택해 주세요.">
            <Select state="error" options={TESTS} onValueChange={() => {}} />
          </FormField>
        </Cell>
        <Cell note="DatePicker — 기간">
          <FormField label="조회 기간" required>
            <DateRangePicker value={range} onValueChange={setRange} />
          </FormField>
        </Cell>

        <Cell note="Checkbox — 다중 선택 그룹 (ChoiceGroup)">
          <FormField label="검사 종류" required>
            <CheckboxGroup value={tests} onValueChange={setTests} direction="horizontal">
              {TESTS.map((t) => (
                <Checkbox key={t.value} value={t.value} label={t.label} />
              ))}
            </CheckboxGroup>
          </FormField>
        </Cell>
        <Cell note="Checkbox + Error — 하나 이상 필요">
          <FormField label="검사 종류" required error="하나 이상 선택해 주세요.">
            <CheckboxGroup value={[]} onValueChange={() => {}} error direction="horizontal">
              {TESTS.map((t) => (
                <Checkbox key={t.value} value={t.value} label={t.label} />
              ))}
            </CheckboxGroup>
          </FormField>
        </Cell>

        <Cell note="Radio — 배타 선택 그룹">
          <FormField label="조회 기간">
            <RadioGroup value={period} onValueChange={setPeriod} direction="horizontal">
              <Radio value="1m" label="1개월" />
              <Radio value="3m" label="3개월" />
              <Radio value="6m" label="6개월" />
            </RadioGroup>
          </FormField>
        </Cell>
        <Cell note="단일 체크박스 — 이 래퍼가 아닙니다">
          <div className="pt-6">
            <Checkbox label="병원 출력금지 항목 제외" />
          </div>
          <p className="mt-2 text-2xs text-text-muted-foreground">
            약관 동의처럼 하나뿐이고 라벨이 옆에 오는 패턴은 Checkbox 를 그대로 씁니다.
          </p>
        </Cell>
      </div>
    );
  },
};

/**
 * 네 슬롯(라벨 · 필수 · 설명 · 에러)은 각각 독립입니다.
 * 끄면 세로 간격(6px)이 저절로 접힙니다.
 *
 * **에러가 있으면 설명은 가려집니다** — 한 번에 하나만 읽게 합니다.
 * 형식 안내를 계속 보여주고 싶으면 그 내용을 에러 문구에 넣으세요.
 */
export const 슬롯: Story = {
  parameters: { layout: "padded", ...design(figma.formField) },
  decorators: [],
  render: () => (
    <div className="grid w-[760px] gap-x-6 gap-y-5 sm:grid-cols-2">
      <Cell note="전부 켬">
        <FormField label="검사 코드" required description="영문 대문자와 숫자만 입력하세요." htmlFor="s1">
          <Input id="s1" placeholder="텍스트를 입력해 주세요." />
        </FormField>
      </Cell>
      <Cell note="설명 끔">
        <FormField label="검사 코드" required htmlFor="s2">
          <Input id="s2" placeholder="텍스트를 입력해 주세요." />
        </FormField>
      </Cell>
      <Cell note="라벨 끔 — 표 안이나 반복되는 줄에서">
        <FormField htmlFor="s3">
          <Input id="s3" placeholder="텍스트를 입력해 주세요." />
        </FormField>
      </Cell>
      <Cell note="에러 — 설명이 있어도 가려집니다">
        <FormField
          label="검사 코드"
          required
          description="영문 대문자와 숫자만 입력하세요."
          error="이미 등록된 검사 코드입니다."
          htmlFor="s4"
        >
          <Input id="s4" state="error" defaultValue="CBC-001" />
        </FormField>
      </Cell>
    </div>
  ),
};
