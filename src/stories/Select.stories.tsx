import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

/**
 * Figma: SelectTrigger — Render=Placeholder · Text
 *
 * Figma 구조를 그대로 옮긴 단일 선택입니다.
 * 트리거는 `SelectTrigger`, 목록은 Popover + ListItem — **목록도 토큰대로 그립니다.**
 *
 * 가르는 축은 **값이 하나냐 배열이냐**입니다. 검색은 그 안의 옵션입니다.
 *
 * | | 검색 없음 | 검색 있음 |
 * |---|---|---|
 * | **단일** `value: string` | **Select** (이 컴포넌트) | `Combobox` |
 * | **다중** `value: string[]` | `Combobox type="multi" searchable={false}` | `Combobox type="multi"` |
 *
 * 하나로 합치지 않은 이유는 `value` 가 `string | string[]` 유니온이 되기 때문입니다 —
 * 항목 3개짜리 드롭다운 하나 놓으려고 배열을 다루게 됩니다.
 * 여기에는 검색 상태·필터링·빈 결과 처리가 아예 없어 그만큼 가볍습니다.
 *
 * 트리거 껍데기(`SelectTrigger`)는 넷 다 같습니다 — 크기·상태·색이 어긋나지 않습니다.
 *
 * 그 밖에 —
 * 라벨·설명·에러가 필요하면 `FormField` 로 감싸고,
 * 모바일 OS 선택기가 필요하면 `NativeSelect` 를 쓰세요 (**목록 모양이 디자인과 다릅니다**).
 *
 * 검색창이 없다는 것만 빼면 `Combobox` 와 같은 패널입니다.
 * 항목이 수십 개를 넘으면 `Combobox` 로 바꾸세요 — 눈으로 훑기 어려워집니다.
 */
const meta = {
  title: "Controls/Select",
  component: Select,
  parameters: { layout: "padded", ...design(figma.selectTrigger) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    placeholder: { control: "text" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    // ReactNode 는 컨트롤을 끕니다 — 켜두면 object 편집기가 붙고,
    // 건드리는 순간 빈 객체 {} 가 children 으로 들어가 렌더가 깨집니다
    leadingIcon: { control: false, description: "트리거 앞 아이콘" },
  },
  args: { size: "default", state: "default", options: [], onValueChange: () => {} },
  decorators: [(S) => <div className="w-56">{S()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const TESTS = [
  { value: "all", label: "전체" },
  { value: "blood", label: "혈액검사" },
  { value: "urine", label: "소변검사" },
  { value: "img", label: "영상의학" },
  { value: "hold", label: "보류 항목", disabled: true },
];

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<string | undefined>("all");
    return <Select {...args} options={TESTS} value={v} onValueChange={setV} />;
  },
};

/** 값이 없으면 무엇을 고르는지 알려줍니다. */
export const Placeholder: Story = {
  render: function P() {
    const [v, setV] = useState<string | undefined>(undefined);
    return (
      <Select
        options={TESTS}
        value={v}
        onValueChange={setV}
        placeholder="검사 항목을 선택하세요"
      />
    );
  },
};

/** 높이는 Input · Button 과 같은 `--h-input-*` 입니다. */
export const Size: Story = {
  decorators: [],
  render: function S() {
    const [v, setV] = useState<string | undefined>("all");
    return (
      <div className="flex flex-col gap-4">
        {(["sm", "default", "lg"] as const).map((z) => (
          <div key={z} className="w-56">
            <p className="mb-1.5 text-xs font-medium text-text-basic">{z}</p>
            <Select size={z} options={TESTS} value={v} onValueChange={setV} />
          </div>
        ))}
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">
            grid — 표 셀에 녹아 있다가 클릭하면 나타납니다
          </p>
          <div className="w-56 rounded-md border border-table-border">
            <div className="flex h-[var(--h-datagrid)] items-center px-3 text-sm hover:bg-table-row-hover">
              일반 셀
            </div>
            <div className="hover:bg-table-row-hover">
              <Select size="grid" options={TESTS} value={v} onValueChange={setV} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/** Input · Textarea 와 같은 상태 축입니다. */
export const State: Story = {
  decorators: [],
  render: function St() {
    const [v, setV] = useState<string | undefined>(undefined);
    const error = v == null ? "검사 항목을 선택해 주세요." : undefined;
    return (
      <div className="flex flex-col gap-4">
        <div className="w-56">
          <FormField label="검사 항목" required error={error}>
            <Select
              state={error ? "error" : "default"}
              options={TESTS}
              value={v}
              onValueChange={setV}
            />
          </FormField>
        </div>
        {(["readonly", "disabled"] as const).map((s) => (
          <div key={s} className="w-56">
            <p className="mb-1.5 text-xs font-medium text-text-basic">{s}</p>
            <Select
              state={s}
              disabled={s === "disabled"}
              options={TESTS}
              value="all"
              onValueChange={() => {}}
            />
          </div>
        ))}
      </div>
    );
  },
};

/** 앞 아이콘과 전체 해제. 필수 항목에는 해제를 켜지 마세요. */
export const 아이콘과해제: Story = {
  render: function Extra() {
    const [v, setV] = useState<string | undefined>("blood");
    return (
      <Select
        leadingIcon={<FlaskConical />}
        clearable
        options={TESTS}
        value={v}
        onValueChange={(x) => setV(x || undefined)}
      />
    );
  },
};

/**
 * 목록은 `ListItem` 입니다 — 높이 32 · 선택 표시는 우측 체크.
 * 비활성 항목은 고를 수 없습니다.
 */
export const 목록모양: Story = {
  render: function List() {
    const [v, setV] = useState<string | undefined>("blood");
    return (
      <div className="flex flex-col gap-2">
        <Select options={TESTS} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-muted-foreground">
          열어서 확인하세요. NativeSelect 와 달리 목록도 토큰대로 그려집니다.
        </p>
      </div>
    );
  },
};
