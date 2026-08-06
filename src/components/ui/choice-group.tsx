import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: ChoiceGroup (4 변형 — Type 2 × Direction 2)
 *
 * 체크박스·라디오를 여러 개 묶는 그룹입니다. FormField 의 Control 자리에 들어가
 * "라벨 + 선택지 목록" 형태를 만듭니다.
 *
 * Figma 축과 코드가 다른 두 가지 — 둘 다 코드에서는 필요 없는 장치라 뺐습니다.
 * - Type(Checkbox/Radio) : 어떤 자식을 넣느냐로 정해집니다.
 * - Item 2~6 불리언      : Figma 가 자식 개수를 흉내내는 장치입니다.
 *
 * 단일 체크박스(약관 동의 등)는 이 그룹을 쓰지 마세요 — 라벨이 옆에 오는
 * 다른 패턴이라 Checkbox 를 그대로 씁니다.
 */

export type ChoiceDirection = "vertical" | "horizontal";
type Size = "sm" | "default";

export interface ChoiceGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Vertical 이 기본입니다. 짧은 선택지 2~3개일 때만 horizontal. */
  direction?: ChoiceDirection;
}

/**
 * 간격의 유일한 출처입니다 — 세로 10 · 가로 20(줄바꿈 시 행간 10).
 * RadioGroup·CheckboxGroup 모두 이걸 거치므로 값이 두 벌이 되지 않습니다.
 */
export function ChoiceGroup({ direction = "vertical", className, ...props }: ChoiceGroupProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col gap-2.5" : "flex-row flex-wrap gap-x-5 gap-y-2.5",
        className
      )}
      {...props}
    />
  );
}

/** CheckboxGroup 이 자식 Checkbox 에 내려주는 값입니다. */
export const CheckboxGroupContext = React.createContext<{
  name?: string;
  values?: string[];
  onToggle?: (value: string, checked: boolean) => void;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
} | null>(null);

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  /** 선택된 값들. 라디오와 달리 여러 개입니다. */
  value?: string[];
  onValueChange?: (value: string[]) => void;
  direction?: ChoiceDirection;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
}

/**
 * Figma 의 ChoiceGroup(Type=Checkbox)에 대응합니다.
 *
 * role 을 group 으로 둡니다 — radiogroup 과 달리 체크박스 묶음에는
 * 전용 role 이 없고, 방향키로 옮겨다니지도 않습니다(각 항목이 Tab 대상입니다).
 * 무엇을 고르는 묶음인지 aria-label 이나 aria-labelledby 로 알려주세요.
 */
export function CheckboxGroup({
  name,
  value,
  onValueChange,
  direction = "vertical",
  size = "default",
  disabled,
  error,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  const ctx = React.useMemo(
    () => ({
      name,
      values: value,
      size,
      disabled,
      error,
      onToggle: (v: string, checked: boolean) => {
        if (!onValueChange) return;
        const cur = value ?? [];
        onValueChange(checked ? [...cur, v] : cur.filter((x) => x !== v));
      },
    }),
    [name, value, onValueChange, size, disabled, error]
  );

  return (
    <CheckboxGroupContext.Provider value={ctx}>
      <ChoiceGroup role="group" direction={direction} className={className} {...props}>
        {children}
      </ChoiceGroup>
    </CheckboxGroupContext.Provider>
  );
}
