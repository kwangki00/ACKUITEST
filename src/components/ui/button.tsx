import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroupContext } from "@/components/ui/input-group";

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
      /**
       * 반경은 8개 사이즈 모두 Radius/md(6) 입니다 — Figma 가 사이즈별로 반경을 키우지 않습니다.
       *
       * | | 높이 | 좌우 | 간격 | 글자 | 아이콘 |
       * |---|---|---|---|---|---|
       * | xs | 24 | 8 | 4 | 12 | 14 |
       * | sm | 32 | 12 | 6 | 14 | 16 |
       * | default | 36 | 16 | 8 | 14 | 16 |
       * | lg | 48 | 24 | 8 | **18** | **20** |
       * | icon-xs | 24 | — | — | — | 12 |
       * | icon-sm | 32 | — | — | — | 16 |
       * | icon | 36 | — | — | — | **18** |
       * | icon-lg | 48 | — | — | — | **24** |
       *
       * 아이콘 전용은 글자 옆에 설 때와 크기가 다릅니다 — 혼자 있으면 조금 더 큽니다.
       * 크기를 안 정하면 lucide 기본값 24 로 나와 전 사이즈가 어긋납니다.
       */
      size: {
        xs: "h-[var(--h-input-xs)] px-2 gap-1 text-xs rounded-md [&_svg]:size-3.5",
        sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-sm rounded-md [&_svg]:size-4",
        default: "h-[var(--h-input-default)] px-4 gap-2 text-sm rounded-md [&_svg]:size-4",
        lg: "h-[var(--h-input-lg)] px-6 gap-2 text-lg rounded-md [&_svg]:size-5",
        "icon-xs": "size-[var(--h-input-xs)] rounded-md [&_svg]:size-3",
        "icon-sm": "size-[var(--h-input-sm)] rounded-md [&_svg]:size-4",
        icon: "size-[var(--h-input-default)] rounded-md [&_svg]:size-[18px]",
        "icon-lg": "size-[var(--h-input-lg)] rounded-md [&_svg]:size-6",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      // link 는 좌우 여백이 없습니다 — 글자 자체가 누름 대상이라
      // 여백이 있으면 밑줄과 클릭 영역이 어긋나 보입니다 (Figma 도 padding 0).
      // size 뒤에 붙어야 px-* 를 이기므로 compound 로 둡니다.
      { variant: "link", class: "px-0" },
      // 바탕이 없는 두 variant 는 비활성일 때도 바탕이 없습니다.
      // 평상시 투명하던 것이 눌리지 않게 되면서 갑자기 회색 판이 생기면,
      // 없던 요소가 나타난 것처럼 보입니다 — Figma 도 Button/Text-Fill(투명) 그대로입니다.
      { variant: "ghost", class: "disabled:bg-transparent" },
      { variant: "link", class: "disabled:bg-transparent" },
    ],
    defaultVariants: { variant: "default", size: "default", shape: "default" },
  }
);

/** 라벨이 없는 정사각 버튼 — 아이콘 하나만 들어갑니다. */
type IconOnlySize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";
type LabelledSize = "xs" | "sm" | "default" | "lg";

type ButtonBase = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    loading?: boolean;
  };

/**
 * `size` 가 아이콘 전용이면 **`aria-label` 이 필수**입니다.
 *
 * 아이콘만 있는 버튼은 화면에 글자가 없어서, 라벨을 빠뜨리면 보조기술에
 * 읽을 것이 아무것도 없습니다 — 버튼이 있다는 사실만 전해지고 무슨 버튼인지는 모릅니다.
 * Figma 문서에도 "icon 계열은 aria-label 이 필수" 라고 적혀 있는데
 * 코드가 강제하지 않아 빠뜨려도 통과했습니다 (2026-08-07 타입으로 막음).
 *
 * 눈으로 보는 사람에게도 아이콘만으로는 기능을 알기 어려우니 Tooltip 을 함께 쓰세요.
 *
 * `size` 를 변수로 넘기는 자리에서는 타입이 좁혀지지 않아 항상 라벨을 요구합니다.
 * 그때는 라벨을 주는 편이 맞습니다 — 어떤 크기가 올지 모른다는 뜻이니까요.
 */
export type ButtonProps = ButtonBase &
  (
    | { size?: LabelledSize; "aria-label"?: string }
    | { size: IconOnlySize; "aria-label": string }
  );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, loading, children, disabled, onClick, ...props }, ref) => {
    // InputGroup 안이면 그룹 크기를 따릅니다. 아이콘 버튼처럼 직접 지정하면 그쪽이 이깁니다
    const group = React.useContext(InputGroupContext);
    const s = size ?? group?.size ?? undefined;
    const busy = !!loading;

    /*
      로딩은 비활성이 아닙니다.

      disabled 속성을 켜면 Button/Disabled-Fill 이 덮여 회색이 됩니다.
      Figma 는 Loading 을 State 와 별개 축으로 두어 로딩 중에도 제 색을 지킵니다 —
      "지금 처리 중" 과 "지금은 누를 수 없음" 은 다른 이야기라서입니다.
      회색으로 변하면 눌러서 시작한 동작이 취소된 것처럼 보입니다.

      그래서 색을 지키면서 누르기만 막습니다. 포커스도 남습니다 —
      disabled 는 포커스를 잃게 만들어 키보드 사용자가 위치를 놓칩니다.
    */
    return (
      <button
        ref={ref}
        /*
          **기본은 `button` 입니다** (2026-08-12). HTML 기본값은 `submit` 이라, 폼 안에
          놓기만 해도 누르는 순간 제출됩니다 — 「취소」나 「조건 변경」처럼 제출과
          상관없는 버튼이 폼에 들어가는 날 조용히 터집니다.

          **`{...props}` 보다 앞에 둡니다** — 진짜 제출 버튼은 `type="submit"` 을
          적어서 이깁니다.
        */
        type="button"
        className={cn(
          buttonVariants({ variant, size: s, shape }),
          busy && "pointer-events-none",
          className
        )}
        disabled={disabled}
        aria-disabled={busy || undefined}
        aria-busy={busy || undefined}
        onClick={(e) => {
          // 마우스는 pointer-events 로 막히지만 Enter·Space 는 그대로 들어옵니다.
          // 폼 안이라면 제출까지 이어지므로 여기서 끊습니다
          if (busy) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        {...props}
      >
        {/* 크기를 직접 주지 않습니다 — size 축의 [&_svg]:size-* 가 맡습니다.
            Figma 도 Spinner 가 Icon 과 같은 크기입니다 (xs 14 · sm·default 16 · lg 20) */}
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
