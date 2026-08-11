import { useState } from "react";
import { Calendar, Download, Plus, Printer, RefreshCw, Search, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { NativeSelect } from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { addDays, startOfDay, startOfMonth } from "@/lib/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@/components/ui/table";

/** 섹션 래퍼 — 갤러리 자체는 조용하게, 컴포넌트가 주인공입니다. */
const TESTS = [
  { value: "all", label: "전체" },
  { value: "blood", label: "혈액검사" },
  { value: "urine", label: "소변검사" },
];

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-6" id={title}>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-text-basic">{title}</h2>
        {note && <p className="mt-0.5 text-xs text-text-subtle">{note}</p>}
      </div>
      <div className="rounded-lg border border-card-border bg-card-surface p-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-divider-gray-light py-3 last:border-0">
      <span className="w-28 shrink-0 text-xs text-text-subtle">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;
const TONES = ["neutral", "primary", "info", "success", "warning", "danger"] as const;

const ROWS = [
  { name: "김진영", chart: "2312345", test: "White Blood Cell (WBC)", value: "6.5", unit: "10³/μL", status: "완료", tone: "success", date: "2025-06-05" },
  { name: "이수정", chart: "2312346", test: "Hemoglobin", value: "13.2", unit: "g/dL", status: "완료", tone: "success", date: "2025-06-05" },
  { name: "박상철", chart: "2312347", test: "Fasting Glucose", value: "142", unit: "mg/dL", status: "재검", tone: "danger", date: "2025-06-04" },
  { name: "최민영", chart: "2312348", test: "Total Cholesterol", value: "188", unit: "mg/dL", status: "완료", tone: "success", date: "2025-06-04" },
  { name: "정혜진", chart: "2312349", test: "C-Reactive Protein", value: "0.8", unit: "mg/L", status: "진행중", tone: "warning", date: "—" },
] as const;

function Gallery() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const today = startOfDay(new Date());
  const [reportDate, setReportDate] = useState<Date | null>(today);
  const [month, setMonth] = useState<Date | null>(startOfMonth(today));
  const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });
  const [statRange, setStatRange] = useState<DateRange>({ start: null, end: null });
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = (chart: string) =>
    setSelected((prev) => (prev.includes(chart) ? prev.filter((c) => c !== chart) : [...prev, chart]));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 border-b border-divider-gray-light pb-6">
        <h1 className="text-2xl font-bold text-text-basic">ACK UI</h1>
        <p className="mt-1 text-sm text-text-subtle">
          Figma 컴포넌트가 코드에서 같은 모양으로 나오는지 확인하는 페이지입니다.
          창을 1024px 아래로 줄이면 컨트롤 높이가 모바일 값으로 바뀝니다.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="Button" note="Variant 7 · Size 4 · icon 4 · Shape 2. Disabled 는 토큰으로 표현합니다.">
          {VARIANTS.map((v) => (
            <Row key={v} label={v}>
              {SIZES.map((s) => (
                <Button key={s} variant={v} size={s}>
                  버튼
                </Button>
              ))}
              <Button variant={v} disabled>
                비활성
              </Button>
              <Button variant={v} loading>
                저장 중
              </Button>
            </Row>
          ))}
          {/* 아이콘 버튼에는 Tooltip 을 함께 답니다 — aria-label 은 보조기술만 읽습니다 */}
          <Row label="icon">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon-sm" variant="outline" aria-label="검색">
                  <Search />
                </Button>
              </TooltipTrigger>
              <TooltipContent>검색</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label="다운로드">
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>다운로드</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon-lg" variant="outline" aria-label="인쇄">
                  <Printer />
                </Button>
              </TooltipTrigger>
              <TooltipContent>인쇄</TooltipContent>
            </Tooltip>
            <Button shape="pill">둥근 버튼</Button>
            <Button variant="outline">
              <Plus />
              추가
            </Button>
          </Row>
        </Section>

        <Section title="Input" note="Size 4 · State 6 · Content 2. 아이콘·단위·클리어가 붙으면 래퍼가 테두리를 그립니다.">
          <Row label="size">
            <div className="w-52">
              <Input size="sm" placeholder="sm" />
            </div>
            <div className="w-52">
              <Input placeholder="default" />
            </div>
            <div className="w-52">
              <Input size="lg" placeholder="lg" />
            </div>
          </Row>
          <Row label="state">
            <div className="w-52">
              <Input placeholder="기본" />
            </div>
            <div className="w-52">
              <Input state="error" defaultValue="잘못된 값" />
            </div>
            <div className="w-52">
              <Input disabled placeholder="비활성" />
            </div>
            <div className="w-52">
              <Input readOnly defaultValue="읽기 전용" />
            </div>
          </Row>
          <Row label="슬롯">
            <div className="w-64">
              <Input
                leadingIcon={<Search />}
                placeholder="성명 또는 차트번호"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={search ? () => setSearch("") : undefined}
              />
            </div>
            <div className="w-64">
              <Input trailingIcon={<Calendar />} defaultValue="2025-04-26 ~ 2026-07-07" />
            </div>
            <div className="w-40">
              <Input unit="건" defaultValue="248" className="text-right" />
            </div>
          </Row>
        </Section>

        <Section
          title="Select"
          note="트리거는 SelectTrigger, 목록은 Popover + ListItem. 목록도 토큰대로 그립니다."
        >
          <Row label="size">
            {(["sm", "default", "lg"] as const).map((z) => (
              <div key={z} className="w-44">
                <Select size={z} options={TESTS} value="all" onValueChange={() => {}} />
              </div>
            ))}
          </Row>
          <Row label="state">
            <div className="w-44">
              <Select options={TESTS} onValueChange={() => {}} placeholder="선택해 주세요" />
            </div>
            <div className="w-44">
              <Select state="error" options={TESTS} value="all" onValueChange={() => {}} />
            </div>
            <div className="w-44">
              <Select disabled options={TESTS} value="all" onValueChange={() => {}} />
            </div>
          </Row>
        </Section>

        <Section
          title="NativeSelect"
          note="네이티브 <select>. 목록은 OS 가 그려서 디자인 시스템과 다릅니다 — 모바일 OS 선택기가 필요할 때만."
        >
          <Row label="size">
            {(["sm", "default", "lg"] as const).map((z) => (
              <div key={z} className="w-44">
                <NativeSelect size={z} defaultValue="all">
                  <option value="all">전체</option>
                  <option value="blood">혈액검사</option>
                </NativeSelect>
              </div>
            ))}
          </Row>
        </Section>

        <Section title="Checkbox" note="Size 2 · Checked 3. 높이는 모바일에서 커집니다.">
          <Row label="상태">
            <Checkbox label="기본" />
            <Checkbox label="선택됨" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <Checkbox label="일부 선택" indeterminate readOnly checked />
            <Checkbox label="비활성" disabled />
          </Row>
          <Row label="size">
            <Checkbox size="sm" label="sm" />
            <Checkbox label="default" />
          </Row>
        </Section>

        <Section title="Badge" note="Tone 6 · Style 3 · Size 3. 상태가 3종 이상이면 점 대신 배지를 씁니다.">
          {(["soft", "solid", "outline"] as const).map((sv) => (
            <Row key={sv} label={sv}>
              {TONES.map((t) => (
                <Badge key={t} tone={t} styleVariant={sv}>
                  {t}
                </Badge>
              ))}
            </Row>
          ))}
          <Row label="size · dot">
            <Badge size="sm">sm</Badge>
            <Badge>default</Badge>
            <Badge size="lg">lg</Badge>
            <Badge tone="success" dot>
              완료
            </Badge>
          </Row>
        </Section>

        <Section title="FormField" note="라벨 12 Medium · 값 14. 에러는 State=Error 일 때만 보입니다.">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="검색">
              <Input leadingIcon={<Search />} placeholder="성명 또는 차트번호" />
            </FormField>
            <FormField label="검사 항목" description="여러 항목은 쉼표로 구분합니다.">
              <Select options={TESTS} value="all" onValueChange={() => {}} />
            </FormField>
            <FormField label="접수번호" required error="접수번호를 입력해 주세요.">
              <Input state="error" placeholder="예: 20250601001" />
            </FormField>
          </div>
        </Section>

        <Section
          title="DatePicker"
          note="단일 · 범위 × 날짜 · 월 · 연. 달력은 라이브러리 없이 직접 그렸습니다."
        >
          {/* 폭을 주지 않습니다 — 컴포넌트가 값에 맞는 기본 폭을 갖습니다 */}
          <div className="flex flex-wrap items-start gap-4">
            <FormField label="보고일" className="w-fit">
              <DatePicker value={reportDate} onValueChange={setReportDate} />
            </FormField>
            <FormField label="정산 월" className="w-fit">
              <DatePicker precision="month" value={month} onValueChange={setMonth} />
            </FormField>
            <FormField label="조회 기간" className="w-fit">
              <DateRangePicker value={period} onValueChange={setPeriod} />
            </FormField>
            <FormField label="통계 기간 (월 단위)" className="w-fit">
              <DateRangePicker precision="month" value={statRange} onValueChange={setStatRange} />
            </FormField>
          </div>
        </Section>

        <Section title="Table" note="헤더·본문 모두 14. 페이지네이션 대신 스크롤을 씁니다.">
          <div className="overflow-hidden rounded-lg border border-table-border">
            {/* 건수는 칩 하나에 모읍니다 — 선택이 있으면 함께 적습니다 */}
            <TableToolbar
              title="검사이력목록"
              count={
                selected.length > 0
                  ? `총 ${ROWS.length}건 / ${selected.length}건 선택됨`
                  : `총 ${ROWS.length}건`
              }
            >
              <Button size="sm" variant="outline">
                <Plus />
                추가
              </Button>
              {/* 삭제는 행이 선택됐을 때만 — 선택 없이 버튼이 있으면 눌러도 아무 일이 없습니다 */}
              {selected.length > 0 && (
                <Button size="sm" variant="outline" onClick={() => setConfirmDelete(true)}>
                  <Trash2 />
                  삭제
                </Button>
              )}
              <span className="mx-1 h-4 w-px bg-table-border" aria-hidden />
              {[
                { icon: <Download />, label: "엑셀 내려받기" },
                { icon: <Printer />, label: "인쇄" },
                { icon: <Share2 />, label: "공유" },
              ].map(({ icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button size="icon-sm" variant="ghost" aria-label={label}>
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </TableToolbar>
            <Table>
              <TableHeader>
                <tr>
                  <TableHead className="w-10" />
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
                        onChange={() => toggle(r.chart)}
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
        </Section>

        <Section title="조회 조건 바" note="위 컴포넌트만으로 실제 화면 조각을 조립해 봅니다.">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-4">
              {/* Figma 의 PCDateRangeField — 코드에서는 FormField + DateRangePicker 조립입니다 */}
              <FormField label="기간설정">
                <DateRangePicker quickSelect value={period} onValueChange={setPeriod} />
              </FormField>
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
                    value="a"
                    onValueChange={() => {}}
                  />
                </FormField>
              </div>
              <Checkbox label="병원 출력금지 항목 제외" className="mb-2" />
              <div className="ml-auto flex gap-2">
                <Button variant="outline">
                  <RefreshCw />
                  초기화
                </Button>
                <Button
                  onClick={() =>
                    toast({
                      tone: "info",
                      title: "조회가 완료되었습니다",
                      description: `총 ${ROWS.length}건이 검색되었습니다.`,
                    })
                  }
                >
                  <Search />
                  조회
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 되돌릴 수 없는 동작이라 확인을 받습니다. 제목은 질문형, 설명은 결과를 알립니다 */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`검사 결과 ${selected.length}건을 삭제할까요?`}
        description="삭제한 결과는 되돌릴 수 없습니다. 계속하시겠습니까?"
        tone="destructive"
        confirmLabel="삭제"
        onConfirm={() => {
          const n = selected.length;
          setSelected([]);
          setConfirmDelete(false);
          // 결과는 Toast 로 알립니다 — 확인은 Dialog, 결과는 Toast
          toast({
            tone: "success",
            title: `${n}건을 삭제했습니다`,
            description: "목록에서 제외되었습니다.",
          });
        }}
      />

      <footer className="mt-12 border-t border-divider-gray-light pt-6 text-xs text-text-subtle">
        토큰은 <code className="text-text-primary">src/styles/ack-theme.css</code> 에 있습니다.
        Figma Variables 에서 추출한 값이라 이름이 그대로 대응합니다.
      </footer>
    </div>
  );
}

/**
 * Provider 는 앱에 하나씩만 둡니다.
 * useToast 가 Provider 안에서만 동작해서 갤러리를 한 겹 안으로 넣었습니다.
 */
export default function App() {
  return (
    // 앱 루트에 셋을 나란히 둡니다 — PointerMode 가 시트/팝오버를 정합니다
    <PointerModeProvider>
      <TooltipProvider>
        <ToastProvider>
          <Gallery />
        </ToastProvider>
      </TooltipProvider>
    </PointerModeProvider>
  );
}
