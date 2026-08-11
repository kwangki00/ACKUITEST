import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectTrigger, type SelectSize, type SelectState } from "@/components/ui/select-trigger";
import { comboboxMatch } from "@/components/ui/combobox-panel";

/**
 * Figma: LookupPanel · LookupRow (Overlay 페이지 · 4 변형 — Type 2 × State 3)
 *
 * **여러 열을 함께 봐야 고를 수 있을 때** 쓰는 드롭다운입니다 —
 * 검사코드 · 검사명 · 단위처럼요.
 *
 * ### Combobox 와 무엇이 다른가
 *
 * | | 한 줄에 무엇이 | 언제 |
 * |---|---|---|
 * | `Combobox` | **이름 하나** | 이름만으로 판단됩니다 |
 * | `Lookup` | **열 여러 개** | 코드·단위까지 봐야 어느 것인지 압니다 |
 *
 * 검사명이 비슷한 항목이 여럿일 때 `CD001` 과 `CD002` 를 나란히 봐야 고를 수 있습니다.
 * **이름만으로 판단되면 `Combobox` 를 쓰세요** — 열이 늘면 패널이 넓어지고 읽을 것이 많아집니다.
 *
 * ### 열은 4개까지
 *
 * Figma 도 Cell 을 4개까지만 둡니다. 넘으면 패널이 표가 되고, 표는 화면에 놓는 것이지
 * 드롭다운에 담는 것이 아닙니다. **타입이 5번째를 막습니다.**
 *
 * 폭을 주지 않은 열이 **남는 폭을 채웁니다** (Figma 의 Cell 2). 하나만 비워 두세요.
 *
 * ### 닫힌 트리거에도 코드와 이름이 함께 나옵니다
 *
 * 이름만 남기면 비슷한 검사가 여럿일 때 무엇을 골랐는지 확인할 수 없습니다 —
 * **애초에 그 구분 때문에 `Combobox` 대신 이걸 쓰는 것**입니다. Figma 문서에도
 * “닫힌 상태에 코드+명칭 함께 표시” 라고 적혀 있습니다.
 *
 * 기본은 `muted` 열(코드) + 폭을 주지 않은 열(이름)이고, 코드 열이 없으면 이름만
 * 나옵니다. 다른 조합이 필요하면 `display` 로 바꾸세요.
 *
 * ### 코드 열은 흐립니다
 *
 * `muted` 를 켠 열은 `Lookup/Code` 입니다. 코드는 **찾을 때 쓰는 값**이지 읽는 값이
 * 아니라, 검사명과 같은 굵기·색이면 눈이 어디를 봐야 할지 정하지 못합니다.
 *
 * ### 트리거는 `SelectTrigger` 입니다
 *
 * `Select` · `Combobox` · `NativeSelect` 와 **같은 껍데기**를 씁니다 — 크기·상태 정의가
 * 한 곳(`selectStateClass`)에 있어 한쪽만 어긋나지 않습니다.
 *
 * ### 그 밖
 *
 * - 검색창은 **패널 안**에 있고 열면 커서가 그리로 갑니다. 초성 검색이 됩니다
 *   (Figma placeholder 가 약속하는 대로 — `Combobox` 와 같은 규칙)
 * - 방향키로 줄을 옮기고 Enter 로 고릅니다. **열자마자 0번을 짚지 않습니다** —
 *   고르지도 않은 첫 줄이 선택된 것처럼 보입니다. 검색어가 있을 때만 첫 결과를 짚습니다
 * - 열 제목(`header`)을 끄면 목록만 남습니다. **열이 하나뿐이면 끄세요** — 제목이
 *   설명하는 것이 없습니다
 * - 결과가 6줄을 넘으면 목록만 스크롤합니다. 검색창과 열 제목은 남습니다
 */

/* ------------------------------------------------------------------- 열 */

export interface LookupColumn<T> {
  key: string;
  /** 열 제목. `header` 를 끄면 화면에는 안 보이지만 접근성 이름으로 남습니다. */
  header: string;
  value: (row: T) => React.ReactNode;
  /** 고정 폭(px). **생략한 열이 남는 폭을 채웁니다** — 하나만 비워 두세요. */
  width?: number;
  align?: "left" | "right";
  /** 코드처럼 찾는 데만 쓰는 값. 흐리게 그립니다 (`Lookup/Code`). */
  muted?: boolean;
  /** 검색 대상에서 빼려면 끄세요. 기본은 모든 열이 검색 대상입니다. */
  searchable?: boolean;
}

/** Figma 도 Cell 을 4개까지만 둡니다 — 5번째는 컴파일이 안 됩니다. */
export type LookupColumns<T> =
  | readonly [LookupColumn<T>]
  | readonly [LookupColumn<T>, LookupColumn<T>]
  | readonly [LookupColumn<T>, LookupColumn<T>, LookupColumn<T>]
  | readonly [LookupColumn<T>, LookupColumn<T>, LookupColumn<T>, LookupColumn<T>];

/** 열의 값 중 하나라도 걸리면 그 줄을 남깁니다. 초성 검색은 `Combobox` 와 같은 규칙입니다. */
export function lookupMatch<T>(row: T, columns: LookupColumns<T>, query: string) {
  if (!query) return true;
  return columns.some((c) => {
    if (c.searchable === false) return false;
    const v = c.value(row);
    return typeof v === "string" || typeof v === "number"
      ? comboboxMatch(String(v), query)
      : false;
  });
}

/* ------------------------------------------------------------- LookupRow */

export interface LookupRowProps<T> {
  columns: LookupColumns<T>;
  /** `header` 면 열 제목 줄입니다. */
  type?: "header" | "body";
  row?: T;
  selected?: boolean;
  /** 방향키가 짚은 줄. 마우스 hover 와 같은 표시입니다. */
  active?: boolean;
  onClick?: () => void;
  id?: string;
  className?: string;
}

export function LookupRow<T>({
  columns,
  type = "body",
  row,
  selected,
  active,
  onClick,
  id,
  className,
}: LookupRowProps<T>) {
  const isHeader = type === "header";

  return (
    <div
      id={id}
      role={isHeader ? "row" : "option"}
      aria-selected={isHeader ? undefined : !!selected}
      onClick={isHeader ? undefined : onClick}
      className={cn(
        "flex shrink-0 items-center px-3",
        isHeader
          ? "h-9 border-b border-table-border-strong bg-table-header-surface"
          : cn(
              "h-10 cursor-pointer transition-colors",
              selected
                ? "bg-lookup-row-selected"
                : active
                  ? "bg-lookup-row-hover"
                  : "hover:bg-lookup-row-hover"
            ),
        className
      )}
    >
      {columns.map((c) => (
        <span
          key={c.key}
          style={c.width != null ? { width: c.width, flex: "none" } : undefined}
          className={cn(
            "min-w-0 truncate",
            // 폭을 주지 않은 열이 남는 폭을 채웁니다 (Figma 의 Cell 2)
            c.width == null && "flex-1",
            c.align === "right" && "text-right",
            isHeader
              ? "text-xs font-semibold text-table-header-text"
              : cn(
                  "text-sm",
                  // 선택된 줄은 코드 열까지 같은 색입니다 — 한 줄이 통째로 골라진 것이니까
                  selected
                    ? "text-lookup-text-selected"
                    : c.muted
                      ? "text-lookup-code"
                      : "text-lookup-text"
                )
          )}
        >
          {isHeader ? c.header : row !== undefined ? c.value(row) : null}
        </span>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- LookupPanel */

export interface LookupPanelProps<T> {
  columns: LookupColumns<T>;
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** 고른 줄의 id. */
  value?: string;
  onSelect: (row: T) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** 열이 하나뿐이면 끄세요 — 제목이 설명하는 것이 없습니다. */
  header?: boolean;
  showSearch?: boolean;
  placeholder?: string;
  emptyText?: string;
  /** 방향키가 짚은 줄의 번호. `Lookup` 이 넘깁니다. */
  activeIndex?: number;
  /** 목록에 붙이는 id — 트리거의 `aria-controls` 와 짝입니다. */
  listId?: string;
}

export function LookupPanel<T>({
  columns,
  rows,
  getRowId,
  value,
  onSelect,
  query,
  onQueryChange,
  header = true,
  showSearch = true,
  placeholder = "검색어 (초성 검색 가능)…",
  emptyText = "검색 결과가 없습니다.",
  activeIndex = -1,
  listId,
}: LookupPanelProps<T>) {
  return (
    <>
      {showSearch && (
        <div className="shrink-0 p-2">
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

      {/* 열 제목은 스크롤 영역 밖입니다 — 내려도 어느 열인지 남아야 합니다 (Table 과 같은 이유) */}
      {header && rows.length > 0 && <LookupRow columns={columns} type="header" />}

      {rows.length > 0 ? (
        <div
          id={listId}
          role="listbox"
          className="max-h-60 overflow-y-auto overflow-x-hidden"
        >
          {rows.map((r, i) => {
            const id = getRowId(r);
            return (
              <LookupRow
                key={id}
                id={listId ? `${listId}-${i}` : undefined}
                columns={columns}
                row={r}
                selected={value === id}
                active={i === activeIndex}
                onClick={() => onSelect(r)}
              />
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-text-subtle">{emptyText}</p>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- Lookup */

export interface LookupProps<T> {
  columns: LookupColumns<T>;
  rows: readonly T[];
  getRowId: (row: T) => string;
  value?: string;
  onValueChange: (row: T | null) => void;
  /**
   * 트리거에 보일 글자. 기본은 **코드 + 이름**입니다 — `muted` 열(코드)과 폭을 주지
   * 않은 열(이름)을 나란히 놓습니다. 코드 열이 없으면 이름만 나옵니다.
   */
  display?: (row: T) => React.ReactNode;
  placeholder?: string;
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  header?: boolean;
  /** 값을 지울 수 있게 합니다. 필수 항목에는 쓰지 마세요. */
  clearable?: boolean;
  /** 패널 폭(px). Figma 기본은 464 입니다 — 열이 많으면 넓히세요. */
  panelWidth?: number;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * 코드에만 있는 **완성형**입니다 — `SelectTrigger` + `Popover` + `LookupPanel` 을 묶어
 * 검색·키보드·선택까지 담았습니다. Figma 는 껍데기까지만 그립니다.
 */
export function Lookup<T>({
  columns,
  rows,
  getRowId,
  value,
  onValueChange,
  display,
  placeholder = "선택하세요",
  size = "default",
  state = "default",
  disabled,
  header = true,
  clearable,
  panelWidth = 464,
  emptyText,
  searchPlaceholder,
  className,
  "aria-label": ariaLabel,
}: LookupProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const listId = React.useId();

  const filtered = React.useMemo(
    () => rows.filter((r) => lookupMatch(r, columns, query)),
    [rows, columns, query]
  );

  const selected = React.useMemo(
    () => rows.find((r) => getRowId(r) === value),
    [rows, value, getRowId]
  );

  // 열자마자 0번을 짚지 않습니다 — 고르지도 않은 첫 줄이 선택된 것처럼 보입니다.
  // 검색어가 있을 때만 첫 결과를 짚습니다
  React.useEffect(() => {
    setActiveIndex(query ? (filtered.length ? 0 : -1) : -1);
  }, [query, filtered.length]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // 짚은 줄이 화면 밖이면 따라 내려갑니다
  React.useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listId}-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  /*
    닫힌 트리거에는 **코드와 이름을 함께** 보여줍니다 (Figma 문서의 “닫힌 상태에
    코드+명칭 함께 표시”). 이름만 남기면 비슷한 검사가 여럿일 때 무엇을 골랐는지
    확인할 수 없습니다 — 애초에 그 구분 때문에 Combobox 대신 Lookup 을 쓰는 것입니다.

    코드는 목록에서와 같은 흐린 색(Lookup/Code)입니다. 읽는 값이 아니라 찾는 값이라
    이름과 같은 색이면 눈이 어디를 봐야 할지 정하지 못합니다.
  */
  const fill = columns.find((c) => c.width == null) ?? columns[0];
  const code = columns.find((c) => c.muted && c !== fill);
  const label = selected
    ? display
      ? display(selected)
      : code
        ? (
            <>
              <span className="shrink-0 text-lookup-code">{code.value(selected)}</span>
              <span className="min-w-0 truncate">{fill.value(selected)}</span>
            </>
          )
        : fill.value(selected)
    : null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!filtered.length) return;
      setActiveIndex((i) => {
        if (e.key === "ArrowDown") return i >= filtered.length - 1 ? 0 : i + 1;
        return i <= 0 ? filtered.length - 1 : i - 1;
      });
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onValueChange(filtered[activeIndex]);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <SelectTrigger
          size={size}
          state={state}
          disabled={disabled}
          open={open}
          aria-label={ariaLabel}
          aria-controls={open ? listId : undefined}
          onClear={clearable && selected ? () => onValueChange(null) : undefined}
          onKeyDown={onKeyDown}
          className={className}
        >
          <span
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 text-left",
              // 두 조각(코드·이름)일 때 사이를 벌립니다. 한 조각이면 gap 이 하는 일이 없습니다
              !selected && "text-text-placeholder"
            )}
          >
            {label ?? <span className="truncate">{placeholder}</span>}
          </span>
          {/* 화살표·지우기는 SelectTrigger 가 그립니다 — 여기서 또 넣으면 두 개가 됩니다 */}
        </SelectTrigger>
      </PopoverTrigger>

      <PopoverContent
        type="list"
        // 목록 패널이라 여백·간격을 직접 잡습니다 — 줄이 패널 전폭을 차지해야 합니다
        className="flex flex-col overflow-hidden p-0"
        style={{ width: panelWidth }}
        onKeyDown={onKeyDown}
        // 커서는 검색창에 둡니다 — 패널이 훔쳐 가면 바로 칠 수 없습니다
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <LookupPanel
          columns={columns}
          rows={filtered}
          getRowId={getRowId}
          value={value}
          onSelect={(r) => {
            onValueChange(r);
            setOpen(false);
          }}
          query={query}
          onQueryChange={setQuery}
          header={header}
          activeIndex={activeIndex}
          listId={listId}
          emptyText={emptyText}
          placeholder={searchPlaceholder}
        />
      </PopoverContent>
    </Popover>
  );
}
