import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Lookup, LookupPanel, type LookupColumns, type LookupProps } from "@/components/ui/lookup";
import { Combobox } from "@/components/ui/combobox";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

type Test = { code: string; name: string; unit: string; group: string };

const TESTS: Test[] = [
  { code: "CD001", name: "심장표지자단백 (Hs-TnI)", unit: "ng/mL", group: "심장" },
  { code: "CD002", name: "심근효소 (CK-MB)", unit: "ng/mL", group: "심장" },
  { code: "CD003", name: "마이오글로빈 (Myoglobin)", unit: "ng/mL", group: "심장" },
  { code: "CD004", name: "심부전 표지자 (NT-proBNP)", unit: "pg/mL", group: "심장" },
  { code: "IF001", name: "C-반응성단백 (CRP)", unit: "mg/L", group: "염증" },
  { code: "IF002", name: "적혈구 침강 속도 (ESR)", unit: "mm/hr", group: "염증" },
  { code: "GC001", name: "백혈구 수 (WBC)", unit: "10³/uL", group: "일반혈액" },
  { code: "GC002", name: "적혈구 수 (RBC)", unit: "10⁶/uL", group: "일반혈액" },
  { code: "GC003", name: "혈색소 (Hemoglobin)", unit: "g/dL", group: "일반혈액" },
  { code: "GC004", name: "혈소판 수 (Platelet)", unit: "10³/uL", group: "일반혈액" },
  { code: "LP001", name: "총콜레스테롤 (Total Cholesterol)", unit: "mg/dL", group: "지질" },
  { code: "LP002", name: "중성지방 (Triglyceride)", unit: "mg/dL", group: "지질" },
];

/** Figma 의 Cell 1·2·3 — 코드 72 고정 · 이름 채움 · 단위 72 우측 정렬 */
const COLUMNS: LookupColumns<Test> = [
  { key: "code", header: "검사항목", value: (r) => r.code, width: 72, muted: true },
  { key: "name", header: "검사명", value: (r) => r.name },
  { key: "unit", header: "단위", value: (r) => r.unit, width: 72, align: "right" },
];

/**
 * Figma: LookupPanel · LookupRow (4 변형 — Type 2 × State 3)
 *
 * **여러 열을 함께 봐야 고를 수 있을 때** 쓰는 드롭다운입니다 —
 * 검사코드 · 검사명 · 단위처럼요.
 *
 * ### Combobox 와 무엇이 다른가
 *
 * | | 한 줄에 무엇이 | 언제 |
 * |---|---|---|
 * | `Combobox` | **이름 하나** | 이름만으로 판단됩니다 |
 * | `Lookup` | **열 여러 개** | 코드·단위까지 봐야 어느 것인지 압니다 |
 *
 * **이름만으로 판단되면 `Combobox` 를 쓰세요** — 열이 늘면 패널이 넓어지고 읽을 것이
 * 많아집니다. `Combobox 와 나란히` 스토리에서 견줘 보세요.
 *
 * ### 열은 4개까지
 *
 * Figma 도 Cell 을 4개까지만 둡니다. 넘으면 패널이 표가 되고, **표는 화면에 놓는 것이지
 * 드롭다운에 담는 것이 아닙니다.** 타입이 5번째를 막습니다.
 *
 * 폭을 주지 않은 열이 **남는 폭을 채웁니다** (Figma 의 Cell 2). 하나만 비워 두세요.
 *
 * ### 닫힌 트리거에도 코드와 이름이 함께 나옵니다
 *
 * 이름만 남기면 비슷한 검사가 여럿일 때 무엇을 골랐는지 확인할 수 없습니다 —
 * **애초에 그 구분 때문에 `Combobox` 대신 이걸 쓰는 것**입니다. Figma 문서에도
 * “닫힌 상태에 코드+명칭 함께 표시” 라고 적혀 있습니다.
 *
 * 기본은 `muted` 열(코드) + 폭을 주지 않은 열(이름)이고, 코드 열이 없으면 이름만
 * 나옵니다. 다른 조합이 필요하면 `display` 로 바꾸세요.
 *
 * ### 코드 열은 흐립니다
 *
 * `muted` 를 켠 열은 `Lookup/Code` 입니다. 코드는 **찾을 때 쓰는 값**이지 읽는 값이
 * 아니라, 검사명과 같은 색이면 눈이 어디를 봐야 할지 정하지 못합니다.
 *
 * ### 그 밖
 *
 * - 트리거는 `SelectTrigger` — `Select` · `Combobox` · `NativeSelect` 와 **같은 껍데기**입니다
 * - 검색은 **모든 열**을 훑고 초성도 됩니다 (`Combobox` 와 같은 규칙)
 * - **열자마자 첫 줄을 짚지 않습니다** — 고르지도 않은 줄이 선택된 것처럼 보입니다.
 *   검색어가 있을 때만 첫 결과를 짚습니다
 * - 열 제목은 **스크롤 영역 밖**입니다. 내려도 어느 열인지 남아야 합니다 (Table 과 같은 이유)
 */
const meta = {
  title: "Overlay/Lookup",
  component: Lookup as (p: LookupProps<Test>) => React.JSX.Element,
  parameters: { layout: "centered", ...design(figma.lookupPanel) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    header: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    panelWidth: { control: "number" },
    placeholder: { control: "text" },
    columns: { control: false },
    rows: { control: false },
    getRowId: { control: false },
    onValueChange: { control: false },
    display: { control: false },
  },
  args: {
    columns: COLUMNS,
    rows: TESTS,
    getRowId: (r: Test) => r.code,
    onValueChange: () => {},
  },
} satisfies Meta<LookupProps<Test>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 열어서 `ㅅㅈ` 을 쳐 보세요 — **초성 검색**이 됩니다.
 * `CD` 처럼 코드로도 찾힙니다. 검색은 모든 열을 훑습니다.
 */
export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<string | undefined>("CD001");
    return (
      <div className="w-72">
        <Lookup
          {...args}
          value={v}
          onValueChange={(r) => setV(r?.code)}
          aria-label="검사 항목"
        />
        <p className="mt-2 text-2xs text-text-muted-foreground">
          {v ? `선택 — ${v}` : "(없음)"}
        </p>
      </div>
    );
  },
};


/**
 * 같은 자료를 `Combobox` 와 `Lookup` 으로 나란히 놓은 것입니다.
 *
 * **`Combobox` 는 이름 하나**라 `심장표지자단백` 과 `심근효소` 가 같은 단위인지 알 수 없습니다.
 * **`Lookup` 은 코드와 단위가 함께 보여** 눌러 보지 않고 고를 수 있습니다.
 *
 * 대신 패널이 넓고 읽을 것이 많습니다 — **이름만으로 판단되면 `Combobox`** 입니다.
 */
export const 견주기: Story = {
  name: "Combobox 와 나란히",
  parameters: { layout: "padded" },
  render: function Compare(args) {
    const [a, setA] = useState<string[]>([]);
    const [b, setB] = useState<string | undefined>();
    return (
      <div className="flex items-start gap-8">
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">Combobox — 이름 하나</p>
          <Combobox
            options={TESTS.map((t) => ({ value: t.code, label: t.name }))}
            value={a}
            onValueChange={setA}
            aria-label="검사 항목 (Combobox)"
          />
        </div>
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">Lookup — 코드 · 이름 · 단위</p>
          <Lookup {...args} value={b} onValueChange={(r) => setB(r?.code)} aria-label="검사 항목 (Lookup)" />
        </div>
      </div>
    );
  },
};

/**
 * 열 구성은 화면마다 다릅니다. **폭을 주지 않은 열이 남는 폭을 채웁니다** — 하나만 비워 두세요.
 *
 * 네 번째 열(분류)을 켜면 이름 열이 좁아집니다. **넘으면 패널을 넓히세요** —
 * 다섯 번째는 타입이 막습니다.
 */
export const 열구성: Story = {
  name: "열 구성",
  parameters: { layout: "padded" },
  render: function Columns() {
    const [a, setA] = useState<string | undefined>();
    const [b, setB] = useState<string | undefined>();
    const [c, setC] = useState<string | undefined>();

    const two: LookupColumns<Test> = [
      { key: "code", header: "코드", value: (r) => r.code, width: 72, muted: true },
      { key: "name", header: "검사명", value: (r) => r.name },
    ];
    const four: LookupColumns<Test> = [
      { key: "code", header: "검사항목", value: (r) => r.code, width: 72, muted: true },
      { key: "name", header: "검사명", value: (r) => r.name },
      { key: "group", header: "분류", value: (r) => r.group, width: 88 },
      { key: "unit", header: "단위", value: (r) => r.unit, width: 72, align: "right" },
    ];

    return (
      <div className="flex flex-col gap-5">
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">열 2개 — 코드 + 이름</p>
          <Lookup
            columns={two}
            rows={TESTS}
            getRowId={(r) => r.code}
            value={a}
            onValueChange={(r) => setA(r?.code)}
            panelWidth={360}
            aria-label="검사 항목 (2열)"
          />
        </div>
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">열 4개 — 패널을 넓혔습니다 (560)</p>
          <Lookup
            columns={four}
            rows={TESTS}
            getRowId={(r) => r.code}
            value={b}
            onValueChange={(r) => setB(r?.code)}
            panelWidth={560}
            aria-label="검사 항목 (4열)"
          />
        </div>
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">
            열 제목 끔 — 열이 하나뿐이면 제목이 설명하는 것이 없습니다
          </p>
          <Lookup
            columns={[{ key: "name", header: "검사명", value: (r) => r.name }]}
            rows={TESTS}
            getRowId={(r) => r.code}
            value={c}
            onValueChange={(r) => setC(r?.code)}
            header={false}
            panelWidth={300}
            aria-label="검사 항목 (1열)"
          />
        </div>
      </div>
    );
  },
};

/**
 * 트리거 크기는 `Select` · `Combobox` 와 **같은 축**입니다 (`selectStateClass`).
 * `grid` 는 데이터그리드 셀 안에 녹아 있어야 해서 평상시 테두리가 없습니다.
 */
export const 크기와상태: Story = {
  name: "크기 · 상태",
  parameters: { layout: "padded" },
  render: function Sizes(args) {
    return (
      <div className="flex flex-col gap-4">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="w-72">
            <p className="mb-1.5 text-xs text-text-subtle">{size}</p>
            <Lookup {...args} size={size} onValueChange={() => {}} aria-label={`검사 항목 ${size}`} />
          </div>
        ))}
        <div className="w-72">
          <p className="mb-1.5 text-xs text-text-subtle">disabled</p>
          <Lookup {...args} disabled onValueChange={() => {}} aria-label="검사 항목 (비활성)" />
        </div>
      </div>
    );
  },
};

/**
 * 패널만 따로 쓰는 모습입니다 — Figma 의 `LookupPanel` 그대로입니다.
 * 트리거 없이 화면에 박아 두거나, 모바일 시트 안에 넣을 때 씁니다.
 */
export const 패널만: Story = {
  name: "패널만 (LookupPanel)",
  render: function PanelOnly() {
    const [q, setQ] = useState("");
    const [v, setV] = useState("CD001");
    const rows = TESTS.filter(
      (t) => !q || `${t.code} ${t.name} ${t.unit}`.toLowerCase().includes(q.toLowerCase())
    );
    return (
      <div className="w-[464px] overflow-hidden rounded-md border border-border-gray-light bg-background-white">
        <LookupPanel
          columns={COLUMNS}
          rows={rows}
          getRowId={(r) => r.code}
          value={v}
          onSelect={(r) => setV(r.code)}
          query={q}
          onQueryChange={setQ}
        />
      </div>
    );
  },
};

/**
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 *
 * 트리거가 `<div role="combobox">` 라 **`<label for>` 가 안 통합니다** — `for` 는
 * labelable 요소에만 걸리고 div 에 걸면 조용히 아무 일도 안 일어납니다. 그래서
 * 라벨의 id 를 **`aria-labelledby`** 로 가리킵니다. 껍데기(`SelectTrigger`)를
 * `Select` · `Combobox` · `MobileSelect` 와 함께 쓰므로 넷이 같습니다.
 *
 * 아래 필드는 **골라 보세요** — 값이 들어가면 에러가 사라집니다. 실제 화면에서는
 * 이 자리에 React Hook Form + Zod 의 검증 결과가 옵니다 (에러를 손으로 켜지 마세요).
 */
/**
 * 폼 안에서는 `FormField` 로 감쌉니다. 라벨 · 설명 · 에러는 거기서 나옵니다.
 *
 * `clearable` 은 **필수 항목에 쓰지 마세요** — 지울 수 있으면 안 되는 값입니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  render: function InForm(args) {
    const [v, setV] = useState<string | undefined>();
    // 아래 필드는 **고르면 에러가 사라집니다** — 실제로는 Zod 검증 결과가 이 자리에 옵니다
    const [required, setRequired] = useState<string | undefined>();
    const error = required ? undefined : "검사 항목을 선택해 주세요";

    return (
      <div className="flex w-80 flex-col gap-4">
        <FormField label="검사 항목" description="코드 · 검사명 · 단위로 찾을 수 있습니다">
          <Lookup {...args} value={v} onValueChange={(r) => setV(r?.code)} clearable />
        </FormField>
        <FormField label="검사 항목" required error={error}>
          <Lookup
            {...args}
            state={error ? "error" : "default"}
            value={required}
            onValueChange={(r) => setRequired(r?.code)}
            clearable
          />
        </FormField>
      </div>
    );
  },
};
