import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectTrigger, type SelectSize, type SelectState } from "@/components/ui/select-trigger";
import { Chip } from "@/components/ui/chip";
import { MobileSelect } from "@/components/ui/mobile-select";
import { useOverlay, type OverlayMode } from "@/components/ui/pointer-mode";
import {
  ComboboxPanel,
  comboboxMatch,
  isChoseongOnly,
  type ComboboxOption,
  type ComboboxPanelProps,
} from "@/components/ui/combobox-panel";

// 쓰던 곳이 많아 여기서 그대로 다시 내보냅니다 — import 경로를 한 번에 바꾸지 않으려고
export { ComboboxPanel, comboboxMatch };
export type { ComboboxOption, ComboboxPanelProps };

export interface ComboboxProps {
  type?: "single" | "multi";
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  /** 트리거 규격 — Figma Select 의 Size 축입니다. */
  size?: SelectSize;
  /** 트리거 상태 — Figma Select 의 State 축입니다. FormField 의 검증 결과를 넘기세요. */
  state?: SelectState;
  /** 검색창 아래에 전체 선택 줄을 답니다. multi 에서만 동작합니다. */
  selectAll?: boolean;
  /**
   * 트리거의 값 표현 — Figma Select 의 Render 축입니다.
   *
   * text      "일반혈액검사 외 1" 한 줄
   * chip      칩을 트리거 안에. 3개까지 보이고 나머지는 +N 으로 접힙니다
   * summary   트리거는 text 와 같고, 고른 칩이 **아래에 줄바꿈되며** 붙습니다
   * editable  트리거에 바로 타이핑해 거릅니다. **단일 선택 전용**
   *
   * 트리거 높이는 넷 다 고정입니다. chip 과 summary 의 갈림 —
   * 접힌 값을 펼쳐 보고 지워야 하면 summary, 앞의 몇 개만 보여도 되면 chip.
   * chip 은 +N 안에 든 값을 지울 수 없습니다.
   */
  render?: "text" | "chip" | "summary" | "editable";
  /** chip 렌더에서 보여줄 최대 개수. 넘으면 +N 으로 접습니다. Figma 슬롯이 3개입니다. */
  maxChips?: number;
  /** 화살표 왼쪽에 전체 해제 X 를 답니다. 필수 항목에는 쓰지 마세요. */
  clearable?: boolean;
  /** 트리거 앞 아이콘. editable 은 검색 아이콘이 기본이라 지정할 필요가 없습니다. */
  leadingIcon?: React.ReactNode;
  /**
   * 패널 안 검색창. 항목이 3~5개뿐이면 끄세요 — 항목보다 검색창이 더 큽니다.
   * `render="editable"` 은 트리거가 검색을 맡으므로 이 값과 무관하게 꺼집니다.
   */
  searchable?: boolean;
  /**
   * 어떻게 열지. **기본은 `PointerModeProvider` 가 정합니다** — 손가락이면 시트,
   * 마우스면 팝오버.
   *
   * 시트로 열면 트리거 표현(`render` · `maxChips` · `clearable` · `leadingIcon`)은
   * 쓰이지 않습니다 — 시트 쪽 트리거는 글자 한 줄이고, `editable` 처럼 트리거에
   * 직접 치는 방식은 시트와 맞지 않습니다.
   */
  overlay?: OverlayMode;
  /** 시트 머리글. */
  title?: string;
  /** 시트를 문서·데모 틀 안에 가둘 때만. 실제 앱에서는 넘기지 마세요. */
  container?: HTMLElement | null;
  /**
   * 붙은 라벨이 없을 때 이름을 줍니다. **`FormField` 로 감쌌다면 필요 없습니다** —
   * 라벨과 자동으로 묶입니다.
   */
  "aria-label"?: string;
}

/** 트리거 + 패널을 묶은 완성형입니다. 패널만 필요하면 ComboboxPanel 을 쓰세요. */
/** 시트냐 팝오버냐만 고르는 얇은 껍데기입니다 — 아래 두 구현이 각자 상태를 쥡니다. */
export function Combobox(props: ComboboxProps) {
  if (useOverlay(props.overlay) === "sheet") return <SheetCombobox {...props} />;
  return <PopoverCombobox {...props} />;
}

/** 손가락일 때 — 목록을 다시 만들지 않고 `MobileSelect` 에 넘깁니다. */
function SheetCombobox({
  type,
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  searchable,
  selectAll,
  size,
  state,
  disabled,
  className,
  title,
  container,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  return (
    <MobileSelect
      aria-label={ariaLabel}
      type={type}
      options={options}
      value={value}
      onValueChange={onValueChange}
      title={title}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      searchable={searchable}
      selectAll={selectAll}
      size={size}
      state={state}
      disabled={disabled}
      className={className}
      container={container}
    />
  );
}

function PopoverCombobox({
  type = "single",
  options,
  value,
  onValueChange,
  placeholder = "선택해 주세요.",
  searchPlaceholder,
  emptyText,
  disabled,
  className,
  size = "default",
  state = "default",
  selectAll,
  render = "text",
  maxChips = 3,
  clearable,
  leadingIcon,
  searchable = true,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(-1);
  const justPicked = React.useRef(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const hits = React.useMemo(
    () => (query ? options.filter((o) => comboboxMatch(o.label, query)) : options),
    [options, query]
  );

  /**
   * 방향키로 짚는 위치.
   *
   * 검색 중이면 첫 결과에 둡니다 — 치고 나서 Enter 만 누르면 되게.
   * **검색어가 없으면 아무것도 짚지 않습니다(-1).** 열자마자 첫 항목에 배경이 깔리면
   * 고르지도 않은 값이 선택된 것처럼 읽힙니다 (hover·selected 와 배경이 같은 색입니다).
   * 단일 선택은 지금 고른 값에 짚어 목록 어디에 있는지 보여줍니다 — Select 와 같습니다.
   *
   * value 를 deps 에 넣지 않는 이유 — 다중 선택은 고를 때마다 value 가 바뀌는데,
   * 그때마다 재실행되면 방향키로 옮겨둔 위치가 매번 처음으로 돌아갑니다.
   */
  React.useEffect(() => {
    if (!open) return;
    if (query) {
      setActive(hits.length ? 0 : -1);
      return;
    }
    setActive(
      type === "single" && value.length ? hits.findIndex((o) => o.value === value[0]) : -1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query, hits.length, type]);

  const pick = (v: string) => {
    if (type === "multi") {
      onValueChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onValueChange([v]);
      setOpen(false);
    }
  };

  /**
   * 전체 선택은 **지금 보이는 항목**만 다룹니다.
   * 검색으로 걸러낸 2건만 보고 눌렀는데 숨은 50건까지 선택되면 사고입니다.
   * 이미 다 켜져 있으면 보이는 것만 끕니다 — 숨은 선택은 건드리지 않습니다.
   */
  const toggleAll = () => {
    const pickable = hits.filter((o) => !o.disabled).map((o) => o.value);
    const allOn = pickable.length > 0 && pickable.every((v) => value.includes(v));
    onValueChange(
      allOn
        ? value.filter((v) => !pickable.includes(v))
        : [...value, ...pickable.filter((v) => !value.includes(v))]
    );
  };

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  const label =
    value.length === 0
      ? placeholder
      : type === "multi" && value.length > 1
        ? `${labelOf(value[0])} 외 ${value.length - 1}`
        : labelOf(value[0]);

  // 칩은 트리거 높이가 고정이라 한 줄에 머뭅니다 — 넘치면 접어서 +N 으로 셉니다
  const chipMode = render === "chip" && type === "multi" && value.length > 0;
  const summaryMode = render === "summary" && type === "multi";
  // 트리거에서 직접 입력합니다. 다중 + 검색은 패널 안 검색창이 맡으므로 단일 전용입니다
  const editableMode = render === "editable" && type === "single";

  // 트리거 안 칩은 사이즈를 그대로 따라갑니다 — sm·grid 20 / default 24 / lg 28
  const chipSize = size === "lg" ? "lg" : size === "default" ? "default" : "sm";
  // 아래에 붙는 칩은 한 단계 작습니다 — 보조 정보라 트리거보다 가벼워야 합니다
  const summaryChipSize = size === "lg" ? "default" : "sm";

  const shown = chipMode ? value.slice(0, maxChips) : [];
  const rest = chipMode ? value.length - shown.length : 0;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!hits.length) return;
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((p) => (p + d + hits.length) % hits.length);
    } else if (e.key === "Enter" && active >= 0 && hits[active]) {
      e.preventDefault();
      if (!hits[active].disabled) pick(hits[active].value);
    }
  };

  /*
    Editable — 트리거 자체가 입력창입니다.

    PopoverTrigger 가 아니라 PopoverAnchor 를 씁니다. Trigger 는 클릭을 토글로 처리해서,
    입력창 안을 눌러 커서를 옮기려 하면 패널이 닫힙니다.
    포커스도 넘기면 안 됩니다 — PopoverContent 가 열릴 때 자기에게 포커스를 가져가므로
    onOpenAutoFocus 를 막아 커서를 트리거에 남깁니다.
  */
  if (editableMode) {
    // 고르고 닫을 때 onOpenChange 가 입력값을 되돌리는데, 그 시점의 value 는
    // 아직 갱신 전이라 직전 선택으로 되돌아갑니다. 방금 골랐는지를 표시해 건너뜁니다
    const commit = (v: string) => {
      justPicked.current = true;
      onValueChange([v]);
      setQuery(labelOf(v));
      setOpen(false);
    };

    const editableKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!hits.length) return;
        const d = e.key === "ArrowDown" ? 1 : -1;
        setActive((p) => (p + d + hits.length) % hits.length);
      } else if (e.key === "Enter" && active >= 0 && hits[active] && !hits[active].disabled) {
        e.preventDefault();
        commit(hits[active].value);
      }
    };

    return (
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) return;
          // 닫히면 고른 값으로 돌아갑니다 — Figma 의 “고른 뒤에는 Text 로 돌아갑니다”
          if (justPicked.current) justPicked.current = false;
          else setQuery(value.length ? labelOf(value[0]) : "");
        }}
      >
        <PopoverAnchor asChild>
          <SelectTrigger
            size={size}
            state={state}
            disabled={disabled}
            open={open}
            aria-label={ariaLabel}
            // 안의 input 이 combobox 역할을 맡습니다 — 껍데기는 초점 대상이 아닙니다
            role={undefined}
            tabIndex={-1}
            leadingIcon={leadingIcon ?? <Search />}
            onClear={
              clearable && value.length > 0
                ? () => {
                    onValueChange([]);
                    setQuery("");
                  }
                : undefined
            }
            onClick={() => !disabled && setOpen(true)}
            className={className}
          >
            <input
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              disabled={disabled}
              value={query}
              placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => !disabled && setOpen(true)}
              onKeyDown={editableKeyDown}
              className="w-full min-w-0 bg-transparent outline-hidden placeholder:text-text-placeholder disabled:cursor-not-allowed"
            />
          </SelectTrigger>
        </PopoverAnchor>

        <PopoverContent
          type="list"
          className="gap-0 p-0 pb-1"
          // 포커스를 가져가면 커서가 입력창에서 빠집니다
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ComboboxPanel
            type="single"
            options={hits}
            query={query}
            onQueryChange={setQuery}
            selected={value}
            onSelect={commit}
            activeIndex={active}
            emptyText={emptyText}
            showSearch={false}
          />
        </PopoverContent>
      </Popover>
    );
  }

  const field = (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <SelectTrigger
          size={size}
          state={state}
          disabled={disabled}
          aria-label={ariaLabel}
          open={open}
          leadingIcon={leadingIcon}
          onClear={clearable && value.length > 0 ? () => onValueChange([]) : undefined}
          className={cn(value.length === 0 && !disabled && "text-text-placeholder", className)}
        >
          {chipMode ? (
            <>
              {shown.map((v) => (
                <Chip
                  key={v}
                  size={chipSize}
                  disabled={disabled}
                  onRemove={() => onValueChange(value.filter((x) => x !== v))}
                  removeLabel={`${labelOf(v)} 해제`}
                  // min-w-0 이라야 자리가 모자랄 때 칩이 줄어듭니다.
                  // 안 그러면 칩이 자연 너비를 고집해 +N 이 밖으로 밀려나
                  // 닫기 버튼 위에 겹칩니다
                  className="min-w-0 max-w-32"
                >
                  {labelOf(v)}
                </Chip>
              ))}
              {rest > 0 && (
                <span className="shrink-0 pl-0.5 text-xs font-medium text-text-muted-foreground">
                  +{rest}
                </span>
              )}
            </>
          ) : (
            <span className="truncate">{label}</span>
          )}
        </SelectTrigger>
      </PopoverTrigger>

      {/* 패널이 스스로 여백을 가지므로 Popover 기본 여백만 끕니다.
          반경은 Popover 것을 그대로 씁니다 — 떠 있는 패널은 전부 6(Radius/md) 입니다 */}
      <PopoverContent
        ref={contentRef}
        type="list"
        className="gap-0 p-0 pb-1"
        onKeyDown={onKeyDown}
        // 검색창이 없으면 Radix 가 첫 항목에 포커스를 줍니다. 그러면 브라우저 포커스와
        // 방향키로 짚은 배경이 따로 놀아 표시가 둘이 됩니다 — 패널 자체에 포커스를 둡니다
        onOpenAutoFocus={
          searchable
            ? undefined
            : (e) => {
                e.preventDefault();
                contentRef.current?.focus();
              }
        }
      >
        <ComboboxPanel
          type={type}
          options={hits}
          query={query}
          onQueryChange={setQuery}
          selected={value}
          onSelect={pick}
          activeIndex={active}
          placeholder={searchPlaceholder}
          emptyText={emptyText}
          selectAll={selectAll}
          filtered={query.length > 0}
          onToggleAll={toggleAll}
          showSearch={searchable}
        />
      </PopoverContent>
    </Popover>
  );

  if (!summaryMode) return field;

  /*
    Summary — 트리거는 그대로 두고 고른 값을 아래에 폅니다.
    칩이 **트리거 밖**이라야 삭제 버튼을 눌러도 패널이 열리지 않고,
    개수가 늘어도 트리거 높이가 그대로입니다. 아래 칩만 줄바꿈되며 늘어납니다.
  */
  return (
    <div className="flex w-full flex-col gap-1.5">
      {field}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <Chip
              key={v}
              size={summaryChipSize}
              disabled={disabled}
              onRemove={() => onValueChange(value.filter((x) => x !== v))}
              removeLabel={`${labelOf(v)} 해제`}
              className="min-w-0 max-w-full"
            >
              {labelOf(v)}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

