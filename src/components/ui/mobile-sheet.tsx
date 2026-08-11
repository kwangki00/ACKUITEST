import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma: MobileSheet (Layouts 페이지)
 *
 * 아래에서 올라와 화면을 덮는 하단 시트입니다.
 *
 * ### 시트 vs 전체 화면
 *
 * | 상황 | 쓸 것 |
 * |---|---|
 * | **뒤를 보면서 골라야 함** | MobileSheet — 날짜 선택 · 목록 선택 · 필터 |
 * | 다른 화면으로 떠남 | 전체 화면 — 전체메뉴 · 상세 |
 * | 입력이 길고 복잡함 | 전체 화면 — 시트에서 스크롤하면 답답합니다 |
 * | 확인만 받으면 됨 | MobileSheet (`footer` 켬) |
 *
 * ### 높이
 *
 * **최소 240 · 최대 화면의 85%.** 최소보다 짧으면 여는 동작이 어색하고,
 * 최대를 넘으면 뒤 화면이 안 보여 **임시 레이어라는 느낌이 사라집니다** —
 * 그럴 바엔 전체 화면이 낫습니다. 내용이 넘치면 시트 안에서 스크롤합니다.
 *
 * ### 그 밖
 *
 * - **Scrim 은 안에 들어 있습니다.** 따로 깔지 마세요 — 빠뜨리거나 투명도가 달라집니다
 * - **시트를 두 개 겹치지 마세요.** 뒤로 가기 동작이 꼬입니다
 * - `handle` 은 **끌어내려 닫을 수 있다는 신호**입니다. 닫기 버튼만 있으면 꺼도 됩니다
 * - 아래 20px 은 홈 인디케이터 자리입니다 (Safe Area)
 *
 * Dialog 와 같은 Radix 프리미티브를 씁니다 — 포커스 가두기 · ESC · 배경 스크롤 잠금이
 * 시트에도 똑같이 필요합니다.
 */

export interface MobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** 끌어내려 닫는 손잡이. 닫기 버튼만 둘 거면 끄세요. */
  handle?: boolean;
  showClose?: boolean;
  /** 확인·취소 버튼 줄. 고르는 즉시 닫히는 시트에는 필요 없습니다. */
  footer?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  /** 확인 버튼이 도는 동안. 두 번 눌리는 것을 막습니다. */
  confirmLoading?: boolean;
  /** 되돌릴 수 없는 동작에만 `destructive`. `ConfirmDialog` 가 시트로 열릴 때 씁니다. */
  confirmTone?: "default" | "destructive";
  /** 끄면 확인 버튼만 남습니다 — 알림성 시트에 씁니다. */
  showCancel?: boolean;
  children: React.ReactNode;
  className?: string;
  /**
   * 시트를 띄울 자리. 기본은 `document.body` 입니다.
   *
   * 문서나 데모에서 **390×844 틀 안에** 가두고 싶을 때 씁니다. 다만 시트는 `fixed` 라
   * 그 틀에 `transform` 이 함께 있어야 갇힙니다 — transform 이 있는 조상이
   * fixed 의 기준이 되기 때문입니다. 실제 앱에서는 넘기지 마세요.
   */
  container?: HTMLElement | null;
}

export function MobileSheet({
  open,
  onOpenChange,
  title,
  handle = true,
  showClose = true,
  footer = true,
  confirmLabel = "확인",
  cancelLabel = "취소",
  confirmLoading,
  confirmTone = "default",
  showCancel = true,
  onConfirm,
  confirmDisabled,
  children,
  className,
  container,
}: MobileSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ startY: number; moved: number } | null>(null);
  const [offset, setOffset] = React.useState(0);

  /*
    끌어내려 닫기.

    손잡이를 보여줬으면 실제로 끌 수 있어야 합니다 — 신호만 주고 안 되면
    한 번 해보고 다시는 시도하지 않습니다.

    아래로만 따라갑니다. 위로도 늘어나면 시트가 화면을 넘어 커집니다.
  */
  const onPointerDown = (e: React.PointerEvent) => {
    if (!handle) return;
    drag.current = { startY: e.clientY, moved: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.moved = dy;
    setOffset(dy);
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    const h = sheetRef.current?.offsetHeight ?? 0;
    // 높이의 1/4 이상 내렸으면 닫습니다. 절반으로 잡으면 큰 시트를 닫기 힘듭니다
    const shouldClose = drag.current.moved > Math.max(80, h * 0.25);
    drag.current = null;
    setOffset(0);
    if (shouldClose) onOpenChange(false);
  };

  return (
    /*
      **`modal` 을 끄지 마세요.** Radix 는 modal 이 아니면 `Overlay` 를 **아예 안 그립니다**
      — Scrim 이 통째로 사라집니다. 스크롤 잠금이 거슬린다고 껐다가 그걸로 되돌렸습니다
      (2026-08-11).
    */
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal container={container ?? undefined}>
        {/* Scrim 은 시트에 딸려 있습니다 — 쓰는 쪽에서 따로 깔지 않습니다 */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay-scrim data-[state=open]:animate-fade-in" />

        <DialogPrimitive.Content
          ref={sheetRef}
          onOpenAutoFocus={(e) => {
            // 열자마자 첫 입력에 커서가 들어가면 키보드가 올라와 시트를 덮습니다
            e.preventDefault();
            /*
              **preventScroll 이 필요합니다.** 시트는 화면 아래쪽에 있어서, 그냥 focus()
              하면 브라우저가 그걸 보이게 하려고 **조상들을 스크롤합니다** — 문서처럼
              긴 페이지에서는 시트가 아니라 뒤 화면이 움직이는 것처럼 보입니다.
              시트는 이미 fixed 라 스크롤할 이유가 없습니다.
            */
            sheetRef.current?.focus({ preventScroll: true });
          }}
          style={offset ? { transform: `translateY(${offset}px)`, transition: "none" } : undefined}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-background-white outline-hidden",
            // 최소 240 · 최대 85% — 그 사이에서 내용이 높이를 정합니다
            "max-h-[85dvh] min-h-60",
            "data-[state=open]:animate-slide-up",
            className
          )}
        >
          {handle && (
            <div
              className="flex shrink-0 cursor-grab touch-none justify-center py-2 active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <span aria-hidden className="h-1 w-22 rounded-full bg-sheet-handle" />
            </div>
          )}

          {(title || showClose) && (
            <div className="flex shrink-0 items-center gap-2 pt-2 pr-4 pb-4 pl-5">
              <DialogPrimitive.Title
                className={cn("flex-1 text-base font-semibold text-text-basic", !title && "sr-only")}
              >
                {title ?? "시트"}
              </DialogPrimitive.Title>
              {showClose && (
                <DialogPrimitive.Close
                  aria-label="닫기"
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-xs text-icon-muted-foreground",
                    "hover:text-text-basic focus-visible:ring-2 focus-visible:ring-action-focus-ring",
                    "focus-visible:outline-hidden"
                  )}
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>
              )}
            </div>
          )}

          {/* 내용이 최대 높이를 넘으면 여기서 스크롤합니다 — 시트가 화면을 넘지 않습니다 */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
            {children}
          </div>

          {/* 취소가 왼쪽, 주 액션이 오른쪽 — Dialog 와 같은 순서입니다 */}
          {footer && (
            <div className="flex shrink-0 gap-2 px-4 pt-3 pb-4">
              {showCancel && (
                <DialogPrimitive.Close asChild>
                  <Button variant="outline" size="lg" className="flex-1">
                    {cancelLabel}
                  </Button>
                </DialogPrimitive.Close>
              )}
              <Button
                variant={confirmTone === "destructive" ? "destructive" : "default"}
                size="lg"
                className="flex-1"
                disabled={confirmDisabled}
                loading={confirmLoading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          )}

          {/* 홈 인디케이터 자리. 없으면 버튼이 화면 끝에 붙어 눌리지 않습니다 */}
          <div aria-hidden className="h-5 shrink-0" />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
