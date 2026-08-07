import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChartColumn, ClipboardList, FileText, Mail, Settings } from "lucide-react";
import { TabItem, TabPanel, Tabs } from "@/components/ui/tabs";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { design, figma } from "./figma";

const FILTERS = [
  { value: "all", label: "전체", count: 979 },
  { value: "todo", label: "미보고", count: 12 },
  { value: "done", label: "완료", count: 967 },
];

/**
 * Figma: Tabs (12 변형) · TabItem (48 변형 — Variant 3 × Size 4 × State 4)
 *
 * `Tabs` 는 **목록 껍데기**이고 `TabItem` 이 개별 탭입니다 (Figma 이름 그대로).
 * `TabPanel` 은 코드에만 있는 짝입니다 — Figma 는 탭 목록까지만 그립니다.
 *
 * ### 세 가지 Variant
 *
 * | | 언제 | 활성 표시 |
 * |---|---|---|
 * | `line` | **화면 상단의 주 탭** | 밑줄 2px + SemiBold |
 * | `pill` | 목록 위 필터처럼 중립적인 전환 | 흰 알약 + **그림자** |
 * | `pill-primary` | 브랜드 강조가 필요할 때 | Primary 채움 + 흰 글자 |
 *
 * **`pill` 의 그림자는 장식이 아닙니다** — 활성 알약(흰색)과 바탕의 대비가 1.24:1 이라
 * 빼면 어느 것이 켜져 있는지 구분되지 않습니다.
 *
 * ### 굵기는 `line` 만 바뀝니다
 *
 * 알약은 배경이 이미 말하고 있어 굵기까지 바꾸면 **글자 폭이 변해 옆 탭이 밀립니다.**
 *
 * ### `<button>` 이 아니라 `<div role="tab">` 입니다
 *
 * `closable` 을 켜면 탭 안에 닫기 버튼이 들어갑니다 — **버튼 안의 버튼은 잘못된 HTML**
 * 이라 브라우저가 마크업을 재배치합니다 (`SelectTrigger` 와 같은 이유).
 *
 * ### 키보드
 *
 * 목록 전체가 **탭 정지 하나**입니다. 좌우 방향키로 옮기고 그때 바로 전환됩니다.
 * `Home`·`End` 는 처음·끝, **`Delete` 는 닫기**(`closable` 인 탭만).
 *
 * ### 그 밖
 *
 * - 높이는 `--h-input-*` — Input·Button 과 맞고 **모바일에서 자동으로 커집니다**
 * - **`line` 은 `xs`·`sm` 을 피하세요** — 밑줄과 라벨 사이가 좁아 답답합니다
 * - **탭이 6개를 넘으면** 스크롤(`scrollable`)이나 드롭다운 전환을 검토하세요
 */
const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: { layout: "padded", ...design(figma.tabs) },
  argTypes: {
    variant: { control: "inline-radio", options: ["line", "pill", "pill-primary"] },
    size: { control: "inline-radio", options: ["xs", "sm", "default", "lg"] },
    scrollable: { control: "boolean" },
    label: { control: "text" },
    value: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
  args: { value: "all", onValueChange: () => {}, children: null },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 방향키로 옮겨 보세요 — 목록 전체가 탭 정지 하나입니다. */
export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState("all");
    return (
      <div className="w-[560px]">
        <Tabs {...args} value={v} onValueChange={setV} label="조회 결과 필터">
          {FILTERS.map((f) => (
            <TabItem key={f.value} value={f.value} label={f.label} count={f.count} />
          ))}
        </Tabs>
        <TabPanel value={v} className="pt-4 text-sm text-text-subtle">
          {FILTERS.find((f) => f.value === v)?.label} — {FILTERS.find((f) => f.value === v)?.count}건
        </TabPanel>
      </div>
    );
  },
};

/**
 * `pill` 의 활성 알약은 **흰색 + 그림자**입니다. 그림자를 빼면 바탕과 대비가 1.24:1 이라
 * 사실상 구분되지 않습니다.
 */
export const 변형: Story = {
  name: "변형 3종",
  render: function Variants() {
    const [v, setV] = useState<Record<string, string>>({ line: "all", pill: "all", pp: "all" });
    const rows = [
      ["line", "line", "화면 상단의 주 탭"],
      ["pill", "pill", "목록 위 필터 — 중립"],
      ["pill-primary", "pp", "브랜드 강조"],
    ] as const;
    return (
      <div className="flex w-[560px] flex-col gap-6">
        {rows.map(([variant, key, desc]) => (
          <div key={key}>
            <p className="mb-2 text-xs text-text-subtle">
              <code>{variant}</code> — {desc}
            </p>
            <Tabs
              variant={variant}
              value={v[key]}
              onValueChange={(x) => setV({ ...v, [key]: x })}
              className={variant === "line" ? "" : "w-fit"}
            >
              {FILTERS.map((f) => (
                <TabItem key={f.value} value={f.value} label={f.label} />
              ))}
            </Tabs>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 높이가 `--h-input-*` 이라 **Input·Button 과 나란히 놓아도 맞습니다.**
 * 모바일에서는 자동으로 커집니다 (xs 24→28 · sm 32→36 · default 36→40 · lg 48→52).
 *
 * **`line` 은 `xs`·`sm` 을 피하세요** — 밑줄과 라벨 사이가 좁아 답답합니다.
 */
export const 사이즈: Story = {
  render: function Sizes() {
    const [v, setV] = useState("all");
    return (
      <div className="flex w-[560px] flex-col gap-5">
        {(["xs", "sm", "default", "lg"] as const).map((size) => (
          <div key={size}>
            <p className="mb-2 text-xs text-text-subtle">{size}</p>
            <Tabs variant="pill" size={size} value={v} onValueChange={setV} className="w-fit">
              {FILTERS.map((f) => (
                <TabItem key={f.value} value={f.value} label={f.label} />
              ))}
            </Tabs>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 아이콘은 **뜻이 바로 오지 않으면 넣지 마세요** — 라벨이 이미 말하고 있습니다.
 * 건수는 `진행중 12` 처럼 읽힙니다.
 *
 * 비활성 탭은 눌리지 않고 방향키도 건너뜁니다.
 */
export const 아이콘과건수: Story = {
  name: "아이콘 · 건수 · 비활성",
  render: function Rich() {
    const [v, setV] = useState("result");
    return (
      <div className="w-[560px]">
        <Tabs value={v} onValueChange={setV}>
          <TabItem value="result" label="검사결과" icon={<ClipboardList />} count={128} />
          <TabItem value="history" label="검사이력" icon={<FileText />} count={12} />
          <TabItem value="stats" label="통계" icon={<ChartColumn />} />
          <TabItem value="sms" label="SMS 발송" icon={<Mail />} disabled />
        </Tabs>
      </div>
    );
  },
};

/**
 * **PC 화면의 MDI 탭바**입니다 — 열어둔 화면 목록이라 탭마다 닫기가 붙습니다.
 * 개수를 미리 알 수 없어 `scrollable` 로 가로 스크롤합니다.
 *
 * 닫기를 눌러 보세요. **닫는 탭이 현재 탭이면** 옆 탭으로 옮겨 갑니다 —
 * 아무것도 안 열린 화면을 보여주지 않습니다. `Delete` 로도 닫힙니다.
 *
 * `closable` 은 **고정된 화면 탭에는 쓰지 마세요** — 돌아올 수 없는 탭을 닫게 됩니다.
 */
export const MDI: Story = {
  name: "MDI 탭바 (닫기)",
  render: function Mdi() {
    const [tabs, setTabs] = useState([
      { value: "t1", label: "통합결과조회" },
      { value: "t2", label: "검사결과" },
      { value: "t3", label: "검사이력" },
      { value: "t4", label: "기간별 통계" },
      { value: "t5", label: "SMS 발송" },
      { value: "t6", label: "발송 이력" },
      { value: "t7", label: "환경설정" },
    ]);
    const [v, setV] = useState("t2");

    const close = (val: string) => {
      const i = tabs.findIndex((t) => t.value === val);
      const rest = tabs.filter((t) => t.value !== val);
      setTabs(rest);
      // 닫는 탭이 현재 탭이면 옆으로 옮깁니다 — 빈 화면을 보여주지 않습니다
      if (v === val && rest.length) setV(rest[Math.min(i, rest.length - 1)].value);
    };

    return (
      <div className="w-[560px]">
        <Tabs value={v} onValueChange={setV} size="sm" scrollable label="열린 화면">
          {tabs.map((t) => (
            <TabItem
              key={t.value}
              value={t.value}
              label={t.label}
              closable
              onClose={() => close(t.value)}
            />
          ))}
        </Tabs>
        <div className="flex h-24 items-center justify-center text-sm text-text-subtle">
          {tabs.find((t) => t.value === v)?.label ?? "열린 화면이 없습니다"}
        </div>
      </div>
    );
  },
};

/**
 * PC 껍데기의 완성형입니다 — **`Sidebar` + MDI 탭바 + 내용.**
 *
 * 사이드바에서 화면을 고르면 **탭이 새로 열리거나 이미 열린 탭으로 옮겨 갑니다.**
 * 탭바는 내용 영역 **밖**에 있습니다 — 탭을 바꾸면 자기 자신도 갈리는 모순이 생깁니다.
 */
export const PC화면: Story = {
  name: "PC 화면 (전체 조립)",
  parameters: { layout: "fullscreen" },
  render: function Screen() {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState([{ value: "검사결과", label: "검사결과" }]);
    const [v, setV] = useState("검사결과");
    const [menuOpen, setMenuOpen] = useState<string[]>(["검사관리"]);

    const groups = [
      { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
      { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
      { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
      { name: "환경설정", icon: <Settings />, items: [] },
    ];

    // 이미 열려 있으면 그 탭으로 옮기고, 없으면 새로 엽니다
    const openScreen = (name: string) => {
      setOpen((p) => (p.some((t) => t.value === name) ? p : [...p, { value: name, label: name }]));
      setV(name);
    };

    const close = (val: string) => {
      const i = open.findIndex((t) => t.value === val);
      const rest = open.filter((t) => t.value !== val);
      setOpen(rest);
      if (v === val && rest.length) setV(rest[Math.min(i, rest.length - 1)].value);
    };

    return (
      <div className="flex h-[600px] bg-surface-gray-subtle">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
          onSettings={() => {}}
          onLogout={() => {}}
        >
          {groups.map((g) => {
            const expanded = menuOpen.includes(g.name);
            const hasChild = g.items.length > 0;
            return (
              <div key={g.name} className="flex flex-col gap-0.5">
                <SidebarItem
                  icon={g.icon}
                  label={g.name}
                  active={g.items.includes(v) || (!hasChild && v === g.name)}
                  chevron={hasChild}
                  expanded={expanded}
                  onClick={() =>
                    hasChild
                      ? setMenuOpen((p) =>
                          p.includes(g.name) ? p.filter((x) => x !== g.name) : [...p, g.name]
                        )
                      : openScreen(g.name)
                  }
                />
                {expanded &&
                  g.items.map((it) => (
                    <SidebarItem
                      key={it}
                      level={2}
                      label={it}
                      active={v === it}
                      onClick={() => openScreen(it)}
                    />
                  ))}
              </div>
            );
          })}
        </Sidebar>

        {/* Workspace — 사이드바를 뺀 작업 영역 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 탭바는 내용 밖입니다 — 안에 두면 탭을 바꿀 때 자기 자신도 갈립니다 */}
          <Tabs
            value={v}
            onValueChange={setV}
            size="sm"
            scrollable
            label="열린 화면"
            className="shrink-0 bg-background-white px-2"
          >
            {open.map((t) => (
              <TabItem
                key={t.value}
                value={t.value}
                label={t.label}
                closable
                onClose={() => close(t.value)}
              />
            ))}
          </Tabs>

          <div className="flex min-h-0 flex-1 items-center justify-center p-6">
            <p className="text-sm text-text-subtle">
              {open.find((t) => t.value === v)?.label ?? "왼쪽 메뉴에서 화면을 고르세요"}
            </p>
          </div>
        </div>
      </div>
    );
  },
};
