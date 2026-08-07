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

export function isSameMonth(a: Date, b: Date) {
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
