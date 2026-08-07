import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { Button } from "@/components/ui/button";
import { ListItem } from "@/components/ui/list-item";
import { CalendarMonth } from "@/components/ui/calendar";
import { startOfDay, startOfMonth } from "@/lib/date";
import { design, figma } from "./figma";

/**
 * 390×844 화면 틀. Figma 의 모바일 아트보드와 같은 크기입니다.
 *
 * 시트는 `fixed` 라 그냥 두면 브라우저 창 전체를 덮습니다.
 * **`transform` 이 있는 조상이 fixed 의 기준**이 되므로 틀에 `translateZ(0)` 을 주고,
 * Portal 도 이 안으로 보내 문서 페이지에서도 휴대폰 크기로 보이게 합니다.
 *
 * `ack-mobile` 은 반응형 변수를 모바일 값으로 고정합니다 — 미디어쿼리는
 * **브라우저 창**을 재기 때문에, 틀만 좁혀도 창이 넓으면 항목이 PC 높이로 나옵니다.
 *
 * 실제 앱에서는 이런 틀이 필요 없습니다 — 화면이 곧 틀입니다.
 */
function Phone({ children }: { children: (el: HTMLElement | null) => React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setEl}
      style={{ transform: "translateZ(0)" }}
      className="ack-mobile relative h-[844px] w-[390px] overflow-hidden rounded-2xl border border-border-gray-light bg-surface-gray-subtle"
    >
      <div className="flex flex-col items-center gap-3 p-4 pt-10">{children(el)}</div>
    </div>
  );
}

const TESTS = ["일반혈액검사", "소변검사", "영상의학", "병리검사", "혈액배양검사"];

/**
 * Figma: MobileSheet (Layouts 페이지)
 *
 * 아래에서 올라와 화면을 덮는 하단 시트입니다. **모바일에서 Dialog 를 대신합니다.**
 *
 * ### 시트인가 전체 화면인가
 *
 * 무엇을 덮을지는 **사용자가 어디로 가는지**에 달렸습니다.
 *
 * | 상황 | 쓸 것 |
 * |---|---|
 * | **뒤를 보면서 골라야 함** | MobileSheet — 날짜 · 목록 선택 · 필터 |
 * | 다른 화면으로 떠남 | 전체 화면 — 전체메뉴 · 상세 |
 * | 입력이 길고 복잡함 | 전체 화면 — 시트에서 스크롤하면 답답합니다 |
 * | 확인만 받으면 됨 | MobileSheet (`footer` 켬) |
 *
 * ### 높이
 *
 * **최소 240 · 최대 화면의 85%.** 최대를 넘으면 뒤 화면이 안 보여
 * **임시 레이어라는 느낌이 사라집니다** — 그럴 바엔 전체 화면이 낫습니다.
 *
 * ### 규칙
 *
 * - **Scrim 은 안에 들어 있습니다.** 따로 깔지 마세요 — 빠뜨리거나 투명도가 달라집니다
 * - **시트를 두 개 겹치지 마세요.** 뒤로 가기 동작이 꼬입니다
 * - 손잡이는 **끌어내려 닫을 수 있다는 신호**입니다. 실제로 끌어보세요 —
 *   신호만 주고 안 되면 한 번 해보고 다시는 시도하지 않습니다
 * - 아래 20px 은 홈 인디케이터 자리입니다
 *
 * 아래 예시는 **390×844 틀**(Figma 모바일 아트보드와 같은 크기) 안에서 돕니다.
 */
const meta = {
  title: "Mobile/MobileSheet",
  component: MobileSheet,
  parameters: { layout: "centered", ...design(figma.mobileSheet) },
  argTypes: {
    handle: { control: "boolean" },
    showClose: { control: "boolean" },
    footer: { control: "boolean" },
    open: { control: false },
    onOpenChange: { control: false },
    container: { control: false },
    children: { control: false },
  },
  args: {
    open: false,
    onOpenChange: () => {},
    title: "기간 선택",
    handle: true,
    showClose: true,
    footer: true,
    children: null,
  },
} satisfies Meta<typeof MobileSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [open, setOpen] = useState(false);
    return (
      <Phone>
        {(el) => (
          <>
            <Button onClick={() => setOpen(true)}>시트 열기</Button>
            <MobileSheet
              {...args}
              container={el}
              open={open}
              onOpenChange={setOpen}
              onConfirm={() => setOpen(false)}
            >
              <p className="text-sm text-text-subtle">
                내용이 짧아도 최소 240 은 유지됩니다. 그보다 짧으면 여는 동작이 어색합니다.
              </p>
            </MobileSheet>
          </>
        )}
      </Phone>
    );
  },
};

/**
 * 고르는 즉시 닫히는 시트에는 **확인 버튼이 필요 없습니다.**
 * 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다 (Select 와 같은 규칙).
 */
export const 목록선택: Story = {
  name: "목록 선택 (푸터 없음)",
  render: function Picker(args) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("일반혈액검사");
    return (
      <Phone>
        {(el) => (
          <>
            <Button variant="outline" onClick={() => setOpen(true)}>
              {value}
            </Button>
            <MobileSheet
              {...args}
              container={el}
              open={open}
              onOpenChange={setOpen}
              title="검사 항목"
              footer={false}
            >
              <div role="listbox" className="flex flex-col">
                {TESTS.map((t) => (
                  <ListItem
                    key={t}
                    type="check"
                    selected={t === value}
                    onClick={() => {
                      setValue(t);
                      setOpen(false);
                    }}
                  >
                    {t}
                  </ListItem>
                ))}
              </div>
            </MobileSheet>
          </>
        )}
      </Phone>
    );
  },
};

/**
 * 달력은 **한 달만** 보여줍니다. PC 는 두 달이지만 모바일 폭에 두 달을 넣으면
 * 칸이 손가락보다 작아집니다.
 *
 * 확인 버튼은 달력이 아니라 **시트 푸터**가 담당합니다 (Figma 규칙).
 */
export const 날짜선택: Story = {
  name: "날짜 선택",
  render: function DatePick(args) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => startOfMonth(new Date()));
    const [date, setDate] = useState<Date | null>(startOfDay(new Date()));
    return (
      <Phone>
        {(el) => (
          <>
            <Button variant="outline" onClick={() => setOpen(true)}>
              날짜 고르기
            </Button>
            <MobileSheet
              {...args}
              container={el}
              open={open}
              onOpenChange={setOpen}
              title="기간 선택"
              onConfirm={() => setOpen(false)}
              confirmDisabled={!date}
            >
              <CalendarMonth
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={setDate}
                className="w-full"
              />
            </MobileSheet>
          </>
        )}
      </Phone>
    );
  },
};

/**
 * 내용이 최대 높이(85%)를 넘으면 **시트 안에서 스크롤**합니다.
 * 시트가 화면을 넘어 커지지 않습니다 — 뒤가 조금이라도 보여야 임시 레이어로 읽힙니다.
 */
export const 긴내용: Story = {
  name: "긴 내용",
  render: function LongContent(args) {
    const [open, setOpen] = useState(false);
    return (
      <Phone>
        {(el) => (
          <>
            <Button variant="outline" onClick={() => setOpen(true)}>
              긴 목록 열기
            </Button>
            <MobileSheet
              {...args}
              container={el}
              open={open}
              onOpenChange={setOpen}
              title="검사 항목 (30건)"
            >
              <div className="flex flex-col">
                {Array.from({ length: 30 }, (_, i) => (
                  <ListItem key={i}>{`${TESTS[i % TESTS.length]} ${i + 1}`}</ListItem>
                ))}
              </div>
            </MobileSheet>
          </>
        )}
      </Phone>
    );
  },
};

/**
 * 손잡이를 끄면 **닫기 버튼만** 남습니다.
 * 끌어내릴 수 없는데 손잡이가 있으면 거짓 신호입니다.
 */
export const 손잡이없음: Story = {
  name: "손잡이 없음",
  render: function NoHandle(args) {
    const [open, setOpen] = useState(false);
    return (
      <Phone>
        {(el) => (
          <>
            <Button variant="outline" onClick={() => setOpen(true)}>
              열기
            </Button>
            <MobileSheet
              {...args}
              container={el}
              open={open}
              onOpenChange={setOpen}
              handle={false}
              title="정렬 기준"
              footer={false}
            >
              <div className="flex flex-col">
                {["접수번호순", "이름순", "보고일순"].map((t) => (
                  <ListItem key={t} type="check" onClick={() => setOpen(false)}>
                    {t}
                  </ListItem>
                ))}
              </div>
            </MobileSheet>
          </>
        )}
      </Phone>
    );
  },
};
