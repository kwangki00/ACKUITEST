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
 *
 * ---
 *
 * ### 라벨과 컨트롤은 자동으로 묶입니다 (2026-08-10)
 *
 * ```tsx
 * <FormField label="검사 코드"><Input /></FormField>   // 이게 전부입니다
 * ```
 *
 * `htmlFor` 도 `id` 도 넘기지 마세요. 이 컴포넌트가 `useId()` 로 id 셋을 만들어
 * 컨텍스트로 내려주고, 안쪽 컨트롤이 집어 씁니다.
 *
 * **연결을 호출부에 시키면 반드시 빠집니다** — 이 저장소에서도 `FormField` 60곳 중
 * 26곳만 넘기고 있었습니다. 나머지 34곳은 스크린리더로 가면 **무엇을 입력하는
 * 칸인지 안 읽혔습니다.** 빠져도 화면은 멀쩡해서 알아챌 방법이 없습니다.
 *
 * 예전 프로젝트에서 `InputField` · `SelectField` 처럼 **라벨을 컨트롤 안에 넣어**
 * 쓴 이유가 이것이었습니다. 원인은 조립 방식이 아니라 **연결을 손으로 시키는 것**
 * 이었고, 그게 없어졌으니 조립을 유지합니다 — Figma 도 `Control` 축 7종을 둔
 * 구조라 `children` 이 1:1 입니다.
 *
 * ### div 는 `<label for>` 로 못 묶습니다
 *
 * `<label for>` 는 **labelable 요소**(`input` · `textarea` · `select` …)에만 걸립니다.
 * `SelectTrigger` 는 안에 삭제·Clear 버튼이 들어가야 해서 `<div role="combobox">`
 * 인데, 여기에 `for` 를 겨누면 **조용히 아무 일도 안 일어납니다.** 그래서 두 갈래입니다.
 *
 * | 컨트롤 | 무엇으로 묶나 |
 * |---|---|
 * | `Input` · `Textarea` · `NativeSelect` | `controlId` 를 자기 `id` 로 (`<label for>` 의 짝) |
 * | `SelectTrigger` — `Select` · `Combobox` · `Lookup` · `MobileSelect` | `labelId` 를 **`aria-labelledby`** 로 |
 *
 * 설명·에러는 둘 다 `describedById` 를 `aria-describedby` 로 받습니다.
 *
 * ### 직접 준 것이 이깁니다
 *
 * `id` · `aria-label` · `aria-labelledby` 중 하나라도 직접 넘겼으면 컨텍스트를
 * 쓰지 않습니다. **이 규칙이 패널 안 검색창의 오염을 막습니다** — React 컨텍스트는
 * Portal 을 통과하므로 `ComboboxPanel` · `LookupPanel` 의 검색창과 달력의 년·월
 * `Select` 가 바깥 `FormField` 의 id 를 집어갈 수 있는데, 셋 다 이미 `aria-label`
 * 을 갖고 있어 걸러집니다.
 *
 * `Checkbox` · `Radio` · `Switch` 는 **자기 라벨을 스스로** 답니다 (박스 옆 글자).
 * 이 컨텍스트를 읽지 않습니다.
 */
/** 이 필드가 안쪽 컨트롤에 내려주는 것들입니다. 근거는 위 머리말에 있습니다. */
export interface FormFieldContextValue {
  /** 시트 머리글에도 쓰입니다 — `MobileSelect` 가 같은 글자를 두 번 적지 않게. */
  label?: string;
  /** `<label htmlFor>` 이 가리키는 id. 네이티브 컨트롤이 자기 `id` 로 씁니다. */
  controlId: string;
  /** `<label>` 자신의 id. **div 기반 트리거가 `aria-labelledby` 로** 씁니다. */
  labelId: string;
  /** 설명·에러가 있을 때만. 컨트롤이 `aria-describedby` 로 씁니다. */
  describedById?: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/** 감싸고 있는 `FormField` 가 알려주는 것들. 밖이면 `null`. */
export function useFormField() {
  return React.useContext(FormFieldContext);
}

/** 감싸고 있는 `FormField` 의 라벨. 없으면 `undefined`. */
export function useFormFieldLabel() {
  return React.useContext(FormFieldContext)?.label;
}

export interface FieldBindingArgs {
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  /**
   * `<label for>` 가 걸리는 요소인가 — `input` · `textarea` · `select` 는 `true`.
   * `<div role="combobox">` 는 `false` 라 `aria-labelledby` 로 묶습니다.
   */
  labelable?: boolean;
}

/**
 * 감싸고 있는 `FormField` 와 자기를 묶습니다. **직접 준 것이 있으면 그게 이깁니다.**
 *
 * 컨트롤마다 같은 판단을 되풀이하지 않으려고 한 곳에 뒀습니다 — 네 갈래가 있고
 * 하나만 어긋나도 그 칸만 조용히 이름을 잃습니다.
 *
 * | 상황 | 무엇으로 묶나 |
 * |---|---|
 * | 아무것도 안 준 labelable | 필드의 `controlId` 를 자기 `id` 로 (`<label for>` 의 짝) |
 * | **`id` 를 직접 준** labelable | `<label for>` 가 헛돌므로 **`aria-labelledby`** 로 |
 * | labelable 이 아님 (`SelectTrigger`) | 늘 `aria-labelledby` |
 * | `aria-label`·`aria-labelledby` 를 직접 줌 | **아무것도 안 합니다** — 패널 검색창이 여기 걸립니다 |
 *
 * 마지막 줄은 설명(`aria-describedby`)까지 포함합니다. 스스로 이름을 대는 것은
 * **이 필드의 컨트롤이 아니라는 뜻**이라, 필드의 설명을 읽을 이유가 없습니다 —
 * 안 그러면 패널 검색창이 "검색, 여러 항목은 쉼표로 구분합니다" 로 읽힙니다.
 */
export function useFieldBinding({
  id,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  labelable = true,
}: FieldBindingArgs) {
  const field = useFormField();
  const named = ariaLabel != null || ariaLabelledBy != null;
  const ownId = labelable && !named ? (id ?? field?.controlId) : id;
  return {
    id: ownId,
    "aria-label": ariaLabel,
    "aria-labelledby":
      ariaLabelledBy ??
      (named || !field || ownId === field.controlId ? undefined : field.labelId),
    "aria-describedby": ariaDescribedBy ?? (named ? undefined : field?.describedById),
  };
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  /**
   * **보통은 넘기지 않습니다.** 안 넘기면 이 컴포넌트가 id 를 만들어 안쪽 컨트롤과
   * 자동으로 묶습니다. 컨트롤을 직접 그려서 id 를 이미 갖고 있을 때만 쓰세요.
   */
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
  const uid = React.useId();
  const ctx = React.useMemo<FormFieldContextValue>(
    () => ({
      label,
      // htmlFor 를 직접 넘겼으면 그게 이깁니다 — 컨트롤을 직접 그리는 경우
      controlId: htmlFor ?? `${uid}-control`,
      labelId: `${uid}-label`,
      describedById: description || error ? `${uid}-desc` : undefined,
    }),
    [label, htmlFor, uid, description, error]
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {label && (
        <label
          id={ctx.labelId}
          htmlFor={ctx.controlId}
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
      <FormFieldContext.Provider value={ctx}>{children}</FormFieldContext.Provider>
      {description && !error && (
        <p id={ctx.describedById} className="text-xs text-text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={ctx.describedById} className="text-xs text-text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
