import { useState } from "react";
import { Calendar, Download, Plus, Printer, RefreshCw, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { NativeSelect } from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
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

export default function App() {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

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
          <Row label="icon">
            <Button size="icon-sm" variant="outline" aria-label="검색">
              <Search className="size-4" />
            </Button>
            <Button size="icon" variant="outline" aria-label="다운로드">
              <Download className="size-4" />
            </Button>
            <Button size="icon-lg" variant="outline" aria-label="인쇄">
              <Printer className="size-5" />
            </Button>
            <Button shape="pill">둥근 버튼</Button>
            <Button variant="outline">
              <Plus className="size-4" />
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
            <FormField label="검색" htmlFor="f1">
              <Input id="f1" leadingIcon={<Search />} placeholder="성명 또는 차트번호" />
            </FormField>
            <FormField label="검사 항목" htmlFor="f2" description="여러 항목은 쉼표로 구분합니다.">
              <Select options={TESTS} value="all" onValueChange={() => {}} />
            </FormField>
            <FormField label="접수번호" htmlFor="f3" required error="접수번호를 입력해 주세요.">
              <Input id="f3" state="error" placeholder="예: 20250601001" />
            </FormField>
          </div>
        </Section>

        <Section title="Table" note="헤더·본문 모두 14. 페이지네이션 대신 스크롤을 씁니다.">
          <div className="overflow-hidden rounded-lg border border-table-border">
            <TableToolbar title="검사이력목록" count={`총 ${ROWS.length}건`}>
              {selected.length > 0 && (
                <span className="text-xs text-text-primary-strong">{selected.length}건 선택됨</span>
              )}
              <Button size="sm" variant="outline">
                <Plus className="size-4" />
                추가
              </Button>
              <span className="mx-1 h-4 w-px bg-table-border" aria-hidden />
              <Button size="icon-sm" variant="ghost" aria-label="다운로드">
                <Download className="size-4" />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="인쇄">
                <Printer className="size-4" />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="공유">
                <Share2 className="size-4" />
              </Button>
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
              <div className="w-64">
                <FormField label="기간설정" htmlFor="p1">
                  <Input id="p1" trailingIcon={<Calendar />} defaultValue="2025-04-26 ~ 2026-07-07" />
                </FormField>
              </div>
              <div className="w-56">
                <FormField label="검색" htmlFor="p2">
                  <Input id="p2" leadingIcon={<Search />} placeholder="성명 또는 차트번호" />
                </FormField>
              </div>
              <div className="w-40">
                <FormField label="정렬" htmlFor="p3">
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
                  <RefreshCw className="size-4" />
                  초기화
                </Button>
                <Button>
                  <Search className="size-4" />
                  조회
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <footer className="mt-12 border-t border-divider-gray-light pt-6 text-xs text-text-subtle">
        토큰은 <code className="text-text-primary">src/styles/ack-theme.css</code> 에 있습니다.
        Figma Variables 에서 추출한 값이라 이름이 그대로 대응합니다.
      </footer>
    </div>
  );
}
