import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Figma: Badge (54 variants)
 * Tone 6 × Style 3 × Size 3
 * Dot 은 상태를 색으로만 보여줄 때 씁니다.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium whitespace-nowrap rounded-full",
  {
    variants: {
      tone: { neutral: "", primary: "", info: "", success: "", warning: "", danger: "" },
      styleVariant: { soft: "", solid: "", outline: "border" },
      size: {
        sm: "h-5 px-2 text-2xs",
        default: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
    },
    compoundVariants: [
      { tone: "neutral", styleVariant: "soft", class: "bg-badge-neutral-soft-fill text-badge-neutral-text" },
      { tone: "neutral", styleVariant: "solid", class: "bg-badge-neutral-solid-fill text-badge-neutral-solid-text" },
      { tone: "neutral", styleVariant: "outline", class: "border-badge-neutral-border text-badge-neutral-text" },
      { tone: "primary", styleVariant: "soft", class: "bg-badge-primary-soft-fill text-badge-primary-text" },
      { tone: "primary", styleVariant: "solid", class: "bg-badge-primary-solid-fill text-badge-primary-solid-text" },
      { tone: "primary", styleVariant: "outline", class: "border-badge-primary-border text-badge-primary-text" },
      { tone: "info", styleVariant: "soft", class: "bg-badge-info-soft-fill text-badge-info-text" },
      { tone: "info", styleVariant: "solid", class: "bg-badge-info-solid-fill text-badge-info-solid-text" },
      { tone: "info", styleVariant: "outline", class: "border-badge-info-border text-badge-info-text" },
      { tone: "success", styleVariant: "soft", class: "bg-badge-success-soft-fill text-badge-success-text" },
      { tone: "success", styleVariant: "solid", class: "bg-badge-success-solid-fill text-badge-success-solid-text" },
      { tone: "success", styleVariant: "outline", class: "border-badge-success-border text-badge-success-text" },
      { tone: "warning", styleVariant: "soft", class: "bg-badge-warning-soft-fill text-badge-warning-text" },
      { tone: "warning", styleVariant: "solid", class: "bg-badge-warning-solid-fill text-badge-warning-solid-text" },
      { tone: "warning", styleVariant: "outline", class: "border-badge-warning-border text-badge-warning-text" },
      { tone: "danger", styleVariant: "soft", class: "bg-badge-danger-soft-fill text-badge-danger-text" },
      { tone: "danger", styleVariant: "solid", class: "bg-badge-danger-solid-fill text-badge-danger-solid-text" },
      { tone: "danger", styleVariant: "outline", class: "border-badge-danger-border text-badge-danger-text" },
    ],
    defaultVariants: { tone: "neutral", styleVariant: "soft", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, tone, styleVariant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, styleVariant, size }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export { badgeVariants };
