/**
 * Figma 라이브러리 링크
 * 각 스토리의 Design 탭에서 실물 컴포넌트를 대조할 수 있습니다.
 */
const FILE = "cbV1vpZGUrpJhD1gro6j2m";

const node = (id: string) =>
  `https://www.figma.com/design/${FILE}/SCL_DesignSystem?node-id=${id.replace(":", "-")}`;

export const figma = {
  button: node("383:2073"),
  input: node("431:2985"),
  inputGroup: node("439:3090"),
  textarea: node("473:2669"),
  selectTrigger: node("483:4085"),
  checkbox: node("488:3902"),
  radio: node("488:3945"),
  checkMark: node("497:3949"),
  choiceGroup: node("534:173"),
  switch: node("562:363"),
  toggleItem: node("585:400"),
  toggleGroup: node("586:448"),
  badge: node("555:104"),
  popover: node("499:36"),
  listItem: node("515:47"),
  tooltip: node("643:243"),
  dialog: node("652:53"),
  toast: node("652:7057"),
  mobileSheet: node("773:3976"),
  mobileSelectContent: node("810:13673"),
  pcDateRangeField: node("885:16749"),
  mobileDateRangeField: node("772:12288"),
  mobileCalendar: node("780:4474"),
  mobileFilterBar: node("831:699"),
  mobileListCard: node("807:440"),
  mobileListHeader: node("844:1340"),
  mBottomTabBar: node("226:1916"),
  pcFilterBar: node("880:2896"),
  mobileTop: node("267:2014"),
  mobileMenuContent: node("832:699"),
  mobileMenuScreen: node("833:865"),
  sidebarItem: node("635:554"),
  sidebar: node("637:645"),
  tabs: node("571:59"),
  tabItem: node("570:23"),
  datePickerPanel: node("692:552"),
  calendarCell: node("689:63"),
  calendarMonth: node("700:2697"),
  comboboxPanel: node("677:7764"),
  lookupPanel: node("672:243"),
  lookupRow: node("671:268"),
  chip: node("482:3473"),
  avatar: node("648:208"),
  formField: node("436:2650"),
  card: node("661:59"),
  cardRow: node("660:29"),
  alert: node("716:275"),
  emptyState: node("904:391"),
  skeleton: node("718:33"),
  spinner: node("729:47"),
  progress: node("728:44"),
  separator: node("728:31"),
  tableCell: node("604:46"),
  pagination: node("625:548"),
  paginationItem: node("624:6740"),
  tableToolbar: node("617:295"),
  dropdownMenu: node("717:650"),
} as const;

/** 스토리 parameters 에 붙이는 헬퍼 */
export const design = (url: string) => ({ design: { type: "figma" as const, url } });

/**
 * `render` 없이 **args 만으로** 그리는 스토리에 답니다.
 *
 * 전역 기본은 `source.type: "code"` — 스토리 파일에 적힌 **원문 그대로**를 보여줍니다.
 * 스토리 48개 중 대부분이 `render` 함수라 그게 맞습니다. `dynamic` 으로 두면 그려진
 * 결과를 되돌려 쓰는데, `render: function Basic(args)` 처럼 이름 붙은 컴포넌트는
 * `<Basic />` 한 줄로 접혀서 **아무 정보가 없습니다.**
 *
 * 반대로 args 만 있는 스토리는 원문이 `{}` 라 `code` 로는 **빈칸이 나옵니다.**
 * 그 몇 개만 `dynamic` 으로 되돌립니다 — 그려진 결과가 곧 예제 코드입니다.
 */
export const argsSource = { docs: { source: { type: "dynamic" as const } } };

/* ---------------------------------------------------------------- Controls */

/**
 * Controls 패널의 묶음 — **prop 이름으로 자동 분류**합니다.
 *
 * `Lookup` 12 · `DateRangePicker` 11 처럼 축이 많은 컴포넌트는 한 줄로 늘어놓으면
 * 무엇부터 만져야 할지 안 보입니다. `Input` 처럼 HTML 속성을 상속하는 것은
 * 자동 생성분까지 붙어 더 깁니다.
 *
 * **스토리마다 `table.category` 를 적지 않습니다.** 40개 파일에 흩어 놓으면 새 prop 이
 * 늘 때마다 빠지고, 같은 이름이 파일마다 다른 묶음에 들어갑니다. 규칙을 여기 두고
 * `preview.tsx` 의 `argTypesEnhancers` 가 **모든 스토리에 한 번에** 붙입니다.
 *
 * | 묶음 | 무엇 |
 * |---|---|
 * | `Display` | 모양을 정하는 축 — `variant` · `size` · `shape` · `tone` · `render` |
 * | `Content` | 화면에 나오는 글자 — `label` · `placeholder` · `description` |
 * | `State` | 지금 값과 상태 — `value` · `state` · `disabled` · `error` |
 * | `Behavior` | 어떻게 굴러가는지 — `open` · `searchable` · `clearable` |
 * | `Events` | `on*` 전부 |
 *
 * 어디에도 안 걸리는 것(`className` · `container` · `aria-*`)은 **묶지 않습니다** —
 * 묶음 밖에 남아 오히려 눈에 띕니다. 규칙에서 벗어나야 하는 자리가 있으면 그 스토리의
 * 해당 항목에만 `table: { category }` 를 직접 적으세요 — 직접 준 것이 이깁니다.
 */
const CATEGORY: [RegExp, string][] = [
  [/^on[A-Z]/, "Events"],
  [
    /^(variant|styleVariant|size|shape|tone|render|precision|align|direction|side|placement|type|level|dot|homeIndicator|header|counter|attached|withToolbar)$/,
    "Display",
  ],
  [
    /^(label|title|placeholder|description|emptyText|searchPlaceholder|children|logo|icon|leadingIcon|trailingIcon|actions|unit|count|summary|caption|resetLabel|searchLabel|changeLabel|confirmLabel|cancelLabel|note)$/,
    "Content",
  ],
  [
    /^(value|defaultValue|selected|checked|options|rows|columns|user|state|disabled|readOnly|required|error|loading|active|indeterminate|collapsed|expanded|min|max|maxLength)$/,
    "State",
  ],
  [
    /^(open|defaultOpen|searchable|clearable|selectAll|closable|scrollable|quickSelect|overlay|presets|displayColumns|display|maxChips|panelWidth|monthsVisible|chevron|tooltip|getRowId)$/,
    "Behavior",
  ],
];

/** prop 이름이 속한 묶음. 어디에도 안 걸리면 `undefined` — 묶지 않습니다. */
export const argCategory = (name: string): string | undefined =>
  CATEGORY.find(([re]) => re.test(name))?.[1];
