import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: FormField (42 variants)
 * Size 3 × State 2 × Control 7
 *
 * 라벨은 Text/sm/Medium(14) — 값과 같은 크기이고 굵기로만 구분합니다.
 * Table 이 헤더·본문을 굵기로만 나누는 것과 같은 규칙입니다.
 * 12 였을 때는 한글이 뭉개져 종일 보는 화면에 빡빡했습니다.
 *
 * 라벨을 Regular 로 내리면 안 됩니다 — 값도 14 Regular 에 같은 색(Text/Basic)이라
 * 크기·굵기·색 세 축이 전부 같아져 위치 말고는 구분할 단서가 사라집니다.
 *
 * 설명·에러는 12 로 둡니다. 보조 정보라 라벨보다 작아야 하고,
 * 색(Muted-Foreground · Danger)과 위치로 이미 구분됩니다.
 * 에러 메시지는 State=Error 일 때만 보입니다.
 *
 * **`size` prop 은 없습니다.** Figma 의 Size 축은 래퍼가 아니라 **안쪽 컨트롤의 높이**라,
 * `<Input size="lg" />` 처럼 컨트롤에 직접 줍니다. 래퍼에 받아봐야 쓸 데가 없어
 * 받기만 하고 아무 데도 안 쓰는 prop 이었습니다 (2026-08-07 제거).
 */
/**
 * 이 필드의 라벨을 안쪽에 알려줍니다.
 *
 * 시트로 열리는 컨트롤(`MobileSelect`)은 **시트 머리글**이 따로 필요한데, 그건 결국
 * 필드 라벨과 같은 글자입니다. 이게 없으면 호출부가 같은 글자를 두 번 적어야 하고
 * — 빠뜨리면 머리글이 "선택" 이라는 기본값으로 조용히 밋밋해집니다.
 */
const FormFieldLabelContext = React.createContext<string | undefined>(undefined);

/** 감싸고 있는 `FormField` 의 라벨. 없으면 `undefined`. */
export function useFormFieldLabel() {
  return React.useContext(FormFieldLabelContext);
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  required,
  description,
  error,
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-0.5 text-sm font-medium text-text-basic"
        >
          {label}
          {required && (
            <span className="text-text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <FormFieldLabelContext.Provider value={label}>{children}</FormFieldLabelContext.Provider>
      {description && !error && (
        <p className="text-xs text-text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
