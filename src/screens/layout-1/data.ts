/**
 * 레이아웃1 이 쓰는 자료입니다. **API 로 갈아끼울 자리**라 화면과 떼어 두었습니다 —
 * `result-lookup/data.ts` 와 같은 규칙입니다.
 *
 * 값은 레이아웃을 보기 위한 자리채움입니다. 다만 **양과 열의 성격은 실제와 같게**
 * 두었습니다 — 200건쯤 쌓여야 스크롤·sticky 헤더·정렬이 실제로 어떻게 도는지 보이고,
 * 날짜 · 번호 · 이름 · 수량 · 상태처럼 정렬되는 축과 안 되는 축이 섞여 있어야
 * 표가 실제로 어떻게 보이는지 알 수 있습니다.
 *
 * 타입 이름이 `Record` 가 아닌 이유 — **TypeScript 내장 `Record<K, V>` 와 겹칩니다.**
 * 겹치면 이 파일 안에서는 내장 쪽을 쓸 수 없게 되는데, 바로 아래에서 씁니다.
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

/**
 * 검사항목 **25종**입니다.
 *
 * 이만큼 되면 `Select` 로는 못 고릅니다 — 목록을 끝까지 내려야 하고, 이름을 알고
 * 있어도 눈으로 찾아야 합니다. 그래서 화면은 **`Combobox render="editable"`** 을
 * 씁니다: 아는 이름은 쳐서 거르고, 모르면 열어서 훑습니다.
 */
const TESTS = [
  "일반혈액검사", "생화학검사", "소변검사", "면역검사", "미생물검사",
  "혈액응고검사", "당화혈색소", "갑상선기능검사", "간기능검사", "신장기능검사",
  "지질검사", "전해질검사", "종양표지자검사", "호르몬검사", "알레르기검사",
  "심근효소검사", "염증반응검사", "빈혈검사", "간염표지자검사", "매독혈청검사",
  "혈액형검사", "대변잠혈검사", "객담배양검사", "약물농도검사", "유전자검사",
];

/** 담당자 12명 — 이쪽도 이름을 알면 쳐서 거르는 편이 빠릅니다. */
const OWNERS = [
  "김검사", "이검사", "박검사", "최검사", "정검사", "강검사",
  "조검사", "윤검사", "장검사", "임검사", "한검사", "오검사",
];

const STATES: TestOrder["state"][] = ["완료", "진행중", "보류"];

const SURNAMES = [
  "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임",
  "한", "오", "서", "신", "권", "황", "안", "송", "전", "홍",
];
const GIVEN = [
  "지훈", "서연", "민준", "지우", "도윤", "하은", "시우", "서준", "예린", "주원",
  "수빈", "지민", "현우", "다은", "준서", "가은", "태현", "유진", "성민", "채원",
];

/**
 * **200건**입니다. 스크롤과 sticky 헤더가 실제로 도는지 보려면 이만큼 필요합니다 —
 * 자리채움이라도 한 화면에 들어오는 양이면 확인할 수 없는 것이 생깁니다.
 *
 * 값은 index 로 만듭니다. `Math.random()` 을 쓰면 렌더마다 표가 달라져
 * **정렬이 된 것인지 값이 바뀐 것인지** 구분할 수 없습니다.
 *
 * 이름은 성 20 × 이름 20 을 **서로 다른 주기로** 돌려 200건이 겹치지 않게 합니다 —
 * 둘 다 `i % 20` 으로 뽑으면 같은 이름이 스무 번마다 돌아옵니다.
 */
export const ORDERS: TestOrder[] = Array.from({ length: 200 }, (_, i) => {
  const month = (Math.floor(i / 40) % 6) + 1;
  const day = ((i * 7) % 28) + 1;
  const state = STATES[i % 3];
  const date = `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    id: `R${1001 + i}`,
    date,
    receipt: `2025${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}${1001 + i}`,
    name: SURNAMES[i % 20] + GIVEN[Math.floor(i / 20) % 20],
    chart: String(2312345 + i),
    test: TESTS[i % TESTS.length],
    owner: OWNERS[i % OWNERS.length],
    count: ((i * 3) % 14) + 1,
    state,
    // 안 끝난 것에는 완료일이 없습니다 — 있으면 상태와 어긋납니다
    doneAt:
      state === "완료"
        ? `2025-${String(month).padStart(2, "0")}-${String(Math.min(day + 2, 28)).padStart(2, "0")}`
        : "",
  };
});

/**
 * **「전체」 항목이 없습니다.** `Select` 였을 때는 조건을 안 걸었다는 것을 알릴
 * 항목이 필요했지만, `editable` 은 **비어 있는 것이 곧 「전체」** 입니다 — 자리표시가
 * 그렇게 적혀 있고, 지우기(X)로 언제든 그 상태로 돌아갑니다.
 *
 * 목록 안에 「전체」를 두면 쳐서 거를 때도 걸려 나와 검사항목처럼 읽힙니다.
 */
export const TEST_OPTIONS = TESTS.map((t) => ({ value: t, label: t }));
export const OWNER_OPTIONS = OWNERS.map((o) => ({ value: o, label: o }));

/** 상태는 3종뿐이라 그대로 `Select` 입니다 — 항목보다 검색창이 더 큽니다. */
export const STATE_OPTIONS = [
  { value: "all", label: "전체" },
  ...STATES.map((s) => ({ value: s, label: s })),
];
