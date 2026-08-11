import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Copy,
  Download,
  EllipsisVertical,
  Pencil,
  Printer,
  Share2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { design, figma } from "./figma";

/**
 * Figma: DropdownMenu (Overlay)
 *
 * **행 액션 · 더보기 메뉴**입니다. 표의 Action 셀이나 아이콘 버튼을 누르면 뜹니다.
 *
 * ### `Combobox` 와 무엇이 다른가
 *
 * | | 무엇을 하나 | 표식 |
 * |---|---|---|
 * | `Combobox` · `Select` | **값을 고릅니다** | 고른 것에 체크 |
 * | `DropdownMenu` | **동작을 실행합니다** | **없습니다** |
 *
 * 눌러서 값이 남으면 고르는 것이고, 눌러서 무언가 일어나면 실행하는 것입니다.
 * 그래서 선택 표시가 없습니다 — 체크가 보이면 "지금 이게 켜져 있다" 로 읽힙니다.
 * `Combobox 와 나란히` 스토리에서 둘을 함께 열어 보세요.
 *
 * ### 위험한 동작은 떼어 놓습니다
 *
 * 삭제처럼 되돌릴 수 없는 항목은 **마지막에 두고 구분선으로** 분리하세요 —
 * 바로 위 항목을 누르려다 미끄러지는 것을 줄입니다. `tone="destructive"` 로
 * 글자도 빨강이 됩니다.
 *
 * ### 항목이 6개를 넘으면
 *
 * 그룹으로 나누거나 별도 화면을 검토하세요.
 *
 * ### 어디서 뜨나
 *
 * `TableCell(Action)` · `TableToolbar` 의 아이콘 버튼 · `Card` 의 Action 슬롯.
 * 모바일에서는 툴바 아이콘 4개를 **2개 + `⋯`** 로 줄이는 자리입니다.
 */
const meta = {
  title: "Overlay/DropdownMenu",
  component: DropdownMenuContent,
  parameters: { layout: "padded", ...design(figma.dropdownMenu) },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    children: { control: false },
    container: { control: false },
  },
  args: { align: "end", children: null },
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 의 기본 3개 — 수정 · 복제 · 다운로드. */
export const 기본: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="더 보기">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem leadingIcon={<Pencil />}>수정</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * **삭제는 마지막 · 구분선 아래**입니다.
 *
 * 붙여 두면 다운로드를 누르려다 미끄러져 삭제를 누릅니다. 되돌릴 수 없는 동작에
 * 한 번의 실수가 얼마나 비싼지를 생각하면, 줄 하나로 떼어 놓는 값이 쌉니다.
 */
export const 위험한동작: Story = {
  name: "삭제는 떼어 놓습니다",
  render: (args) => (
    <div className="flex items-start gap-10">
      <div>
        <p className="mb-2 text-xs text-text-subtle">권함 — 구분선으로 분리</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="더 보기">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...args}>
            <DropdownMenuItem leadingIcon={<Pencil />}>수정</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="destructive" leadingIcon={<Trash2 />}>
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-subtle">피하세요 — 다운로드 바로 아래에 삭제</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="더 보기">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...args}>
            <DropdownMenuItem leadingIcon={<Pencil />}>수정</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
            <DropdownMenuItem tone="destructive" leadingIcon={<Trash2 />}>
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ),
};

/**
 * 항목이 늘면 **묶음 머리글**로 나눕니다. 그래도 6개를 넘으면 별도 화면을 검토하세요 —
 * 메뉴가 길어지면 훑는 것이 일이 됩니다.
 *
 * 비활성 항목은 **왜 못 누르는지가 화면에 있어야** 합니다. 여기서는 선택된 행이 없어
 * 인쇄를 못 하는 상황입니다 — 그냥 흐리기만 하면 고장으로 읽힙니다.
 */
export const 그룹: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          더 보기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args} className="min-w-48">
        <DropdownMenuLabel>편집</DropdownMenuLabel>
        <DropdownMenuItem leadingIcon={<Pencil />}>수정</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>내보내기</DropdownMenuLabel>
        <DropdownMenuItem leadingIcon={<Download />}>다운로드</DropdownMenuItem>
        <DropdownMenuItem disabled leadingIcon={<Printer />}>
          인쇄 (행을 먼저 고르세요)
        </DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<Share2 />}>공유</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * **둘을 함께 열어 비교해 보세요.**
 *
 * `Combobox` 는 고른 항목에 **체크가 남고** 트리거에 값이 보입니다. `DropdownMenu` 는
 * 누르면 닫히고 **아무 표식도 남지 않습니다** — 값이 아니라 동작이기 때문입니다.
 *
 * 헷갈리면 이렇게 물어보세요: *"누른 뒤에 화면 어딘가에 그 선택이 남아 있어야 하나?"*
 * 남아야 하면 `Combobox`, 아니면 `DropdownMenu` 입니다.
 */
export const 견주기: Story = {
  name: "Combobox 와 나란히",
  render: function Compare(args) {
    const [v, setV] = useState<string[]>(["cbc"]);
    const [last, setLast] = useState<string | null>(null);

    return (
      <div className="flex items-start gap-10">
        <div className="w-56">
          <p className="mb-2 text-xs text-text-subtle">Combobox — 값이 남습니다</p>
          <Combobox
            options={[
              { value: "cbc", label: "일반혈액검사" },
              { value: "ua", label: "소변검사" },
              { value: "img", label: "영상의학" },
            ]}
            value={v}
            onValueChange={setV}
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-text-subtle">DropdownMenu — 실행하고 사라집니다</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="더 보기">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...args}>
              <DropdownMenuItem leadingIcon={<Pencil />} onSelect={() => setLast("수정")}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Copy />} onSelect={() => setLast("복제")}>
                복제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                tone="destructive"
                leadingIcon={<Trash2 />}
                onSelect={() => setLast("삭제")}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="mt-2 text-2xs text-text-muted-foreground">
            {last ? `방금 실행: ${last}` : "아직 아무것도 실행하지 않았습니다"}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * **툴바에서 넘치는 아이콘을 묶는 자리**입니다. 모바일에서는 툴바 아이콘 4개가
 * 들어가지 않아 **자주 쓰는 2개 + `⋯`** 로 줄입니다.
 *
 * `⋯` 안의 항목에도 아이콘을 그대로 답니다 — 툴바에서 보던 것과 같은 그림이어야
 * 어디로 갔는지 찾습니다.
 */
export const 툴바: Story = {
  name: "툴바에서 넘칠 때",
  render: (args) => (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs text-text-subtle">PC — 아이콘 4개가 그대로</p>
        <div className="flex items-center gap-1 rounded-lg border border-table-border bg-background-white p-2">
          <Button variant="ghost" size="icon-sm" aria-label="수정">
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="복제">
            <Copy />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="다운로드">
            <Download />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="인쇄">
            <Printer />
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-subtle">모바일 — 2개 + ⋯</p>
        <div className="ack-mobile flex w-[390px] items-center gap-1 rounded-lg border border-table-border bg-background-white p-2">
          <Button variant="ghost" size="icon-sm" aria-label="수정">
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="다운로드">
            <Download />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="더 보기">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...args}>
              <DropdownMenuItem leadingIcon={<Copy />}>복제</DropdownMenuItem>
              <DropdownMenuItem leadingIcon={<Printer />}>인쇄</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="destructive" leadingIcon={<Trash2 />}>
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  ),
};
