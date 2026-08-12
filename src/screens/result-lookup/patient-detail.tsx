import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  EllipsisVertical,
  Pencil,
  Printer,
  Share2,
  Trash2,
  UserSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardRow } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Panel, SectionTitle, TableFrame } from "./panel";
import { DONE, RESULTS, STATE_TONE, type Patient } from "./data";

/**
 * 오른쪽 판 — 고른 환자의 상세.
 *
 * ### 액션은 툴바에 outline 으로
 *
 * 툴바에 파란 버튼을 두지 않습니다 — 화면의 주 액션(조회)과 충돌합니다.
 * **넘치는 것은 `⋯` 로 묶습니다**: 수정 · 복제 · 공유 · 삭제.
 *
 * ### 요약은 접을 수 있습니다
 *
 * 검사목록을 길게 보고 싶을 때가 있습니다. 다만 **기본은 펼침**입니다 —
 * 접힌 내용은 잘 안 보고, 접수정보는 늘 확인하는 값입니다.
 */
export function PatientDetail({
  patient,
  onPrev,
  onNext,
}: {
  patient: Patient;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <Panel className="min-w-0 flex-1 overflow-y-auto">
      <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-lg font-bold text-text-basic">{patient.name}</h2>
        <span className="text-sm text-text-subtle">차트번호 : {patient.chart}</span>
        <span className="text-sm text-text-subtle">접수번호 : {patient.receipt}</span>
        <span className="text-sm text-text-basic">{patient.sex}</span>
        <span className="text-sm text-text-basic">{patient.age}세</span>
        <Badge tone="warning" size="sm" styleVariant="outline">
          {DONE[patient.done].label}
        </Badge>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserSearch />
            검사이력조회
          </Button>
          <Button variant="outline" size="sm" disabled={!onPrev} onClick={onPrev}>
            <ChevronLeft />
            이전환자
          </Button>
          <Button variant="outline" size="sm" disabled={!onNext} onClick={onNext}>
            다음환자
            <ChevronRight />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="다운로드">
            <Download />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="인쇄">
            <Printer />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="더 보기">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem leadingIcon={<Pencil />}>결과 수정</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Share2 />}>공유</DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* 되돌릴 수 없는 동작은 마지막 · 구분선 아래 */}
              <DropdownMenuItem tone="destructive" leadingIcon={<Trash2 />}>
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={open ? "요약 접기" : "요약 펼치기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {/* 화살표는 지금 상태입니다 — 펼쳐져 있으면 위 */}
            <ChevronUp className={open ? undefined : "rotate-180"} />
          </Button>
        </div>
      </div>

      {/* 늘 보는 값이라 Card 입니다 — 여백이 필요한 내용 블록입니다 */}
      {open && (
        <div className="grid shrink-0 gap-3 lg:grid-cols-3">
          <Card variant="filled">
            <CardHeader title="접수정보" />
            <CardBody>
              <CardRow label="접수일">{patient.date}</CardRow>
              <CardRow label="접수번호">{patient.receipt}</CardRow>
              <CardRow label="성명">{patient.name}</CardRow>
              <CardRow label="차트번호">{patient.chart}</CardRow>
            </CardBody>
          </Card>
          <Card variant="filled">
            <CardHeader title="개인정보" />
            <CardBody>
              <CardRow label="주민등록번호">950203-2******</CardRow>
              <CardRow label="성별">{patient.sex}</CardRow>
              <CardRow label="나이">{patient.age}</CardRow>
            </CardBody>
          </Card>
          <Card variant="filled">
            <CardHeader title="검사정보" />
            <CardBody>
              <CardRow label="검사명">Vaginal</CardRow>
              <CardRow label="출고장">-</CardRow>
              <CardRow label="기타">J97810208892</CardRow>
              <CardRow label="검사일">{patient.date}</CardRow>
            </CardBody>
          </Card>
        </div>
      )}

      <SectionTitle title="검사목록" count={`총 ${RESULTS.length}건`} />

      <TableFrame className="min-h-0">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-14">순번</TableHead>
              <TableHead className="w-28">바코드</TableHead>
              <TableHead>검사명</TableHead>
              <TableHead className="w-24">결과</TableHead>
              <TableHead align="right" className="w-20">
                결과값
              </TableHead>
              <TableHead className="w-20">단위</TableHead>
              <TableHead className="w-28">보고예정일자</TableHead>
              <TableHead align="center" className="w-12">
                C
              </TableHead>
              <TableHead align="center" className="w-12">
                P
              </TableHead>
              <TableHead align="center" className="w-16">
                승인
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESULTS.map((t) => (
              <TableRow key={t.barcode}>
                <TableCell>{t.no}</TableCell>
                <TableCell>{t.barcode}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>
                  {/* 상태가 3종이라 배지입니다. 색만이 아니라 글자로도 말합니다 */}
                  <Badge tone={STATE_TONE[t.state]} size="sm">
                    {t.state}
                  </Badge>
                </TableCell>
                {/* 값이 없으면 하이픈 — 빈칸이면 조회가 덜 된 건지 값이 없는 건지 모릅니다 */}
                <TableCell align="right">{t.value ?? "-"}</TableCell>
                <TableCell>{t.unit ?? "-"}</TableCell>
                <TableCell>{t.due}</TableCell>
                <TableCell align="center">{t.confirmed ? "✓" : ""}</TableCell>
                <TableCell align="center" />
                <TableCell align="center" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableFrame>
    </Panel>
  );
}
