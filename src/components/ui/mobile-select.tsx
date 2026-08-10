import * as React from "react";
import { cn } from "@/lib/utils";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { SelectTrigger, type SelectSize, type SelectState } from "@/components/ui/select-trigger";
import {
  ComboboxPanel,
  comboboxMatch,
  type ComboboxOption,
} from "@/components/ui/combobox-panel";

/**
 * Figma: MobileSelectContent (Overlay) + MobileSheet (Layouts)
 *
 * 모바일에서 값을 고릅니다. PC 의 `Select` · `Combobox` 자리입니다.
 *
 * ### 안은 PC 와 같습니다
 *
 * Figma 문서 그대로 — *"PC 와 같은 ComboboxPanel 을 쓰고 **감싸는 컨테이너만**
 * MobileSheet 로 분기합니다."* 그래서 목록을 다시 만들지 않고 그대로 씁니다.
 *
 * | | PC | 모바일 |
 * |---|---|---|
 * | 담는 그릇 | Popover | **MobileSheet** |
 * | 표면 | 그림자 + 테두리 | 없음 — 시트가 표면 역할 |
 * | 항목 높이 | 32 | **48** — 터치 기준 |
 * | 폭 | 트리거에 맞춤 | 시트 폭 |
 *
 * 항목 높이는 `--h-list-item` 이 알아서 바꿉니다 (1024px 에서 갈립니다) —
 * 코드에서 따로 지정하지 않습니다.
 *
 * ### 확인 버튼은 다중일 때만
 *
 * | Type | Footer | 이유 |
 * |---|---|---|
 * | 단일 | **끔** | 고르면 바로 닫힙니다. 확인을 또 누르게 하면 번거롭습니다 |
 * | 다중 | 켬 | 여러 개를 다 고른 뒤 확정해야 합니다 |
 *
 * PC 의 `Select`(확인 없음) · `DateRangePicker`(확인 있음)와 같은 기준입니다.
 *
 * ### 보통은 이걸 직접 쓰지 않습니다
 *
 * **`Select`(값 하나) 또는 `Combobox`(값 배열)를 쓰세요.** 손가락이면 이 컴포넌트를,
 * 마우스면 팝오버를 알아서 고릅니다 (`PointerModeProvider`). 강제하려면
 * `overlay="sheet"` 를 넘기면 됩니다.
 *
 * 이 페이지는 *시트로 열면 무엇이 달라지는지*를 설명하는 자리입니다.
 * Figma 에 같은 이름의 컴포넌트가 있어 이름도 그대로 둡니다.
*/

export interface MobileSelectProps {
  type?: "single" | "multi";
  options: ComboboxOption[];
  /** 단일이어도 배열입니다 — `Combobox` 와 같은 모양이라 갈아끼우기 쉽습니다. */
  value: string[];
  onValueChange: (value: string[]) => void;
  title?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** 항목이 적으면 끄세요 — 항목보다 검색창이 더 큽니다. */
  searchable?: boolean;
  /** 다중에서 전체 선택 줄. 검색 중이면 보이는 결과만 고릅니다. */
  selectAll?: boolean;
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  className?: string;
  /** 문서·데모에서 시트를 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
}

export function MobileSelect({
  type = "single",
  options,
  value,
  onValueChange,
  title = "선택",
  placeholder = "선택해 주세요.",
  searchPlaceholder = "검색어 (초성 검색 가능)…",
  emptyText = "검색 결과가 없습니다.",
  searchable = true,
  selectAll,
  size = "default",
  state = "default",
  disabled,
  className,
  container,
}: MobileSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  // 다중은 확정 전까지 여기서만 바뀝니다 — 취소하면 통째로 버립니다
  const [draft, setDraft] = React.useState<string[]>(value);

  const hits = React.useMemo(
    () => (query ? options.filter((o) => comboboxMatch(o.label, query)) : options),
    [options, query]
  );

  const openSheet = () => {
    if (disabled) return;
    setDraft(value);
    setQuery("");
    setOpen(true);
  };

  const pick = (v: string) => {
    if (type === "multi") {
      setDraft((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
      return;
    }
    // 단일은 고르는 순간 끝납니다
    onValueChange([v]);
    setOpen(false);
  };

  const toggleAll = () => {
    const pickable = hits.filter((o) => !o.disabled).map((o) => o.value);
    const allOn = pickable.length > 0 && pickable.every((v) => draft.includes(v));
    setDraft((prev) =>
      allOn
        ? prev.filter((v) => !pickable.includes(v))
        : [...prev, ...pickable.filter((v) => !prev.includes(v))]
    );
  };

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const label =
    value.length === 0
      ? placeholder
      : value.length > 1
        ? `${labelOf(value[0])} 외 ${value.length - 1}`
        : labelOf(value[0]);

  return (
    <>
      <SelectTrigger
        size={size}
        state={state}
        disabled={disabled}
        open={open}
        onClick={openSheet}
        className={cn(value.length === 0 && !disabled && "text-text-placeholder", className)}
      >
        <span className="truncate">{label}</span>
      </SelectTrigger>

      <MobileSheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        container={container}
        // 단일은 고르면 바로 닫히니 확인 버튼이 필요 없습니다
        footer={type === "multi"}
        confirmLabel="선택"
        onConfirm={() => {
          onValueChange(draft);
          setOpen(false);
        }}
      >
        {/* PC 와 같은 패널입니다 — 모바일용을 따로 만들지 않습니다 */}
        <ComboboxPanel
          type={type}
          options={hits}
          query={query}
          onQueryChange={setQuery}
          selected={type === "multi" ? draft : value}
          onSelect={pick}
          emptyText={emptyText}
          showSearch={searchable}
          placeholder={searchPlaceholder}
          selectAll={selectAll}
          onToggleAll={toggleAll}
          // 검색 중이면 전체 선택이 무엇을 고르는지 문구가 달라집니다 —
          // 걸러낸 6건만 보고 눌렀는데 숨은 50건까지 선택되면 사고입니다
          filtered={query !== ""}
        />
      </MobileSheet>
    </>
  );
}
