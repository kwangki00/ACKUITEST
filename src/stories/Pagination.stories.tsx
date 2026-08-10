import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableToolbar } from "@/components/ui/table";
import { design, figma } from "./figma";

/**
 * Figma: Pagination 2 변형 + PaginationItem 32 변형
 *
 * 표 하단 중앙에 놓습니다. 총 건수는 TableToolbar 가 맡고
 * 여기서는 페이지 이동만 담당합니다.
 *
 * 스크롤과 둘 다 씁니다 — 한 화면에서 훑는 목록은 스크롤,
 * 건수가 많고 "몇 번째 페이지를 보고 있었는지"를 기억해야 하면 페이지네이션.
 */
const meta = {
  title: "Data/Pagination",
  component: Pagination,
  parameters: { layout: "padded", ...design(figma.pagination) },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "lg"] },
    totalPages: { control: { type: "number", min: 1 } },
    window: { control: { type: "number", min: 3, max: 9 }, description: "숫자 칸 최대 개수" },
    showEdges: { control: "boolean", description: "맨 앞·맨 뒤 버튼" },
  },
  args: {
    page: 1,
    totalPages: 10,
    size: "default",
    window: 5,
    showEdges: true,
    // 각 스토리가 useState 로 덮어씁니다. 여기 없으면 필수라 스토리마다 args 를 써야 합니다
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [p, setP] = useState(args.page);
    return <Pagination {...args} page={p} onPageChange={setP} />;
  },
};

/** 현재 페이지는 Primary 틴트입니다 — 채움을 쓰면 주 액션 버튼만큼 강해 보입니다. */
export const Size: Story = {
  render: function S(args) {
    const [p, setP] = useState(3);
    return (
      <div className="flex flex-col gap-5">
        {(["default", "lg"] as const).map((s) => (
          <div key={s}>
            <p className="mb-2 text-xs font-medium text-text-basic">
              {s} — {s === "default" ? "32 (--h-input-sm)" : "36 (--h-input-default)"}
            </p>
            <Pagination {...args} size={s} page={p} totalPages={10} onPageChange={setP} />
          </div>
        ))}
        <p className="text-2xs text-text-muted-foreground">
          페이지네이션은 조밀한 게 기본이라 다른 컨트롤보다 한 단계 작습니다.
          표 하단에서는 default 를 씁니다.
        </p>
      </div>
    );
  },
};

/**
 * 총 페이지와 현재 위치에 따라 창이 자동으로 계산됩니다.
 * Figma 는 슬롯 9개를 손으로 스왑해야 하지만 코드는 알아서 접습니다.
 */
export const 생략처리: Story = {
  render: () => {
    const CASES = [
      { total: 3, page: 1 },
      { total: 5, page: 3 },
      { total: 10, page: 1 },
      { total: 10, page: 5 },
      { total: 10, page: 10 },
      { total: 100, page: 50 },
    ];
    return (
      <div className="flex flex-col gap-3">
        {CASES.map((c) => (
          <div key={`${c.total}-${c.page}`} className="flex items-center gap-4">
            <span className="w-32 shrink-0 text-xs text-text-subtle">
              {c.total}페이지 · 현재 {c.page}
            </span>
            <Pagination page={c.page} totalPages={c.total} onPageChange={() => {}} />
          </div>
        ))}
        <p className="text-2xs text-text-muted-foreground">
          첫 페이지에서는 맨앞·이전이, 마지막에서는 다음·맨뒤가 자동으로 비활성됩니다.
        </p>
      </div>
    );
  },
};

/** 숫자 칸 개수와 맨앞·맨뒤 버튼은 조절할 수 있습니다. */
export const 옵션: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        { label: "window=3", props: { window: 3 } },
        { label: "window=5 (기본)", props: {} },
        { label: "window=7", props: { window: 7 } },
        { label: "showEdges=false — 페이지가 적을 때", props: { showEdges: false } },
      ].map((c) => (
        <div key={c.label} className="flex items-center gap-4">
          <span className="w-44 shrink-0 text-xs text-text-subtle">{c.label}</span>
          <Pagination page={5} totalPages={20} onPageChange={() => {}} {...c.props} />
        </div>
      ))}
    </div>
  ),
};

/** 표 하단 중앙에 놓습니다. 건수는 툴바에 있습니다. */
export const 표와함께: Story = {
  parameters: { layout: "padded", ...design(figma.pagination) },
  render: function WithTable() {
    const [page, setPage] = useState(1);
    const PER = 4;
    const ALL = Array.from({ length: 23 }, (_, i) => ({
      no: 23 - i,
      name: ["김민준", "이서연", "박도윤", "최지우", "정하준"][i % 5],
      test: ["일반혈액", "소변", "영상의학", "병리"][i % 4],
      date: `2026-08-${String((i % 28) + 1).padStart(2, "0")}`,
    }));
    const total = Math.ceil(ALL.length / PER);
    const rows = ALL.slice((page - 1) * PER, page * PER);

    return (
      <div className="max-w-3xl">
        <div className="overflow-hidden rounded-md border border-table-border">
          <TableToolbar title="검사이력목록" count={`총 ${ALL.length}건`} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>번호</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead>검사</TableHead>
                <TableHead>접수일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.no}>
                  <TableCell numeric>{r.no}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.test}</TableCell>
                  <TableCell>{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </div>
      </div>
    );
  },
};
