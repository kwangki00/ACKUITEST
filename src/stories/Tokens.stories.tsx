import type { Meta, StoryObj } from "@storybook/react";

/**
 * 토큰 — Figma Variables 에서 추출한 값입니다.
 *
 * 컴포넌트는 Semantic 만 참조합니다. Primitive 를 직접 쓰지 마세요.
 * 색을 바꿔야 하면 ack-theme.css 의 Semantic 한 곳만 고치면 전체가 따라옵니다.
 */
const meta = {
  title: "Foundation/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Swatch({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-9 shrink-0 rounded-md border border-border-gray-light"
        style={{ background: `var(--color-${name})` }}
      />
      <div className="min-w-0">
        <p className="truncate text-xs text-text-basic">{name}</p>
        <p className="truncate text-2xs text-text-subtle">--color-{name}</p>
      </div>
    </div>
  );
}

function Group({ title, note, names }: { title: string; note?: string; names: string[] }) {
  return (
    <section className="mb-8">
      <h3 className="text-sm font-semibold text-text-basic">{title}</h3>
      {note && <p className="mt-0.5 mb-3 text-xs text-text-subtle">{note}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((n) => (
          <Swatch key={n} name={n} />
        ))}
      </div>
    </section>
  );
}

const RAMP = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/** 브랜드 램프. 컴포넌트에서 직접 쓰지 마세요. */
export const Primitive: Story = {
  render: () => (
    <div>
      {["primary", "secondary", "sub", "danger", "warning", "success", "info1", "info2"].map((c) => (
        <section key={c} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-text-basic">{c}</h3>
          <div className="flex overflow-hidden rounded-md border border-border-gray-light">
            {RAMP.map((s) => (
              <div key={s} className="flex-1">
                <div className="h-12" style={{ background: `var(--color-${c}-${s})` }} />
                <p className="py-1 text-center text-2xs text-text-subtle">{s}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

/** 컴포넌트가 실제로 참조하는 값입니다. */
export const Semantic: Story = {
  render: () => (
    <div>
      <Group
        title="Text"
        note="본문 4.5:1 · 큰 글자 3:1 을 지킵니다."
        names={["text-basic", "text-subtle", "text-disabled", "text-primary", "text-primary-strong", "text-danger", "text-success", "text-warning", "text-placeholder"]}
      />
      <Group
        title="Button"
        note="Disabled 는 opacity 가 아니라 토큰입니다."
        names={["button-primary-fill", "button-primary-fill-hover", "button-primary-fill-active", "button-soft-fill", "button-destructive-fill", "button-tertiary-fill-border", "button-disabled-fill"]}
      />
      <Group
        title="Input"
        note="Border 는 gray/300 — 대비 1.47:1 이지만 장식이 아니라 형태를 알리는 용도라 유지합니다."
        names={["input-surface", "input-border", "input-border-focus", "input-border-error", "input-surface-disabled", "input-surface-readonly"]}
      />
      <Group
        title="Table"
        names={["table-row-surface", "table-row-hover", "table-row-selected", "table-header-surface", "table-header-text", "table-border", "table-border-strong", "table-text-muted"]}
      />
      <Group
        title="Badge — Soft"
        names={["badge-neutral-soft-fill", "badge-primary-soft-fill", "badge-info-soft-fill", "badge-success-soft-fill", "badge-warning-soft-fill", "badge-danger-soft-fill"]}
      />
      <Group
        title="Surface · Border"
        names={["background-white", "background-gray-subtler", "background-gray-subtle", "surface-disabled", "border-gray-light", "border-gray", "card-border", "divider-gray-light"]}
      />
    </div>
  ),
};

/** PC / Mobile 2모드. 1024px 에서 갈립니다. */
export const Responsive: Story = {
  render: () => {
    const HEIGHTS = [
      ["--h-input-sm", "36 / 32", "sm 입력 · 버튼"],
      ["--h-input-default", "40 / 36", "기본 입력 · 버튼"],
      ["--h-input-lg", "52 / 48", "lg 입력 · 모바일 주 액션"],
      ["--h-datagrid", "36 / 34", "표 행"],
      ["--h-toolbar", "44 / 40", "표 툴바"],
      ["--h-list-item", "48 / 32", "목록 항목 — 차이가 가장 큽니다"],
      ["--h-calendar-cell", "44 / 36", "달력 날짜 — 터치 44pt 기준"],
      ["--h-control-default", "26 / 24", "체크박스 · 라디오 · 스위치"],
    ];
    return (
      <div>
        <p className="mb-4 text-sm text-text-subtle">
          아래 막대의 실제 높이는 지금 창 너비를 따릅니다. Viewport 툴바에서 Mobile 로 바꿔보세요.
        </p>
        <div className="flex flex-col gap-2">
          {HEIGHTS.map(([v, val, note]) => (
            <div key={v} className="flex items-center gap-3">
              <span className="w-48 shrink-0 text-xs text-text-basic">{v}</span>
              <div
                className="w-24 rounded-sm bg-primary-100"
                style={{ height: `var(${v})` }}
              />
              <span className="w-20 shrink-0 text-xs text-text-subtle">{val}</span>
              <span className="text-xs text-text-subtle">{note}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
