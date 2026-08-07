import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { design, figma } from "./figma";

/**
 * Figma: Alert — 4 변형 (Tone 4)
 *
 * 화면 안에 남는 경고·안내입니다. Toast 와 달리 자동으로 사라지지 않습니다.
 * 잠깐 알리고 사라져도 되면 Toast, 계속 보여야 하면 Alert 입니다.
 */
const meta = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: { layout: "padded", ...design(figma.alert) },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "success", "warning", "danger"] },
    title: { control: "text" },
    description: { control: "text" },
    // ReactNode 는 컨트롤을 끕니다 — 켜두면 object 편집기가 붙고,
    // 건드리는 순간 빈 객체 {} 가 children 으로 들어가 렌더가 깨집니다
    action: { control: false, description: "우측 버튼. 되돌릴 수 있는 동작만" },
  },
  args: {
    tone: "info",
    title: "조회 조건을 확인해 주세요",
    description: "기간이 3개월을 넘으면 조회가 느려질 수 있습니다.",
  },
  decorators: [(S) => <div className="max-w-xl">{S()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

const TONES = [
  { tone: "info" as const, title: "조회 조건을 확인해 주세요", desc: "기간이 3개월을 넘으면 조회가 느려질 수 있습니다." },
  { tone: "success" as const, title: "결과지를 내려받았습니다", desc: "다운로드 폴더에서 확인하세요." },
  { tone: "warning" as const, title: "참고치를 벗어난 항목이 있습니다", desc: "판독 소견을 함께 확인해 주세요." },
  { tone: "danger" as const, title: "조회에 실패했습니다", desc: "잠시 후 다시 시도해 주세요. 계속되면 전산실로 문의하세요." },
];

/** 아이콘과 색이 함께 바뀝니다 — 색만으로 구분하지 않습니다. */
export const Tone: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {TONES.map((t) => (
        <Alert key={t.tone} tone={t.tone} title={t.title} description={t.desc} />
      ))}
    </div>
  ),
};

/** 설명은 선택입니다. 제목만으로 충분하면 한 줄로 두세요. */
export const 제목만: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert tone="info" title="조회 결과가 없습니다" />
      <Alert tone="success" title="저장되었습니다" />
    </div>
  ),
};

/** Action 은 자세히 보기·다시 시도처럼 이 알림에서 바로 할 수 있는 동작입니다. */
export const 액션: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert
        tone="danger"
        title="조회에 실패했습니다"
        description="네트워크 오류로 결과를 가져오지 못했습니다."
        action={
          <Button size="sm" variant="outline">
            다시 시도
          </Button>
        }
      />
      <Alert
        tone="warning"
        title="참고치를 벗어난 항목이 3건 있습니다"
        description="WBC · CRP · ESR"
        action={
          <>
            <Button size="sm" variant="outline">
              자세히 보기
            </Button>
            <Button size="sm" variant="ghost">
              넘어가기
            </Button>
          </>
        }
      />
    </div>
  ),
};

/**
 * Close 는 사용자가 닫아도 되는 경우에만 켜세요.
 * 오류는 해결될 때까지 남기는 편이 안전합니다 — 실수로 닫으면 왜 실패했는지 알 수 없습니다.
 */
export const 닫기: Story = {
  render: function Closable() {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex flex-col gap-3">
        {open ? (
          <Alert
            tone="info"
            title="새 결과지 양식이 적용되었습니다"
            description="변경 내용은 공지사항에서 확인할 수 있습니다."
            onClose={() => setOpen(false)}
          />
        ) : (
          <Button size="sm" variant="outline" className="w-fit" onClick={() => setOpen(true)}>
            다시 보기
          </Button>
        )}
        <Alert
          tone="danger"
          title="이런 건 닫기를 켜지 마세요"
          description="오류는 사용자가 해결하기 전까지 남아 있어야 합니다."
        />
      </div>
    );
  },
};

/** 폼 상단의 검증 요약 — Alert 이 가장 많이 쓰이는 자리입니다. */
export const 폼검증요약: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert tone="danger" title="입력을 확인해 주세요">
        <ul className="mt-1 list-inside list-disc text-xs text-text-subtle">
          <li>조회 기간을 선택해 주세요</li>
          <li>환자명 또는 등록번호 중 하나는 필수입니다</li>
        </ul>
      </Alert>
      <p className="text-2xs text-text-muted-foreground">
        danger 는 role=&quot;alert&quot; 로 즉시 읽히고, 나머지는 role=&quot;status&quot; 라
        하던 일을 끊지 않습니다.
      </p>
    </div>
  ),
};
