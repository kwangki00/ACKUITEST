import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ComboboxPanel, type ComboboxOption } from "@/components/ui/combobox-panel";
import {
  SelectTrigger,
  type SelectSize,
  type SelectState,
} from "@/components/ui/select-trigger";
import { MobileSelect } from "@/components/ui/mobile-select";
import { useOverlay, type OverlayMode } from "@/components/ui/pointer-mode";

/**
 * Figma: SelectTrigger — Render=Placeholder · Text
 *
 * Figma 구조를 그대로 옮긴 단일 선택입니다.
 * 트리거는 `SelectTrigger`, 목록은 Popover + ListItem — **목록도 토큰대로 그립니다.**
 *
 * | 필요한 것 | 쓸 것 |
 * |---|---|
 * | 하나만 고름 | **Select** |
 * | 검색이 필요 | `Combobox` (트리거 껍데기는 같습니다) |
 * | 여러 개 고름 | `Combobox type="multi"` |
 * | OS 선택기를 쓰고 싶음 | `NativeSelect` — 목록 모양이 디자인과 다릅니다 |
 *
 * 검색창이 없다는 것만 빼면 `Combobox` 와 같은 패널입니다.
 * 항목이 수십 개를 넘으면 `Combobox` 로 바꾸세요 — 눈으로 훑기 어려워집니다.
 */

export type SelectOption = ComboboxOption;

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  /** 화살표 왼쪽 해제 X. 필수 항목에는 쓰지 마세요. */
  clearable?: boolean;
  leadingIcon?: React.ReactNode;
  emptyText?: string;
  className?: string;
  /**
   * 붙은 라벨이 없을 때 무엇을 고르는 자리인지 알립니다.
   * `FormField` 로 감쌌다면 필요 없습니다 — 달력의 년·월처럼 라벨을 둘 자리가
   * 없는 곳에 씁니다.
   */
  "aria-label"?: string;
  /**
   * 어떻게 열지. **기본은 `PointerModeProvider` 가 정합니다** — 손가락이면 시트,
   * 마우스면 팝오버. 화면 하나만 예외로 두고 싶을 때만 직접 넘기세요.
   */
  overlay?: OverlayMode;
  /** 시트 머리글. 안 넘기면 `aria-label` 을 씁니다. */
  title?: string;
  /** 시트를 문서·데모 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

/**
 * 시트냐 팝오버냐만 고르는 얇은 껍데기입니다. 훅이 하나뿐이라 여기서 갈라도
 * 훅 순서가 어긋나지 않습니다 — 아래 두 구현은 각자 상태를 쥡니다.
 */
export function Select(props: SelectProps) {
  if (useOverlay(props.overlay) === "sheet") return <SheetSelect {...props} />;
  return <PopoverSelect {...props} />;
}

/**
 * 손가락일 때 — 목록을 다시 만들지 않고 `MobileSelect` 에 넘깁니다.
 * 값이 하나라 `단일 · 검색 없음` 으로 고정하고, 배열 ↔ 문자열만 바꿔 끼웁니다.
 */
function SheetSelect({
  options,
  value,
  onValueChange,
  placeholder,
  size,
  state,
  disabled,
  emptyText,
  className,
  title,
  container,
  "aria-label": ariaLabel,
}: SelectProps) {
  return (
    <MobileSelect
      type="single"
      // 값이 하나뿐인 목록에 검색창을 두면 항목보다 검색창이 더 큽니다
      searchable={false}
      options={options}
      value={value != null && value !== "" ? [value] : []}
      onValueChange={(v) => onValueChange(v[0] ?? "")}
      title={title ?? ariaLabel}
      placeholder={placeholder}
      emptyText={emptyText}
      size={size}
      state={state}
      disabled={disabled}
      className={className}
      container={container}
    />
  );
}

function PopoverSelect({
  options,
  value,
  onValueChange,
  placeholder = "선택해 주세요.",
  size = "default",
  state = "default",
  disabled,
  clearable,
  leadingIcon,
  emptyText = "항목이 없습니다.",
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const selected = value != null ? [value] : [];
  const label = value != null ? (options.find((o) => o.value === value)?.label ?? value) : placeholder;

  // 열 때 지금 고른 값에 짚어둡니다 — 어디에 있는지 바로 보여야 합니다
  React.useEffect(() => {
    if (!open) return;
    const i = options.findIndex((o) => o.value === value);
    setActive(i >= 0 ? i : 0);
  }, [open, options, value]);

  const pick = (v: string) => {
    onValueChange(v);
    setOpen(false);
  };

  /**
   * **닫혀 있을 때 방향키가 값을 바꿉니다** (2026-08-13) — 네이티브 `<select>` 와
   * 같습니다. 짝인 `NativeSelect` 가 Windows 에서 그렇게 동작하는데, 같은 껍데기를
   * 쓰고 바꿔 끼울 수 있는 둘이 키보드에서 갈려 있었습니다.
   *
   * **끝에서 돌지 않습니다.** 마지막에서 아래를 눌러 첫 항목으로 튀면 값이 멀리
   * 옮겨간 것을 못 보고 지나칩니다 — 열린 패널 안의 커서는 도는 것이 맞지만
   * (짚기만 할 뿐 값이 안 바뀝니다) 여기는 누를 때마다 실제 값이 바뀝니다.
   *
   * 비활성 항목은 건너뜁니다. `Alt+아래`는 표준대로 패널을 엽니다.
   */
  const usable = options.filter((o) => !o.disabled);

  const stepValue = (d: number) => {
    if (!usable.length) return;
    const i = usable.findIndex((o) => o.value === value);
    // 값이 없으면 아래는 첫 항목 · 위는 마지막 항목부터 시작합니다
    const next = i < 0 ? (d > 0 ? 0 : usable.length - 1) : i + d;
    if (next < 0 || next >= usable.length) return;
    onValueChange(usable[next].value);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || open) return;
    // 안의 Clear 버튼에서 올라온 키는 건드리지 않습니다
    if (e.target !== e.currentTarget) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (e.altKey) {
        setOpen(true);
        return;
      }
      stepValue(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Home" || e.key === "End") {
      if (!usable.length) return;
      e.preventDefault();
      onValueChange(usable[e.key === "Home" ? 0 : usable.length - 1].value);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!options.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((p) => (p + d + options.length) % options.length);
    } else if (e.key === "Enter" && active >= 0 && options[active] && !options[active].disabled) {
      e.preventDefault();
      pick(options[active].value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SelectTrigger
          size={size}
          state={state}
          disabled={disabled}
          open={open}
          aria-label={ariaLabel}
          leadingIcon={leadingIcon}
          onKeyDown={onTriggerKeyDown}
          onClear={clearable && value != null ? () => onValueChange("") : undefined}
          className={cn(value == null && !disabled && "text-text-placeholder", className)}
        >
          <span className="truncate">{label}</span>
        </SelectTrigger>
      </PopoverTrigger>

      <PopoverContent
        ref={contentRef}
        type="list"
        className="gap-0 p-0 pb-1"
        onKeyDown={onKeyDown}
        // 검색창이 없어 Radix 가 첫 항목에 포커스를 줍니다. 그러면 브라우저 포커스와
        // 방향키로 짚은 항목이 따로 놀아 표시가 둘이 됩니다 — 패널 자체에 포커스를 둡니다
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // preventScroll — 패널은 이미 떠 있어서, 그냥 focus 하면 브라우저가
          // 그걸 보이게 하려고 뒤 화면을 스크롤합니다 (MobileSheet 와 같은 사정)
          contentRef.current?.focus({ preventScroll: true });
        }}
      >
        <ComboboxPanel
          type="single"
          options={options}
          query=""
          onQueryChange={() => {}}
          selected={selected}
          onSelect={pick}
          activeIndex={active}
          emptyText={emptyText}
          showSearch={false}
        />
      </PopoverContent>
    </Popover>
  );
}
