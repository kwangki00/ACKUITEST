import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Bell, Clipboard, FileText } from "lucide-react";
import { MBottomTabBar, ACK_TABS } from "@/components/ui/m-bottom-tab-bar";
import { MobileListCard } from "@/components/ui/mobile-list-card";
import { MobileFilterBar } from "@/components/ui/mobile-filter-bar";
import { MobileDateField } from "@/components/ui/mobile-date-field";
import { Badge } from "@/components/ui/badge";
import type { DateRange } from "@/components/ui/calendar";
import { addDays, formatDate, startOfDay } from "@/lib/date";
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
      {children(el)}
    </div>
  );
}

const today = startOfDay(new Date());

const ROWS = [
  { chart: "2312345", name: "김진영", test: "White Blood Cell (WBC)", value: "6.5 10³/μL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312346", name: "이수정", test: "Hemoglobin", value: "13.2 g/dL", date: "2025-06-05", status: "완료", tone: "success" },
  { chart: "2312347", name: "박상철", test: "Fasting Glucose", value: "142 mg/dL", date: "2025-06-04", status: "재검", tone: "danger" },
  { chart: "2312348", name: "최민영", test: "Total Cholesterol", value: "188 mg/dL", date: "2025-06-04", status: "완료", tone: "success" },
  { chart: "2312349", name: "정혜진", test: "C-Reactive Protein", value: "0.8 mg/L", date: "—", status: "진행중", tone: "warning" },
] as const;

const MENU = [
  {
    group: "조회",
    items: ["결과조회", "검사이력", "미보고 결과", "패널 조회"],
  },
  {
    group: "통계",
    items: ["기간별 통계", "검사별 통계", "의뢰기관별 통계"],
  },
  { group: "발송", items: ["SMS 발송", "발송 이력"] },
  { group: "설정", items: ["내 정보", "알림 설정"] },
];

/**
 * Figma: MBottomTabBar (5 변형 — 메뉴선택)
 *
 * 모바일 하단 탭바입니다. **PC 의 `Sidebar` 자리를 대신합니다.**
 *
 * ### 마지막 자리는 홈이 아니라 전체메뉴
 *
 * 소비자용 앱은 마지막을 홈·마이페이지로 두지만 **이 시스템은 직원용**입니다.
 * 돌아갈 홈이 따로 없고, 자주 쓰는 넷 말고도 들어갈 메뉴가 계속 생깁니다.
 *
 * 전체메뉴는 **PC 와 같은 메뉴 구조**를 띄웁니다 — PC 로 익힌 위치를 다시 배우지 않아도 됩니다.
 *
 * ### 전체메뉴를 열어도 활성 탭은 그대로
 *
 * 여는 동안만 마지막 자리에 불이 들어오고, 닫으면 원래 탭으로 돌아옵니다.
 * **메뉴에서 다른 화면으로 이동해야** 탭이 바뀝니다 — 열었다 닫은 것은 화면 이동이 아니라서
 * 그때 탭이 옮겨 가면 어디에 있었는지를 잃습니다. `전체메뉴` 스토리에서 확인해 보세요.
 *
 * ### 탭은 5개까지 (전체메뉴 포함)
 *
 * 390 폭에서 5개면 한 칸이 78 이고, 여섯 개가 되면 10px 라벨이 잘립니다.
 * **`items` 는 4개까지만 받습니다** — 다섯 번째를 넣으면 컴파일이 안 됩니다.
 *
 * ### PC 와 짝
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 메뉴 | `Sidebar` 256 (접으면 72) | **MBottomTabBar 5칸** |
 * | 나머지 메뉴 | 사이드바 안에 다 있음 | **전체메뉴 → 오버레이** |
 * | 화면 전환 | MDI 탭바 (여러 개 동시에) | **한 번에 한 화면** |
 */
const meta = {
  title: "Mobile/MBottomTabBar",
  component: MBottomTabBar,
  parameters: { layout: "centered", ...design(figma.mBottomTabBar) },
  argTypes: {
    menuOpen: { control: "boolean" },
    homeIndicator: { control: "boolean" },
    menuLabel: { control: "text" },
    items: { control: false },
    onValueChange: { control: false },
    onMenuOpen: { control: false },
  },
  args: { value: "results", onValueChange: () => {} },
} satisfies Meta<typeof MBottomTabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 탭을 눌러 보세요. 활성은 **색과 굵기 두 가지**로 바뀝니다 — 색만으로는 색각 이상에서 안 보입니다. */
export const 기본: Story = {
  render: function Basic(args) {
    const [tab, setTab] = useState("results");
    return (
      <div className="ack-mobile w-[390px] rounded-2xl border border-border-gray-light">
        <MBottomTabBar {...args} value={tab} onValueChange={setTab} homeIndicator />
      </div>
    );
  },
};

/**
 * Figma 의 5개 변형입니다. 마지막이 `메뉴선택=전체메뉴` —
 * **메뉴가 열려 있는 동안의 모습**이지 여섯 번째 화면이 아닙니다.
 */
export const 변형: Story = {
  name: "변형 5종",
  parameters: { layout: "padded" },
  render: () => (
    <div className="ack-mobile flex flex-col gap-4">
      {ACK_TABS.map((t) => (
        <div key={t.value}>
          <p className="mb-1 text-xs text-text-subtle">메뉴선택={t.label}</p>
          <div className="w-[390px] rounded-2xl border border-border-gray-light">
            <MBottomTabBar value={t.value} onValueChange={() => {}} homeIndicator />
          </div>
        </div>
      ))}
      <div>
        <p className="mb-1 text-xs text-text-subtle">메뉴선택=전체메뉴 (메뉴가 열린 동안)</p>
        <div className="w-[390px] rounded-2xl border border-border-gray-light">
          <MBottomTabBar value="results" onValueChange={() => {}} menuOpen homeIndicator />
        </div>
      </div>
    </div>
  ),
};

/**
 * **전체메뉴를 눌러 열고, 그냥 닫아 보세요** — 활성 탭이 결과조회 그대로입니다.
 * 메뉴 안의 항목을 골라야 탭이 옮겨 갑니다.
 *
 * 메뉴는 시트가 아니라 **전체 화면**입니다 — 뒤를 보면서 고르는 것이 아니라
 * 다른 화면으로 떠나는 동작이기 때문입니다.
 */
export const 전체메뉴: Story = {
  render: function FullMenu() {
    const [tab, setTab] = useState("results");
    const [menu, setMenu] = useState(false);
    const label = ACK_TABS.find((t) => t.value === tab)?.label ?? "";

    return (
      <Phone>
        {() => (
          <div className="flex h-full flex-col">
            {menu ? (
              <div className="flex-1 overflow-y-auto bg-background-white">
                <div className="flex items-center justify-between border-b border-border-gray-light px-4 py-3.5">
                  <span className="text-base font-semibold text-text-basic">전체메뉴</span>
                  <button
                    type="button"
                    className="text-sm text-text-subtle"
                    onClick={() => setMenu(false)}
                  >
                    닫기
                  </button>
                </div>
                {MENU.map((g) => (
                  <div key={g.group}>
                    <p className="bg-surface-gray-subtle px-4 py-2 text-xs text-text-subtle">
                      {g.group}
                    </p>
                    {g.items.map((it) => (
                      <button
                        key={it}
                        type="button"
                        // 메뉴에서 화면을 고르면 그때 탭이 옮겨 갑니다
                        onClick={() => {
                          const hit = ACK_TABS.find((t) => t.label === it);
                          if (hit) setTab(hit.value);
                          setMenu(false);
                        }}
                        className="flex w-full items-center border-b border-divider-gray-light px-4 py-3.5 text-left text-sm text-text-basic active:bg-table-row-hover"
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-lg font-semibold text-text-basic">{label}</p>
                <p className="text-xs text-text-subtle">
                  전체메뉴를 열었다 닫아도 이 화면은 그대로입니다
                </p>
              </div>
            )}

            <MBottomTabBar
              value={tab}
              onValueChange={(v) => {
                setTab(v);
                setMenu(false);
              }}
              // 열려 있는 동안만 불이 전체메뉴로 옮겨 갑니다 — tab 은 그대로입니다
              menuOpen={menu}
              onMenuOpen={() => setMenu(!menu)}
              homeIndicator
            />
          </div>
        )}
      </Phone>
    );
  },
};

/**
 * 탭을 셋만 두면 칸이 넓어집니다. **`items` 는 4개까지** —
 * 전체메뉴가 마지막 자리를 늘 차지하므로 합쳐서 5개입니다.
 */
export const 탭3개: Story = {
  name: "탭 3개",
  render: function Three() {
    const [tab, setTab] = useState("results");
    return (
      <div className="ack-mobile w-[390px] rounded-2xl border border-border-gray-light">
        <MBottomTabBar
          items={[
            { value: "results", label: "결과조회", icon: <Clipboard /> },
            { value: "history", label: "검사이력", icon: <FileText /> },
            { value: "notice", label: "알림", icon: <Bell /> },
          ]}
          value={tab}
          onValueChange={setTab}
          homeIndicator
        />
      </div>
    );
  },
};

/**
 * 오늘까지 만든 모바일 컴포넌트가 **한 화면에 다 모인 모습**입니다 —
 * `MBottomTabBar` + `MobileFilterBar` + `MobileDateField` + `MobileListCard`.
 *
 * 탭바는 **스크롤 영역 밖**에 있습니다. 안에 넣으면 목록과 함께 밀려 올라갑니다.
 */
export const 조회화면: Story = {
  name: "조회 화면 (전체 조립)",
  render: function FullScreen() {
    const [tab, setTab] = useState("results");
    const [period, setPeriod] = useState<DateRange>({ start: addDays(today, -6), end: today });

    const summary =
      period.start && period.end
        ? `${formatDate(period.start)} ~ ${formatDate(period.end)} · 전체`
        : "기간을 선택해 주세요";

    return (
      <Phone>
        {(el) => (
          <div className="flex h-full flex-col">
            <div className="border-b border-border-gray-light bg-background-white px-4 py-3">
              <span className="text-base font-semibold text-text-basic">
                {ACK_TABS.find((t) => t.value === tab)?.label}
              </span>
            </div>

            {tab === "results" ? (
              <>
                <MobileFilterBar defaultOpen={false} summary={summary} count={ROWS.length}>
                  <MobileDateField
                    container={el}
                    label="기간"
                    value={period}
                    onValueChange={setPeriod}
                  />
                </MobileFilterBar>

                {/* 탭바는 이 스크롤 영역 밖입니다 */}
                <div className="flex-1 overflow-y-auto">
                  {ROWS.map((r) => (
                    <MobileListCard
                      key={r.chart}
                      title={r.name}
                      meta={`차트 ${r.chart} · ${r.test}`}
                      badge={
                        <Badge tone={r.tone} size="sm">
                          {r.status}
                        </Badge>
                      }
                      values={[
                        { label: "결과", value: r.value },
                        { label: "보고일", value: r.date },
                      ]}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-text-subtle">
                {ACK_TABS.find((t) => t.value === tab)?.label} 화면
              </div>
            )}

            <MBottomTabBar value={tab} onValueChange={setTab} homeIndicator />
          </div>
        )}
      </Phone>
    );
  },
};
