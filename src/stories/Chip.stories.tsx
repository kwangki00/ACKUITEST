import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { design, figma } from "./figma";

/**
 * Figma: Chip — 6 변형 (Size 3 × State 2)
 *
 * 제거 가능한 태그입니다. Badge 와 높이 축이 같아 나란히 놓아도 맞습니다.
 * 지울 수 없는 것은 Chip 이 아니라 Badge 입니다.
 */
const meta = {
  title: "Display/Chip",
  component: Chip,
  parameters: { layout: "padded", ...design(figma.chip) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "혈액검사", size: "default" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: (args) => <Chip {...args} onRemove={() => {}} />,
};

/** 높이는 Badge 와 같은 축입니다 — sm 20 · default 24 · lg 28. */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-text-subtle">{s}</span>
          <Chip size={s} onRemove={() => {}}>
            혈액검사
          </Chip>
          <Chip size={s}>읽기 전용</Chip>
          <Chip size={s} disabled onRemove={() => {}}>
            비활성
          </Chip>
        </div>
      ))}
    </div>
  ),
};

/**
 * Badge 와 나란히 — 높이는 같고 모서리가 다릅니다.
 * Chip 은 sm(4), Badge 는 full. 지울 수 있는지 없는지가 모양으로 구분됩니다.
 */
export const Badge와의차이: Story = {
  parameters: { layout: "padded", ...design(figma.chip) },
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-xs font-medium text-text-basic">Chip</span>
        <Chip onRemove={() => {}}>혈액검사</Chip>
        <span className="text-2xs text-text-subtle">사용자가 지울 수 있음 · 모서리 4</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-xs font-medium text-text-basic">Badge</span>
        <Badge tone="success">판독 완료</Badge>
        <span className="text-2xs text-text-subtle">상태를 보여주기만 함 · 모서리 full</span>
      </div>
    </div>
  ),
};

/** 적용된 조회 조건을 칩으로 보여주고 하나씩 지웁니다. */
export const 필터태그: Story = {
  parameters: { layout: "padded", ...design(figma.chip) },
  render: function Filters() {
    const [items, setItems] = useState([
      "기간 3개월",
      "혈액검사",
      "판독 완료",
      "본원 채혈실",
      "이상 수치만",
    ]);
    return (
      <div className="flex max-w-md flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <Chip key={it} onRemove={() => setItems((p) => p.filter((x) => x !== it))}>
              {it}
            </Chip>
          ))}
          {items.length === 0 && (
            <span className="text-xs text-text-muted-foreground">적용된 조건이 없습니다.</span>
          )}
        </div>
        {items.length < 5 && (
          <button
            type="button"
            className="w-fit text-xs text-text-primary underline underline-offset-4"
            onClick={() => setItems(["기간 3개월", "혈액검사", "판독 완료", "본원 채혈실", "이상 수치만"])}
          >
            되돌리기
          </button>
        )}
      </div>
    );
  },
};

/** 라벨이 길면 잘립니다 — 칩이 줄을 밀어내지 않게. */
export const 긴라벨: Story = {
  render: () => (
    <div className="flex w-64 flex-wrap gap-2">
      <Chip onRemove={() => {}}>일반혈액검사 (CBC with differential count)</Chip>
      <Chip onRemove={() => {}}>짧음</Chip>
    </div>
  ),
};
