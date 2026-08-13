import * as React from "react";
import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Panel, SectionTitle, TableFrame } from "../panel";
import { DONE, MARKS, PATIENTS, TOTAL_PAGES, TOTAL_PATIENTS } from "./data";
import type { Patient } from "./data";

/**
 * 범례 — **여섯 칸**입니다 (Figma 화면과 같습니다).
 *
 * 점만 있으면 무슨 색이 무슨 뜻인지 알 수 없습니다. 「상태가 2종이면 점, 3종 이상이면
 * 배지」 규칙에서 보면 배지가 맞지만, **수백 행이 오는 목록**에서 배지를 세로로 쌓으면
 * 표가 배지밭이 됩니다. 대신 범례를 표 위에 두고 점마다 `aria-label` 로 이름을 답니다.
 * 행이 적은 검사목록에서는 규칙대로 배지입니다.
 *
 * **두 묶음이 이어 붙습니다** — 완료여부 넷(`DONE`) + 결과 유무 둘(`MARKS`).
 * 축이 달라 자료에서도 갈라 두었습니다.
 *
 * **제목 옆이 아니라 머리줄 아래**입니다 (2026-08-12). 여섯 칸이 「환자리스트 · 총
 * 979명」과 한 줄에 서면 판 폭을 넘습니다 — 넘치면 접히면서 머리줄 높이가 들쭉날쭉해집니다.
 */
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-2">
      {[...Object.values(DONE), ...Object.values(MARKS)].map((d) => (
        <span key={d.label} className="flex items-center gap-1.5 text-xs text-text-subtle">
          <span aria-hidden className={`size-2.5 rounded-full ${d.cls}`} />
          {d.label}
        </span>
      ))}
    </div>
  );
}

/**
 * 열 정의.
 *
 * **모듈 최상단에 둡니다** — 컴포넌트 안에서 만들면 렌더마다 새 배열이 되어 표가
 * 통째로 다시 만들어지고, 정렬 상태가 풀립니다.
 *
 * 폭·정렬은 `meta` 로 줍니다 (`DataTable` 이 `TableHead` · `TableCell` 에 넘깁니다).
 * 그림만 다른 열(순번의 폴더 · 이상결과 배지 · 완료여부 점)은 `cell` 로 그리고,
 * **정렬은 원본 값**으로 됩니다.
 */
const COLUMNS: DataTableColumn<Patient>[] = [
  {
    accessorKey: "no",
    header: "순번",
    meta: { width: "w-12" },
    // 묶음 접수는 순번 대신 폴더입니다 — 번호를 매길 수 있는 줄이 아닙니다
    cell: ({ row }) =>
      row.original.folder ? (
        <Folder aria-label="묶음 접수" className="size-4 text-icon-muted-foreground" />
      ) : (
        row.original.no
      ),
  },
  { accessorKey: "date", header: "접수일", meta: { width: "w-28" } },
  { accessorKey: "name", header: "성명", meta: { width: "w-20" } },
  { accessorKey: "chart", header: "차트번호", meta: { width: "w-22" } },
  // 값을 세는 칸이지 훑는 기준이 아닙니다 — 정렬하려면 접수일·성명으로 갑니다
  {
    accessorKey: "tests",
    header: "검사수",
    meta: { width: "w-12", align: "right" },
    enableSorting: false,
  },
  {
    accessorKey: "history",
    header: "검사이력",
    meta: { width: "w-14", align: "center" },
    enableSorting: false,
    // 있는 것만 표시합니다 — 빈 체크박스가 줄줄이 있으면 고르는 칸으로 읽힙니다
    cell: ({ row }) =>
      row.original.history ? <Checkbox aria-label={`${row.original.name} 검사이력`} /> : null,
  },
  {
    accessorKey: "flags",
    header: "이상결과",
    meta: { width: "w-16", align: "center" },
    // 정렬할 것이 아닙니다 — 배열이라 순서에 뜻이 없습니다
    enableSorting: false,
    // L·H 는 낮음·높음입니다. 색만으로 구분하지 않고 글자를 함께 씁니다
    cell: ({ row }) => (
      <span className="flex items-center justify-center gap-1">
        {row.original.flags.map((f) => (
          <Badge key={f} tone={f === "H" ? "danger" : "info"} size="sm">
            {f}
          </Badge>
        ))}
      </span>
    ),
  },
  {
    accessorKey: "done",
    header: "완료여부",
    meta: { width: "w-14", align: "center" },
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex justify-center">
        <span
          role="img"
          aria-label={DONE[row.original.done].label}
          className={`size-3 rounded-full ${DONE[row.original.done].cls}`}
        />
      </span>
    ),
  },
];

/**
 * 왼쪽 판 — 환자 목록. 고른 행이 오른쪽 상세를 바꿉니다.
 *
 * **표는 `DataTable`** 입니다 (2026-08-12). 정렬을 화면이 직접 계산하지 않습니다 —
 * 열 이름을 누르면 그 열로 정렬됩니다.
 *
 * **페이지네이션은 `DataTable` 에 맡기지 않습니다.** 여기 `PATIENTS` 는 한 쪽 분량이고
 * 전체 건수(979)·쪽 수(5)는 따로 옵니다 — 서버가 잘라 주는 구조라, 받은 배열을 잘라
 * 쓰는 `paginated` 를 켜면 14건을 5쪽으로 나누게 됩니다.
 *
 * 그래서 **스크롤 영역 밖의 `Pagination` 은 그대로**입니다. 몇 쪽을 보고 있었는지가
 * 목록과 함께 밀려 올라가면 다시 확인할 수 없습니다. 헤더 행도 같은 이유로 `sticky`
 * 인데, **스크롤은 `TableFrame` 이 갖습니다** — `DataTable` 이 또 만들면 두 겹이 되어
 * 헤더가 안 붙습니다.
 */
export function PatientList({
  chart,
  onSelect,
  page,
  onPageChange,
}: {
  chart: string;
  onSelect: (chart: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    /*
      **`gap-0` 입니다** (2026-08-12). `Panel` 의 기본 10 을 끕니다 — Figma `PatientList`
      가 제목줄(40) · 표 · 페이지네이션(48)을 간격 없이 쌓습니다.

      제목·범례는 **자기 표의 머리**이고 페이지네이션은 **자기 표의 발**이라, 간격이
      끼면 서로 다른 블록처럼 읽힙니다. 사이가 필요한 곳은 각자 여백을 갖습니다 —
      범례의 `pb-2` 가 표 앞의 숨통입니다.
    */
    <Panel className="w-145 shrink-0 gap-0">
      <SectionTitle title="환자리스트" count={`총 ${TOTAL_PATIENTS}명`} />
      {/* 여섯 칸이라 제목 옆에 두면 줄이 넘칩니다 — 머리줄 아래에 자기 줄로 놓습니다 */}
      <Legend />

      <TableFrame className="min-h-0 flex-1">
        <DataTable
          columns={COLUMNS}
          data={PATIENTS}
          // 차트번호가 행의 정체입니다 — index 로 두면 정렬한 뒤 선택이 엉뚱한 행으로 갑니다
          getRowId={(p) => p.chart}
          onRowClick={(p) => onSelect(p.chart)}
          activeRowId={chart}
          stickyHeader
          // 열 이름은 폭이 제각각인 칸의 머리라 가운데가 값과 덜 어긋납니다
          headerAlign="center"
          // 8열이라 px-3 이면 여백만 192px 입니다 — 판 폭(540)을 넘겨 날짜가 두 줄이 됐습니다
          dense
        />
      </TableFrame>

      <div className="flex h-12 shrink-0 items-center justify-center">
        <Pagination page={page} totalPages={TOTAL_PAGES} onPageChange={onPageChange} />
      </div>
    </Panel>
  );
}
