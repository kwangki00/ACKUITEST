import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma: Toast (4 변형 — Tone 4)
 *
 * 처리 **결과**를 잠깐 알립니다. 사용자를 멈춰 세우지 않습니다 —
 * 답을 받아야 하면 Dialog 입니다.
 *
 * | 상황 | 쓸 것 |
 * |---|---|
 * | 사용자 행동을 막아야 함 | `Dialog` — 삭제 확인처럼 되돌릴 수 없는 동작 |
 * | 처리 결과만 알림 | **Toast** — 저장 완료 · 조회 완료 |
 * | 실패를 알림 | Toast **+ 화면 표시** — Toast 는 사라지므로 단독으로 두지 마세요 |
 *
 * **자동으로 사라집니다.** 중요한 정보를 여기에만 두지 마세요 —
 * 스크린리더가 다 읽기 전에 사라질 수도 있습니다.
 *
 * **색만으로 구분하지 마세요.** 제목 문구로 결과를 명확히 씁니다 —
 * "저장에 실패했습니다" 처럼요. 색각 이상이 있으면 톤이 안 보입니다.
 */

export type ToastTone = "success" | "info" | "warning" | "danger";

/** 아이콘과 글자색은 **Alert 과 같은 것**을 씁니다 — 같은 톤이 두 곳에서 달라 보이면 안 됩니다. */
const toneMap: Record<ToastTone, { surface: string; icon: React.ElementType; iconColor: string }> = {
  success: {
    surface: "bg-toast-success-surface border-toast-success-border",
    icon: CircleCheck,
    iconColor: "text-badge-success-text",
  },
  info: {
    surface: "bg-toast-info-surface border-toast-info-border",
    icon: Info,
    iconColor: "text-badge-info-text",
  },
  warning: {
    surface: "bg-toast-warning-surface border-toast-warning-border",
    icon: TriangleAlert,
    iconColor: "text-badge-warning-text",
  },
  danger: {
    surface: "bg-toast-danger-surface border-toast-danger-border",
    icon: CircleX,
    iconColor: "text-badge-danger-text",
  },
};

export interface ToastItem {
  id: string;
  tone?: ToastTone;
  title: string;
  description?: string;
  /**
   * 되돌리기 같은 버튼. **실행 취소가 실제로 가능할 때만** 쓰세요 —
   * 눌러도 되돌릴 수 없으면 없느니만 못합니다.
   */
  action?: { label: string; onClick: () => void };
  /** 기본 4초. 실패는 조금 더 오래 둡니다. */
  duration?: number;
}

type ToastInput = Omit<ToastItem, "id">;

const ToastContext = React.createContext<{
  toast: (t: ToastInput) => void;
  dismiss: (id: string) => void;
} | null>(null);

/**
 * 앱 루트에 하나 둡니다. Tooltip 과 같은 자리입니다.
 *
 * `limit` — 화면에 동시에 둘 개수. **3개를 넘기면 읽기 전에 밀려납니다.**
 * 넘치면 **오래된 것부터** 지웁니다 (Figma 문서의 "새 것이 위로" 규칙).
 */
export function ToastProvider({
  children,
  limit = 3,
  duration = 4000,
}: {
  children: React.ReactNode;
  limit?: number;
  duration?: number;
}) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const seq = React.useRef(0);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (t: ToastInput) => {
      const id = `t${++seq.current}`;
      // 새 것이 뒤에 붙고, viewport 가 아래에서 위로 쌓아 올립니다
      setItems((prev) => [...prev, { ...t, id }].slice(-limit));
    },
    [limit]
  );

  const ctx = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={ctx}>
      <ToastPrimitive.Provider duration={duration} swipeDirection="right">
        {children}

        {items.map((t) => {
          const tone = toneMap[t.tone ?? "success"];
          const Icon = tone.icon;
          return (
            <ToastPrimitive.Root
              key={t.id}
              duration={t.duration}
              onOpenChange={(open) => !open && dismiss(t.id)}
              className={cn(
                "flex w-100 items-start gap-3 rounded-md border px-4 py-3.5 shadow-md",
                tone.surface,
                "data-[state=open]:animate-pop-in data-[state=open]:[--ack-pop-x:8px]",
                // 오른쪽으로 밀어서 닫을 때 손가락을 따라갑니다
                "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
                "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform"
              )}
            >
              <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", tone.iconColor)} />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <ToastPrimitive.Title className="text-sm font-semibold text-text-basic">
                  {t.title}
                </ToastPrimitive.Title>
                {t.description && (
                  <ToastPrimitive.Description className="text-xs text-text-subtle">
                    {t.description}
                  </ToastPrimitive.Description>
                )}
              </div>

              {t.action && (
                <ToastPrimitive.Action asChild altText={t.action.label}>
                  <Button variant="ghost" size="sm" onClick={t.action.onClick}>
                    {t.action.label}
                  </Button>
                </ToastPrimitive.Action>
              )}

              <ToastPrimitive.Close
                aria-label="닫기"
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-xs",
                  "text-icon-muted-foreground hover:text-text-basic",
                  "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
                )}
              >
                <X className="size-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}

        {/*
          우하단에 쌓습니다. 우상단은 조회 화면의 툴바·건수와 겹칩니다.
          column-reverse 라 새 것이 아래가 아니라 **위로** 올라옵니다.
        */}
        <ToastPrimitive.Viewport
          className={cn(
            "fixed right-4 bottom-4 z-100 flex w-100 max-w-[calc(100vw-2rem)]",
            "flex-col-reverse gap-2 outline-hidden"
          )}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

/**
 * `const { toast } = useToast()` 로 꺼내 씁니다.
 *
 * ```tsx
 * toast({ tone: "success", title: "저장되었습니다", description: "12건이 반영되었습니다." });
 * ```
 */
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast 는 ToastProvider 안에서만 씁니다.");
  return ctx;
}
