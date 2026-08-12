import { PointerModeProvider } from "@/components/ui/pointer-mode";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";
import { ResultLookupScreen } from "@/screens/result-lookup";

/**
 * 앱 루트.
 *
 * **Provider 셋은 여기 한 번만** 둡니다.
 *
 * | | 무엇을 정하나 |
 * |---|---|
 * | `PointerModeProvider` | 팝오버냐 **시트**냐 — 손가락이면 시트 |
 * | `TooltipProvider` | 툴팁 지연 · 연달아 뜰 때의 규칙 |
 * | `ToastProvider` | `useToast` 가 이 안에서만 동작합니다 |
 *
 * 컴포넌트 안에 숨기지 않는 이유는 `skipDelayDuration` 때문입니다 — 툴바에서 하나가
 * 뜬 뒤 옆으로 옮기면 기다리지 않고 바로 떠야 합니다.
 *
 * 화면을 갈아 끼우려면 `ResultLookupScreen` 자리를 바꾸세요.
 * 컴포넌트 갤러리는 `@/screens/component-gallery` 에 있습니다.
 */
export default function App() {
  return (
    <PointerModeProvider>
      <TooltipProvider>
        <ToastProvider>
          <ResultLookupScreen />
        </ToastProvider>
      </TooltipProvider>
    </PointerModeProvider>
  );
}
