import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: InputGroup (6 변형 — Size 3 × Attached 2)
 *
 * 입력창 + 액션 버튼 조합입니다. 검색·조회·중복확인처럼
 * 입력값을 가지고 바로 무언가를 하는 자리에 씁니다.
 *
 * Attached=true 는 맞닿는 모서리를 없애 하나의 덩어리로 보이게 합니다.
 * Figma 에서는 이 반경이 **변수 바인딩이 아닌 직접 값**이라, Radius 토큰을 바꿔도
 * 붙은 쪽은 따라오지 않습니다. 코드는 자식 선택자로 처리하므로 그 문제가 없습니다.
 *
 * 크기는 그룹이 내려줍니다 — Input 과 Button 에 따로 주면 높이가 어긋납니다.
 * 아이콘 버튼을 넣을 때만 예외로 icon-sm · icon · icon-lg 를 직접 지정하세요
 * (같은 --h-input-* 를 쓰므로 높이는 맞습니다).
 */

export type InputGroupSize = "sm" | "default" | "lg";

export const InputGroupContext = React.createContext<{ size?: InputGroupSize } | null>(null);

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: InputGroupSize;
  /** 모서리를 붙여 한 덩어리로 보이게 합니다. 기본은 8px 띄웁니다. */
  attached?: boolean;
}

export function InputGroup({
  size = "default",
  attached,
  className,
  children,
  ...props
}: InputGroupProps) {
  const ctx = React.useMemo(() => ({ size }), [size]);
  return (
    <InputGroupContext.Provider value={ctx}>
      <div
        className={cn(
          "flex w-full items-center",
          attached
            ? cn(
                "gap-0",
                // 맞닿는 쪽 모서리만 지웁니다. 항목이 몇 개든 자동입니다
                "[&>*:not(:last-child)]:rounded-r-none",
                "[&>*:not(:first-child)]:rounded-l-none"
              )
            : "gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}
