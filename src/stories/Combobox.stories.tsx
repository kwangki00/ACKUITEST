import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { FlaskConical } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

/**
 * Figma: SelectTrigger(120변형) + ComboboxPanel(패널, 2변형)
 *
 * 트리거 껍데기는 `Select` · `NativeSelect` 와 같은 `SelectTrigger` 입니다.
 * 패널은 Popover + Input + ListItem 을 조립한 것이라
 * Radix Popover 말고는 새 의존성이 없습니다.
 *
 * ### Select 와 어떻게 나뉘나
 *
 * 가르는 축은 **값이 하나냐 배열이냐**입니다. 검색은 그 안의 옵션입니다.
 *
 * | | 검색 없음 | 검색 있음 |
 * |---|---|---|
 * | **단일** `value: string` | `Select` | `Combobox` |
 * | **다중** `value: string[]` | `Combobox type="multi" searchable={false}` | `Combobox type="multi"` |
 *
 * 이 컴포넌트의 `value` 는 단일이어도 **배열**입니다 — 하나짜리 배열.
 * 그래서 단일·검색없음이면 `Select` 를 쓰는 게 맞습니다. 값을 꺼낼 때 `[0]` 을 붙이지 않아도 됩니다.
 *
 * 항목이 3~5개뿐이면 `searchable={false}` 로 끄세요 — 항목보다 검색창이 더 큽니다.
 *
 * ### Render — 값 표현과 입력 여부를 함께 정합니다
 *
 * | Render | 언제 쓰나 |
 * |---|---|
 * | *(자동)* | 아직 안 골랐을 때. placeholder 문구가 나옵니다 |
 * | `text` | 단일 선택. 고른 값 하나를 그대로 |
 * | `editable` | 단일 + 검색. 트리거에 바로 타이핑 — **항목이 수백 개일 때** |
 * | `chip` | 다중. 칩이 트리거 안에 들어가고 넘치면 `+N` 으로 접힙니다 |
 * | `summary` | 다중. 트리거는 요약 문구만, 칩은 아래에 — **폭이 좁을 때** |
 *
 * ### chip vs summary — 둘 다 높이는 고정입니다
 *
 * 갈림은 세로가 아니라 **가로**입니다. 칩은 트리거의 가로를 먹습니다.
 *
 * | | chip | summary |
 * |---|---|---|
 * | 트리거 높이 | 고정 — 넘치면 `+N` | 고정 — 요약 한 줄 |
 * | 칩 위치 | 트리거 안 | 트리거 아래 |
 * | 선택 확인 | 칩 2~3개가 바로 보임 | 문구로만 — 아래 칩을 봐야 함 |
 * | 바로 지우기 | 칩의 ✕ 로 트리거에서 | 아래 칩의 ✕ 로 |
 * | **필요한 폭** | **넓음** — 칩이 가로를 먹습니다 | **좁음** — 텍스트 한 줄 |
 * | 적합한 곳 | 폼 · 여유 있는 배치 | 조회 조건 바 · 표 안 · 컨트롤이 빽빽한 곳 |
 *
 * ### 그 밖의 규칙
 *
 * - `clearable` — 화살표 왼쪽 X. **필수 항목에는 쓰지 마세요.** 해제할 수 없는데 버튼이 있으면 혼란스럽습니다
 * - `leadingIcon` — 트리거 앞 아이콘. `editable` 은 검색 아이콘이 기본입니다
 * - 상태 토큰은 Input · Textarea 와 같습니다
 * - placeholder 가 “초성 검색 가능” 이라고 약속하므로 실제로 지원합니다 — `ㅎㅇ` → 혈액
 */
const meta = {
  title: "Controls/Combobox",
  component: Combobox,
  parameters: { layout: "padded", ...design(figma.comboboxPanel) },
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multi"] },
    disabled: { control: "boolean" },
    selectAll: { control: "boolean", description: "검색창 아래 전체 선택 줄 (multi 전용)" },
    render: {
      control: "inline-radio",
      options: ["text", "chip", "summary", "editable"],
      description: "트리거 값 표현 — Figma SelectTrigger 의 Render 축",
    },
    maxChips: { control: { type: "number", min: 1, max: 5 } },
    clearable: { control: "boolean", description: "화살표 왼쪽 전체 해제 X" },
    leadingIcon: { control: false, description: "트리거 앞 아이콘" },
    searchable: { control: "boolean", description: "패널 안 검색창. 항목이 적으면 끄세요" },
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
  },
  // 각 스토리가 useState 로 덮어씁니다. 필수 prop 이라 meta 에 있어야
  // 스토리마다 args 를 쓰지 않아도 됩니다
  args: { type: "single", options: [], value: [], onValueChange: () => {} },
  decorators: [(S) => <div className="w-80">{S()}</div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const TESTS: ComboboxOption[] = [
  { value: "cbc", label: "일반혈액검사" },
  { value: "ua", label: "소변검사" },
  { value: "img", label: "영상의학" },
  { value: "path", label: "병리검사" },
  { value: "cul", label: "혈액배양검사" },
  { value: "chem", label: "생화학검사" },
  { value: "hold", label: "보류 항목", disabled: true },
];

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<string[]>([]);
    return <Combobox {...args} options={TESTS} value={v} onValueChange={setV} />;
  },
};

/**
 * single 은 자동완성(맞는 부분 강조), multi 는 체크박스입니다.
 * single 은 고르면 닫히고, multi 는 열린 채로 계속 고릅니다.
 */
export const Type: Story = {
  decorators: [(S) => <div className="flex max-w-2xl gap-6">{S()}</div>],
  render: function T() {
    const [a, setA] = useState<string[]>(["cbc"]);
    const [b, setB] = useState<string[]>(["cbc", "ua"]);
    return (
      <>
        <div className="w-72">
          <p className="mb-2 text-xs font-medium text-text-basic">single</p>
          <Combobox options={TESTS} value={a} onValueChange={setA} />
        </div>
        <div className="w-72">
          <p className="mb-2 text-xs font-medium text-text-basic">multi</p>
          <Combobox type="multi" options={TESTS} value={b} onValueChange={setB} />
        </div>
      </>
    );
  },
};

/**
 * 초성만 입력하면 초성끼리, 아니면 글자 그대로 비교합니다.
 * 열고 `ㅎㅇ` · `ㅅㅂ` 을 쳐보세요.
 */
export const 초성검색: Story = {
  render: function Cho() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox options={TESTS} value={v} onValueChange={setV} />
        <table className="border-collapse text-left text-xs">
          <tbody className="text-text-basic">
            {[
              ["ㅎㅇ", "일반혈액검사 · 혈액배양검사"],
              ["ㅅㅂ", "소변검사"],
              ["혈액", "일반혈액검사 · 혈액배양검사"],
              ["ㄱㅅ", "…검사 로 끝나는 항목 전부"],
            ].map(([q, r]) => (
              <tr key={q} className="border-b border-table-border">
                <td className="w-16 py-1.5 font-medium">{q}</td>
                <td className="py-1.5 text-text-subtle">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-2xs text-text-muted-foreground">
          초성 입력일 때는 강조 표시를 끕니다 — 라벨에 초성 글자가 없어 엉뚱한 곳이 진해집니다.
        </p>
      </div>
    );
  },
};

/** 방향키로 짚고 Enter 로 고릅니다. 짚은 항목은 hover 와 같은 배경입니다. */
export const 키보드: Story = {
  render: function Kb() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox options={TESTS} value={v} onValueChange={setV} />
        <table className="border-collapse text-left text-xs">
          <tbody className="text-text-basic">
            {[
              ["↓ ↑", "항목 이동 (끝에서 반대편으로 순환)"],
              ["Enter", "짚은 항목 선택"],
              ["Esc", "닫기"],
              ["열면", "포커스가 검색창으로"],
            ].map(([k, d]) => (
              <tr key={k} className="border-b border-table-border">
                <td className="w-16 py-1.5 font-medium">{k}</td>
                <td className="py-1.5 text-text-subtle">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** 결과가 없으면 목록 대신 안내만 남습니다. */
export const 결과없음: Story = {
  render: function Empty() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-2">
        <Combobox options={TESTS} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-muted-foreground">
          열고 <code>zzz</code> 를 쳐보세요.
        </p>
      </div>
    );
  },
};

/**
 * 칩이 트리거 안에 들어가고 넘치면 `+N` 으로 접힙니다. 높이는 고정입니다.
 *
 * **칩이 가로를 먹으므로 폭이 넉넉한 곳**에 쓰세요 — 폼처럼 세로로 쌓는 배치.
 * 조회 조건 바처럼 컨트롤이 빽빽한 곳에는 `summary` 가 맞습니다.
 */
export const 칩렌더: Story = {
  render: function ChipRender() {
    const [v, setV] = useState<string[]>(["cbc", "ua"]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox
          type="multi"
          render="chip"
          selectAll
          clearable
          options={TESTS}
          value={v}
          onValueChange={setV}
        />
        <p className="text-2xs text-text-subtle">고른 값: {v.length}건</p>
        <p className="max-w-md text-2xs text-text-muted-foreground">
          칩의 X 는 그 값만 해제하고, 화살표 왼쪽 X 는 전체를 해제합니다.
          둘 다 눌러도 패널이 열리지 않습니다.
        </p>
      </div>
    );
  },
};

/** maxChips 를 넘으면 접힙니다. Figma 슬롯이 3개라 기본도 3입니다. */
export const 칩넘침: Story = {
  render: function Overflow() {
    const ALL = TESTS.filter((o) => !o.disabled).map((o) => o.value);
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n}>
            <p className="mb-1.5 text-xs font-medium text-text-basic">maxChips={n}</p>
            <Combobox
              type="multi"
              render="chip"
              maxChips={n}
              options={TESTS}
              value={ALL}
              onValueChange={() => {}}
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 조회 조건 바 — Documentation 이 `summary` 를 쓰라고 한 자리입니다.
 * 트리거가 요약 한 줄이라 폭을 적게 쓰고, 고른 값은 아래에서 확인합니다.
 */
export const 조회조건: Story = {
  decorators: [(S) => <div className="max-w-4xl">{S()}</div>],
  render: function FilterBar() {
    const [tests, setTests] = useState<string[]>(["cbc", "ua"]);
    const [dept, setDept] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-3 rounded-md border border-border-gray-light bg-background-white p-4">
          <FormField label="검사 항목" className="w-64">
            <Combobox
              type="multi"
              render="summary"
              selectAll
              clearable
              options={TESTS}
              value={tests}
              onValueChange={setTests}
            />
          </FormField>
          <FormField label="진료과" className="w-48">
            <Combobox
              type="multi"
              render="summary"
              clearable
              options={[
                { value: "im", label: "내과" },
                { value: "sx", label: "외과" },
                { value: "ped", label: "소아과" },
              ]}
              value={dept}
              onValueChange={setDept}
            />
          </FormField>
        </div>
        <p className="text-2xs text-text-muted-foreground">
          트리거는 요약 한 줄이라 좁은 폭에 여러 개를 나란히 놓을 수 있습니다.
          chip 으로 두면 칩이 가로를 먹어 한 줄에 두 개도 버겁습니다.
        </p>
      </div>
    );
  },
};

/** 자리가 넉넉하면 칩을 아래에 펼쳐도 됩니다 — 전부 한눈에 보입니다. */
export const 다중선택과칩: Story = {
  render: function WithChips() {
    const [v, setV] = useState<string[]>(["cbc", "ua"]);
    return (
      <FormField label="검사 항목" description="여러 개를 고를 수 있습니다.">
        <div className="flex flex-col gap-2">
          <Combobox type="multi" options={TESTS} value={v} onValueChange={setV} />
          {v.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {v.map((x) => (
                <Chip
                  key={x}
                  size="sm"
                  onRemove={() => setV((p) => p.filter((y) => y !== x))}
                >
                  {TESTS.find((o) => o.value === x)?.label ?? x}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </FormField>
    );
  },
};

/**
 * 검색창 아래, 목록 **밖**에 전체 선택 줄이 붙고 아래에 구분선이 옵니다.
 * 목록과 함께 스크롤되면 안 되고, 목록과 달리 패널 전폭을 씁니다.
 * 일부만 골랐으면 체크박스가 `−` 로 표시됩니다.
 */
export const 전체선택: Story = {
  render: function All() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox type="multi" selectAll options={TESTS} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-subtle">
          고른 값: {v.length ? `${v.length}건` : "없음"}
        </p>
        <p className="max-w-md text-2xs text-text-muted-foreground">
          비활성 항목(보류 항목)은 전체 선택에 포함되지 않습니다. 셈에서도 빠집니다.
        </p>
      </div>
    );
  },
};

/**
 * **검색 중에는 보이는 것만 고릅니다.**
 * 걸러낸 2건만 보고 눌렀는데 숨은 항목까지 선택되면 사고입니다.
 * 그래서 문구도 "검색 결과 전체" 로 바뀝니다.
 *
 * 열고 `ㅎㅇ` 을 친 뒤 전체 선택을 눌러 보세요 — 숨은 선택은 그대로 남습니다.
 */
export const 검색중전체선택: Story = {
  render: function FilteredAll() {
    const [v, setV] = useState<string[]>(["img"]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox type="multi" selectAll options={TESTS} value={v} onValueChange={setV} />
        <p className="text-2xs text-text-subtle">
          고른 값: {v.map((x) => TESTS.find((o) => o.value === x)?.label).join(" · ") || "없음"}
        </p>
        <table className="max-w-lg border-collapse text-left text-xs">
          <tbody className="text-text-basic">
            {[
              ["검색 없음", "전체 선택 (6) — 보이는 전부, 다시 누르면 해제"],
              ["검색 중", "검색 결과 2개 선택 — 걸러진 것만, 숨은 선택은 유지"],
              ["일부만 선택됨", "체크박스가 − 로 표시"],
            ].map(([k, d]) => (
              <tr key={k} className="border-b border-table-border">
                <td className="w-32 py-1.5 font-medium whitespace-nowrap">{k}</td>
                <td className="py-1.5 text-text-subtle">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * 트리거에 바로 타이핑해 목록을 거릅니다 — **진짜 Combobox** 입니다.
 * 항목이 수백 개면 목록을 열고 검색창으로 옮겨가는 게 번거롭습니다.
 *
 * 단일 선택 전용입니다. 다중 + 검색은 패널 안 검색창(기본 동작)을 쓰세요.
 * 고르고 나면 입력창에 고른 값이 남습니다.
 */
export const Editable: Story = {
  render: function Edit() {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox
          render="editable"
          clearable
          options={TESTS}
          value={v}
          onValueChange={setV}
          placeholder="검사명을 입력하세요"
        />
        <p className="text-2xs text-text-subtle">
          고른 값: {v.length ? TESTS.find((o) => o.value === v[0])?.label : "없음"}
        </p>
        <table className="max-w-lg border-collapse text-left text-xs">
          <tbody className="text-text-basic">
            {[
              ["타이핑", "패널이 열리고 바로 걸러집니다 (초성도 됩니다)"],
              ["↓ ↑ · Enter", "짚고 고르기 — 커서는 입력창에 남습니다"],
              ["Esc", "닫기. 입력창은 고른 값으로 되돌아갑니다"],
              ["패널 검색창", "없습니다 — 트리거가 그 역할을 합니다"],
            ].map(([k, d]) => (
              <tr key={k} className="border-b border-table-border">
                <td className="w-28 py-1.5 font-medium whitespace-nowrap">{k}</td>
                <td className="py-1.5 text-text-subtle">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** 항목이 많을수록 Editable 이 유리합니다. */
export const Editable_많은항목: Story = {
  name: "Editable — 항목이 많을 때",
  render: function Many() {
    const [v, setV] = useState<string[]>([]);
    const MANY = Array.from({ length: 200 }, (_, i) => ({
      value: `t${i}`,
      label: `검사항목 ${String(i + 1).padStart(3, "0")}`,
    }));
    return (
      <div className="flex flex-col gap-2">
        <Combobox
          render="editable"
          clearable
          options={MANY}
          value={v}
          onValueChange={setV}
          placeholder="200개 중에서 찾기"
        />
        <p className="text-2xs text-text-muted-foreground">
          목록을 열고 검색창으로 옮겨가는 단계가 없습니다. 바로 치면 됩니다.
        </p>
      </div>
    );
  },
};

/**
 * 트리거는 **요약 문구 한 줄**이라 폭을 적게 씁니다. 고른 값은 아래에 줄바꿈되며 붙습니다.
 *
 * 조회 조건 바 · 표 안처럼 **컨트롤이 빽빽한 곳**에 쓰세요.
 * 대신 트리거만 봐서는 무엇을 골랐는지 알 수 없어 아래 칩을 봐야 합니다.
 */
export const Summary: Story = {
  render: function Sum() {
    const [v, setV] = useState<string[]>(["cbc", "ua", "img"]);
    return (
      <div className="flex flex-col gap-3">
        <Combobox
          type="multi"
          render="summary"
          selectAll
          clearable
          options={TESTS}
          value={v}
          onValueChange={setV}
        />
        <p className="text-2xs text-text-muted-foreground">
          아래 칩은 트리거 밖이라 삭제해도 패널이 열리지 않습니다.
          칩이 늘면 아래로만 늘어납니다.
        </p>
      </div>
    );
  },
};

/** 셋을 나란히 — 같은 값을 세 방식으로 보여줍니다. */
export const Render비교: Story = {
  name: "Render 비교",
  decorators: [(S) => <div className="max-w-3xl">{S()}</div>],
  render: function Cmp() {
    const [v, setV] = useState<string[]>(["cbc", "ua", "img", "path"]);
    return (
      <div className="flex flex-col gap-6">
        {(
          [
            { r: "text" as const, note: "한 줄 요약만. 무엇을 골랐는지 첫 항목만 보입니다" },
            { r: "chip" as const, note: "칩이 가로를 먹습니다 — 폭이 넉넉한 폼에" },
            { r: "summary" as const, note: "한 줄이라 폭을 적게 씁니다 — 조회 조건 바에" },
          ]
        ).map((x) => (
          <div key={x.r} className="w-80">
            <p className="mb-1.5 text-xs font-medium text-text-basic">render=&quot;{x.r}&quot;</p>
            <Combobox
              type="multi"
              render={x.r}
              clearable
              options={TESTS}
              value={v}
              onValueChange={setV}
            />
            <p className="mt-1.5 text-2xs text-text-subtle">{x.note}</p>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 트리거는 Select 와 **같은 껍데기**(SelectTrigger)입니다.
 * 그래서 Figma Select 의 Size 축이 그대로 붙습니다 — grid 는 표 셀 인라인 편집용.
 */
export const Size: Story = {
  render: function S() {
    const [v, setV] = useState<string[]>(["cbc"]);
    return (
      <div className="flex flex-col gap-4">
        {(["sm", "default", "lg"] as const).map((z) => (
          <div key={z}>
            <p className="mb-1.5 text-xs font-medium text-text-basic">{z}</p>
            <Combobox size={z} options={TESTS} value={v} onValueChange={setV} />
          </div>
        ))}
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">
            grid — 표 셀에 녹아 있다가 클릭하면 나타납니다
          </p>
          <div className="w-64 rounded-md border border-table-border">
            <div className="flex h-[var(--h-datagrid)] items-center px-3 text-sm hover:bg-table-row-hover">
              일반 셀
            </div>
            <div className="hover:bg-table-row-hover">
              <Combobox size="grid" options={TESTS} value={v} onValueChange={setV} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/** 상태도 Select·Input 과 같은 축입니다. FormField 의 검증 결과를 넘기세요. */
export const State: Story = {
  render: function St() {
    const [v, setV] = useState<string[]>(["cbc"]);
    const error = v.length === 0 ? "검사 항목을 선택해 주세요." : undefined;
    return (
      <div className="flex flex-col gap-4">
        <FormField label="검사 항목" required error={error}>
          <Combobox
            state={error ? "error" : "default"}
            options={TESTS}
            value={v}
            onValueChange={setV}
          />
        </FormField>
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">readonly</p>
          <Combobox state="readonly" options={TESTS} value={["cbc"]} onValueChange={() => {}} />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">disabled</p>
          <Combobox disabled options={TESTS} value={["cbc"]} onValueChange={() => {}} />
        </div>
      </div>
    );
  },
};

/**
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 *
 * 다만 여기는 묶는 방법이 다릅니다. 트리거가 `<div role="combobox">` 라
 * **`<label for>` 가 안 통합니다** — `for` 는 `input` · `textarea` · `select` 같은
 * labelable 요소에만 걸리고, div 에 걸면 조용히 아무 일도 안 일어납니다
 * (실제로 그 상태였습니다). 그래서 라벨의 id 를 **`aria-labelledby`** 로 가리킵니다.
 *
 * 껍데기(`SelectTrigger`)를 `Select` · `Combobox` · `Lookup` · `MobileSelect` 가
 * 함께 쓰므로 넷이 같습니다. 쓰는 쪽에서는 그냥 감싸면 됩니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  parameters: { layout: "padded" },
  render: function InForm() {
    const [a, setA] = useState<string[]>(["cbc"]);
    const [b, setB] = useState<string[]>([]);
    return (
      <div className="flex w-72 flex-col gap-4">
        <FormField label="검사 항목" description="여러 항목은 쉼표로 구분합니다.">
          <Combobox options={TESTS} value={a} onValueChange={setA} />
        </FormField>
        <FormField label="검사 항목" required error={b.length ? undefined : "검사 항목을 선택해 주세요."}>
          <Combobox
            type="multi"
            render="chip"
            state={b.length ? "default" : "error"}
            options={TESTS}
            value={b}
            onValueChange={setB}
          />
        </FormField>
      </div>
    );
  },
};
