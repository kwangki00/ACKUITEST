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
62 컴포넌트 세트 · 913 변형 · 단독 컴포넌트 219(아이콘 201 포함) · 변수 787
모든 페이지에 About(개요) + Documentation(개발자용) 완비
PC · 모바일 화면 데모 완성
```

**이 코드 저장소** — 위 컴포넌트 중 21개를 옮겨 검증하는 중입니다.

```
Button · Input · InputGroup · Textarea · Select · Checkbox · Radio · Switch
CheckMark · ChoiceGroup · ToggleGroup · Badge · FormField · Table
Skeleton · Spinner · Progress · Separator · Card · CardRow · Alert
```

**Input · Selection Controls · Loading & Divider 페이지는 전부 옮겼습니다.**

Popover 가 필요한 것들(Combobox · Lookup · DatePicker · Dialog · Toast · Tooltip · DropdownMenu · Tabs · Sidebar · Accordion · Pagination)은 Radix 의존이 있어 아직 없습니다.

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
- **Disabled 는 opacity 가 아니라 토큰** — opacity 를 쓰면 겹친 요소가 비칩니다
- 툴바의 추가·편집·삭제는 `outline` 입니다. 툴바에 파란 버튼이 있으면 화면의 주 액션과 충돌합니다

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

### 코드

- [ ] Popover 기반 컴포넌트 — `npx shadcn@latest add popover dialog` 후 토큰으로 색 교체
- [ ] Combobox · Lookup · DatePicker
- [ ] 모바일 전용 컴포넌트 (MobileListCard · MobileFilterBar · MobileSheet)
- [ ] React Hook Form + Zod 연동 예시

### Figma

- [ ] **Publish** — 아직 안 했습니다. 대규모 미발행이 누적돼 있습니다
- [ ] Collapsible · ContextMenu (중순위)
- [ ] 샘플 프로젝트 — 상세 화면이 아직 없습니다 (목록에서 행을 눌렀을 때)

---

## 작업 방식

- **한글로 대화합니다.** 문서·주석도 한글입니다
- 판단이 필요한 지점에서는 **선택지와 근거를 제시**하고 결정을 기다립니다
- 컴포넌트를 만들 때는 **왜 그렇게 만들었는지를 description 에** 남깁니다. 나중에 "이거 왜 이래?" 를 줄입니다
- 문서는 **표 중심**입니다. 문장으로 길게 쓰면 안 읽힙니다
