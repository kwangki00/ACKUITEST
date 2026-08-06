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
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  htmlFor?: string;
  size?: "sm" | "default" | "lg";
}

export function FormField({
  label,
  required,
  description,
  error,
  htmlFor,
  size = "default",
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
      {children}
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
