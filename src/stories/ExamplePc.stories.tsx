import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Download,
  Folder,
  Mail,
  Printer,
  RefreshCw,
  Search,
  UserSearch,
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { TabItem, TabPanel, Tabs } from "@/components/ui/tabs";
import { FormField } from "@/components/ui/form-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardRow } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DateRange } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- 자료 */

/** 완료여부 — 점 하나로 상태를 알립니다. 범례가 위에 있어야 읽힙니다. */
const DONE = {
  all: { label: "전체완료", cls: "bg-badge-success-solid-fill" },
  part: { label: "부분완료", cls: "bg-badge-warning-solid-fill" },
  few: { label: "소견미완료", cls: "bg-badge-info-solid-fill" },
  none: { label: "미완료", cls: "bg-badge-danger-solid-fill" },
} as const;
type DoneKey = keyof typeof DONE;

type Row = {
  no: number;
  folder?: boolean;
  date: string;
  name: string;
  chart: string;
  tests: number;
  history: boolean;
  flags: ("L" | "H")[];
  done: DoneKey;
};

const ROWS: Row[] = [
  { no: 1, date: "2025-06-01", name: "김진영", chart: "2312345", tests: 3, history: false, flags: ["L", "H"], done: "all" },
  { no: 2, date: "2025-06-01", name: "이수정", chart: "2312346", tests: 5, history: false, flags: ["L"], done: "all" },
  { no: 3, date: "2025-06-01", name: "박상철", chart: "2312347", tests: 2, history: true, flags: [], done: "none" },
  { no: 4, folder: true, date: "2025-06-01", name: "최민영", chart: "2312348", tests: 12, history: true, flags: [], done: "none" },
  { no: 5, folder: true, date: "2025-06-01", name: "정혜진", chart: "2312349", tests: 4, history: true, flags: [], done: "none" },
  { no: 6, folder: true, date: "2025-06-01", name: "한지수", chart: "2312350", tests: 15, history: true, flags: [], done: "none" },
  { no: 7, folder: true, date: "2025-06-01", name: "오영준", chart: "2312351", tests: 2, history: true, flags: [], done: "none" },
  { no: 8, folder: true, date: "2025-06-01", name: "윤지혜", chart: "2312352", tests: 2, history: true, flags: [], done: "none" },
  { no: 9, date: "2025-06-01", name: "강태우", chart: "2312353", tests: 2, history: false, flags: [], done: "part" },
  { no: 10, date: "2025-06-01", name: "조은서", chart: "2312354", tests: 2, history: true, flags: [], done: "none" },
  { no: 11, date: "2025-06-01", name: "임소연", chart: "2312355", tests: 9, history: true, flags: [], done: "none" },
  { no: 12, date: "2025-06-01", name: "서주혁", chart: "2312356", tests: 9, history: false, flags: [], done: "part" },
  { no: 13, date: "2025-06-01", name: "김민준", chart: "2312357", tests: 9, history: false, flags: [], done: "part" },
  { no: 14, date: "2025-06-01", name: "노현주", chart: "2312358", tests: 7, history: true, flags: [], done: "none" },
];

type Test = {
  no: number;
  barcode: string;
  name: string;
  state: "완료" | "진행중" | "보고예정";
  value?: string;
  unit?: string;
  due: string;
  c?: boolean;
};

const TESTS: Test[] = [
  { no: 1, barcode: "C36540BHZ", name: "Culture ID (Vaginal)", state: "보고예정", due: "2025-06-05" },
  { no: 2, barcode: "C36540BH02", name: "White Blood Cell (WBC)", state: "완료", value: "6.5", unit: "10³/μL", due: "2025-06-05", c: true },
  { no: 3, barcode: "C36540BH03", name: "Red Blood Cell (RBC)", state: "완료", value: "4.2", unit: "10⁶/μL", due: "2025-06-05", c: true },
  { no: 4, barcode: "C36540BH04", name: "Hemoglobin (Hb)", state: "완료", value: "13.5", unit: "g/dL", due: "2025-06-05", c: true },
  { no: 5, barcode: "C36540BH05", name: "Platelet Count", state: "완료", value: "245", unit: "10³/μL", due: "2025-06-05" },
  { no: 6, barcode: "C36540BH06", name: "Fasting Glucose", state: "진행중", unit: "mg/dL", due: "2025-06-06" },
  { no: 7, barcode: "C36540BH07", name: "HbA1c", state: "완료", value: "5.8", unit: "%", due: "2025-06-05", c: true },
  { no: 8, barcode: "C36540BH08", name: "Total Cholesterol", state: "완료", value: "180", unit: "mg/dL", due: "2025-06-05" },
  { no: 9, barcode: "C36540BH09", name: "HDL Cholesterol", state: "완료", value: "55", unit: "mg/dL", due: "2025-06-05" },
  { no: 10, barcode: "C36540BH10", name: "LDL Cholesterol", state: "완료", value: "110", unit: "mg/dL", due: "2025-06-05" },
  { no: 11, barcode: "C36540BH11", name: "Triglycerides", state: "완료", value: "145", unit: "mg/dL", due: "2025-06-05" },
  { no: 12, barcode: "C36540BH12", name: "Urinalysis", state: "보고예정", due: "2025-06-06" },
];

const STATE_TONE: Record<Test["state"], "success" | "warning" | "primary"> = {
  완료: "success",
  진행중: "warning",
  보고예정: "primary",
};

const MENU = [
  { name: "검사관리", icon: <ClipboardList />, items: ["통합결과조회", "검사결과", "검사이력"] },
  { name: "통계관리", icon: <ChartColumn />, items: ["기간별 통계", "검사별 통계"] },
  { name: "고객SMS관리", icon: <Mail />, items: ["SMS 발송", "발송 이력"] },
];

const SORTS = [
  { value: "recv", label: "접수번호순" },
  { value: "name", label: "성명순" },
  { value: "date", label: "접수일순" },
];

/* ---------------------------------------------------------------- 조각 */

/**
 * 조회 조건 — **한 줄**입니다.
 *
 * `FilterBar` 를 쓰지 않았습니다. `FilterBar` 는 조회 뒤에 접어서 표에 자리를 내주는
 * 것인데, 이 화면은 **좌우 분할이라 세로 자리가 이미 넉넉**합니다. 접을 이유가 없으면
 * 접는 장치를 두지 않습니다 — 누를 것이 하나 늘 뿐입니다.
 */
function QueryBar() {
  const [period, setPeriod] = useState<DateRange>({
    start: new Date(2025, 3, 26),
    end: new Date(2026, 6, 7),
  });
  const [sort, setSort] = useState<string | undefined>("recv");
  const [keyword, setKeyword] = useState("");
  const [excludeBlocked, setExcludeBlocked] = useState(false);

  return (
    <div className="flex flex-wrap items-end gap-6 border-b border-border-gray-light bg-background-white px-6 py-4">
      <FormField label="기간설정" className="w-fit">
        <DateRangePicker quickSelect value={period} onValueChange={setPeriod} />
      </FormField>

      <FormField label="조회조건" className="w-fit">
        <div className="flex items-center gap-3">
          <Input
            leadingIcon={<Search />}
            placeholder="성명 또는 차트번호"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={keyword ? () => setKeyword("") : undefined}
            className="w-64"
          />
          <Checkbox
            label="병원 출력금지 항목 제외"
            checked={excludeBlocked}
            onChange={(e) => setExcludeBlocked(e.target.checked)}
          />
          <div className="w-36">
            <Select options={SORTS} value={sort} onValueChange={setSort} />
          </div>
        </div>
      </FormField>

      {/* 라벨이 없어 items-end 로 필드 바닥에 붙입니다 — 안 그러면 17px 위로 뜹니다 */}
      <div className="ml-auto flex items-center gap-2">
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
  );
}

/**
 * 판 — 좌우 두 덩어리가 같은 대접입니다. 반경 8 · 테두리 · 여백 좌우 20 · 상하 10.
 *
 * **`Card` 가 아닙니다.** `Card` 는 제목·내용을 묶는 표면이고, 이건 **섹션 여러 개를
 * 담는 자리**입니다. Figma 도 이 두 판은 `Card` 인스턴스가 아니라 그냥 프레임입니다.
 */
function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-2.5 rounded-lg border border-table-border",
        "bg-background-white px-5 py-2.5",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 섹션 제목줄 — 높이 40. **판의 여백 안에 있어서 밑줄을 긋지 않습니다.**
 *
 * `TableToolbar` 를 쓰지 않은 이유입니다 — 그건 표에 딱 붙는 줄이라 아래 테두리가
 * 있고 좌우 여백을 스스로 갖습니다. 여기서는 표가 **자기 테두리를 따로** 가지므로
 * 제목줄이 그 밖에 있고, 밑줄을 그으면 선이 두 겹이 됩니다.
 */
function SectionTitle({
  title,
  count,
  children,
}: {
  title: string;
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-base font-semibold text-table-text">{title}</span>
      {/* 톤은 늘 neutral 입니다. 건수에 색을 주면 상태처럼 읽힙니다 */}
      {count && (
        <Badge tone="neutral" size="sm">
          {count}
        </Badge>
      )}
      {children}
    </div>
  );
}

/** 완료여부 범례 — 점만 있으면 무슨 색이 무슨 뜻인지 알 수 없습니다. */
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

/** 왼쪽 — 환자 목록. 고른 행이 오른쪽 상세를 바꿉니다. */
function PatientList({
  chart,
  onSelect,
}: {
  chart: string;
  onSelect: (chart: string) => void;
}) {
  const [page, setPage] = useState(1);

  return (
    <Panel className="w-135 shrink-0">
      <SectionTitle title="환자리스트" count="총 979명">
        <Legend />
      </SectionTitle>

      {/*
        표가 **자기 테두리**를 갖습니다 — 판 안에 섹션이 여럿이라, 표가 어디서
        시작하고 끝나는지 스스로 말해야 합니다 (Figma 도 같은 구조).
        판에 붙여 그리면 제목줄·페이지네이션과 경계가 흐려집니다.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-table-border">
        <Table>
          {/* 헤더 행은 sticky 라 스크롤해도 열 이름이 남습니다 */}
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
            {ROWS.map((r) => (
              <TableRow
                key={r.chart}
                selected={r.chart === chart}
                onClick={() => onSelect(r.chart)}
                className="cursor-pointer"
              >
                <TableCell>
                  {r.folder ? (
                    <Folder aria-label="묶음" className="size-4 text-icon-muted-foreground" />
                  ) : (
                    r.no
                  )}
                </TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.chart}</TableCell>
                <TableCell align="right">{r.tests}</TableCell>
                <TableCell align="center">
                  {r.history && <Checkbox aria-label={`${r.name} 검사이력`} />}
                </TableCell>
                <TableCell align="center">
                  {/* L·H 는 낮음·높음입니다. 색만으로 구분하지 않고 글자를 함께 씁니다 */}
                  <span className="flex items-center justify-center gap-1">
                    {r.flags.map((f) => (
                      <Badge key={f} tone={f === "H" ? "danger" : "info"} size="sm">
                        {f}
                      </Badge>
                    ))}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <span className="flex justify-center">
                    <span
                      aria-label={DONE[r.done].label}
                      role="img"
                      className={`size-3 rounded-full ${DONE[r.done].cls}`}
                    />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션은 스크롤 영역 밖 — 몇 쪽을 보고 있었는지 남아야 합니다 */}
      <div className="flex h-12 shrink-0 items-center justify-center">
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </div>
    </Panel>
  );
}

/** 오른쪽 — 고른 환자의 상세. */
function Detail({ chart }: { chart: string }) {
  const [open, setOpen] = useState(true);
  const r = ROWS.find((x) => x.chart === chart)!;

  return (
    /* 왼쪽과 같은 판입니다 — 나란히 놓인 두 덩어리가 같은 층위이기 때문입니다 */
    <Panel className="min-w-0 flex-1 overflow-y-auto">
      {/* 머리 — 이름 · 식별값 · 상태, 우측에 액션 */}
      <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="text-lg font-bold text-text-basic">{r.name}</h2>
          <span className="text-sm text-text-subtle">차트번호 : {r.chart}</span>
          <span className="text-sm text-text-subtle">접수번호 : 202506011001</span>
          <span className="text-sm text-text-basic">여</span>
          <span className="text-sm text-text-basic">36세</span>
          <Badge tone="warning" size="sm" styleVariant="outline">
            {DONE[r.done].label}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <UserSearch />
              검사이력조회
            </Button>
            <Button variant="outline" size="sm">
              <ChevronLeft />
              이전환자
            </Button>
            <Button variant="outline" size="sm">
              다음환자
              <ChevronRight />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="다운로드">
              <Download />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="인쇄">
              <Printer />
            </Button>
            {/* 접으면 검사목록이 위로 올라옵니다 — 표를 길게 보고 싶을 때 */}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={open ? "요약 접기" : "요약 펼치기"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <ChevronUp className={open ? undefined : "rotate-180"} />
            </Button>
          </div>
        </div>

      {/* 늘 보는 값이라 Card 입니다 — 접는 것은 사용자가 정합니다 */}
      {open && (
        <div className="grid shrink-0 gap-3 lg:grid-cols-3">
            <Card variant="filled">
              <CardHeader title="접수정보" />
              <CardBody>
                <CardRow label="접수일">2025-06-01</CardRow>
                <CardRow label="접수번호">20250601001</CardRow>
                <CardRow label="성명">{r.name}</CardRow>
                <CardRow label="차트번호">{r.chart}</CardRow>
              </CardBody>
            </Card>
            <Card variant="filled">
              <CardHeader title="개인정보" />
              <CardBody>
                <CardRow label="주민등록번호">950203-2******</CardRow>
                <CardRow label="성별">여</CardRow>
                <CardRow label="나이">30</CardRow>
              </CardBody>
            </Card>
            <Card variant="filled">
              <CardHeader title="검사정보" />
              <CardBody>
                <CardRow label="검사명">Vaginal</CardRow>
                <CardRow label="출고장">-</CardRow>
                <CardRow label="기타">J97810208892</CardRow>
                <CardRow label="검사일">2025-06-01</CardRow>
              </CardBody>
            </Card>
        </div>
      )}

      <SectionTitle title="검사목록" count={`총 ${TESTS.length}건`} />

      {/* 왼쪽 표와 같습니다 — 판 안에 섹션이 여럿이라 표가 자기 테두리를 갖습니다 */}
      <div className="min-h-0 overflow-y-auto rounded-md border border-table-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">순번</TableHead>
              <TableHead className="w-28">바코드</TableHead>
              <TableHead>검사명</TableHead>
              <TableHead className="w-20">결과</TableHead>
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
            {TESTS.map((t) => (
              <TableRow key={t.barcode}>
                <TableCell>{t.no}</TableCell>
                <TableCell>{t.barcode}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>
                  {/*
                    상태는 배지입니다 — 「상태가 3종 이상이면 배지」 규칙 그대로.
                    색만으로 구분하지 않고 글자를 함께 씁니다
                  */}
                  <Badge tone={STATE_TONE[t.state]} size="sm">
                    {t.state}
                  </Badge>
                </TableCell>
                <TableCell align="right">{t.value ?? "-"}</TableCell>
                <TableCell>{t.unit ?? "-"}</TableCell>
                <TableCell>{t.due}</TableCell>
                <TableCell align="center">{t.c ? "✓" : ""}</TableCell>
                <TableCell align="center" />
                <TableCell align="center" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- 스토리 */

/**
 * **실제 조회 화면의 구성**입니다 — Figma `SCL_페이지 디자인` 의 `결과조회-기본`
 * (Page 3 e-smart) 을 옮긴 것으로, **1920 폭**입니다.
 *
 * ### 왜 좌우 분할인가
 *
 * 결과를 확인하는 일은 **환자를 옮겨 다니며** 합니다. 목록을 떠나 상세로 갔다가
 * 돌아오는 것보다, 왼쪽에서 고르고 오른쪽에서 보는 편이 손이 덜 갑니다 —
 * 「이전환자 · 다음환자」 버튼이 그 흐름을 그대로 잇습니다.
 *
 * 상세를 **새 탭으로 여는 화면**도 있습니다(문서 탭이 필요한 경우). 여기는 그
 * 반대쪽 — 한 화면 안에서 끝내는 구성입니다.
 *
 * ### `FilterBar` 를 쓰지 않았습니다
 *
 * `FilterBar` 는 조회 뒤에 접어서 **표에 세로 자리를 내주는** 장치입니다.
 * 이 화면은 좌우로 나눠서 세로가 이미 넉넉하니 접을 이유가 없고, 접는 장치를
 * 두면 누를 것만 하나 늘어납니다. 조건 줄을 그냥 한 줄로 둡니다.
 *
 * ### 판은 두 겹입니다
 *
 * ```
 * 판  (반경 8 · 테두리 · 여백 좌우 20 상하 10)
 * ├ 제목줄 40          환자리스트 · 총 979명 · 범례
 * ├ 표     자기 테두리   ← 판에 붙이지 않습니다
 * └ 페이지네이션 48
 * ```
 *
 * **표가 자기 테두리를 갖는 이유** — 판 안에 섹션이 여럿이라 표가 어디서 시작하고
 * 끝나는지 스스로 말해야 합니다. 판에 붙여 그리면 제목줄·페이지네이션과 경계가
 * 흐려집니다. Figma 도 같은 구조입니다 (`Frame 8` 안에 테두리 있는 `Table`).
 *
 * **`TableToolbar` 를 쓰지 않았습니다.** 그건 표에 딱 붙는 줄이라 아래 테두리가
 * 있고 좌우 여백을 스스로 갖습니다. 여기서는 제목줄이 표 **밖**에 있어서, 그대로
 * 쓰면 선이 두 겹이 되고 여백도 판의 여백과 겹칩니다.
 *
 * **`Card` 도 아닙니다.** `Card` 는 제목·내용을 묶는 표면이고, 이 판은 **섹션 여러
 * 개를 담는 자리**입니다. Figma 도 이 두 판은 `Card` 인스턴스가 아니라 그냥
 * 프레임입니다. 안에 든 **요약 카드 3장만 진짜 `Card`** 입니다.
 *
 * 좌우 두 판은 **같은 대접**입니다 — 같은 층위인데 다른 테두리를 쓰면 하나가 더
 * 진해 보여 위계가 있는 것처럼 읽힙니다.
 *
 * 반경은 **8**(`Radius/lg`)입니다. 원본은 10 인데, 8 이면 `Card` · `Dialog` 와 같은
 * 값이라 화면에서 모서리가 한 종류로 유지됩니다.
 *
 * ### 점 하나로 상태를 알릴 때는 범례가 필요합니다
 *
 * 완료여부는 색점입니다. 「상태가 2종이면 점, 3종 이상이면 배지」 규칙에서 보면
 * 배지가 맞지만, **한 화면에 979행**이 오는 목록에서 배지를 세로로 쌓으면 표가
 * 배지밭이 됩니다. 대신 **범례를 표 위에 두고** 점마다 `aria-label` 로 이름을 답니다.
 *
 * 검사목록(12행)에서는 규칙대로 **배지**입니다 — 행이 적어 배지가 표를 덮지 않습니다.
 *
 * ### 이상결과 L · H
 *
 * 낮음 · 높음입니다. **색만으로 구분하지 않고** 글자를 함께 씁니다 — 색각 이상이 있으면
 * 빨강·파랑이 같아 보입니다.
 */
const meta = {
  title: "Example/PC 화면",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 조회화면: Story = {
  name: "결과조회 (1440)",
  render: function Screen() {
    const [collapsed, setCollapsed] = useState(false);
    const [openGroups, setOpenGroups] = useState<string[]>(["검사관리"]);
    const [page, setPage] = useState("검사결과");
    const [chart, setChart] = useState("2312350");

    const [tabs, setTabs] = useState([
      { id: "results", label: "검사결과" },
      { id: "stats", label: "통계관리" },
      { id: "sms", label: "고객 SMS관리" },
    ]);
    const [tab, setTab] = useState("results");

    const closeTab = (id: string) => {
      setTabs((prev) => {
        const i = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        // 닫는 탭이 지금 탭이면 옆 탭으로 — 빈 화면을 보여주지 않습니다
        if (tab === id && next.length) setTab((next[i] ?? next[i - 1]).id);
        return next;
      });
    };

    return (
      <div className="flex h-250 w-480 bg-surface-gray-subtle">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          title="결과조회 시스템"
          user={{ name: "관리자님", email: "admin@ack.co.kr", initial: "관" }}
          onSettings={() => {}}
          onLogout={() => {}}
        >
          {MENU.map((g) => (
            <SidebarGroup
              key={g.name}
              icon={g.icon}
              label={g.name}
              active={g.items.includes(page)}
              expanded={openGroups.includes(g.name)}
              onExpandedChange={() =>
                setOpenGroups((p) =>
                  p.includes(g.name) ? p.filter((x) => x !== g.name) : [...p, g.name]
                )
              }
              className="flex flex-col gap-0.5"
            >
              {g.items.map((it) => (
                <SidebarItem
                  key={it}
                  level={2}
                  label={it}
                  active={page === it}
                  onClick={() => setPage(it)}
                />
              ))}
            </SidebarGroup>
          ))}
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 탭바는 Content 밖입니다 — 안에 두면 탭을 바꿀 때 자기 자신도 갈립니다 */}
          <Tabs
            value={tab}
            onValueChange={setTab}
            size="sm"
            scrollable
            label="열린 화면"
            className="shrink-0 bg-background-white px-2"
          >
            {tabs.map((t) => (
              <TabItem
                key={t.id}
                value={t.id}
                label={t.label}
                closable
                onClose={() => closeTab(t.id)}
              />
            ))}
          </Tabs>

          <TabPanel value="results" current={tab} className="flex min-h-0 flex-1 flex-col">
            <QueryBar />
            {/* 좌우 분할 — 왼쪽에서 고르고 오른쪽에서 봅니다 */}
            <div className="flex min-h-0 flex-1 gap-4 p-6">
              <PatientList chart={chart} onSelect={setChart} />
              <Detail chart={chart} />
            </div>
          </TabPanel>

          {tabs
            .filter((t) => t.id !== "results")
            .map((t) => (
              <TabPanel
                key={t.id}
                value={t.id}
                current={tab}
                className="flex flex-1 items-center justify-center text-sm text-text-subtle"
              >
                {t.label} 화면
              </TabPanel>
            ))}
        </div>
      </div>
    );
  },
};
