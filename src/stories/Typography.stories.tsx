import type { Meta, StoryObj } from "@storybook/react";

/**
 * Figma: Guideline / Typography — 텍스트 스타일 44개 (11 사이즈 × 4 웨이트)
 *
 * 사이즈는 Typo/Font-Size 사다리에 바인딩돼 있어 한 곳만 바꾸면 44개가 따라옵니다.
 * 행간은 xl 까지 140%, 2xl 부터 130% — 제목은 촘촘해야 한 덩어리로 읽힙니다.
 * 자간은 커질수록 좁힙니다. 큰 글자에서 자간이 그대로면 헐거워 보입니다.
 *
 * ### 10px 만 기본 굵기가 SemiBold 입니다 (2026-08-12)
 *
 * 한글은 획이 많아 이 크기에서 먼저 뭉갭니다. Medium 으로 먼저 올려봤지만 여전히
 * 흐려서 한 단계 더 갔습니다. **크기 토큰이 굵기를 함께 갖습니다**
 * (`--text-2xs--font-weight`) — 호출부에서 손으로 붙이는 방식이면 반드시 빠집니다.
 * 실제로 10px 을 쓰는 일곱 곳 중 `DropdownMenu` 한 곳만 `font-medium` 이 붙어
 * 있었습니다.
 *
 * 덮어야 하면 `font-bold` · `font-normal` 로. 유틸리티가 `--tw-font-weight` 를
 * 세우고 토큰은 fallback 이라 **덮은 쪽이 이깁니다** — 아래 「4 웨이트」 · 「전체」가
 * 그 덕에 10px 행도 정확히 나옵니다.
 *
 * **굵기로 상태를 알리던 곳은 한 단계씩 밀립니다.** `MBottomTabBar` 는 활성이
 * SemiBold → **Bold** 가 되었습니다 — 그대로 두면 비활성과 같아져 색만 남고,
 * 색각 이상에서는 어느 탭에 있는지 알 수 없게 됩니다.
 *
 * 클래스 이름은 반드시 리터럴로 적습니다 — `text-${size}` 처럼 조합하면
 * Tailwind 스캐너가 찾지 못해 CSS 가 생성되지 않습니다.
 */
const meta = {
  title: "Foundation/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Size = {
  name: string;
  cls: string;
  px: number;
  lh: string;
  ls: string;
  /** 크기 토큰이 굵기까지 갖는 크기에만 적습니다 — 나머지는 Regular 입니다. */
  w?: string;
  use?: string;
};

const SIZES: Size[] = [
  { name: "2xs", cls: "text-2xs", px: 10, lh: "1.4", ls: "-1%", w: "SemiBold", use: "배지 sm · 보조 수치" },
  { name: "xs", cls: "text-xs", px: 12, lh: "1.4", ls: "-1.5%", use: "라벨 · 설명 · 에러 · 배지" },
  { name: "sm", cls: "text-sm", px: 14, lh: "1.4", ls: "-2%", use: "본문 기본 · 표 · 입력값" },
  { name: "base", cls: "text-base", px: 16, lh: "1.4", ls: "-2%", use: "모바일 입력 · 표 제목" },
  { name: "lg", cls: "text-lg", px: 18, lh: "1.4", ls: "-2%", use: "lg 버튼" },
  { name: "xl", cls: "text-xl", px: 20, lh: "1.4", ls: "-2%", use: "화면 제목" },
  { name: "2xl", cls: "text-2xl", px: 24, lh: "1.3", ls: "-2.5%", use: "페이지 제목" },
  { name: "3xl", cls: "text-3xl", px: 30, lh: "1.3", ls: "-2.5%" },
  { name: "4xl", cls: "text-4xl", px: 36, lh: "1.3", ls: "-3%" },
  { name: "5xl", cls: "text-5xl", px: 48, lh: "1.3", ls: "-3%" },
  { name: "6xl", cls: "text-6xl", px: 60, lh: "1.3", ls: "-3.5%" },
];

const WEIGHTS = [
  { name: "Regular", num: 400, cls: "font-normal" },
  { name: "Medium", num: 500, cls: "font-medium" },
  { name: "SemiBold", num: 600, cls: "font-semibold" },
  { name: "Bold", num: 700, cls: "font-bold" },
];

/** 11 사이즈 사다리. 옆의 수치가 Figma 텍스트 스타일과 같은 값입니다. */
export const 사이즈: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((s) => (
        <div key={s.name} className="flex flex-col gap-1 border-b border-border-gray-light pb-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="w-12 shrink-0 text-xs font-medium text-text-primary">{s.name}</span>
            <span className="text-2xs text-text-subtle">
              {s.px}px · 행간 {s.lh} · 자간 {s.ls}
              {s.w && ` · 기본 ${s.w}`}
            </span>
            {s.use && <span className="text-2xs text-text-muted-foreground">— {s.use}</span>}
          </div>
          <p className={`${s.cls} text-text-basic`}>검사 결과를 조회합니다 Sample Text 0123</p>
        </div>
      ))}
    </div>
  ),
};

/** 4 웨이트. 굵기만 바꿔 위계를 만듭니다 — 크기를 함께 키우면 시끄러워집니다. */
export const 웨이트: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {WEIGHTS.map((w) => (
        <div key={w.name} className="flex flex-wrap items-baseline gap-3">
          <span className="w-24 shrink-0 text-xs font-medium text-text-primary">{w.name}</span>
          <span className="w-10 shrink-0 text-2xs text-text-subtle">{w.num}</span>
          <p className={`text-lg ${w.cls} text-text-basic`}>검사 결과를 조회합니다 Sample 0123</p>
        </div>
      ))}
    </div>
  ),
};

/** Figma 세트와 같은 44칸. 대조할 때 씁니다. */
export const 전체: Story = {
  render: () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-table-border-strong">
            <th className="p-2 text-xs font-semibold text-table-header-text">사이즈</th>
            {WEIGHTS.map((w) => (
              <th key={w.name} className="p-2 text-xs font-semibold text-table-header-text">
                {w.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((s) => (
            <tr key={s.name} className="border-b border-table-border">
              <td className="p-2 align-middle whitespace-nowrap">
                <span className="text-xs font-medium text-text-primary">{s.name}</span>
                <span className="ml-1 text-2xs text-text-subtle">{s.px}</span>
              </td>
              {WEIGHTS.map((w) => (
                <td key={w.name} className="p-2 align-middle">
                  <span className={`${s.cls} ${w.cls} text-text-basic`}>가나다 Ag</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/**
 * 폰트는 **Noto Sans KR** 하나입니다 (2026-08-12. 그전에는 Pretendard).
 *
 * Pretendard 는 Windows Chrome 에서 작은 크기의 한글이 흐리고 깨져 보였습니다 —
 * ClearType 서브픽셀로 그리는데 힌팅이 그 조건을 못 버텼습니다. Figma 는 자체
 * 렌더러라 매끈해서 **같은 Regular 인데 웹에서만 다르게** 보였습니다.
 *
 * 굵기는 **넷만** 받습니다 (400 · 500 · 600 · 700) — 이 시스템이 쓰는 전부입니다.
 * Variable 을 쓰지 않는 이유는 보간으로 만든 400 이 힌팅까지 달라지기 때문입니다.
 *
 * 없으면 OS 기본 한글 폰트로 떨어집니다.
 */
export const 폰트: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-text-subtle">--font-sans</p>
      <p className="rounded-md border border-border-gray-light bg-surface-gray-subtler p-3 text-xs text-text-basic">
        Noto Sans KR → -apple-system → BlinkMacSystemFont → system-ui → Roboto → Helvetica Neue →
        Segoe UI → Apple SD Gothic Neo → Malgun Gothic
      </p>
      <p className="text-2xl font-bold text-text-basic">다람쥐 헌 쳇바퀴에 타고파 0123456789</p>
      <p className="text-2xl font-bold text-text-basic">
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  ),
};
