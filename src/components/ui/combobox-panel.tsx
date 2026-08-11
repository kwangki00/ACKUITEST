import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ListItem } from "@/components/ui/list-item";

/**
 * Figma: ComboboxPanel (2 변형 — Type 2)
 *
 * 검색이 있는 드롭다운 패널입니다. SelectTrigger 아래에 붙습니다.
 *
 * Type — single(자동완성, ListItem match 로 입력 부분 강조) / multi(다중 선택, ListItem checkbox)
 *
 * **검색창은 패널 안에 있습니다.** 트리거를 누르면 열리고 포커스가 검색창으로 갑니다
 * (Radix PopoverContent 가 첫 포커스 대상으로 옮겨줍니다).
 *
 * **Lookup 과 구분** — 코드·단위처럼 여러 열을 봐야 고를 수 있으면 LookupPanel 입니다.
 */

const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

/** 한글 음절을 초성으로 바꿉니다 — 가나다 → ㄱㄴㄷ. 한글이 아니면 그대로 둡니다. */
function toChoseong(s: string) {
  let out = "";
  for (const ch of s) {
    const code = ch.charCodeAt(0) - 0xac00;
    out += code >= 0 && code <= 11171 ? CHOSEONG[Math.floor(code / 588)] : ch;
  }
  return out;
}

export const isChoseongOnly = (s: string) => s.length > 0 && [...s].every((c) => CHOSEONG.includes(c));

/**
 * Figma placeholder 가 "초성 검색 가능" 이라고 약속하므로 실제로 지원합니다.
 * 입력이 전부 초성이면 초성끼리, 아니면 글자 그대로 비교합니다.
 */
export function comboboxMatch(label: string, query: string) {
  if (!query) return true;
  if (isChoseongOnly(query)) return toChoseong(label).includes(query);
  return label.toLowerCase().includes(query.toLowerCase());
}

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxPanelProps {
  type?: "single" | "multi";
  options: ComboboxOption[];
  query: string;
  onQueryChange: (q: string) => void;
  /** single 은 string, multi 는 string[]. */
  selected: string[];
  onSelect: (value: string) => void;
  /** 방향키로 짚고 있는 항목. 없으면 -1. */
  activeIndex?: number;
  placeholder?: string;
  emptyText?: string;
  /** 전체 선택 줄. multi 에서만 의미가 있습니다 — 하나만 고르는 single 에는 모순입니다. */
  selectAll?: boolean;
  /** 검색 중인지 — 전체 선택이 무엇을 고르는지 문구로 알립니다. */
  filtered?: boolean;
  onToggleAll?: () => void;
  /** Editable 렌더는 트리거에서 입력하므로 패널 검색창을 끕니다. */
  showSearch?: boolean;
}

/**
 * 패널 내용만 담당합니다 — 떠 있는 것과 위치는 Popover 가 맡습니다.
 * 여백 — 검색 8 · 목록 좌우 4 · 아래 4, 목록 줄 간격 2.
 */
export function ComboboxPanel({
  type = "single",
  options,
  query,
  onQueryChange,
  selected,
  onSelect,
  activeIndex = -1,
  placeholder = "검색어 (초성 검색 가능)…",
  emptyText = "검색 결과가 없습니다.",
  selectAll,
  filtered,
  onToggleAll,
  showSearch = true,
}: ComboboxPanelProps) {
  const listId = React.useId();

  /*
    짚은 항목이 화면 밖이면 따라 내려갑니다 — 열 때 선택된 값을 짚으므로,
    한참 아래에서 고른 뒤 다시 열어도 그 줄이 보입니다.
    (커서를 어디에 둘지는 Combobox 가 정합니다 — 여기는 보여주기만 합니다)
  */
  React.useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listId}-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  const pickable = options.filter((o) => !o.disabled);
  const chosen = pickable.filter((o) => selected.includes(o.value));
  const allOn = pickable.length > 0 && chosen.length === pickable.length;
  const someOn = chosen.length > 0 && !allOn;

  return (
    <>
      {showSearch && (
        <div className="p-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            leadingIcon={<Search />}
            placeholder={placeholder}
            aria-label="검색"
          />
        </div>
      )}

      {/* 전체 선택은 목록 **밖**에 둡니다 — 목록과 함께 스크롤되면 안 됩니다.
          목록과 달리 좌우 들여쓰기가 없어 패널 전폭을 차지하고, 아래에 구분선이 붙습니다.
          검색 결과가 없으면 고를 것도 없으므로 함께 숨깁니다. */}
      {selectAll && type === "multi" && options.length > 0 && (
        <div>
          <ListItem
            type="checkbox"
            selected={allOn}
            indeterminate={someOn}
            onClick={onToggleAll}
            // 값 하나가 아니라 여러 값을 대표하는 조작이라 option 이 아닙니다.
            // aria-checked 는 mixed 를 표현할 수 있지만 aria-selected 는 못 합니다
            role="checkbox"
            aria-checked={someOn ? "mixed" : allOn}
            aria-selected={undefined}
          >
            {/* 검색 중이면 무엇을 고르는지 문구로 알립니다.
                안 그러면 걸러낸 2건만 보고 눌렀는데 숨은 50건까지 선택됩니다 */}
            {filtered ? `검색 결과 ${pickable.length}개 선택` : `전체 선택 (${pickable.length})`}
          </ListItem>
          <div className="h-px bg-divider-gray-light" />
        </div>
      )}

      {options.length > 0 ? (
        <div
          role="listbox"
          aria-multiselectable={type === "multi" || undefined}
          className="flex max-h-60 flex-col gap-0.5 overflow-auto px-1 pt-0.5"
        >
          {options.map((o, i) => (
            <ListItem
              key={o.value}
              id={`${listId}-${i}`}
              // 단일도 Check 입니다 — Figma 의 Select Open Demo 와 같습니다.
              // hover·커서·선택이 전부 같은 배경색이라, 우측 체크가 없으면
              // 무엇이 골라진 상태인지 배경만으로는 구분되지 않습니다
              type={type === "multi" ? "checkbox" : "check"}
              query={type === "single" && !isChoseongOnly(query) ? query : undefined}
              selected={selected.includes(o.value)}
              disabled={o.disabled}
              // 방향키로 짚은 항목도 배경을 줍니다 — 마우스 hover 와 같은 표시입니다
              className={i === activeIndex ? "bg-action-accent" : undefined}
              onClick={() => onSelect(o.value)}
            >
              {o.label}
            </ListItem>
          ))}
        </div>
      ) : (
        // Figma 는 Empty 를 켜면 목록을 함께 끄라고 합니다 — 코드는 둘이 배타적입니다
        <p className="py-8 text-center text-sm text-text-subtle">{emptyText}</p>
      )}
    </>
  );
}

