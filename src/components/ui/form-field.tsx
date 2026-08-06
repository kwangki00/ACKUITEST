import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Figma: FormField (42 variants)
 * Size 3 × State 2 × Control 7
 *
 * 라벨은 Text/xs/Medium(12) — 값(14)보다 작게 두어 위계를 만듭니다.
 * 설명·에러도 12 지만 위치와 색이 달라 구분됩니다.
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
          className="flex items-center gap-0.5 text-xs font-medium text-text-basic"
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
