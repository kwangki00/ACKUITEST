import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@/components/ui/avatar";
import { design, figma } from "./figma";

/**
 * Figma: Avatar — 12 변형 (Type 3 × Size 4)
 *
 * 이름이 있으면 이니셜을 우선하세요 — 아이콘보다 개인 식별이 쉽습니다.
 * 이니셜은 한글 1자 또는 영문 2자를 권장합니다.
 */
const meta = {
  title: "Display/Avatar",
  component: Avatar,
  parameters: { layout: "padded", ...design(figma.avatar) },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "default", "lg"] },
    initial: { control: "text" },
    status: { control: "inline-radio", options: [undefined, "online", "offline"] },
  },
  args: { initial: "김", size: "default" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

const SIZES = [
  { s: "xs" as const, px: 24 },
  { s: "sm" as const, px: 32 },
  { s: "default" as const, px: 40 },
  { s: "lg" as const, px: 48 },
];

/** Initial → Icon → Image 순으로 우선합니다. */
export const Type: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {[
        { label: "Initial — 이름이 있으면 이걸로", node: <Avatar initial="김" /> },
        { label: "Icon — 이름을 모를 때", node: <Avatar /> },
        {
          label: "Image — 사진이 있을 때",
          node: (
            <Avatar
              alt="김선영"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%2399c6e4'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23004e84'/%3E%3Cellipse cx='40' cy='72' rx='24' ry='26' fill='%23004e84'/%3E%3C/svg%3E"
            />
          ),
        },
      ].map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          {r.node}
          <span className="text-xs text-text-subtle">{r.label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Size: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {[
        { label: "Initial", render: (s: "xs" | "sm" | "default" | "lg") => <Avatar size={s} initial="김" /> },
        { label: "Icon", render: (s: "xs" | "sm" | "default" | "lg") => <Avatar size={s} /> },
      ].map((row) => (
        <div key={row.label} className="flex items-end gap-4">
          <span className="w-16 shrink-0 text-xs text-text-subtle">{row.label}</span>
          {SIZES.map((x) => (
            <div key={x.s} className="flex flex-col items-center gap-1.5">
              {row.render(x.s)}
              <span className="text-2xs text-text-subtle">{x.px}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 상태 점에는 흰 링 2px 이 있어 사진 위에서도 묻히지 않습니다. */
export const Status: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-4">
        {SIZES.map((x) => (
          <Avatar key={x.s} size={x.s} initial="김" status="online" />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Avatar initial="김" status="online" />
        <Avatar initial="이" status="offline" />
        <Avatar status="online" />
      </div>
      <p className="max-w-md text-2xs text-text-muted-foreground">
        상태를 색으로만 알립니다. 중요한 정보라면 옆에 글자를 함께 두세요 —
        점 자체에는 보조기술용 라벨을 달아 두었습니다.
      </p>
    </div>
  ),
};

/** 이니셜은 한글 1자 또는 영문 2자. 길면 원 밖으로 밀려납니다. */
export const 이니셜: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {["김", "KM", "이서", "ABC"].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <Avatar initial={i} />
          <span className="text-2xs text-text-subtle">{i}</span>
        </div>
      ))}
    </div>
  ),
};

/** 사이드바 푸터에서 쓰는 모습입니다. */
export const 사이드바푸터: Story = {
  parameters: { layout: "padded", ...design(figma.avatar) },
  render: () => (
    <div className="w-64 rounded-lg border border-sidebar-border bg-sidebar-surface p-3">
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" initial="김" status="online" />
        <div className="min-w-0">
          <p className="truncate text-sm text-sidebar-text">김선영</p>
          <p className="truncate text-xs text-sidebar-text-muted">진단검사의학과</p>
        </div>
      </div>
    </div>
  ),
};
