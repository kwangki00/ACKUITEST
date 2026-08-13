# ACK UI — 프로젝트 맥락

ACK 의료 결과조회 시스템의 디자인 시스템을 Figma 에서 만들고, 그 컴포넌트를 코드로 옮기는 작업입니다.
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

**Figma 라이브러리** — 파일 키 `cbV1vpZGUrpJhD1gro6j2m` — **Figma 파일 이름은 아직 `SCL_DesignSystem`** 입니다. 코드·문서의 제품 이름은 2026-08-07 에 ACK 로 바꿨고, Figma 파일 이름만 남았습니다

```
62 컴포넌트 세트 · 961 변형 · 단독 컴포넌트 218(아이콘 199 포함) · 변수 788
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
CalendarCell · CalendarMonth · CalendarUnitCell · CalendarUnitGrid
DatePickerPanel · DatePicker
DateRangeTabs · DateRangePickerPanel · DateRangePicker
Dialog · ConfirmDialog · Toast · MobileSheet · MobileSelect
MobileDateRangePicker · MobileListCard · MobileListHeader
MBottomTabBar · MobileTop · MobileMenuScreen · MobileMenuContent
Sidebar · SidebarItem · Tabs · TabItem · TabPanel
Lookup · LookupPanel · LookupRow · FilterBar · EmptyState
DropdownMenu · SidebarGroup · Accordion · DataTable
```

**Input · Selection Controls · Loading & Divider · Chip & Badge 페이지는 전부 옮겼습니다.**
Table 페이지도 AccordionItem 을 뺀 나머지가 끝났습니다.

**Radix 는 Popover · Tooltip · Dialog · Toast · DropdownMenu · Accordion 여섯을 들였습니다** (`@radix-ui/react-popover` · `-tooltip` · `-dialog` · `-toast` · `-dropdown-menu` · `-accordion`). **Combobox 는 새 의존성 없이** Popover + Input + ListItem 조립으로 만들었습니다. **DatePicker 도 새 의존성 없이** 만들었습니다 (`react-day-picker` 를 쓰지 않았습니다 — 아래 근거). `Lookup` · `Tabs` 도 새 의존성 없이 만들었습니다 (2026-08-07). **코드로 옮길 컴포넌트는 다 끝났습니다** (2026-08-11).

**`@tanstack/react-table` 은 2026-08-12 에 들였습니다** — 표의 정렬·선택·페이지네이션 **계산**만 맡깁니다. headless 라 마크업을 만들지 않아서 `Table` 프리미티브는 그대로 두고 `DataTable` 완성형만 새로 만들었습니다 (아래 근거). **v9 라 인터넷 예제(대부분 v8)가 그대로 안 됩니다.**

Radix 를 쓸 때는 `shadcn` CLI 를 쓰지 않습니다 — `components.json` 설정과 자체 토큰 이름(`bg-popover` 등)을 끌고 오는데, 어차피 색을 전부 갈아끼워야 해서 손해입니다. 프리미티브만 설치하고 컴포넌트는 직접 씁니다.

애니메이션도 `tailwindcss-animate` 를 쓰지 않고 `--animate-pop-in` 하나로 직접 정의했습니다 (`ack-theme.css`). 방향은 `--ack-pop-x/y` 변수로 받아 키프레임 하나가 네 방향을 처리합니다. `prefers-reduced-motion` 에서는 꺼집니다.

---

## 글꼴 — Noto Sans KR

**Noto Sans KR** 을 씁니다 (2026-08-12). Google Fonts 에서 **굵기 넷**(400 · 500 · 600 · 700)만 받습니다. **Figma 텍스트 스타일도 같은 날 함께 바꿨습니다** — 한쪽만 바꾸면 대조할 기준이 사라집니다.

### 왜 Pretendard 에서 바꿨나

**Windows Chrome 에서 작은 크기의 한글이 흐리고 깨져 보였습니다.** 브라우저는 ClearType 서브픽셀로 그리는데 Pretendard 웹 빌드의 힌팅이 그 조건을 못 버팁니다. Figma 는 자체 렌더러라 매끈해서 **같은 Regular 인데 웹에서만** 그랬습니다.

같은 날 이런 것들을 먼저 시도했고, 전부 원인을 못 없앴습니다.

| 시도 | 결과 |
|---|---|
| Variable → **정적** 빌드 | 힌팅 보간 문제는 사라졌지만 깨짐은 남음 |
| `-webkit-font-smoothing: antialiased` | **Windows 에서는 아무 일도 안 합니다** (macOS 전용) |
| `will-change: transform` 으로 그레이스케일 강제 | 효과는 있지만 화면 전체가 GPU 레이어로 올라가고 더 흐려 보입니다 |
| **굵기 올리기** | 글꼴 교체와 **함께** 씁니다 — 10px 은 여전히 흐려서 기본을 SemiBold 로 올렸습니다 |

**굵기만으로는 안 됩니다** — 12px 까지 올리면 `FormField` 의 설명·에러가 굵어져 14 라벨과의 위계가 흐려지고, 10px 을 올리면 굵기로 상태를 알리던 곳이 딸려 무너집니다. 원인(글꼴)을 바꾸고, 굵기는 **가장 작은 크기 하나만** 손봤습니다.

### 10px 만 기본 굵기가 SemiBold 입니다

한글은 획이 많아 이 크기에서 먼저 뭉갭니다. Medium 으로 먼저 올렸다가 **여전히 흐려서 한 단계 더** 갔습니다. **크기 토큰이 굵기를 함께 갖습니다** — `--text-2xs--font-weight: 600` (Tailwind 4 기능).

- **호출부에서 손으로 붙이지 마세요.** 10px 을 쓰는 일곱 곳 중 `DropdownMenu` 한 곳만 `font-medium` 이 붙어 있었습니다 — 손으로 시키면 반드시 빠집니다
- **덮어야 하면 `font-bold` · `font-normal`.** 유틸리티가 `--tw-font-weight` 를 세우고 토큰은 fallback 이라 **덮은 쪽이 이깁니다**
- **12px 은 그대로 Regular** 입니다. 함께 올리면 `FormField` 의 설명·에러(12)가 굵어져 14 라벨과의 위계가 흐려집니다

#### 굵기로 상태를 알리던 곳은 한 단계씩 밀립니다

`MBottomTabBar` 의 활성이 SemiBold → **Bold** 가 되었습니다. 비활성이 기본값(SemiBold)을 받으므로 그대로 두면 **둘이 같아져 색만 남고**, 색각 이상에서는 어느 탭에 있는지 알 수 없게 됩니다.

`TabItem` 은 영향이 없습니다 — 라벨이 `text-xs`(12)이고 활성·비활성 굵기를 **둘 다 명시**하고 있어 토큰이 끼어들 자리가 없습니다. 안의 건수만 10px 이라 항상 SemiBold 가 되는데, 그건 상태를 알리는 값이 아닙니다.

### 규칙

- **Variable 을 쓰지 않습니다** — `wght@100..900` 대신 `wght@400;500;600;700`. 보간으로 만든 400 은 힌팅이 달라져 Figma 의 설치 글꼴과 갈립니다 (Pretendard 때 겪은 것과 같습니다)
- **스택 맨 앞이 한글 글꼴**입니다. 라틴을 다른 글꼴에 물리면 밑선과 굵기가 미묘하게 어긋납니다
- **`src/index.css` 한 곳에서 부릅니다.** 앱과 Storybook 이 둘 다 이 파일을 import 하므로 여기만 지키면 됩니다
  - 처음에는 `index.html` 에만 걸었는데 **Storybook 은 `index.html` 을 쓰지 않아서** 스토리 전부가 대체 글꼴(Segoe UI · 맑은 고딕)로 그려지고 있었습니다. 자간·굵기가 전부 달라지는데 **화면은 멀쩡해 보여서 알아채기 어렵습니다**
  - HTML 두 곳에 나눠 걸어 고쳤다가, **또 어긋날 자리**라 CSS 한 곳으로 옮겼습니다 (2026-08-12). `@import` 는 다른 규칙보다 앞에 와야 합니다
  - 대신 HTML `<link>` 보다 **발견이 한 박자 늦습니다** — 브라우저가 CSS 를 받아 파싱해야 폰트 주소를 압니다. 테스트 앱이라 그 값을 치르고 한 곳을 택했습니다
- **바꿔도 반영이 안 되면 개발 서버를 다시 띄우세요.** `index.css` 의 `@import` 는 Vite 가 CSS 를 다시 만들어야 반영되고, 브라우저가 옛 CSS 를 캐시하고 있으면 강력 새로고침(`Ctrl+Shift+R`)이 필요합니다. **DevTools → Elements → Computed 맨 아래 「Rendered Fonts」** 에 실제로 그린 글꼴 이름이 나옵니다 — 거기가 `Noto Sans KR` 이 아니면 아직 안 받은 것입니다
- **여기까지 해도 픽셀은 같지 않습니다.** 브라우저는 OS 래스터라이저(Windows 는 ClearType 서브픽셀)로 그리고 Figma 는 자체 렌더러라 안티에일리어싱이 다릅니다. 글자 모양·굵기는 맞고 가장자리 느낌만 남습니다
  - `-webkit-font-smoothing: antialiased`(`index.css`)는 **macOS 에만** 걸립니다. Windows 에서는 아무 일도 하지 않습니다

### 글꼴을 바꾸면 폭이 따라옵니다

**`DatePicker` · `DateRangePicker` 의 입력창 폭(148 · 248 …)은 Pretendard 14 로 실측한 값**입니다. 글꼴이 바뀌면 그 근거가 무효라, 값이 잘리면 여기부터 보세요 (`date-picker.tsx` · `date-range-picker.tsx` 의 `PICKER_WIDTH`).

폭을 컴포넌트가 갖는 컨트롤은 이 둘뿐이라 확인할 자리도 둘뿐입니다 — 나머지는 부모가 폭을 정합니다.

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

**램프 밖의 색이 필요하면 Semantic 에 값을 직접 적습니다** — `Marker/Checkup`(보라 `#ad46ff`)이 그 경우입니다 (2026-08-12). 브랜드 8램프에 보라가 없는데 화면이 Tailwind `purple/500` 을 직접 참조하고 있었습니다. 「컴포넌트는 Semantic 만」 규칙 때문에 토큰으로 올렸고, **램프를 새로 만들지는 않았습니다** — 표식 하나에만 쓰이고 단계가 필요해지면 그때 만듭니다.

### @theme static — 토큰은 전부 내보냅니다

`src/styles/ack-theme.css` 에 전부 있습니다. Tailwind 4 의 `@theme` 이라 `bg-button-primary-fill` 처럼 유틸리티가 자동 생성됩니다.

**`@theme static` 인 이유** — Tailwind 4 는 기본적으로 *실제 쓰인 토큰만* CSS 로 내보냅니다. 그러면 `var(--color-sub-600)` 처럼 클래스가 아닌 방식으로 참조할 때 값이 비어 있습니다. `static` 을 빼면 문서 화면의 팔레트가 빈칸으로 나옵니다.

**단, 이건 우리 블록에만 걸립니다.** Tailwind 자체 팔레트는 트리셰이킹이 그대로라, 회색은 이렇게 갈립니다.

```
bg-gray-300           됨    — 클래스라 Tailwind 가 생성
var(--color-gray-300) 안 됨  — 변수가 CSS 에 없음
```

그래서 회색이 필요하면 `gray` 를 직접 쓰지 말고 Semantic 을 쓰세요. 규칙상으로도 그게 맞습니다.

### `text-text-basic` — 접두사가 두 번인 것은 오타가 아닙니다

Tailwind 는 **유틸리티 접두사와 토큰 이름을 각각** 붙입니다. 토큰 이름이 `text-` 로 시작하면 두 번 나옵니다.

```
--color-text-basic          →  text-text-basic            글자색
                            →  bg-text-basic              같은 색을 배경으로
--color-border-gray-light   →  border-border-gray-light
--color-background-white    →  bg-background-white
```

겹치는 그룹은 셋입니다 — `text` 21개 · `border` 21개 · `background` 5개.

**이름은 Figma 에서 왔습니다** (`Text/Basic` · `Border/Gray-Light` · `Background/White`). 짧게 줄이면(`--color-fg-basic`) 클래스는 나아지지만 **Figma 변수 이름과 갈립니다** — 이 저장소는 그 1:1 대응을 규칙으로 삼고 있어서, 변수 이름을 그대로 읽으면 클래스가 나오는 쪽을 택했습니다.

**축이 갈릴 때 오히려 이득입니다** — 글자색으로 정의한 값을 배경에 써야 할 때가 있는데, `fg-` 였으면 `bg-fg-basic` 이 되어 더 이상합니다.

### 반응형은 CSS 변수 + 미디어쿼리

Figma 의 Responsive 컬렉션을 그대로 옮겼습니다. **1024px 에서 갈립니다.**

```css
--h-input-default   Mobile 40 → PC 36
--h-list-item       Mobile 48 → PC 32   /* 차이가 가장 큼 */
--text-list-item    Mobile 16 → PC 14   /* 높이만 키우면 줄이 헐거워 보입니다 */
--h-calendar-cell   Mobile 44 → PC 36   /* iOS 44pt 기준 */
--h-datagrid        Mobile 36 → PC 34
```

컴포넌트에서 `h-[var(--h-input-default)]` 로 씁니다. 높이를 하드코딩하지 마세요.

**`max-lg:` 같은 미디어쿼리 유틸리티로 대신하지 마세요** — 그건 **브라우저 창**을 재기 때문에, 문서의 390 틀 안에 넣어도 창이 넓으면 PC 값이 나옵니다. `.ack-mobile` 은 CSS **변수**만 덮어쓰지 유틸리티 variant 는 못 막습니다. 그래서 크기도 변수로 둡니다 (`--text-list-item`).

임의 길이(`text-[length:var(…)]`)로 주면 `text-sm` 이 얹어주던 **자간이 0 이 됩니다** — `tracking-[var(--text-sm--letter-spacing)]` 을 함께 주세요. 14·16 이 둘 다 `-0.02em` 이라 한 값으로 됩니다.

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
- **`type` 기본은 `button` 입니다** (2026-08-12). HTML 기본값은 `submit` 이라 폼 안에 놓기만 해도 누르는 순간 제출됩니다 — 「취소」·「조건 변경」처럼 제출과 상관없는 버튼이 폼에 들어가는 날 조용히 터집니다. `{...props}` 보다 앞에 두었으니 **진짜 제출 버튼은 `type="submit"` 을 적어서** 이깁니다
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
- **에러가 나면 설명을 가립니다** — 한 번에 하나만 읽게 합니다. 형식 안내를 계속 보여주고 싶으면 그 내용을 에러 문구에 넣으세요. Figma 는 Description 이 불리언 하나라 State=Error 변형만 끌 수 없어 인스턴스에서 꺼야 합니다 (2026-08-07 — Figma Documentation 에 "설명 유지" 예시가 있었는데 코드에 맞춰 지웠습니다)
- 에러는 `State=Error` 일 때만 — React Hook Form + Zod 의 검증 결과로 자동 결정됩니다
- **래퍼에 `size` 는 없습니다.** Figma 의 Size 축은 래퍼가 아니라 **안쪽 컨트롤의 높이**라 `<Input size="lg" />` 처럼 컨트롤에 줍니다. 받기만 하고 아무 데도 안 쓰던 prop 을 지웠습니다 (2026-08-07)
- **라벨과 컨트롤은 자동으로 묶입니다** — `<FormField label="…"><Input /></FormField>` 가 전부입니다. `htmlFor` 도 `id` 도 넘기지 마세요 (2026-08-10). `useId()` 로 만든 id 셋이 컨텍스트로 내려가고, 설명·에러도 `aria-describedby` 로 함께 묶입니다
  - **연결을 호출부에 시키면 반드시 빠집니다** — 이 저장소도 `FormField` 60곳 중 **26곳만** 넘기고 있었고, 나머지 34곳은 스크린리더로 가면 무엇을 입력하는 칸인지 안 읽혔습니다. 게다가 그 26곳 중 `Select` 넷은 `<div role="combobox">` 를 겨눠 **헛돌고 있었습니다.** 빠져도 화면은 멀쩡해서 알아챌 방법이 없습니다
  - **`SelectTrigger` 계열은 `aria-labelledby` 로 묶습니다** — `<label for>` 는 labelable 요소(`input`·`textarea`·`select`)에만 걸립니다. `Select` · `Combobox` · `Lookup` · `MobileSelect` 가 껍데기를 공유하므로 한 곳만 고쳐 넷이 따라왔습니다
  - **직접 준 것이 이깁니다** — `aria-label` · `aria-labelledby` 로 스스로 이름을 대면 설명(`aria-describedby`)까지 컨텍스트를 쓰지 않습니다. **이 규칙이 패널 안 검색창의 오염을 막습니다**: React 컨텍스트는 Portal 을 통과해서 `ComboboxPanel` · `LookupPanel` 의 검색창과 달력의 년·월 `Select` 가 바깥 필드의 id 를 집어갈 수 있는데, 셋 다 이미 `aria-label` 을 갖고 있어 걸러집니다. 안 그러면 검색창이 "검색, 여러 항목은 쉼표로 구분합니다" 로 읽힙니다
  - **`id` 를 직접 주면 `aria-labelledby` 로 갈아탑니다** — `<label for>` 는 필드가 만든 id 를 가리키고 있어서 헛돕니다. 판단은 `useFieldBinding()` 한 곳에 모았습니다 — 네 갈래가 있고 하나만 어긋나도 그 칸만 조용히 이름을 잃습니다
  - **`XxxField` 를 만들 이유가 없어졌습니다** — 이전 프로젝트에서 `InputField` · `SelectField` 처럼 라벨을 컨트롤에 넣어 쓴 이유가 "안 그러면 연결이 빠져서" 였습니다. 원인이 조립 방식이 아니라 **연결을 손으로 시키는 것**이었으므로 조립을 유지합니다. 2026-08-10 에는 마지막 예외였던 `DateRangeField` 마저 없앴습니다 — 칩을 `DateRangePicker` 안으로 들여 호출부의 컨트롤을 하나로 만들었습니다
  - `Checkbox` · `Radio` · `Switch` 는 **자기 라벨을 스스로** 답니다 (박스 옆 글자). 이 컨텍스트를 읽지 않습니다

#### 라벨은 전부 `FormField` 가 답니다 (2026-08-10)

**예외가 없습니다.** 조회 조건에 쓰는 컨트롤은 모두 이 모양입니다.

```tsx
<FilterRow>
  <FormField label="기간 선택"><DateRangePicker quickSelect … /></FormField>
</FilterRow>
<FilterRow>
  <FormField label="검사 항목"><Select … /></FormField>
</FilterRow>
```

##### 전에는 `DateRangeField` 가 라벨까지 안고 있었습니다

근거는 **입력창과 칩이 한 값을 공유**해야 한다는 것이었습니다 — 「칩은 값과 어긋나면 안 됩니다」 규칙이 그 동기화 위에서만 성립하는데, 호출부가 조립하면 쓸 때마다 그 계산을 다시 짜야 하고 한 곳만 빠뜨려도 화면이 실제 조회 조건과 다른 것을 가리킵니다.

**칩을 `DateRangePicker` 안으로 들이면서 호출부에서는 컨트롤이 하나가 되었고, 그 근거가 사라졌습니다** (2026-08-10). 동기화 계산은 그대로 있고 한 겹 아래로 내려갔을 뿐입니다.

- **접근성이 그냥 맞습니다** — 입력창(`Input`)은 `FormField` 의 `controlId` 를 집어가고, 칩(`ToggleGroup`)은 `aria-label="빠른 선택"` 으로 스스로 이름을 대서 컨텍스트를 쓰지 않습니다. 「직접 준 것이 이깁니다」 규칙이 여기서도 작동합니다
- **설명·에러 배치가 오히려 나아졌습니다** — 예전에는 입력창만 감싸면 메시지 높이만큼 **칩이 내려가서**, 그걸 막으려고 줄 전체를 다시 감싸는 구조를 따로 만들어야 했습니다. 지금은 `FormField` 가 한 덩어리를 감쌉니다
- **컨트롤에는 `state="error"` 만** 줍니다. `required` · `description` · `error` 는 `FormField` 쪽입니다 — `Input` 과 같습니다
- **Figma 는 그대로 둡니다** — `PCDateRangeField` · `MobileDateRangeField` 는 라벨까지 포함한 그림이라 이름이 맞습니다. 코드 대응은 **`FormField` + `DateRangePicker`** 이고, 이건 이미 있는 패턴입니다 (Figma `FormField Control=Select` ↔ 코드 `FormField + Select`)

##### 단일 날짜에는 칩이 없습니다

`DatePicker` 도 컨트롤 하나라 같은 규칙입니다. "최근 7일" 같은 빠른 선택은 전부 기간이고, 단일에서 자주 쓰는 "오늘" 은 이미 패널 푸터 버튼입니다.

- **컨트롤 하나에 `label` prop 을 달지 마세요** — `FormField` 가 하는 일이 두 벌이 됩니다
- `Checkbox` · `Radio` · `Switch` 의 `label` 은 **다른 것**입니다. 네모 칸 옆에 붙는 글자지 필드 위의 라벨이 아닙니다
- **시트 머리글은 `FormField` 가 알려줍니다.** `MobileSelect` 의 `title` 을 안 넘기면 감싸고 있는 `FormField` 의 라벨을 씁니다 — 안 그러면 같은 글자를 두 번 적어야 하고, 빠뜨리면 머리글이 “선택” 이라는 기본값으로 조용히 밋밋해집니다 (`useFormFieldLabel`, 2026-08-07). `FormField` 밖에서 쓸 때만 `title` 을 직접 주세요

### Table

- **헤더·본문 글자 모두 14** — 굵기로만 구분합니다
- **표면은 표가 스스로 칠합니다** (2026-08-12). Figma 의 `TableCell` 기본 채움이 `Table/Row-Surface`(흰색)이고 머리칸만 `Table/Header-Surface`(gray/100)입니다

  | | 색 | 어디에 |
  |---|---|---|
  | 몸통 | `Table/Row-Surface` **#ffffff** | `<table>` |
  | 머리 | `Table/Header-Surface` **#f3f4f6** | `<thead>` — 위를 덮습니다 |
  | 머리 hover | `Table/Border` **#e5e7eb** | Figma 도 border 토큰에 묶여 있습니다 |
  | 몸통 hover · 선택 | `Table/Row-Hover` · `Table/Row-Selected` | `<tr>` |

  - **그전에는 흰색이 아예 없었습니다** — 행이 투명이라 뒤 배경이 비쳤습니다. 스토리는 감싸는 div 에 `bg-table-row-surface` 를 손으로 발라 가리고 있었고, 그래서 **스토리에서는 멀쩡해 보였습니다.** 화면에 그냥 놓으면 회색이 올라옵니다
  - **표가 짧으면 마지막 행 아래는 표의 바깥**입니다. 담는 자리(`TableFrame`)에도 흰 바탕을 주세요
- **머리줄에는 hover·선택 배경이 없습니다.** `TableRow` 가 머리·몸통 양쪽에 쓰이는데, 컨텍스트로 어느 쪽인지 알려줍니다 — 줄마다 `header` 를 넘기게 하면 하나만 빠뜨려도 그 표의 머리줄이 마우스에 반응합니다 (`SidebarCollapsedContext` 와 같은 이유). 아래 선도 머리줄은 긋지 않습니다 — `TableHead` 가 `Border-Strong` 으로 긋고 **칸의 테두리가 줄의 테두리를 이깁니다**
- **페이지네이션과 스크롤 둘 다 씁니다** — 건수는 툴바에 표시합니다. 한 화면에서 훑는 목록은 스크롤, 건수가 많고 "몇 번째 페이지를 보고 있었는지"를 기억해야 하면 페이지네이션 (2026-08-06 방침 변경 — 이전에는 스크롤만이었습니다)
- **헤더 행은 스크롤 영역 밖에** — 스크롤해도 열 이름이 남아야 합니다
- 편집·삭제는 행이 선택됐을 때만 보입니다. 선택 없이 편집 버튼이 있으면 눌러도 아무 일이 없습니다
- **건수는 칩입니다** (`TableToolbar` 의 `count`). 제목 옆 회색 글자로 두면 부제처럼 읽혀 세는 값이라는 게 흐려집니다. 선택이 있으면 `총 13건 / 3건 선택됨` 처럼 **한 칩에** 적습니다 — 둘로 나누면 어느 쪽이 전체인지 매번 읽어야 합니다. 톤은 늘 neutral (2026-08-07 수정, 그전에는 그냥 텍스트였습니다)
- **정렬은 `TableHead` 의 `sort` · `onSortChange`** 입니다. **정렬할 수 있는 열에만** 넘기세요 — 불가능한 열에 화살표가 보이면 사용자가 눌러 봅니다. 정렬되지 않은 열의 화살표는 **hover 에서만** 나타납니다 (늘 보이면 어느 열이 정렬됐는지 흐려지고, 없으면 정렬되는 줄 모릅니다). `aria-sort` 도 함께 나갑니다 (2026-08-07 추가 — 그전에는 정렬 표시가 아예 없었습니다)

### DataTable — 계산만 TanStack 에 맡깁니다 (2026-08-12)

`@tanstack/react-table` 을 들였습니다. **`Table` 프리미티브는 손대지 않았습니다** — TanStack 은 headless 라 마크업을 만들지 않으므로, 정렬·선택·페이지네이션 **계산만** 가져오고 그림은 지금 부품이 그대로 그립니다. Figma 1:1 이 유지됩니다.

| | |
|---|---|
| `Table` · `TableRow` · `TableCell` | **표현** — Figma 와 1:1 |
| **`DataTable`** | **표현 + 상태** — Figma 에 대응물 없는 완성형 (`Select` · `ConfirmDialog` 와 같은 층위) |

- **화면마다 `useTable` 을 직접 부르지 마세요** — 정렬 화살표를 `TableHead` 에 잇는 방식, 전체 선택의 indeterminate, 빈 결과의 `colSpan` 이 화면마다 조금씩 달라집니다. 「연결을 호출부에 시키면 반드시 빠집니다」와 같은 종류입니다
- **체크박스 열을 열 정의에 직접 넣지 마세요.** `selectable` 이 전체 선택까지 함께 처리합니다
- **`getRowId` 를 꼭 넘기세요.** 안 넘기면 배열 index 라 정렬·페이지 이동에서 **선택이 엉뚱한 행으로 옮겨갑니다**
- **열 폭·정렬은 `meta`** 로 줍니다 (`{ width: "w-20", align: "right" }`). `align` 은 `TableHead`·`TableCell` 이 이미 갖고 있던 축입니다
- **마지막 한 열은 끌 수 없습니다** — 전부 끄면 열 이름조차 안 남아 무엇을 보던 화면인지 알 수 없습니다
- 열 제어 팝오버는 **`ListItem` 도 `DropdownMenu` 도 아닙니다.** `ListItem` 은 `<button>` 이라 안에 순서 버튼을 넣으면 버튼 안의 버튼이 되고(`LookupRow` 와 같은 사정), `DropdownMenu` 는 「누르면 실행하고 끝나는」 메뉴라 표식이 없는데 여기는 지금 무엇이 켜져 있는지 계속 보여야 합니다
- **서버 페이지네이션이 붙으면** `paginated` 를 끄고 바깥에서 `Pagination` 을 쓰세요. 지금 것은 받은 배열을 잘라 쓰는 클라이언트 방식입니다

#### v9 입니다 — 인터넷 예제는 대부분 v8 이라 그대로 안 됩니다

| | v8 | **v9 (여기)** |
|---|---|---|
| 훅 | `useReactTable` | **`useTable`** |
| 기능 | 항상 전부 포함 | **`tableFeatures({...})` 로 켠 것만** — 트리셰이킹됩니다 |
| 행 모델 | `getSortedRowModel()` | **`createSortedRowModel()`** 을 features 에 넘김 |
| 상태 읽기 | `table.getState()` | **`table.state`** |
| 열 타입 | `ColumnDef<TData, TValue>` | **`ColumnDef<TFeatures, TData, TValue>`** |

`useLegacyTable`(v8 API 흉내)도 있지만 **`@deprecated`** 라 쓰지 않습니다. 메서드 이름(`getIsSorted` · `getToggleAllRowsSelectedHandler` …)은 v8 과 같아서, **설정만 다르고 사용은 같습니다.**

- **`tableFeatures(...)` 는 모듈 최상단에 한 번만** 만듭니다 (`dataTableFeatures`). 컴포넌트 안에서 만들면 렌더마다 새 객체가 되어 테이블이 통째로 다시 만들어집니다
- 필터링 · 그룹핑 · 열 너비 조절 · 가상 스크롤은 **켜지 않았습니다.** 켜면 번들에 들어오는데 쓸 자리가 없습니다 — 필요해지면 한 줄 더하면 됩니다
- **제네릭이라 Storybook 이 `TData` 를 못 좁힙니다.** `component: DataTable as React.FC<DataTableProps<T>>` 로 고정하세요 (`AccordionFlatProps` · `SidebarItemFlatProps` 와 같은 사정)

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
- **`lg` 만 아이콘이 20** 입니다 (글자도 16). 나머지는 16 — Input 과 같은 규칙입니다. 아이콘 크기는 `size` 축이 정하고 개별 아이콘에 `size-*` 를 주지 않습니다 (2026-08-07 수정, 그전에는 전 사이즈 16 고정이었습니다)
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
- **열 때 커서는 「고른 값 → 없으면 아무 데도」** 입니다 (2026-08-11 정리)

  | 열었을 때 | 커서 |
  |---|---|
  | 고른 값이 있음 | **그 항목** — 짚고 화면 안으로 스크롤합니다 |
  | 고른 값이 없음 | **없음(-1)** — 0번을 짚으면 고르지도 않은 첫 항목이 선택된 것처럼 보입니다 |
  | 검색어가 있음 | 첫 결과 |

  - **짚기만 하고 스크롤을 안 하면 반쪽입니다** — 아래로 한참 내려가 고른 뒤 다시 열면 맨 위가 나와서, 방금 무엇을 골랐는지 확인하려면 또 찾아 내려가야 합니다. `Select` 는 커서만 맞추고 스크롤이 없었고, `Lookup` 은 반대로 스크롤만 있고 커서를 안 맞췄습니다 — 둘 다 화면에서는 같은 증상이었습니다
  - 스크롤은 `block: "nearest"` — 방향키로 한 칸씩 옮길 때 딱 필요한 만큼만 움직입니다

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
- **Outside 는 Disabled 보다 진합니다** — `Cal/Text-Outside`(gray/400) vs `Cal/Text-Disabled`(gray/300). 이전·다음 달 날짜는 **클릭할 수 있고** 범위 밖은 못 고릅니다. 셋이 어긋나 있던 것을 2026-08-07 에 맞췄습니다: Figma 변형은 `Color/gray/400` 을 **직접 참조**했고, Semantic 값은 gray/300 이라 Disabled 와 같았고, CSS 는 Semantic 값을 따라 둘이 구분되지 않았습니다. **변형이 사실에 가까워** 그쪽 값으로 통일했습니다
- 셀 36 · 안쪽 원 32 — 원이 셀보다 작아야 범위 배경(셀 전체)과 선택 표시(원)가 겹쳐도 서로 먹지 않습니다
- **입력창을 직접 칠 수 있습니다.** 아는 날짜는 치는 편이 빠릅니다 — 2025년 3월을 달력으로 가려면 년·월을 두 번 고르지만 `20250314` 는 한 번입니다
  - **숫자만 받고 하이픈은 표시로만 얹습니다.** 하이픈이 상태가 아니라서 그 위에서 Backspace 를 눌러도 멈추지 않고 앞 숫자가 지워집니다. 붙여넣기도 숫자만 걸러냅니다
  - **여덟 자리를 채우기 전에는 값이 바뀌지 않습니다** — `2022` 만 쳤는데 2022-01-01 로 잡으면 다 치기도 전에 조회 조건이 달라집니다. 못 채웠거나 없는 날짜면 blur 에서 되돌립니다
- **입력창에서 위·아래는 커서가 놓인 칸만 오르내립니다** — 년에 있으면 년, 월이면 월, 일이면 일. 오르내린 칸은 선택된 채로 남아 연달아 누를 수 있습니다. 값이 바뀌면 커서가 끝으로 튀므로 `useLayoutEffect` 로 되돌립니다 (경계에 걸려 값이 그대로면 리렌더가 없어 즉시도 한 번 맞춥니다)
- **지우기는 달력 버튼 왼쪽**입니다 (`Input` 의 `clearable` 은 끕니다). 기본 자리인 가장 바깥에 두면 값이 있을 때만 나타나면서 달력 버튼을 안쪽으로 밀어냅니다 — 늘 같은 자리에 있어야 할 것이 값 유무에 따라 움직이면 손이 헛돕니다
- `PopoverTrigger` 가 아니라 **`PopoverAnchor`** 를 씁니다 — Trigger 는 클릭을 토글로 처리해서 입력창에 커서를 옮기면 패널이 닫힙니다 (Combobox `editable` 과 같은 이유)
- **그리드 전체가 탭 정지 하나**입니다. 칸마다 멈추면 다음 요소로 가는 데 42번을 눌러야 합니다. 방향키(하루) · PageUp/Down(한 달) · Home/End(주의 처음·끝)로 움직입니다
- `toISOString()` 을 쓰지 마세요 — UTC 로 바뀌면서 한국 시간 오전 9시 이전이 **전날로 밀립니다.** `src/lib/date.ts` 의 `formatDate` 를 쓰세요
- **푸터 둘째 버튼이 Mode 에 따라 다릅니다** — 단일은 **“오늘”**(오늘을 바로 고름), 범위는 **“오늘로 이동”**(보고 있는 달만 옮김). 단일은 값이 하나뿐이라 달만 옮겨봐야 한 번 더 눌러야 하고, 이미 오늘이 있는 달이면 눌러도 반응이 없습니다. 범위는 반대로 오늘 하나를 넣어봐야 두 날짜를 골라야 하는 일이 안 끝납니다 (2026-08-07. Figma 도 Single 변형 6개를 “오늘 · 이번 달 · 올해” 로 고쳤습니다)
- **`DatePicker` 도 시트로 갈립니다** (2026-08-11). 껍데기만 바뀌고 안에는 **같은 `DatePickerPanel`** 이 들어갑니다 — `MobileSelect` 가 목록을 다시 만들지 않는 것과 같은 규칙입니다. 시트에는 **확인 버튼이 없고**(한 번 누르면 끝납니다), **입력창을 직접 칠 수 없습니다**(키보드가 달력을 덮습니다). 머리글은 감싸고 있는 `FormField` 의 라벨을 씁니다
- **범위는 확인 버튼이 있고 단일은 없습니다** (Figma 의 Confirm 축). 두 날짜를 골라야 하니 중간에 잘못 눌러도 되돌릴 수 있어야 하고, 단일은 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다
- **두 달은 늘 이웃합니다** — 한쪽 Select 를 바꾸면 반대쪽이 따라옵니다. 따로 놀게 두면 7월과 11월이 나란히 놓여 사이가 비어 보입니다
- **최신 달이 오른쪽입니다** (2026-08-10). 조회 기간은 대개 **오늘에서 거슬러 올라가는데**, 이번 달을 왼쪽에 두면 오른쪽은 아직 오지 않은 달이라 화면의 절반이 고를 일 없는 자리로 남습니다. 최신 달을 오른쪽에 두면 그 앞달까지 함께 보여 "지난달 중순 ~ 오늘" 을 한 화면에서 고를 수 있습니다
  - 값이 있으면 **종료를 오른쪽에** 둡니다 — 기간의 최신 끝이 거기입니다. 전에는 시작 기준이라 `7/15 ~ 8/10` 을 다시 열면 `[7월, 8월]` 은 맞았지만 `1월 ~ 4월` 은 `[1월, 2월]` 이 나와 **종료가 안 보였습니다**
  - **시작만 있는 값(고르다 만 것)은 옮기지 않습니다** — 종료를 앞으로 골라야 해서 오른쪽에 자리가 있어야 합니다
  - "오늘로 이동" 도 오늘을 **오른쪽에** 둡니다 — 열었을 때와 같은 자리여야 어디로 갔는지 헷갈리지 않습니다
  - **모바일은 옮기지 않습니다** — 한 달만 보여주므로 옮기면 지난달이 열립니다 (`monthsVisible`)
- **종료를 고르는 중에는 마우스가 지나가는 데까지 띠를 미리 보여줍니다.** 없으면 눌러 보고 되돌리기를 반복합니다
- **시작보다 앞을 고르면 그쪽이 시작이 됩니다** — 되돌리라고 하는 것보다 낫습니다. 시작을 바꿔서 기존 종료보다 늦어지면 종료를 비웁니다
- **빠른 선택은 고르는 단위를 따라갑니다** — day 는 `1일·3일·7일·1개월`, month 는 `1개월·3개월·6개월·1년`, year 는 `1년·3년·5년` (`PRESETS_BY_PRECISION`). 월 화면에 "3일" 이 붙어 있으면 눌러도 월 하나로 뭉개져 무엇을 고른 것인지 설명되지 않습니다 (2026-08-07 수정 — 처음엔 day 목록이 전 단위에 그대로 붙었습니다)
- **`DateRangeField` 는 2026-08-10 에 없어졌습니다.** 하루에 두 번 움직였습니다 — 먼저 `DateField` → `DateRangeField` 로 이름을 바꿨고(값이 처음부터 `DateRange` 인데 이름만 보면 단일 날짜에도 쓸 수 있는 것처럼 보여서), 이어 **칩을 `DateRangePicker` 안으로 들이면서 컴포넌트를 지웠습니다.** 라벨은 `FormField` 가 답니다 — 위 「라벨은 전부 `FormField` 가 답니다」 참고. 날짜 하나를 받는 자리는 `FormField` + `DatePicker`
- **빠른 선택은 두 곳에 있습니다** — 패널 안, 그리고 입력창 **옆**(`DateRangePicker quickSelect` = Figma 의 PCDateRangeField). 조회 화면에서 가장 많이 하는 일이 "최근 N일" 이라 패널을 열지 않고 끝나는 경로를 한 번 더 앞에 둡니다
- **칩은 값과 어긋나면 안 됩니다** — 7일을 눌러둔 채로 달력에서 3월을 고르면 **칩 선택이 풀립니다.** 안 그러면 화면이 "최근 7일" 이라 말하면서 3월을 조회합니다. 활성 칩은 저장하지 않고 **매번 값과 맞춰 계산**합니다 — 어제 누른 "7일" 은 오늘 열면 최근 7일이 아닙니다
- **`quickSelect` 는 자리가 모자라면 칩이 다음 줄로 내려갑니다** (`flex-wrap`). 입력창 248(day) + 칩 넷은 한 줄에 **460** 쯤 필요합니다. **컨테이너 쿼리를 쓰지 않습니다** — 그건 폭을 부모에서 받아야만 성립해서, 폭 없는 자리(내용만큼 넓어지는 flex 항목)에 놓으면 **조용히 무너집니다.** `flex-wrap` 은 그런 조건이 없어 어디에 놓아도 동작합니다 (2026-08-07)
  - **남는 자리는 칩이 먹습니다 — 입력창이 아니라** (2026-08-11). 입력창을 늘리면 값의 길이는 그대로인데 오른쪽만 비어 보이지만, 칩은 원래 균등 분할이라 넓어져도 자연스럽습니다
    - **가로 한 줄에서는 아무것도 안 늘어납니다** — `FilterRow` 가 `flex-row` 라 이 묶음이 내용 폭이고 남는 자리가 아예 없습니다
    - **세로로 쌓일 때만 칩이 늘어납니다** — 그때는 폭이 100% 라 남는 자리가 생기고, 늘어나야 **검사 항목·정렬 줄과 폭이 맞습니다.** 안 늘리면 기간 줄만 짧아 보입니다
    - 그전에는 입력창에 `w-64 grow` 를 줬습니다 (2026-08-07). 그건 컨테이너가 딱 내용 폭일 때만 성립하는 이야기라, 여유가 있는 자리에서는 입력창만 혼자 커졌습니다
  - **폭은 컴포넌트가 갖습니다 — `Input` 과 다른 점입니다** (2026-08-11). 날짜는 자릿수가 정해져 있어 폭이 예측되고, 이 제품은 조회 화면이 대부분이라 **좁은 자리가 기본**입니다. 칸을 채워야 하면 **`className="w-full"`** 한 줄

    | | `DatePicker` | `DateRangePicker` |
    |---|---|---|
    | `day` | **148** | **248** |
    | `month` | **128** | **204** |
    | `year` | **108** | **156** |

    - 필요 폭 = 여백 24 + 글자 + 간격 8 + 우측 아이콘(값이 있으면 지우기 16 + 4 + 달력 16 = **36**, 비어 있으면 달력 **16**). 그래서 **`day` 는 자리표시가, 월·연은 값이** 폭을 정합니다 (Pretendard 14 실측 + 4)
    - **격자에서 `w-full` 을 빠뜨리면 조용히 어긋납니다** — 옆 칸은 꽉 찼는데 날짜 칸만 짧습니다. `Form/FormField` 의 `Control` 화면에서 실제로 그랬습니다. 그래도 이 방향을 택한 이유는 **반대가 더 잦기 때문**입니다 — 폭을 매번 손으로 주는 것보다 격자에서 한 줄 더 쓰는 편이 낫습니다 (한때 반대로 뒀다가 되돌렸습니다)
    - `quickSelect` 여도 **입력창은 이 폭 그대로**입니다 — 남는 자리는 칩이 먹습니다
    - **Figma 값(250·200·180)을 따르지 않습니다** — 그림이 지우기 버튼을 안 그려 `month` 는 3px 모자라고 `year` 는 29px 남았습니다. Figma 를 코드에 맞췄습니다
  - **`w-full` 과 `w-fit` 은 주는 대상이 다릅니다.** `DatePicker` 냐 `DateRangePicker` 냐로 갈리지 않습니다 — 둘 다 같은 규칙입니다

    | 어디에 | 무슨 뜻 | 언제 |
    |---|---|---|
    | **컨트롤**에 `w-full` | 필드 **안에서** 칸을 채워라 | 격자 — 옆 칸과 폭을 맞춰야 할 때 |
    | **`FormField`** 에 `w-fit` | 필드 **자체가** 내용만큼만 차지해라 | 가로 나열 — 여러 필드를 한 줄에 놓을 때 |
    | 아무것도 안 줌 | 컨트롤은 기본 폭, 필드는 부모 폭 | 세로로 쌓는 보통 폼 |

    `FormField` 는 기본이 `w-full` 이라 `flex flex-wrap` 줄에 그냥 넣으면 항목마다 100% 를 요구해 **한 줄에 하나씩 떨어집니다** — `w-fit` 이 그걸 막습니다. 라벨·설명이 컨트롤보다 길 때도 갈립니다: `w-fit` 이면 긴 쪽에 맞춰 필드가 넓어지고, 안 주면 부모 폭까지 늘어납니다
  - **`basis-*` 로 주면 안 됩니다.** `FormField` 의 기본이 `w-full` 이라 둘이 남는데, **최대 폭을 잴 때는 퍼센트가 `auto` 로 취급돼 입력창 내용 폭**이 잡히고 **배치할 때는 `basis` 값**이 쓰입니다 — 그 차이만큼 칩이 넓은 화면에서도 다음 줄로 밀립니다. `w-*` 는 tailwind-merge 가 `w-full` 을 걷어내서 두 계산이 같아집니다 (2026-08-07)
  - **폭은 부모가 정합니다** — `Input` 과 같은 규칙입니다. flex 항목이면 내용만큼(≈460), `flex-col` 안이면 부모 폭을 채웁니다. 채우고 싶지 않으면 감싸는 쪽에 `w-fit` 이나 폭을 주세요
  - 한 줄일 때 칩 바닥은 `items-end` 로 입력창 바닥과 맞춥니다 — 빈 라벨 자리를 넣어 맞추던 것을 대신합니다. 그 빈 자리는 줄바꿈되면 유령 여백으로 남습니다
  - 시트로 열어야 하면 여전히 `MobileDateRangePicker` 입니다 — 팝오버냐 시트냐는 CSS 로 못 고릅니다
  - **컨테이너 쿼리는 컨테이너 자신에게 적용되지 않습니다 — 자손에게만 걸립니다.** 같은 요소에 `@container/x` 와 `@pc/x:px-6` 을 함께 주면 그 여백은 **조용히 죽습니다** (에러도 경고도 없습니다). 바깥은 컨테이너 역할만 하고 **배치를 바꾸는 클래스는 한 겹 안쪽**에 두세요 — `FilterBar` · `DateRangePicker` 둘 다 그렇게 되어 있습니다 (2026-08-07)
  - **컨테이너 쿼리를 다는 요소는 폭을 부모에서 받아야 합니다.** `container-type: inline-size` 는 내용이 폭을 정하면 성립하지 않습니다 — 가로 줄 안에서 내용만큼 넓어지는 flex 항목에 걸면 브라우저가 폭을 못 정해 **0 으로 무너집니다.** `FilterBar` 는 세로 흐름의 블록이라 폭이 부모에서 와서 안전합니다. 그 조건을 못 지키는 자리에는 `flex-wrap` 을 쓰세요 (`DateRangePicker` 의 칩이 그렇습니다)
- 바깥 빠른 선택은 `Chip` 이 아니라 **`ToggleGroup(Outline)`** 입니다. Figma description 은 "칩" 이라 부르지만 하나만 켜지는 배타 선택이라 세그먼트 컨트롤이 맞습니다 — Chip 은 삭제할 수 있는 태그이고 여기엔 지우는 개념이 없습니다
- **빠른 선택이 주인공입니다** — 달력을 만지지 않고 끝나는 경로입니다. 조회 화면에서는 이것만으로 끝나는 경우가 많습니다. 기간은 오늘을 포함해 셉니다("3일" = 그저께~오늘). **"전체" 는 넣지 않습니다** — 나머지가 전부 기간인데 혼자만 조건을 지우는 동작이라 같은 줄에서 무엇을 고르는 자리인지 흐려집니다. 기간을 비우는 일은 입력창의 지우기(X)가 맡습니다 (2026-08-07 제거, Figma 12변형도 함께)
- **범위 입력창도 직접 칩니다** — 숫자 16자리를 이어 치면 `2026-01-07 ~ 2026-04-15` 가 됩니다. 8자리에서 시작, 16자리에서 종료가 정해지고, 뒤집어 쳐도 바로잡습니다. 16자리를 못 채우고 나가면 되돌립니다 (반쪽 기간은 조회 조건이 설명되지 않습니다). 방향키는 여섯 칸(시작 년월일 · 종료 년월일)을 각각 오르내리고, 시작은 종료를 넘지 못합니다 (2026-08-07 추가. 그전에는 읽기 전용이었습니다)
- 숫자 입력 처리(`toDigits` · `formatDateDigits`)는 **`src/lib/date.ts` 에 공용**입니다 — 단일과 범위가 같은 규칙을 써야 합니다
- 달력 아이콘은 **`Calendar`** 입니다 (`icons/calendar`). `CalendarDays`(`icons/calendar-days`)를 쓰고 있었는데 Figma 는 전자입니다 (2026-08-07 수정)
- **탭의 빈 칸 문구는 짧게** — `시작일` · `시작월` · `시작연도`. "시작 월을 선택해 주세요" 처럼 문장으로 쓰면 탭이 그 글자에 맞춰 넓어지고 **패널 전체가 따라 커집니다**. 무엇을 하라는 안내는 활성 탭의 파란 테두리가 이미 합니다 (2026-08-07, Figma 기본값도 함께 줄임)
- Figma 의 `DateRangeTabs` `Step` 축 5개는 **코드에서 축으로 두지 않습니다** — `editing`(`"start" | "end" | null`) × 값 유무로 계산합니다. **`null` 이 Complete** 입니다. 같은 것을 두 벌로 두면 한쪽만 고쳐집니다
  - 처음에는 "둘 다 값이 있으면 무조건 활성 탭 없음" 으로 계산했는데, 그러면 **탭을 눌러도 활성 표시가 안 떠서** Edit-Start·Edit-End 가 화면에 나타나지 않았습니다 (2026-08-07 수정)
- **탭을 누르면 그 날짜가 보이는 곳까지 달력이 따라갑니다** — 3월을 골라놓고 8월을 보던 중에 시작 탭을 눌렀는데 8월이 그대로면 무엇을 고치는 중인지 알 수 없습니다. 이미 보이는 달이면 옮기지 않습니다 (멀쩡히 보이는 화면이 움직이는 게 더 놀랍습니다)
- **다른 달 날짜는 무엇이든 Outside** 입니다 — 선택이든 범위의 끝이든. 이 달력은 이 달을 보여주는 것이고, 그 날짜는 제 달력에서 제대로 그려집니다. 처음에는 가운데(Range-Middle)만 걸러내고 양 끝은 안 걸러서, **왼쪽 달력(1월)에 2월 6일이 종료로 찍혀 같은 날이 두 달력에 두 번 나타났습니다** (2026-08-07 수정). Figma 의 State 축이 배타적인 것도 같은 이유입니다
- **`precision` 이 Figma 의 Precision 축입니다** — `day` 는 달력, `month`·`year` 는 `CalendarUnitGrid`(3×4). 값은 그 단위의 **첫 날**이고, 표시는 단위에 맞춰 자릅니다 (월 화면에서 `2026-08-01` 이라고 쓰면 고르지도 않은 날짜까지 정한 것처럼 보입니다)
- **범위의 종료는 그 단위의 마지막 날**입니다 — 2026년 8월을 종료로 고르면 `2026-08-31`. 1일로 두면 8월 2일부터가 조용히 빠져서, 화면은 8월까지라는데 자료는 하루만 나옵니다
- 날짜는 두 달을 나란히 보여주지만 **월·연은 하나만** 놓습니다. 월 그리드 하나에 열두 달이 다 들어 있어 둘을 놓으면 같은 해가 두 번 나옵니다
- **연도 그리드 시작점은 12로 내림**합니다 (`yearGrid`). 안 그러면 앞뒤로 넘길 때마다 경계가 달라져 같은 해가 두 화면에 나옵니다
- 연 선택에는 연도 Select 를 두지 않습니다 — 고르려는 대상이 연도인데 연도 Select 가 있으면 같은 것을 두 번 고르게 됩니다. 좌우 화살표로 12년씩 넘깁니다
- 패널 반경만 **12** 입니다. 떠 있는 패널 중 혼자 큽니다 (Popover 계열 6, Card·Dialog 8) — Figma 가 그렇게 정의했습니다

### Dialog

- **사용자 행동을 막을 때만** 씁니다. 알리기만 하면 되는 건 Toast 입니다 — 모달은 하던 일을 세우고 답을 요구하는 것이라, 알림에 쓰면 매번 닫는 손이 듭니다
- **제목은 질문형** — "삭제할까요?" 가 "삭제 확인" 보다 명확합니다. 되돌릴 수 없는 동작은 **설명으로 결과를 알립니다**
- **취소가 왼쪽, 주 액션이 오른쪽.** 우상단 X 는 취소와 **같은 동작**이어야 합니다
- 확인창은 **`ConfirmDialog`**(Figma 에 대응물 없는 완성형)를 쓰고, 폼이 들어가는 창만 프리미티브로 조립합니다. 매번 손으로 조립하면 버튼 순서나 톤이 조금씩 어긋납니다
- **`ConfirmDialog` 는 모바일에서 시트로 뜹니다** (2026-08-11). 「시트 vs 전체 화면」의 *확인만 받으면 됨 → MobileSheet(Footer 켬)* 자리입니다 — 제목 + 설명 + 버튼 둘이라 뒤를 보면서 답만 하면 되고, 그럴 때 아래에서 올라오는 편이 엄지에 가깝습니다
  - 껍데기는 **`PointerModeProvider`** 가 정합니다 — `Select` · `DateRangePicker` 와 같은 구조라 **호출부는 아무 판단도 하지 않습니다** (강제하려면 `overlay="dialog" | "sheet"`)
  - 버튼은 `MobileSheet` 의 Footer 가 그립니다 — **취소가 왼쪽**인 순서도 한 곳에서 지켜집니다. `destructive` 톤과 로딩을 넘기려고 `confirmTone` · `confirmLoading` · `showCancel` 을 시트에 더했습니다
  - **폼이 들어가는 창은 이 규칙에서 빠집니다** — 「입력이 길고 복잡함 → 전체 화면」이라 모바일에서는 화면을 따로 만드세요. 시트에서 긴 입력을 스크롤하면 답답하고 키보드가 올라오면 시트를 덮습니다. **내용이 정하는 것이라 컴포넌트가 갈라줄 수 없습니다**
- 크기는 sm 400(짧은 확인) · default 512 · lg 640(폼·표). 폭만 다르고 여백·간격은 같습니다
- **애니메이션은 `ack-theme.css` 에 정의한 것만 씁니다** — `animate-in` · `fade-in-0` 같은 `tailwindcss-animate` 유틸은 이 프로젝트에 없어서 **조용히 무시됩니다.** Scrim 용으로 `--animate-fade-in` 을 새로 넣었습니다 (2026-08-07)

### Toast

- **결과를 알리는 것**이지 답을 받는 게 아닙니다. 답이 필요하면 `Dialog`, 화면에 계속 남아야 하면 `Alert`
- **실패는 Toast 만으로 두지 마세요** — 4초 뒤 사라져서, 잠깐 다른 곳을 보고 있었다면 무엇이 잘못됐는지 알 방법이 없어집니다. `Alert` 을 화면에도 함께 남깁니다
- **색만으로 구분하지 않습니다.** 제목 문구로 결과를 명확히 씁니다 ("저장에 실패했습니다"). 색각 이상이 있으면 톤이 안 보입니다
- **동시에 3개까지.** 넘치면 오래된 것부터 지웁니다 — 쌓이는 대로 두면 읽기 전에 화면을 덮습니다
- **우하단**에 쌓습니다. 우상단은 조회 화면의 툴바·건수와 겹칩니다. `flex-col-reverse` 라 새 것이 위로 올라옵니다
- 아이콘·글자색은 **`Alert` 과 같은 것**을 씁니다 (`badge-*-text`). 같은 톤이 두 컴포넌트에서 달라 보이면 안 됩니다
- `action`(되돌리기)은 **실행 취소가 실제로 가능할 때만** — 눌러도 되돌릴 수 없으면 없느니만 못합니다
- `ToastProvider` 는 앱 루트에 하나 (`TooltipProvider` 와 같은 자리). Storybook 은 `preview.tsx` decorator

### 떠 있는 패널

- **반경은 전부 `Radius/md`(6)** — Popover · Tooltip · Toast · ComboboxPanel · LookupPanel. Card·Dialog 처럼 큰 표면만 `Radius/lg`(8) 입니다
- ComboboxPanel 과 LookupPanel 이 8이었고 **변수 바인딩도 없었습니다** (LookupPanel 은 2026-08-07 에야 잡혔습니다). 직접 값을 넣으면 토큰을 바꿔도 안 따라옵니다 — 새 패널은 반드시 `Radius/md` 에 바인딩하세요 (2026-08-06 정리)
- 표면·테두리는 `Background/White` · `Border/Gray-Light` 를 씁니다. 값이 같은 `Menu/Surface` · `Menu/Border` 가 따로 있지만 **아무도 안 쓰는 상태**입니다 — 미결

### Badge

- 상태가 **2종이면 점(dot), 3종 이상이면 배지**. 둘 다 켜면 같은 정보를 두 번 말하는 셈입니다
- Chip 과 같은 사이즈 축(sm 20 · default 24 · lg 28)이라 나란히 놓아도 맞습니다

---

## 한 벌로 되는 것 · 갈리는 것

**조회 조건은 한 벌입니다.** 앱 루트에 `PointerModeProvider` 하나만 두면 호출부에 모바일용 코드를 더할 게 없습니다.

```tsx
<PointerModeProvider>{/* TooltipProvider · ToastProvider 와 같은 자리 */}
  …
  <FilterBar summary={…}>
    <FilterRow>
      <FormField label="기간"><DateRangePicker quickSelect value={v} onValueChange={setV} /></FormField>
    </FilterRow>
    <FilterRow>
      <FormField label="검사 항목"><Select options={…} … /></FormField>
    </FilterRow>
  </FilterBar>
</PointerModeProvider>
```

| | 무엇이 알아서 되나 | 기준 |
|---|---|---|
| **`DatePicker`** · `DateRangePicker` · `Select` · `Combobox` · `ConfirmDialog` | 팝오버·모달 ↔ **시트** | 포인터 (`PointerModeProvider`) |
| `FilterBar` · `FilterRow` | 가로 한 줄 ↔ **세로** | **자기 폭** (`--container-pc` 880) |
| `DateRangePicker` 의 칩 | 옆 ↔ **다음 줄** | `flex-wrap` (≈460) |
| 컨트롤·행·달력 칸 높이 | PC ↔ 모바일 | **창 폭** (`--h-*`, 1024px) |

**아직 갈리는 것** — 구조가 다른 것들입니다. 이건 반응형으로 못 합니다.

| PC | 모바일 |
|---|---|
| `Sidebar` + MDI 탭바 | `MobileTop` + `MBottomTabBar` + `MobileMenuScreen` |
| `Table` | `MobileListCard` + `MobileListHeader` |
| `Pagination` | 더 보기 / 무한 스크롤 |

`MobileDateRangePicker` · `MobileSelect` 는 **직접 부르지 않습니다** — 위 컨트롤들이 시트일 때 렌더하는 구현입니다.

## 모바일 대응 규칙

**코드에서 모바일 전용은 `Mobile` 접두사로 구분하고 파일은 `ui/` 에 그대로 둡니다** — Figma 도 따로 모으지 않고 성격에 맞는 페이지(Layouts · Overlay · DatePicker)에 이름으로 구분합니다. 다만 **Storybook 그룹만 `Mobile/`** 로 모읍니다. 그룹은 "무엇인가" 로 나누는 축이고 모바일은 "어디서 쓰나" 라는 다른 축이라, 섞으면 찾기 어렵습니다.

**Responsive 변수로 자동 대응되는 것** — Input · Select · Button · Checkbox · Radio · Switch · CalendarCell · ListItem

**구조를 다시 짜야 하는 것**

| PC                      | 모바일                                      |
| ----------------------- | ------------------------------------------- |
| Sidebar 256             | MBottomTabBar + MobileMenuScreen(전체 화면) |
| Sidebar 안의 메뉴 항목  | SidebarItem — **PC·모바일 같은 부품**       |
| Table 7열               | MobileListCard — 행 하나가 카드 하나        |
| TableToolbar 제목·건수  | MobileListHeader — 정렬은 필터 시트로       |
| TableToolbar 아이콘 4개 | 2개 + `⋯` DropdownMenu                      |
| Pagination              | 더 보기 / 무한 스크롤                       |
| Dialog — 확인창          | **자동으로 MobileSheet** (`ConfirmDialog`)   |
| Dialog — 폼             | 전체 화면 (내용이 정합니다)                  |
| Combobox · Lookup       | MobileSelectContent + MobileSheet           |
| DatePicker 두 달 패널   | MobileCalendar 한 달 + MobileSheet          |
| 조회 조건 가로 한 줄    | **FilterBar 한 벌** — 자기 폭을 재서 갈립니다 |

### MobileSheet

- **Scrim 이 컴포넌트 안에 들어 있습니다.** 쓰는 쪽에서 따로 깔지 마세요 — 빠뜨리거나 투명도가 달라집니다
- **시트를 두 개 겹치지 마세요.** 뒤로 가기 동작이 꼬입니다
- **손잡이는 끌어내려 닫을 수 있다는 신호**라 실제로 드래그가 동작합니다. 신호만 주고 안 되면 한 번 해보고 다시는 시도하지 않습니다. 높이의 1/4(최소 80px) 이상 내리면 닫힙니다 — 절반으로 잡으면 큰 시트를 닫기 힘듭니다
- 열 때 **첫 입력에 커서를 주지 않습니다** (`onOpenAutoFocus` 차단). 키보드가 올라와 시트를 덮습니다
- 고르는 즉시 닫히는 시트는 **푸터를 끕니다** — 한 번 누르면 끝나는데 버튼을 또 누르게 하면 번거롭습니다
- Dialog 와 **같은 Radix 프리미티브**를 씁니다. 포커스 가두기 · ESC · 배경 스크롤 잠금이 시트에도 똑같이 필요합니다
- 손잡이 색은 **`Sheet/Handle`** 입니다 (코드 `--color-sheet-handle`). Figma 가 `Color/gray/300` 을 직접 참조하고 있어 Semantic 변수를 새로 만들어 바인딩했습니다 (2026-08-07). 회색 팔레트를 손대면 손잡이까지 함께 바뀌는 걸 막습니다
- **문서·데모에서는 `container` 로 390×844 틀 안에 가둡니다.** 시트가 `fixed` 라 그냥 두면 브라우저 창 전체를 덮습니다 — 틀에 `transform: translateZ(0)` 을 함께 줘야 갇힙니다 (transform 이 있는 조상이 fixed 의 기준이 됩니다). 실제 앱에서는 넘기지 마세요, 화면이 곧 틀입니다
  - **틀은 `PointerModeProvider` 에 알려줍니다** (2026-08-11). `<PointerModeProvider mode="touch" container={frame}>` 한 번이면 그 안의 시트가 전부 따라옵니다 — 컨트롤마다 `container` 를 넘기게 하면 **반드시 빠집니다.** 실제로 `DateRangePicker` 의 오버레이 스토리에서 빠져 시트가 브라우저 창을 꽉 채웠습니다. 「연결을 호출부에 시키면 반드시 빠집니다」와 같은 종류입니다
    - 컨트롤의 `container` prop 은 남겨 둡니다 — **직접 준 것이 이깁니다.** Provider 밖에서 한 곳만 가둘 때 씁니다
  - **열 때 뒤 화면이 움직이면 `focus({ preventScroll: true })` 입니다** (2026-08-11). 시트는 화면 아래쪽에 있어서 그냥 `focus()` 하면 브라우저가 그걸 보이게 하려고 **조상들을 스크롤합니다** — 긴 문서에서는 시트가 아니라 뒤가 움직이는 것처럼 보입니다. 시트는 이미 `fixed` 라 스크롤할 이유가 없습니다. `Select` · `Combobox` 의 패널도 같은 사정이라 함께 고쳤습니다
  - **`modal` 을 끄지 마세요.** 위 증상을 스크롤 잠금 탓으로 보고 `modal={!container}` 로 껐다가 되돌렸습니다 — **Radix 는 `modal` 이 아니면 `Overlay` 를 아예 안 그려서 Scrim 이 통째로 사라집니다.** 잠금은 원인이 아니었습니다
- 애니메이션은 `--animate-slide-up`. `prefers-reduced-motion` 에서는 페이드로 바뀝니다 — 화면 높이만큼 움직이는 건 어지럼을 만들기 쉽습니다

### MobileSelect

- **목록을 다시 만들지 않습니다.** Figma 문서 그대로 — "PC 와 같은 ComboboxPanel 을 쓰고 **감싸는 컨테이너만** MobileSheet 로 분기". 검색·초성 매칭·전체 선택이 한 벌입니다
- **항목 높이는 `--h-list-item` 이 알아서 바꿉니다** (PC 32 / 모바일 48). 코드에서 지정하지 않습니다
- **확인 버튼은 다중일 때만** — 단일은 고르면 바로 닫힙니다. PC 의 `Select`(확인 없음) · `DateRangePicker`(확인 있음)와 같은 기준입니다
- 다중은 **확정 전까지 draft 로만** 바뀝니다. 취소하면 시트를 열기 전 값으로 돌아갑니다
- **`ack-mobile` 클래스** — 데모·문서에서 모바일 환경을 흉내낼 때 씁니다. 미디어쿼리는 **브라우저 창**을 재기 때문에, 390 틀 안에 넣어도 창이 넓으면 목록이 PC 높이(32)로 나옵니다. 실제 앱에서는 쓰지 마세요

### MobileDateRangePicker · 모바일 달력

- **달력은 한 벌입니다.** `CalendarMonth` 에 `header` 축(`select` ↔ `nav`)만 더해 재사용합니다 — 날짜 계산·범위 띠·미리보기를 두 번 만들지 않습니다
- **범위 규칙도 한 벌입니다** — `useDateRangeDraft`(`date-range-picker.tsx`). 언제 시작이 되고 언제 종료가 되는지 · 시작보다 앞을 고르면 어떻게 되는지 · 탭을 누르면 달을 옮길지를 PC 패널과 **같은 훅**에서 가져옵니다. `monthsVisible` 만 1·2 로 다릅니다
  - **2026-08-07 이전에는 이 컴포넌트가 그 규칙을 다시 구현하고 있었습니다.** `MobileSelect` 는 “목록을 다시 만들지 않고 감싸는 컨테이너만 분기” 를 지켰는데 여기서는 알맹이까지 복사돼 있어, 한쪽만 고치면 아무도 모르는 상태였습니다
  - **껍데기(시트 vs 팝오버)는 `PointerModeProvider` 가 정합니다** — 손가락이면 시트, 마우스면 팝오버. 호출부는 `<DateRangePicker/>` 만 쓰고 아무 판단도 하지 않습니다 (2026-08-07)

### PointerModeProvider — 손가락이냐 마우스냐

- **이건 폭의 문제가 아닙니다.** `FilterBar` 처럼 *배치*를 정하는 것은 폭이 기준이라 컨테이너 쿼리로 풀립니다. 시트냐 팝오버냐는 다릅니다 — 시트가 아래에서 올라오는 건 **엄지가 닿는 곳**이라서고, 팝오버가 트리거에 붙는 건 **마우스가 이미 거기 있어서**입니다

  | | 맞는 것 |
  |---|---|
  | 좁은 데스크톱 창 | **팝오버** (마우스니까) |
  | 넓은 태블릿 | **시트** (손가락이니까) |

  폭으로 정하면 둘 다 틀립니다. 기준은 `(pointer: coarse)` 입니다
- **앱 루트에 하나** — `TooltipProvider` · `ToastProvider` 와 같은 자리입니다. 여기서 한 번 정하면 조건이 네 개라고 네 번 적을 일이 없고, 하나를 빠뜨려 데스크톱에 시트가 뜨는 일도 없습니다
- **문서·데모에서는 값을 고정합니다.** Storybook 은 전역 `mode="mouse"`, 390 틀 안은 `mode="touch"`. 컴포넌트가 스스로 `matchMedia` 를 부르게 두면 **창**을 재게 되어 틀 안에서 흉내낼 수단이 없어집니다 — `.ack-mobile` 이 유틸리티 variant 를 못 막는 것과 같은 함정입니다
- Provider 가 없어도 동작은 합니다 (브라우저에 직접 묻습니다). 다만 값을 고정할 수 있어야 해서 **루트에 두는 쪽을 권합니다**
- **`MobileDateRangePicker` · `MobileSelect` 는 이제 “시트 쪽 구현” 입니다.** 지우지 않습니다 — `DateRangePicker` · `Select` · `Combobox` 가 시트일 때 렌더하는 것이 이들이고, Figma 에도 같은 이름의 컴포넌트가 있습니다. 다만 **호출부에서 직접 부를 자리는 없어졌습니다** (강제하려면 `overlay="sheet"`)
- **`DateRangePicker` · `Select` · `Combobox` 가 이 규칙을 씁니다.** 조회 조건에 쓰는 세 컨트롤이 전부 한 벌입니다 — 호출부는 `<Select/>` 만 쓰고 시트인지 팝오버인지 모릅니다
  - `MobileSelect` 는 `Select` 가 아니라 **`Combobox` 의 짝**입니다 (둘 다 `value: string[]` · `type` · `searchable`). `Select` 는 값이 하나라 `단일 · 검색 없음` 으로 고정해 넘기고 배열 ↔ 문자열만 바꿔 끼웁니다
  - **시트로 열면 트리거 표현이 안 쓰입니다** — `render` · `maxChips` · `clearable` · `leadingIcon`. 시트 쪽 트리거는 글자 한 줄이고, `editable` 처럼 트리거에 직접 치는 방식은 시트와 맞지 않습니다
  - `Combobox` · `Select` 가 `MobileSelect` 를 부르면서 **순환 import** 가 생겨(`combobox → mobile-select → combobox`) 패널을 `combobox-panel.tsx` 로 뽑았습니다. 예전 경로도 그대로 동작하도록 `combobox.tsx` 가 다시 내보냅니다 (2026-08-07)
  - **날짜도 같은 일을 겪었습니다** — `DateRangePicker` 가 시트 구현을 부르고 시트가 규칙을 다시 가져가면서 `date-range-picker ↔ mobile-date-range-picker` 순환이 생겼습니다. 탭·프리셋·`useDateRangeDraft` 를 **`date-range-core.tsx`** 로 뽑았습니다 (2026-08-11). 예전 경로는 `date-range-picker.tsx` 가 다시 내보냅니다
  - **한 벌로 합칠 때마다 생기는 모양입니다** — 완성형이 시트 구현을 부르고, 시트가 알맹이를 도로 가져갑니다. **알맹이를 제3의 파일로 뽑고 예전 경로는 재수출**하는 것이 이 저장소의 답입니다
- **년·월 머리글에 화살표가 함께 붙습니다** (`CalendarMonth` 의 `header="nav"`) — 옆 달로 가는 것이 가장 잦은 이동인데 그때마다 Select 를 열고 고르고 닫는 건 손이 많이 갑니다. **Select 도 남겨 둡니다**: 먼 달로 갈 길이 화살표뿐이면 수십 번 눌러야 합니다
  - 예전에는 “시트 위에 Select 패널을 또 띄우지 않으려고 화살표만 둔다” 고 적어뒀는데, **`header` prop 이 선언만 되고 아무 데도 안 쓰여** 실제로는 Select 만 떴습니다 (2026-08-07 구현). 겹쳐 뜨는 것은 그대로 두기로 했습니다 — Radix 가 레이어를 쌓아 처리하고, 먼 달로 가는 길이 필요합니다
- PC 는 두 달, **모바일은 한 달**. 모바일 폭에 두 달을 넣으면 칸이 손가락보다 작아집니다
- **확인은 시트 Footer 가 담당합니다** — 달력 자체에는 버튼이 없습니다 (Figma 규칙)
- 빠른 선택 칩은 **균등 분할**(`flex-1`). 6개를 넘으면 가로 스크롤로 바꾸세요
- 칩 연동 규칙은 PC 와 같습니다 — 달력에서 임의 기간을 고르면 **칩 선택이 풀립니다**

### MBottomTabBar — PC 의 Sidebar 자리

- **마지막 자리는 홈이 아니라 전체메뉴**입니다. 직원용이라 돌아갈 홈이 없고, 자주 쓰는 넷 말고도 들어갈 메뉴가 계속 생깁니다. 전체메뉴는 **PC 와 같은 메뉴 구조**를 띄웁니다 — PC 로 익힌 위치를 다시 배우지 않아도 됩니다
- **전체메뉴를 열어도 활성 탭은 그대로입니다.** 여는 동안만 마지막 자리에 불이 들어오고(`menuOpen`), 닫으면 원래 탭으로 돌아옵니다. 메뉴에서 화면을 골라야 `value` 가 바뀝니다 — 열었다 닫은 것은 화면 이동이 아니라서, 그때 탭이 옮겨 가면 어디에 있었는지를 잃습니다
- **전체메뉴 포함 5개까지.** 390 폭에서 5개면 한 칸이 78 이고, 여섯이 되면 10px 라벨이 잘립니다. `items` 는 **4개까지만 받는 튜플**이라 다섯 번째는 컴파일이 안 됩니다
- **라벨을 빼지 마세요** — 아이콘만으로는 통계조회와 검사이력이 구분되지 않습니다
- 활성은 **색 + 굵기 두 가지**로 알립니다. 색만으로는 색각 이상에서 안 보입니다
- **탭바는 스크롤 영역 밖에** 두세요. 안에 넣으면 목록과 함께 밀려 올라갑니다 — Table 헤더 행과 같은 이유입니다
- `homeIndicator` 는 문서·데모용 장식입니다. 실제 기기에서는 OS 가 그리므로 끄세요. 아래 24px 여백은 그 자리(Safe Area)라 항상 둡니다

### MobileListHeader — 표 헤더가 없어서 생긴 줄

- **카드 목록에는 표 헤더가 없습니다.** PC 는 헤더 행이 열 이름을 알려주고 거기서 정렬까지 하는데, `MobileListCard` 를 쌓으면 그 자리가 통째로 없어집니다. 이 줄이 **무엇의 목록인지 · 몇 건인지 · 어떻게 고를지**를 대신합니다
- **건수는 `FilterBar` 의 배지와 같은 값**입니다 (조회 결과 전체 수, 화면에 보이는 카드 수가 아님). 한 화면에 두 곳에 나오므로 다르면 어느 쪽이 맞는지 판단할 수 없습니다
- **`onFilter` 를 안 넘기면 버튼이 사라집니다.** 눌러도 아무 일이 없는 버튼은 두지 마세요
- **스크롤 영역 밖**에 두세요 — 목록과 함께 밀려 올라가면 몇 건인지 다시 확인할 수 없습니다
- 제목은 `base/Bold`, 아래 카드 제목은 `base/SemiBold` — **굵기 한 단계**로 위계를 만듭니다
- 필터 버튼은 **ghost** 입니다. Figma description 은 "outline" 이라 적고 있었지만 컴포넌트가 ghost 였고, 목록 위에 테두리가 하나 더 생기면 카드와 경계가 겹쳐 보입니다 — **컴포넌트가 맞아** 문장을 고쳤습니다 (2026-08-07)

### MobileListCard — 표를 카드로

- **표마다 열이 다르므로 내용을 정하지 않고 자리만 정합니다.** 어느 열을 어디에 넣을지는 쓰는 쪽이 고릅니다

  | 자리 | 몇 개 |
  |---|---|
  | `title` | 1개 — 목록에서 찾는 기준 |
  | `meta` | 한 줄 — 나머지를 `·` 로 이어 씀 |
  | `count` | 1개 (굵게) |
  | `badge` 또는 `status` | 1개 |
  | `values` | **2개까지** |

- **자리 수를 타입으로 막았습니다.** `values` 는 `[V] | [V, V]` 라 세 개를 넣으면 컴파일이 안 되고, `badge`/`status` 는 판별 유니온이라 둘 다 넣을 수 없습니다. Figma 문서의 "그 이상은 상세 화면으로 미루세요" 와 "점과 배지를 둘 다 켜지 마세요" 를 코드가 강제합니다
- 상태가 **2종이면 점, 3종 이상이면 배지** — `Badge` 와 같은 규칙입니다
- **간격 0 으로 붙여 쌓으세요.** 사이를 띄우면 낱개 카드로 흩어져 보이고, 표를 옮긴 것이라는 감각이 사라집니다
- 체크박스는 **선택 모드에서만**. 평소에 보이면 누를 것이 둘이 되어 어느 쪽이 상세로 가는지 흐려집니다

### MobileTop — 상단 바

- **세 변형은 왼쪽에 무엇을 두느냐**입니다 — `logo`(앱 첫 화면) · `back`(상세) · `title`(목록). 높이 58 고정
- **`back` 의 타이틀만 절대 배치로 가운데**를 잡습니다. flex 로 나누면 오른쪽 아이콘이 하나 늘 때마다 제목이 왼쪽으로 밀려서, 같은 화면인데 스크롤할 때마다 제목이 움직이는 것처럼 보입니다
- **액션은 아이콘 24 · 탭 영역 44** (iOS 44pt). `MobileTopAction` 이 크기·정렬·`aria-label` 을 함께 강제합니다 — 글자가 없는 버튼이라 라벨이 없으면 보조기술이 읽을 것이 없습니다
- **액션은 2개까지.** 넘으면 `⋯` 로 묶으세요 — 58 안에서 44 짜리가 셋 이상이면 타이틀 자리가 사라집니다
- 상단 바도 **스크롤 영역 밖**입니다 (탭바 · Table 헤더 행과 같은 이유)
- Figma 변형 이름은 원래 `Default` · `backStyle` · `e-smartTop` 이었습니다. `e-smartTop` 은 다른 제품에서 넘어온 이름이라 **하는 일로 다시 지었습니다** (2026-08-07). 같은 날 `logo` · `back` 두 변형을 오토레이아웃 · `Surface/White` · `Divider/Gray-Light` · `icons/*` 인스턴스로 다시 만들었습니다 — 전에는 절대 배치에 손으로 그린 벡터였습니다
  - `title` 변형의 제목도 `title` TEXT 프로퍼티에 묶었습니다. **세트 화면에서는 기본값(“타이틀”)만 보입니다** — TEXT 프로퍼티는 세트 전체가 공유하기 때문입니다. 데모 화면 4곳은 인스턴스에서 “결과조회” 로 되돌렸습니다

### MobileMenuScreen — 전체메뉴

- **시트가 아니라 전체 화면**입니다. 메뉴는 다른 화면으로 떠나는 동작이라 뒤 화면을 남겨둘 이유가 없습니다 — 뒤를 보면서 고르는 날짜·필터만 시트입니다
  - Figma 의 `MobileMenuContent` description 에 “MobileSheet 안에 올라옵니다” 라고 적혀 있었는데, `MobileMenuScreen` 은 390×844 전체 화면이었습니다. **컴포넌트가 사실에 가까워** 문장을 고쳤습니다 (2026-08-07)
- **메뉴 구조는 PC 사이드바 그대로** — `SidebarItem` 을 같이 씁니다. PC 로 익힌 위치를 다시 배우지 않아도 됩니다
- **코드는 탭바를 담지 않습니다.** Figma 는 “화면 하나” 를 그려야 해서 탭바까지 넣었지만, 탭바는 화면이 바뀌어도 남아 있는 것이라 메뉴를 열 때마다 다시 만들어지면 안 됩니다. 코드에서는 **앱 껍데기가 들고** 있고 `MobileMenuScreen` 은 헤더 + 본문까지입니다
- **닫기(X)는 이전 화면으로.** 탭바로도 나갈 수 있지만 되돌아가는 경로가 따로 있는 편이 안전합니다. `onClose` 를 넘기지 않으면 X 가 없습니다 (Figma 의 `Close` 축)
- 메뉴가 길면 **본문만 스크롤**합니다 — 헤더와 탭바는 남습니다
- **오른쪽에서 밀려 들어와 오른쪽으로 나갑니다** (`--animate-push-in` 220ms · `--animate-push-out` 180ms). 모바일에서 화면이 바뀌는 표준 움직임이고, 나갈 때 오른쪽으로 되돌아가므로 뒤로 가기와 방향이 맞습니다. **시트의 아래→위와 일부러 다릅니다** — 같은 움직임을 쓰면 전체 화면인지 시트인지가 흐려집니다
  - `open` 을 넘기면 컴포넌트가 여닫는 움직임을 맡습니다. 부모를 `relative overflow-hidden` 으로 두세요. 나가는 동안에는 `pointer-events` 를 꺼서 사라지는 중인 화면을 못 누르게 합니다. `prefers-reduced-motion` 에서는 페이드

### Sidebar — PC 좌측 GNB

- **Header · Menu · Footer** 세 영역. 펼침 **256** · 접힘 **72**
- **접힘은 항목이 스스로 압니다** — `SidebarCollapsedContext` 로 내려줍니다. 항목마다 `collapsed` 를 넘기게 하면 하나만 빠뜨려도 그 줄만 라벨이 남습니다
- 접히면 **2단계는 통째로 사라집니다.** 아이콘도 라벨도 없어 그릴 것이 없습니다
- **접힘 상태의 이름은 하위 유무로 갈립니다** (2026-08-10). 라벨이 화면에서 사라지므로 이름을 알릴 것이 필요한데, 툴팁은 **이름만 말할 뿐 이동시키지 못합니다** — 하위가 있는데 툴팁만 두면 접힌 동안 2단계 페이지로 갈 길이 아예 없어집니다

  | | 접힘에서 | |
  |---|---|---|
  | 하위 없음 | **툴팁** — 이름만 | `SidebarItem` |
  | 하위 있음 | **서브메뉴 팝오버** — 이름 + 2단계 | **`SidebarGroup`** |

  - **둘을 함께 띄우지 않습니다** — 같은 이름이 두 번 나오고 서로 겹칩니다. `SidebarGroup` 이 안쪽 `SidebarItem` 에 `tooltip={false}` 를 줍니다
  - **1단계가 자기 하위를 알아야 그릴 수 있습니다.** 형제로 나란히 놓으면 알 수 없어서 `SidebarGroup` 으로 묶습니다 — 펼침에서는 1단계 줄 + (열렸으면) 2단계, 접힘에서는 아이콘 + 팝오버
  - **팝오버 안에서는 접힘을 끕니다** — `SidebarItem` 은 컨텍스트가 `true` 면 2단계에서 `null` 을 반환합니다. 그대로 두면 **패널이 통째로 빕니다**
  - 폭 **240** = 항목 232 + 좌우 4. 펼침(256)의 항목 폭과 같은 값이라 접었다 폈을 때 글자가 제자리에 있습니다. 들여쓰기 32 도 그대로 둡니다 — 같은 줄이 같은 모양으로 나와야 다시 배우지 않습니다
  - **`Tooltip` 이 아니라 `Popover` 입니다** — 툴팁은 읽는 것이라 안에 누를 것을 두면 안 되고, Radix `HoverCard` 는 이 저장소에 없습니다. `open` 을 직접 몰고 hover·focus 로 여닫습니다. 나가는 것은 **120ms 미룹니다** — 레일과 패널 사이 8px 틈을 지나는 동안 닫히면 못 씁니다
  - **패널은 Portal 로 빠져나갑니다.** focus 는 React 트리를 타고 올라오지만 **pointerenter·leave 는 버블하지 않아** 패널에 직접 답니다. 안 그러면 틈에서 닫힙니다
  - **`Tab` 으로 도착하면 열리되 포커스는 아이콘에 남습니다** — 안 그러면 `Tab` 한 번에 메뉴 안으로 빨려 들어가 다음 1단계로 넘어갈 수 없습니다. 안으로 들어가려면 `Enter`·`Space`·`→`, 나오려면 `Esc`
  - 앱 루트에 `TooltipProvider` 가 필요합니다 (하위 없는 항목이 여전히 툴팁을 씁니다)
- **접으면 로고 자리가 토글입니다.** Figma 의 `Collapsed` 는 토글 아이콘을 숨겨 두어 한 번 접으면 **다시 펼 방법이 없습니다.** 겉모습은 그대로 두고 로고를 버튼으로 만들었습니다 (2026-08-07, Figma 는 아직 그림만)
- **메뉴가 6개를 넘으면** 슬롯을 늘리지 말고 Menu 영역만 스크롤합니다 — Header·Footer 는 남습니다
- Header 높이는 **둘 다 52**. Figma 가 40·52 로 갈려 있어 접을 때 로고가 튀었습니다 (2026-08-07 Figma 도 52 로 맞춤). Header 테두리도 `Border/Gray-Light` → **`Sidebar/Border`** 로 바꿔 Footer 와 같은 토큰을 씁니다
- 오른쪽 작업 영역은 **남는 폭을 쓰게** 두세요 (`flex-1`). 고정 폭을 주면 접을 때 빈칸이 생깁니다
- **`Sidebar1`(Layouts 페이지)은 옛 목업입니다** — 인스턴스 0개, description 없음, 폭 212, `Color/Primary/500` 같은 **Primitive 를 직접 참조**하고 `SidebarItem` 을 쓰지 않습니다. 진짜는 Navigation 페이지의 `Sidebar` 입니다. 정리 대상

### EmptyState — 셋의 차이는 “다음에 무엇을 하느냐”

| `type` | 무슨 상황 | 사용자가 할 일 | 버튼 |
|---|---|---|---|
| `no-result` | 조회했는데 0건 | **조건을 바꿉니다** | `조건 초기화` (outline) |
| `no-data` | 데이터 자체가 없음 | **만듭니다** | `추가` (**Primary**) |
| `error` | 불러오기 실패 | **다시 시도합니다** | `다시 시도` (outline) |

- **`no-data` 만 Primary** 입니다 — 셋 중 유일하게 *새로 만드는* 동작이라 그 화면의 주 액션입니다. 나머지 둘은 되돌리거나 다시 해보는 것이라 outline
- **문구가 `type` 을 따라옵니다.** Figma 는 TEXT 프로퍼티가 세트 전체 공유라 여섯 변형이 전부 “조회 결과가 없습니다” 로 보입니다 (「변형별 값 vs 프로퍼티」 제약). **코드에는 그 제약이 없어** 제목·설명·버튼 글자를 `type` 별로 채웠습니다
- **표에서는 헤더 행을 남깁니다** — 헤더까지 지우면 어떤 열을 조회했는지 알 수 없습니다. `TableEmptyRow` 가 `colSpan` 으로 본문만 채웁니다
- `size="sm"` 은 카드·시트처럼 좁은 영역용 (세로 여백 72 → 40)
- **`onAction` 을 빼면 버튼이 사라집니다.** 할 수 있는 일이 없을 때만 — 막다른 길에 버튼까지 없으면 더 답답합니다
- **실패는 Toast 만으로 두지 마세요** — 조회가 실패했으면 화면에도 `type="error"` 를 남깁니다 (`Toast` 규칙과 같음)

### FilterBar — 조회 조건 (PC·모바일 한 벌)

**Figma 는 `PCFilterBar` · `MobileFilterBar` 둘, 코드는 `FilterBar` 하나입니다.**
두 컴포넌트가 상태 기계도, "조회하면 접힘" 도, props 11개 중 10개도 같았습니다 — 규칙을 바꿀 때 한쪽만 고쳐도 아무도 모릅니다 (실제로 버튼 크기가 모바일에만 `lg` 로 남아 있었습니다). 그림은 한 폭만 보여줄 수 있으니 **Figma 가 둘로 그리는 것은 맞습니다** (2026-08-07 통합)

- **미디어쿼리가 아니라 컨테이너 쿼리입니다.** `lg:` 는 **브라우저 창**을 재서, 문서의 390 틀 안에 넣어도 창이 넓으면 PC 배치가 나옵니다 — `.ack-mobile` 은 CSS **변수**만 덮어쓰지 유틸리티 variant 는 못 막습니다. **자기 폭을 재는 쪽이 실제로도 맞습니다** — 사이드바가 열려 작업 영역이 좁아졌으면 창이 넓어도 접힌 배치가 옳습니다
  - 경계는 `--container-pc`(880) **하나**입니다 (`ack-theme.css`). `@container/filter` 를 걸고 `@pc/filter:` 로 씁니다
  - `container-type: inline-size` 는 `position: fixed` 자손의 기준이 되지만 `MobileSheet` · `Popover` 는 **Portal 로 빠져나가므로** 영향 없습니다

| | 좁을 때 | 넓을 때 |
|---|---|---|
| 조건 배치 | 세로로 쌓음 | **가로 한 줄** |
| 접힌 줄 | 요약 + **건수 배지** | 요약 + **“조건 변경” 버튼** |
| 캡션 | 펼치면 커짐(`base/SemiBold`) | 늘 `sm/SemiBold` |
| 버튼 | 화면을 반씩 (`flex-1`) | 우측에 내용 폭만큼 |
| 누르는 곳 | **줄 전체** | 버튼만 |

- **조회하면 자동으로 접힙니다.** 조건은 한 번 정하고 결과를 계속 봅니다. 접으면 **표가 약 150px 넓어집니다** (펼침 200 · 접힘 56)
  - **넓을 때 여백은 바깥이 갖습니다** — 머리줄 32 + 위아래 12 로 접힘 56, 펼침 200 이 나옵니다. 머리줄에 `h-8` 을 주고 여백을 안쪽에 넣으면 `border-box` 라 32 안에 여백이 먹혀 **줄이 통째로 낮아집니다** (2026-08-07 수정). 좁을 때는 머리줄·필드가 각자 여백을 갖습니다
- **요약과 건수 배지는 접혔을 때만.** 펼치면 아래 필드에 같은 정보가 있어 중복이고, 조건을 바꾸는 중에 이전 결과 수가 남아 있으면 혼란스럽습니다. 요약은 걸린 조건을 `·` 로 이어 씁니다
- **좁을 때 줄 전체가 눌리는 이유** — 손가락은 정확히 겨냥하기 어렵습니다. 넓을 때는 마우스로 찍으므로 **누를 곳을 눈에 보이게** 둡니다. 두 방식은 한 요소로 못 합니다(버튼 안의 버튼) — Head 에 **투명 오버레이 버튼**을 깔고 넓어지면 숨깁니다
  - **오버레이에는 `z-10` 이 필요합니다.** 같은 줄의 자식 중 하나라도 `transform` 이 걸리면(화살표의 `rotate-180`) 스택 문맥이 생겨 오버레이 **위로** 올라옵니다. 그러면 그 위를 눌러도 오버레이에 닿지 않습니다 — 실제로 **펼친 상태에서만 화살표가 안 눌리는** 증상으로 나타났습니다 (2026-08-07). 장식 화살표에는 `pointer-events-none` 도 함께 답니다
- **버튼은 `items-end` 로 필드 바닥에 붙입니다.** 라벨이 없어 그냥 두면 **17px 위로 뜹니다**(라벨 높이). 크기는 `default` — `--h-input-default` 가 40/36 으로 알아서 갈립니다
- **조건은 4개까지.** 넘으면 좁을 때는 별도 필터 시트로, 넓을 때는 별도 검색 화면으로
- 조건 줄은 **`FilterRow`** 로 감쌉니다 — 좁으면 세로, 넓으면 가로로 바뀝니다. 기간(`DateRangePicker quickSelect`)은 넓어서 자기 줄을 씁니다
- **조건의 폭은 컨트롤마다 다릅니다** — 날짜만 컴포넌트가 갖고, 나머지는 감싸는 쪽이 정합니다

  | | 기본 | 좁히려면 | 채우려면 |
  |---|---|---|---|
  | `Input` · `Select` · `Combobox` · `Textarea` | **`w-full`** — 부모를 채움 | **`FormField` 에 폭** | 그대로 두면 됨 |
  | `DatePicker` · `DateRangePicker` | **값에 맞는 폭** (148 · 248 …) | 그대로 두면 됨 | 컨트롤에 `w-full` |

  날짜만 반대인 이유는 **자릿수가 정해져 있어서**입니다. `2026-08-11` 은 언제나 같은 길이라 컴포넌트가 계산할 수 있지만, 검사 항목 목록은 얼마나 긴 이름이 올지 컴포넌트가 알 수 없습니다
  - **폭에는 `@pc/filter:` 를 붙이세요** — 세로로 쌓일 때는 줄을 꽉 채워야 하니 폭이 걸리면 안 됩니다. 안 붙이면 좁은 배치에서도 고정돼 줄이 안 찹니다

    ```tsx
    <FormField label="검사 항목" className="@pc/filter:w-50"><Select … /></FormField>
    <FormField label="정렬" className="@pc/filter:w-42"><Select … /></FormField>
    ```
  - **폭은 `FormField` 에 줍니다** — 라벨·설명·에러까지 같은 폭이어야 합니다. `Select` 에 주면 라벨만 부모 폭으로 남습니다
  - 값(`w-50` · `w-42`)은 **내용을 보고 정합니다** — `접수번호순` 은 `일반혈액검사` 보다 짧아 더 좁습니다. 규칙으로 만들 수 없는 자리입니다
- **안에 넣는 컨트롤도 한 벌입니다** — `<DateRangePicker/>` · `<Select/>` · `<Combobox/>` 를 그대로 씁니다. 시트로 열지 팝오버로 열지는 CSS 로 고를 수 없지만 **`PointerModeProvider` 가 정하므로** 호출부는 판단하지 않습니다. 스토리도 PC 와 모바일이 **글자 하나까지 같습니다** — 390 틀만 `mode="touch"` 로 감싸져 있습니다
  - **조회 조건에서 `MobileDateRangePicker` · `MobileSelect` 를 직접 부를 자리는 없습니다.** 2026-08-07 이전에는 "좁은 화면은 모바일 컨트롤, 넓은 화면은 PC 컨트롤" 라고 적어뒀는데, `PointerModeProvider` 가 들어오면서 사실이 아니게 됐습니다 (2026-08-10 수정). 억지로 시트를 쓰려면 `overlay="sheet"` 가 있지만, 앱 화면에서 이걸 넘기기 시작하면 Provider 를 둔 뜻이 없어집니다 — 실제로 쓰는 곳은 문서·데모입니다
- Figma description 이 "Expanded 206" 이라 적고 있었는데 변형은 **200** 입니다 — 변형에 맞췄습니다 (2026-08-07)

### Lookup — 열이 여러 개인 드롭다운

- **가르는 축은 한 줄에 무엇이 들어가느냐입니다**

  | | 한 줄에 | 언제 |
  |---|---|---|
  | `Combobox` | **이름 하나** | 이름만으로 판단됩니다 |
  | `Lookup` | **열 여러 개** | 코드·단위까지 봐야 어느 것인지 압니다 |

  검사명이 비슷한 항목이 여럿일 때 `CD001` 과 `CD002` 를 나란히 봐야 고를 수 있습니다. **이름만으로 판단되면 `Combobox`** 를 쓰세요 — 열이 늘면 패널이 넓어지고 읽을 것이 많아집니다
- **`ListItem` 을 쓰지 않습니다.** 남은 작업에는 "Popover + ListItem 조합" 이라 적혀 있었지만 `ListItem` 은 **한 줄에 라벨 하나**를 그리는 부품이라 열을 나눌 수 없습니다. `LookupRow` 가 따로 있는 이유가 그것입니다 (2026-08-07)
- **열은 4개까지.** Figma 도 Cell 을 4개까지만 둡니다 — 넘으면 패널이 표가 되고, **표는 화면에 놓는 것이지 드롭다운에 담는 것이 아닙니다.** `columns` 는 4개까지 받는 튜플이라 다섯 번째는 컴파일이 안 됩니다
- **폭을 주지 않은 열이 남는 폭을 채웁니다** (Figma 의 Cell 2). 하나만 비워 두세요
- **닫힌 트리거에도 코드와 이름을 함께 보여줍니다** (2026-08-11). 이름만 남기면 비슷한 검사가 여럿일 때 무엇을 골랐는지 확인할 수 없는데, **애초에 그 구분 때문에 `Combobox` 대신 이걸 쓰는 것**입니다. Figma 문서에도 "닫힌 상태에 코드+명칭 함께 표시" 라고 적혀 있었습니다. 기본은 `muted` 열 + 폭 없는 열이라 **열이 넷이어도 트리거에는 둘만** 나옵니다 — 한 줄에 다 넣으면 서로를 밀어내 전부 잘립니다
  - **다른 조합은 `displayColumns` 로 열 `key` 를 고릅니다** — `displayColumns={["name", "unit"]}`. 적은 순서대로 놓이고 **둘까지**입니다 (타입이 막습니다)
  - **모양도 고를 수 있습니다** — `{ key: "code", as: "badge" }` 면 그 열만 배지입니다. 코드처럼 **덩어리로 읽는 값**을 이름과 떼어놓을 때 씁니다. 흐린 글자로도 갈리지만 코드가 길거나 이름과 섞여 읽히면 배지가 확실합니다. `Badge`(`neutral` · `sm`) 그대로라 다른 배지와 규격이 맞습니다 — 톤을 바꿔야 하면 `display` 로
  - 값을 합치거나 형식을 바꿔야 하면 `display` 로 만들고, 넘기면 그게 이깁니다
- **코드 열은 `muted`** (`Lookup/Code`). 코드는 찾을 때 쓰는 값이지 읽는 값이 아니라, 검사명과 같은 색이면 눈이 어디를 봐야 할지 정하지 못합니다. **트리거에서도 같은 색**입니다
- **선택된 줄은 코드 열까지 같은 색**(`Lookup/Text-Selected`)입니다 — 한 줄이 통째로 골라진 것이니까요. 굵기는 바꾸지 않습니다(Regular 유지) — 바꾸면 글자 폭이 변해 열이 흔들립니다. Figma description 이 "Medium" 이라 적고 있었는데 **변형이 사실**이라 문장을 고쳤습니다 (2026-08-07)
- **열 제목은 스크롤 영역 밖**입니다. 내려도 어느 열인지 남아야 합니다 (Table 헤더 행과 같은 이유). 열이 하나뿐이면 `header` 를 끄세요
- 트리거는 `SelectTrigger` — `Select` · `Combobox` · `NativeSelect` 와 **같은 껍데기**입니다
- 검색은 **모든 열**을 훑고 초성도 됩니다 (`comboboxMatch` 재사용). 열 때 커서는 **고른 줄**에 가고, 없으면 아무 데도 짚지 않습니다 — 검색어가 있을 때만 첫 결과 (`ListItem` 규칙과 같음)
- **패널 반경이 8 이었습니다.** `ComboboxPanel` 과 똑같이 **변수 바인딩도 없었습니다** — 2026-08-06 정리에서 이 패널이 빠져 있었습니다. `Radius/md`(6)에 바인딩했습니다 (2026-08-07)

### Accordion — 공간을 아끼는 대신 안 보게 됩니다

- **가르는 축은 「항상 보여야 하나」입니다** — 항상 보여야 하면 `Card`, 공간을 아껴야 하면 `Accordion`
- **접힌 내용은 잘 안 봅니다.** 자주 보는 항목은 `defaultValue` 로 펼쳐 두세요 — 중요한 정보를 접어두면 없는 것과 비슷해집니다. **부가 정보에 쓰는 것**이 맞습니다
- **화살표는 「지금 상태」입니다** — 펼쳐져 있으면 위, 접혀 있으면 아래. "누르면 일어날 일" 로 읽어 반대로 두면 같은 화면에서 같은 화살표가 두 뜻을 갖습니다 (`Sidebar` 1단계 화살표와 같은 규칙)
- **`type="single"` 에는 `collapsible` 을 함께** — 안 켜면 **항상 하나는 열려 있습니다.** 전부 접힌 상태가 필요하면 반드시 켜세요. 항목이 많으면 `single` 이 스크롤을 줄입니다
- **`size` 는 `Accordion` 에 한 번만** 줍니다 (컨텍스트로 내려갑니다). 항목마다 넘기면 하나만 빠뜨려도 그 줄만 높이가 다릅니다 — `SidebarCollapsedContext` 와 같은 이유. `sm` 44 · `default` 52 (트리거 높이)
- **높이 애니메이션 때문에 Radix 를 들였습니다** — `height: auto` 로는 애니메이션이 안 걸립니다. Radix 가 내용 높이를 `--radix-accordion-content-height` 로 넘겨주고 키프레임(`ack-theme.css`)이 그걸 씁니다. `prefers-reduced-motion` 에서는 즉시 바뀝니다 — 자리를 밀어내는 움직임이라 어지럼을 만들기 쉽습니다
  - **화살표 회전에는 `group` 이 필요합니다** — Radix 는 `data-state` 를 **트리거에** 답니다. 아이콘에 `data-[state=open]:` 를 직접 걸면 조용히 안 돕니다
- **트리거 안에 버튼을 넣지 마세요** — `<button>` 이라 버튼 안의 버튼이 됩니다 (`SelectTrigger` · `TabItem` 과 같은 사정). 줄에 액션이 필요하면 트리거 밖, 항목 안에 놓으세요
- 항목마다 **하단 구분선만** 있어 쌓으면 선이 이어집니다. 바깥을 `rounded-lg border border-card-border` 로 감싸면 한 덩어리가 됩니다

### DropdownMenu — 고르는 게 아니라 실행하는 것

- **가르는 축은 「누른 뒤에 무엇이 남느냐」입니다**

  | | 무엇을 하나 | 표식 |
  |---|---|---|
  | `Combobox` · `Select` | **값을 고릅니다** | 고른 것에 체크 |
  | `DropdownMenu` | **동작을 실행합니다** | **없습니다** |

  눌러서 화면 어딘가에 그 선택이 남아야 하면 `Combobox`, 아니면 여기입니다
- **`ListItem` 을 쓰지 않습니다** — `ListItem` 은 `selected` · `check` · `checkbox` 를 축으로 가진 **고르는 줄**이고, 여기 필요한 건 그 축이 없는 줄입니다. 체크가 보이면 사용자가 "지금 이게 켜져 있다" 고 읽습니다. `Lookup` 이 `LookupRow` 를 따로 둔 것과 같은 이유입니다. 높이(32)와 상태 색은 같은 토큰을 씁니다
- **삭제는 마지막에 두고 `DropdownMenuSeparator` 로 떼어 놓습니다** — 바로 위 항목을 누르려다 미끄러지는 것을 줄입니다. `tone="destructive"` 로 글자도 빨강이 됩니다
- **위험한 동작의 hover 는 `Surface/Danger-Subtler`(#ffeeee)** 입니다. `Badge/Danger-Soft-Fill`(#ffd9d9)은 배지가 **스스로 서 있는** 색이라 hover 로 쓰면 눌리기도 전에 경고처럼 보입니다
- **항목이 6개를 넘으면** 그룹(`DropdownMenuLabel`)으로 나누거나 별도 화면을 검토하세요
- **비활성 항목은 왜 못 누르는지가 화면에 있어야** 합니다 — "인쇄 (행을 먼저 고르세요)" 처럼. 그냥 흐리기만 하면 고장으로 읽힙니다
- 패널은 **떠 있는 패널 규칙 그대로** — `Radius/md`(6) · `Background/White` · `Border/Gray-Light` · 그림자. hover 와 방향키 커서를 Radix 가 `data-[highlighted]` 하나로 묶어 줍니다
- 어디서 뜨나 — `TableCell(Action)` · `TableToolbar` 아이콘 버튼 · `Card` 의 Action 슬롯. **모바일에서 툴바 아이콘 4개를 2개 + `⋯` 로 줄이는 자리**입니다

### Tabs · TabItem — Radix 를 쓰지 않았습니다

- **`closable` 때문입니다.** Radix 의 `Tabs.Trigger` 는 `<button>` 인데 탭 안에 닫기 버튼이 들어가야 합니다. **버튼 안의 버튼은 잘못된 HTML** 이라 브라우저가 마크업을 재배치합니다 — `SelectTrigger` 를 `<div role="combobox">` 로 만든 것과 같은 이유입니다. 탭도 **`<div role="tab">`** 이고 Enter·Space 를 직접 처리합니다
- **목록 전체가 탭 정지 하나**입니다. 좌우 방향키로 옮기고 그때 바로 전환됩니다(자동 활성) · `Home`·`End` 는 처음·끝 · **`Delete` 는 닫기**(`closable` 인 탭만)
- **`pill` 의 그림자는 장식이 아닙니다** — 활성 알약(흰색)과 `Tab/List-Surface` 의 대비가 1.24:1 이라 빼면 어느 것이 켜져 있는지 구분되지 않습니다
- **굵기는 `line` 만 바뀝니다** (Medium → SemiBold). 알약은 배경이 이미 말하고 있어 굵기까지 바꾸면 **글자 폭이 변해 옆 탭이 밀립니다**
- **밑줄은 목록이 긋습니다.** Figma 는 탭마다 1px 을 두지만 코드는 목록에 한 줄을 긋고 활성 탭만 2px 를 얹습니다 — 탭이 끝난 뒤에도 줄이 이어져야 헤더처럼 보입니다. 겉모습은 같습니다
- 높이는 `--h-input-*` 이라 Input·Button 과 맞고 **모바일에서 자동으로 커집니다** (xs 24→28 · sm 32→36 · default 36→40 · lg 48→52). **`line` 은 `xs`·`sm` 을 피하세요** — 밑줄과 라벨 사이가 좁아 답답합니다
- **MDI 탭바는 `default`(36)** 입니다 (2026-08-12). `sm`(32)은 글자까지 `text-xs`(12)라 문서 탭에 쓰면 눌러야 할 것이 작아 보입니다 — 화면 이름이 들어가는 자리라 본문과 같은 14 여야 합니다. 탭바 자체는 위아래 2px 여백을 더해 **40** 이 됩니다 (Figma 화면 파일도 40)
- **`closable` 은 문서 탭(MDI) 전용**입니다. 고정된 화면 탭에 달면 돌아올 수 없는 탭을 닫게 됩니다. 닫는 탭이 현재 탭이면 **옆 탭으로 옮기세요** — 빈 화면을 보여주지 않습니다
- **Hover 12변형이 Default 와 완전히 같았습니다** — 마우스를 올려도 아무 반응이 없었습니다. 전용 배경 토큰을 새로 만들지 않고 **라벨을 `Tab/Text-Active` 로** 바꿨습니다 (2026-08-07, Figma 도 함께)
- `TabPanel` 은 **코드에만** 있습니다 (Figma 는 탭 목록까지만). MDI 처럼 열어둔 화면을 살려둬야 하면 쓰지 말고 바깥에서 직접 다루세요
  - **`Tabs` 의 형제로 두고 지금 값을 `current` 로 넘깁니다** — `Tabs` 는 `<div role="tablist">` 그 자체라 컨텍스트가 목록 안에서만 살아 있는데, `tablist` 의 자식은 `tab` 뿐이라 패널을 안에 넣으면 잘못된 마크업입니다. 2026-08-11 이전에는 컨텍스트를 요구해서 **바르게 쓰면 반드시 던졌습니다** — 쓸 방법이 없는 API 였고, 스토리 하나가 실제로 깨져 있었습니다

### SidebarItem — PC·모바일이 같이 씁니다

- **Active 가 두 가지 뜻입니다.** 1단계는 *현재 페이지가 속한 묶음*, 2단계는 *현재 페이지 그 자체*라 **동시에 켜집니다**. 배경 틴트는 둘 다 같고(`Sidebar/Item-Active` · `-Strong`, 지금은 값이 같습니다) **좌측 3px 인디케이터는 2단계에만** 붙습니다 — 배경을 진하게 해서 구분하면 사이드바 전체가 무거워집니다
- **하위 메뉴가 없는 1단계는 `chevron` 을 끄세요** — 눌러도 펼쳐지지 않는데 화살표가 있으면 사용자가 눌러 봅니다
- **2단계에는 아이콘·화살표가 없습니다** (Figma 변형에도 그 노드가 없습니다). 타입이 막습니다 — 화살표를 달면 3단계가 있는 것처럼 보입니다
- 높이는 1단계 44 · 2단계 36 (들여쓰기 32). `--h-list-item` 을 쓰지 않습니다 — 메뉴는 목록이 아니라 탐색이라 PC 에서도 좁히지 않습니다
- **Storybook 은 `SidebarItemFlatProps` 로 넘깁니다.** `Meta<typeof SidebarItem>` 이 판별 유니온을 교차시켜 args 를 `never` 로 만들어, 스토리에서 `icon` 조차 못 넘깁니다. 앱 코드는 유니온인 `SidebarItemProps` 를 그대로 씁니다

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

## 앱 코드 — 실제 화면

**`npm run dev` 로 뜨는 것이 결과조회 화면**입니다 (2026-08-12). Storybook 은 부품을 하나씩 보는 자리이고, 여기는 앱이 실제로 도는 코드입니다.

```
src/App.tsx                       Provider 셋 + 화면 하나
src/screens/result-lookup/
  index.tsx      ResultLookupScreen — Sidebar + MDI 탭 + Content
  query-bar.tsx  조회 조건 — QueryFilter (PC·모바일 한 벌)
  mobile.tsx     좁은 화면 껍데기 — 목록 · 상세 전체화면 · 전체메뉴
  patient-list.tsx   왼쪽 판
  patient-detail.tsx 오른쪽 판
  panel.tsx      Panel · SectionTitle · TableFrame (두 판이 함께 씁니다)
  data.ts        자료 — **API 로 갈아끼울 자리**
src/screens/component-gallery.tsx  옛 App — 토큰·컴포넌트 갤러리
```

- **자료를 `data.ts` 로 뺐습니다** — 서버가 붙으면 그 파일만 fetch 로 바꾸고 화면은 그대로 둡니다. 화면 안에 배열을 박아두면 갈아끼울 때 화면을 다시 읽어야 합니다
- **`panel.tsx` 의 셋은 이 화면 전용**입니다. `components/ui` 에 올리지 않았습니다 — 아직 이 화면에서만 쓰고, 다른 화면에서 같은 모양이 필요해질 때 올리는 편이 낫습니다. 지금 올리면 "판이란 무엇인가" 를 한 화면만 보고 정하게 됩니다
- **사이드바에서 화면을 고르면 MDI 탭이 생깁니다** — 탭바가 「열린 화면 목록」이니 그게 맞습니다. 이미 열려 있으면 새로 열지 않고 그 탭으로 갑니다 (같은 화면이 두 번 열리면 어느 쪽이 보던 것인지 모릅니다). **마지막 하나는 닫지 않습니다** — 빈 화면을 보여줄 수 없습니다
- **갤러리는 메뉴에 넣었습니다** — 사이드바 맨 아래 `컴포넌트`. 빌드된 앱에서 토큰과 컴포넌트가 실제로 나오는지 눈으로 보는 자리입니다. Storybook 은 별도 빌드라 배포본에 없습니다. **테스트 빌드 전용이니 실제 제품에서는 `MENU` 의 그 줄을 지우세요**

## Example — 화면 조립 예제

`Example` 그룹에 **실제 조회 화면**이 있습니다 (PC **1920** · 모바일 390). PC 쪽은 Figma `SCL_페이지 디자인`(파일 키 `xyoXv6FjXx4d6DdG04Nftu`)의 `결과조회-기본` 을 옮긴 것입니다 — **컴포넌트 라이브러리와 다른 파일**이니 헷갈리지 마세요. 부품 하나를 보려면 각 컴포넌트 문서로 가고, 여기는 **그것들이 실제로 만나는지** 보는 자리입니다.

### PC — 좌우 분할입니다

```
Sidebar 256 + MDI 탭바                     (원본은 사이드바 212)
└ 조회 조건 — FilterBar (조회하면 접힙니다)
└ 좌우 분할
   ├ 왼쪽 540 고정 — 환자리스트 (범례 + 표 + Pagination)
   └ 오른쪽 나머지 — 상세 (요약 카드 3장 + 검사목록 표)
```

- **왜 좌우인가** — 결과 확인은 **환자를 옮겨 다니며** 합니다. 목록을 떠났다 돌아오는 것보다 왼쪽에서 고르고 오른쪽에서 보는 편이 손이 덜 갑니다. 「이전환자 · 다음환자」 버튼이 그 흐름을 잇습니다
- **머리와 몸통은 붙고, 블록끼리만 떨어집니다** (2026-08-12). `Panel` 이 자식 사이에 10 을 주는데 한 덩어리인 것들 사이에도 끼어서, 제목줄이 자기 표가 아니라 별개 블록으로 읽혔습니다. Figma 는 한 덩어리를 **한 프레임에 `gap 0`** 으로 담고 바깥 10 으로만 떼어 놓습니다

  | | 간격 | Figma |
  |---|---|---|
  | 이름 줄 ↔ 정보 카드 | **0** | `환자상세정보` 프레임 |
  | 검사목록 제목 ↔ 표 | **0** | 검사목록 프레임 |
  | 상세정보 묶음 ↔ 검사목록 | 10 | `ResultList` 바깥 gap |
  | **왼쪽 판 전체** | **0** | `PatientList` 가 판 자체로 gap 0 |

  - 왼쪽은 제목·범례·표·페이지네이션이 **전부 한 표에 속하므로** 판에 `gap-0` 을 줍니다. 숨통이 필요한 자리는 각자 여백을 갖습니다 (범례의 `pb-2`)
  - **좌우 여백은 판이 갖습니다** — 표를 판 가장자리까지 붙이면 표의 테두리와 판의 테두리가 맞닿아 선이 두 겹이 됩니다
- **판은 두 겹입니다** — 판 안에 섹션이 여럿이고, **표가 자기 테두리**를 갖습니다

  ```
  판  (반경 8 · 테두리 · 여백 좌우 20 상하 10)
  ├ 제목줄 40          환자리스트 · 총 979명 · 범례
  ├ 표     자기 테두리   ← 판에 붙이지 않습니다
  └ 페이지네이션 48
  ```

  판에 붙여 그리면 표가 어디서 시작하고 끝나는지 흐려집니다 — 제목줄·페이지네이션과 경계가 겹칩니다. Figma 도 같은 구조입니다 (`Frame 8` 안에 테두리 있는 `Table`)
  - **`TableToolbar` 를 쓰지 않습니다** — 그건 표에 **딱 붙는 줄**이라 아래 테두리가 있고 좌우 여백을 스스로 갖습니다. 여기서는 제목줄이 표 **밖**에 있어서 그대로 쓰면 선이 두 겹이 되고 여백도 판의 여백과 겹칩니다. 표에 붙는 구성(한 겹)에서는 `TableToolbar` 가 맞습니다
  - **`Card` 도 아닙니다.** `Card` 는 제목·내용을 묶는 표면이고, 이 판은 **섹션 여러 개를 담는 자리**입니다. `Card` 는 여백을 갖는 표면(`p-4`~`p-6`)이라 표를 넣으면 헤더 행 배경이 모서리까지 안 닿습니다. **Figma 도 이 두 판은 `Card` 인스턴스가 아니라 그냥 프레임**입니다. 안에 든 **요약 카드 3장만 진짜 `Card`**
  - 좌우 두 판은 **같은 대접**입니다 — 같은 층위인데 다른 테두리를 쓰면 하나가 더 진해 보여 위계가 있는 것처럼 읽힙니다
  - **반경은 8**(`Radius/lg`). 원본은 10 이지만 8 이면 `Card` · `Dialog` 와 같아 화면에서 모서리가 한 종류로 유지됩니다
- **조회 조건은 `FilterBar` 한 벌입니다** (2026-08-12 통합). PC·모바일이 **같은 `QueryFilter`** 를 씁니다 — 배치는 `FilterBar` 가 자기 폭을 재서 정하므로 화면은 판단하지 않습니다
  - **이전 방침은 「PC 는 접지 않는다」였습니다.** 좌우로 나눠 세로가 넉넉하면 접을 이유가 없다고 적어뒀는데, 모바일이 `FilterBar` 를 쓰게 되면서 **컨트롤 다섯이 두 곳에 각각 적히는** 상태가 됐습니다 — 조건을 하나 더하면 한쪽만 고치기 딱 좋은 모양이라, `PCFilterBar` · `MobileFilterBar` 를 합쳤던 것과 같은 판단으로 뒤집었습니다
  - 접는 장치가 하나 늘어나는 것은 감수합니다 — **조회하면 자동으로 접히므로** 누를 일은 드뭅니다
  - 접힘 상태(`filterOpen`)는 **화면이 들고 있습니다.** 껍데기 안에 두면 창 폭이 바뀔 때 도로 펼쳐집니다
- **완료여부는 점 + 범례**입니다. 「상태가 2종이면 점, 3종 이상이면 배지」 규칙대로면 배지지만, **979행이 오는 목록**에서 배지를 세로로 쌓으면 표가 배지밭이 됩니다. 대신 범례를 표 위에 두고 점마다 `aria-label` 로 이름을 답니다. **검사목록(12행)에서는 규칙대로 배지**입니다 — 행이 적어 표를 덮지 않습니다
- **이상결과 L · H** 는 색만으로 구분하지 않고 **글자를 함께** 씁니다
- 헤더 행은 `sticky` 로 남기고, **페이지네이션은 스크롤 영역 밖**에 둡니다 — 몇 쪽을 보고 있었는지가 사라지면 안 됩니다

### 모바일 — 전체 화면 전환

`MobileTop` + `FilterBar` + `MobileListCard` → 카드를 누르면 **전체 화면**으로 갑니다 (「다른 화면으로 떠남 → 전체 화면」). 항목별 결과는 표가 아니라 **`Accordion`** 입니다 — 좁은 폭에 표를 넣으면 가로로 밀립니다.

조회 조건은 **PC 와 글자 하나까지 같습니다** — 390 틀이 `mode="touch"` 라 시트로 열릴 뿐입니다.

### 여기서 처음 확인된 것

- **닫는 탭이 지금 탭이면 옆 탭으로 옮깁니다** — 규칙으로만 적어두고 돌려본 적이 없었습니다
- `Tabs` · `Card` · `Accordion` · `DropdownMenu` 가 **한 화면에 함께** 놓입니다

## PC 화면 구조

```
Screen
├ Sidebar 256          접으면 72
└ Workspace            사이드바를 뺀 작업 영역
   ├ MDI TabBar 40     열린 화면 목록 (TabItem Variant=Line + Close · size=default 36 + 여백 2)
   └ Content           선택된 탭의 내용 — 탭을 바꾸면 통째로 갈림
      ├ FilterBar      조회 후 접힘 (Expanded 200 / Collapsed 56)
      └ Body           여백 24. 표 블록
```

**탭바를 Content 안에 두지 마세요.** 탭을 바꾸면 자기 자신도 갈리는 모순이 생깁니다.

12칼럼 그리드는 쓰지 않습니다. 표의 열 너비는 데이터가 정하지 그리드가 정하지 않습니다.

---

## 겪었던 함정

같은 실수를 반복하지 않기 위해 기록합니다.

### `overflow-hidden` 은 **요소 바깥에 그려지는 것**을 자릅니다

스크롤을 막거나 높이를 애니메이션하려고 넣었는데 엉뚱한 것이 딸려 잘렸습니다 (2026-08-12, 한 날에 둘).

| 어디 | 왜 넣었나 | 무엇이 잘렸나 |
|---|---|---|
| `FilterBar` 필드 패널 | 높이 애니메이션(`grid-rows 0fr↔1fr`) | 입력창 **포커스 링** `ring-[3px]` |
| `Tabs` 목록 (`scrollable`) | 세로 스크롤바 막기 | 활성 표시 2px 중 **1px** |

- **링·그림자·절대 배치 표식은 테두리 밖**에 그려집니다. 클리핑 상자는 그걸 모릅니다
- 여백이 있으면 살아남습니다 — 같은 `FilterBar` 라도 **좁을 때(`px-4 pb-4`)는 멀쩡하고 넓을 때(`p-0`)만** 잘렸습니다. 그래서 **한쪽 폭에서만 보이는 증상**이 됩니다
- 답은 둘입니다 — **자를 필요가 없을 때는 자르지 않거나**(`@pc/filter:overflow-visible`), **잘리는 것을 상자 안으로 들이거나**(`-bottom-px` → `bottom-0`)
- `Popover` · `ComboboxPanel` 처럼 **그림자를 쓰는 부품을 클리핑 상자 안에 넣을 때**도 같은 일이 생깁니다

### 누르는 줄에는 `cursor-pointer` 와 `select-none` 이 함께 갑니다

- **`select-none` 이 없으면** 두 번 누르거나 살짝 끌 때 브라우저가 글자를 잡습니다. `FilterBar` 머리줄은 누르는 순간 패널이 펼쳐져서, **선택이 새로 나타난 필드까지 번졌습니다** (2026-08-12)
- **커서는 `src/index.css` 가 한 번에 세웁니다** — Tailwind 4 부터 `<button>` 기본 커서가 `pointer` 가 아니라 `default` 라, 아무것도 안 적으면 조용히 화살표로 남습니다

  ```css
  button:not(:disabled), [role="button"], [role="tab"] { cursor: pointer }
  ```

  - **컴포넌트마다 적게 하면 반드시 빠집니다** — `<button>` 을 그리는 23개 중 **15개**가 빠져 있었고 거기에 **`Button` 자신**이 들어 있었습니다 (2026-08-12). 처음에는 사이드바만 고쳤는데 원인이 같아 전역으로 옮겼습니다
  - **`:disabled` 는 뺍니다** — 못 누르는 버튼에 손 모양이 뜨면 누를 수 있다고 읽힙니다. 못 누른다는 표시는 각 컴포넌트가 `cursor-not-allowed` 로 답니다 (유틸리티라 기본 규칙을 이깁니다)
  - `role` 로 만든 것도 함께 잡습니다 — `TabItem` 은 `<div role="tab">` 입니다
- 줄 안에 버튼이 있으면 **버튼은 자기 `onClick` 을 버리고 줄로 올려보냅니다**(버블링). 각자 갖고 있으면 두 번 토글되어 아무 일도 안 일어난 것처럼 보입니다. 버튼을 지우지 않는 이유는 **키보드와 신호** 때문입니다 — `<div>` 는 탭으로 닿지 않습니다
- 이미 그렇게 되어 있는 것 — `TabItem` · `DropdownMenuItem` · `ListItem`

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

- [x] ~~LookupPanel · LookupRow~~ — 완성형 `Lookup` 까지 (2026-08-07). **ListItem 이 아니라 자체 행**입니다 — 아래 근거
- [x] ~~AccordionItem~~ — `@radix-ui/react-accordion` (2026-08-11). 높이 애니메이션 때문에 들였습니다 — 아래 근거
- [x] ~~모바일 전용~~ — **전부 끝났습니다** (2026-08-07): MobileSheet · MobileSelect · MobileDateRangePicker · MobileListCard · MBottomTabBar · MobileTop · MobileMenuScreen (조회 조건은 `FilterBar` 한 벌로 합쳤습니다)
- [x] ~~Sidebar · SidebarItem~~ — PC GNB 완료 (2026-08-07). 모바일 전체메뉴와 **같은 `SidebarItem`** 을 씁니다
- [ ] React Hook Form + Zod 연동 예시
- [x] ~~상세 화면 예제~~ — `Example/PC 화면` · `Example/모바일 화면` (2026-08-11)

### 코드 — Radix 프리미티브가 더 필요

`shadcn` CLI 는 쓰지 않습니다. `@radix-ui/react-*` 를 하나씩 설치하고 컴포넌트는 직접 씁니다.

- [x] ~~Tooltip~~ — `@radix-ui/react-tooltip` (2026-08-07)
- [x] ~~Dialog~~ — `@radix-ui/react-dialog` (2026-08-07)
- [x] ~~Toast~~ — `@radix-ui/react-toast` (2026-08-07)
- [x] ~~Tabs~~ — **Radix 없이 만들었습니다** (2026-08-07). 근거는 아래 Tabs 절
- [x] ~~DropdownMenu~~ — `@radix-ui/react-dropdown-menu` (2026-08-11). **`ListItem` 을 쓰지 않습니다** — 아래 근거
- [x] ~~DatePicker~~ — 단일·범위 × Day·Month·Year 전부. **모바일 시트까지 끝났습니다** (2026-08-11) — `PointerModeProvider` 가 갈라 줍니다

### Figma

- [x] ~~**Publish**~~ — 2026-08-12 에 했습니다. 그날 라이브러리를 세 번 고쳤습니다: `Surface/Gray-*` 이름 맞바꿈 · `PCFilterBar` 좌우 여백 24→20 · `Marker/Checkup`·`Marker/Special` 신규
  - **라이브러리를 고치면 발행 전까지 소비 파일은 옛 값을 씁니다.** 특히 **새 변수는 아예 안 보입니다** — `Marker/*` 가 그 경우였습니다
  - Plugin API 로는 발행할 수 없습니다. Figma 앱에서 해야 합니다
- [x] ~~화면의 P·S 범례~~ — 2026-08-12. 코드는 `Marker/*` 토큰을 씁니다 (`data.ts` 의 `MARKS`)
- [ ] `Menu/Surface` · `Menu/Border` — 값은 있는데 **아무도 안 씁니다.** Popover 가 `Background/White` 를 쓰고 있어 정리 대상
- [ ] `Color/Alpha/White/0` 직접 참조 약 2,400곳 — 코드로 옮긴 7개 세트만 `Alpha/Base0` 로 정리했습니다
- [ ] ListItem 에 `Indeterminate` 값 추가 — 전체 선택 줄의 일부 선택 상태를 그릴 수 없습니다
- [ ] Collapsible · ContextMenu (중순위)
- [x] ~~상세 화면~~ — `Example` 그룹에 **목록 → 상세 흐름 전체**를 그렸습니다 (2026-08-11). PC 는 MDI 새 탭, 모바일은 전체 화면

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
- **스토리가 실제로 그려지는지는 `tsc` 로 안 걸립니다.** 훅을 컴포넌트 밖에 두거나 컨텍스트 없이 쓰면 **런타임에만** 터집니다 — `tsc -b` 도 `vite build` 도 `storybook build` 도 통과합니다. 2026-08-11 에 `Table/결과조회화면` 이 그렇게 깨졌고(모듈 최상단에 `useState`), 훑다가 `Tabs/기본` 도 원래부터 깨져 있던 걸 찾았습니다
  - 확인은 **모든 스토리의 `render` 를 SSR 로 한 번 그려 보는 것**입니다 (`react-dom/server`). `preview.tsx` 의 decorator(`PointerModeProvider` · `TooltipProvider` · `ToastProvider`)를 같이 감싸야 Provider 오류가 안 납니다. **`render` 를 직접 호출하면 안 됩니다** — 훅이 컴포넌트 밖에서 돌아 엉뚱한 오류가 납니다. `<R {...args} />` 로 그리세요
- **Controls 패널은 다섯 묶음으로 나뉩니다** — `Display` · `Content` · `State` · `Behavior` · `Events` (2026-08-11). 규칙은 `src/stories/figma.ts` 의 `argCategory` 한 곳에 있고, `preview.tsx` 의 `argTypesEnhancers` 가 모든 스토리에 한 번에 붙입니다
  - **스토리마다 `table.category` 를 적지 마세요** — 40개 파일에 흩어 놓으면 새 prop 이 늘 때마다 빠지고, 같은 이름이 파일마다 다른 묶음에 들어갑니다. 벗어나야 하는 자리에만 그 항목에 직접 적으세요 (직접 준 것이 이깁니다)
  - **`secondPass: true` 가 필요합니다** — 안 켜면 docgen 이 타입에서 뽑아내기 **전에** 돌아서, 손으로 적은 argTypes 만 묶이고 `Input` 처럼 HTML 속성을 상속해 자동으로 붙는 것들이 묶음 밖에 남습니다. 정작 어수선한 쪽이 그쪽입니다
  - 어디에도 안 걸리는 것(`className` · `container` · `aria-*`)은 **묶지 않습니다** — 묶음 밖에 남아 오히려 눈에 띕니다
- **스토리는 눌러 볼 수 있어야 합니다.** `onValueChange={() => {}}` 에 값까지 박아두면 열어서 골라도 아무 일이 없습니다 — 문서를 보러 온 사람은 당연히 눌러 봅니다
  - **에러가 붙은 예제는 특히** — 값을 넣으면 에러가 사라지는 것까지 보여야 「에러는 검증 결과로 자동」 규칙이 화면에서 설명됩니다
  - 죽은 핸들러는 **`State` · `변형` 스토리에만** 둡니다. 거기는 `readonly` · `disabled` 처럼 **모양만** 보여주는 자리입니다
  - 2026-08-11 에 `Lookup` 폼필드 · `FormField` Control(체크박스·셀렉트) · `Dialog` 폼 · `Table` 조회화면 넷을 살렸습니다. 전부 사용자가 눌러 보고 알아챈 것들입니다
- Figma 를 고치기 전에 **누가 그 토큰·컴포넌트를 쓰는지 먼저 훑습니다.** `Button/Tertiary-Fill` 은 아무도 안 써서 안전했고, `Color/Alpha/White/0` 은 2,500곳이라 범위를 좁혔습니다
