import * as React from "react";

/**
 * 창 폭이 조건에 맞는지 알려줍니다.
 *
 * ### 언제 이걸 쓰나 — 기준이 셋입니다
 *
 * | 무엇을 정하나 | 기준 | 무엇으로 |
 * |---|---|---|
 * | 팝오버 ↔ **시트** | 손가락이냐 마우스냐 | `PointerModeProvider` |
 * | 가로 한 줄 ↔ 세로 | **자기 폭** | 컨테이너 쿼리 (`@pc/filter:`) |
 * | 컨트롤·행 높이 | 창 폭 | CSS 변수 (`--h-*`) |
 * | **화면 구조가 통째로 갈림** | **창 폭** | **이 훅** |
 *
 * 맨 아랫줄만 JS 가 필요합니다. 사이드바 ↔ 탭바처럼 **마크업 자체가 다른 것**은
 * CSS 로 못 바꿉니다 — 둘 다 그려놓고 하나를 숨기면 안 보이는 쪽의 상태·포커스·
 * 스크롤이 그대로 살아 있어서, 창을 줄였다 늘리면 엉뚱한 자리로 돌아옵니다.
 *
 * ### SSR 에서도 안전합니다
 *
 * `useSyncExternalStore` 의 서버 스냅샷은 **항상 `false`** 입니다 — 서버는 창 폭을
 * 알 수 없으니 넓은 쪽(기본)을 그리고, 브라우저에서 한 번 맞춥니다.
 * `useState` + `useEffect` 로 짜면 첫 그림이 깜빡입니다.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return React.useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && window.matchMedia?.(query).matches) || false,
    () => false
  );
}

/**
 * **1024px 에서 갈립니다.** `--h-input-default` 같은 반응형 변수가 쓰는 것과 같은
 * 지점이라, 높이와 구조가 **한 번에** 바뀝니다 — 다른 값을 쓰면 어중간한 폭에서
 * 데스크톱 구조에 모바일 높이가 섞입니다.
 */
export const useIsMobileLayout = () => useMediaQuery("(max-width: 1023px)");
