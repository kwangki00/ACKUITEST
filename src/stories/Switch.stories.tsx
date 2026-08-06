import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { design, figma } from "./figma";

/**
 * Figma: Switch — 8 변형 (Size 2 × Checked 2 × State 2)
 *
 * 누르는 순간 적용되는 설정에 씁니다. 저장 버튼이 필요한 값이면 Checkbox 입니다.
 * 상태를 알리는 주된 신호는 썸 위치이고 색은 보조입니다.
 */
const meta = {
  title: "Controls/Switch",
  component: Switch,
  parameters: { ...design(figma.switch) },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { label: "알림 받기", size: "default" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  render: function Basic(args) {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={(e) => setOn(e.target.checked)} />;
  },
};

/** Figma 8변형 전부. */
export const 상태: Story = {
  parameters: { layout: "padded", ...design(figma.switch) },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "sm"] as const).map((s) => (
        <section key={s} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-basic">Size = {s}</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Switch size={s} label="꺼짐" />
            <Switch size={s} label="켜짐" defaultChecked />
            <Switch size={s} label="비활성 · 꺼짐" disabled />
            <Switch size={s} label="비활성 · 켜짐" disabled defaultChecked />
          </div>
        </section>
      ))}
      <p className="text-xs text-text-muted-foreground">
        비활성은 켜짐·꺼짐 모두 같은 회색입니다 — 지금 값보다 &quot;못 바꾼다&quot;는 사실이
        먼저 읽혀야 합니다. 값은 썸 위치로 계속 알 수 있습니다.
      </p>
    </div>
  ),
};

/** 트랙 크기와 이동 거리입니다. 안쪽 여백 2 는 두 사이즈 공통. */
export const 규격: Story = {
  parameters: { layout: "padded", ...design(figma.switch) },
  render: () => (
    <table className="border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-table-border-strong">
          {["Size", "트랙", "썸", "이동", "라벨", ""].map((h) => (
            <th key={h} className="p-2 font-semibold text-table-header-text">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-text-basic">
        {[
          { s: "sm" as const, track: "32 × 18", thumb: "14", move: "14", label: "12" },
          { s: "default" as const, track: "36 × 20", thumb: "16", move: "16", label: "14" },
        ].map((r) => (
          <tr key={r.s} className="border-b border-table-border">
            <td className="p-2 font-medium">{r.s}</td>
            <td className="p-2">{r.track}</td>
            <td className="p-2">{r.thumb}</td>
            <td className="p-2">{r.move}</td>
            <td className="p-2">{r.label}</td>
            <td className="p-2">
              <Switch size={r.s} defaultChecked />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/**
 * Switch 와 Checkbox 는 생김새가 아니라 **적용 시점**으로 갈립니다.
 * 저장 버튼이 있는 화면에 Switch 를 두면, 사용자는 이미 적용된 줄 알고 나갑니다.
 */
export const Checkbox와의차이: Story = {
  parameters: { layout: "padded", ...design(figma.switch) },
  render: function Compare() {
    const [pushed, setPushed] = useState(true);
    const [agree, setAgree] = useState(false);
    return (
      <div className="flex max-w-md flex-col gap-8">
        <section className="flex flex-col gap-2 rounded-lg border border-card-border bg-card-surface p-4">
          <p className="text-xs font-medium text-text-success">Switch — 즉시 적용</p>
          <Switch
            label="결과 도착 시 알림 받기"
            checked={pushed}
            onChange={(e) => setPushed(e.target.checked)}
          />
          <p className="text-2xs text-text-subtle">
            누르는 순간 서버에 반영됩니다. 저장 버튼이 없습니다.
          </p>
        </section>

        <section className="flex flex-col gap-2 rounded-lg border border-card-border bg-card-surface p-4">
          <p className="text-xs font-medium text-text-success">Checkbox — 제출해야 반영</p>
          <Checkbox
            label="개인정보 수집·이용에 동의합니다"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <div className="mt-1 flex justify-end">
            <Button size="sm" disabled={!agree}>
              신청
            </Button>
          </div>
          <p className="text-2xs text-text-subtle">버튼을 눌러야 값이 넘어갑니다.</p>
        </section>
      </div>
    );
  },
};

/** 설정 목록에서의 모습입니다. 라벨을 왼쪽에 두고 스위치를 오른쪽 끝에 붙입니다. */
export const 설정목록: Story = {
  parameters: { layout: "padded", ...design(figma.switch) },
  render: function Settings() {
    const [v, setV] = useState<Record<string, boolean>>({
      result: true,
      abnormal: true,
      notice: false,
    });
    const ITEMS = [
      { k: "result", label: "결과 도착 알림", desc: "검사 결과가 등록되면 알립니다." },
      { k: "abnormal", label: "이상 수치 알림", desc: "참고치를 벗어난 항목만 알립니다." },
      { k: "notice", label: "공지사항 알림", desc: "점검·변경 안내를 받습니다." },
    ];
    return (
      <div className="w-96 divide-y divide-divider-gray-light overflow-hidden rounded-lg border border-card-border bg-card-surface">
        {ITEMS.map((it) => (
          <label
            key={it.k}
            className="flex cursor-pointer items-center justify-between gap-4 p-4"
          >
            <span className="min-w-0">
              <span className="block text-sm text-text-basic">{it.label}</span>
              <span className="block text-xs text-text-muted-foreground">{it.desc}</span>
            </span>
            <Switch
              checked={v[it.k]}
              onChange={(e) => setV({ ...v, [it.k]: e.target.checked })}
              aria-label={it.label}
            />
          </label>
        ))}
      </div>
    );
  },
};
