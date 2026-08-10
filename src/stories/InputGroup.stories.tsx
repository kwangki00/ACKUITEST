import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { design, figma } from "./figma";

/**
 * Figma: InputGroup — 6 변형 (Size 3 × Attached 2)
 *
 * 입력창 + 액션 버튼 조합입니다.
 * 크기는 그룹이 내려주므로 Input·Button 에 따로 주지 마세요 — 높이가 어긋납니다.
 */
const meta = {
  title: "Controls/InputGroup",
  component: InputGroup,
  parameters: { layout: "padded", ...design(figma.inputGroup) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    attached: { control: "boolean", description: "맞닿는 모서리를 없애 한 덩어리로." },
  },
  args: { size: "default", attached: false },
  decorators: [(S) => <div className="w-96">{S()}</div>],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <Input placeholder="환자명 또는 등록번호" />
      <Button>조회</Button>
    </InputGroup>
  ),
};

/** attached 는 모서리를 붙여 하나의 덩어리로 보이게 합니다. */
export const Attached: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[false, true].map((a) => (
        <div key={String(a)}>
          <p className="mb-1.5 text-xs font-medium text-text-basic">
            attached = {String(a)} — {a ? "간격 0 · 맞닿는 모서리 제거" : "간격 8"}
          </p>
          <InputGroup attached={a}>
            <Input placeholder="환자명 또는 등록번호" />
            <Button>조회</Button>
          </InputGroup>
        </div>
      ))}
      <p className="text-2xs text-text-muted-foreground">
        Figma 에서는 붙는 쪽 반경이 변수 바인딩이 아니라 직접 값이라, Radius 토큰을 바꿔도
        따라오지 않습니다. 코드는 자식 선택자로 처리하므로 그 문제가 없습니다.
      </p>
    </div>
  ),
};

/** 높이가 --h-input-* 이라 Input 과 Button 이 자동으로 맞습니다. */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(["sm", "default", "lg"] as const).map((s) => (
        <div key={s}>
          <p className="mb-1.5 text-xs font-medium text-text-basic">{s}</p>
          <InputGroup size={s} attached>
            <Input placeholder="환자명 또는 등록번호" />
            <Button>조회</Button>
          </InputGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * 검색·조회는 아이콘 버튼으로 줄일 수 있습니다.
 * 이때는 크기를 직접 지정하세요 — 아이콘 버튼은 정사각형이라 그룹 크기와 이름이 다릅니다.
 */
export const 아이콘버튼: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(
        [
          { s: "sm", icon: "icon-sm" },
          { s: "default", icon: "icon" },
          { s: "lg", icon: "icon-lg" },
        ] as const
      ).map(({ s, icon }) => (
        <div key={s}>
          <p className="mb-1.5 text-xs font-medium text-text-basic">
            size={s} · Button size={icon}
          </p>
          <InputGroup size={s} attached>
            <Input placeholder="환자명 또는 등록번호" />
            <Button size={icon} aria-label="조회">
              <Search />
            </Button>
          </InputGroup>
        </div>
      ))}
      <p className="text-2xs text-text-muted-foreground">
        중복확인처럼 아이콘으로 표현할 수 없는 동작은 글자를 유지하세요.
      </p>
    </div>
  ),
};

/** 버튼 variant 는 그대로 씁니다. 조회는 soft, 파괴적이지 않은 보조 동작은 outline. */
export const 버튼종류: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(["default", "soft", "outline"] as const).map((v) => (
        <div key={v}>
          <p className="mb-1.5 text-xs font-medium text-text-basic">{v}</p>
          <InputGroup attached>
            <Input placeholder="환자명 또는 등록번호" />
            <Button variant={v}>조회</Button>
          </InputGroup>
        </div>
      ))}
    </div>
  ),
};

/** 상태는 Input 이 그대로 가집니다 — 그룹은 배치만 합니다. */
export const 상태: Story = {
  render: function States() {
    const [v, setV] = useState("");
    const error = v.trim() === "" ? "등록번호를 입력해 주세요." : undefined;
    return (
      <div className="flex flex-col gap-6">
        <FormField label="등록번호" required error={error}>
          <InputGroup attached>
            <Input
              state={error ? "error" : "default"}
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="등록번호"
            />
            <Button>중복확인</Button>
          </InputGroup>
        </FormField>

        <div>
          <p className="mb-1.5 text-xs font-medium text-text-basic">disabled</p>
          <InputGroup attached>
            <Input disabled placeholder="환자명 또는 등록번호" />
            <Button disabled>조회</Button>
          </InputGroup>
        </div>
      </div>
    );
  },
};

/**
 * **감싸기만 하면 라벨이 묶입니다** — `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10).
 * `FormField` 가 만든 id 를 **그룹 안의 `Input` 이** 가져갑니다 — 그룹은 배치만
 * 하고 컨텍스트를 가로채지 않습니다.
 *
 * **그룹 안에 `Input` 은 하나만 두세요.** 둘을 넣으면 같은 id 를 두 번 쓰게 됩니다 —
 * 두 값을 받아야 하면 `FormField` 를 둘로 나누는 쪽이 맞습니다.
 */
export const 폼필드: Story = {
  name: "FormField 안에서",
  parameters: { layout: "padded" },
  render: function InForm() {
    const [v, setV] = useState("");
    const error = v.trim() === "" ? "등록번호를 입력해 주세요." : undefined;
    return (
      <div className="flex w-80 flex-col gap-4">
        <FormField label="등록번호" description="중복확인을 눌러 사용할 수 있는지 확인합니다.">
          <InputGroup attached>
            <Input placeholder="등록번호" />
            <Button>중복확인</Button>
          </InputGroup>
        </FormField>
        <FormField label="등록번호" required error={error}>
          <InputGroup attached>
            <Input
              state={error ? "error" : "default"}
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="등록번호"
            />
            <Button>중복확인</Button>
          </InputGroup>
        </FormField>
      </div>
    );
  },
};
