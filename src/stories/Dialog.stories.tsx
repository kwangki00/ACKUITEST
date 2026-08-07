import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ConfirmDialog,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { design, figma } from "./figma";

/**
 * Figma: Dialog — 6 변형 (Size 3 × Tone 2)
 *
 * **사용자 행동을 막을 때만** 씁니다. 모달은 하던 일을 세우고 답을 요구하는 것이라,
 * 알리기만 하면 될 때 쓰면 매번 닫는 손이 듭니다 — 그건 Toast 입니다.
 *
 * ### 크기
 *
 * | | 폭 | 언제 |
 * |---|---|---|
 * | `sm` | 400 | 짧은 확인 — "삭제할까요?" |
 * | `default` | 512 | 기본 |
 * | `lg` | 640 | 폼이나 표가 들어갈 때 |
 *
 * ### 규칙
 *
 * - **제목은 질문형** — "삭제할까요?" 가 "삭제 확인" 보다 명확합니다
 * - **되돌릴 수 없으면 설명으로 결과를 알립니다** — "삭제한 결과는 되돌릴 수 없습니다"
 * - **취소가 왼쪽, 주 액션이 오른쪽**
 * - `tone="destructive"` 는 되돌릴 수 없는 동작에만. 되돌릴 수 있는 일에 빨강을 쓰면
 *   사용자가 불필요하게 망설입니다
 * - 우상단 X 는 **취소와 같은 동작**이어야 합니다
 *
 * ### 두 가지 쓰는 법
 *
 * | | |
 * |---|---|
 * | `ConfirmDialog` | 확인창 — 제목·설명·버튼이 한 덩어리. **대부분 이걸 씁니다** |
 * | 프리미티브 조립 | 폼이 들어가는 창 |
 *
 * 확인창을 매번 손으로 조립하면 버튼 순서나 톤이 조금씩 어긋납니다.
 */
const meta = {
  title: "Feedback/Dialog",
  component: ConfirmDialog,
  parameters: { layout: "centered", ...design(figma.dialog) },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "destructive"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    showCancel: { control: "boolean" },
    loading: { control: "boolean" },
    open: { control: false },
    onOpenChange: { control: false },
    onConfirm: { control: false },
    children: { control: false },
  },
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: "검사 결과를 삭제할까요?",
    description: "삭제한 결과는 되돌릴 수 없습니다. 계속하시겠습니까?",
    tone: "destructive",
    size: "default",
    confirmLabel: "삭제",
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          삭제
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>
    );
  },
};

/**
 * 되돌릴 수 있는 동작에는 빨강을 쓰지 마세요.
 * 저장·확인은 `default` 입니다 — 빨강은 사용자를 망설이게 합니다.
 */
export const Tone: Story = {
  render: function Tones() {
    const [tone, setTone] = useState<"default" | "destructive" | null>(null);
    return (
      <div className="flex gap-3">
        <Button onClick={() => setTone("default")}>저장 확인</Button>
        <Button variant="destructive" onClick={() => setTone("destructive")}>
          삭제 확인
        </Button>
        <ConfirmDialog
          open={tone === "default"}
          onOpenChange={(o) => !o && setTone(null)}
          title="변경 내용을 저장할까요?"
          description="입력한 내용이 검사 항목에 반영됩니다."
          confirmLabel="저장"
          onConfirm={() => setTone(null)}
        />
        <ConfirmDialog
          open={tone === "destructive"}
          onOpenChange={(o) => !o && setTone(null)}
          title="검사 결과를 삭제할까요?"
          description="삭제한 결과는 되돌릴 수 없습니다. 계속하시겠습니까?"
          tone="destructive"
          confirmLabel="삭제"
          onConfirm={() => setTone(null)}
        />
      </div>
    );
  },
};

/** 400 · 512 · 640. 폭만 다르고 여백·간격은 같습니다. */
export const Size: Story = {
  render: function Sizes() {
    const [size, setSize] = useState<"sm" | "default" | "lg" | null>(null);
    return (
      <div className="flex gap-3">
        {(["sm", "default", "lg"] as const).map((s) => (
          <Button key={s} variant="outline" onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
        {size && (
          <ConfirmDialog
            open
            onOpenChange={(o) => !o && setSize(null)}
            size={size}
            title={size === "sm" ? "삭제할까요?" : "검사 결과를 삭제할까요?"}
            description={
              size === "sm" ? undefined : "삭제한 결과는 되돌릴 수 없습니다. 계속하시겠습니까?"
            }
            tone="destructive"
            confirmLabel="삭제"
            onConfirm={() => setSize(null)}
          />
        )}
      </div>
    );
  },
};

/**
 * 취소를 끄면 확인 버튼만 남습니다 — **알림성 모달**입니다.
 *
 * 다만 여기까지 오면 대개 Toast 가 맞습니다. 사용자가 반드시 읽어야 하고
 * 그 전에 다음 단계로 못 가게 막아야 할 때만 쓰세요.
 */
export const 알림성: Story = {
  name: "알림성 (취소 없음)",
  render: function NoticeOnly(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          결과 보기
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="조회 기간이 조정되었습니다"
          description="선택한 기간이 1년을 넘어 최근 1년으로 줄였습니다."
          tone="default"
          showCancel={false}
          confirmLabel="확인"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * 처리 중에는 확인 버튼이 돕니다. **두 번 눌리는 것을 막습니다** —
 * 삭제 요청이 두 번 나가면 두 번째는 없는 것을 지우려 합니다.
 */
export const 처리중: Story = {
  name: "처리 중",
  render: function Loading(args) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          삭제
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={(o) => !busy && setOpen(o)}
          loading={busy}
          confirmLabel={busy ? "삭제 중" : "삭제"}
          onConfirm={() => {
            setBusy(true);
            setTimeout(() => {
              setBusy(false);
              setOpen(false);
            }, 1500);
          }}
        />
      </>
    );
  },
};

/**
 * 폼이 들어가는 창은 프리미티브로 조립합니다.
 * `lg`(640)를 쓰고, 내용이 길면 창 안에서 스크롤됩니다.
 */
export const 폼: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          검사 항목 추가
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogTitle>검사 항목을 추가할까요?</DialogTitle>
        <DialogDescription>
          등록한 항목은 조회 화면의 검사 목록에 바로 나타납니다.
        </DialogDescription>

        <div className="flex flex-col gap-3">
          <FormField label="검사 코드" required description="영문 대문자와 숫자만 입력하세요." htmlFor="dg1">
            <Input id="dg1" placeholder="예: CBC-001" />
          </FormField>
          <FormField label="검사명" required htmlFor="dg2">
            <Input id="dg2" placeholder="예: 일반혈액검사" />
          </FormField>
          <FormField label="분류">
            <Select
              options={[
                { value: "blood", label: "혈액" },
                { value: "urine", label: "소변" },
              ]}
              value="blood"
              onValueChange={() => {}}
            />
          </FormField>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
