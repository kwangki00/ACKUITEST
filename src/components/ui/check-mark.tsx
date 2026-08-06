import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: CheckMark (9 변형 — Size 3 × Tone 3)
 *
 * 박스 없는 순수 체크 표식입니다. Checkbox 와 용도가 다릅니다.
 * Checkbox 는 사용자가 누르는 입력이고, CheckMark 는 결과를 보여주기만 합니다.
 * **누를 수 있어야 하면 CheckMark 가 아니라 Checkbox 를 쓰세요.**
 *
 * 사용처 — Select · Combobox 의 선택된 항목 표시, 완료 상태, 목록 선택 인디케이터.
 * 코드로는 SelectItem · CommandItem 안의 <Check /> 자리입니다.
 *
 * 스트로크는 지정하지 않습니다 — index.css 의 .lucide 규칙이 1.5 로 맞춥니다.
 */

type Size = "sm" | "default" | "lg";
type Tone = "primary" | "success" | "disabled";

const sizeMap: Record<Size, string> = {
  sm: "size-[14px]",
  default: "size-4",
  lg: "size-5",
};

const toneMap: Record<Tone, string> = {
  primary: "text-icon-primary",
  success: "text-icon-success",
  disabled: "text-icon-disabled-on",
};

export interface CheckMarkProps extends Omit<React.SVGAttributes<SVGSVGElement>, "children"> {
  size?: Size;
  tone?: Tone;
}

export function CheckMark({
  size = "default",
  tone = "primary",
  className,
  ...props
}: CheckMarkProps) {
  // 대개 옆의 텍스트가 이미 상태를 말합니다. 그럴 땐 보조기술에 중복으로 읽히지
  // 않도록 숨깁니다. 표식 자체가 유일한 단서면 aria-label 을 주세요 — 그때만 노출됩니다.
  const labelled = props["aria-label"] != null || props["aria-labelledby"] != null;
  return (
    <Check
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("shrink-0", sizeMap[size], toneMap[tone], className)}
      {...props}
    />
  );
}
