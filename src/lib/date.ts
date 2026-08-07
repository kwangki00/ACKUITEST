/**
 * 달력에 필요한 날짜 계산입니다. 라이브러리를 들이지 않은 이유는
 * Figma 의 Precision 축(Day · Month · Year) 때문입니다 — 월·연 그리드는
 * 어차피 직접 만들어야 해서, 날짜만 라이브러리에 맡기면 두 벌이 공존합니다.
 *
 * **Date 는 로컬 시간대로 다룹니다.** `toISOString()` 을 쓰면 UTC 로 바뀌면서
 * 한국 시간 오전 9시 이전이 전날로 밀립니다 — 날짜만 필요한 곳에서는 절대 쓰지 마세요.
 */

/** 시:분:초를 떨어낸 같은 날짜. 비교는 항상 이걸 거칩니다. */
export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/**
 * 달을 옮깁니다. **1월 31일에서 한 달 뒤는 3월 3일이 아니라 2월 28일입니다.**
 * `setMonth` 는 넘치는 날짜를 다음 달로 굴려버려서, 말일을 직접 잘라냅니다.
 */
export function addMonths(d: Date, n: number) {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(d.getDate(), last));
}

/** 그 달의 1일. 달력이 어느 달을 보고 있는지는 항상 이 값으로 기억합니다. */
export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * 한 달 그리드 — **6주(42칸) 고정**입니다.
 *
 * 필요한 주만 그리면 달을 넘길 때마다 패널 높이가 36px 씩 들썩입니다.
 * 팝오버 안에서 그러면 아래에 있던 버튼이 손가락 밑에서 움직입니다.
 * Figma 가 5주인 것은 대표값이고, description 에도 정확한 배치는 코드가 정한다고 적혀 있습니다.
 *
 * 앞뒤로 남는 칸은 이전·다음 달 날짜로 채웁니다 (Figma 의 State=Outside).
 */
export function monthGrid(month: Date, weekStartsOn: 0 | 1 = 0) {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** 요일 머리글. 주 시작 요일에 맞춰 돌립니다. */
export function weekdayLabels(weekStartsOn: 0 | 1 = 0) {
  const base = ["일", "월", "화", "수", "목", "금", "토"];
  return base.slice(weekStartsOn).concat(base.slice(0, weekStartsOn));
}

/** `2026-08-07`. 로컬 기준이라 시간대에 밀리지 않습니다. */
export function formatDate(d: Date, sep = "-") {
  const p = (n: number) => String(n).padStart(2, "0");
  return [d.getFullYear(), p(d.getMonth() + 1), p(d.getDate())].join(sep);
}

/** `2026-08-07` 을 Date 로. 형식이 아니면 null 입니다. */
export function parseDate(s: string): Date | null {
  const m = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/.exec(s.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  // 2026-02-31 처럼 없는 날은 3월로 굴러갑니다 — 굴러갔으면 잘못된 입력입니다
  if (date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

/** 그 달의 마지막 날. 월 단위 조회에서 종료로 씁니다. */
export function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

export function endOfYear(d: Date) {
  return new Date(d.getFullYear(), 11, 31);
}

export function addYears(d: Date, n: number) {
  return addMonths(d, n * 12);
}

export function isSameYear(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear();
}

/**
 * 연도 그리드 12칸. 시작 연도는 12로 내림합니다 —
 * 앞뒤로 넘길 때마다 경계가 달라지면 같은 해가 두 화면에 나옵니다.
 */
export function yearGrid(year: number) {
  const base = Math.floor(year / 12) * 12;
  return Array.from({ length: 12 }, (_, i) => base + i);
}

/** `2026-08`. 월 단위 조회의 표시 형식입니다. */
export function formatMonth(d: Date, sep = "-") {
  return `${d.getFullYear()}${sep}${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * 숫자만 남기고 자릅니다. `2022-12-12` 를 붙여넣어도 같은 결과입니다.
 * 문자를 치면 그냥 사라집니다 — 막는 것보다 조용히 걸러내는 편이 덜 성가십니다.
 */
export function toDigits(s: string, max: number) {
  return s.replace(/\D/g, "").slice(0, max);
}

/**
 * 숫자 8자리에 하이픈을 끼웁니다. `2022` → `2022`, `202212` → `2022-12`.
 *
 * 하이픈은 **표시일 뿐 상태가 아닙니다.** 그래서 하이픈 위에서 Backspace 를 눌러도
 * 지워질 것이 없어 멈추지 않고, 앞의 숫자가 지워집니다.
 */
export function formatDateDigits(d: string) {
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

/**
 * 고르는 단위 — Figma 의 `Precision` 축입니다.
 * 검사일처럼 하루를 고르는 화면과, 통계처럼 월·연으로 묶어 보는 화면이 갈립니다.
 */
export type DatePrecision = "day" | "month" | "year";

/** 정밀도별 입력 자릿수. `20260807` · `202608` · `2026`. */
export const PRECISION_DIGITS: Record<DatePrecision, number> = { day: 8, month: 6, year: 4 };

/** 표시 형식. 고르는 단위보다 잘게 보여주면 안 고른 것까지 정한 것처럼 보입니다. */
export function formatByPrecision(d: Date, p: DatePrecision) {
  if (p === "year") return String(d.getFullYear());
  if (p === "month") return formatMonth(d);
  return formatDate(d);
}

/** 숫자열 → 표시 문자열. 다 치기 전에도 보이는 만큼 끼워 맞춥니다. */
export function formatDigitsByPrecision(digits: string, p: DatePrecision) {
  if (p === "year") return digits;
  if (p === "month") return digits.length <= 4 ? digits : `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return formatDateDigits(digits);
}

/** 다 채운 숫자열을 Date 로. 없는 날짜(`20260231`)면 null 입니다. */
export function parseByPrecision(digits: string, p: DatePrecision): Date | null {
  if (digits.length !== PRECISION_DIGITS[p]) return null;
  if (p === "year") {
    const y = Number(digits);
    return y >= 1000 ? new Date(y, 0, 1) : null;
  }
  if (p === "month") {
    const y = Number(digits.slice(0, 4));
    const m = Number(digits.slice(4));
    return m >= 1 && m <= 12 ? new Date(y, m - 1, 1) : null;
  }
  return parseDate(formatDateDigits(digits));
}

/**
 * 고른 단위의 **첫 날**. 2026년 8월을 고르면 8월 1일입니다.
 */
export function startOfUnit(d: Date, p: DatePrecision) {
  if (p === "year") return startOfYear(d);
  if (p === "month") return startOfMonth(d);
  return startOfDay(d);
}

/**
 * 고른 단위의 **마지막 날**. 범위의 종료에 씁니다 —
 * 2026년 8월을 종료로 고르면 8월 31일이어야 그 달 자료가 다 들어옵니다.
 * 1일로 두면 8월 2일부터가 조용히 빠집니다.
 */
export function endOfUnit(d: Date, p: DatePrecision) {
  if (p === "year") return endOfYear(d);
  if (p === "month") return endOfMonth(d);
  return startOfDay(d);
}

/** min·max 밖이면 고를 수 없습니다. 경계는 포함입니다. */
export function isDisabled(d: Date, min?: Date, max?: Date) {
  const t = startOfDay(d).getTime();
  if (min && t < startOfDay(min).getTime()) return true;
  if (max && t > startOfDay(max).getTime()) return true;
  return false;
}

/** 범위 밖으로 나가지 않게 자릅니다. 방향키 이동에 씁니다. */
export function clamp(d: Date, min?: Date, max?: Date) {
  if (min && d < startOfDay(min)) return startOfDay(min);
  if (max && d > startOfDay(max)) return startOfDay(max);
  return d;
}
