import type { Meta, StoryObj } from "@storybook/react";
import { NativeSelect } from "@/components/ui/native-select";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { design, figma, argsSource } from "./figma";

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

export const 기본: Story = { parameters: { ...argsSource } };

export const Placeholder: Story = {
  parameters: { ...argsSource },
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

/**
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 * `FormField` 가 `useId()` 로 만든 id 를 내려주고 ``<select>`` 이(가) 자기 `id` 로 씁니다
 * (`<label for>` 의 짝). 설명·에러도 `aria-describedby` 로 함께 묶입니다.
 *
 * **연결을 호출부에 시키면 반드시 빠집니다** — 이 저장소도 60곳 중 26곳만 넘기고
 * 있었고, 나머지는 스크린리더로 가면 무엇을 입력하는 칸인지 안 읽혔습니다.
 * 화면은 멀쩡해서 알아챌 방법이 없습니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  decorators: [],
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-56 flex-col gap-4">
      <FormField label="검사 분류" description="분류를 고르면 항목이 좁혀집니다.">
        <NativeSelect defaultValue="all">
          <option value="all">전체</option>
          <option value="blood">혈액검사</option>
          <option value="urine">소변검사</option>
        </NativeSelect>
      </FormField>
      <FormField label="검사 분류" required error="검사 분류를 선택해 주세요.">
        <NativeSelect state="error" placeholder="선택하세요" defaultValue="">
          <option value="blood">혈액검사</option>
          <option value="urine">소변검사</option>
        </NativeSelect>
      </FormField>
    </div>
  ),
};
