import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

/**
 * Figma: Radio — 12 변형 (Size 2 × Selected 2 × State 3)
 *
 * 체크박스와 다른 점 — 선택 표시가 안쪽 점이고, 칠해지는 건 테두리입니다.
 * 원 안은 계속 흽니다. 통째로 칠하면 체크박스와 구분이 안 됩니다.
 *
 * 단독으로 쓰지 마세요. RadioGroup 으로 묶어야 name 이 공유되고
 * 배타 선택 · 방향키 이동이 됩니다.
 */
const meta = {
  title: "Controls/Radio",
  component: Radio,
  parameters: { ...design(figma.radio) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    label: { control: "text" },
    checked: { control: "boolean" },
    error: { control: "boolean", description: "필수 선택 미입력 등 — 테두리와 점이 빨강으로." },
    disabled: { control: "boolean" },
  },
  args: { label: "전체", size: "default" },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [on, setOn] = useState(false);
    return <Radio {...args} checked={on} onChange={(e) => setOn(e.target.checked)} />;
  },
};

/** Figma 12변형 전부. Selected 축이 점의 유무입니다. */
export const 상태: Story = {
  parameters: { layout: "padded", ...design(figma.radio) },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "sm"] as const).map((s) => (
        <section key={s} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-basic">Size = {s}</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Radio size={s} label="미선택" name={`st-${s}-a`} />
            <Radio size={s} label="선택됨" name={`st-${s}-b`} defaultChecked />
            <Radio size={s} label="에러" name={`st-${s}-c`} error />
            <Radio size={s} label="에러 · 선택됨" name={`st-${s}-d`} error defaultChecked />
            <Radio size={s} label="비활성" name={`st-${s}-e`} disabled />
            <Radio size={s} label="비활성 · 선택됨" name={`st-${s}-f`} disabled defaultChecked />
          </div>
        </section>
      ))}
    </div>
  ),
};

/** 선택지가 길거나 3개를 넘으면 vertical 입니다. */
export const 그룹: Story = {
  parameters: { layout: "padded", ...design(figma.radio) },
  render: function Group() {
    const [period, setPeriod] = useState("3m");
    const [target, setTarget] = useState("all");
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">
            horizontal — 짧은 선택지 2~3개
          </p>
          <RadioGroup
            direction="horizontal"
            value={period}
            onValueChange={setPeriod}
            aria-label="조회 기간"
          >
            <Radio value="1m" label="1개월" />
            <Radio value="3m" label="3개월" />
            <Radio value="6m" label="6개월" />
          </RadioGroup>
          <p className="mt-2 text-2xs text-text-subtle">고른 값: {period}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">vertical — 기본</p>
          <RadioGroup value={target} onValueChange={setTarget} aria-label="출력 대상">
            <Radio value="all" label="전체 검사 항목" />
            <Radio value="abnormal" label="이상 수치만" />
            <Radio value="selected" label="선택한 항목만 — 표에서 고른 행 기준" />
          </RadioGroup>
          <p className="mt-2 text-2xs text-text-subtle">고른 값: {target}</p>
        </div>
      </div>
    );
  },
};

/** 그룹 전체를 한 번에 끄거나 에러로 바꿀 수 있습니다. */
export const 그룹속성: Story = {
  parameters: { layout: "padded", ...design(figma.radio) },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">disabled</p>
        <RadioGroup direction="horizontal" disabled aria-label="비활성 예시">
          <Radio value="a" label="선택지 A" />
          <Radio value="b" label="선택지 B" />
        </RadioGroup>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">error · size=sm</p>
        <RadioGroup direction="horizontal" error size="sm" aria-label="에러 예시">
          <Radio value="a" label="선택지 A" />
          <Radio value="b" label="선택지 B" />
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * `FormField` 의 Control 자리에 **그룹째** 들어갑니다.
 *
 * **묶는 방법이 다릅니다.** `Radio` 는 네모 칸 옆 글자로 **자기 라벨을 스스로**
 * 답니다 — `FormField` 의 컨텍스트를 읽지 않습니다. 여기서 `FormField` 가 다는
 * 것은 **그룹 전체의 이름**이라, `RadioGroup` 에 `aria-label` 로 직접 줍니다.
 *
 * 그래서 `Checkbox` · `Radio` · `Switch` 의 `label` 은 **필드 라벨과 다른 것**입니다 —
 * 네모 칸 옆에 붙는 글자지 필드 위의 라벨이 아닙니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  parameters: { layout: "padded", ...design(figma.radio) },
  render: function InForm() {
    const [v, setV] = useState("");
    const error = v === "" ? "출력 방식을 선택해 주세요." : undefined;
    return (
      <div className="w-80">
        <FormField
          label="출력 방식"
          required
          description="선택한 방식으로 결과지가 생성됩니다."
          error={error}
        >
          <RadioGroup value={v} onValueChange={setV} error={!!error} aria-label="출력 방식">
            <Radio value="pdf" label="PDF 파일" />
            <Radio value="print" label="바로 인쇄" />
          </RadioGroup>
        </FormField>
      </div>
    );
  },
};
