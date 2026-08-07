# ACK UI — 프로젝트 맥락

SCL 의료 결과조회 시스템의 디자인 시스템을 Figma 에서 만들고, 그 컴포넌트를 코드로 옮기는 작업입니다.
이 파일은 **왜 그렇게 만들었는지**를 담습니다. 무엇을 만들었는지는 코드와 Figma 를 보면 됩니다.

---

## ⚠️ 적용 범위 — 먼저 읽으세요

**이 저장소는 독립 프로젝트입니다. 상위 폴더의 설정을 따르지 않습니다.**

Claude Code 는 프로젝트 루트뿐 아니라 **상위 폴더의 `CLAUDE.md` 도 함께 읽습니다.**
`Downloads` 나 `Documents` 처럼 여러 프로젝트가 섞이는 폴더에 두면 예전 작업의 규칙이 딸려옵니다.

실제로 겪은 사례 — `Downloads/CLAUDE.md`(정도관리 LIS)가 함께 로드돼 토큰 체계가 충돌했습니다.
`f-` 접두사 spacing 계열과 이 프로젝트의 `button-primary-fill` 계열이 섞였고,
`text-basic` 처럼 **이름이 겹치는 토큰**은 값이 달라도 티가 나지 않습니다.

### 규칙

- 토큰은 **항상 `src/styles/ack-theme.css` 를 기준**으로 합니다. 다른 문서에 같은 이름이 있어도 이 파일이 우선입니다
- 상위 폴더에 다른 `CLAUDE.md` 가 보이면 **무시하고**, 충돌하는 지시가 있으면 사용자에게 알리세요
- 이 저장소는 `C:\dev\ack-ui` 처럼 **전용 폴더**에 두는 것을 권합니다

---

## 지금 상태

**Figma 라이브러리** — 파일 키 `cbV1vpZGUrpJhD1gro6j2m` (SCL_DesignSystem)

```
62 컴포넌트 세트 · 961 변형 · 단독 컴포넌트 219(아이콘 201 포함) · 변수 787
모든 페이지에 About(개요) + Documentation(개발자용) 완비
PC · 모바일 화면 데모 완성
```

**이 코드 저장소** — 위 컴포넌트 중 30개를 옮겨 검증하는 중입니다.

```
Button · Input · InputGroup · Textarea · Checkbox · Radio · Switch
CheckMark · ChoiceGroup · ToggleGroup · Badge · FormField · Table
Skeleton · Spinner · Progress · Separator · Card · CardRow · Alert
Pagination · PaginationItem · Chip · Avatar · Popover · ListItem
Select · NativeSelect · SelectTrigger · Combobox · Tooltip
CalendarCell · CalendarMonth · DatePickerPanel · DatePicker
```

**Input · Selection Controls · Loading & Divider · Chip & Badge 페이지는 전부 옮겼습니다.**
Table 페이지도 AccordionItem 을 뺀 나머지가 끝났습니다.

**Radix 는 Popover · Tooltip 둘을 들였습니다** (`@radix-ui/react-popover` · `-tooltip`). **Combobox 는 새 의존성 없이** Popover + Input + ListItem 조립으로 만들었습니다. **DatePicker 도 새 의존성 없이** 만들었습니다 (`react-day-picker` 를 쓰지 않았습니다 — 아래 근거). 나머지(Lookup · Dialog · Toast · DropdownMenu · Tabs · Accordion)는 아직입니다.

Radix 를 쓸 때는 `shadcn` CLI 를 쓰지 않습니다 — `components.json` 설정과 자체 토큰 이름(`bg-popover` 등)을 끌고 오는데, 어차피 색을 전부 갈아끼워야 해서 손해입니다. 프리미티브만 설치하고 컴포넌트는 직접 씁니다.

애니메이션도 `tailwindcss-animate` 를 쓰지 않고 `--animate-pop-in` 하나로 직접 정의했습니다 (`ack-theme.css`). 방향은 `--ack-pop-x/y` 변수로 받아 키프레임 하나가 네 방향을 처리합니다. `prefers-reduced-motion` 에서는 꺼집니다.

---

## 토큰 — 가장 중요한 규칙

3계층입니다. **컴포넌트는 Semantic 만 참조합니다.**

```
TailwindCSS/Colors  245   gray · slate · red …  (중립 회색은 여기서)
Primitive           197   Primary · Danger …    (브랜드 8램프 × 10단계)
Semantic            317   button-primary-fill · table-border …
Responsive           28   --h-input-default …   (PC/Mobile 2모드)
```

Primitive 나 Tailwind 색을 컴포넌트에서 직접 쓰면 안 됩니다. 색을 바꿔야 할 때 Semantic 한 곳만 고치면 전체가 따라오는 구조가 깨집니다.

### 색의 출처는 두 갈래

| | 어디에 정의 | 비고 |
|---|---|---|
| 브랜드 8램프 | `ack-theme.css` 가 직접 | Primary · Secondary · Sub · Danger · Warning · Success · Info1 · Info2 |
| **중립 회색** | **정의하지 않음 — Tailwind 기본 팔레트** | Semantic 317개 중 **122개**가 여기서 왔습니다 |

회색을 다시 정의하지 않는 이유는 Tailwind 값이 이미 충분히 잘 조율돼 있어서입니다. Figma 의 `TailwindCSS/Colors` 컬렉션 245개가 같은 값을 담고 있습니다.

`slate` · `zinc` · `red` 도 쓸 수 있지만 **중립색은 `gray` 하나로 통일**했습니다. 회색 계열이 섞이면 미세하게 색이 어긋납니다.

### @theme static — 토큰은 전부 내보냅니다

`src/styles/ack-theme.css` 에 전부 있습니다. Tailwind 4 의 `@theme` 이라 `bg-button-primary-fill` 처럼 유틸리티가 자동 생성됩니다.

**`@theme static` 인 이유** — Tailwind 4 는 기본적으로 *실제 쓰인 토큰만* CSS 로 내보냅니다. 그러면 `var(--color-sub-600)` 처럼 클래스가 아닌 방식으로 참조할 때 값이 비어 있습니다. `static` 을 빼면 문서 화면의 팔레트가 빈칸으로 나옵니다.

**단, 이건 우리 블록에만 걸립니다.** Tailwind 자체 팔레트는 트리셰이킹이 그대로라, 회색은 이렇게 갈립니다.

```
bg-gray-300           됨    — 클래스라 Tailwind 가 생성
var(--color-gray-300) 안 됨  — 변수가 CSS 에 없음
```

그래서 회색이 필요하면 `gray` 를 직접 쓰지 말고 Semantic 을 쓰세요. 규칙상으로도 그게 맞습니다.

### 반응형은 CSS 변수 + 미디어쿼리

Figma 의 Responsive 컬렉션을 그대로 옮겼습니다. **1024px 에서 갈립니다.**

```css
--h-input-default   Mobile 40 → PC 36
--h-list-item       Mobile 48 → PC 32   /* 차이가 가장 큼 */
--h-calendar-cell   Mobile 44 → PC 36   /* iOS 44pt 기준 */
--h-datagrid        Mobile 36 → PC 34
```

컴포넌트에서 `h-[var(--h-input-default)]` 로 씁니다. 높이를 하드코딩하지 마세요.

---

## 컴포넌트 판단 근거

작업하면서 내린 결정들입니다. 바꾸려면 근거를 먼저 확인하세요.

### Button

- **주 액션은 한 화면에 하나** — `default`(파란 채움)가 여러 개면 위계가 사라집니다
- **`soft`** 는 조회 버튼처럼 자주 누르지만 위험하지 않은 동작에 씁니다
- **`destructive` 남용 금지** — 되돌릴 수 있으면 `outline` 으로 충분합니다. 빨강은 사용자를 망설이게 합니다
- **Disabled 는 opacity 가 아니라 토큰** — opacity 를 쓰면 겹친 요소가 비칩니다. 단 **바탕이 없는 `ghost` · `link` 는 비활성일 때도 바탕이 없습니다** — 평상시 투명하던 것에 회색 판이 생기면 없던 요소가 나타난 것처럼 보입니다 (2026-08-07 수정. 그전에는 7개 variant 전부에 회색 배경이 깔렸습니다). hover·active 도 같은 이유로 전용 토큰입니다 (`Button/…-Fill-Hover` · `-Active`). Figma description 에 "투명도 /90 · /80" 이라 적혀 있던 낡은 문장은 2026-08-07 에 고쳤습니다
- 툴바의 추가·편집·삭제는 `outline` 입니다. 툴바에 파란 버튼이 있으면 화면의 주 액션과 충돌합니다
- **아이콘 크기를 컴포넌트가 정합니다** — 안 정하면 lucide 기본값 24 로 나와 전 사이즈가 어긋납니다. 글자 옆(14·16·16·20)과 아이콘 전용(12·16·18·24)이 다르고, 스피너는 글자 옆 아이콘과 같습니다. 아이콘 전용은 **정사각형의 정확히 50%** 라고 Figma 문서에 규칙으로 적혀 있습니다
  - **호출부에서 `className="size-4"` 를 주지 마세요.** 컴포넌트 규칙을 덮어써서 `icon`(18)·`icon-lg`(24)가 조용히 16·20 이 됩니다. 2026-08-07 에 App·스토리 22곳에서 걷어냈습니다
- **`icon` 축은 prop 이 아니라 children 순서입니다** — Figma 의 none·left·right·both 에 대응합니다. 오른쪽 아이콘은 방향을 가리킬 때만 (다음 단계·펼치기·외부 링크)
- **`outline` 테두리는 `Button/Tertiary-Fill-Border`** 입니다. Figma 는 값이 같은 `Border/Gray`(둘 다 gray/300)에 묶고 있었는데, 버튼 전용 이름을 쓰는 쪽이 나중에 버튼 테두리만 바꿀 때 안전해서 Figma 를 코드에 맞췄습니다 (2026-08-07, Default 16변형. Disabled 는 `Button/Disabled-Border` 그대로)
- **로딩은 비활성이 아닙니다** — Figma 가 `Loading` 을 `State` 와 별개 축으로 둔 이유입니다. "지금 처리 중" 과 "지금은 누를 수 없음" 은 다른 이야기고, 회색으로 변하면 눌러서 시작한 동작이 취소된 것처럼 보입니다. 코드는 `disabled` 속성을 켜지 않고 `aria-disabled` · `aria-busy` + `pointer-events-none` 으로 색을 지키면서 누르기만 막습니다. 키보드 Enter 는 `onClick` 에서 끊습니다 — 폼 안이면 제출까지 이어집니다 (2026-08-07 수정. 그전에는 `disabled={disabled || loading}` 이라 로딩만으로 회색이 됐습니다)
- **아이콘 전용 크기는 `aria-label` 이 없으면 컴파일되지 않습니다** — 화면에 글자가 없어서 라벨을 빠뜨리면 보조기술이 읽을 것이 아무것도 없습니다. Figma 문서에는 원래 "필수" 라고 적혀 있었지만 코드가 강제하지 않아 빠뜨려도 통과했습니다 (2026-08-07 타입 유니온으로 막음). `size` 를 변수로 넘기면 타입이 좁혀지지 않아 항상 라벨을 요구합니다 — 어떤 크기가 올지 모른다는 뜻이니 그게 맞습니다
- **`asChild` 는 없습니다** — Figma 문서에 "asChild 로 Link 를 감싸면" 이라 적혀 있었지만 구현된 적이 없습니다. 쓸 자리가 생기면 `@radix-ui/react-slot` 을 들여 추가하기로 하고, 문서를 코드에 맞췄습니다 (2026-08-07)
- **`link` 만 좌우 여백이 0** 입니다 — 글자 자체가 누름 대상이라 여백이 있으면 밑줄과 클릭 영역이 어긋나 보입니다. `size` 의 `px-*` 를 이겨야 해서 `compoundVariants` 에 둡니다

### Input

- `<input>` 은 자식을 못 가져서, 아이콘·단위·클리어가 붙으면 **래퍼가 테두리를 그립니다**
- **폭을 고정하지 마세요.** 부모가 폭을 정하게 두면 아이콘이 잘리지 않습니다
- `Input/Border` 는 gray/300 (대비 1.47:1). WCAG 3:1 미달이지만 **의도적으로 유지**합니다 — 장식이 아니라 형태를 알리는 용도라 판단했습니다

### FormField

- **라벨 14 Medium · 값 14 Regular** — 크기가 아니라 **굵기로만** 위계를 만듭니다. Table 이 헤더·본문을 나누는 방식과 같습니다
- **라벨을 Regular 로 내리지 마세요** — 값도 14 Regular 에 색까지 `Text/Basic` 로 같아서, 크기·굵기·색 세 축이 전부 겹치면 위치 말고는 구분할 단서가 없어집니다
- 원래는 12 Medium 이었습니다. 한글은 획이 많아 12px 에서 먼저 뭉개지고, 종일 보는 업무 화면에는 빡빡했습니다 (2026-08-06 변경, 필드당 세로 3px 증가)
- 설명·에러도 12 지만 위치와 색이 달라 구분됩니다
- 에러는 `State=Error` 일 때만 — React Hook Form + Zod 의 검증 결과로 자동 결정됩니다

### Table

- **헤더·본문 글자 모두 14** — 굵기로만 구분합니다
- **페이지네이션과 스크롤 둘 다 씁니다** — 건수는 툴바에 표시합니다. 한 화면에서 훑는 목록은 스크롤, 건수가 많고 "몇 번째 페이지를 보고 있었는지"를 기억해야 하면 페이지네이션 (2026-08-06 방침 변경 — 이전에는 스크롤만이었습니다)
- **헤더 행은 스크롤 영역 밖에** — 스크롤해도 열 이름이 남아야 합니다
- 편집·삭제는 행이 선택됐을 때만 보입니다. 선택 없이 편집 버튼이 있으면 눌러도 아무 일이 없습니다

### Select · Combobox — 트리거는 하나

- Figma 컴포넌트 이름과 코드 이름이 **정확히 일치**합니다 — `SelectTrigger` · `ComboboxPanel` · `Popover` · `ListItem`. 코드에만 있는 것은 이들을 묶은 **완성형**(`Select` · `Combobox` · `NativeSelect`)이고, 그건 Figma 가 표현할 수 없는 영역입니다
- Figma 의 컴포넌트 세트는 원래 `Select` 라는 이름이었습니다. 코드의 완성형 `Select` 와 같은 단어가 서로 다른 걸 가리켜서 **Figma 쪽을 `SelectTrigger` 로 바꿨습니다** (2026-08-06). description 첫 줄이 이미 “닫힌 상태의 트리거입니다” 였습니다
- 코드도 껍데기를 하나로 둡니다 — **`SelectTrigger`**. `Select` · `Combobox` · `NativeSelect` 가 같은 크기·상태 정의(`selectStateClass`)를 씁니다
- 한때 Combobox 가 트리거를 따로 만들어 썼습니다. 사이즈·상태 축이 통째로 빠졌고 Figma 를 고쳐도 한쪽만 따라왔습니다 (2026-08-06 통합)
- **`Select` 와 `NativeSelect` 는 다른 것입니다**
  - `Select` — `SelectTrigger` + Popover + ListItem. **목록도 토큰대로 그립니다.** Figma 구조 그대로
  - `NativeSelect` — 네이티브 `<select>`. 트리거만 토큰이고 **목록은 OS 가 그립니다.** Figma 에 대응물이 없습니다
  - 한때 네이티브 쪽이 `Select` 였습니다. Figma 를 보고 고른 사람이 목록이 디자인과 다른 걸 나중에 발견하게 돼서 이름을 갈랐습니다 (2026-08-06)
- **가르는 축은 값이 하나냐 배열이냐입니다 — 검색은 그 안의 옵션입니다**

  | | 검색 없음 | 검색 있음 |
  |---|---|---|
  | 단일 `value: string` | `Select` | `Combobox` |
  | 다중 `value: string[]` | `Combobox type="multi" searchable={false}` | `Combobox type="multi"` |

  합치지 않은 이유는 `value` 가 `string \| string[]` 유니온이 되기 때문입니다. 항목 3개짜리 드롭다운 하나 놓으려고 배열을 다루게 됩니다. 검색이 붙으면 query 상태·필터링·activeIndex 재계산·빈 결과 처리가 통째로 따라오는데, `Select` 는 그게 전부 없습니다
  왼쪽 위 한 칸만 별도 컴포넌트라 비대칭이지만, **조회 조건의 대부분이 그 칸**입니다. 제일 흔한 경우를 제일 가볍게 두는 쪽을 택했습니다
  항목이 3~5개뿐이면 `searchable={false}` 로 끄세요 — 항목보다 검색창이 더 큽니다.
  트리거 껍데기는 넷 다 `SelectTrigger` 입니다
  - 2026-08-06 이전에는 축을 **검색 유무**라고 적었습니다. `searchable={false}` 를 넣어 “다중인데 항목이 적은” 경우를 메우면서 검색 없는 Combobox 가 생겼고, 그때부터 그 서술이 맞지 않게 됐습니다
- **Render 5종이 모두 코드에 있습니다** — `text` · `chip` · `summary` · `editable`, 그리고 값이 없으면 자동으로 placeholder
  - `chip` 은 트리거 안에 3개까지 + `+N`, `summary` 는 트리거는 요약 한 줄이고 칩이 아래에 줄바꿈
  - `editable` 은 트리거에 직접 입력하는 **단일 선택 전용**입니다. 패널 검색창은 끕니다
  - `editable` 만 `PopoverTrigger` 가 아니라 **`PopoverAnchor`** 를 씁니다. Trigger 는 클릭을 토글로 처리해서 입력창을 눌러 커서를 옮기면 패널이 닫힙니다. `onOpenAutoFocus` 도 막아 커서를 트리거에 남깁니다
- 트리거는 `<button>` 이 아니라 **`<div role="combobox">`** 입니다. 칩의 삭제 버튼·Clear 가 안에 들어가는데 버튼 안의 버튼은 잘못된 HTML 이라 브라우저가 마크업을 재배치합니다. 대신 Enter·Space 를 직접 처리합니다

### Checkbox

- **표식 스트로크는 Figma·코드 모두 1.5 입니다.** 다만 두 1.5 는 **단위가 달랐습니다** — Figma 는 실측이고, lucide 의 `stroke-width` 는 viewBox(24) 좌표계라 12px 로 그리면 화면에서 0.75px 이 됩니다. 그래서 값이 같은데 코드 쪽이 절반으로 얇았습니다
  - `index.css` 에 **`.lucide * { vector-effect: non-scaling-stroke }`** 를 걸어 해결했습니다 (2026-08-07). 이제 1.5 가 크기와 무관하게 화면 1.5px 이고, 12 · 16 · 20px 아이콘이 전부 Figma 와 같아집니다
  - 그전에는 `[--icon-stroke:3]` 으로 체크박스만 손보정하고 있었습니다. **그건 예외가 아니라 단위 환산이었는데** 예외로 오해해서 지웠다가 더 얇아졌습니다. 크기별로 손보정하면 아이콘 크기를 바꿀 때마다 어긋납니다
- **비활성의 표식은 흰색이 아니라 `Icon/Disabled-On`** 입니다. 박스가 `#e5e7eb` 회색이라 흰 체크는 사실상 사라집니다
- **체크된 채로 Error 면 채움이 `Button/Destructive-Fill`** 입니다. 테두리는 `Input/Border-Error` 그대로고 채움만 바뀝니다. 필수 동의를 껐다 켠 순간에 실제로 생기는 조합입니다
- 빈 칸의 비활성 배경은 `Input/Surface-Disabled`, 체크된 칸은 `Button/Disabled-Fill` — **지금은 값이 같지만**(둘 다 `#e5e7eb`) 토큰을 갈라 씁니다. 입력 표면과 버튼 채움은 언제든 갈릴 수 있습니다

### ListItem — 선택은 배경으로 알리지 않습니다

- **배경 하나가 세 가지를 뜻합니다** — 마우스 hover · 방향키 커서 · 선택이 전부 `Action/Accent` 입니다. 그래서 선택은 **글자(`Text/Primary` · Medium)와 표식**으로 알립니다 (2026-08-06). 이전에는 배경만 바뀌어서, 값이 선택된 목록을 열면 어느 줄이 선택인지 구분되지 않았습니다
- 목록 선택에는 `check`(단일) · `checkbox`(다중)만 쓰세요. `text` · `match` 는 표식이 없습니다
- **검색어 강조(`query`)는 Type 축과 독립입니다** — Figma 는 `Match` 를 Type 값으로 두어 강조와 선택 표식을 동시에 켤 수 없지만, 검색이 있는 단일 목록은 둘 다 필요합니다. 코드는 `query` 를 별도 prop 으로 받아 `check` 와 함께 켭니다. Figma 의 `ComboboxPanel(Single)` 은 둘 중 **표식**을 택했습니다 (2026-08-06)
- 열자마자 방향키 커서를 0번에 두지 마세요 — 고르지도 않은 첫 항목이 선택된 것처럼 보입니다. 검색어가 있을 때만 첫 결과를 짚습니다

### Tooltip

- **`aria-label` 과 겹치지 않습니다** — 라벨은 보조기술만, 툴팁은 눈으로 보는 사람만 읽습니다. 겹치는 사람이 없으니 **아이콘 버튼에는 둘 다** 답니다
- **터치 기기에는 hover 가 없습니다.** 툴팁에만 있는 정보를 두지 마세요 — 모바일에서는 영영 안 보입니다
- 한 줄 라벨용입니다. 두 줄을 넘으면 `Popover type="content"` 로 옮기세요. 마우스를 치우면 사라지는 곳에 읽어야 할 내용을 두면 안 됩니다
- `TooltipProvider` 를 **앱 루트에 하나** 둡니다 (Storybook 은 `preview.tsx` 의 decorator). 컴포넌트 안에 숨기지 않은 이유는 `skipDelayDuration` 때문입니다 — 툴바에서 하나가 뜬 뒤 옆으로 옮기면 기다리지 않고 바로 떠야 합니다. 지연은 400ms 로 줄였습니다 (Radix 기본 700 은 업무 화면에 깁니다)
- Placement 는 **화살표 방향일 뿐**입니다. 실제 위치와 충돌 회피는 Radix 가 정하고 화면 끝에서는 뒤집힙니다
- 그림자를 넣지 않습니다 — 어두운 바탕(대비 16.98:1)이 이미 배경과 분리됩니다

### DatePicker

- **달력 격자를 직접 만들었습니다** — `react-day-picker` 를 쓰지 않았습니다. Figma 의 Precision 축 중 Month·Year 그리드는 어차피 라이브러리가 안 해주고, `CalendarCell` 의 9상태가 토큰으로 정의돼 있어 라이브러리 스타일을 전부 덮어야 합니다. 두 벌이 공존하느니 한 벌로 갑니다 (2026-08-07)
- **그리드는 6주(42칸) 고정**입니다. 필요한 주만 그리면 달을 넘길 때마다 높이가 36px 들썩이고, 팝오버 안에서는 아래 버튼이 손가락 밑에서 움직입니다. Figma 가 5주인 건 대표값이고 description 에도 "정확한 배치는 코드가 정한다" 고 적혀 있습니다
- **년·월은 `Select`(우리 것)입니다** — Figma 도 `SelectTrigger Size=sm · Render=Text` 를 씁니다. 처음에 `NativeSelect` 로 만들었다가 바로잡았습니다 (2026-08-07): 목록을 OS 가 그려서 달력 안에서 혼자 다른 모양이 됩니다. 패널 안에 패널이 겹치지만 Radix 가 레이어를 쌓아 처리합니다 — 안쪽을 닫아도 달력은 열려 있습니다
- **오늘은 원이 아니라 날짜 아래 4px 점**입니다. 원을 쓰면 선택과 헷갈립니다. 오늘이면서 선택된 날은 **선택이 이깁니다**
- **일요일만 빨강**입니다 (`Cal/Text-Weekend`). 토요일은 평일과 같습니다
- 셀 36 · 안쪽 원 32 — 원이 셀보다 작아야 범위 배경(셀 전체)과 선택 표시(원)가 겹쳐도 서로 먹지 않습니다
- **입력창을 직접 칠 수 있습니다.** 아는 날짜는 치는 편이 빠릅니다 — 2025년 3월을 달력으로 가려면 년·월을 두 번 고르지만 `20250314` 는 한 번입니다
  - **숫자만 받고 하이픈은 표시로만 얹습니다.** 하이픈이 상태가 아니라서 그 위에서 Backspace 를 눌러도 멈추지 않고 앞 숫자가 지워집니다. 붙여넣기도 숫자만 걸러냅니다
  - **여덟 자리를 채우기 전에는 값이 바뀌지 않습니다** — `2022` 만 쳤는데 2022-01-01 로 잡으면 다 치기도 전에 조회 조건이 달라집니다. 못 채웠거나 없는 날짜면 blur 에서 되돌립니다
- **입력창에서 위·아래는 커서가 놓인 칸만 오르내립니다** — 년에 있으면 년, 월이면 월, 일이면 일. 오르내린 칸은 선택된 채로 남아 연달아 누를 수 있습니다. 값이 바뀌면 커서가 끝으로 튀므로 `useLayoutEffect` 로 되돌립니다 (경계에 걸려 값이 그대로면 리렌더가 없어 즉시도 한 번 맞춥니다)
- **지우기는 달력 버튼 왼쪽**입니다 (`Input` 의 `clearable` 은 끕니다). 기본 자리인 가장 바깥에 두면 값이 있을 때만 나타나면서 달력 버튼을 안쪽으로 밀어냅니다 — 늘 같은 자리에 있어야 할 것이 값 유무에 따라 움직이면 손이 헛돕니다
- `PopoverTrigger` 가 아니라 **`PopoverAnchor`** 를 씁니다 — Trigger 는 클릭을 토글로 처리해서 입력창에 커서를 옮기면 패널이 닫힙니다 (Combobox `editable` 과 같은 이유)
- **그리드 전체가 탭 정지 하나**입니다. 칸마다 멈추면 다음 요소로 가는 데 42번을 눌러야 합니다. 방향키(하루) · PageUp/Down(한 달) · Home/End(주의 처음·끝)로 움직입니다
- `toISOString()` 을 쓰지 마세요 — UTC 로 바뀌면서 한국 시간 오전 9시 이전이 **전날로 밀립니다.** `src/lib/date.ts` 의 `formatDate` 를 쓰세요
- 패널 반경만 **12** 입니다. 떠 있는 패널 중 혼자 큽니다 (Popover 계열 6, Card·Dialog 8) — Figma 가 그렇게 정의했습니다

### 떠 있는 패널

- **반경은 전부 `Radius/md`(6)** — Popover · Tooltip · Toast · ComboboxPanel · LookupPanel. Card·Dialog 처럼 큰 표면만 `Radius/lg`(8) 입니다
- ComboboxPanel 이 혼자 8이었고 **변수 바인딩도 없었습니다.** 직접 값을 넣으면 토큰을 바꿔도 안 따라옵니다 — 새 패널은 반드시 `Radius/md` 에 바인딩하세요 (2026-08-06 정리)
- 표면·테두리는 `Background/White` · `Border/Gray-Light` 를 씁니다. 값이 같은 `Menu/Surface` · `Menu/Border` 가 따로 있지만 **아무도 안 쓰는 상태**입니다 — 미결

### Badge

- 상태가 **2종이면 점(dot), 3종 이상이면 배지**. 둘 다 켜면 같은 정보를 두 번 말하는 셈입니다
- Chip 과 같은 사이즈 축(sm 20 · default 24 · lg 28)이라 나란히 놓아도 맞습니다

---

## 모바일 대응 규칙

**Responsive 변수로 자동 대응되는 것** — Input · Select · Button · Checkbox · Radio · Switch · CalendarCell · ListItem

**구조를 다시 짜야 하는 것**

| PC                      | 모바일                                      |
| ----------------------- | ------------------------------------------- |
| Sidebar 256             | MBottomTabBar + MobileMenuScreen(전체 화면) |
| Table 7열               | MobileListCard — 행 하나가 카드 하나        |
| TableToolbar 아이콘 4개 | 2개 + `⋯` DropdownMenu                      |
| Pagination              | 더 보기 / 무한 스크롤                       |
| Dialog                  | MobileSheet                                 |
| Combobox · Lookup       | MobileSelectContent + MobileSheet           |
| DatePicker 두 달 패널   | MobileCalendar 한 달 + MobileSheet          |
| 조회 조건 가로 한 줄    | MobileFilterBar — 조회 후 자동으로 접힘     |

### 시트 vs 전체 화면

무엇을 덮을지는 **사용자가 어디로 가는지**에 달렸습니다.

```
뒤를 보면서 골라야 함    MobileSheet — 날짜 · 목록 선택 · 필터
다른 화면으로 떠남       전체 화면 — 전체메뉴 · 상세 페이지
입력이 길고 복잡함       전체 화면
확인만 받으면 됨        MobileSheet(Footer 켬)
```

시트 높이는 **최소 240 · 최대 716(화면의 85%)**. 최대를 넘으면 뒤 화면이 안 보여 임시 레이어라는 느낌이 사라집니다.

---

## PC 화면 구조

```
Screen
├ Sidebar 256          접으면 72
└ Workspace            사이드바를 뺀 작업 영역
   ├ MDI TabBar 36     열린 화면 목록 (TabItem Variant=Line + Close)
   └ Content           선택된 탭의 내용 — 탭을 바꾸면 통째로 갈림
      ├ FilterBar      PCFilterBar (Expanded 206 / Collapsed 56)
      └ Body           여백 24. 표 블록
```

**탭바를 Content 안에 두지 마세요.** 탭을 바꾸면 자기 자신도 갈리는 모순이 생깁니다.

12칼럼 그리드는 쓰지 않습니다. 표의 열 너비는 데이터가 정하지 그리드가 정하지 않습니다.

---

## 겪었던 함정

같은 실수를 반복하지 않기 위해 기록합니다.

### Figma 플러그인 API

- **`combineAsVariants()`** 는 결과를 항상 페이지 루트에 놓습니다 — `sec.appendChild(set)` 를 꼭 호출하세요
- **`clone()` 은 프로퍼티 참조를 잃습니다** — 복제 후 모든 변형에서 다시 바인딩해야 합니다
- **`resize()` 는 사이징 모드를 FIXED 로 바꿉니다** — AUTO 를 원하면 `resize` 뒤에 `primaryAxisSizingMode = 'AUTO'` 를 다시 설정하세요. 스피너·Progress·시트에서 세 번 겪었습니다
- **`layoutMode` 는 크기 설정보다 먼저** 지정하세요. 나중에 지정하면 사이징이 AUTO 로 되돌아갑니다
- **중첩 인스턴스 안의 노드는 폭·위치를 못 바꿉니다** — TableRow 안의 셀 폭을 조정할 수 없어, 화면에서는 TableCell 을 직접 배치했습니다
- **`screenshot()` 이 자주 빈 이미지를 반환합니다** — 시각 확인은 사람이 직접 해야 합니다

### description 에 & 와 따옴표를 쓰지 마세요

플러그인 API 로 description 을 쓰면 `&` · `"` · `'` 가 **낱글자 entity 로 저장됩니다** (`&#39;` 가 문자 5개로).
읽어서 고쳐 다시 쓰면 그때마다 한 겹씩 더 쌓입니다 — 실제로 `Chip & Badge` 가 `Chip &amp;amp;amp;amp;amp;amp;amp; Badge` 까지 갔습니다.

- **`&` 대신 `·`**, **따옴표 대신 `“ ”`** 를 쓰세요. 곡선따옴표는 escape 되지 않습니다
- description 을 read-modify-write 하기 전에 **반드시 entity 를 먼저 디코드**하세요
- 2026-08-06 에 14개 컴포넌트를 일괄 정리했습니다

### 프로퍼티 자동 재연결의 부작용

노드 이름으로 프로퍼티를 추정해 일괄 바인딩했다가 두 건이 깨졌습니다. **Publish 전에 발견해서 고쳤지만, 자동화할 때는 항상 검증하세요.**

- `Content=Placeholder` 변형의 텍스트 노드 이름이 `Value` 라서 `Value` 프로퍼티에 잘못 묶임 → placeholder 를 못 바꾸는 상태 (Input 24 · Textarea 6 변형)
- `State=Default` 인 FormField 에도 에러 메시지 `visible` 이 묶여 항상 표시됨 (21 변형)

### 변형별 값 vs 프로퍼티

TEXT 프로퍼티는 **세트 전체가 공유**합니다. 변형마다 다른 기본 문구를 줄 수 없습니다.

```
프로퍼티 유지    인스턴스에서 값을 바꿀 수 있음 · 세트 화면은 기본값만 보임  ← 선택
변형에 고정      세트 화면은 정확 · 인스턴스에서 못 바꿈
```

EmptyState · DateRangeTabs · CalendarCell 이 이 제약을 받습니다. 문서 미리보기에 실제 문구를 넣어 보완했습니다.

---

## 남은 작업

### 코드 — 새 의존성 없이 가능

- [ ] LookupPanel · LookupRow — Popover + ListItem 조합
- [ ] AccordionItem
- [ ] 모바일 전용 (MobileListCard · MobileFilterBar · MobileSheet · MobileSelectContent)
- [ ] React Hook Form + Zod 연동 예시

### 코드 — Radix 프리미티브가 더 필요

`shadcn` CLI 는 쓰지 않습니다. `@radix-ui/react-*` 를 하나씩 설치하고 컴포넌트는 직접 씁니다.

- [x] ~~Tooltip~~ — `@radix-ui/react-tooltip` (2026-08-07)
- [ ] DropdownMenu · Dialog · Toast · Tabs
- [~] DatePicker — 단일 날짜(Mode=Single · Precision=Day · Confirm=False)까지 끝. 남은 축은 **Range**(두 달 + DateRangeTabs + 빠른 선택) · **Precision=Month·Year**(CalendarUnitCell · CalendarUnitGrid) · **Confirm=True**

### Figma

- [ ] **Publish** — 아직 안 했습니다. 이번 세션에서 변수·컴포넌트·문서를 대량으로 고쳤으니 발행 전 확인이 필요합니다
- [ ] `Menu/Surface` · `Menu/Border` — 값은 있는데 **아무도 안 씁니다.** Popover 가 `Background/White` 를 쓰고 있어 정리 대상
- [ ] `Color/Alpha/White/0` 직접 참조 약 2,400곳 — 코드로 옮긴 7개 세트만 `Alpha/Base0` 로 정리했습니다
- [ ] ListItem 에 `Indeterminate` 값 추가 — 전체 선택 줄의 일부 선택 상태를 그릴 수 없습니다
- [ ] Collapsible · ContextMenu (중순위)
- [ ] 샘플 프로젝트 — 상세 화면이 아직 없습니다 (목록에서 행을 눌렀을 때)

---

## 컴포넌트를 고칠 때 — 문서 4곳을 함께 보세요

같은 사실이 네 곳에 흩어져 있습니다. **하나만 고치면 나머지 셋이 조용히 어긋납니다.**

| # | 어디 | 무엇이 적혀 있나 |
|---|---|---|
| 1 | Figma 컴포넌트 `description` | 변형 축의 의미, 쓰지 말아야 할 경우 |
| 2 | Figma `Documentation` 프레임 | 프로퍼티 표 · 판단 기준표 · **코드 대응 표** |
| 3 | Figma `About` 섹션 | 페이지 성격, 언제 뭘 쓰나 |
| 4 | 코드 — 컴포넌트 주석 · 스토리 doc | 위 셋의 근거 + 코드에만 있는 사정 |

### 실제로 겪은 것

- **ToggleItem** — 변형은 연한 파랑인데 description 만 “Primary 채움”. 페이지 메모·토큰은 맞았고 문장 하나만 낡음
- **Select 의 Chip 높이** — 컴포넌트는 `NO_WRAP`·고정인데 description 과 Documentation 이 “세로로 늘어난다”. 두 곳을 따로 고치느라 두 번 왕복
- **코드 대응 표** — shadcn 레시피(Popover + Command + Badge)로 적혀 있었지만 실제 구현은 Popover + Input + ListItem

### 규칙

- **컴포넌트가 문서보다 사실에 가깝습니다.** 어긋나면 변형을 먼저 믿고, 그다음 어느 쪽이 의도인지 물어보세요
- 문장에 **토큰 이름·수치를 함께** 적으세요. “Primary 채움” 보다 `Toggle/Surface-Selected` 가 낫습니다 — 값이 바뀌면 어디를 볼지 드러납니다
- 방침을 바꾸면 **날짜와 이전 방침**을 남기세요. 근거 없이 되돌아가는 걸 막습니다
- Figma 를 고칠 때는 **파일 전체를 검색**하세요. 같은 서술이 다른 페이지에도 있습니다

## 작업 방식

- **한글로 대화합니다.** 문서·주석도 한글입니다
- 판단이 필요한 지점에서는 **선택지와 근거를 제시**하고 결정을 기다립니다
- 컴포넌트를 만들 때는 **왜 그렇게 만들었는지를 description 에** 남깁니다. 나중에 "이거 왜 이래?" 를 줄입니다
- 문서는 **표 중심**입니다. 문장으로 길게 쓰면 안 읽힙니다
- Figma 를 고치기 전에 **누가 그 토큰·컴포넌트를 쓰는지 먼저 훑습니다.** `Button/Tertiary-Fill` 은 아무도 안 써서 안전했고, `Color/Alpha/White/0` 은 2,500곳이라 범위를 좁혔습니다
