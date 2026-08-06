import type { Meta, StoryObj } from "@storybook/react";
import { CheckMark } from "@/components/ui/check-mark";
import { Checkbox } from "@/components/ui/checkbox";
import { design, figma } from "./figma";

/**
 * Figma: CheckMark — 9 변형 (Size 3 × Tone 3)
 *
 * 박스 없는 순수 표식입니다. Checkbox 와 헷갈리기 쉬운데 역할이 반대입니다.
 * Checkbox 는 누르는 것, CheckMark 는 보여주는 것입니다.
 * 누를 수 있어야 하면 Checkbox 를 쓰세요.
 */
const meta = {
  title: "Controls/CheckMark",
  component: CheckMark,
  parameters: { ...design(figma.checkMark) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    tone: { control: "inline-radio", options: ["primary", "success", "disabled"] },
  },
  args: { size: "default", tone: "primary" },
} satisfies Meta<typeof CheckMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

const SIZES = [
  { s: "sm", px: 14, use: "표 · 목록 안" },
  { s: "default", px: 16, use: "Select · Combobox 항목" },
  { s: "lg", px: 20, use: "완료 화면 · 단독 표시" },
] as const;

const TONES = [
  { t: "primary", token: "Icon/Primary", use: "선택됨" },
  { t: "success", token: "Icon/Success", use: "완료됨" },
  { t: "disabled", token: "Icon/Disabled-On", use: "비활성" },
] as const;

/** Figma 9칸 그대로. */
export const 전체: Story = {
  parameters: { layout: "padded", ...design(figma.checkMark) },
  render: () => (
    <table className="border-collapse text-left">
      <thead>
        <tr className="border-b border-table-border-strong">
          <th className="p-2 text-xs font-semibold text-table-header-text">Size</th>
          {TONES.map((t) => (
            <th key={t.t} className="p-2 text-xs font-semibold text-table-header-text">
              {t.t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s.s} className="border-b border-table-border">
            <td className="p-2 whitespace-nowrap">
              <span className="text-xs font-medium text-text-basic">{s.s}</span>
              <span className="ml-1 text-2xs text-text-subtle">{s.px}</span>
            </td>
            {TONES.map((t) => (
              <td key={t.t} className="p-2">
                <CheckMark size={s.s} tone={t.t} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Tone 은 색 토큰만 바뀝니다. */
export const Tone: Story = {
  parameters: { layout: "padded", ...design(figma.checkMark) },
  render: () => (
    <div className="flex flex-col">
      {TONES.map((t) => (
        <div key={t.t} className="flex items-center gap-3 border-b border-border-gray-light py-2.5">
          <CheckMark tone={t.t} />
          <span className="w-20 text-xs font-medium text-text-basic">{t.t}</span>
          <span className="w-40 text-2xs text-text-subtle">{t.token}</span>
          <span className="text-2xs text-text-muted-foreground">{t.use}</span>
        </div>
      ))}
    </div>
  ),
};

/** 실제로 쓰이는 자리 — 목록의 선택 표시입니다. */
export const 목록선택: Story = {
  parameters: { layout: "padded", ...design(figma.checkMark) },
  render: () => {
    const ITEMS = [
      { label: "혈액검사", picked: true },
      { label: "소변검사", picked: false },
      { label: "영상의학", picked: true },
      { label: "병리검사", picked: false },
    ];
    return (
      <div className="w-64 overflow-hidden rounded-md border border-menu-border bg-menu-surface">
        {ITEMS.map((it) => (
          <div
            key={it.label}
            className="flex h-[var(--h-list-item)] items-center justify-between px-3 text-sm text-text-basic hover:bg-action-accent"
          >
            {it.label}
            {it.picked && <CheckMark />}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Checkbox 와 나란히 — 왼쪽은 누를 수 있고 오른쪽은 못 누릅니다.
 * 표식만 필요한 자리에 Checkbox 를 두면 눌러도 아무 일이 없어 사용자가 헷갈립니다.
 */
export const Checkbox와의차이: Story = {
  parameters: { layout: "padded", ...design(figma.checkMark) },
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-text-basic">Checkbox — 입력</p>
        <Checkbox label="병원 출력금지 항목 제외" defaultChecked />
        <p className="text-2xs text-text-subtle">눌러서 값을 바꿉니다. 박스가 있습니다.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-text-basic">CheckMark — 표시</p>
        <div className="flex items-center gap-2 text-sm text-text-basic">
          <CheckMark tone="success" />
          검사 완료
        </div>
        <p className="text-2xs text-text-subtle">결과만 알립니다. 박스가 없습니다.</p>
      </div>
    </div>
  ),
};

/** 표식이 유일한 단서면 aria-label 을 주세요. 없으면 보조기술에서 숨깁니다. */
export const 접근성: Story = {
  parameters: { layout: "padded", ...design(figma.checkMark) },
  render: () => (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center gap-2">
        <CheckMark tone="success" />
        <span className="text-text-basic">검사 완료</span>
        <span className="text-2xs text-text-subtle">
          — 옆 글자가 이미 상태를 말하므로 표식은 숨깁니다 (aria-hidden)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-basic">혈액검사</span>
        <CheckMark aria-label="선택됨" />
        <span className="text-2xs text-text-subtle">
          — 표식만으로 상태를 알리므로 aria-label 을 답니다 (role=img)
        </span>
      </div>
    </div>
  ),
};
