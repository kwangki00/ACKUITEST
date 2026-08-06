import type { Meta, StoryObj } from "@storybook/react";
import { Download, Plus, Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { design, figma } from "./figma";

/**
 * Figma: Button — 224 변형 (Variant 7 × Size 8 × State 2 × Shape 2)
 *
 * 화면의 주 액션에만 `default` 를 씁니다. 한 화면에 하나만.
 * 삭제처럼 되돌릴 수 없는 동작에만 `destructive` 를 쓰고,
 * 되돌릴 수 있으면 `outline` 으로 충분합니다.
 */
const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: { ...design(figma.button) },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"],
      description: "화면에서의 무게. 주 액션은 default 하나만.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon-xs", "icon-sm", "icon", "icon-lg"],
      description: "높이는 --h-input-* 변수라 모바일에서 커집니다.",
    },
    shape: { control: "inline-radio", options: ["default", "pill"] },
    loading: { control: "boolean", description: "스피너가 라벨 앞에 붙습니다." },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "버튼", variant: "default", size: "default", shape: "default" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;

/** 7가지 무게를 나란히 봅니다. */
export const Variant: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

/** 툴바 40 · 폼 36 · 모바일 주 액션 48. */
export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((s) => (
        <Button key={s} {...args} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

/** 아이콘만 있는 버튼은 aria-label 이 필수입니다. */
export const 아이콘: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-sm" variant="outline" aria-label="검색">
        <Search className="size-4" />
      </Button>
      <Button size="icon" variant="outline" aria-label="다운로드">
        <Download className="size-4" />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="인쇄">
        <Printer className="size-5" />
      </Button>
      <Button variant="outline">
        <Plus className="size-4" />
        추가
      </Button>
    </div>
  ),
};

/** Disabled 는 opacity 가 아니라 토큰으로 표현합니다. 겹친 요소가 비치지 않습니다. */
export const 상태: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>기본</Button>
      <Button disabled>비활성</Button>
      <Button loading>저장 중</Button>
      <Button variant="outline" disabled>
        비활성
      </Button>
      <Button variant="outline" loading>
        조회 중
      </Button>
    </div>
  ),
};

/** 전체 조합. Figma 세트와 대조할 때 씁니다. */
export const 전체: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: () => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((v) => (
        <div key={v} className="flex flex-wrap items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-text-subtle">{v}</span>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s}>
              버튼
            </Button>
          ))}
          <Button variant={v} disabled>
            비활성
          </Button>
        </div>
      ))}
    </div>
  ),
};
