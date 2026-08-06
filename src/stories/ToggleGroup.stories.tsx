import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, LayoutGrid, List, Table2 } from "lucide-react";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import { design, figma } from "./figma";

/**
 * Figma: ToggleGroup(8) + ToggleItem(32 — Variant 2 × Size 4 × State 4)
 *
 * 누르는 즉시 반영되는 세그먼트 컨트롤입니다. 저장 버튼이 없습니다.
 * 아래 영역이 통째로 바뀌면 Tabs, 조회 조건만 바뀌면 ToggleGroup 입니다.
 */
const meta = {
  title: "Controls/ToggleGroup",
  component: ToggleGroup,
  parameters: { ...design(figma.toggleGroup) },
  argTypes: {
    variant: { control: "inline-radio", options: ["pill", "outline"] },
    size: { control: "inline-radio", options: ["xs", "sm", "default", "lg"] },
    type: { control: "inline-radio", options: ["single", "multiple"] },
    disabled: { control: "boolean" },
  },
  args: { variant: "pill", size: "default", type: "single" },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const PERIODS = [
  { v: "1m", label: "1개월" },
  { v: "3m", label: "3개월" },
  { v: "6m", label: "6개월" },
];

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState("3m");
    return (
      <ToggleGroup {...args} value={v} onValueChange={setV} aria-label="조회 기간">
        {PERIODS.map((p) => (
          <ToggleItem key={p.v} value={p.v}>
            {p.label}
          </ToggleItem>
        ))}
      </ToggleGroup>
    );
  },
};

/** Pill 은 회색 리스트 위 흰 알약, Outline 은 테두리가 이어진 세그먼트입니다. */
export const Variant: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: function V() {
    const [a, setA] = useState("3m");
    const [b, setB] = useState("3m");
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">pill</p>
          <ToggleGroup value={a} onValueChange={setA} aria-label="조회 기간">
            {PERIODS.map((p) => (
              <ToggleItem key={p.v} value={p.v}>
                {p.label}
              </ToggleItem>
            ))}
          </ToggleGroup>
          <p className="mt-2 text-2xs text-text-subtle">
            선택 알약과 리스트 배경의 대비가 1.24:1 뿐이라 그림자(shadow/xs)가 형태를 만듭니다.
            빼면 구분이 안 됩니다.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">outline</p>
          <ToggleGroup variant="outline" value={b} onValueChange={setB} aria-label="조회 기간">
            {PERIODS.map((p) => (
              <ToggleItem key={p.v} value={p.v}>
                {p.label}
              </ToggleItem>
            ))}
          </ToggleGroup>
          <p className="mt-2 text-2xs text-text-subtle">
            항목끼리 테두리를 1px 겹쳐 사이가 두꺼워지지 않게 하고, 선택 항목을 위로 올려
            좌우가 끊기지 않게 합니다.
          </p>
        </div>
      </div>
    );
  },
};

/** 높이가 --h-input-* 이라 Input·Button 과 줄이 맞습니다. */
export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: function S() {
    const [v, setV] = useState("3m");
    const SIZES = ["xs", "sm", "default", "lg"] as const;
    return (
      <div className="flex flex-col gap-6">
        {(["pill", "outline"] as const).map((variant) => (
          <section key={variant} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-basic">{variant}</h3>
            {SIZES.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-text-subtle">{s}</span>
                <ToggleGroup
                  variant={variant}
                  size={s}
                  value={v}
                  onValueChange={setV}
                  aria-label={`조회 기간 ${s}`}
                >
                  {PERIODS.map((p) => (
                    <ToggleItem key={p.v} value={p.v}>
                      {p.label}
                    </ToggleItem>
                  ))}
                </ToggleGroup>
              </div>
            ))}
          </section>
        ))}
      </div>
    );
  },
};

/** 아이콘만 넣을 때는 aria-label 이 필수입니다. */
export const 아이콘: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: function I() {
    const [view, setView] = useState("table");
    return (
      <div className="flex flex-col gap-3">
        <ToggleGroup variant="outline" value={view} onValueChange={setView} aria-label="보기 방식">
          <ToggleItem value="table" aria-label="표로 보기">
            <Table2 />
          </ToggleItem>
          <ToggleItem value="list" aria-label="목록으로 보기">
            <List />
          </ToggleItem>
          <ToggleItem value="grid" aria-label="카드로 보기">
            <LayoutGrid />
          </ToggleItem>
        </ToggleGroup>
        <ToggleGroup value={view} onValueChange={setView} aria-label="보기 방식">
          <ToggleItem value="table">
            <Table2 />표
          </ToggleItem>
          <ToggleItem value="list">
            <List />
            목록
          </ToggleItem>
          <ToggleItem value="grid">
            <LayoutGrid />
            카드
          </ToggleItem>
        </ToggleGroup>
      </div>
    );
  },
};

/** 서식 툴바처럼 여러 개를 동시에 켤 때는 type="multiple" 입니다. */
export const 다중선택: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: function M() {
    const [v, setV] = useState<string[]>(["left"]);
    return (
      <div className="flex flex-col gap-3">
        <ToggleGroup
          variant="outline"
          type="multiple"
          value={v}
          onValueChange={setV as never}
          aria-label="정렬"
        >
          <ToggleItem value="left" aria-label="왼쪽 정렬">
            <AlignLeft />
          </ToggleItem>
          <ToggleItem value="center" aria-label="가운데 정렬">
            <AlignCenter />
          </ToggleItem>
          <ToggleItem value="right" aria-label="오른쪽 정렬">
            <AlignRight />
          </ToggleItem>
        </ToggleGroup>
        <p className="text-2xs text-text-subtle">켜진 값: {v.length ? v.join(" · ") : "없음"}</p>
        <p className="text-2xs text-text-muted-foreground">
          single 은 radiogroup, multiple 은 누름 버튼 묶음으로 읽힙니다 — 스크린리더가
          구분하도록 role 이 달라집니다.
        </p>
      </div>
    );
  },
};

export const 비활성: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup value="3m" disabled aria-label="조회 기간">
        {PERIODS.map((p) => (
          <ToggleItem key={p.v} value={p.v}>
            {p.label}
          </ToggleItem>
        ))}
      </ToggleGroup>
      <ToggleGroup variant="outline" value="3m" disabled aria-label="조회 기간">
        {PERIODS.map((p) => (
          <ToggleItem key={p.v} value={p.v}>
            {p.label}
          </ToggleItem>
        ))}
      </ToggleGroup>
    </div>
  ),
};

/**
 * 선택된 칩이 지금 값과 맞지 않으면 거짓 정보가 됩니다.
 * 사용자가 날짜를 직접 지정해 어느 칩과도 안 맞으면 선택을 풀어야 합니다.
 */
export const 선택없음: Story = {
  parameters: { layout: "padded", ...design(figma.toggleGroup) },
  render: function None() {
    const [v, setV] = useState<string>("");
    return (
      <div className="flex flex-col gap-3">
        <ToggleGroup variant="outline" value={v} onValueChange={setV} aria-label="조회 기간">
          {PERIODS.map((p) => (
            <ToggleItem key={p.v} value={p.v}>
              {p.label}
            </ToggleItem>
          ))}
        </ToggleGroup>
        <p className="text-2xs text-text-subtle">
          {v ? `선택: ${v}` : "선택 없음 — 사용자가 기간을 직접 지정한 상태"}
        </p>
        <button
          type="button"
          className="w-fit text-xs text-text-primary underline underline-offset-4"
          onClick={() => setV("")}
        >
          직접 지정한 것으로 되돌리기
        </button>
      </div>
    );
  },
};
