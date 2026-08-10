import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight, Download, Plus, Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { design, figma, argsSource } from "./figma";

/**
 * Figma: Button — 224 변형 (Variant 7 × Size 8 × State 2 × Shape 2)
 *
 * 화면의 주 액션에만 `default` 를 씁니다. 한 화면에 하나만.
 * 삭제처럼 되돌릴 수 없는 동작에만 `destructive` 를 쓰고,
 * 되돌릴 수 있으면 `outline` 으로 충분합니다.
 *
 * ### 크기 — Figma 값 그대로
 *
 * | | 높이 | 좌우 | 간격 | 글자 | 아이콘 |
 * |---|---|---|---|---|---|
 * | `xs` | 24 | 8 | 4 | 12 | 14 |
 * | `sm` | 32 | 12 | 6 | 14 | 16 |
 * | `default` | 36 | 16 | 8 | 14 | 16 |
 * | `lg` | 48 | 24 | 8 | **18** | **20** |
 * | `icon-xs` · `icon-sm` · `icon` · `icon-lg` | 24 · 32 · 36 · 48 | — | — | — | 12 · 16 · **18** · **24** |
 *
 * 아이콘 전용은 글자 옆에 설 때보다 조금 큽니다 — 혼자 있으면 작아 보입니다.
 * 스피너도 같은 크기를 따릅니다.
 *
 * 높이는 `--h-input-*` 변수라 모바일에서 한 단계씩 커집니다 (24→28 · 32→36 · 36→40 · 48→52).
 *
 * ### hover · active 는 투명도가 아닙니다
 *
 * `/90` 처럼 깎지 않고 전용 토큰(`Button/…-Fill-Hover` · `-Active`)을 씁니다.
 * 투명도로 처리하면 겹친 요소가 비치고, 배경이 흰색이 아닌 곳에서 색이 달라집니다.
 * `disabled` 도 같은 이유로 opacity 가 아니라 토큰입니다.
 */
const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: { ...design(figma.button) },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"],
      description: "화면에서 얼마나 강하게 보일지. 주 액션은 default 하나만.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon-xs", "icon-sm", "icon", "icon-lg"],
      description:
        "높이는 --h-input-* 변수라 모바일에서 커집니다. 아이콘 크기도 여기서 정해집니다 — 직접 주지 마세요. icon 계열은 aria-label 이 없으면 컴파일되지 않습니다.",
    },
    shape: {
      control: "inline-radio",
      options: ["default", "pill"],
      description: "반경만 달라집니다 — 높이·패딩·간격은 같습니다.",
    },
    loading: {
      control: "boolean",
      description: "스피너가 라벨 앞에 붙습니다. 색은 그대로 — 비활성이 아닙니다.",
    },
    disabled: { control: "boolean" },
    children: {
      control: "text",
      description:
        "라벨과 아이콘이 함께 들어갑니다. Figma 의 icon 축(none · left · right · both)에 해당하는 prop 은 없고, 넣는 순서가 곧 위치입니다 — 아이콘 위치 스토리 참고.",
    },
    "aria-label": {
      control: "text",
      description: "icon 계열 size 에서만 필수입니다. 라벨이 있는 크기에서는 쓰지 마세요.",
    },
  },
  args: { children: "버튼", variant: "default", size: "default", shape: "default" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = { parameters: { ...argsSource } };

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;
const SHAPES = ["default", "pill"] as const;

/** `variant` 7종을 나란히 봅니다. 화면의 주 액션은 `default` 하나뿐입니다. */
export const Variant: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

/** 툴바 40 · 폼 36 · 모바일 주 액션 48. */
export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((s) => (
        <Button key={s} {...args} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

/**
 * Shape 은 반경만 바꿉니다 — 높이·패딩·간격은 default 와 완전히 같습니다.
 * default 는 Radius/md(6), pill 은 Radius/full.
 */
export const Shape: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {SHAPES.map((sh) => (
        <div key={sh} className="flex flex-wrap items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-text-subtle">{sh}</span>
          {SIZES.map((s) => (
            <Button key={s} {...args} size={s} shape={sh}>
              {s}
            </Button>
          ))}
          <Button {...args} size="icon" shape={sh} aria-label="추가">
            <Plus />
          </Button>
        </div>
      ))}
    </div>
  ),
};

/**
 * Figma 의 `icon` 축(none · left · right · both)입니다.
 * **코드에는 prop 이 없습니다** — 넣는 순서가 곧 위치입니다.
 *
 * | Figma | 코드 |
 * |---|---|
 * | `none` | `<Button>추가</Button>` |
 * | `left` | `<Button><Plus />추가</Button>` |
 * | `right` | `<Button>추가<Plus /></Button>` |
 * | `both` | 앞뒤로 하나씩 |
 *
 * **아이콘 크기를 직접 주지 마세요.** `size` 축이 정합니다 (xs 14 · sm·default 16 · lg 20).
 * `className="size-4"` 를 붙이면 lg 에서 20 이어야 할 아이콘이 16 으로 고정됩니다.
 *
 * 오른쪽 아이콘은 방향을 가리킬 때만 씁니다 — 다음 단계 · 펼치기 · 외부 링크.
 * 장식으로 양쪽에 붙이면 라벨이 가운데 끼어 읽는 속도가 떨어집니다.
 */
export const 아이콘위치: Story = {
  name: "아이콘 위치",
  parameters: { layout: "padded", ...design(figma.button) },
  render: ({ shape }) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" shape={shape}>
          텍스트만
        </Button>
        <Button variant="outline" shape={shape}>
          <Plus />
          왼쪽
        </Button>
        <Button variant="outline" shape={shape}>
          오른쪽
          <ChevronRight />
        </Button>
        <Button variant="outline" shape={shape}>
          <Plus />
          양쪽
          <ChevronRight />
        </Button>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">
          크기는 size 축이 정합니다 — 아이콘도 함께 커집니다
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {SIZES.map((s) => (
            <Button key={s} size={s} variant="outline" shape={shape}>
              <Download />
              {s}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * Figma 의 `iconOnly` 축입니다. **아이콘은 정사각형의 50%** 입니다 (24→12 · 32→16 · 36→18 · 48→24).
 *
 * `aria-label` 이 없으면 **컴파일되지 않습니다.** 화면에 글자가 없어서
 * 라벨을 빠뜨리면 보조기술이 읽을 것이 아무것도 없습니다.
 *
 * 다만 `aria-label` 은 보조기술용이라 눈으로 보는 사람에게는 도움이 되지 않습니다 —
 * 아이콘만으로 기능을 알기 어려우면 Tooltip 을 함께 쓰세요.
 */
export const 아이콘만: Story = {
  name: "아이콘만",
  parameters: { layout: "padded", ...design(figma.button) },
  render: ({ shape }) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-xs" variant="outline" shape={shape} aria-label="추가">
        <Plus />
      </Button>
      <Button size="icon-sm" variant="outline" shape={shape} aria-label="검색">
        <Search />
      </Button>
      <Button size="icon" variant="outline" shape={shape} aria-label="다운로드">
        <Download />
      </Button>
      <Button size="icon-lg" variant="outline" shape={shape} aria-label="인쇄">
        <Printer />
      </Button>
    </div>
  ),
};

/**
 * Disabled 는 opacity 가 아니라 토큰으로 표현합니다. 겹친 요소가 비치지 않습니다.
 *
 * **바탕이 없는 `ghost` · `link` 는 비활성일 때도 바탕이 없습니다.**
 * 평상시 투명하던 것이 눌리지 않게 되면서 갑자기 회색 판이 생기면,
 * 없던 요소가 나타난 것처럼 보입니다. 글자 색만 흐려집니다.
 */
export const 상태: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: ({ shape }) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button shape={shape}>기본</Button>
        <Button shape={shape} disabled>
          비활성
        </Button>
        <Button shape={shape} loading>
          저장 중
        </Button>
        <Button variant="outline" shape={shape} disabled>
          비활성
        </Button>
        <Button variant="outline" shape={shape} loading>
          조회 중
        </Button>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">
          비활성 — 바탕이 있는 것과 없는 것
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {(["default", "secondary", "destructive", "outline", "soft", "ghost", "link"] as const).map(
            (v) => (
              <Button key={v} variant={v} shape={shape} disabled>
                {v}
              </Button>
            )
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">
          로딩 — 색이 그대로입니다. 비활성과 나란히 보세요
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {(["default", "soft", "outline"] as const).map((v) => (
            <Button key={v} variant={v} shape={shape} loading>
              {v}
            </Button>
          ))}
          <Button shape={shape} loading disabled>
            비활성 + 로딩
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * 전체 조합. Figma 세트와 대조할 때 씁니다.
 * Figma 페이지가 Shape=default · Shape=pill 두 덩어리로 쌓여 있어 같은 순서로 폅니다.
 * 컨트롤로 고르지 않고 둘 다 보여주는 이유 — 대조는 나란히 놓고 봐야 합니다.
 */
export const 전체: Story = {
  parameters: { layout: "padded", ...design(figma.button) },
  render: () => (
    <div className="flex flex-col gap-8">
      {SHAPES.map((sh) => (
        <section key={sh} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-text-basic">Shape = {sh}</h3>
          {VARIANTS.map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-text-subtle">{v}</span>
              {SIZES.map((s) => (
                <Button key={s} variant={v} size={s} shape={sh}>
                  버튼
                </Button>
              ))}
              <Button variant={v} shape={sh} disabled>
                비활성
              </Button>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};
