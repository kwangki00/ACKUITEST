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
import { Separator } from "@/components/ui/separator";
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
import { Panel, SectionTitle, TableFrame } from "../panel";
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
      {/*
        **이름 줄과 정보 카드는 붙습니다** (2026-08-12). Figma `ResultList` 의
        `환자상세정보` 가 이 둘을 한 프레임에 `gap 0` 으로 담고 있습니다 — 이름 줄은
        카드들의 머리라, 사이가 벌면 서로 다른 블록으로 읽힙니다.

        `Panel` 의 10 은 **이 묶음과 검사목록 사이**에만 남습니다. 그 둘은 실제로
        다른 블록입니다.
      */}
      <div className="flex shrink-0 flex-col">
        {/*
          이름 줄 — Figma `ResultList` 의 규격입니다 (2026-08-12).
          이름 16 SemiBold · 항목 사이 gap 10 · **세로선 12px `Divider/Gray`**.

          선이 없으면 「차트번호 : 2312350 접수번호 : …」가 한 덩어리로 읽혀서
          어디서 끊어야 할지 눈이 매번 찾습니다. 값과 값 사이를 여백만으로 벌리려면
          간격을 크게 잡아야 하는데, 그러면 줄이 화면을 가로질러 길어집니다.
        */}
        <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-2.5 gap-y-2">
          <h2 className="text-base font-semibold text-text-basic">{patient.name}</h2>
          <NameDivider />
          <PatientMeta label="차트번호">{patient.chart}</PatientMeta>
          <NameDivider />
          <PatientMeta label="접수번호">{patient.receipt}</PatientMeta>
          <NameDivider />
          <span className="text-sm font-medium text-text-basic">{patient.sex}</span>
          <NameDivider />
          <span className="text-sm font-medium text-text-basic">{patient.age}세</span>
          {/* 이름 줄에서 유일한 상태 표시라 한 단계 큽니다 — sm(20)은 이름 옆에서 묻힙니다 */}
          <Badge tone="warning" size="default" styleVariant="outline">
            {DONE[patient.done].label}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <UserSearch />
              검사이력조회
            </Button>
            {/*
              **아이콘만 남깁니다** (2026-08-12). 환자 이름 옆의 좌우 화살표는 무엇을
              하는지 그 자체로 읽히고, 툴바에서 가장 자주 누르는 둘이라 폭을 줄이는
              값이 큽니다.

              **`aria-label` 은 필수입니다** — 화면에 글자가 없으면 보조기술이 읽을
              것이 아무것도 없습니다. 아이콘 전용 크기는 라벨이 없으면 타입이 막습니다.
            */}
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="이전환자"
              disabled={!onPrev}
              onClick={onPrev}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="다음환자"
              disabled={!onNext}
              onClick={onNext}
            >
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

        {/*
          늘 보는 값이라 Card 입니다 — 여백이 필요한 내용 블록입니다.

          **`size="sm"` 은 라이브러리 `Card Size=sm` 그대로**입니다 (2026-08-12) —
          제목 14 · 라벨·값 12 · 여백 16. `default`(제목 16 · 글자 14 · 여백 20)는
          이 자리에 과했습니다. 색은 원래부터 `Card/Label` · `Card/Value` 라 그대로입니다.

          화면 목업(`ResultList`)은 라벨 12 / 값 14 에 라벨 색도 `#364153` 인데,
          **라이브러리 어느 사이즈에도 없는 조합**이라 따르지 않았습니다.
        */}
        {open && (
          <div className="grid shrink-0 gap-3 lg:grid-cols-3">
            <Card variant="filled" size="sm">
              <CardHeader title="접수정보" />
              <CardBody>
                <CardRow label="접수일">{patient.date}</CardRow>
                <CardRow label="접수번호">{patient.receipt}</CardRow>
                <CardRow label="성명">{patient.name}</CardRow>
                <CardRow label="차트번호">{patient.chart}</CardRow>
              </CardBody>
            </Card>
            <Card variant="filled" size="sm">
              <CardHeader title="개인정보" />
              <CardBody>
                <CardRow label="주민등록번호">950203-2******</CardRow>
                <CardRow label="성별">{patient.sex}</CardRow>
                <CardRow label="나이">{patient.age}</CardRow>
              </CardBody>
            </Card>
            <Card variant="filled" size="sm">
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
      </div>

      {/*
        **제목줄과 표는 붙습니다** (2026-08-12). `Panel` 은 자식 사이에 10 을 주는데,
        Figma `ResultList` 는 이 둘을 한 프레임에 `gap 0` 으로 담고 있습니다 —
        제목이 자기 표의 머리라는 것이 간격으로 드러나야 합니다. 10 이 끼면 위의
        정보 카드와 같은 거리가 되어 별개 블록처럼 읽힙니다.

        묶어서 한 자식으로 만들었으므로 세로 공간도 이 묶음이 받습니다.
      */}
      <div className="flex min-h-0 flex-1 flex-col">
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
      </div>
    </Panel>
  );
}

/* ------------------------------------------------- 이름 줄 부품 */

/**
 * 이름 줄의 세로 구분선 — **12px · `Divider/Gray`** (Figma `ResultList`).
 *
 * `Separator` 의 기본 색(`Separator/Line` #e5e7eb)은 이 줄에서 거의 안 보입니다.
 * 글자 사이에 서는 선이라 표를 나누는 선보다 진해야 합니다.
 */
function NameDivider() {
  return <Separator direction="vertical" className="h-3 bg-divider-gray" />;
}

/**
 * 「차트번호 : 2312350」처럼 **라벨과 값의 크기·색이 갈리는** 한 덩어리.
 *
 * 통짜 문자열로 두면 라벨까지 값과 같은 크기가 되어, 훑을 때 숫자가 안 잡힙니다.
 * 라벨 12 · 값 14 는 정보 카드(`CardRow`)와 같은 규칙입니다.
 */
function PatientMeta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-xs text-text-muted-foreground">{label} :</span>
      <span className="text-sm font-medium text-text-basic">{children}</span>
    </span>
  );
}
