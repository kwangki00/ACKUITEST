import type { Meta, StoryObj } from "@storybook/react";
import { Download, Printer, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: Tooltip — 4 변형 (Placement 4) + Arrow 불리언
 *
 * 아이콘만 있는 요소의 설명을 띄웁니다. 접힌 Sidebar 나 아이콘 버튼처럼
 * **라벨이 없는 곳에 필수**입니다.
 *
 * ### aria-label 과 무엇이 다른가
 *
 * | | 누가 읽나 |
 * |---|---|
 * | `aria-label` | 보조기술만 — 눈으로 보는 사람에게는 아무 단서가 없습니다 |
 * | Tooltip | 눈으로 보는 사람만 — 마우스를 올려야 하고, 터치 기기에는 아예 없습니다 |
 *
 * 겹치는 사람이 없습니다. **아이콘 버튼에는 둘 다 필요합니다.**
 *
 * ### 쓰지 말아야 할 곳
 *
 * - **터치 기기에서만 볼 수 있는 정보** — hover 가 없어 영영 안 보입니다
 * - **여러 줄 설명** — `Popover type="content"` 를 쓰세요. 한 줄 라벨용입니다
 * - **이미 글자가 있는 버튼** — 라벨을 두 번 말하는 셈입니다
 *
 * ### Placement 는 화살표 방향일 뿐입니다
 *
 * 실제 위치와 충돌 회피는 Radix 가 정합니다 — 화면 끝에서는 반대편으로 뒤집힙니다.
 * `side` 는 희망 방향이고 보장이 아닙니다.
 */
const meta = {
  title: "Overlay/Tooltip",
  component: TooltipContent,
  parameters: { layout: "centered", ...design(figma.tooltip) },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "bottom", "left", "right"],
      description: "희망 방향. 자리가 없으면 Radix 가 뒤집습니다.",
    },
    arrow: { control: "boolean", description: "화살표 12×6. 끄면 말풍선만." },
    children: { control: "text" },
  },
  args: { children: "검사관리", side: "top", arrow: true },
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" aria-label="검사관리">
          <Search />
        </Button>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { parameters: { ...argsSource } };

/** 네 방향. 자리가 없으면 Radix 가 알아서 뒤집으니 희망일 뿐입니다. */
export const Placement: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-6 py-16">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side} open>
          <TooltipTrigger asChild>
            <Button variant="outline">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>검사관리</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** 화살표를 끄면 말풍선만 뜹니다. 어디에 딸린 설명인지 흐려지니 기본은 켜둡니다. */
export const 화살표: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center justify-center gap-10 py-14">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">있음</Button>
        </TooltipTrigger>
        <TooltipContent>검사관리</TooltipContent>
      </Tooltip>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">없음</Button>
        </TooltipTrigger>
        <TooltipContent arrow={false}>검사관리</TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * 실제 쓰임 — 툴바의 아이콘 버튼입니다.
 *
 * 하나에 마우스를 올린 뒤 옆으로 옮기면 **기다리지 않고 바로 뜹니다.**
 * `TooltipProvider` 의 `skipDelayDuration` 이 하는 일입니다 —
 * 없으면 버튼마다 400ms 를 다시 기다려서 툴바를 훑기가 답답합니다.
 */
export const 툴바: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-1 rounded-md border border-border-gray-light bg-background-white p-1">
      {[
        { icon: <Search />, label: "조회" },
        { icon: <Download />, label: "엑셀 내려받기" },
        { icon: <Printer />, label: "인쇄" },
        { icon: <Share2 />, label: "공유" },
      ].map(({ icon, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label={label}>
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * 긴 문구는 `max-w-56` 에서 줄바꿈됩니다.
 * 다만 **여기까지 오면 툴팁이 아닙니다** — 설명이 두 줄을 넘으면
 * `Popover type="content"` 로 옮기세요. 마우스를 치우면 사라지는 곳에
 * 읽어야 할 내용을 두면 안 됩니다.
 */
export const 긴문구: Story = {
  name: "긴 문구",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex justify-center py-16">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">이렇게 쓰지 마세요</Button>
        </TooltipTrigger>
        <TooltipContent>
          병원 출력금지로 지정된 항목은 목록에서 제외됩니다. 지정은 검사관리에서 바꿉니다.
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
