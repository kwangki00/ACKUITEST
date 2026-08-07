import type { Meta, StoryObj } from "@storybook/react";
import * as Lucide from "lucide-react";
import { Info, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Figma: Guideline / Icon — 컴포넌트 199개, 이름 중복 없음
 *
 * 코드에서는 lucide-react 에서 같은 이름을 import 하면 됩니다.
 * Figma 이름이 icons/lucide-이름 규칙이라 번역이 필요 없습니다.
 * 199개 전부 그대로 잡힙니다 — 이름을 바꾸면 아래 경고 박스에 잡힙니다.
 *
 * 스트로크는 1.5 입니다 — Figma 1 은 16px 에서 흐려지고 lucide 기본 2 는 두꺼워
 * 둘의 절충으로 정했습니다. index.css 의 .lucide 규칙이 전역으로 적용합니다.
 */
const meta = {
  title: "Foundation/Icon",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 「└ Icon」 페이지의 컴포넌트 이름 그대로입니다 (icons/ 접두사만 뺌). */
const FIGMA_ICONS = [
  "activity", "arrow-down", "arrow-left", "arrow-right", "arrow-up", "at-sign", "award",
  "badge-check", "ban", "bell", "bell-off", "bluetooth", "book", "bookmark", "box",
  "calendar", "calendar-check", "calendar-days", "calendar-x", "camera", "chart-column",
  "chart-line", "chart-no-axes-column", "chart-no-axes-column-increasing", "chart-pie",
  "check", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "chevrons-down",
  "chevrons-left", "chevrons-right", "chevrons-up", "circle", "circle-alert", "circle-check",
  "circle-help", "circle-minus", "circle-plus", "circle-stop", "circle-x", "clipboard",
  "clock", "cloud", "cloud-rain", "cloud-snow", "code", "code-2", "columns", "compass",
  "copy", "cpu", "credit-card", "database", "dollar-sign", "download", "droplet", "ellipsis",
  "ellipsis-vertical", "external-link", "eye", "eye-off", "file", "file-image", "file-text",
  "film", "filter", "fingerprint", "flag", "flame", "folder", "folder-open", "folder-plus",
  "forward", "gauge", "gift", "git-branch", "git-commit", "git-merge", "globe", "grid",
  "hard-drive", "hash", "headphones", "heart", "heart-pulse", "hexagon", "home",
  "hourglass", "image", "inbox", "info", "key", "keyboard", "laptop", "layers", "layout",
  "leaf", "link", "loader-circle", "lock", "log-in", "log-out", "mail", "map", "map-pin",
  "menu", "message-circle", "message-square", "mic", "mic-off", "minus", "monitor", "moon",
  "mountain", "mouse", "move", "navigation", "octagon-alert", "package", "panel-left",
  "paperclip", "pause", "percent", "phone", "phone-call", "pill", "play", "plus", "printer",
  "receipt", "redo", "refresh-cw", "reply", "rotate-cw", "route", "rows", "save", "scissors",
  "search", "send", "server", "settings", "share", "share-2", "shield", "shield-check",
  "shopping-bag", "shopping-cart", "sidebar", "skip-back", "skip-forward", "sliders",
  "sliders-horizontal", "smartphone", "snowflake", "square", "square-pen", "star",
  "stethoscope", "store", "sun", "syringe", "tablet", "tag", "terminal", "thermometer",
  "thumbs-down", "thumbs-up", "timer", "toggle-left", "toggle-right", "trash-2",
  "trending-down", "trending-up", "triangle", "triangle-alert", "trophy", "tv", "umbrella",
  "undo", "unlock", "upload", "user", "user-check", "user-minus", "user-plus", "user-x",
  "users", "video", "volume-2", "volume-x", "wallet", "watch", "wifi", "wind", "x", "zap",
];

/** icons/chart-no-axes-column → ChartNoAxesColumn */
const toPascal = (n: string) =>
  n.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");

const resolved: { name: string; C: LucideIcon }[] = [];
const missing: string[] = [];
for (const n of FIGMA_ICONS) {
  const C = (Lucide as unknown as Record<string, LucideIcon | undefined>)[toPascal(n)];
  if (typeof C === "function" || (C && typeof C === "object")) resolved.push({ name: n, C });
  else missing.push(n);
}

/** Figma 에 있는 전체 목록입니다. 이름이 곧 lucide-react import 이름입니다. */
export const 아이콘: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-text-subtle">
        Figma {FIGMA_ICONS.length}개 중 <b className="text-text-basic">{resolved.length}개</b>가
        lucide-react 에서 바로 잡힙니다.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-10">
        {resolved.map(({ name, C }) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div className="grid size-11 place-items-center rounded-md border border-border-gray-light">
              <C className="size-5 text-icon-gray" />
            </div>
            <p className="w-full truncate text-center text-2xs text-text-subtle" title={name}>
              {name}
            </p>
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <section className="rounded-md border border-alert-warning-border bg-alert-warning-surface p-3">
          <h3 className="text-sm font-semibold text-text-basic">
            코드에서 못 찾는 이름 {missing.length}개
          </h3>
          <p className="mt-1 text-xs text-text-subtle">
            Figma 에는 있는데 lucide-react 에 같은 이름이 없습니다. 구버전 lucide 이름이거나 그
            사이에 바뀐 것들입니다 — Figma 쪽 이름을 고쳐야 1:1 대응이 유지됩니다.
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {missing.map((n) => (
              <li key={n} className="text-xs text-text-basic">
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  ),
};

/** 버튼 안에서 쓰는 크기입니다. 아이콘 전용 버튼은 정사각형의 50%. */
export const 크기: Story = {
  render: () => {
    const S = [
      { cls: "size-4", px: 16, use: "sm · default 버튼 · 입력 안" },
      { cls: "size-[18px]", px: 18, use: "" },
      { cls: "size-5", px: 20, use: "lg 버튼" },
      { cls: "size-6", px: 24, use: "단독 · 헤더" },
    ];
    return (
      <div className="flex flex-col">
        {S.map((s) => (
          <div
            key={s.px}
            className="flex items-center gap-3 border-b border-border-gray-light py-3"
          >
            <span className="w-16 shrink-0 text-xs font-medium text-text-basic">{s.px}px</span>
            <Search className={`${s.cls} shrink-0 text-icon-gray`} />
            <span className="text-2xs text-text-muted-foreground">{s.use}</span>
          </div>
        ))}
      </div>
    );
  },
};

/** 색은 Icon/* 시맨틱 토큰을 씁니다. Text/* 를 쓰지 마세요. */
export const 색: Story = {
  render: () => {
    const C = [
      ["icon-gray", "기본"],
      ["icon-gray-light", "보조"],
      ["icon-muted-foreground", "입력 안 · placeholder 와 같은 톤"],
      ["icon-disabled", "비활성"],
      ["icon-primary", "브랜드"],
      ["icon-primary-strong", "브랜드 강조"],
      ["icon-danger", "삭제 · 오류"],
      ["icon-warning", "주의"],
      ["icon-success", "완료"],
      ["icon-information1", "안내"],
    ] as const;
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {C.map(([token, use]) => (
          <div key={token} className="flex items-center gap-2.5">
            <Info className="size-5 shrink-0" style={{ color: `var(--color-${token})` }} />
            <div className="min-w-0">
              <p className="truncate text-xs text-text-basic">{token}</p>
              <p className="truncate text-2xs text-text-subtle">{use}</p>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 1.5 로 통일했습니다. Figma 원본 1 은 16px 에서 실효 0.67px 이라 흐려지고,
 * lucide 기본 2 는 한글 본문(400~500 웨이트) 옆에서 혼자 튑니다.
 */
export const 스트로크: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        {[1, 1.5, 2].map((w) => (
          <div key={w} className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-3" style={{ ["--icon-stroke" as string]: w }}>
              <Search className="size-4 text-icon-gray" />
              <Search className="size-5 text-icon-gray" />
              <Search className="size-6 text-icon-gray" />
              <Search className="size-10 text-icon-gray" />
            </div>
            <p className="text-xs text-text-basic">
              {w}
              {w === 1 && <span className="ml-1 text-text-subtle">← Figma 원본</span>}
              {w === 1.5 && <span className="ml-1 text-text-primary">← 지금 값</span>}
              {w === 2 && <span className="ml-1 text-text-subtle">← lucide 기본</span>}
            </p>
          </div>
        ))}
      </div>
      <table className="w-full max-w-xl border-collapse text-left text-xs">
        <tbody>
          {[
            ["캔버스", "24 × 24 — 전 아이콘 동일"],
            ["스트로크", "1.5px · 끝단 ROUND — Figma 568개 벡터 전부"],
            ["constraints", "SCALE / SCALE — 인스턴스를 줄이면 글리프도 축소"],
            ["이름", "icons/lucide-이름 — 코드 import 이름과 동일"],
            ["작게 그릴 때", "non-scaling-stroke 로 굵기를 고정 — 12px 아이콘도 화면 1.5px"],
            ["예외 지정", "[--icon-stroke:2] — 지금 쓰는 곳은 없습니다"],
          ].map(([k, v]) => (
            <tr key={k} className="border-b border-table-border">
              <td className="w-28 py-2 font-medium text-text-basic">{k}</td>
              <td className="py-2 text-text-subtle">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-text-muted-foreground">
        Figma 쪽 아이콘 이름 중 일부가 구버전 lucide 입니다 — <code>check-circle</code> 은 코드에서
        <code> circle-check</code> 입니다.
      </p>
    </div>
  ),
};
