import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ComboboxPanel, type ComboboxOption } from "@/components/ui/combobox";
import {
  SelectTrigger,
  type SelectSize,
  type SelectState,
} from "@/components/ui/select-trigger";

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
}

export function Select({
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
          contentRef.current?.focus();
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
