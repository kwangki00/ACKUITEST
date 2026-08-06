import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardBody, CardRow } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { design, figma } from "./figma";

/**
 * Figma: Card 6 변형 (Variant 2 × Size 3) + CardRow 2 변형
 *
 * 결과조회의 접수정보·개인정보·검사정보처럼 항목을 나누는 데 씁니다.
 * 라벨 폭이 고정이라 여러 줄이 세로로 정렬됩니다.
 */
const meta = {
  title: "Display/Card",
  component: Card,
  parameters: { layout: "padded", ...design(figma.card) },
  argTypes: {
    variant: { control: "inline-radio", options: ["outline", "filled"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
  args: { variant: "outline", size: "default" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: (args) => (
    <Card {...args} className="w-90">
      <CardHeader title="접수정보" />
      <CardBody>
        <CardRow label="접수일">2026-06-01</CardRow>
        <CardRow label="접수번호">20260601001</CardRow>
        <CardRow label="성명">김선영</CardRow>
      </CardBody>
    </Card>
  ),
};

/** Filled 는 카드 안의 하위 그룹에 씁니다 — 최상위에 쓰면 화면 배경과 붙습니다. */
export const Variant: Story = {
  parameters: { layout: "padded", ...design(figma.card) },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        {(["outline", "filled"] as const).map((v) => (
          <Card key={v} variant={v} className="w-72">
            <CardHeader title={v} />
            <CardBody>
              <CardRow label="접수일">2026-06-01</CardRow>
              <CardRow label="성명">김선영</CardRow>
            </CardBody>
          </Card>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-text-basic">
          제대로 된 쓰임 — Outline 안에 Filled 를 하위 그룹으로
        </p>
        <Card className="w-90">
          <CardHeader title="검사정보" />
          <CardBody>
            <CardRow label="검사명">일반혈액검사</CardRow>
            <CardRow label="검체">전혈</CardRow>
          </CardBody>
          <Card variant="filled" size="sm">
            <CardHeader title="참고치" />
            <CardBody>
              <CardRow label="WBC">4.0 ~ 10.0</CardRow>
              <CardRow label="RBC">4.2 ~ 5.4</CardRow>
            </CardBody>
          </Card>
        </Card>
      </div>
    </div>
  ),
};

/** 안쪽 여백과 제목 크기가 함께 커집니다. */
export const Size: Story = {
  parameters: { layout: "padded", ...design(figma.card) },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(
        [
          { s: "sm", pad: 16, title: 14, label: 88 },
          { s: "default", pad: 20, title: 16, label: 104 },
          { s: "lg", pad: 24, title: 18, label: 104 },
        ] as const
      ).map((x) => (
        <Card key={x.s} size={x.s} className="w-72">
          <CardHeader title={x.s} />
          <CardBody>
            <CardRow label="여백">{x.pad}</CardRow>
            <CardRow label="제목">{x.title}</CardRow>
            <CardRow label="라벨 폭">{x.label}</CardRow>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

/** Action 을 켜면 제목 우측에 버튼이 붙습니다. */
export const 액션: Story = {
  parameters: { layout: "padded", ...design(figma.card) },
  render: () => (
    <Card className="w-90">
      <CardHeader
        title="개인정보"
        action={
          <Button size="xs" variant="outline">
            수정
          </Button>
        }
      />
      <CardBody>
        <CardRow label="성명">김선영</CardRow>
        <CardRow label="생년월일">1984-03-12</CardRow>
        <CardRow label="연락처">010-1234-5678</CardRow>
      </CardBody>
    </Card>
  ),
};

/**
 * 값 자리에는 무엇이든 들어갑니다 — 상태 표시가 필요하면 Badge 를 넣으세요.
 * 값이 비면 하이픈을 보여줍니다. 빈칸이면 조회가 덜 된 건지 값이 없는 건지 모릅니다.
 */
export const 값의모양: Story = {
  parameters: { layout: "padded", ...design(figma.cardRow) },
  render: () => (
    <Card className="w-90">
      <CardHeader title="검사정보" />
      <CardBody>
        <CardRow label="검사명">일반혈액검사</CardRow>
        <CardRow label="상태">
          <Badge tone="success" size="sm">
            완료
          </Badge>
        </CardRow>
        <CardRow label="판독의">-</CardRow>
        <CardRow label="비고" />
        <CardRow label="특이사항">
          값이 길어지면 줄바꿈되고, 라벨은 상단 정렬을 유지합니다. 여러 줄이 되어도 라벨 폭이
          고정이라 아래 줄과 세로로 맞습니다.
        </CardRow>
      </CardBody>
    </Card>
  ),
};

/** 결과조회 상세 화면처럼 카드를 나란히 놓은 모습입니다. */
export const 화면예시: Story = {
  parameters: { layout: "padded", ...design(figma.card) },
  render: () => (
    <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader title="접수정보" />
        <CardBody>
          <CardRow label="접수일">2026-06-01</CardRow>
          <CardRow label="접수번호">20260601001</CardRow>
          <CardRow label="접수처">본원 채혈실</CardRow>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="개인정보" />
        <CardBody>
          <CardRow label="성명">김선영</CardRow>
          <CardRow label="생년월일">1984-03-12</CardRow>
          <CardRow label="차트번호">2312348</CardRow>
        </CardBody>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader
          title="검사정보"
          action={
            <Button size="xs" variant="outline">
              결과지 내려받기
            </Button>
          }
        />
        <CardBody>
          <CardRow label="검사명">일반혈액검사 (CBC)</CardRow>
          <CardRow label="상태">
            <Badge tone="success" size="sm">
              판독 완료
            </Badge>
          </CardRow>
          <CardRow label="판독일">2026-06-03</CardRow>
        </CardBody>
      </Card>
    </div>
  ),
};
