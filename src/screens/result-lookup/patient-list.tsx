import * as React from "react";
import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Panel, SectionTitle, TableFrame } from "./panel";
import { DONE, PATIENTS, TOTAL_PAGES, TOTAL_PATIENTS } from "./data";

/**
 * 완료여부 범례.
 *
 * 점만 있으면 무슨 색이 무슨 뜻인지 알 수 없습니다. 「상태가 2종이면 점, 3종 이상이면
 * 배지」 규칙에서 보면 배지가 맞지만, **수백 행이 오는 목록**에서 배지를 세로로 쌓으면
 * 표가 배지밭이 됩니다. 대신 범례를 표 위에 두고 점마다 `aria-label` 로 이름을 답니다.
 *
 * 행이 적은 검사목록에서는 규칙대로 배지입니다.
 */
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {Object.values(DONE).map((d) => (
        <span key={d.label} className="flex items-center gap-1.5 text-xs text-text-subtle">
          <span aria-hidden className={`size-2.5 rounded-full ${d.cls}`} />
          {d.label}
        </span>
      ))}
    </div>
  );
}

/**
 * 왼쪽 판 — 환자 목록. 고른 행이 오른쪽 상세를 바꿉니다.
 *
 * **페이지네이션은 스크롤 영역 밖**입니다. 몇 쪽을 보고 있었는지가 목록과 함께 밀려
 * 올라가면 다시 확인할 수 없습니다. 헤더 행도 같은 이유로 `sticky` 입니다.
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
    <Panel className="w-135 shrink-0">
      <SectionTitle title="환자리스트" count={`총 ${TOTAL_PATIENTS}명`}>
        <Legend />
      </SectionTitle>

      <TableFrame className="min-h-0 flex-1">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-14">순번</TableHead>
              <TableHead className="w-24">접수일</TableHead>
              <TableHead className="w-16">성명</TableHead>
              <TableHead className="w-24">차트번호</TableHead>
              <TableHead align="right" className="w-14">
                검사수
              </TableHead>
              <TableHead align="center" className="w-16">
                검사이력
              </TableHead>
              <TableHead align="center" className="w-16">
                이상결과
              </TableHead>
              <TableHead align="center" className="w-16">
                완료여부
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PATIENTS.map((p) => (
              <TableRow
                key={p.chart}
                selected={p.chart === chart}
                onClick={() => onSelect(p.chart)}
                className="cursor-pointer"
              >
                <TableCell>
                  {p.folder ? (
                    <Folder aria-label="묶음 접수" className="size-4 text-icon-muted-foreground" />
                  ) : (
                    p.no
                  )}
                </TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.chart}</TableCell>
                <TableCell align="right">{p.tests}</TableCell>
                <TableCell align="center">
                  {p.history && <Checkbox aria-label={`${p.name} 검사이력`} />}
                </TableCell>
                <TableCell align="center">
                  {/* L·H 는 낮음·높음입니다. 색만으로 구분하지 않고 글자를 함께 씁니다 */}
                  <span className="flex items-center justify-center gap-1">
                    {p.flags.map((f) => (
                      <Badge key={f} tone={f === "H" ? "danger" : "info"} size="sm">
                        {f}
                      </Badge>
                    ))}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <span className="flex justify-center">
                    <span
                      role="img"
                      aria-label={DONE[p.done].label}
                      className={`size-3 rounded-full ${DONE[p.done].cls}`}
                    />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableFrame>

      <div className="flex h-12 shrink-0 items-center justify-center">
        <Pagination page={page} totalPages={TOTAL_PAGES} onPageChange={onPageChange} />
      </div>
    </Panel>
  );
}
