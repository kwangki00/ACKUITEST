import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileSelect } from "@/components/ui/mobile-select";
import { Combobox } from "@/components/ui/combobox";
import { FormField } from "@/components/ui/form-field";
import type { ComboboxOption } from "@/components/ui/combobox";
import { design, figma } from "./figma";

/**
 * 390×844 화면 틀. `ack-mobile` 이 반응형 변수를 모바일 값으로 고정합니다 —
 * 미디어쿼리는 **브라우저 창**을 재기 때문에, 틀만 좁혀도 창이 넓으면
 * 목록 항목이 48 이 아니라 32 로 나옵니다.
 */
function Phone({ children }: { children: (el: HTMLElement | null) => React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setEl}
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
    >
      <div className="flex flex-col gap-3 p-4 pt-10">{children(el)}</div>
    </div>
  );
}

const TESTS: ComboboxOption[] = [
  { value: "cbc", label: "일반혈액검사" },
  { value: "coag", label: "혈액응고검사" },
  { value: "cul", label: "혈액배양검사" },
  { value: "gas", label: "혈액가스분석" },
  { value: "type", label: "혈액형검사" },
  { value: "smear", label: "혈액도말검사" },
  { value: "ua", label: "소변검사" },
  { value: "hold", label: "보류 항목", disabled: true },
];

/**
 * Figma: MobileSelectContent (Overlay) + MobileSheet (Layouts)
 *
 * 모바일에서 값을 고릅니다. PC 의 `Select` · `Combobox` 자리입니다.
 *
 * ### 안은 PC 와 똑같습니다
 *
 * Figma 문서 그대로 — *"PC 와 같은 ComboboxPanel 을 쓰고 **감싸는 컨테이너만**
 * MobileSheet 로 분기합니다."* 목록을 다시 만들지 않습니다.
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 담는 그릇 | Popover | **MobileSheet** |
 * | 표면 | 그림자 + 테두리 | 없음 — 시트가 표면 역할 |
 * | 항목 높이 | 32 | **48** — 터치 기준 |
 * | 폭 | 트리거에 맞춤 | 시트 폭 |
 *
 * 항목 높이는 `--h-list-item` 이 알아서 바꿉니다(1024px 에서 갈립니다) —
 * 코드에서 따로 지정하지 않습니다.
 *
 * ### 확인 버튼은 다중일 때만
 *
 * | | Footer | 이유 |
 * |---|---|---|
 * | 단일 | **끔** | 고르면 바로 닫힙니다. 확인을 또 누르게 하면 번거롭습니다 |
 * | 다중 | 켬 | 여러 개를 다 고른 뒤 확정해야 합니다 |
 *
 * PC 의 `Select`(확인 없음) · `DateRangePicker`(확인 있음)와 같은 기준입니다.
 *
 * ### 언제 PC 것을 쓰나
 *
 * 화면 폭으로 갈립니다. 같은 화면을 두 벌 만들지 말고 **컨테이너만 바꾸세요** —
 * 목록·검색·선택 로직은 하나입니다.
 */
const meta = {
  title: "Mobile/MobileSelect",
  component: MobileSelect,
  parameters: { layout: "centered", ...design(figma.mobileSelectContent) },
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multi"] },
    searchable: { control: "boolean" },
    selectAll: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "default", "lg", "grid"] },
    state: { control: "inline-radio", options: ["default", "error", "disabled", "readonly"] },
    value: { control: false },
    options: { control: false },
    onValueChange: { control: false },
    container: { control: false },
  },
  args: {
    type: "single",
    options: [],
    value: [],
    onValueChange: () => {},
    searchable: true,
  },
} satisfies Meta<typeof MobileSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 고르면 **바로 닫힙니다.** 확인 버튼이 없습니다. */
export const 단일: Story = {
  render: function Single(args) {
    const [v, setV] = useState<string[]>(["cbc"]);
    return (
      <Phone>
        {(el) => (
          <FormField label="검사 항목">
            <MobileSelect
              {...args}
              container={el}
              type="single"
              title="검사 항목"
              options={TESTS}
              value={v}
              onValueChange={setV}
            />
          </FormField>
        )}
      </Phone>
    );
  },
};

/**
 * 여러 개를 고른 뒤 **선택**을 눌러야 확정됩니다.
 * 취소하면 고르던 것이 통째로 버려집니다 — 시트를 열기 전 값으로 돌아갑니다.
 */
export const 다중: Story = {
  render: function Multi(args) {
    const [v, setV] = useState<string[]>(["cbc", "ua"]);
    return (
      <Phone>
        {(el) => (
          <>
            <FormField label="검사 항목">
              <MobileSelect
                {...args}
                container={el}
                type="multi"
                title="검사 항목"
                options={TESTS}
                value={v}
                onValueChange={setV}
                selectAll
              />
            </FormField>
            <p className="text-2xs text-text-muted-foreground">
              고른 값: {v.length ? v.join(", ") : "(없음)"}
            </p>
          </>
        )}
      </Phone>
    );
  },
};

/**
 * 항목이 3~5개뿐이면 검색을 끄세요 — **항목보다 검색창이 더 큽니다.**
 * PC `Combobox` 의 `searchable` 과 같은 기준입니다.
 */
export const 검색없음: Story = {
  name: "검색 없음",
  render: function NoSearch(args) {
    const [v, setV] = useState<string[]>([]);
    return (
      <Phone>
        {(el) => (
          <FormField label="정렬 기준">
            <MobileSelect
              {...args}
              container={el}
              title="정렬 기준"
              searchable={false}
              options={[
                { value: "a", label: "접수번호순" },
                { value: "b", label: "이름순" },
                { value: "c", label: "보고일순" },
              ]}
              value={v}
              onValueChange={setV}
              placeholder="정렬을 선택해 주세요."
            />
          </FormField>
        )}
      </Phone>
    );
  },
};

/**
 * 같은 목록을 PC 와 모바일에서 나란히 본 것입니다.
 *
 * **로직은 하나입니다** — 검색·초성 매칭·전체 선택이 같은 `ComboboxPanel` 에서 나옵니다.
 * 다른 것은 담는 그릇(Popover ↔ MobileSheet)과 항목 높이(32 ↔ 48)뿐입니다.
 */
export const PC와나란히: Story = {
  name: "PC 와 나란히",
  parameters: { layout: "padded" },
  render: function SideBySide() {
    const [pc, setPc] = useState<string[]>(["cbc", "ua"]);
    const [mo, setMo] = useState<string[]>(["cbc", "ua"]);
    return (
      <div className="flex items-start gap-8">
        <div className="w-72">
          <p className="mb-2 text-xs text-text-subtle">PC — Combobox (Popover)</p>
          <Combobox type="multi" options={TESTS} value={pc} onValueChange={setPc} selectAll />
        </div>
        <div>
          <p className="mb-2 text-xs text-text-subtle">모바일 — MobileSelect (Sheet)</p>
          <Phone>
            {(el) => (
              <MobileSelect
                container={el}
                type="multi"
                title="검사 항목"
                options={TESTS}
                value={mo}
                onValueChange={setMo}
                selectAll
              />
            )}
          </Phone>
        </div>
      </div>
    );
  },
};
