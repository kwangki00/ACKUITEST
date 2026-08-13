import type { Meta, StoryObj } from "@storybook/react";

/**
 * Figma: Guideline / Layout & Grid
 *
 * 12칼럼 그리드는 쓰지 않습니다 — 표의 열 너비는 데이터가 정하지 그리드가 정하지 않습니다.
 * 대신 Spacing 사다리와 반응형 높이 변수로 리듬을 맞춥니다.
 */
const meta = {
  title: "Foundation/Layout & Grid",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border-gray-light py-2">
      <span className="w-28 shrink-0 text-xs font-medium text-text-basic">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
      {note && <span className="shrink-0 text-2xs text-text-subtle">{note}</span>}
    </div>
  );
}

/** PC 는 사이드바 + 작업영역, 모바일은 하단 탭 + 전체화면입니다. */
export const 화면구조: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-text-basic">PC</h3>
        <div className="flex h-64 overflow-hidden rounded-md border border-border-gray-light">
          <div className="flex w-40 shrink-0 flex-col justify-center bg-sidebar-surface p-3 text-center text-xs text-sidebar-text ring-1 ring-sidebar-border">
            Sidebar
            <span className="mt-1 text-2xs text-text-subtle">256 · 접으면 72</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-9 shrink-0 items-center border-b border-tab-divider bg-surface-gray-subtler px-3 text-xs text-text-subtle">
              MDI TabBar 36
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex h-16 shrink-0 items-center border-b border-border-gray-light bg-background-white px-3 text-xs text-text-subtle">
                FilterBar — 펼침 200 / 접힘 56
              </div>
              <div className="flex flex-1 items-center justify-center bg-background-gray-subtler text-xs text-text-subtle">
                Body — 여백 24 · 표 블록
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted-foreground">
          탭바를 Content 안에 두지 마세요 — 탭을 바꾸면 자기 자신도 갈리는 모순이 생깁니다.
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-text-basic">모바일</h3>
        <div className="flex h-64 w-56 flex-col overflow-hidden rounded-md border border-border-gray-light">
          <div className="flex h-11 shrink-0 items-center justify-center border-b border-border-gray-light bg-background-white text-xs text-text-subtle">
            Header
          </div>
          <div className="flex h-10 shrink-0 items-center justify-center border-b border-border-gray-light bg-background-white text-2xs text-text-subtle">
            FilterBar — 조회 후 접힘 (PC 와 같은 컴포넌트)
          </div>
          <div className="flex flex-1 items-center justify-center bg-background-gray-subtler text-xs text-text-subtle">
            MobileListCard
          </div>
          <div className="flex h-14 shrink-0 items-center justify-center border-t border-border-gray-light bg-background-white text-xs text-text-subtle">
            MBottomTabBar
          </div>
        </div>
      </section>
    </div>
  ),
};

/** 1024px 에서 PC / Mobile 이 갈립니다. Tailwind 의 lg 와 같은 지점입니다. */
export const 브레이크포인트: Story = {
  render: () => {
    const BP = [
      ["sm", 640, ""],
      ["md", 768, ""],
      ["lg", 1024, "← Responsive 변수가 PC 로 갈리는 지점"],
      ["xl", 1280, ""],
      ["2xl", 1536, ""],
    ] as const;
    return (
      <div className="flex flex-col">
        {BP.map(([n, px, note]) => (
          <Row key={n} label={n} note={`${px}px`}>
            <span className={`text-xs ${note ? "text-text-primary" : "text-text-subtle"}`}>
              {note || " "}
            </span>
          </Row>
        ))}
        <p className="mt-3 text-xs text-text-muted-foreground">
          입력 계열 글자를 줄이는 시점도 <code className="text-text-basic">lg:</code> 입니다.
          <code className="text-text-basic"> md:</code> 를 쓰면 768~1024 구간에서 모바일 높이에 PC
          글자가 얹힙니다.
        </p>
      </div>
    );
  },
};

/** Spacing 34단계. Tailwind 기본 사다리와 같습니다 (1 = 4px). */
export const 여백: Story = {
  render: () => {
    const S = [
      ["0_5", 2], ["1", 4], ["1_5", 6], ["2", 8], ["2_5", 10], ["3", 12], ["3_5", 14],
      ["4", 16], ["5", 20], ["6", 24], ["8", 32], ["10", 40], ["12", 48], ["16", 64],
      ["20", 80], ["24", 96],
    ] as const;
    return (
      <div className="flex flex-col">
        {S.map(([n, px]) => (
          <Row key={n} label={`Spacing/${n}`} note={`${px}px`}>
            <div className="h-3 rounded-xs bg-primary-300" style={{ width: px }} />
          </Row>
        ))}
        <p className="mt-3 text-xs text-text-muted-foreground">
          전체 34단계 중 자주 쓰는 것만 폈습니다. 96 까지는 4의 배수, 그 위는 384 까지 있습니다.
        </p>
      </div>
    );
  },
};

/** Radius 9단계. 버튼·입력은 md(6), 표 셀은 sm(4), 배지·pill 은 full. */
export const 모서리: Story = {
  render: () => {
    const R = [
      ["none", "0", "rounded-none", "표 셀 경계"],
      ["xs", "2", "rounded-xs", ""],
      ["sm", "4", "rounded-sm", "체크박스 · grid 입력"],
      ["md", "6", "rounded-md", "버튼 · 입력 — 사이즈와 무관하게 전부 md"],
      ["lg", "8", "rounded-lg", ""],
      ["xl", "12", "rounded-xl", "카드 · 시트"],
      ["2xl", "16", "rounded-2xl", ""],
      ["3xl", "24", "rounded-3xl", ""],
      ["full", "9999", "rounded-full", "배지 · pill 버튼"],
    ] as const;
    return (
      <div className="flex flex-col">
        {R.map(([n, px, cls, use]) => (
          <Row key={n} label={`Radius/${n}`} note={`${px}px`}>
            <div className={`size-10 shrink-0 border border-border-gray bg-surface-gray-subtler ${cls}`} />
            <span className="text-2xs text-text-muted-foreground">{use}</span>
          </Row>
        ))}
      </div>
    );
  },
};

/** Figma 이펙트 스타일 19개 중 그림자. Tailwind 기본값과 미묘하게 달라 토큰으로 덮었습니다. */
export const 그림자: Story = {
  render: () => {
    const SH = [
      ["2xs", "shadow-2xs", ""],
      ["xs", "shadow-xs", "Pill 탭 · 토글 — 대비 1.24:1 이라 그림자가 필수"],
      ["sm", "shadow-sm", "카드"],
      ["md", "shadow-md", "드롭다운 패널"],
      ["lg", "shadow-lg", "Popover"],
      ["xl", "shadow-xl", "Dialog"],
      ["2xl", "shadow-2xl", "모바일 시트"],
    ] as const;
    const INSET = [
      ["2xs", "inset-shadow-2xs"],
      ["xs", "inset-shadow-xs"],
      ["sm", "inset-shadow-sm"],
    ] as const;
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {SH.map(([n, cls, use]) => (
            <div key={n} className="flex flex-col gap-2">
              <div className={`h-16 rounded-lg bg-surface-white ${cls}`} />
              <p className="text-xs font-medium text-text-basic">shadow/{n}</p>
              {use && <p className="text-2xs text-text-subtle">{use}</p>}
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-basic">inner-shadow</h3>
          <div className="grid grid-cols-3 gap-6">
            {INSET.map(([n, cls]) => (
              <div key={n} className="flex flex-col gap-2">
                <div className={`h-16 rounded-lg bg-surface-gray-subtler ${cls}`} />
                <p className="text-xs font-medium text-text-basic">inner-shadow/{n}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/** Blur 8단계 · Border 굵기 5단계. Tailwind 기본값과 같습니다. */
export const 흐림과선: Story = {
  render: () => {
    const B = [
      ["xs", "backdrop-blur-xs", 4], ["sm", "backdrop-blur-sm", 8], ["md", "backdrop-blur-md", 12],
      ["lg", "backdrop-blur-lg", 16], ["xl", "backdrop-blur-xl", 24], ["2xl", "backdrop-blur-2xl", 40],
      ["3xl", "backdrop-blur-3xl", 64],
    ] as const;
    const BW = [
      ["Default", "border", 1], ["2", "border-2", 2], ["4", "border-4", 4], ["8", "border-8", 8],
    ] as const;
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-basic">Blur</h3>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {B.map(([n, cls, px]) => (
              <div key={n} className="flex flex-col gap-1">
                <div className="relative h-16 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-linear-to-br from-primary-400 to-danger-400" />
                  <div className={`absolute inset-0 ${cls}`} />
                </div>
                <p className="text-2xs text-text-basic">
                  Blur/{n} · {px}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-basic">Border</h3>
          <div className="flex flex-col">
            {BW.map(([n, cls, px]) => (
              <Row key={n} label={`Border/${n}`} note={`${px}px`}>
                <div className={`h-8 w-24 rounded-md border-border-gray-dark bg-surface-white ${cls}`} />
              </Row>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
