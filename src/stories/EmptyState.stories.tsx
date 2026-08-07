import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EmptyState, TableEmptyRow } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { design, figma } from "./figma";

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", date: "2025-06-04", status: "재검", tone: "danger" },
] as const;

/**
 * Figma: EmptyState (6 변형 — Type 3 × Size 2)
 *
 * 내용이 없을 때 자리를 채웁니다. **빈 공간을 그냥 두면 로딩 중인지 결과가 없는지
 * 알 수 없습니다.**
 *
 * ### 셋의 차이는 “다음에 무엇을 하느냐” 입니다
 *
 * | `type` | 무슨 상황 | 사용자가 할 일 | 버튼 |
 * |---|---|---|---|
 * | `no-result` | 조회했는데 0건 | **조건을 바꿉니다** | `조건 초기화` (outline) |
 * | `no-data` | 데이터 자체가 없음 | **만듭니다** | `추가` (**Primary**) |
 * | `error` | 불러오기 실패 | **다시 시도합니다** | `다시 시도` (outline) |
 *
 * **`no-data` 만 Primary 버튼**입니다 — 셋 중 유일하게 *새로 만드는* 동작이라
 * 그 화면의 주 액션입니다. 나머지 둘은 되돌리거나 다시 해보는 것이라 outline 입니다.
 *
 * ### 문구가 `type` 을 따라옵니다
 *
 * Figma 는 TEXT 프로퍼티가 **세트 전체 공유**라 변형마다 다른 기본 문구를 줄 수 없습니다 —
 * 그래서 여섯 변형이 전부 "조회 결과가 없습니다" 로 보입니다.
 * **코드에는 그 제약이 없어** `type` 만 정하면 제목·설명·버튼 글자가 함께 바뀝니다.
 *
 * ### 표 안에서는 헤더 행 아래에
 *
 * **헤더까지 지우지 마세요** — 어떤 열을 조회했는지 알 수 없어집니다.
 * `TableEmptyRow` 가 `colSpan` 으로 그 자리를 채웁니다.
 *
 * ### 그 밖
 *
 * - `size="sm"` 은 **카드 안 · 시트 안**처럼 좁은 영역용입니다 (세로 여백 72 → 40)
 * - `onAction` 을 넘기지 않으면 **버튼이 사라집니다.** 할 수 있는 일이 없을 때만 —
 *   막다른 길에 버튼까지 없으면 더 답답합니다
 * - **실패는 Toast 만으로 두지 마세요** (`Toast` 규칙과 같음). 조회가 실패했으면
 *   화면에도 `type="error"` 를 남깁니다
 */
const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded", ...design(figma.emptyState) },
  argTypes: {
    type: { control: "inline-radio", options: ["no-result", "no-data", "error"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
    title: { control: "text" },
    description: { control: "text" },
    actionLabel: { control: "text" },
    icon: { control: false },
    onAction: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `type` 을 바꿔 보세요 — 아이콘 · 문구 · 버튼이 함께 바뀝니다. */
export const 기본: Story = {
  args: { type: "no-result", onAction: () => {} },
  render: (args) => (
    <div className="rounded-lg border border-table-border bg-background-white">
      <EmptyState {...args} />
    </div>
  ),
};

/**
 * 세 상황을 나란히 놓은 것입니다. **버튼 톤이 다른 것**에 주목하세요 —
 * `no-data` 만 새로 만드는 동작이라 Primary 입니다.
 */
export const 종류: Story = {
  name: "종류 3가지",
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["no-result", "조회했는데 0건 — 조건을 바꾸면 나올 수 있습니다"],
          ["no-data", "데이터 자체가 없음 — 만들어야 합니다"],
          ["error", "불러오기 실패 — 다시 시도하면 됩니다"],
        ] as const
      ).map(([type, desc]) => (
        <div key={type}>
          <p className="mb-2 text-xs text-text-subtle">
            <code>{type}</code> — {desc}
          </p>
          <div className="rounded-lg border border-table-border bg-background-white">
            <EmptyState type={type} onAction={() => {}} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** `sm` 은 카드 안 · 시트 안처럼 좁은 영역용입니다. 세로 여백이 72 에서 40 으로 줄어듭니다. */
export const 크기: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs text-text-subtle">default — 표 · 화면 전체</p>
        <div className="rounded-lg border border-table-border bg-background-white">
          <EmptyState type="no-result" onAction={() => {}} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">sm — 카드 안, 시트 안</p>
        <Card className="w-100">
          <EmptyState size="sm" type="no-data" onAction={() => {}} />
        </Card>
      </div>
    </div>
  ),
};

/**
 * **표에서는 헤더 행을 남깁니다** — 어떤 열을 조회했는지 알 수 있어야 합니다.
 * 건수 칩도 `총 0건` 으로 남습니다.
 *
 * 조회 버튼을 눌러 결과를 비워 보세요.
 */
export const 표안에서: Story = {
  name: "표 안에서",
  render: function InTable() {
    const [empty, setEmpty] = useState(false);
    const rows = empty ? [] : ROWS;

    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEmpty(true)}>
            결과 없는 조회
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEmpty(false)}>
            결과 있는 조회
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-table-border bg-background-white">
          <TableToolbar title="환자 리스트" count={`총 ${rows.length}건`} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>차트번호</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead>검사명</TableHead>
                <TableHead>보고일</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((r) => (
                  <TableRow key={r.chart}>
                    <TableCell>{r.chart}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.test}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Badge tone={r.tone} size="sm">
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // 헤더 행은 남기고 본문만 채웁니다
                <TableEmptyRow colSpan={5} type="no-result" onAction={() => setEmpty(false)} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  },
};

/**
 * 문구를 직접 쓰면 상황을 더 정확히 말할 수 있습니다.
 *
 * `description={null}` 로 설명을 지우거나, `onAction` 을 빼서 버튼을 없앨 수 있습니다 —
 * **버튼은 할 수 있는 일이 없을 때만 빼세요.**
 */
export const 문구직접: Story = {
  name: "문구 직접 쓰기",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-table-border bg-background-white">
        <EmptyState
          type="no-result"
          title="이 기간에 보고된 결과가 없습니다"
          description="2025년 6월 1일 ~ 6월 7일 · 일반혈액검사"
          actionLabel="기간 넓히기"
          onAction={() => {}}
        />
      </div>
      <div className="rounded-lg border border-table-border bg-background-white">
        <p className="px-6 pt-3 text-xs text-text-subtle">
          버튼 없음 — 권한이 없어 사용자가 할 수 있는 일이 없는 경우
        </p>
        <EmptyState
          type="no-data"
          title="조회 권한이 없습니다"
          description="담당자에게 권한을 요청하세요."
        />
      </div>
      <div className="rounded-lg border border-table-border bg-background-white">
        <p className="px-6 pt-3 text-xs text-text-subtle">설명 없음 · 아이콘 없음</p>
        <EmptyState size="sm" description={null} icon={false} onAction={() => {}} />
      </div>
    </div>
  ),
};
