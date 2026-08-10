import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: Textarea — 12 변형 (State 6 × Content 2)
 *
 * Input 과 같은 상태 축·색 토큰을 씁니다. 사이즈 축은 없습니다 —
 * 내용에 맞춰 자동으로 늘어나고, 최소 높이는 100 입니다.
 */
const meta = {
  title: "Controls/Textarea",
  component: Textarea,
  parameters: { layout: "padded", ...design(figma.textarea) },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    counter: { control: "boolean", description: "우측 하단 글자 수. 길이 제한이 있을 때만." },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { placeholder: "내용을 입력해 주세요.", state: "default" },
  decorators: [(S) => <div className="w-96">{S()}</div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { parameters: { ...argsSource } };

/** Input 과 같은 상태 축입니다. Error 는 포커스가 와야 붉은 링이 붙습니다. */
export const 상태: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        { state: "default" as const, label: "default", value: "" },
        { state: "error" as const, label: "error", value: "검사 소견" },
        { state: "readonly" as const, label: "readonly", value: "판독 완료된 소견은 수정할 수 없습니다." },
        { state: "disabled" as const, label: "disabled", value: "" },
      ].map((s) => (
        <div key={s.label}>
          <p className="mb-1.5 text-xs font-medium text-text-basic">{s.label}</p>
          <Textarea
            state={s.state}
            defaultValue={s.value}
            placeholder="내용을 입력해 주세요."
            readOnly={s.state === "readonly"}
            disabled={s.state === "disabled"}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * 내용이 늘면 상자도 같이 늘어납니다 (field-sizing-content).
 * 지원하지 않는 브라우저에서는 최소 높이 100 에서 스크롤됩니다.
 */
export const 자동높이: Story = {
  render: function Auto() {
    const [v, setV] = useState("한 줄부터 시작합니다.");
    return (
      <div className="flex flex-col gap-2">
        <Textarea value={v} onChange={(e) => setV(e.target.value)} />
        <button
          type="button"
          className="w-fit text-xs text-text-primary underline underline-offset-4"
          onClick={() => setV((p) => p + "\n줄을 하나 더 넣습니다.")}
        >
          줄 추가해 보기
        </button>
      </div>
    );
  },
};

/**
 * Counter 는 기본 꺼짐입니다. 길이 제한이 있는 폼에만 켜세요 —
 * 제한이 없는데 숫자가 늘어나면 사용자를 괜히 재촉하는 셈입니다.
 */
export const 글자수: Story = {
  render: function Counter() {
    const [v, setV] = useState("");
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">maxLength 와 함께 — 12/200</p>
          <Textarea
            counter
            maxLength={200}
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="공지 내용을 입력해 주세요."
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">maxLength 없이 — 개수만</p>
          <Textarea counter defaultValue="비제어로 써도 셉니다." />
        </div>
      </div>
    );
  },
};

/**
 * FormField 의 Control 자리에 `Input` 대신 넣습니다.
 *
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 * `FormField` 가 `useId()` 로 만든 id 를 내려주고 `<textarea>` 가 자기 `id` 로 씁니다.
 * 설명·에러도 `aria-describedby` 로 함께 묶입니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  render: function InForm() {
    const [v, setV] = useState("");
    const error = v.trim() === "" ? "소견을 입력해 주세요." : undefined;
    return (
      <FormField
        label="판독 소견"
        required
        description="검사 결과에 대한 소견을 남깁니다."
        error={error}
      >
        <Textarea
          counter
          maxLength={500}
          state={error ? "error" : "default"}
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="소견을 입력해 주세요."
        />
      </FormField>
    );
  },
};
