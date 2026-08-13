import type { Meta, StoryObj } from "@storybook/react";

/* ------------------------------------------------------------------ 데이터 */

type Row = {
  /** Storybook 제목의 뒷부분. 링크를 만드는 데도 씁니다. */
  name: string;
  /** 무엇인가 — 한 줄 */
  what: string;
  /** 이것만 기억하면 되는 규칙 하나 */
  rule: string;
  /** Figma 에 대응물이 없는 코드 전용 완성형 */
  codeOnly?: string[];
};

type Group = {
  key: string;
  title: string;
  lead: string;
  rows: Row[];
};

const GROUPS: Group[] = [
  {
    key: "Foundation",
    title: "Foundation",
    lead: "컴포넌트보다 먼저 읽어야 하는 자료입니다. 색·글자·간격의 출처가 여기 있습니다.",
    rows: [
      {
        name: "Tokens",
        what: "Tailwind 색 · Primitive · Semantic 3계층 토큰",
        rule: "컴포넌트는 Semantic 만 참조합니다. Primitive 를 직접 쓰면 색 한 곳을 고쳐 전체가 따라오는 구조가 깨집니다",
      },
      {
        name: "Typography",
        what: "글자 크기 · 굵기 단계",
        rule: "크기가 아니라 굵기로 위계를 만듭니다. 업무 화면은 글자 크기가 자주 바뀌면 산만해집니다",
      },
      {
        name: "Layout & Grid",
        what: "화면 골격 · 여백 · 반응형 경계(1024px)",
        rule: "12칼럼 그리드를 쓰지 않습니다. 표의 열 너비는 데이터가 정하지 그리드가 정하지 않습니다",
      },
      {
        name: "Icon",
        what: "lucide 아이콘 201개",
        rule: "크기는 컴포넌트가 정합니다. 호출부에서 `size-4` 를 주면 컴포넌트 규칙을 덮어씁니다",
      },
    ],
  },
  {
    key: "Controls",
    title: "Controls — 입력",
    lead: "사용자가 값을 넣고 고르는 것들입니다. 높이가 모두 `--h-input-*` 이라 나란히 놓아도 맞습니다.",
    rows: [
      {
        name: "Button",
        what: "7가지 variant × 8가지 size",
        rule: "주 액션은 한 화면에 하나. 로딩은 비활성이 아닙니다 — 회색으로 변하면 취소된 것처럼 보입니다",
      },
      {
        name: "Input",
        what: "아이콘 · 단위 · 지우기가 붙는 한 줄 입력",
        rule: "폭을 고정하지 마세요. 부모가 폭을 정하게 두면 아이콘이 잘리지 않습니다",
      },
      { name: "InputGroup", what: "입력 여러 개를 한 덩어리로 묶습니다", rule: "테두리를 공유하므로 사이에 여백을 넣지 마세요" },
      { name: "Textarea", what: "여러 줄 입력", rule: "줄 수를 미리 정하지 말고 내용이 늘면 늘어나게 두세요" },
      {
        name: "Checkbox",
        what: "여러 개를 고르는 네모 칸",
        rule: "비활성의 표식은 흰색이 아니라 `Icon/Disabled-On` 입니다 — 회색 박스 위 흰 체크는 사라집니다",
      },
      { name: "Radio", what: "하나만 고르는 동그란 칸", rule: "선택지가 5개를 넘으면 Select 로 옮기세요" },
      { name: "Switch", what: "즉시 반영되는 켬 · 끔", rule: "저장 버튼을 눌러야 반영되는 값에는 쓰지 마세요 — Checkbox 입니다" },
      { name: "CheckMark", what: "읽기 전용 체크 표시", rule: "누를 수 없습니다. 누르는 것은 Checkbox 입니다" },
      { name: "ChoiceGroup", what: "Checkbox · Radio 를 줄로 묶습니다", rule: "가로 · 세로 배치만 정하고 항목 자체는 손대지 않습니다" },
      {
        name: "ToggleGroup",
        what: "하나만 켜지는 세그먼트 컨트롤",
        rule: "지울 수 있는 태그는 Chip 입니다. 배타 선택이면 이쪽",
      },
      {
        name: "Select",
        what: "값 하나 · 검색 없음. 목록도 토큰대로 그립니다",
        rule: "가르는 축은 값이 하나냐 배열이냐입니다 — 검색은 그 안의 옵션입니다",
        codeOnly: ["Select"],
      },
      {
        name: "Combobox",
        what: "값이 배열이거나 검색이 필요할 때",
        rule: "항목이 3~5개뿐이면 `searchable={false}` 로 끄세요 — 항목보다 검색창이 더 큽니다",
        codeOnly: ["Combobox"],
      },
      {
        name: "NativeSelect",
        what: "네이티브 `<select>` — 목록은 OS 가 그립니다",
        rule: "Figma 에 대응물이 없습니다. 목록 모양이 디자인과 달라도 되는 자리에만",
        codeOnly: ["NativeSelect"],
      },
      {
        name: "DatePicker",
        what: "단일 날짜 — 일 · 월 · 연 단위",
        rule: "**컨트롤 하나라 `FormField` 로 감쌉니다.** 입력창을 직접 칠 수 있고, 여덟 자리를 채우기 전에는 값이 바뀌지 않습니다",
      },
      {
        name: "DateRangePicker",
        what: "기간 — 두 달이 늘 이웃합니다 (`quickSelect` 면 칩까지)",
        rule: "**기간을 받는 자리에는 이걸 쓰세요.** `quickSelect` 로 칩까지 답니다 — 라벨은 `FormField` 가. 날짜 하나는 `DatePicker`",
      },
    ],
  },
  {
    key: "Form",
    title: "Form",
    lead: "컨트롤을 감싸 라벨 · 설명 · 에러를 붙입니다.",
    rows: [
      {
        name: "FormField",
        what: "라벨 + 컨트롤 + 설명 · 에러",
        rule: "에러가 나면 설명을 가립니다 — 한 번에 하나만 읽게 합니다. 래퍼에 `size` 는 없습니다",
      },
    ],
  },
  {
    key: "Display",
    title: "Display — 표시",
    lead: "값을 보여주기만 하는 것들입니다.",
    rows: [
      {
        name: "Accordion",
        what: "접이식 영역 (AccordionItem · Trigger · Content)",
        rule: "**항상 보여야 하면 `Card`, 공간을 아껴야 하면 여기**입니다. 접힌 내용은 잘 안 봅니다 — 자주 보는 항목은 펼쳐 두세요",
      },
      { name: "Avatar", what: "이니셜 · 사진 · 상태 점", rule: "이니셜은 한글 1자 · 영문 2자" },
      { name: "Badge", what: "상태를 알리는 작은 라벨", rule: "상태가 2종이면 점, 3종 이상이면 배지. 둘 다 켜지 마세요" },
      { name: "Card", what: "표면 하나로 묶는 상자 (CardRow 포함)", rule: "반경 8. 떠 있는 패널(6)보다 큽니다" },
      { name: "Chip", what: "지울 수 있는 태그", rule: "하나만 켜지는 배타 선택이면 ToggleGroup 입니다" },
    ],
  },
  {
    key: "Data",
    title: "Data — 표",
    lead: "조회 결과를 담는 자리입니다. 이 시스템에서 가장 많이 보는 화면입니다.",
    rows: [
      {
        name: "Table",
        what: "헤더 · 본문 · 툴바 · 정렬",
        rule: "헤더 행은 스크롤 영역 밖에. 정렬 화살표는 정렬할 수 있는 열에만 넘기세요",
      },
      {
        name: "Pagination",
        what: "페이지 이동 (PaginationItem 포함)",
        rule: "몇 번째 페이지를 보고 있었는지 기억해야 하면 페이지네이션, 한 화면에서 훑으면 스크롤",
      },
    ],
  },
  {
    key: "Feedback",
    title: "Feedback — 알림",
    lead: "무엇이 일어났는지 알리는 것들입니다. **답을 받을지 · 남을지**로 갈립니다. 보여줄 것이 없을 때는 `EmptyState`.",
    rows: [
      {
        name: "Alert",
        what: "화면에 남는 알림",
        rule: "실패는 Toast 만으로 두지 마세요 — 4초 뒤 사라지면 무엇이 잘못됐는지 알 방법이 없어집니다",
      },
      {
        name: "Dialog",
        what: "답을 받는 모달 (ConfirmDialog 포함)",
        rule: "사용자 행동을 막을 때만. 제목은 질문형이고 취소가 왼쪽, 주 액션이 오른쪽",
        codeOnly: ["ConfirmDialog"],
      },
      {
        name: "Toast",
        what: "잠깐 떴다 사라지는 결과 알림",
        rule: "동시에 3개까지 · 우하단. 색만으로 구분하지 말고 제목 문구로 결과를 씁니다",
      },
      {
        name: "EmptyState",
        what: "결과 없음 · 데이터 없음 · 오류",
        rule: "셋의 차이는 **다음에 무엇을 하느냐**입니다 — 조건을 바꾸거나 · 만들거나 · 다시 시도하거나. `no-data` 만 Primary",
      },
      {
        name: "Loading & Divider",
        what: "Skeleton · Spinner · Progress · Separator",
        rule: "무엇이 올지 아는 자리는 Skeleton, 모르면 Spinner",
      },
    ],
  },
  {
    key: "Overlay",
    title: "Overlay — 떠 있는 것",
    lead: "완성형(`Select` · `Combobox` · `Lookup`)을 만드는 조립 부품입니다. 반경은 전부 `Radius/md`(6).",
    rows: [
      {
        name: "Popover",
        what: "기준 요소에 붙어 뜨는 패널",
        rule: "위치와 충돌 회피는 Radix 가 정합니다. Placement 는 희망일 뿐 화면 끝에서 뒤집힙니다",
      },
      {
        name: "DropdownMenu",
        what: "행 액션 · 더보기 메뉴",
        rule: "**값을 고르면 `Combobox`, 동작을 실행하면 여기**입니다 — 선택 표식이 없습니다. 삭제는 마지막에 두고 구분선으로 떼어 놓으세요",
      },
      {
        name: "ListItem",
        what: "목록 한 줄 — 선택 표식 · 검색어 강조",
        rule: "선택을 배경으로 알리지 않습니다. 배경 하나가 hover · 커서 · 선택 세 가지를 뜻하기 때문",
      },
      {
        name: "Lookup",
        what: "열이 여러 개인 드롭다운 (LookupPanel · LookupRow 포함)",
        rule: "가르는 축은 **한 줄에 무엇이 들어가느냐**입니다 — 이름만으로 판단되면 `Combobox`. 열은 4개까지",
        codeOnly: ["Lookup"],
      },
      {
        name: "Tooltip",
        what: "마우스를 올리면 뜨는 한 줄 라벨",
        rule: "터치 기기에는 hover 가 없습니다 — 툴팁에만 있는 정보를 두지 마세요",
      },
    ],
  },
  {
    key: "Navigation",
    title: "Navigation — 이동",
    lead: "PC 껍데기입니다. `Sidebar` + MDI 탭바로 화면 구조가 완성됩니다.",
    rows: [
      {
        name: "Sidebar",
        what: "좌측 GNB — 펼침 256 · 접힘 72 (SidebarGroup 포함)",
        rule: "접히면 하위 없는 항목은 **툴팁**, 하위 있는 항목은 **서브메뉴**입니다 — 툴팁은 이동시키지 못합니다",
      },
      {
        name: "SidebarItem",
        what: "메뉴 항목 — 1 · 2단계",
        rule: "1단계 Active 는 “현재 페이지가 속한 묶음”, 2단계는 “현재 페이지”. 인디케이터는 2단계에만",
      },
      {
        name: "Tabs",
        what: "line · pill · pill-primary (TabItem · TabPanel 포함)",
        rule: "`closable` 은 문서 탭(MDI) 전용입니다. 고정 탭에 달면 돌아올 수 없는 탭을 닫게 됩니다",
        codeOnly: ["TabPanel"],
      },
    ],
  },
  {
    key: "Layouts",
    title: "Layouts — 화면 골격",
    lead: "부품이 아니라 **자리를 정하는** 것들입니다. PC·모바일이 한 벌입니다.",
    rows: [
      {
        name: "FilterBar",
        what: "조회 조건 — 조회하면 접힙니다 (FilterRow 포함)",
        rule: "**컨테이너 쿼리**로 자기 폭을 재서 배치를 정합니다 — 창이 아니라. 조건은 4개까지",
      },
    ],
  },
  {
    key: "Mobile",
    title: "Mobile — 모바일 전용",
    lead: "**구조를 다시 짜야 하는** 것들입니다. 높이만 바뀌면 되는 것(Input · Button 등)은 여기 없고, `MobileSelect` · `MobileDateRangePicker` 는 **시트 쪽 구현**이라 직접 부를 자리가 없습니다.",
    rows: [
      {
        name: "MobileTop",
        what: "상단 바 58 — logo · back · title",
        rule: "액션은 2개까지. 아이콘은 24 지만 누르는 곳은 44 입니다",
      },
      {
        name: "MBottomTabBar",
        what: "하단 탭바 — PC Sidebar 자리",
        rule: "마지막 자리는 홈이 아니라 전체메뉴. 열어도 활성 탭은 그대로입니다",
      },
      {
        name: "MobileMenuScreen",
        what: "전체메뉴 — PC 와 같은 SidebarItem",
        rule: "시트가 아니라 전체 화면입니다. 오른쪽에서 밀려 들어옵니다",
      },
      {
        name: "MobileSheet",
        what: "아래에서 올라오는 시트",
        rule: "Scrim 이 안에 들어 있습니다. 시트를 두 개 겹치지 마세요",
      },
      {
        name: "MobileSelect",
        what: "목록 선택 — PC 와 같은 ComboboxPanel",
        rule: "**보통은 `Select` · `Combobox` 를 쓰세요** — 터치 기기에서는 이게 알아서 뜹니다. 목록은 PC 와 같은 `ComboboxPanel` 입니다",
      },
      {
        name: "MobileDateRangePicker",
        what: "기간 입력 — 한 달 달력",
        rule: "**보통은 `DateRangePicker` 를 쓰세요** — 터치 기기에서는 이게 알아서 뜹니다. 범위 규칙은 PC 와 같은 훅",
      },
      {
        name: "MobileListHeader",
        what: "카드 목록 위 한 줄 — 제목 · 건수 · 필터",
        rule: "카드 목록에는 표 헤더가 없습니다. **무엇의 목록인지 · 몇 건인지 · 어떻게 고를지**를 이 줄이 대신합니다",
      },
      {
        name: "MobileListCard",
        what: "표 한 행을 카드 하나로",
        rule: "내용이 아니라 자리만 정합니다. 값은 2개까지 — 타입이 막습니다",
      },
    ],
  },
];

/** Storybook 이 제목을 URL 로 바꾸는 방식과 같게 만듭니다. */
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * 문서 페이지는 **`iframe.html` 안에서** 렌더됩니다. 그래서 `?path=...` 같은 상대 주소는
 * 매니저가 아니라 **iframe 기준**으로 풀려서 아무 데도 가지 않습니다 —
 * `target="_top"` 은 어느 창을 바꿀지만 정할 뿐 주소 계산에는 관여하지 않습니다.
 *
 * 지금 주소에서 `iframe.html` 만 떼어 매니저 주소를 직접 만듭니다.
 * 하위 경로에 올려도(`/storybook/iframe.html`) 그대로 동작합니다.
 */
function docsHref(group: string, name: string) {
  const id = `${slug(group)}-${slug(name)}--docs`;
  if (typeof window === "undefined") return `?path=/docs/${id}`;
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/iframe\.html$/, "");
  url.search = "";
  url.hash = "";
  return `${url.toString()}?path=/docs/${id}`;
}

const TOTAL = GROUPS.reduce((n, g) => n + g.rows.length, 0);

/* ------------------------------------------------------------------ 화면 */

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border-gray-light bg-background-white px-4 py-3">
      <span className="text-xl font-bold text-text-primary">{n}</span>
      <span className="text-xs text-text-subtle">{label}</span>
    </div>
  );
}

function Catalog() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-basic">ACK UI — 컴포넌트 목록</h1>
          <p className="mt-1.5 text-sm text-text-subtle">
            ACK 결과조회 시스템의 디자인 시스템입니다. Figma 라이브러리를 코드로 옮긴 것이고,
            각 줄의 이름을 누르면 그 컴포넌트 문서로 갑니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Stat n={String(TOTAL)} label="문서 페이지" />
          <Stat n={String(GROUPS.length)} label="그룹" />
          <Stat n="317" label="Semantic 토큰" />
          <Stat n="1024px" label="PC · 모바일 경계" />
        </div>

        <div className="rounded-lg border border-border-gray-light bg-surface-gray-subtler p-4 text-sm text-text-subtle">
          <p className="mb-2 font-medium text-text-basic">읽는 순서</p>
          <p>
            <strong className="text-text-basic">Foundation</strong> 을 먼저 보세요 — 나머지 전부가
            그 토큰 위에 서 있습니다. 그다음은 만들려는 화면에 맞춰 고르면 됩니다:{" "}
            <strong className="text-text-basic">조회 화면</strong>이면 Controls → Form → Data,{" "}
            <strong className="text-text-basic">껍데기</strong>면 Navigation, 모바일이면 Mobile.
          </p>
          <p className="mt-2">
            <strong className="text-text-basic">Example</strong> 에는 이것들이 실제 화면에서
            어떻게 만나는지가 있습니다 — 목록에서 행을 눌러 상세로 가는 흐름 전체입니다.
          </p>
        </div>
      </header>

      {GROUPS.map((g) => (
        <section key={g.key} className="flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-text-basic">
              {g.title}
              <span className="ml-2 text-xs font-normal text-text-muted-foreground">
                {g.rows.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-text-subtle">{g.lead}</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-table-border">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-table-header-surface">
                  <th className="w-48 px-4 py-2.5 text-sm font-semibold text-table-header-text">
                    컴포넌트
                  </th>
                  <th className="w-72 px-4 py-2.5 text-sm font-semibold text-table-header-text">
                    무엇인가
                  </th>
                  <th className="px-4 py-2.5 text-sm font-semibold text-table-header-text">
                    기억할 규칙 하나
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr
                    key={r.name}
                    className="border-t border-table-border bg-background-white align-top hover:bg-table-row-hover"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={docsHref(g.key, r.name)}
                        target="_top"
                        className="text-sm font-medium text-text-primary underline underline-offset-2"
                      >
                        {r.name}
                      </a>
                      {r.codeOnly && (
                        <span className="mt-1 block text-2xs text-text-muted-foreground">
                          코드 전용 — {r.codeOnly.join(" · ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-basic">{r.what}</td>
                    <td className="px-4 py-3 text-sm text-text-subtle">{r.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <footer className="rounded-lg border border-border-gray-light bg-surface-gray-subtler p-4 text-sm text-text-subtle">
        <p className="mb-2 font-medium text-text-basic">“코드 전용” 이란</p>
        <p>
          Figma 에 대응물이 없는 <strong className="text-text-basic">완성형</strong>입니다. Figma 는
          껍데기(<code>SelectTrigger</code> · <code>ComboboxPanel</code> · <code>Popover</code> ·{" "}
          <code>ListItem</code>)까지 그리고, 그것들을 묶어 상태·키보드·검색까지 담은 것은 코드에만
          있습니다. 이름이 겹치지 않게 Figma 쪽을 고친 적도 있습니다 —{" "}
          <code>Select</code> → <code>SelectTrigger</code>.
        </p>
      </footer>
    </div>
  );
}

/**
 * 지금까지 옮긴 컴포넌트를 한 장에 모았습니다.
 *
 * 각 줄은 **무엇인가**와 **기억할 규칙 하나**입니다 — 자세한 근거는 컴포넌트 문서에 있습니다.
 * 이름을 누르면 그 문서로 갑니다.
 */
const meta = {
  title: "Overview/컴포넌트 목록",
  parameters: {
    layout: "fullscreen",
    // 이 페이지는 표가 전부라 Controls·Actions 패널이 비어 있습니다
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 목록: Story = {
  name: "전체",
  render: () => (
    <div className="min-h-screen bg-surface-gray-subtler p-6">
      <Catalog />
    </div>
  ),
};
