/**
 * 레이아웃1 이 쓰는 자료입니다. **API 로 갈아끼울 자리**라 화면과 떼어 두었습니다 —
 * `result-lookup/data.ts` 와 같은 규칙입니다.
 *
 * 값은 레이아웃을 보기 위한 자리채움입니다. 다만 **열의 성격은 실제와 같게** 두었습니다 —
 * 날짜 · 번호 · 이름 · 수량 · 상태처럼 정렬되는 축과 안 되는 축이 섞여 있어야
 * 표가 실제로 어떻게 보이는지 알 수 있습니다.
 *
 * 타입 이름이 `Record` 가 아닌 이유 — **TypeScript 내장 `Record<K, V>` 와 겹칩니다.**
 * 겹치면 이 파일 안에서는 내장 쪽을 쓸 수 없게 되는데, 화면 코드가 흔히 씁니다.
 */

export interface TestOrder {
  id: string;
  date: string;
  receipt: string;
  name: string;
  chart: string;
  test: string;
  owner: string;
  count: number;
  state: "완료" | "진행중" | "보류";
  doneAt: string;
}

/** 상태가 3종이라 배지입니다 — 「2종이면 점, 3종 이상이면 배지」 규칙. */
export const STATE_TONE: Record<TestOrder["state"], "success" | "warning" | "neutral"> = {
  완료: "success",
  진행중: "warning",
  보류: "neutral",
};

const NAMES = [
  "김진영", "이수정", "박상철", "최민영", "정혜진", "한지수",
  "오영준", "윤지혜", "강태우", "조은서", "임소연", "서주혁",
  "김민준", "노현주", "배성우", "문예린", "신동호", "황보라",
  "장서준", "고은비", "류정민", "심하늘", "안도현", "탁지원",
];

const TESTS = ["일반혈액검사", "생화학검사", "소변검사", "면역검사", "미생물검사"];
const OWNERS = ["김검사", "이검사", "박검사", "최검사"];
const STATES: TestOrder["state"][] = ["완료", "진행중", "보류"];

/**
 * 24건입니다. **한 쪽(10건)을 넘겨야** 페이지네이션이 실제로 도는지 보입니다 —
 * 자리채움이라도 쪽이 하나뿐이면 확인할 수 없는 것이 생깁니다.
 *
 * 값은 index 로 만듭니다. `Math.random()` 을 쓰면 렌더마다 표가 달라져
 * **정렬이 된 것인지 값이 바뀐 것인지** 구분할 수 없습니다.
 */
export const ORDERS: TestOrder[] = NAMES.map((name, i) => {
  const day = ((i * 3) % 28) + 1;
  const state = STATES[i % 3];
  return {
    id: `R${1001 + i}`,
    date: `2025-06-${String(day).padStart(2, "0")}`,
    receipt: `2025060${(i % 9) + 1}${1001 + i}`,
    name,
    chart: String(2312345 + i),
    test: TESTS[i % TESTS.length],
    owner: OWNERS[i % OWNERS.length],
    count: ((i * 7) % 14) + 1,
    state,
    // 안 끝난 것에는 완료일이 없습니다 — 있으면 상태와 어긋납니다
    doneAt: state === "완료" ? `2025-06-${String(Math.min(day + 2, 28)).padStart(2, "0")}` : "",
  };
});

export const TEST_OPTIONS = [
  { value: "all", label: "전체" },
  ...TESTS.map((t) => ({ value: t, label: t })),
];

export const STATE_OPTIONS = [
  { value: "all", label: "전체" },
  ...STATES.map((s) => ({ value: s, label: s })),
];

export const OWNER_OPTIONS = [
  { value: "all", label: "전체" },
  ...OWNERS.map((o) => ({ value: o, label: o })),
];
