import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar, Download, Plus, Printer, RefreshCw, Search, Share2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { design, figma } from "./figma";

/**
 * Figma: TableCell 21 · TableHeaderCell 8 · TableRow 4 · TableToolbar 4
 *
 * 헤더와 본문 글자는 둘 다 14 입니다 — 굵기로만 구분합니다.
 * 행 높이는 --h-datagrid 라 모바일에서 34 → 36 으로 커집니다.
 * 페이지네이션 대신 스크롤을 쓰고, 건수는 툴바에 표시합니다.
 * 헤더 행은 스크롤 영역 밖에 두세요 — 스크롤해도 열 이름이 남아야 합니다.
 */
const meta = {
  title: "Data/Table",
  component: Table,
  parameters: { layout: "padded", ...design(figma.tableCell) },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { name: "김진영", chart: "2312345", test: "White Blood Cell (WBC)", value: "6.5", unit: "10³/μL", status: "완료", tone: "success" as const, date: "2025-06-05" },
  { name: "이수정", chart: "2312346", test: "Hemoglobin", value: "13.2", unit: "g/dL", status: "완료", tone: "success" as const, date: "2025-06-05" },
  { name: "박상철", chart: "2312347", test: "Fasting Glucose", value: "142", unit: "mg/dL", status: "재검", tone: "danger" as const, date: "2025-06-04" },
  { name: "최민영", chart: "2312348", test: "Total Cholesterol", value: "188", unit: "mg/dL", status: "완료", tone: "success" as const, date: "2025-06-04" },
  { name: "정혜진", chart: "2312349", test: "C-Reactive Protein", value: "0.8", unit: "mg/L", status: "진행중", tone: "warning" as const, date: "—" },
  { name: "한지수", chart: "2312350", test: "Platelet Count", value: "245", unit: "10³/μL", status: "완료", tone: "success" as const, date: "2025-06-03" },
  { name: "오세훈", chart: "2312351", test: "ALT (SGPT)", value: "38", unit: "U/L", status: "완료", tone: "success" as const, date: "2025-06-03" },
];

function ResultTable({ withToolbar = true }: { withToolbar?: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  const allOn = selected.length === ROWS.length;
  const some = selected.length > 0 && !allOn;

  return (
    <div className="overflow-hidden rounded-lg border border-table-border bg-table-row-surface">
      {withToolbar && (
        <TableToolbar title="검사이력목록" count={`총 ${ROWS.length}건`}>
          {selected.length > 0 && (
            <span className="mr-1 text-xs text-text-primary-strong">
              {selected.length}건 선택됨
            </span>
          )}
          <Button size="sm" variant="outline">
            <Plus />
            추가
          </Button>
          {selected.length > 0 && (
            <Button size="sm" variant="outline">
              삭제
            </Button>
          )}
          <span className="mx-1 h-4 w-px bg-table-border" aria-hidden />
          <Button size="icon-sm" variant="ghost" aria-label="다운로드">
            <Download />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="인쇄">
            <Printer />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="공유">
            <Share2 />
          </Button>
        </TableToolbar>
      )}
      <Table>
        <TableHeader>
          <tr>
            <TableHead className="w-10">
              <Checkbox
                size="sm"
                checked={allOn}
                indeterminate={some}
                onChange={() => setSelected(allOn ? [] : ROWS.map((r) => r.chart))}
                aria-label="전체 선택"
              />
            </TableHead>
            <TableHead>환자명</TableHead>
            <TableHead>차트번호</TableHead>
            <TableHead>검사명</TableHead>
            <TableHead align="right">결과</TableHead>
            <TableHead>단위</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>보고일</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r.chart} selected={selected.includes(r.chart)}>
              <TableCell>
                <Checkbox
                  size="sm"
                  checked={selected.includes(r.chart)}
                  onChange={() =>
                    setSelected((p) =>
                      p.includes(r.chart) ? p.filter((c) => c !== r.chart) : [...p, r.chart]
                    )
                  }
                  aria-label={`${r.name} 선택`}
                />
              </TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.chart}</TableCell>
              <TableCell>{r.test}</TableCell>
              <TableCell numeric>{r.value}</TableCell>
              <TableCell className="text-table-text-muted">{r.unit}</TableCell>
              <TableCell>
                <Badge tone={r.tone} size="sm">
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell className="text-table-text-muted">{r.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export const 기본: Story = { render: () => <ResultTable withToolbar={false} /> };

/** 선택하면 툴바에 건수와 삭제 버튼이 나타납니다. */
export const 툴바포함: Story = { render: () => <ResultTable /> };

/** 결과가 0건일 때. 헤더는 남겨야 어떤 열을 조회했는지 알 수 있습니다. */
export const 빈결과: Story = {
  render: () => (
    <div className="overflow-hidden rounded-lg border border-table-border bg-table-row-surface">
      <TableToolbar title="검사이력목록" count="총 0건" />
      <Table>
        <TableHeader>
          <tr>
            <TableHead>환자명</TableHead>
            <TableHead>차트번호</TableHead>
            <TableHead>검사명</TableHead>
            <TableHead>상태</TableHead>
          </tr>
        </TableHeader>
      </Table>
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="grid size-14 place-items-center rounded-full bg-surface-gray-subtle">
          <Search className="size-6 text-icon-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-text-basic">조회 결과가 없습니다</p>
          <p className="mt-1 text-sm text-text-subtle">조건을 바꿔 다시 조회해 보세요.</p>
        </div>
        <Button variant="outline">
          <RefreshCw />
          조건 초기화
        </Button>
      </div>
    </div>
  ),
};

/** 조회 조건 + 표. 실제 화면 한 벌입니다. */
export const 결과조회화면: Story = {
  parameters: { layout: "fullscreen", ...design(figma.tableToolbar) },
  render: function Screen() {
    const [sort, setSort] = useState<string | undefined>("a");
    return (
    <div className="min-h-screen bg-background-gray-subtler">
      <div className="border-b border-border-gray-light bg-background-white px-6 py-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <FormField label="기간설정">
              <Input trailingIcon={<Calendar />} defaultValue="2025-04-26 ~ 2026-07-07" />
            </FormField>
          </div>
          <div className="w-56">
            <FormField label="검색">
              <Input leadingIcon={<Search />} placeholder="성명 또는 차트번호" />
            </FormField>
          </div>
          <div className="w-40">
            <FormField label="정렬">
              <Select
                options={[
                  { value: "a", label: "접수번호순" },
                  { value: "b", label: "이름순" },
                ]}
                value={sort}
                onValueChange={setSort}
              />
            </FormField>
          </div>
          <Checkbox label="병원 출력금지 항목 제외" className="mb-2.5" />
          <div className="ml-auto mb-0.5 flex gap-2">
            <Button variant="outline">
              <RefreshCw />
              초기화
            </Button>
            <Button>
              <Search />
              조회
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ResultTable />
      </div>
    </div>
    );
  },
};

/**
 * Figma: `TableHeaderCell` 의 `Sort` 축 (None · Asc · Desc)
 *
 * **정렬할 수 있는 열에만** `sort` 를 넘기세요. 불가능한 열에 화살표가 보이면
 * 사용자가 눌러 봅니다 — Figma 문서도 같은 것을 경고합니다.
 *
 * 정렬되지 않은 열의 화살표는 **hover 에서만** 나타납니다.
 * 늘 보이면 어느 열이 실제로 정렬돼 있는지 흐려지고, 아예 없으면
 * 정렬할 수 있다는 걸 모릅니다.
 *
 * `aria-sort` 도 함께 나갑니다 — 보조기술은 화살표를 볼 수 없습니다.
 */
export const 정렬: Story = {
  render: function Sorting() {
    const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({
      key: "name",
      dir: "asc",
    });
    const cols = [
      { key: "name", label: "환자명", sortable: true },
      { key: "chart", label: "차트번호", sortable: true },
      { key: "test", label: "검사명", sortable: false },
      { key: "date", label: "보고일", sortable: true },
    ];
    const rows = [
      { name: "김진영", chart: "C-10293", test: "일반혈액검사", date: "2026-08-05" },
      { name: "박서준", chart: "C-10294", test: "소변검사", date: "2026-08-06" },
      { name: "이하늘", chart: "C-10295", test: "영상의학", date: "2026-08-07" },
    ];
    const sorted = [...rows].sort((a, b) => {
      const x = String(a[sort.key as keyof typeof a]);
      const y = String(b[sort.key as keyof typeof b]);
      return sort.dir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
    });

    return (
      <div className="overflow-hidden rounded-lg border border-table-border bg-background-white">
        <Table>
          <TableHeader>
            <tr>
              {cols.map((c) => (
                <TableHead
                  key={c.key}
                  sort={c.sortable ? (sort.key === c.key ? sort.dir : "none") : undefined}
                  onSortChange={(dir) => setSort({ key: c.key, dir })}
                >
                  {c.label}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={r.chart}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.chart}</TableCell>
                <TableCell>{r.test}</TableCell>
                <TableCell>{r.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

/**
 * 건수는 **칩**입니다. 제목 옆 회색 글자로 두면 부제처럼 읽혀
 * 세는 값이라는 게 흐려집니다.
 *
 * 선택이 있으면 한 칩에 함께 적습니다 — 칩을 둘로 나누면
 * 어느 쪽이 전체인지 매번 읽어야 합니다. 톤은 늘 neutral 입니다.
 */
export const 툴바건수: Story = {
  name: "툴바 건수",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-table-border bg-background-white">
        <TableToolbar title="검사이력목록" count="총 13건" />
      </div>
      <div className="rounded-lg border border-table-border bg-background-white">
        <TableToolbar title="검사이력목록" count="총 13건 / 3건 선택됨" />
      </div>
      <div className="rounded-lg border border-table-border bg-background-white">
        <TableToolbar title="검사이력목록" count="총 13건" size="lg" />
      </div>
    </div>
  ),
};
