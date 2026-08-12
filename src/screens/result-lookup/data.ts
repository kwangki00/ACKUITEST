/**
 * 화면이 쓰는 자료입니다. **API 로 갈아끼울 자리**라 화면과 떼어 두었습니다 —
 * 서버가 붙으면 이 파일만 fetch 로 바꾸고 화면은 그대로 둡니다.
 */

/** 완료여부 — 점 하나로 알립니다. 범례가 함께 있어야 읽힙니다. */
export const DONE = {
  all: { label: "전체완료", cls: "bg-badge-success-solid-fill" },
  part: { label: "부분완료", cls: "bg-badge-warning-solid-fill" },
  few: { label: "소견미완료", cls: "bg-badge-info-solid-fill" },
  none: { label: "미완료", cls: "bg-badge-danger-solid-fill" },
} as const;

export type DoneKey = keyof typeof DONE;

/**
 * 완료여부와 **다른 축**입니다 — 그 결과가 있는지를 알리는 표식입니다.
 * Figma 화면의 범례가 여섯 칸인 것은 이 둘이 뒤에 붙기 때문입니다.
 *
 * **`DONE` 에 합치지 않습니다.** 완료여부는 넷 중 하나를 고르는 값이고
 * 이것은 있고 없고라, 한 목록에 섞으면 점 하나가 두 가지를 뜻하게 됩니다.
 *
 * `P` 의 보라는 **디자인 시스템에 없는 색**입니다 — 브랜드 8램프에 보라가 없어
 * Figma 화면이 Tailwind 색을 직접 참조하고 있었습니다. Semantic 토큰을 만들지
 * 결정이 필요합니다 (2026-08-12).
 */
export const MARKS = {
  p: { label: "P: 검진결과 유무", cls: "bg-purple-500" },
  s: { label: "S: 스페셜결과 유무", cls: "bg-icon-secondary" },
} as const;

export interface Patient {
  no: number;
  /** 묶음 접수 — 순번 대신 폴더 아이콘이 나옵니다. */
  folder?: boolean;
  date: string;
  name: string;
  chart: string;
  receipt: string;
  sex: "남" | "여";
  age: number;
  tests: number;
  history: boolean;
  /** 낮음 · 높음. 색만으로 구분하지 않고 글자를 함께 씁니다. */
  flags: ("L" | "H")[];
  done: DoneKey;
}

export const PATIENTS: Patient[] = [
  { no: 1, date: "2025-06-01", name: "김진영", chart: "2312345", receipt: "202506011001", sex: "여", age: 30, tests: 3, history: false, flags: ["L", "H"], done: "all" },
  { no: 2, date: "2025-06-01", name: "이수정", chart: "2312346", receipt: "202506011002", sex: "여", age: 41, tests: 5, history: false, flags: ["L"], done: "all" },
  { no: 3, date: "2025-06-01", name: "박상철", chart: "2312347", receipt: "202506011003", sex: "남", age: 55, tests: 2, history: true, flags: [], done: "none" },
  { no: 4, folder: true, date: "2025-06-01", name: "최민영", chart: "2312348", receipt: "202506011004", sex: "여", age: 36, tests: 12, history: true, flags: [], done: "none" },
  { no: 5, folder: true, date: "2025-06-01", name: "정혜진", chart: "2312349", receipt: "202506011005", sex: "여", age: 28, tests: 4, history: true, flags: [], done: "none" },
  { no: 6, folder: true, date: "2025-06-01", name: "한지수", chart: "2312350", receipt: "202506011006", sex: "여", age: 36, tests: 15, history: true, flags: [], done: "part" },
  { no: 7, folder: true, date: "2025-06-01", name: "오영준", chart: "2312351", receipt: "202506011007", sex: "남", age: 47, tests: 2, history: true, flags: [], done: "none" },
  { no: 8, folder: true, date: "2025-06-01", name: "윤지혜", chart: "2312352", receipt: "202506011008", sex: "여", age: 33, tests: 2, history: true, flags: [], done: "none" },
  { no: 9, date: "2025-06-01", name: "강태우", chart: "2312353", receipt: "202506011009", sex: "남", age: 61, tests: 2, history: false, flags: [], done: "part" },
  { no: 10, date: "2025-06-01", name: "조은서", chart: "2312354", receipt: "202506011010", sex: "여", age: 25, tests: 2, history: true, flags: [], done: "none" },
  { no: 11, date: "2025-06-01", name: "임소연", chart: "2312355", receipt: "202506011011", sex: "여", age: 39, tests: 9, history: true, flags: [], done: "none" },
  { no: 12, date: "2025-06-01", name: "서주혁", chart: "2312356", receipt: "202506011012", sex: "남", age: 44, tests: 9, history: false, flags: [], done: "part" },
  { no: 13, date: "2025-06-01", name: "김민준", chart: "2312357", receipt: "202506011013", sex: "남", age: 52, tests: 9, history: false, flags: [], done: "part" },
  { no: 14, date: "2025-06-01", name: "노현주", chart: "2312358", receipt: "202506011014", sex: "여", age: 30, tests: 7, history: true, flags: [], done: "none" },
];

export const TOTAL_PATIENTS = 979;
export const TOTAL_PAGES = 5;

export interface TestResult {
  no: number;
  barcode: string;
  name: string;
  state: "완료" | "진행중" | "보고예정";
  value?: string;
  unit?: string;
  due: string;
  confirmed?: boolean;
}

export const RESULTS: TestResult[] = [
  { no: 1, barcode: "C36540BHZ", name: "Culture ID (Vaginal)", state: "보고예정", due: "2025-06-05" },
  { no: 2, barcode: "C36540BH02", name: "White Blood Cell (WBC)", state: "완료", value: "6.5", unit: "10³/μL", due: "2025-06-05", confirmed: true },
  { no: 3, barcode: "C36540BH03", name: "Red Blood Cell (RBC)", state: "완료", value: "4.2", unit: "10⁶/μL", due: "2025-06-05", confirmed: true },
  { no: 4, barcode: "C36540BH04", name: "Hemoglobin (Hb)", state: "완료", value: "13.5", unit: "g/dL", due: "2025-06-05", confirmed: true },
  { no: 5, barcode: "C36540BH05", name: "Platelet Count", state: "완료", value: "245", unit: "10³/μL", due: "2025-06-05" },
  { no: 6, barcode: "C36540BH06", name: "Fasting Glucose", state: "진행중", unit: "mg/dL", due: "2025-06-06" },
  { no: 7, barcode: "C36540BH07", name: "HbA1c", state: "완료", value: "5.8", unit: "%", due: "2025-06-05", confirmed: true },
  { no: 8, barcode: "C36540BH08", name: "Total Cholesterol", state: "완료", value: "180", unit: "mg/dL", due: "2025-06-05" },
  { no: 9, barcode: "C36540BH09", name: "HDL Cholesterol", state: "완료", value: "55", unit: "mg/dL", due: "2025-06-05" },
  { no: 10, barcode: "C36540BH10", name: "LDL Cholesterol", state: "완료", value: "110", unit: "mg/dL", due: "2025-06-05" },
  { no: 11, barcode: "C36540BH11", name: "Triglycerides", state: "완료", value: "145", unit: "mg/dL", due: "2025-06-05" },
  { no: 12, barcode: "C36540BH12", name: "Urinalysis", state: "보고예정", due: "2025-06-06" },
];

/** 상태가 3종이라 배지입니다 — 「2종이면 점, 3종 이상이면 배지」 규칙. */
export const STATE_TONE: Record<TestResult["state"], "success" | "warning" | "primary"> = {
  완료: "success",
  진행중: "warning",
  보고예정: "primary",
};

export const SORT_OPTIONS = [
  { value: "receipt", label: "접수번호순" },
  { value: "name", label: "성명순" },
  { value: "date", label: "접수일순" },
];

export const TEST_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "cbc", label: "일반혈액검사" },
  { value: "chem", label: "생화학검사" },
  { value: "ua", label: "소변검사" },
];
