import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { design, figma } from "./figma";

/**
 * Figma: Loading & Divider — Skeleton 9 · Spinner 8 · Progress 2 · Separator 2
 *
 * 셋을 고르는 기준은 **기다림의 성격**입니다.
 * - 영역 전체가 채워질 예정 → Skeleton
 * - 짧고 작은 대기        → Spinner
 * - 끝이 보이는 작업       → Progress
 */
const meta = {
  title: "Feedback/Loading & Divider",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 무엇을 언제 쓰는지. */
export const 고르는기준: Story = {
  render: () => (
    <table className="w-full max-w-2xl border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-table-border-strong">
          {["", "쓰는 때", "쓰지 말아야 할 때"].map((h) => (
            <th key={h} className="p-2 font-semibold text-table-header-text">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-text-basic">
        {[
          ["Skeleton", "표·카드처럼 영역 전체가 채워질 예정", "버튼 안처럼 좁은 자리"],
          ["Spinner", "짧고 작은 대기 (3초 이내)", "3초 이상 — 안내 문구를 함께 두세요"],
          ["Progress", "업로드·일괄 처리처럼 끝이 보이는 작업", "끝을 알 수 없는 작업"],
        ].map(([a, b, c]) => (
          <tr key={a} className="border-b border-table-border align-top">
            <td className="p-2 font-medium whitespace-nowrap">{a}</td>
            <td className="p-2 text-text-subtle">{b}</td>
            <td className="p-2 text-text-muted-foreground">{c}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Shape 3 × Size 3. 폭은 시작점일 뿐이라 className 으로 덮어씁니다. */
export const Skeleton_전체: Story = {
  name: "Skeleton — 전체",
  parameters: { layout: "padded", ...design(figma.skeleton) },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["text", "circle", "block"] as const).map((shape) => (
        <div key={shape}>
          <p className="mb-2 text-xs font-medium text-text-basic">{shape}</p>
          <div className="flex items-end gap-4">
            {(["sm", "default", "lg"] as const).map((size) => (
              <Skeleton key={size} shape={shape} size={size} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * 실제 콘텐츠와 같은 크기·개수로 깔아야 로딩이 끝났을 때 화면이 튀지 않습니다.
 * 버튼을 눌러 전환을 확인해 보세요.
 */
export const Skeleton_표: Story = {
  name: "Skeleton — 표에 깔기",
  parameters: { layout: "padded", ...design(figma.skeleton) },
  render: function TableSkeleton() {
    const [loading, setLoading] = useState(true);
    const ROWS = [
      ["김민준", "혈액검사", "2026-08-01", "완료"],
      ["이서연", "소변검사", "2026-08-02", "진행중"],
      ["박도윤", "영상의학", "2026-08-03", "완료"],
    ];
    return (
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <Button size="sm" variant="outline" className="w-fit" onClick={() => setLoading((v) => !v)}>
          {loading ? "불러오기 완료" : "다시 불러오기"}
        </Button>
        <div
          aria-busy={loading}
          className="overflow-hidden rounded-md border border-table-border"
        >
          <table className="w-full border-collapse text-sm text-table-text">
            <thead className="bg-table-header-surface">
              <tr>
                {["환자명", "검사", "접수일", "상태"].map((h) => (
                  <th
                    key={h}
                    className="h-[var(--h-datagrid)] border-b border-table-border-strong px-3 text-left font-semibold text-table-header-text"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-table-border">
                  {r.map((cell, j) => (
                    <td key={j} className="h-[var(--h-datagrid)] px-3">
                      {loading ? <Skeleton shape="text" size="sm" className="w-20" /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-2xs text-text-muted-foreground">
          Skeleton 자체는 aria-hidden 입니다. 대신 감싸는 영역에 aria-busy 를 두어
          &quot;지금 불러오는 중&quot;을 알립니다.
        </p>
      </div>
    );
  },
};

/** Tone 2 × Size 4. 두께는 지름의 10% 입니다. */
export const Spinner_전체: Story = {
  name: "Spinner — 전체",
  parameters: { layout: "padded", ...design(figma.spinner) },
  render: () => (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">default</p>
        <div className="flex items-center gap-5">
          {(["xs", "sm", "default", "lg"] as const).map((s) => (
            <Spinner key={s} size={s} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">
          onPrimary — Primary 버튼 위에서 씁니다
        </p>
        <div className="flex w-fit items-center gap-5 rounded-md bg-button-primary-fill p-4">
          {(["xs", "sm", "default", "lg"] as const).map((s) => (
            <Spinner key={s} size={s} tone="onPrimary" />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">버튼 안 · 단독</p>
        <div className="flex items-center gap-4">
          <Button loading>저장 중</Button>
          <Button variant="outline" loading>
            조회 중
          </Button>
          <span className="flex items-center gap-2 text-sm text-text-subtle">
            <Spinner size="sm" />
            결과를 불러오는 중입니다
          </span>
          <Spinner label="불러오는 중" />
        </div>
      </div>
    </div>
  ),
};

/** 끝이 보이는 작업에만. Header 를 켜면 라벨과 퍼센트가 붙습니다. */
export const Progress_전체: Story = {
  name: "Progress — 전체",
  parameters: { layout: "padded", ...design(figma.progress) },
  render: function P() {
    const [v, setV] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setV((p) => (p >= 100 ? 0 : p + 4)), 250);
      return () => clearInterval(t);
    }, []);
    return (
      <div className="flex w-full max-w-md flex-col gap-6">
        <Progress value={v} label="업로드 중" showPercent />
        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">size — sm 4 / default 8</p>
          <div className="flex flex-col gap-3">
            <Progress value={60} size="sm" />
            <Progress value={60} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-basic">헤더 조합</p>
          <div className="flex flex-col gap-3">
            <Progress value={35} label="검사 결과 내려받는 중" />
            <Progress value={35} showPercent />
            <Progress value={35} />
          </div>
        </div>
      </div>
    );
  },
};

/** 라벨을 켜면 선이 둘로 갈라집니다. */
export const Separator_전체: Story = {
  name: "Separator — 전체",
  parameters: { layout: "padded", ...design(figma.separator) },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-96">
        <p className="mb-2 text-xs font-medium text-text-basic">horizontal</p>
        <Separator />
        <div className="h-4" />
        <Separator label="또는" />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">
          vertical — 툴바에서 버튼 그룹을 나눌 때
        </p>
        <div className="flex h-[var(--h-toolbar)] w-fit items-center gap-2 rounded-md border border-table-border px-3">
          <Button size="sm" variant="outline">
            추가
          </Button>
          <Button size="sm" variant="outline">
            편집
          </Button>
          <Separator direction="vertical" className="my-2" />
          <Button size="sm" variant="outline">
            내려받기
          </Button>
          <Button size="sm" variant="outline">
            인쇄
          </Button>
        </div>
      </div>

      <p className="max-w-md text-xs text-text-muted-foreground">
        카드나 표 안에서는 Separator 를 쓰지 마세요 — 그쪽은 컴포넌트 자체 테두리가
        담당합니다. Separator 는 그 밖의 영역 분할용입니다.
      </p>
    </div>
  ),
};
