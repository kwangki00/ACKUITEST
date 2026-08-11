import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { useOverlay } from "@/components/ui/pointer-mode";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma: Dialog (6 변형 — Size 3 × Tone 2)
 *
 * **사용자 행동을 막을 때만** 씁니다. 단순 알림은 Toast 입니다 —
 * 모달은 하던 일을 세우고 답을 요구하는 것이라, 알리기만 하면 될 때 쓰면
 * 매번 닫는 손이 듭니다.
 *
 * | Size | 폭 | 언제 |
 * |---|---|---|
 * | `sm` | 400 | 짧은 확인 — "삭제할까요?" |
 * | `default` | 512 | 기본 |
 * | `lg` | 640 | 폼이나 표가 들어갈 때 |
 *
 * `tone="destructive"` 는 **되돌릴 수 없는 동작**에만. 되돌릴 수 있는 일에 빨강을 쓰면
 * 사용자가 불필요하게 망설입니다 (Button 의 destructive 와 같은 규칙).
 *
 * 버튼 순서는 **취소가 왼쪽, 주 액션이 오른쪽**입니다.
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

type DialogSize = "sm" | "default" | "lg";

/** Figma 의 Size 축 — 400 · 512 · 640. */
const sizeMap: Record<DialogSize, string> = {
  sm: "max-w-100",
  default: "max-w-128",
  lg: "max-w-160",
};

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  /** 우상단 X. **취소와 같은 동작이어야 합니다** — 다르게 처리하지 마세요. */
  showClose?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, size = "default", showClose = true, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    {/* 뒤 화면을 덮어 지금 답해야 한다는 걸 알립니다 (Overlay/Scrim — 검정 50%) */}
    <DialogPrimitive.Overlay
      // 애니메이션은 ack-theme.css 에 직접 정의한 것만 씁니다 —
      // tailwindcss-animate 의 animate-in·fade-in-0 은 이 프로젝트에 없습니다
      className="fixed inset-0 z-50 bg-overlay-scrim data-[state=open]:animate-fade-in"
    />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
        "flex flex-col gap-4 rounded-lg border border-dialog-border bg-dialog-surface p-6 shadow-lg",
        // 내용이 길면 화면을 넘지 않게 — 폼이 들어가는 lg 에서 실제로 넘칩니다
        "max-h-[calc(100dvh-4rem)] overflow-y-auto",
        sizeMap[size],
        "data-[state=open]:animate-pop-in",
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          aria-label="닫기"
          className={cn(
            "absolute top-6 right-6 grid size-5 place-items-center rounded-xs",
            "text-icon-muted-foreground hover:text-text-basic",
            "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
          )}
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

/** 제목은 **질문형**으로 쓰세요 — "삭제할까요?" 가 "삭제 확인" 보다 명확합니다. */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    // X 버튼과 겹치지 않게 오른쪽을 비웁니다
    className={cn("pr-8 text-lg font-bold text-text-basic", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/** 되돌릴 수 없는 동작에는 **반드시 결과를 알립니다.** */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-text-subtle", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/** 버튼 자리 — 우측 정렬, 취소가 왼쪽입니다. */
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 pt-2", className)} {...props} />;
}

/**
 * 확인창 완성형 — **Figma 에 대응물이 없습니다** (`Select` 와 같은 사정).
 *
 * Figma 의 Dialog 는 제목 · 설명 · 푸터가 이미 한 덩어리라, 그 조합을 매번
 * 손으로 쓰면 버튼 순서나 톤이 조금씩 어긋납니다. 확인창은 이걸 쓰고,
 * 폼이 들어가는 창만 프리미티브로 조립하세요.
 */
export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** 되돌릴 수 없는 동작에만 destructive. */
  tone?: "default" | "destructive";
  size?: DialogSize;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 끄면 확인 버튼만 남습니다 — 알림성 모달에 씁니다. */
  showCancel?: boolean;
  onConfirm: () => void;
  /** 확인 버튼이 도는 동안. 두 번 눌리는 것을 막습니다. */
  loading?: boolean;
  /**
   * 어떻게 열지. **기본은 `PointerModeProvider` 가 정합니다** — 손가락이면 시트,
   * 마우스면 모달. 화면 하나만 예외로 두고 싶을 때만 직접 넘기세요.
   */
  overlay?: "dialog" | "sheet";
  /** 시트를 문서·데모 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
  children?: React.ReactNode;
}

/**
 * 확인창입니다 — Figma 에 대응물이 없는 **완성형**입니다.
 *
 * ### 모바일에서는 시트로 뜹니다
 *
 * 「시트 vs 전체 화면」 규칙의 **“확인만 받으면 됨 → MobileSheet(Footer 켬)”** 자리입니다.
 * 제목 + 설명 + 버튼 둘이라 뒤를 보면서 답만 하면 되고, 그럴 때 아래에서 올라오는
 * 편이 엄지에 가깝습니다.
 *
 * 껍데기는 앱 루트의 `PointerModeProvider` 가 정합니다 — **호출부는 아무 판단도 하지
 * 않습니다.** `Select` · `DateRangePicker` 와 같은 구조입니다.
 *
 * **폼이 들어가는 창은 이걸 쓰지 않습니다.** 프리미티브로 조립하고, 모바일에서는
 * **전체 화면으로 옮기세요** — 시트에서 긴 입력을 스크롤하면 답답하고 키보드가
 * 올라오면 시트를 덮습니다. 그건 내용이 정하는 것이라 컴포넌트가 갈라줄 수 없습니다.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "default",
  size = "default",
  confirmLabel = "확인",
  cancelLabel = "취소",
  showCancel = true,
  onConfirm,
  loading,
  overlay,
  container,
  children,
}: ConfirmDialogProps) {
  if (useOverlay(overlay === "dialog" ? "popover" : overlay) === "sheet") {
    return (
      <MobileSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        footer
        showCancel={showCancel}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        confirmTone={tone}
        confirmLoading={loading}
        onConfirm={onConfirm}
        container={container}
      >
        {description && <p className="text-sm text-text-subtle">{description}</p>}
        {children}
      </MobileSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
        <DialogFooter>
          {showCancel && (
            <DialogClose asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </DialogClose>
          )}
          <Button
            variant={tone === "destructive" ? "destructive" : "default"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
