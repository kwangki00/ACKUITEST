import type { Meta, StoryObj } from "@storybook/react";
import { Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: Badge — 54 변형 (Tone 6 × Style 3 × Size 3)
 *
 * 상태를 글자로 정확히 알려야 할 때 씁니다.
 * 목록이 길어 세로로 훑어야 하면 점(dot)만 두는 편이 빠릅니다 — 둘 다 켜지 마세요.
 * Chip 과 같은 사이즈 축(sm 20 · default 24 · lg 28)이라 나란히 놓아도 맞습니다.
 */
const meta = {
  title: "Display/Badge",
  component: Badge,
  parameters: { ...design(figma.badge) },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "primary", "info", "success", "warning", "danger"],
    },
    styleVariant: { control: "inline-radio", options: ["soft", "solid", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "완료", tone: "success", styleVariant: "soft", size: "default" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = ["neutral", "primary", "info", "success", "warning", "danger"] as const;

export const 기본: Story = { parameters: { ...argsSource } };

/** Soft 가 기본입니다. Solid 는 강조가 꼭 필요할 때만. */
export const 전체: Story = {
  parameters: { layout: "padded", ...design(figma.badge) },
  render: () => (
    <div className="flex flex-col gap-3">
      {(["soft", "solid", "outline"] as const).map((sv) => (
        <div key={sv} className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-text-subtle">{sv}</span>
          {TONES.map((t) => (
            <Badge key={t} tone={t} styleVariant={sv}>
              {t}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 검사 상태에 쓰는 조합입니다. */
export const 검사상태: Story = {
  parameters: { layout: "padded", ...design(figma.badge) },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="success" size="sm">완료</Badge>
      <Badge tone="warning" size="sm">진행중</Badge>
      <Badge tone="danger" size="sm">재검</Badge>
      <Badge tone="neutral" size="sm">미접수</Badge>
    </div>
  ),
};

/**
 * **아이콘 크기는 배지가 정합니다** — sm 12 · default 14 · lg 16. 안 정하면 lucide
 * 기본값 24 로 나와 배지보다 커집니다. **호출부에서 `size-*` 를 주지 마세요.**
 *
 * 값만으로는 무엇인지 모르는 자리에 씁니다 — 아래 `이검사`(담당자)와 `김지훈`(검색어)은
 * 둘 다 사람 이름이라, 아이콘이 없으면 어느 쪽이 무엇인지 알 수 없습니다
 * (`FilterBar` 의 접힌 조건 칩이 그 자리입니다).
 *
 * **`dot` 과 함께 켜지 마세요** — 앞에 붙는 표식이 둘이 됩니다.
 */
export const 아이콘: Story = {
  parameters: { layout: "padded", ...design(figma.badge) },
  render: () => (
    <div className="flex flex-col gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-text-subtle">{size}</span>
          <Badge tone="neutral" size={size}>
            <User />
            이검사
          </Badge>
          <Badge tone="neutral" size={size}>
            <Search />
            김지훈
          </Badge>
          <Badge tone="neutral" size={size}>
            2026-07-14 ~ 2026-08-13
          </Badge>
        </div>
      ))}
    </div>
  ),
};
