import * as React from "react";

/**
 * **손가락이냐 마우스냐.** 시트로 열지 팝오버로 열지를 정합니다.
 *
 * ### 왜 폭이 아니라 포인터인가
 *
 * `FilterBar` 처럼 **배치**를 정하는 것은 폭이 기준입니다 — 조건을 가로로 놓을 자리가
 * 있느냐 없느냐니까요. 그건 컨테이너 쿼리로 CSS 가 알아서 합니다.
 *
 * 시트냐 팝오버냐는 다릅니다. 시트가 화면 아래에서 올라오는 이유는 **엄지가 닿는
 * 곳**이기 때문이고, 팝오버가 트리거에 붙는 이유는 **마우스가 이미 거기 있기**
 * 때문입니다. 그래서 —
 *
 * | | 맞는 것 |
 * |---|---|
 * | 좁은 데스크톱 창 | **팝오버** (마우스니까) |
 * | 넓은 태블릿 | **시트** (손가락이니까) |
 *
 * 폭으로 정하면 둘 다 틀립니다. 기준은 `(pointer: coarse)` 입니다.
 *
 * ### 앱 루트에 하나
 *
 * `TooltipProvider` · `ToastProvider` 와 같은 자리입니다. 여기서 한 번 정하면
 * 호출부는 `<DateRangePicker/>` 만 쓰고 **아무 판단도 하지 않습니다** — 조건이 네 개라고
 * 네 번 적을 일이 없고, 하나를 빠뜨려 데스크톱에 시트가 뜨는 일도 없습니다.
 *
 * ### 문서·데모에서는 강제로 넣습니다
 *
 * `mode="touch"` 로 감싸면 390 틀 안에서도 시트가 뜹니다. 컴포넌트가 스스로
 * `matchMedia` 를 부르게 두면 **창**을 재게 되어 틀 안에서 흉내낼 수단이
 * 없어집니다 — `.ack-mobile` 이 유틸리티 variant 를 못 막는 것과 같은 함정입니다.
 */

export type PointerMode = "touch" | "mouse";

const PointerModeContext = React.createContext<PointerMode | null>(null);

/**
 * 시트·팝오버를 띄울 자리. **문서·데모 전용**입니다.
 *
 * 시트는 `fixed` 라 그냥 두면 브라우저 창 전체를 덮습니다. 390 틀 안에 가두려면
 * Portal 대상을 그 틀로 줘야 하는데, **컨트롤마다 `container` 를 넘기게 하면 빠집니다** —
 * 실제로 `DateRangePicker` 의 오버레이 스토리에서 빠져 시트가 창을 꽉 채웠습니다
 * (2026-08-11). `FormField` 의 라벨 연결과 같은 종류의 실수입니다.
 *
 * 그래서 **틀이 알려줍니다.** `PointerModeProvider` 에 한 번 주면 그 안의 시트가
 * 전부 따라옵니다 — 어차피 `mode="touch"` 와 같은 자리입니다.
 */
const OverlayContainerContext = React.createContext<HTMLElement | null>(null);

const QUERY = "(pointer: coarse)";

/** 브라우저에 직접 묻습니다. Provider 가 없을 때의 기본값이기도 합니다. */
function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = (): PointerMode =>
  typeof window !== "undefined" && window.matchMedia?.(QUERY).matches ? "touch" : "mouse";

// 서버에서는 마우스로 봅니다 — 손가락 화면이 그려질 자리는 어차피 클라이언트에서 잡힙니다
const getServerSnapshot = (): PointerMode => "mouse";

export interface PointerModeProviderProps {
  /** `auto` 는 `(pointer: coarse)` 로 판단합니다. 문서·데모에서는 고정하세요. */
  mode?: "auto" | PointerMode;
  /**
   * 시트를 띄울 자리. **문서·데모에서 390 틀 안에 가둘 때만** 씁니다 —
   * 그 안의 시트가 전부 따라옵니다. 실제 앱에서는 넘기지 마세요, 화면이 곧 틀입니다.
   *
   * 틀에 `transform: translateZ(0)` 을 함께 줘야 갇힙니다 — transform 이 있는 조상이
   * `fixed` 의 기준이 되기 때문입니다.
   */
  container?: HTMLElement | null;
  children: React.ReactNode;
}

export function PointerModeProvider({
  mode = "auto",
  container = null,
  children,
}: PointerModeProviderProps) {
  const detected = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = mode === "auto" ? detected : mode;
  return (
    <PointerModeContext.Provider value={value}>
      <OverlayContainerContext.Provider value={container}>
        {children}
      </OverlayContainerContext.Provider>
    </PointerModeContext.Provider>
  );
}

/**
 * 시트를 띄울 자리. **직접 준 것이 이깁니다** — `container` prop 을 넘겼으면 그것,
 * 아니면 감싸고 있는 `PointerModeProvider` 의 것, 둘 다 없으면 `document.body`.
 */
export function useOverlayContainer(container?: HTMLElement | null) {
  const ctx = React.useContext(OverlayContainerContext);
  return container ?? ctx ?? undefined;
}

/**
 * Provider 가 없으면 브라우저에 직접 묻습니다 — 안 감싸도 동작은 합니다.
 * 다만 **앱 루트에 하나 두는 쪽을 권합니다.** 문서·테스트에서 값을 고정할 수 있어야
 * 하고, 그때마다 창을 재는 것보다 한 곳에서 정하는 편이 설명됩니다.
 */
export function usePointerMode(): PointerMode {
  const ctx = React.useContext(PointerModeContext);
  const detected = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ctx ?? detected;
}

/** 떠 있는 것을 어떻게 열지. */
export type OverlayMode = "popover" | "sheet";

/**
 * 시트냐 팝오버냐를 정합니다 — **손가락이면 시트, 마우스면 팝오버.**
 *
 * `overlay` 를 직접 넘기면 그게 이깁니다. 화면 하나만 예외로 두고 싶을 때만
 * 쓰세요 — 매번 넘기기 시작하면 Provider 를 둔 뜻이 없어집니다.
 */
export function useOverlay(overlay?: OverlayMode): OverlayMode {
  const pointer = usePointerMode();
  return overlay ?? (pointer === "touch" ? "sheet" : "popover");
}
