import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Figma: Button (224 variants)
 * Variant 7 × Size 8 × State 2 × Shape 2
 *
 * State=Disabled 는 opacity 가 아니라 토큰으로 표현합니다.
 * hover · active 는 같은 색의 /90 · /80 이 아니라 전용 토큰을 씁니다.
 * 높이는 --h-input-* 변수라 PC/모바일에서 자동으로 바뀝니다.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-colors select-none",
    "focus-visible:ring-[3px] focus-visible:ring-action-focus-ring focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:bg-button-disabled-fill",
    "disabled:text-text-disabled-on disabled:border-button-disabled-border",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      // Figma 가 variant 별 Focus 토큰을 따로 두는 것(default·secondary·outline)은
      // 그대로 씁니다. 나머지는 공통 Action/Focus-Ring 이라 기본값을 씁니다.
      variant: {
        default:
          "bg-button-primary-fill text-text-basic-inverse hover:bg-button-primary-fill-hover active:bg-button-primary-fill-active focus-visible:bg-button-primary-fill-focus focus-visible:ring-button-primary-fill-focus-border",
        secondary:
          "bg-button-secondary-fill text-text-basic hover:bg-button-secondary-fill-hover active:bg-button-secondary-fill-active focus-visible:bg-button-secondary-fill-focus focus-visible:ring-button-secondary-fill-focus-border",
        destructive:
          "bg-button-destructive-fill text-text-basic-inverse hover:bg-button-destructive-fill-hover active:bg-button-destructive-fill-active",
        outline:
          "border border-button-tertiary-fill-border bg-button-tertiary-fill text-text-basic hover:bg-button-tertiary-fill-hover active:bg-button-tertiary-fill-active focus-visible:bg-button-tertiary-fill-focus focus-visible:ring-button-tertiary-fill-focus-border",
        ghost:
          "text-text-basic hover:bg-button-text-fill-hover active:bg-button-text-fill-pressed",
        link: "text-text-primary underline-offset-4 hover:underline",
        // 누르는 동안 글자를 한 단계 더 어둡게 — 배경이 Primary/300 까지
        // 진해져서 Primary-Strong 으로는 대비가 3.39:1 밖에 안 나옵니다
        soft: "bg-button-soft-fill text-text-primary-strong hover:bg-button-soft-fill-hover active:bg-button-soft-fill-active active:text-text-primary-stronger",
      },
      // 반경은 4개 사이즈 모두 Radius/md(6) 입니다 — Figma 가 사이즈별로 반경을
      // 키우지 않습니다. 글자는 xs 12 · sm 14 · default 14 · lg 18.
      size: {
        xs: "h-[var(--h-input-xs)] px-2 gap-1 text-xs rounded-md",
        sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-sm rounded-md",
        default: "h-[var(--h-input-default)] px-4 gap-2 text-sm rounded-md",
        lg: "h-[var(--h-input-lg)] px-6 gap-2 text-lg rounded-md",
        "icon-xs": "size-[var(--h-input-xs)] rounded-md",
        "icon-sm": "size-[var(--h-input-sm)] rounded-md",
        icon: "size-[var(--h-input-default)] rounded-md",
        "icon-lg": "size-[var(--h-input-lg)] rounded-md",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default", shape: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
