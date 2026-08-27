import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFieldBinding } from "@/components/ui/form-field";
import { InputGroupContext } from "@/components/ui/input-group";

/**
 * Figma: Input (48 변형 — Size 4 × State 6 × Content 2)
 *
 * `<input>` 은 자식을 가질 수 없어, 아이콘·단위·클리어가 붙으면
 * **바깥 래퍼가 테두리를 그리고** 안쪽 input 은 테두리를 없앱니다.
 *
 * Figma 의 State 6 중 `Focus` · `Error-Focus` 는 변형이 아니라 CSS 로 처리합니다 —
 * 마우스 사용자에게는 보이지 않는 상태라 코드에서 상태 값으로 둘 이유가 없습니다.
 * 그래서 `state` 는 4개이고, 포커스는 `focus-within` 이 얹습니다.
 *
 * **폭을 고정하지 마세요.** 부모가 폭을 정하게 두면 아이콘이 잘리지 않습니다.
 */
type Size = "sm" | "default" | "lg" | "grid";
type State = "default" | "error" | "disabled" | "readonly";

/**
 * 크기 축 — Figma 값 그대로입니다.
 *
 * | | 높이 | 좌우 | 간격 | 글자 | 아이콘 | 반경 |
 * |---|---|---|---|---|---|---|
 * | grid | 34 | 8 | 8 | 14 | 16 | sm(4) |
 * | sm | 32 | 12 | 6 | 14 | 16 | md(6) |
 * | default | 36 | 12 | 8 | 14 | 16 | md(6) |
 * | lg | 48 | 16 | 8 | **16** | **20** | md(6) |
 *
 * 모바일은 16px 이상이어야 iOS 가 포커스 시 화면을 확대하지 않습니다.
 * 줄이는 시점은 lg(1024) — Responsive 변수가 PC 로 갈리는 지점과 같아야
 * 높이는 모바일인데 글자만 PC 인 구간이 생기지 않습니다.
 */
const sizeMap: Record<Size, string> = {
  sm: "h-[var(--h-input-sm)] px-3 gap-1.5 text-[length:var(--text-input)] leading-[var(--leading-input)] tracking-[var(--text-sm--letter-spacing)] rounded-md [&_svg]:size-4",
  default: "h-[var(--h-input-default)] px-3 gap-2 text-[length:var(--text-input)] leading-[var(--leading-input)] tracking-[var(--text-sm--letter-spacing)] rounded-md [&_svg]:size-4",
  lg: "h-[var(--h-input-lg)] px-4 gap-2 text-base rounded-md [&_svg]:size-5",
  grid: "h-[var(--h-datagrid)] px-2 gap-2 text-[length:var(--text-input)] leading-[var(--leading-input)] tracking-[var(--text-sm--letter-spacing)] rounded-sm [&_svg]:size-4",
};

const stateMap: Record<State, string> = {
  default:
    "bg-input-surface border-input-border focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-input-border-disabled",
  readonly: "bg-input-surface-readonly border-input-border-readonly",
};

/**
 * grid 는 데이터그리드 셀에 녹아 있어야 합니다. 평상시 테두리도 배경도 없어
 * 행의 hover·selected 색이 그대로 비칩니다 — 흰 배경을 주면 행 위에 떠 보입니다.
 * (Figma 도 grid Default 의 채움이 `Alpha/Base0` 이고 테두리가 없습니다.)
 * 클릭해서 포커스가 오거나 에러일 때만 나타납니다.
 */
const gridStateMap: Record<State, string> = {
  default:
    "bg-transparent border-transparent focus-within:bg-input-surface focus-within:border-input-border-focus focus-within:ring-[3px] focus-within:ring-action-focus-ring",
  error:
    "bg-input-surface border-input-border-error focus-within:ring-[3px] focus-within:ring-action-focus-ring-danger",
  disabled: "bg-input-surface-disabled border-transparent",
  readonly: "bg-input-surface-readonly border-transparent",
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: Size;
  state?: State;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** 값 뒤에 붙는 단위 — 원 · kg · mL. 입력의 일부가 아니라 표시입니다. */
  unit?: string;
  /**
   * 지우기 버튼. 기본은 켬이고 **값이 있을 때만** 나타납니다 —
   * 빈 칸에 X 가 있으면 누를 것이 없는 버튼입니다.
   * disabled · readonly 에서도 숨깁니다. 지울 수 없는 값에 버튼이 있으면 눌러도 아무 일이 없습니다.
   *
   * 필수 항목이나 값이 늘 있어야 하는 칸에서는 `false` 로 끄세요.
   */
  clearable?: boolean;
  /**
   * 지운 뒤에 할 일. 넘기지 않아도 입력값은 비워지고 `onChange` 가 빈 값으로 발화합니다 —
   * 상태를 따로 정리해야 할 때만 쓰세요.
   */
  onClear?: () => void;
  /**
   * 값 정렬. 기본은 왼쪽이고, `unit` 이 있으면 오른쪽으로 붙습니다 —
   * 숫자는 자릿수를 맞춰 읽으므로 단위 바로 앞에 와야 합니다.
   * (Figma description 의 “단위가 붙는 입력은 Value 를 우측 정렬” 규칙)
   */
  align?: "left" | "right";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      state = "default",
      leadingIcon,
      trailingIcon,
      unit,
      clearable = true,
      onClear,
      align,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      id,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const group = React.useContext(InputGroupContext);
    /*
      감싸고 있는 FormField 의 id 를 집어 씁니다 — **직접 준 것이 있으면 그게 이깁니다.**
      이 규칙이 패널 안 검색창의 오염을 막습니다: React 컨텍스트는 Portal 을 통과해서
      ComboboxPanel · LookupPanel 의 검색창이 바깥 필드의 id 를 집어갈 수 있는데,
      그것들은 전부 aria-label 로 이름을 갖고 있어 여기서 걸러집니다.
    */
    const field = useFieldBinding({
      id,
      ariaLabel,
      ariaLabelledBy: props["aria-labelledby" as keyof typeof props] as string | undefined,
      ariaDescribedBy,
    });
    // InputGroup 안이면 그룹 크기를 따릅니다 — 따로 주면 버튼과 높이가 어긋납니다
    const s: Size = size ?? group?.size ?? "default";
    const resolved: State = disabled ? "disabled" : readOnly ? "readonly" : state;
    const alignRight = (align ?? (unit ? "right" : "left")) === "right";

    // 지우기 버튼을 내부에서 켜고 끄려면 값이 있는지 알아야 합니다.
    // controlled 는 prop 을 보면 되고, uncontrolled 는 DOM 이 값을 쥐고 있어
    // 입력이 올 때마다 따로 기억합니다.
    const controlled = value !== undefined;
    const [typed, setTyped] = React.useState(() => String(defaultValue ?? "") !== "");
    const hasValue = controlled ? String(value ?? "") !== "" : typed;

    // 지우기 버튼이 값을 비우려면 input 에 직접 닿아야 합니다.
    // 밖으로 넘기는 ref 와 별개로 내부 ref 를 둡니다.
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setTyped(e.target.value !== "");
      onChange?.(e);
    };

    /**
     * 값을 비웁니다.
     *
     * `el.value = ""` 만 하면 React 가 모릅니다 — 자기가 기억하는 값과 같으면
     * 이벤트를 흘려버립니다. 그래서 네이티브 setter 로 넣고 input 이벤트를 직접 띄웁니다.
     * 이러면 controlled 든 uncontrolled 든 부모의 onChange 가 빈 값으로 한 번 울립니다.
     */
    const clear = () => {
      const el = innerRef.current;
      if (el) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        setter?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        // 지우고 바로 다시 치는 흐름이라 커서를 남깁니다
        el.focus();
      }
      if (!controlled) setTyped(false);
      onClear?.();
    };

    // 아이콘·단위는 Disabled 에서 함께 흐려집니다 (Figma 의 Clear Button 이
    // Icon/Disabled-On, Unit 이 Text/Disabled 로 바뀌는 것과 같은 규칙입니다).
    const iconTone = disabled ? "text-icon-disabled-on" : "text-icon-muted-foreground";
    const unitTone = disabled ? "text-text-disabled" : "text-text-muted-foreground";

    return (
      <div
        className={cn(
          "flex w-full items-center border transition-colors",
          sizeMap[s],
          (s === "grid" ? gridStateMap : stateMap)[resolved],
          className
        )}
      >
        {leadingIcon && <span className={cn("shrink-0", iconTone)}>{leadingIcon}</span>}

        <input
          ref={innerRef}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // 마우스를 안 쓰는 사람도 지울 수 있어야 합니다.
            // 검색어를 비우는 동작이 Esc 인 것은 브라우저 검색창과 같은 관습입니다
            if (e.key === "Escape" && clearable && hasValue && !readOnly && !e.defaultPrevented) {
              e.preventDefault();
              clear();
            }
          }}
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-hidden",
            "text-text-basic placeholder:text-text-placeholder",
            "disabled:text-text-disabled disabled:cursor-not-allowed",
            alignRight && "text-right"
          )}
          {...field}
          {...props}
        />

        {unit && <span className={cn("shrink-0", unitTone)}>{unit}</span>}

        {/* 순서는 Figma 의 자식 순서 그대로입니다 — 값 · 단위 · 보조 아이콘 · 지우기.
            지우기가 가장 바깥이라 눌러야 할 것이 늘 같은 자리에 있습니다 */}
        {trailingIcon && <span className={cn("shrink-0", iconTone)}>{trailingIcon}</span>}

        {clearable && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            onClick={clear}
            aria-label="입력값 지우기"
            className={cn(
              "shrink-0 rounded-xs text-icon-muted-foreground hover:text-text-basic",
              "focus-visible:ring-2 focus-visible:ring-action-focus-ring focus-visible:outline-hidden"
            )}
          >
            <X />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
