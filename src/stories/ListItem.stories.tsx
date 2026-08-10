import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FlaskConical, Microscope, Scan } from "lucide-react";
import { ListItem } from "@/components/ui/list-item";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: ListItem — 16 변형 (Type 4 × State 4)
 *
 * Popover(list) 안에 들어가는 목록 항목입니다.
 * Select 패널 · Combobox · 자동완성 · 드롭다운 메뉴가 모두 이걸 씁니다.
 */
const meta = {
  title: "Overlay/ListItem",
  component: ListItem,
  parameters: { layout: "padded", ...design(figma.listItem) },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "check", "checkbox", "match"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    query: { control: "text", description: 'type="match" 에서 진하게 표시할 부분' },
    // ReactNode 는 컨트롤을 끕니다 — 켜두면 object 편집기가 붙고,
    // 건드리는 순간 빈 객체 {} 가 children 으로 들어가 렌더가 깨집니다
    leadingIcon: { control: false },
  },
  args: { children: "일반혈액검사", type: "text" },
  decorators: [
    (S) => (
      <div className="w-70 rounded-md border border-border-gray-light bg-background-white p-1">
        {S()}
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { parameters: { ...argsSource } };

const OPTIONS = ["일반혈액검사", "소변검사", "영상의학", "병리검사"];

/** Type 4종. 무엇으로 선택을 알릴지가 갈립니다. */
export const Type: Story = {
  decorators: [(S) => <div className="max-w-2xl">{S()}</div>],
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { t: "text" as const, note: "선택 표시가 없습니다 — 메뉴 항목용" },
        { t: "check" as const, note: "단일 선택 — 우측 표식" },
        { t: "checkbox" as const, note: "다중 선택 — 좌측 박스" },
        { t: "match" as const, note: "자동완성 — 맞는 부분만 진하게" },
      ].map((x) => (
        <div key={x.t}>
          <p className="mb-1 text-xs font-medium text-text-basic">{x.t}</p>
          <p className="mb-2 text-2xs text-text-subtle">{x.note}</p>
          <div className="rounded-md border border-border-gray-light bg-background-white p-1">
            {OPTIONS.slice(0, 3).map((o, i) => (
              <ListItem key={o} type={x.t} selected={i === 1} query={x.t === "match" ? "검사" : undefined}>
                {o}
              </ListItem>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Hover · Selected · 방향키 커서의 배경이 **전부 같습니다** (Action/Accent).
 * 배경 하나가 세 가지를 뜻하므로 선택은 배경으로 알리지 않습니다 —
 * 글자를 `Text/Primary` · Medium 으로 바꾸고 표식(check · checkbox)을 켭니다.
 *
 * `text` · `match` 는 표식이 없어 목록 선택에 쓰면 안 됩니다.
 */
export const State: Story = {
  render: () => (
    <div className="flex flex-col">
      <ListItem>기본</ListItem>
      <ListItem selected>선택됨 (text) — 표식이 없어 목록 선택에는 쓰지 마세요</ListItem>
      <ListItem type="check" selected>
        선택됨 (check) — 글자 색·굵기 + 우측 체크
      </ListItem>
      <ListItem type="checkbox" selected>
        선택됨 (checkbox)
      </ListItem>
      <ListItem disabled>비활성</ListItem>
    </div>
  ),
};

/** 앞에 아이콘을 붙일 수 있습니다. */
export const 아이콘: Story = {
  render: () => (
    <div className="flex flex-col">
      <ListItem leadingIcon={<FlaskConical />}>일반혈액검사</ListItem>
      <ListItem leadingIcon={<Microscope />}>병리검사</ListItem>
      <ListItem leadingIcon={<Scan />} selected type="check">
        영상의학
      </ListItem>
    </div>
  ),
};

/**
 * match 는 라벨 안에서 맞는 구간만 진하게 합니다.
 * Figma 는 앞부분만 모델링했지만(Match + Rest) 자동완성은 가운데도 맞아야 해서
 * 위치를 찾아 나눕니다 — 앞부분이면 Figma 와 같은 결과입니다.
 */
export const 자동완성: Story = {
  decorators: [(S) => <div className="w-70">{S()}</div>],
  render: function Auto() {
    const [q, setQ] = useState("검사");
    const ALL = ["일반혈액검사", "소변검사", "영상의학", "병리검사", "혈액배양검사"];
    const hits = ALL.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="flex flex-col gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검사명 검색" />
        <div className="rounded-md border border-border-gray-light bg-background-white p-1 shadow-md">
          {hits.length ? (
            hits.map((o) => (
              <ListItem key={o} type="match" query={q}>
                {o}
              </ListItem>
            ))
          ) : (
            <p className="px-2 py-3 text-center text-xs text-text-muted-foreground">
              검색 결과가 없습니다
            </p>
          )}
        </div>
      </div>
    );
  },
};

/** Popover(list) 안에서의 실제 쓰임 — 단일 선택. */
export const 단일선택: Story = {
  decorators: [(S) => <div>{S()}</div>],
  render: function Single() {
    const [v, setV] = useState(OPTIONS[0]);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-56 justify-between">
            {v}
          </Button>
        </PopoverTrigger>
        <PopoverContent type="list" role="listbox">
          {OPTIONS.map((o) => (
            <ListItem key={o} type="check" selected={o === v} onClick={() => setV(o)}>
              {o}
            </ListItem>
          ))}
        </PopoverContent>
      </Popover>
    );
  },
};

/** 다중 선택 — 박스는 표시만 하고, 누름 대상은 행 전체입니다. */
export const 다중선택: Story = {
  decorators: [(S) => <div>{S()}</div>],
  render: function Multi() {
    const [v, setV] = useState<string[]>([OPTIONS[0]]);
    const toggle = (o: string) =>
      setV((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));
    return (
      <div className="flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56 justify-between">
              {v.length ? `${v.length}개 선택` : "선택하세요"}
            </Button>
          </PopoverTrigger>
          <PopoverContent type="list" role="listbox" aria-multiselectable>
            {OPTIONS.map((o) => (
              <ListItem key={o} type="checkbox" selected={v.includes(o)} onClick={() => toggle(o)}>
                {o}
              </ListItem>
            ))}
          </PopoverContent>
        </Popover>
        <p className="text-2xs text-text-subtle">{v.join(" · ") || "없음"}</p>
        <p className="max-w-md text-2xs text-text-muted-foreground">
          안의 박스는 &lt;input&gt; 이 아니라 표시용입니다. 진짜 입력을 넣으면 Tab 이
          한 줄에서 두 번 멈춥니다.
        </p>
      </div>
    );
  },
};
