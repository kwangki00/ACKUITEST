import * as React from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Alert (4 변형 — Tone 4)
 *
 * 화면 안에 **남는** 경고·안내입니다. Toast 와 달리 자동으로 사라지지 않습니다.
 * 폼 상단의 검증 요약, 조회 조건 안내, 처리 실패 사유처럼
 * 사용자가 계속 봐야 하는 내용에 씁니다.
 *
 * Toast 와의 구분 — 잠깐 알리고 사라져도 되면 Toast, 계속 보여야 하면 Alert.
 *
 * **Close 는 사용자가 닫아도 되는 경우에만 켜세요.**
 * 오류는 해결될 때까지 남기는 편이 안전합니다. 닫을 수 있으면 사용자가 실수로 지우고
 * 왜 실패했는지 모르게 됩니다.
 */

type Tone = "info" | "success" | "warning" | "danger";

const toneMap: Record<Tone, { surface: string; icon: React.ElementType; iconColor: string }> = {
  info: {
    surface: "bg-alert-info-surface border-alert-info-border",
    icon: Info,
    iconColor: "text-badge-info-text",
  },
  success: {
    surface: "bg-alert-success-surface border-alert-success-border",
    icon: CircleCheck,
    iconColor: "text-badge-success-text",
  },
  warning: {
    surface: "bg-alert-warning-surface border-alert-warning-border",
    icon: TriangleAlert,
    iconColor: "text-badge-warning-text",
  },
  danger: {
    surface: "bg-alert-danger-surface border-alert-danger-border",
    icon: CircleX,
    iconColor: "text-badge-danger-text",
  },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title: string;
  description?: string;
  /** 자세히 보기 · 다시 시도 등. Button 을 넣으세요. */
  action?: React.ReactNode;
  /** 닫기 버튼. 오류에는 켜지 마세요. */
  onClose?: () => void;
}

export function Alert({
  tone = "info",
  title,
  description,
  action,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const t = toneMap[tone];
  const Icon = t.icon;

  return (
    <div
      // danger 는 즉시 읽혀야 하고 나머지는 하던 일을 끊지 않습니다
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex w-full gap-3 rounded-md border px-4 py-3.5", t.surface, className)}
      {...props}
    >
      <Icon className={cn("mt-px size-5 shrink-0", t.iconColor)} aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-text-basic">{title}</p>
        {description && <p className="text-xs text-text-subtle">{description}</p>}
        {children}
        {action && <div className="mt-1 flex items-center gap-2">{action}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className={cn(
            "-mr-1 -mt-1 grid size-6 shrink-0 place-items-center rounded-sm",
            "text-icon-gray-light hover:bg-alpha-inverse10",
            "focus-visible:ring-[3px] focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
          )}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
