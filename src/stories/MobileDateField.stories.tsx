import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { DateField } from "@/components/ui/date-field";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { design, figma } from "./figma";

/** 390×844 틀. `ack-mobile` 이 반응형 변수를 모바일 값으로 고정합니다. */
function Phone({ children }: { children: (el: HTMLElement | null) => React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setEl}
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
    >
      <PointerModeProvider mode="touch">
        <div className="flex flex-col gap-3 p-4 pt-10">{children(el)}</div>
      </PointerModeProvider>
    </div>
  );
}

const today = startOfDay(new Date());

/**
 * Figma: MobileDateField (3 변형) + MobileCalendar (6 변형)
 *
 * 모바일 조회 조건의 기간 입력입니다. **PC 의 `DateField` 와 짝**이고 규칙도 같습니다 —
 * 다만 가로로 놓는 대신 **세로로 쌓습니다.**
 *
 * ### PC 와 다른 점
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 배치 | 가로 한 줄 | **세로로 쌓음** |
 * | 달력 | 두 달 | **한 달** — 두 달을 넣으면 칸이 손가락보다 작아집니다 |
 * | 년·월 | Select | **‹ 2026년 7월 › 화살표** |
 * | 담는 그릇 | Popover | MobileSheet |
 * | 확인 | 패널 푸터 | **시트 푸터** |
 * | 칩 | 내용 폭 | **균등 분할** |
 *
 * 년·월을 Select 로 두지 않은 이유는 시트 위에 패널을 또 띄우게 되기 때문입니다 —
 * "시트를 두 개 겹치지 마세요" 라는 규칙과 부딪힙니다.
 *
 * ### 칩은 거짓말을 하면 안 됩니다
 *
 * 달력에서 임의 기간을 고르면 **칩 선택이 풀립니다.** PC 와 같은 규칙입니다 —
 * 7일을 눌러둔 채로 3월을 고르면 화면이 거짓 정보를 말하게 됩니다.
 */
const meta = {
  title: "Mobile/MobileDateField",
  component: MobileDateField,
  parameters: { layout: "centered", ...design(figma.mobileDateField) },
  argTypes: {
    precision: { control: "inline-radio", options: ["day", "month", "year"] },
    value: { control: false },
    presets: { control: false },
    onValueChange: { control: false },
    container: { control: false },
  },
  args: { value: { start: null, end: null }, onValueChange: () => {} },
} satisfies Meta<typeof MobileDateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [v, setV] = useState<DateRange>({ start: addDays(today, -6), end: today });
    return (
      <Phone>
        {(el) => (
          <>
            <MobileDateField
              {...args}
              container={el}
              label="조회 기간"
              value={v}
              onValueChange={setV}
            />
            <p className="text-2xs text-text-muted-foreground">
              {v.start && v.end ? `${formatDate(v.start)} ~ ${formatDate(v.end)}` : "(없음)"}
            </p>
          </>
        )}
      </Phone>
    );
  },
};

/** 값이 없으면 무엇을 고르는 자리인지 알려줍니다. 시트를 열면 시작부터 고릅니다. */
export const 빈값: Story = {
  name: "빈 값",
  render: function Empty(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <Phone>
        {(el) => (
          <MobileDateField
            {...args}
            container={el}
            label="조회 기간"
            value={v}
            onValueChange={setV}
          />
        )}
      </Phone>
    );
  },
};

/**
 * 빠른 선택을 끄면 **입력창만** 남습니다.
 * 생년월일이나 검사 시행일처럼 정해진 기간 묶음이 없는 경우에 씁니다.
 */
export const 칩없음: Story = {
  name: "칩 없음",
  render: function NoPresets(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <Phone>
        {(el) => (
          <MobileDateField
            {...args}
            container={el}
            label="검사 시행일"
            presets={false}
            value={v}
            onValueChange={setV}
          />
        )}
      </Phone>
    );
  },
};

/** 월 단위 조회입니다. 빠른 선택도 단위를 따라 `1개월 · 3개월 · 6개월 · 1년` 이 됩니다. */
export const 월단위: Story = {
  name: "월 단위",
  render: function Monthly(args) {
    const [v, setV] = useState<DateRange>({ start: null, end: null });
    return (
      <Phone>
        {(el) => (
          <MobileDateField
            {...args}
            container={el}
            label="통계 기간"
            precision="month"
            value={v}
            onValueChange={setV}
          />
        )}
      </Phone>
    );
  },
};

/**
 * 같은 조회 조건을 PC 와 모바일로 나란히 본 것입니다.
 *
 * **로직은 하나입니다** — 프리셋 계산 · 칩 연동 · 범위 선택이 같은 코드에서 나옵니다.
 * 다른 것은 배치(가로 ↔ 세로), 담는 그릇(Popover ↔ Sheet), 달력 수(둘 ↔ 하나)뿐입니다.
 */
export const PC와나란히: Story = {
  name: "PC 와 나란히",
  parameters: { layout: "padded" },
  render: function SideBySide() {
    const [pc, setPc] = useState<DateRange>({ start: addDays(today, -6), end: today });
    const [mo, setMo] = useState<DateRange>({ start: addDays(today, -6), end: today });
    return (
      <div className="flex items-start gap-8">
        <div>
          <p className="mb-2 text-xs text-text-subtle">PC — DateField (가로)</p>
          <DateField label="조회 기간" value={pc} onValueChange={setPc} />
        </div>
        <div>
          <p className="mb-2 text-xs text-text-subtle">모바일 — MobileDateField (세로)</p>
          <Phone>
            {(el) => (
              <MobileDateField
                container={el}
                label="조회 기간"
                value={mo}
                onValueChange={setMo}
              />
            )}
          </Phone>
        </div>
      </div>
    );
  },
};
