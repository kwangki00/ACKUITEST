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
  select: node("483:4085"),
  checkbox: node("488:3902"),
  badge: node("555:104"),
  formField: node("436:2650"),
  tableCell: node("604:46"),
  tableToolbar: node("617:295"),
} as const;

/** 스토리 parameters 에 붙이는 헬퍼 */
export const design = (url: string) => ({ design: { type: "figma" as const, url } });
