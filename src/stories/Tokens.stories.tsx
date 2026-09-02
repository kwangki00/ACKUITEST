import type { Meta, StoryObj } from "@storybook/react";

/**
 * 토큰 — Figma Variables 에서 추출한 값입니다.
 *
 * 컴포넌트는 Semantic 만 참조합니다. Primitive 를 직접 쓰지 마세요.
 * 색을 바꿔야 하면 ack-theme.css 의 Semantic 한 곳만 고치면 전체가 따라옵니다.
 *
 * 색의 출처는 두 갈래입니다.
 * - 브랜드 8램프 (Primary · Secondary · Sub · Danger · Warning · Success · Info1 · Info2)
 *   → ack-theme.css 가 직접 정의합니다.
 * - 중립 회색 → Tailwind 기본 팔레트를 그대로 씁니다. 다시 정의하지 않습니다.
 *   Semantic 317개 중 122개가 여기서 왔습니다.
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

/**
 * 가로지르는 일곱 그룹의 **축**입니다 — 값이 같아도 축이 다르면 다른 토큰입니다.
 * Figma `Color` 페이지의 About 과 같은 표입니다.
 */
const AXES: [string, string][] = [
  ["Background/*", "영역이 깔고 앉는 바탕 — 화면 · 판 · 떠 있는 패널"],
  ["Surface/*", "요소가 스스로 갖는 면. 톤이 있는 표면(*-Subtler 일곱)은 전부 여기입니다"],
  ["Border/*", "요소를 두르는 선"],
  ["Divider/*", "요소 사이를 긋는 선 — 값이 같아도 축이 다릅니다"],
  ["Text/* · Icon/*", "글자 · 아이콘"],
  ["Action/*", "상호작용 상태 — hover · selected · pressed · focus ring"],
  ["Button/* · Badge/* …", "컴포넌트 이름이 붙은 그룹은 이름이 곧 용도라 따로 정의하지 않습니다"],
];

function Axes() {
  return (
    <section className="mb-8">
      <h3 className="text-sm font-semibold text-text-basic">그룹이 곧 축입니다</h3>
      <p className="mt-0.5 mb-3 text-xs text-text-subtle">
        값이 겹치는 묶음이 27개인데 대부분은 정상입니다 — <code>Border/Primary</code> ·{" "}
        <code>Text/Primary</code> · <code>Icon/Primary</code> 는 같은 파랑이지만 축이 다르고, 그
        축이 이름에 있습니다.
      </p>
      <div className="overflow-hidden rounded-lg border border-table-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-table-header-surface">
              <th className="w-52 px-4 py-2 text-xs font-semibold text-table-header-text">그룹</th>
              <th className="px-4 py-2 text-xs font-semibold text-table-header-text">무엇에 쓰나</th>
            </tr>
          </thead>
          <tbody className="bg-table-row-surface">
            {AXES.map(([g, use]) => (
              <tr key={g} className="border-t border-table-border">
                <td className="px-4 py-2 text-xs font-medium whitespace-nowrap text-text-basic">
                  {g}
                </td>
                <td className="px-4 py-2 text-xs text-text-subtle">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Group({
  title,
  note,
  names,
}: {
  title: string;
  /** 문자열도 되고 표·목록 같은 덩어리도 됩니다 — <p> 가 아니라 <div> 로 감쌉니다 */
  note?: React.ReactNode;
  names: string[];
}) {
  return (
    <section className="mb-8">
      <h3 className="text-sm font-semibold text-text-basic">{title}</h3>
      {note && <div className="mt-0.5 mb-3 text-xs text-text-subtle">{note}</div>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((n) => (
          <Swatch key={n} name={n} />
        ))}
      </div>
    </section>
  );
}

/**
 * 글자색 그룹에 붙는 설명입니다.
 *
 * 「본문 4.5:1 · 큰 글자 3:1」 한 줄만 있었는데, **그 숫자가 어디서 온 것인지**가
 * 없어서 새 색을 고를 때 기준으로 쓸 수 없었습니다.
 */
function ContrastNote() {
  const rows: [string, string, string][] = [
    ["본문 글자", "4.5:1", "7:1"],
    ["큰 글자 — 24px 이상, 또는 18.7px 이상이면서 Bold", "3:1", "4.5:1"],
    ["아이콘 · 테두리 등 글자가 아닌 것", "3:1", "—"],
  ];
  return (
    <div className="flex flex-col gap-2">
      <p>
        <b className="text-text-basic">WCAG 명도 대비</b>를 따릅니다 — 웹 콘텐츠 접근성 지침
        (Web Content Accessibility Guidelines)이 정한 <b className="text-text-basic">글자색과
        배경색의 밝기 차이</b> 기준입니다. 두 색의 상대 휘도로 계산해{" "}
        <code>(밝은 쪽 + 0.05) ÷ (어두운 쪽 + 0.05)</code> 로 구하며, 같은 색이면 1:1 ·
        검정과 흰색이면 21:1 입니다.
      </p>

      <table className="w-full max-w-160 border-collapse text-2xs">
        <thead>
          <tr className="border-b border-border-gray-light text-left">
            <th className="py-1 pr-3 font-semibold text-text-basic">대상</th>
            <th className="w-20 py-1 pr-3 font-semibold text-text-basic">AA (기준)</th>
            <th className="w-20 py-1 font-semibold text-text-basic">AAA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([what, aa, aaa]) => (
            <tr key={what} className="border-b border-border-gray-light">
              <td className="py-1 pr-3">{what}</td>
              <td className="py-1 pr-3 font-medium text-text-basic">{aa}</td>
              <td className="py-1">{aaa}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex list-disc flex-col gap-1 pl-4">
        <li>
          이 저장소는 <b className="text-text-basic">AA</b> 를 기준으로 잡았습니다. 종일 보는
          업무 화면이라 본문이 흐리면 눈이 빨리 지칩니다.
        </li>
        <li>
          <b className="text-text-basic">큰 글자 기준이 느슨한 이유</b>는 획이 두꺼워 같은 대비에서도
          읽히기 때문입니다. 다만 한글은 획이 많아 라틴 문자보다 불리하니, 3:1 을 겨우 넘는 값은
          피하는 편이 낫습니다.
        </li>
        <li>
          <b className="text-text-basic">비활성 요소는 예외</b>입니다 — WCAG 가 명시적으로 뺍니다.
          <code>text-disabled</code> 가 기준을 안 지키는 것은 그래서입니다.
        </li>
        <li>
          <b className="text-text-basic">색만으로 뜻을 전하지 않는 것은 다른 조항</b>입니다.
          대비를 지켜도 색각 이상 대응은 따로 해야 합니다 — 이 저장소가 상태에 색과 함께 글자를
          두는 이유입니다 (이상결과 L · H, 완료여부 범례).
        </li>
      </ul>
    </div>
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

/**
 * 중립 회색은 Tailwind 기본 팔레트를 그대로 씁니다 — ack-theme.css 에 다시 정의하지 않습니다.
 * Figma 의 TailwindCSS/Colors 컬렉션(245개)이 같은 값을 담고 있습니다.
 *
 * 주의 — Tailwind 자체 팔레트는 클래스로 써야 생성됩니다.
 * bg-gray-300 은 되지만 var(--color-gray-300) 은 값이 비어 있습니다.
 * 우리 토큰만 @theme static 이라 항상 나가고, Tailwind 쪽은 트리셰이킹이 살아 있습니다.
 * 그래서 회색이 필요하면 gray 를 직접 쓰지 말고 Semantic 을 쓰세요.
 */
export const Tailwind: Story = {
  render: () => {
    const GRAY = [
      { step: "50", cls: "bg-gray-50", n: 16, ex: "background-gray-subtler · input-surface-readonly" },
      { step: "100", cls: "bg-gray-100", n: 15, ex: "action-accent · table-row-hover" },
      { step: "200", cls: "bg-gray-200", n: 29, ex: "surface-disabled · border-gray-light · table-border" },
      { step: "300", cls: "bg-gray-300", n: 14, ex: "input-border · button-tertiary-fill-border" },
      { step: "400", cls: "bg-gray-400", n: 5, ex: "text-disabled · switch-track-off" },
      { step: "500", cls: "bg-gray-500", n: 14, ex: "text-placeholder · text-muted-foreground" },
      { step: "600", cls: "bg-gray-600", n: 5, ex: "badge-neutral-solid-fill · tab-text-default" },
      { step: "700", cls: "bg-gray-700", n: 6, ex: "text-subtle · table-header-text" },
      { step: "800", cls: "bg-gray-800", n: 2, ex: "icon-gray · badge-neutral-text" },
      { step: "900", cls: "bg-gray-900", n: 15, ex: "text-basic · background-inverse" },
      { step: "950", cls: "bg-gray-950", n: 1, ex: "text-bolder" },
    ];
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-subtle">
          Semantic 317개 중 <b className="text-text-basic">122개</b>가 이 회색에서 왔습니다.
        </p>
        <div className="flex flex-col">
          {GRAY.map((g) => (
            <div
              key={g.step}
              className="flex items-center gap-3 border-b border-border-gray-light py-2"
            >
              <div className={`size-9 shrink-0 rounded-md border border-border-gray-light ${g.cls}`} />
              <span className="w-16 shrink-0 text-xs font-medium text-text-basic">gray/{g.step}</span>
              <span className="w-12 shrink-0 text-2xs text-text-primary">{g.n}개</span>
              <span className="truncate text-2xs text-text-subtle">{g.ex}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted-foreground">
          slate · zinc · red 등 나머지 팔레트도 클래스로 쓸 수 있지만, 이 프로젝트는 중립색을
          gray 하나로 통일했습니다. 회색 계열이 두 종류 섞이면 미세하게 색이 어긋납니다.
        </p>
      </div>
    );
  },
};

/**
 * 컴포넌트가 실제로 참조하는 값입니다.
 *
 * **고르기 전에 축부터 보세요** — 그룹 이름이 곧 용도입니다.
 */
export const Semantic: Story = {
  render: () => (
    <div>
      <Axes />
      <Group
        title="Text"
        note={<ContrastNote />}
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
