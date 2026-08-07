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
  mobileDateField: node("772:12288"),
  mobileCalendar: node("780:4474"),
  mobileFilterBar: node("831:699"),
  mobileListCard: node("807:440"),
  mBottomTabBar: node("226:1916"),
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
  chip: node("482:3473"),
  avatar: node("648:208"),
  formField: node("436:2650"),
  card: node("661:59"),
  cardRow: node("660:29"),
  alert: node("716:275"),
  skeleton: node("718:33"),
  spinner: node("729:47"),
  progress: node("728:44"),
  separator: node("728:31"),
  tableCell: node("604:46"),
  pagination: node("625:548"),
  paginationItem: node("624:6740"),
  tableToolbar: node("617:295"),
} as const;

/** 스토리 parameters 에 붙이는 헬퍼 */
export const design = (url: string) => ({ design: { type: "figma" as const, url } });
