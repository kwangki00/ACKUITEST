import type { Meta, StoryObj } from "@storybook/react";
import { useToast, type ToastTone } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { design, figma } from "./figma";

/**
 * Figma: Toast — 4 변형 (Tone 4)
 *
 * 처리 **결과**를 잠깐 알립니다. 사용자를 멈춰 세우지 않습니다 —
 * 답을 받아야 하면 `Dialog` 입니다.
 *
 * ### Dialog · Alert 과 어떻게 갈리나
 *
 * | 상황 | 쓸 것 |
 * |---|---|
 * | 사용자 행동을 막아야 함 | **Dialog** — 삭제 확인처럼 되돌릴 수 없는 동작 |
 * | 처리 결과만 알림 | **Toast** — 저장 완료 · 조회 완료 |
 * | 화면에 계속 남아야 함 | **Alert** — 조회 조건 안내처럼 사라지면 안 되는 것 |
 * | 실패를 알림 | **Toast + Alert** — Toast 는 사라지므로 단독으로 두지 마세요 |
 *
 * ### 규칙
 *
 * - **자동으로 사라집니다.** 중요한 정보를 여기에만 두지 마세요 —
 *   스크린리더가 다 읽기 전에 사라질 수도 있습니다
 * - **색만으로 구분하지 마세요.** 제목 문구로 결과를 명확히 씁니다 —
 *   "저장에 실패했습니다" 처럼요
 * - **동시에 3개까지.** 넘치면 오래된 것부터 지웁니다. 새 것이 위로 올라옵니다
 * - `action` 은 **실행 취소가 실제로 가능할 때만** — 눌러도 되돌릴 수 없으면 없느니만 못합니다
 *
 * ### 쓰는 법
 *
 * 앱 루트에 `ToastProvider` 를 하나 두고 `useToast()` 로 꺼냅니다 (Tooltip 과 같은 자리).
 *
 * ```tsx
 * const { toast } = useToast();
 * toast({ tone: "success", title: "저장되었습니다", description: "12건이 반영되었습니다." });
 * ```
 */
const meta = {
  title: "Feedback/Toast",
  parameters: { layout: "centered", ...design(figma.toast) },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: { tone: ToastTone; title: string; description: string }[] = [
  { tone: "success", title: "저장되었습니다", description: "검사 결과 12건이 반영되었습니다." },
  { tone: "info", title: "조회가 완료되었습니다", description: "총 128건이 검색되었습니다." },
  {
    tone: "warning",
    title: "일부 항목이 누락되었습니다",
    description: "3건은 필수값이 없어 제외되었습니다.",
  },
  {
    tone: "danger",
    title: "저장에 실패했습니다",
    description: "네트워크 오류입니다. 다시 시도해 주세요.",
  },
];

/** 네 가지 톤. **제목만 읽어도 결과를 알 수 있어야 합니다** — 색은 거들 뿐입니다. */
export const Tone: Story = {
  render: function Tones() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <Button key={c.tone} variant="outline" onClick={() => toast(c)}>
            {c.tone}
          </Button>
        ))}
      </div>
    );
  },
};

/** 설명이 없으면 제목만 나옵니다. 한 줄로 끝나는 결과에 씁니다. */
export const 제목만: Story = {
  name: "제목만",
  render: function TitleOnly() {
    const { toast } = useToast();
    return (
      <Button variant="outline" onClick={() => toast({ tone: "success", title: "복사되었습니다" })}>
        복사
      </Button>
    );
  },
};

/**
 * 되돌리기 버튼입니다. **실행 취소가 실제로 가능할 때만** 쓰세요.
 *
 * 삭제를 되돌릴 수 없다면 버튼을 붙이지 말고, 애초에 Dialog 로 확인을 받아야 합니다.
 */
export const 실행취소: Story = {
  name: "실행 취소",
  render: function WithAction() {
    const { toast } = useToast();
    return (
      <Button
        variant="outline"
        onClick={() =>
          toast({
            tone: "success",
            title: "삭제되었습니다",
            description: "검사 결과 3건을 지웠습니다.",
            action: { label: "실행 취소", onClick: () => {} },
          })
        }
      >
        삭제
      </Button>
    );
  },
};

/**
 * 동시에 **3개까지**만 둡니다. 넘치면 오래된 것부터 사라집니다 —
 * 쌓이는 대로 두면 읽기도 전에 화면을 덮습니다.
 *
 * 빠르게 여러 번 눌러 보세요.
 */
export const 쌓임: Story = {
  render: function Stacking() {
    const { toast } = useToast();
    let n = 0;
    return (
      <Button
        onClick={() => {
          n += 1;
          toast({
            tone: CASES[n % 4].tone,
            title: `${CASES[n % 4].title} (${n})`,
            description: CASES[n % 4].description,
          });
        }}
      >
        연달아 띄우기
      </Button>
    );
  },
};

/**
 * **실패는 Toast 만으로 두지 마세요.**
 *
 * Toast 는 4초 뒤 사라집니다. 잠깐 다른 곳을 보고 있었다면 무엇이 잘못됐는지
 * 알 방법이 없어집니다. 화면에도 함께 남기세요 — `Alert` 입니다.
 */
export const 실패는화면에도: Story = {
  name: "실패는 화면에도",
  parameters: { layout: "padded" },
  render: function FailureCase() {
    const { toast } = useToast();
    return (
      <div className="flex w-[520px] flex-col gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast({
              tone: "danger",
              title: "저장에 실패했습니다",
              description: "네트워크 오류입니다. 다시 시도해 주세요.",
              duration: 8000,
            })
          }
        >
          저장 (실패)
        </Button>
        <Alert
          tone="danger"
          title="저장에 실패했습니다"
          description="네트워크 오류입니다. 다시 시도해 주세요."
        />
        <p className="text-2xs text-text-muted-foreground">
          Toast 는 사라지지만 Alert 은 남습니다. 실패 알림의 지속 시간도 조금 길게 두었습니다.
        </p>
      </div>
    );
  },
};
