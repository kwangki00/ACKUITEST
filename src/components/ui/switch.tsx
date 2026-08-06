import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: Switch (8 변형 — Size 2 × Checked 2 × State 2)
 *
 * 켜고 끄면 **즉시 적용되는** 설정에 씁니다 — 저장 버튼 없이 바로 반영되는 경우.
 * 제출해야 값이 반영되는 폼 항목은 Switch 가 아니라 Checkbox 를 쓰세요.
 * 사용자는 스위치를 누른 순간 이미 적용됐다고 받아들입니다.
 *
 * 상태를 알리는 주된 신호는 **썸 위치**이고 색은 보조입니다 — 색만으로 구분하지 않습니다.
 * Off 트랙이 gray/400 인 이유는 gray/300 이 흰 배경 대비 1.47:1 이라 거의 안 보이기 때문입니다.
 *
 * 라벨 간격은 두 사이즈 모두 8 입니다 (Checkbox·Radio 는 6/8 로 갈립니다).
 */

type Size = "sm" | "default";

const sizeMap: Record<Size, { root: string; track: string; thumb: string; on: string }> = {
  // 트랙 32×18 · 썸 14 · 안쪽 여백 2 → 이동 거리 32−14−4 = 14
  sm: {
    root: "h-[var(--h-control-sm)] text-xs",
    track: "h-[18px] w-8",
    thumb: "size-[14px]",
    on: "peer-checked:[&>span]:translate-x-[14px]",
  },
  // 트랙 36×20 · 썸 16 · 안쪽 여백 2 → 이동 거리 36−16−4 = 16
  default: {
    root: "h-[var(--h-control-default)] text-sm",
    track: "h-5 w-9",
    thumb: "size-4",
    on: "peer-checked:[&>span]:translate-x-4",
  },
};

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role"> {
  size?: Size;
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = "default", label, checked, disabled, id, ...props }, ref) => {
    const s = sizeMap[size];
    const autoId = React.useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2 select-none",
          s.root,
          disabled ? "cursor-not-allowed text-text-disabled-on" : "cursor-pointer text-text-basic",
          className
        )}
      >
        <span className="relative inline-flex">
          {/* role=switch 를 얹은 네이티브 체크박스입니다 — aria-checked 는 브라우저가 채웁니다 */}
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              s.track,
              "inline-flex items-center rounded-full p-0.5 transition-colors",
              "bg-switch-track-off peer-checked:bg-switch-track-on",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-action-focus-ring",
              // 꺼짐·켜짐 모두 같은 회색이 됩니다 — 비활성은 상태보다 조작 불가가 먼저입니다
              "peer-disabled:bg-switch-track-disabled",
              // peer-* 는 형제만 고릅니다. 썸은 트랙의 자손이라 여기서 걸어야 합니다
              s.on,
              "peer-disabled:[&>span]:bg-switch-thumb-disabled"
            )}
          >
            <span
              className={cn(s.thumb, "rounded-full bg-switch-thumb transition-transform")}
            />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
