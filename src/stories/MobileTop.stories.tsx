import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, EllipsisVertical, Menu, Search } from "lucide-react";
import { MobileTop, MobileTopAction } from "@/components/ui/mobile-top";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MBottomTabBar } from "@/components/ui/m-bottom-tab-bar";
import { Badge } from "@/components/ui/badge";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { design, figma, argsSource } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 변수를 모바일 값으로 고정합니다. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
    >
      <PointerModeProvider mode="touch">{children}</PointerModeProvider>
    </div>
  );
}

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
] as const;

/**
 * Figma: MobileTop (3 변형 — Style)
 *
 * 모바일 상단 바입니다. 높이 **58** 고정, 아래에 `Divider/Gray-Light` 한 줄.
 *
 * ### 세 변형은 "왼쪽에 무엇을 두느냐" 입니다
 *
 * | `variant` | 왼쪽 | 오른쪽 | 언제 |
 * |---|---|---|---|
 * | `logo` | 로고 | 액션 | 앱 첫 화면 |
 * | `back` | ‹ 뒤로 | 액션 | 상세 화면 — **타이틀이 가운데** |
 * | `title` | 화면 이름 (`base/Bold`) | 액션 | 목록 화면 |
 *
 * `back` 만 타이틀이 가운데입니다. 오른쪽 액션 개수가 달라도 흔들리지 않게
 * **절대 배치로 가운데를 잡습니다** — flex 로 나누면 아이콘이 하나 늘 때마다
 * 제목이 왼쪽으로 밀립니다. `가운데 정렬` 스토리에서 확인해 보세요.
 *
 * ### 액션은 44 짜리 탭 영역입니다
 *
 * 아이콘은 24 지만 누르는 곳은 44 입니다 (iOS 44pt). `MobileTopAction` 을 쓰면
 * 크기·정렬·`aria-label` 이 함께 따라옵니다 — 화면에 글자가 없어서 **라벨은 필수**입니다.
 *
 * **액션은 2개까지.** 넘으면 `⋯` 로 묶으세요 — 58 안에서 44 짜리 탭 영역이 셋 이상이면
 * 타이틀 자리가 사라집니다.
 *
 * ### 변형 이름을 다시 지었습니다
 *
 * Figma 는 원래 `Default` · `backStyle` · `e-smartTop` 이었습니다.
 * `e-smartTop` 은 다른 제품에서 넘어온 이름이라 **하는 일로 다시 지었습니다** (2026-08-07).
 * Figma 도 함께 바꿔 코드와 1:1 입니다.
 */
const meta = {
  title: "Mobile/MobileTop",
  component: MobileTop,
  parameters: { layout: "centered", ...design(figma.mobileTop) },
  argTypes: {
    variant: { control: "inline-radio", options: ["logo", "back", "title"] },
    title: { control: "text" },
    logo: { control: false },
    actions: { control: false },
    onBack: { control: false },
  },
  args: { title: "결과조회" },
  decorators: [
    (Story) => (
      <div className="ack-mobile w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 목록 화면의 기본 모습입니다. 왼쪽이 화면 이름, 오른쪽이 검색·알림입니다. */
export const 기본: Story = {
  parameters: { ...argsSource },
  args: {
    variant: "title",
    actions: (
      <>
        <MobileTopAction label="검색">
          <Search />
        </MobileTopAction>
        <MobileTopAction label="알림" dot>
          <Bell />
        </MobileTopAction>
      </>
    ),
  },
};

/** 세 변형입니다. **왼쪽에 무엇을 두느냐**가 전부입니다. */
export const 변형: Story = {
  name: "변형 3종",
  parameters: { layout: "padded" },
  decorators: [],
  render: () => (
    <div className="ack-mobile flex flex-col gap-4">
      {(
        [
          ["logo", "앱 첫 화면 — 로고 + 검색·메뉴"],
          ["back", "상세 화면 — 뒤로 + 가운데 타이틀 + ⋮"],
          ["title", "목록 화면 — 화면 이름 + 검색·알림"],
        ] as const
      ).map(([v, desc]) => (
        <div key={v}>
          <p className="mb-1 text-xs text-text-subtle">
            <code>{v}</code> — {desc}
          </p>
          <div className="w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
            <MobileTop
              variant={v}
              title={v === "back" ? "검사결과 상세" : "결과조회"}
              actions={
                v === "back" ? (
                  <MobileTopAction label="더 보기">
                    <EllipsisVertical />
                  </MobileTopAction>
                ) : v === "logo" ? (
                  <>
                    <MobileTopAction label="검색">
                      <Search />
                    </MobileTopAction>
                    <MobileTopAction label="메뉴">
                      <Menu />
                    </MobileTopAction>
                  </>
                ) : (
                  <>
                    <MobileTopAction label="검색">
                      <Search />
                    </MobileTopAction>
                    <MobileTopAction label="알림" dot>
                      <Bell />
                    </MobileTopAction>
                  </>
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * `back` 의 타이틀은 **오른쪽 액션이 0개든 2개든 같은 자리**입니다.
 * flex 로 나눴다면 아래로 갈수록 제목이 왼쪽으로 밀립니다.
 */
export const 가운데정렬: Story = {
  name: "가운데 정렬",
  parameters: { layout: "padded" },
  decorators: [],
  render: () => (
    <div className="ack-mobile relative flex flex-col gap-2">
      {[0, 1, 2].map((n) => (
        <div key={n} className="w-[390px] overflow-hidden rounded-xl border border-border-gray-light">
          <MobileTop
            variant="back"
            title="검사결과 상세"
            actions={
              <>
                {n > 0 && (
                  <MobileTopAction label="검색">
                    <Search />
                  </MobileTopAction>
                )}
                {n > 1 && (
                  <MobileTopAction label="더 보기">
                    <EllipsisVertical />
                  </MobileTopAction>
                )}
              </>
            }
          />
        </div>
      ))}
      {/* 가운데를 눈으로 확인하는 보조선 */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[195px] w-px bg-border-danger" />
    </div>
  ),
};

/**
 * 상단 바 · 목록 · 탭바가 다 놓인 화면입니다.
 * **상단 바와 탭바는 스크롤 영역 밖**에 있습니다 — 안에 넣으면 목록과 함께 밀려 올라갑니다.
 */
export const 화면: Story = {
  name: "화면 (전체 조립)",
  decorators: [],
  render: function Screen() {
    const [tab, setTab] = useState("results");
    return (
      <Phone>
        <div className="flex h-full flex-col">
          <MobileTop
            variant="title"
            title="결과조회"
            actions={
              <>
                <MobileTopAction label="검색">
                  <Search />
                </MobileTopAction>
                <MobileTopAction label="알림" dot>
                  <Bell />
                </MobileTopAction>
              </>
            }
          />

          <div className="min-h-0 flex-1 overflow-y-auto">
            {ROWS.map((r) => (
              <MobileListCard
                key={r.chart}
                title={r.name}
                meta={`차트 ${r.chart} · ${r.test}`}
                badge={
                  <Badge tone={r.tone} size="sm">
                    {r.status}
                  </Badge>
                }
                values={[
                  { label: "결과", value: r.value },
                  { label: "보고일", value: r.date },
                ]}
                onClick={() => {}}
              />
            ))}
          </div>

          <MBottomTabBar value={tab} onValueChange={setTab} homeIndicator />
        </div>
      </Phone>
    );
  },
};
