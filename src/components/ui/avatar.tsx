import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Avatar (12 변형 — Type 3 × Size 4)
 *
 * 사용자를 나타내는 원형 표식입니다. 사이드바 푸터·댓글·담당자 표시에 씁니다.
 *
 * **이름이 있으면 이니셜을 우선하세요** — 아이콘보다 개인 식별이 쉽습니다.
 * 이니셜은 한글 1자 또는 영문 2자를 권장합니다.
 *
 * Status 점에는 흰 링이 있어 사진 위에서도 구분됩니다.
 * 상태는 색만으로 알리므로, 중요한 정보라면 옆에 글자를 함께 두세요.
 */

type Size = "xs" | "sm" | "default" | "lg";

const sizeMap: Record<Size, { box: string; text: string; icon: string; dot: string }> = {
  xs: { box: "size-6", text: "text-2xs", icon: "size-[13px]", dot: "size-2" },
  sm: { box: "size-8", text: "text-xs", icon: "size-[18px]", dot: "size-2.5" },
  default: { box: "size-10", text: "text-sm", icon: "size-[22px]", dot: "size-3" },
  lg: { box: "size-12", text: "text-base", icon: "size-[26px]", dot: "size-3.5" },
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  /** 이니셜. 한글 1자 · 영문 2자. 있으면 아이콘보다 우선합니다. */
  initial?: string;
  src?: string;
  /** 사진의 대체 텍스트. 이름을 넣으세요. */
  alt?: string;
  status?: "online" | "offline";
}

export function Avatar({
  size = "default",
  initial,
  src,
  alt,
  status,
  className,
  ...props
}: AvatarProps) {
  const s = sizeMap[size];
  const hasImage = !!src;
  const hasInitial = !hasImage && !!initial;

  return (
    <span className={cn("relative inline-flex shrink-0", className)} {...props}>
      <span
        className={cn(
          "grid place-items-center overflow-hidden rounded-full",
          s.box,
          hasInitial ? "bg-avatar-surface-primary" : "bg-avatar-surface"
        )}
      >
        {hasImage ? (
          <img src={src} alt={alt ?? ""} className="size-full object-cover" />
        ) : hasInitial ? (
          <span className={cn("font-medium text-avatar-text-primary", s.text)}>{initial}</span>
        ) : (
          <User className={cn("text-avatar-text", s.icon)} aria-hidden />
        )}
      </span>

      {status && (
        <span
          className={cn(
            // 흰 링 2px — 사진 위에서도 점이 묻히지 않습니다
            "absolute right-0 bottom-0 rounded-full ring-2 ring-avatar-ring",
            s.dot,
            status === "online" ? "bg-avatar-status-online" : "bg-avatar-status-offline"
          )}
          aria-label={status === "online" ? "접속 중" : "오프라인"}
          role="img"
        />
      )}
    </span>
  );
}
