import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AccordionFlatProps } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { design, figma } from "./figma";

const ITEMS = [
  {
    value: "result",
    title: "검사 결과 상세",
    body: "검사 결과에 대한 상세 내용이 들어갑니다. 텍스트·표·카드 등 어떤 콘텐츠든 넣을 수 있습니다.",
  },
  {
    value: "history",
    title: "이전 검사 이력",
    body: "같은 환자의 지난 검사 결과입니다. 추이를 보려면 통계 화면으로 이동하세요.",
  },
  {
    value: "note",
    title: "판독 소견",
    body: "판독의가 남긴 소견입니다. 수정 이력은 감사 로그에 남습니다.",
  },
];

/**
 * Figma: AccordionItem (Card 페이지 · 6 변형 — Size 2 × State 3)
 *
 * **공간을 아끼면서 많은 내용을 담는 접이식 영역**입니다.
 *
 * ### `Card` 와 무엇이 다른가
 *
 * | | |
 * |---|---|
 * | **항상 보여야 함** | `Card` |
 * | **공간을 아껴야 함** | `Accordion` |
 *
 * **접힌 내용은 잘 안 봅니다.** 자주 보는 항목은 `defaultValue` 로 펼쳐 두세요 —
 * 중요한 정보를 접어두면 없는 것과 비슷해집니다.
 *
 * ### 화살표는 「지금 상태」입니다
 *
 * 펼쳐져 있으면 **위**, 접혀 있으면 **아래**입니다. "누르면 일어날 일" 로 읽어
 * 반대로 두면 같은 화면에서 같은 화살표가 두 뜻을 갖게 됩니다.
 *
 * ### 높이 애니메이션
 *
 * `height: auto` 로는 애니메이션이 안 걸려서, Radix 가 넘겨주는
 * `--radix-accordion-content-height` 를 키프레임이 씁니다 (`ack-theme.css`).
 * `prefers-reduced-motion` 에서는 즉시 바뀝니다.
 */
const meta = {
  title: "Display/Accordion",
  // union 을 편 타입으로 넘깁니다 — 그대로 두면 Storybook 이 args 를 never 로 만듭니다
  component: Accordion as React.FC<AccordionFlatProps>,
  parameters: { layout: "padded", ...design(figma.accordion) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    // type 은 스토리마다 고정입니다 — 컨트롤로 두면 눌러도 아무 일이 없습니다
    type: { control: false },
    children: { control: false },
  },
  args: { size: "default" },
  decorators: [(S) => <div className="w-[520px]">{S()}</div>],
} satisfies Meta<AccordionFlatProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **첫 항목만 펼쳐 두었습니다** (Figma 의 조립 예시와 같습니다).
 *
 * 바깥을 테두리로 감싸면 하나의 덩어리가 됩니다 — 항목마다 하단 구분선만 있어서
 * 쌓으면 선이 이어집니다.
 */
export const 기본: Story = {
  render: (args) => (
    <Accordion
      size={args.size}
      type="single"
      collapsible
      defaultValue="result"
      className="rounded-lg border border-card-border bg-card-surface"
    >
      {ITEMS.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionTrigger>{it.title}</AccordionTrigger>
          <AccordionContent>{it.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * **`single` 은 하나를 열면 다른 것이 닫힙니다.** 항목이 많으면 이쪽이 스크롤을 줄입니다.
 *
 * `collapsible` 을 켜야 열린 것을 다시 눌러 닫을 수 있습니다 — 안 켜면 **항상 하나는
 * 열려 있습니다.** 목록처럼 전부 접힌 상태가 필요하면 반드시 켜세요.
 */
export const Type: Story = {
  name: "single · multiple",
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-subtle">
          <code>single</code> + <code>collapsible</code> — 하나씩, 다시 눌러 닫힘
        </p>
        <Accordion
          size={args.size}
          type="single"
          collapsible
          className="rounded-lg border border-card-border bg-card-surface"
        >
          {ITEMS.map((it) => (
            <AccordionItem key={it.value} value={it.value}>
              <AccordionTrigger>{it.title}</AccordionTrigger>
              <AccordionContent>{it.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-subtle">
          <code>multiple</code> — 여러 개를 동시에
        </p>
        <Accordion
          size={args.size}
          type="multiple"
          defaultValue={["result", "note"]}
          className="rounded-lg border border-card-border bg-card-surface"
        >
          {ITEMS.map((it) => (
            <AccordionItem key={it.value} value={it.value}>
              <AccordionTrigger>{it.title}</AccordionTrigger>
              <AccordionContent>{it.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  ),
};

/** 트리거 높이만 다릅니다 — `sm` 44 · `default` 52. 내용 여백은 같습니다. */
export const Size: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(["sm", "default"] as const).map((s) => (
        <div key={s}>
          <p className="mb-2 text-xs text-text-subtle">
            <code>{s}</code> — 트리거 {s === "sm" ? 44 : 52}
          </p>
          <Accordion
            size={s}
            type="single"
            collapsible
            defaultValue="result"
            className="rounded-lg border border-card-border bg-card-surface"
          >
            {ITEMS.slice(0, 2).map((it) => (
              <AccordionItem key={it.value} value={it.value}>
                <AccordionTrigger>{it.title}</AccordionTrigger>
                <AccordionContent>{it.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  ),
};

/**
 * **내용은 텍스트만이 아닙니다** — 표·카드·배지 무엇이든 들어갑니다.
 *
 * 상세 화면에서 부가 정보를 접어두는 자리가 이런 모양입니다. 자주 보는 것(검사 결과)은
 * 펼쳐 두고, 가끔 보는 것(이력·소견)은 접어 둡니다.
 */
export const 내용: Story = {
  name: "내용 — 표 · 카드",
  render: (args) => (
    <Accordion
      size={args.size}
      type="multiple"
      defaultValue={["result"]}
      className="rounded-lg border border-card-border bg-card-surface"
    >
      <AccordionItem value="result">
        <AccordionTrigger>검사 결과</AccordionTrigger>
        <AccordionContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>검사명</TableHead>
                <TableHead>결과</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>White Blood Cell (WBC)</TableCell>
                <TableCell>6.5 10³/μL</TableCell>
                <TableCell>
                  <Badge tone="success" size="sm">
                    완료
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fasting Glucose</TableCell>
                <TableCell>142 mg/dL</TableCell>
                <TableCell>
                  <Badge tone="danger" size="sm">
                    재검
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="note">
        <AccordionTrigger>판독 소견</AccordionTrigger>
        <AccordionContent>
          <Card className="bg-card-surface-filled">
            공복 혈당이 기준치를 넘습니다. 2주 뒤 재검을 권합니다.
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
