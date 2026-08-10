import * as React from "react";
import { cn } from "@/lib/utils";
import { useFieldBinding } from "@/components/ui/form-field";

/**
 * Figma: Textarea (12 변형 — State 6 × Content 2)
 *
 * Input 과 **같은 상태 축·색 토큰**을 씁니다. 다른 점만 적습니다.
 *
 * 사이즈 축이 없습니다 — Figma 는 인스턴스를 세로로 늘려 쓰고,
 * 코드는 field-sizing-content 로 내용에 맞춰 자동으로 늘어납니다.
 * 아직 지원하지 않는 브라우저를 위해 min-h 를 함께 둡니다 (Figma 기본 100).
 *
 * Counter 는 기본 꺼짐입니다. 켜면 우측 하단에 붙습니다 —
 * 게시판·공문 등록처럼 길이 제한이 있는 폼에만 쓰세요.
 *
 * <textarea> 는 자식을 가질 수 없어 Counter 를 안에 넣지 못합니다.
 * 그래서 Input 과 같은 방식으로 **바깥 래퍼가 테두리를 그립니다.**
 */

type State = "default" | "error" | "disabled" | "readonly";

const stateMap: Record<State, string> = {
  default:
    "bg-input-surface border-input-border focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-input-border-disabled",
  readonly: "bg-input-surface-readonly border-input-border-readonly",
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: State;
  /** 우측 하단 글자 수. maxLength 와 함께 쓰면 12/200 으로 표시됩니다. */
  counter?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      state = "default",
      counter,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      maxLength,
      id,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const resolved: State = disabled ? "disabled" : readOnly ? "readonly" : state;
    /* FormField 의 id 를 집어 씁니다 — 직접 준 것이 있으면 그게 이깁니다 (Input 과 같은 규칙) */
    const field = useFieldBinding({ id, ariaLabel, ariaDescribedBy });

    // 제어·비제어 양쪽에서 글자 수가 맞아야 합니다.
    // 제어면 value 가 진실이고, 비제어면 입력을 따라가며 셉니다.
    const [typed, setTyped] = React.useState(() => String(defaultValue ?? "").length);
    const length = value != null ? String(value).length : typed;

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-2 rounded-md border px-3 py-2.5 transition-colors",
          stateMap[resolved],
          className
        )}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(e) => {
            setTyped(e.target.value.length);
            onChange?.(e);
          }}
          className={cn(
            "field-sizing-content min-h-[100px] w-full resize-none bg-transparent outline-hidden",
            // 모바일 16px 이상 — iOS 자동 확대 방지. Input 과 같은 규칙입니다
            "text-base lg:text-sm",
            "text-text-basic placeholder:text-text-placeholder",
            "disabled:cursor-not-allowed disabled:text-text-disabled"
          )}
          {...field}
          {...props}
        />
        {counter && (
          <p
            className={cn(
              "text-right text-xs tabular-nums",
              disabled ? "text-text-disabled" : "text-text-muted-foreground"
            )}
          >
            {maxLength != null ? `${length}/${maxLength}` : length}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
