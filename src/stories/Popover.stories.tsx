import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { ListItem } from "@/components/ui/list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup, Radio } from "@/components/ui/radio";
import { design, figma } from "./figma";

/**
 * Figma: Popover — 2 변형 (Type 2)
 *
 * 떠 있는 패널입니다. Select · Combobox · DropdownMenu · DatePicker 가 모두 이 위에 얹힙니다.
 * **Radix 를 처음 들인 컴포넌트**입니다 — 위치·충돌 회피·포커스·ESC 는 Radix 가 맡고,
 * Figma 는 패널 모양만 정의합니다.
 */
const meta = {
  title: "Overlay/Popover",
  component: PopoverContent,
  parameters: { layout: "centered", ...design(figma.popover) },
  argTypes: {
    type: { control: "inline-radio", options: ["list", "content"] },
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  args: { type: "content", side: "bottom", align: "start" },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">패널 열기</Button>
      </PopoverTrigger>
      <PopoverContent {...args} className="w-70">
        <p className="text-sm font-medium text-text-basic">제목</p>
        <p className="text-xs text-text-muted-foreground">
          임의 콘텐츠가 들어가는 영역입니다. 필터 패널·날짜 선택기·설명 카드에 씁니다.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/** Type 은 여백이 다릅니다 — list 4 / content 16. */
export const Type: Story = {
  parameters: { layout: "padded", ...design(figma.popover) },
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            list — 여백 4 <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent type="list" className="w-70">
          {["전체", "혈액검사", "소변검사", "영상의학"].map((o) => (
            <ListItem key={o}>{o}</ListItem>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            content — 여백 16 <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent type="content" className="w-70">
          <p className="text-sm font-medium text-text-basic">제목</p>
          <p className="text-xs text-text-muted-foreground">임의 콘텐츠가 들어갑니다.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

/** Radix 가 위치를 잡습니다. 화면 끝에서는 알아서 반대편으로 넘어갑니다. */
export const 위치: Story = {
  parameters: { layout: "centered", ...design(figma.popover) },
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((s) => (
        <Popover key={s}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {s}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={s} align="center" className="w-56">
            <p className="text-xs text-text-basic">side=&quot;{s}&quot;</p>
            <p className="text-2xs text-text-muted-foreground">
              열린 방향에서 4px 밀려나옵니다.
            </p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

/** 목록 패널은 트리거보다 좁아지지 않습니다 — 어디에 딸린 패널인지 흐려지지 않게. */
export const 트리거폭따르기: Story = {
  parameters: { layout: "padded", ...design(figma.popover) },
  render: function W() {
    const [v, setV] = useState("전체");
    return (
      <div className="flex flex-col gap-4">
        {["w-40", "w-72"].map((w) => (
          <Popover key={w}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={`${w} justify-between`}>
                {v} <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent type="list">
              {["전체", "혈액검사", "소변검사", "영상의학"].map((o) => (
                <ListItem key={o} type="check" selected={o === v} onClick={() => setV(o)}>
                  {o}
                </ListItem>
              ))}
            </PopoverContent>
          </Popover>
        ))}
        <p className="text-2xs text-text-muted-foreground">
          Radix 가 넘겨주는 --radix-popover-trigger-width 를 min-width 로 씁니다.
        </p>
      </div>
    );
  },
};

/** 조회 조건 패널 — content 타입의 실제 쓰임입니다. */
export const 필터패널: Story = {
  parameters: { layout: "padded", ...design(figma.popover) },
  render: function FilterPanel() {
    const [period, setPeriod] = useState("3m");
    const [name, setName] = useState("");
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            상세 조건
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <FormField label="환자명">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="환자명" />
          </FormField>
          <FormField label="조회 기간">
            <RadioGroup direction="horizontal" value={period} onValueChange={setPeriod}>
              <Radio value="1m" label="1개월" />
              <Radio value="3m" label="3개월" />
              <Radio value="6m" label="6개월" />
            </RadioGroup>
          </FormField>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="outline" size="sm">
                취소
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button size="sm">적용</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

/** Figma 로 표현할 수 없는 것들 — 전부 Radix 가 담당합니다. */
export const Radix가하는일: Story = {
  parameters: { layout: "padded", ...design(figma.popover) },
  render: () => (
    <div className="flex flex-col gap-4">
      <table className="max-w-xl border-collapse text-left text-xs">
        <tbody className="text-text-basic">
          {[
            ["위치 잡기", "트리거 기준 side · align, 화면 끝에서 자동으로 반대편으로"],
            ["포커스", "열면 패널 안으로, 닫으면 트리거로 되돌림"],
            ["ESC · 바깥 클릭", "닫기"],
            ["스크롤 대응", "따라 움직이고, 남은 높이를 변수로 넘겨줌"],
            ["Portal", "부모의 overflow:hidden 에 잘리지 않게 body 로 옮김"],
          ].map(([k, v]) => (
            <tr key={k} className="border-b border-table-border">
              <td className="w-32 py-2 font-medium whitespace-nowrap">{k}</td>
              <td className="py-2 text-text-subtle">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-24 w-80 overflow-hidden rounded-md border border-border-gray-light p-3">
        <p className="mb-2 text-xs text-text-subtle">
          이 상자는 overflow:hidden 인데도 패널이 안 잘립니다
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              열어보기
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <p className="text-xs text-text-basic">Portal 로 body 에 붙었습니다.</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};
